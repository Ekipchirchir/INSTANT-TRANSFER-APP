from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.

class UserAccount(AbstractUser):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    date_joined = models.DateField(auto_now_add=True)

    USERNAME_FIELD = 'email'  # Ensures login is via email
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
    
class Wallet(models.Model):
    user = models.OneToOneField(UserAccount, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    currency = models.ForeignKey('Currency', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} - Balance{self.balance}"


class Currency(models.Model):
    #for managing different currencies if need be

    code = models.CharField(max_length=10, unique=True) # USD, EUR, KES
    name = models.CharField(max_length=50) #US Dollar, Kenyan Shillings
    exchange_rate = models.DecimalField(max_digits=10, decimal_places=4, default=1.000) #conversion rate to base currency

    def __str__(self):
        return f"{self.code} - {self.name}"

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('deposit', 'DEPOSIT'),
        ('withdraw', 'WITHDRAW'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.ForeignKey(Currency, on_delete=models.SET_NULL, null=True, blank=True)  # ✅ Can be null
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default="Pending")

    def __str__(self):
        currency_code = self.currency.code if self.currency else "No Currency"  # ✅ Fix Here
        return f"{self.user.username} - {self.transaction_type} - {self.amount} {currency_code}"
