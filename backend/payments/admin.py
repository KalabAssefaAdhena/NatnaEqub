from django.contrib import admin
from .models import Payment,Withdrawal

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("tx_ref", "user_email", "amount", "status", "created_at", "updated_at")
    list_filter = ("status", "created_at")
    search_fields = ("tx_ref", "user_email", "first_name", "last_name")
    readonly_fields = ("tx_ref", "created_at", "updated_at")

@admin.register(Withdrawal)
class WithdrawalAdmin(admin.ModelAdmin):
    list_display = ("tx_ref", "user_email", "amount", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("tx_ref", "user_email", "first_name", "last_name")
    readonly_fields = ("tx_ref", "created_at")