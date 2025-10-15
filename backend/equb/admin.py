# equb/admin.py
from django.contrib import admin
from .models import EqubGroup, Membership, Contribution, Payout, Account

@admin.register(EqubGroup)
class EqubGroupAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_by", "contribution_amount", "created_at")

@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "group", "joined_at", "order_index")

@admin.register(Contribution)
class ContributionAdmin(admin.ModelAdmin):
    list_display = ("id", "membership", "amount", "date")

@admin.register(Payout)
class PayoutAdmin(admin.ModelAdmin):
    list_display = ("id", "group", "recipient", "amount", "date", "cycle_number")

@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ("user", "balance","is_verified")
    search_fields = ("user__username",)
