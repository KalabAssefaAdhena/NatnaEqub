from django.urls import path
from .views import ChapaInitiate, ChapaUnifiedWebhook,PaymentListAPIView,ChapaWithdrawInitiate, WithdrawalListAPIView,payment_return,transaction_status

urlpatterns = [
    path("chapa/initiate/", ChapaInitiate.as_view(), name="chapa-initiate"),
    path("chapa/webhook/", ChapaUnifiedWebhook.as_view(), name="chapa-webhook"),
    path("list/", PaymentListAPIView.as_view(), name="payment-list"),
    
    
    path("return/", payment_return, name="payment-return"),
    path("transaction-status/", transaction_status, name="transaction-status"),

    path("withdraw/initiate/", ChapaWithdrawInitiate.as_view(), name="withdraw-initiate"),
    path("withdraw/webhook/", ChapaUnifiedWebhook.as_view(), name="withdraw-webhook"),
    path("withdraw/list/", WithdrawalListAPIView.as_view(), name="withdraw-list"),
]
