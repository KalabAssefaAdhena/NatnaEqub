import ssl
from django.conf import settings
from django.core.mail import EmailMessage, get_connection

def send_password_reset_email(user, uid, token):
    """
    Sends a plain text password reset email.
    """
    reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
    subject = "Reset Your Natna Equb Password"
    message = f"""
Hello {user.username},

You requested a password reset for your Natna Equb account.

Click this link to reset your password:
{reset_url}

If you did not request this, please ignore this email.
"""

    connection = get_connection(
        host=settings.EMAIL_HOST,
        port=settings.EMAIL_PORT,
        username=settings.EMAIL_HOST_USER,
        password=settings.EMAIL_HOST_PASSWORD,
        use_tls=True,
        fail_silently=False
    )
    connection.ssl_context = ssl._create_unverified_context()  # dev only

    email = EmailMessage(
        subject=subject,
        body=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
        connection=connection
    )
    email.send(fail_silently=False)


def send_verification_email(user, token):
    """
    Sends a plain text verification email.
    """
    verify_url = f"{settings.FRONTEND_URL}/verify-email/{token}/"
    subject = "Verify Your Natna Equb Account"
    message = f"""
Welcome {user.username}!

Thank you for registering with Natna Equb.

Please verify your account by clicking this link:
{verify_url}

If you did not create an account, please ignore this email.
"""

    connection = get_connection(
        host=settings.EMAIL_HOST,
        port=settings.EMAIL_PORT,
        username=settings.EMAIL_HOST_USER,
        password=settings.EMAIL_HOST_PASSWORD,
        use_tls=True,
        fail_silently=False
    )
    connection.ssl_context = ssl._create_unverified_context()  # dev only

    email = EmailMessage(
        subject=subject,
        body=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
        connection=connection
    )
    email.send(fail_silently=False)
