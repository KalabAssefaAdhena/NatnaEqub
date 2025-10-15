import random
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid
from django.db.models.signals import post_save
from django.dispatch import receiver



@receiver(post_save, sender=User)
def create_user_account(sender, instance, created, **kwargs):
    if created:
        Account.objects.create(user=instance)


class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="account")
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    
    is_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=64, blank=True, null=True)
    token_expiration = models.DateTimeField(blank=True, null=True)

    def generate_verification_token(self, hours_valid=24):
        token = uuid.uuid4().hex  
        self.verification_token = token
        self.token_expiration = timezone.now() + timezone.timedelta(hours=hours_valid)
        self.save()
        return token

    def __str__(self):
        return f"{self.user.username} - Balance: {self.balance}"


class EqubGroup(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="equb_groups")
    created_at = models.DateTimeField(auto_now_add=True)
    contribution_amount = models.DecimalField(max_digits=10, decimal_places=2)
    cycle_days = models.IntegerField(default=30)
    current_cycle = models.IntegerField(default=1)
    is_finished = models.BooleanField(default=False)
    max_members = models.PositiveIntegerField(default=10) 
    code = models.CharField(max_length=10, unique=True, editable=False)  
    rotation_started = models.BooleanField(default=False)  
    current_winner = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="won_equb_groups")
    service_fee_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00,help_text="Percentage of the total pot the creator takes as a service fee.")



    def save(self, *args, **kwargs):
        if not self.code:
            
            while True:
                random_code = f"E{random.randint(10000, 99999)}"
                if not EqubGroup.objects.filter(code=random_code).exists():
                    self.code = random_code
                    break
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.code})"


class Membership(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="memberships")
    group = models.ForeignKey(EqubGroup, on_delete=models.CASCADE, related_name="memberships")
    joined_at = models.DateTimeField(auto_now_add=True)
    order_index = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "group")

    def __str__(self):
        return f"{self.user.username} in {self.group.name}"


class Contribution(models.Model):
    membership = models.ForeignKey(Membership, on_delete=models.CASCADE, related_name="contributions")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(default=timezone.now)
    note = models.TextField(blank=True)
    cycle_number = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.membership.user.username} contributed {self.amount} to {self.membership.group.name}"


class Payout(models.Model):
    group = models.ForeignKey(EqubGroup, on_delete=models.CASCADE, related_name="payouts")
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payouts")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    cycle_number = models.IntegerField()

    def __str__(self):
        return f"Cycle {self.cycle_number}: {self.recipient.username} got {self.amount}"



class JoinRequest(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("declined", "Declined"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="join_requests")
    group = models.ForeignKey(EqubGroup, on_delete=models.CASCADE, related_name="join_requests")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    requested_by_creator = models.BooleanField(default=False)  # False = user requested, True = creator invited
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "group")

    def __str__(self):
        actor = "Creator" if self.requested_by_creator else "User"
        return f"{actor}→{self.user.username} for {self.group.code} ({self.status})"

