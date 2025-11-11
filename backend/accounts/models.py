# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # By default AbstractUser already has: username, first_name, last_name, email, password, is_active, is_staff, ...
    # Add a flag that marks whether the email was verified
    email_confirmed = models.BooleanField(default=False)

    def __str__(self):
        return self.username
