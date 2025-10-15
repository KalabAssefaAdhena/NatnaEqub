from django.contrib.auth.models import User
from django.db import transaction, IntegrityError
from rest_framework import viewsets, generics, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import models
from django.utils import timezone
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_bytes
import ssl
from django.core.mail import EmailMessage, get_connection
from django.conf import settings
from decimal import Decimal




from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

import random
from decimal import Decimal


from .models import EqubGroup, Membership, Contribution, Payout, Account, JoinRequest
from .serializers import (UserSerializer ,RegisterSerializer,
                          EqubGroupSerializer, MembershipSerializer,
                          ContributionSerializer, PayoutSerializer,GroupDetailSerializer, AccountSerializer, JoinRequestSerializer)
from .permissions import IsGroupCreatorOrReadOnly
from .forms import UserRegisterForm
from .emails import send_password_reset_email, send_verification_email 

@api_view(["GET"])
@permission_classes([IsAdminUser])
def superuser_public_groups(request):
    groups = EqubGroup.objects.filter(created_by=request.user)
    serializer = EqubGroupSerializer(groups, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAdminUser])
def superuser_create_group(request):
    """
    Superuser creates a public group
    """
    serializer = EqubGroupSerializer(data=request.data)
    if serializer.is_valid():
        group = serializer.save(created_by=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def superuser_public_groups_summary(request):
    total_public_groups = EqubGroup.objects.filter(created_by=request.user).count()
    total_user_created_equb = EqubGroup.objects.exclude(created_by=request.user).count()
    total_held = Contribution.objects.aggregate(total=models.Sum("amount"))["total"] or 0

    data = {
        "total_public_groups": total_public_groups,
        "total_user_created_equb": total_user_created_equb,
        "total_held": total_held,
    }
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def superuser_user_balances(request):
    users = User.objects.all()
    balances = []

    for user in users:
        total_contributed = (
            Contribution.objects.filter(membership__user=user)
            .aggregate(total=models.Sum("amount"))
            .get("total")
            or 0
        )
        balances.append({
            "user_id": user.id,
            "username": user.username,
            "balance": total_contributed,
        })

    return Response(balances)

@api_view(["GET"])
@permission_classes([IsAdminUser])
def superuser_balance(request):
    """
    Returns the superuser's account balance.
    """
    user = request.user
    acct = getattr(user, "account", None)
    if acct is None:
        acct = Account.objects.create(user=user, balance=0)
    return Response({
        "user_id": user.id,
        "username": user.username,
        "is_superuser": user.is_superuser,
        "balance": float(acct.balance)
    })





class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class ResetPasswordView(APIView):
    permission_classes = ()  

    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not all([uid, token, new_password]):
            return Response(
                {"message": "uid, token, and new_password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            uid = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({"message": "Invalid uid"}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"message": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)

class ResendVerificationView(APIView):
    """
    Sends verification email to unverified users or password reset for verified users.
    """
    permission_classes = ()  

    def post(self, request):
        username = request.data.get("username")
        if not username:
            return Response({"message": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)

            if not user.account.is_verified:
                user.account.generate_verification_token()
                send_password_reset_email(user)
                return Response(
                    {"message": "Verification email sent. Check your inbox!"},
                    status=status.HTTP_200_OK
                )
            else:
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

                connection = get_connection(
                    host=settings.EMAIL_HOST,
                    port=settings.EMAIL_PORT,
                    username=settings.EMAIL_HOST_USER,
                    password=settings.EMAIL_HOST_PASSWORD,
                    use_tls=True,
                    fail_silently=False
                )
                connection.ssl_context = ssl._create_unverified_context()  

                email = EmailMessage(
                    subject="Reset your password",
                    body=f"Click this link to reset your password: {reset_link}",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[user.email],
                    connection=connection
                )
                email.send(fail_silently=False)

                return Response(
                    {"message": "Password reset email sent. Check your inbox!"},
                    status=status.HTTP_200_OK
                )

        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class VerifyEmailView(APIView):
    """
    Activates a user account if the verification token is valid and not expired.
    Handles already-verified accounts gracefully.
    """

    def get(self, request, token, *args, **kwargs):
        try:
            account = Account.objects.get(verification_token=token)
        except Account.DoesNotExist:
            account = Account.objects.filter(is_verified=True).first()
            if account:
                return Response({"message": "Email already verified."}, status=status.HTTP_200_OK)
            return Response({"message": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)

        if account.token_expiration < timezone.now():
            return Response({"message": "Token expired."}, status=status.HTTP_400_BAD_REQUEST)

        account.is_verified = True
        account.verification_token = None
        account.token_expiration = None
        account.save()

        return Response({"message": "Email verified successfully!"}, status=status.HTTP_200_OK)

class AccountViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["post"])
    def topup(self, request):
        amount = request.data.get("amount")
        try:
            amount = Decimal(amount)
        except:
            return Response({"detail": "Invalid amount"}, status=400)
        if amount <= 0:
            return Response({"detail": "Amount must be positive"}, status=400)

        account = request.user.account
        account.balance += amount
        account.save(update_fields=["balance"])
        return Response(AccountSerializer(account).data)

    @action(detail=False, methods=["post"])
    def withdraw(self, request):
        amount = request.data.get("amount")
        try:
            amount = Decimal(amount)
        except:
            return Response({"detail": "Invalid amount"}, status=400)
        if amount <= 0:
            return Response({"detail": "Amount must be positive"}, status=400)

        account = request.user.account
        if account.balance < amount:
            return Response({"detail": "Insufficient balance"}, status=400)

        account.balance -= amount
        account.save(update_fields=["balance"])
        return Response(AccountSerializer(account).data)

    @action(detail=False, methods=["get"])
    def me(self, request):
        account = request.user.account
        return Response(AccountSerializer(account).data)

    @action(detail=False, methods=["get"], permission_classes=[IsAdminUser])
    def all_accounts(self, request):
        from django.contrib.auth.models import User
        accounts = []
        for user in User.objects.all():
            acct = getattr(user, "account", None)
            if acct:
                accounts.append({
                    "user_id": user.id,
                    "username": user.username,
                    "balance": float(acct.balance)
                })
        return Response(accounts)

class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        form = UserRegisterForm(request.data)
        if form.is_valid():
            user = User.objects.create_user(
                username=form.cleaned_data["username"],
                email=form.cleaned_data["email"],
                first_name=form.cleaned_data["first_name"],
                last_name=form.cleaned_data["last_name"],
                password=form.cleaned_data["password"]
            )

            token = user.account.generate_verification_token()

            send_verification_email(user, token)

            serializer = RegisterSerializer(user)
            return Response({
                "user": serializer.data,
                "message": "Verification email sent. Please check your inbox."
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

class EqubGroupViewSet(viewsets.ModelViewSet):
    queryset = EqubGroup.objects.all().order_by("-created_at")
    serializer_class = EqubGroupSerializer
    permission_classes = [IsGroupCreatorOrReadOnly]

    def perform_create(self, serializer):
        group = serializer.save(created_by=self.request.user)
        Membership.objects.create(user=self.request.user, group=group, order_index=0)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def join(self, request, pk=None):
        """
        User requests to join group → creates a JoinRequest.
        """
        group = self.get_object()
        if Membership.objects.filter(user=request.user, group=group).exists():
            return Response({"detail": "Already a member."}, status=200)

        if group.rotation_started:
            return Response({"detail": "Cannot join. Rotation already started."}, status=400)


        join_request, created = JoinRequest.objects.get_or_create(
            user=request.user,
            group=group,
            defaults={"requested_by_creator": False}
        )
        if not created:
            return Response({"detail": "Request already exists."}, status=400)

        return Response({"detail": "Join request sent successfully!"}, status=201)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def public_groups(self, request):
        """
        Lists all public groups created by superusers that user hasn't joined yet.
        """
        joined_ids = Membership.objects.filter(user=request.user).values_list("group_id", flat=True)
        groups = EqubGroup.objects.filter(created_by__is_superuser=True).exclude(id__in=joined_ids)
        serializer = EqubGroupSerializer(groups, many=True)
        return Response(serializer.data)
    

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def public_groups_all(self, request):
        """
        Returns all public groups created by superusers (regardless of joined or not)
        """
        groups = EqubGroup.objects.filter(created_by__is_superuser=True)
        serializer = EqubGroupSerializer(groups, many=True)
        return Response(serializer.data)


    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated])
    def members(self, request, pk=None):
        group = self.get_object()
        memberships = group.memberships.select_related("user").all()
        serializer = MembershipSerializer(memberships, many=True)
        return Response(serializer.data)
    

    @action(detail=True, methods=["get"], permission_classes=[AllowAny])
    def details(self, request, pk=None):
        """
        Returns detailed info about the group including memberships, payouts, etc.
        Public groups can be viewed by anyone.
        """
        group = self.get_object()
        serializer = GroupDetailSerializer(group, context={"request": request})
        return Response(serializer.data)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def rotate(self, request, pk=None):
        group = self.get_object()

        if request.user != group.created_by and not request.user.is_superuser:
            return Response({"detail": "Not authorized"}, status=403)

        memberships = list(group.memberships.select_related("user"))
        total_members = len(memberships)

        if total_members == 0:
            return Response({"detail": "No members to rotate."}, status=400)

        current_cycle = group.current_cycle
        missing_contributors = []
        for m in memberships:
            has_contributed = Contribution.objects.filter(
                membership=m, cycle_number=current_cycle
            ).exists()
            if not has_contributed:
                missing_contributors.append(m.user.username)

        if missing_contributors:
            return Response(
                {
                    "detail": "Not all members have contributed for this cycle.",
                    "missing": missing_contributors,
                },
                status=400,
            )

        if not group.rotation_started:
            group.rotation_started = True
            group.save(update_fields=["rotation_started"])

        already_won_ids = set(group.payouts.values_list("recipient_id", flat=True))
        eligible_members = [m for m in memberships if m.user.id not in already_won_ids]

        if not eligible_members:
            group.is_finished = True
            group.save(update_fields=["is_finished"])
            return Response(
                {
                    "detail": "Rotation ended. All members have won once.",
                    "is_finished": True,
                    "group": GroupDetailSerializer(group, context={"request": request}).data,
                },
                status=200,
            )

        winner = random.choice(eligible_members)
        winner_user = winner.user

        with transaction.atomic():
            total_pot = group.contribution_amount * total_members

            service_fee = (group.service_fee_percentage / 100) * total_pot
            winner_amount = total_pot - service_fee

            payout = Payout.objects.create(
                group=group,
                recipient=winner_user,
                amount=winner_amount,
                cycle_number=current_cycle,
            )

            winner_account, _ = Account.objects.get_or_create(user=winner_user)
            winner_account.balance += winner_amount
            winner_account.save(update_fields=["balance"])

            if service_fee > 0:
                creator_share = service_fee *  Decimal("0.9")
                superuser_share = service_fee * Decimal("0.1")

                creator_account, _ = Account.objects.get_or_create(user=group.created_by)
                creator_account.balance += creator_share
                creator_account.save(update_fields=["balance"])

                superuser_account, _ = Account.objects.get_or_create(user__is_superuser=True)
                superuser_account.balance += superuser_share
                superuser_account.save(update_fields=["balance"])

            group.current_cycle += 1
            group.current_winner = winner_user

            if len(already_won_ids) + 1 >= total_members:
                group.is_finished = True

            group.save(update_fields=["current_cycle", "is_finished", "current_winner"])

        return Response(
            {
                "winner": {"id": winner_user.id, "username": winner_user.username},
                "cycle": group.current_cycle,  
                "is_finished": group.is_finished,
                "group": GroupDetailSerializer(group, context={"request": request}).data,
            },
            status=200,
        )

    
    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def reset_rotation_flag(self, request, pk=None):
        group = self.get_object()
        group.rotation_started = False
        group.current_winner = None
        group.save(update_fields=["rotation_started", "current_winner"])
        return Response({"detail": "Rotation reset successful"})






class MembershipViewSet(viewsets.ModelViewSet):
    queryset = Membership.objects.select_related("user", "group").all()
    serializer_class = MembershipSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    

class ContributionViewSet(viewsets.ModelViewSet):
    queryset = Contribution.objects.select_related(
        "membership", "membership__user", "membership__group"
    ).all().order_by("-date")
    serializer_class = ContributionSerializer
    permission_classes = [IsAuthenticated]
    def create(self, request, *args, **kwargs):
        group_id = request.data.get("group")
        if not group_id:
            return Response({"detail": "Group ID is required."}, status=400)
        try:
            membership = Membership.objects.get(user=request.user, group_id=group_id)
        except Membership.DoesNotExist:
            return Response({"detail": "You are not a member of this group."}, status=403)
        group = membership.group
        current_cycle = group.current_cycle
        if Contribution.objects.filter(membership=membership, cycle_number=current_cycle).exists():
            return Response({"detail": "You have already contributed this cycle."}, status=400)
        amount = group.contribution_amount
        account, _ = Account.objects.get_or_create(user=request.user)
        if account.balance < amount:
            return Response({"detail": "Insufficient balance."}, status=400)
        with transaction.atomic():
            account.balance -= amount
            account.save()
            contribution = Contribution.objects.create(
                membership=membership,
                amount=amount,
                note=request.data.get("note", ""),
                cycle_number=current_cycle
            )
        serializer = self.get_serializer(contribution)
        return Response({
            "contribution": serializer.data,
            "balance": account.balance
        }, status=status.HTTP_201_CREATED)





class JoinRequestViewSet(viewsets.ModelViewSet):
    queryset = JoinRequest.objects.all()
    serializer_class = JoinRequestSerializer
    permission_classes = [IsAuthenticated]


    def list(self, request, *args, **kwargs):
        """
        Return three distinct lists:
         - received:  invitations the logged-in user RECEIVED (creator invited them)
         - sent:      invitations the logged-in user SENT to others (creator -> invited user)
         - my_requests: join requests this user SENT to other groups (user requested to join)
        """
        user = request.user

        received = JoinRequest.objects.filter(user=user, requested_by_creator=True)

        invitations_sent = JoinRequest.objects.filter(group__created_by=user, requested_by_creator=True)

        my_requests = JoinRequest.objects.filter(user=user, requested_by_creator=False)

        return Response({
            "received": JoinRequestSerializer(received, many=True).data,
            "sent": JoinRequestSerializer(invitations_sent, many=True).data,
            "my_requests": JoinRequestSerializer(my_requests, many=True).data,
        })

    @action(detail=True, methods=["patch"])
    def approve(self, request, pk=None):
        join_request = self.get_object()

        if join_request.requested_by_creator:
            if join_request.user != request.user:
                return Response({"detail": "Only invited user can approve."}, status=403)
        else:
            if join_request.group.created_by != request.user:
                return Response({"detail": "Only group creator can approve."}, status=403)

        join_request.status = "approved"
        join_request.save()
        Membership.objects.get_or_create(user=join_request.user, group=join_request.group)
        return Response({"detail": "Approved and user added."})

    @action(detail=True, methods=["patch"])
    def decline(self, request, pk=None):
        join_request = self.get_object()

        if join_request.requested_by_creator:
            if join_request.user != request.user:
                return Response({"detail": "Only invited user can decline."}, status=403)
        else:
            if join_request.group.created_by != request.user:
                return Response({"detail": "Only group creator can decline."}, status=403)

        join_request.status = "declined"
        join_request.save()
        return Response({"detail": "Request declined."})

    @action(detail=False, methods=["get"])
    def requests_to_my_groups(self, request):
        """
        Returns join requests from other users to groups created by the logged-in user
        """
        user = request.user
        requests = JoinRequest.objects.filter(group__created_by=user, requested_by_creator=False)
        serializer = JoinRequestSerializer(requests, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=["post"])
    def request_join(self, request):

        user = request.user
        group_code = request.data.get("group_code")

        if not group_code:
            return Response({"detail": "group_code is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            group = EqubGroup.objects.get(code=group_code)
        except EqubGroup.DoesNotExist:
            return Response({"detail": "Group not found."}, status=status.HTTP_404_NOT_FOUND)

        if group.created_by == user:
            return Response({"detail": "You are the creator of this group."}, status=status.HTTP_400_BAD_REQUEST)
        
        

        if Membership.objects.filter(user=user, group=group).exists():
            return Response({"detail": "You are already a member of this group."}, status=status.HTTP_400_BAD_REQUEST)

        if JoinRequest.objects.filter(user=user, group=group, status="pending").exists():
            return Response({"detail": "You already have a pending join request for this group."}, status=status.HTTP_400_BAD_REQUEST)

        if group.max_members and group.memberships.count() >= group.max_members:
            return Response({"detail": "Group is full."}, status=status.HTTP_400_BAD_REQUEST)
        
        if group.rotation_started:
            return Response({"detail": "Cannot join. Rotation already started."}, status=400)


        try:
            with transaction.atomic():
                jr = JoinRequest.objects.create(
                    user=user,
                    group=group,
                    requested_by_creator=False,
                    status="pending"
                )
        except IntegrityError:
            return Response({"detail": "Join request already exists."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {"detail": "Join request sent successfully.", "request": JoinRequestSerializer(jr).data},
            status=status.HTTP_201_CREATED
        )
    @action(detail=False, methods=["get"])
    def my_requests(self, request):
        """
        Returns all join requests that the user sent to join groups (requested_by_creator=False),
        including pending, approved, and declined, so history is preserved.
        """
        user = request.user
        my_requests = JoinRequest.objects.filter(user=user, requested_by_creator=False).select_related("group")
        serializer = JoinRequestSerializer(my_requests, many=True)
        return Response(serializer.data)


    @action(detail=False, methods=["post"])
    def invite(self, request):
        username = request.data.get("username")
        group_id = request.data.get("group_id")
        if not username or not group_id:
            return Response({"detail": "Username and group_id required."}, status=400)

        try:
            group = EqubGroup.objects.get(id=group_id, created_by=request.user)
        except EqubGroup.DoesNotExist:
            return Response({"detail": "You are not the creator of this group."}, status=403)

        try:
            invited_user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)

        join_request, created = JoinRequest.objects.get_or_create(
            user=invited_user, group=group, defaults={"requested_by_creator": True}
        )
        if not created:
            return Response({"detail": "Invitation already exists."}, status=400)

        return Response({"detail": f"Invitation sent to {username}."}, status=201)


class PayoutViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Payout.objects.select_related("recipient", "group").all().order_by("-date")
    serializer_class = PayoutSerializer
    permission_classes = [IsAuthenticated]

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        account, _ = Account.objects.get_or_create(user=user)

        memberships = Membership.objects.filter(user=user).select_related("group__created_by")
        groups = [m.group for m in memberships]

        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_superuser": user.is_superuser,
        }

        data = {
            "user": user_data,
            "account": AccountSerializer(account).data,
            "groups": EqubGroupSerializer(groups, many=True).data,
            "memberships": MembershipSerializer(memberships, many=True).data,
        }
        return Response(data)
