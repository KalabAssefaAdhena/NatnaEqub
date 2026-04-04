from django.db import models

class Payment(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PAID", "Paid"),
        ("FAILED", "Failed"),
    ]

    tx_ref = models.CharField(max_length=50, unique=True)
    user_email = models.EmailField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="PENDING")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.tx_ref} - {self.status}"


class Withdrawal(models.Model):
    user_email = models.EmailField()
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    account_number = models.CharField(max_length=18)  # <- new
    bank_code = models.CharField(max_length=10)       # <- new
    status = models.CharField(
        max_length=10,
        choices=[("PENDING","Pending"),("PAID","Paid"),("FAILED","Failed")],
        default="PENDING"
    )
    tx_ref = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_email} - {self.tx_ref} - {self.status}"
