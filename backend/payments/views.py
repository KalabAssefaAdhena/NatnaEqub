from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.conf import settings
from django.db import transaction
from uuid import uuid4
from decimal import Decimal
from .chapa_client import initialize_payment, verify_payment,initialize_withdrawal
from .models import Payment,Withdrawal
from .serializers import PaymentSerializer,WithdrawalSerializer

from django.shortcuts import redirect
from equb.models import Account
from django.contrib.auth.models import User


class PaymentListAPIView(generics.ListAPIView):
    queryset = Payment.objects.all().order_by("-created_at")
    serializer_class = PaymentSerializer

    # Optional: filter by status via query param ?status=PAID
    def get_queryset(self):
        qs = super().get_queryset()
        status = self.request.query_params.get("status")
        if status:
            qs = qs.filter(status=status.upper())
        return qs

class ChapaInitiate(APIView):
    permission_classes = [IsAuthenticated]  # only logged-in users can deposit

    def post(self, request):
        data = request.data
        tx_ref = f"EQB-{uuid4().hex[:10]}"

        # Get user info from the request.user
        user = request.user
        first_name = user.first_name or "Unknown"
        last_name = user.last_name or "User"
        email = user.email

        # Create Payment entry with PENDING status
        payment = Payment.objects.create(
            tx_ref=tx_ref,
            user_email=email,
            amount=data.get("amount", 0),
            first_name=first_name,
            last_name=last_name,
            status="PENDING"
        )

        # Initialize Chapa payment
        result = initialize_payment(
            email=email,
            amount=payment.amount,
            first_name=first_name,
            last_name=last_name,
            tx_ref=tx_ref,
            custom_data={"purpose": "equb payment"},
        )

        if result.get("status") == "success":
            return Response({
                "tx_ref": tx_ref,
                "checkout_url": result["data"]["checkout_url"]
            })
        return Response(result, status=400)
    




def payment_return(request):
    tx_ref = request.GET.get("trx_ref") or request.GET.get("tx_ref")
    status = request.GET.get("status")

    # Redirect to React frontend
    frontend_return_url = f"{settings.FRONTEND_URL}/payments/return?tx_ref={tx_ref}&status={status or ''}"
    return redirect(frontend_return_url)


@api_view(['GET'])
def transaction_status(request):
    tx_ref = request.GET.get('tx_ref')
    if not tx_ref:
        return Response({"error": "tx_ref is required"}, status=400)

    payment = Payment.objects.filter(tx_ref=tx_ref).first()
    if payment:
        serializer = PaymentSerializer(payment)
        return Response({"type": "payment", **serializer.data})

    withdrawal = Withdrawal.objects.filter(tx_ref=tx_ref).first()
    if withdrawal:
        serializer = WithdrawalSerializer(withdrawal)
        return Response({"type": "withdrawal", **serializer.data})

    return Response(None)



class ChapaWithdrawInitiate(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data

        # Validate required fields
        required_fields = ["account_number", "bank_code", "amount"]
        for field in required_fields:
            if not data.get(field):
                return Response({"error": f"{field} is required"}, status=400)

        # Get user's account
        try:
            user_account = user.account
        except Account.DoesNotExist:
            return Response({"error": "User account not found"}, status=404)

        # Check balance
        try:
            amount = Decimal(data["amount"])
        except:
            return Response({"error": "Invalid amount"}, status=400)

        if user_account.balance < amount:
            return Response({"error": "Insufficient balance"}, status=400)

        tx_ref = f"WDL-{uuid4().hex[:10]}"

        # Save withdrawal in DB
        withdrawal = Withdrawal.objects.create(
            tx_ref=tx_ref,
            user_email=user.email,
            first_name=user.first_name or "Natna",
            last_name=user.last_name or "Equb",
            amount=amount,
            status="PENDING",
            account_number=data["account_number"],
            bank_code=data["bank_code"],
        )

        # Initialize transfer (to Chapa)
        result = initialize_withdrawal(
            account_name=f"{withdrawal.first_name} {withdrawal.last_name}",
            account_number=withdrawal.account_number,
            bank_code=withdrawal.bank_code,
            amount=float(withdrawal.amount),
            reference=tx_ref,
            custom_data={"purpose": "withdrawal"},
        )



        
        if result.get("status") == "success":
            return Response({
                "tx_ref": tx_ref,
                "message": "Withdrawal initiated",
                "data": result.get("data")
            }, status=200)

        return Response(result, status=400)




class WithdrawalListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        withdrawals = Withdrawal.objects.all().order_by("-created_at")
        data = [
            {
                "tx_ref": w.tx_ref,
                "email": w.user_email,
                "amount": float(w.amount),
                "status": w.status,
                "created_at": w.created_at
            } for w in withdrawals
        ]
        return Response(data)
    



class ChapaUnifiedWebhook(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Optional: verify webhook signature
        #signature = request.headers.get("Chapa-Signature")
        #if signature != settings.CHAPA_SECRET_HASH:
        #    return Response({"error": "Unauthorized"}, status=401)

        



        tx_ref = request.data.get("tx_ref") or request.data.get("reference")
        status = request.data.get("status")



        if not tx_ref or not status:
            return Response({"error": "Missing tx_ref or status"}, status=400)

        try:
            with transaction.atomic():
                # Handle Payments (Deposits)
                payment = Payment.objects.select_for_update().filter(tx_ref=tx_ref).first()
                if payment:
                    if status == "success" and payment.status != "PAID":
                        payment.status = "PAID"
                        # Get user account
                        user = User.objects.get(email=payment.user_email)
                        user_account, _ = Account.objects.get_or_create(user=user)
                        user_account.balance += payment.amount
                        user_account.save()
                    elif status != "success":
                        payment.status = "FAILED"
                    payment.save()
                    return Response({"message": "Payment webhook processed"}, status=200)

                # Handle Withdrawals (Payouts)
                withdrawal = Withdrawal.objects.select_for_update().filter(tx_ref=tx_ref).first()

                if withdrawal:
                    if status == "success" and withdrawal.status != "PAID":
                        withdrawal.status = "PAID"
                        user = User.objects.get(email=withdrawal.user_email)
                        user_account, _ = Account.objects.get_or_create(user=user)
                        user_account.balance -= withdrawal.amount
                        user_account.save()
                    elif status == "failed":
                        withdrawal.status = "FAILED"
                    withdrawal.save()
                    return Response({"message": "Withdrawal webhook processed"}, status=200)

                # If no transaction found
                return Response({"error": "Transaction not found"}, status=404)

        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)