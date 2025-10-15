from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (
    EqubGroup,
    Membership,
    Contribution,
    Payout,
    Account,
    JoinRequest,
)
from django.db.models import Sum
from .emails import send_password_reset_email  
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        if not self.user.is_superuser:
            if not getattr(self.user.account, "is_verified", False):
                raise serializers.ValidationError({
                    "non_field_errors": ["Email not verified."]
                })

        return data


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ["id", "balance", "is_verified"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name",'is_superuser')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "password")

    def create(self, validated_data):
        user = User(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", "")
        )
        user.set_password(validated_data["password"])
        user.save()

        token = user.account.generate_verification_token()

        send_password_reset_email(user)

        return user


class EqubGroupSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    members_count = serializers.IntegerField(source="memberships.count", read_only=True)

    class Meta:
        model = EqubGroup
        fields = (
            "id",
            "code",              
            "name",
            "description",
            "created_by",
            "created_at",
            "contribution_amount",
            "cycle_days",
            "members_count",
            "max_members",
            "service_fee_percentage",     
        )


class MembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    total_contributed = serializers.SerializerMethodField()

    class Meta:
        model = Membership
        fields = ("id", "user", "group", "joined_at", "order_index", "total_contributed")
        read_only_fields = ("joined_at", "order_index", "user")

    def get_total_contributed(self, obj):
        group = obj.group
        current_cycle = group.current_cycle
        return obj.contributions.filter(cycle_number=current_cycle).aggregate(total=Sum("amount"))["total"] or 0


class ContributionSerializer(serializers.ModelSerializer):
    membership = MembershipSerializer(read_only=True)
    membership_id = serializers.PrimaryKeyRelatedField(
        queryset=Membership.objects.all(),
        write_only=True,
        source="membership"
    )

    class Meta:
        model = Contribution
        fields = ("id", "membership", "membership_id", "amount", "date", "note")
        read_only_fields = ("date",)


class PayoutSerializer(serializers.ModelSerializer):
    recipient = UserSerializer(read_only=True)
    recipient_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        source="recipient"
    )

    class Meta:
        model = Payout
        fields = ("id", "group", "recipient", "recipient_id", "amount", "date", "cycle_number")
        read_only_fields = ("date",)


class GroupDetailSerializer(serializers.ModelSerializer):
    memberships = MembershipSerializer(many=True, read_only=True)
    payouts = PayoutSerializer(many=True, read_only=True)
    current_user_id = serializers.SerializerMethodField()
    total_contributions = serializers.SerializerMethodField()
    current_user_balance = serializers.SerializerMethodField()
    created_by_id = serializers.IntegerField(source="created_by.id", read_only=True)
    latest_winner = serializers.SerializerMethodField()  # 🆕 add this

    class Meta:
        model = EqubGroup
        fields = (
            "id",
            "code",  
            "name",
            "description",
            "created_by",
            "created_by_id",
            "created_at",
            "contribution_amount",
            "cycle_days",
            "current_cycle",
            "memberships",
            "rotation_started",
            "max_members",
            "payouts",
            "is_finished",
            "current_user_id",
            "total_contributions",
            "current_user_balance",
            "latest_winner",
            "service_fee_percentage",
        )

    def get_current_user_id(self, obj):
        request = self.context.get("request", None)
        return request.user.id if request and hasattr(request, "user") else None

    def get_total_contributions(self, obj):
        res = Contribution.objects.filter(
            membership__group=obj,
            cycle_number=obj.current_cycle
        ).aggregate(total=Sum("amount"))
        return res["total"] or 0

    def get_current_user_balance(self, obj):
        request = self.context.get("request", None)
        if not request or not hasattr(request, "user"):
            return 0
        account, _ = Account.objects.get_or_create(user=request.user)
        return account.balance
    
    def get_latest_winner(self, obj):
        """Return the most recent payout winner."""
        last_payout = obj.payouts.order_by("-cycle_number").first()
        if last_payout:
            return {
                "username": last_payout.recipient.username,
                "amount": last_payout.amount,
                "cycle_number": last_payout.cycle_number,
            }
        return None


class JoinRequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    group = EqubGroupSerializer(read_only=True)

    class Meta:
        model = JoinRequest
        fields = ["id", "user", "group", "status", "requested_by_creator", "created_at"]

