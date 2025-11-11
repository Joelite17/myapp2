# accounts/utils.py
from django.core.mail import send_mail
from django.conf import settings

FRONTEND_URL = "http://localhost:5173"  # React app URL

def send_password_reset_email(user, token):
    """
    Send password reset email with React frontend link
    """
    reset_url = f"{FRONTEND_URL}/reset-password?uid={user.pk}&token={token}"
    subject = "Reset your password"
    message = (
        f"Hi {user.username},\n\n"
        f"Reset your password by visiting the following link:\n\n"
        f"{reset_url}\n\n"
        f"If you didn't request this, you can ignore this email."
    )
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
