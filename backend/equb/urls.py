# equb/urls.py
from rest_framework import routers
from django.urls import path, include
from .views import (EqubGroupViewSet, MembershipViewSet, ContributionViewSet, PayoutViewSet, ResetPasswordView,
                    RegisterView, DashboardView,AccountViewSet,JoinRequestViewSet, VerifyEmailView,CustomTokenObtainPairView,ResendVerificationView,
                    superuser_public_groups,superuser_create_group,superuser_public_groups_summary,superuser_user_balances,superuser_balance)
from rest_framework_simplejwt.views import TokenRefreshView

router = routers.DefaultRouter()
router.register(r"groups", EqubGroupViewSet, basename="groups")
router.register(r"memberships", MembershipViewSet, basename="memberships")
router.register(r"contributions", ContributionViewSet, basename="contributions")
router.register(r"payouts", PayoutViewSet, basename="payouts")
router.register(r"account", AccountViewSet, basename="account")
router.register(r'join-requests', JoinRequestViewSet, basename='join-request')

urlpatterns = [
    path("", include(router.urls)),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"), 
    path("superuser/public-groups/", superuser_public_groups, name="superuser_public_groups"),
    path("superuser/public-groups/create/", superuser_create_group, name="superuser_create_group"),
    path("superuser/public-groups/summary/", superuser_public_groups_summary, name="superuser_public_groups_summary"),
    path("superuser/users/balances/", superuser_user_balances, name="superuser_user_balances"),
    path('superuser/balance/', superuser_balance, name='superuser-balance'),
    path('auth/verify-email/<str:token>/', VerifyEmailView.as_view(), name='verify-email'),
    path('auth/resend-verification/', ResendVerificationView.as_view(), name='resend-verification'),
    path('auth/reset-password/', ResetPasswordView.as_view(), name='reset-password'),

]
