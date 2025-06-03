# backend/app/utils/email.py
import httpx
from typing import Optional
from app.core.config import settings
from datetime import datetime

MAILGUN_BASE_URL = f"https://api.mailgun.net/v3/{settings.MAILGUN_DOMAIN}/messages"

async def send_email(
    to_email: str,
    subject: str,
    text_body: str,
    from_email: str = "info@stempro.org",
    bcc_email: str = "stemproaca@gmail.com"
) -> bool:
    """Send email using Mailgun API"""
    if not settings.MAILGUN_API_KEY or not settings.MAILGUN_DOMAIN:
        print("Mailgun not configured, skipping email send")
        return False

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                MAILGUN_BASE_URL,
                auth=("api", settings.MAILGUN_API_KEY),
                data={
                    "from": f"StemPro Academy <{from_email}>",
                    "to": [to_email],
                    "bcc": bcc_email,
                    "subject": subject,
                    "text": text_body
                }
            )
            return response.status_code == 200
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

async def send_reset_code_email(to_email: str, code: str) -> bool:
    """Send password reset code email"""
    subject = "Please don't Reply. StemPro Academy Password Reset Code"
    message = f"""Hi {to_email},

We received a request to reset your password.
Here's your 6-digit verification code:

{code}

This code will expire in 15 minutes.

To complete the password reset process:
1. Return to the password reset page
2. Enter the 6-digit code above
3. Create your new password

If you didn't request this password reset, please ignore this email or contact our support team immediately.

For security reasons, please don't share this code with anyone.

Best regards,
StemPro Academy Support Team

This is an automated message, please do not reply to this email."""

    return await send_email(to_email, subject, message)

async def send_password_reset_confirmation(to_email: str) -> bool:
    """Send password reset confirmation email"""
    subject = "Password Reset Confirmation"
    message = f"""Dear {to_email},

Your password has been reset successfully.

If you did not request this change, please contact us immediately at info@stempro.org.

Thank you and wish you success in your learning journey.

StemPro Academy"""

    return await send_email(to_email, subject, message)

async def send_enrollment_confirmation(to_email: str, name: str, course: str) -> bool:
    """Send course enrollment confirmation email"""
    subject = f"Thank you for registering {course} at StemPro Academy!"
    message = f"""Dear {name},

Thank you for registering for {course} at StemPro Academy. We are excited to have you as part of our learning community.

We will get in touch with you soon with more details about the course schedule and next steps.

Meanwhile, if you have any questions, please feel free to contact us at info@stempro.org or call 425-230-0688.

Best regards,

Yong Ma
Principal
StemPro Academy"""

    return await send_email(to_email, subject, message)

async def send_schedule_confirmation(to_email: str, name: str) -> bool:
    """Send schedule consultation confirmation email"""
    subject = "We Look Forward to Meeting With You!"
    message = f"""Dear {name},

We have received your request for a free consultation! Our team will get in touch with you soon to schedule a convenient time.

We look forward to discussing how StemPro Academy can help you achieve your educational goals.

Thank you and wish you success in your learning journey.

Best regards,

Yong Ma
Principal
StemPro Academy"""

    return await send_email(to_email, subject, message)

async def send_welcome_email(to_email: str, name: str, role: str) -> bool:
    """Send welcome email after user registration"""
    subject = "Welcome to StemPro Academy!"
    message = f"""Dear {name},

Welcome to StemPro Academy! We are thrilled to have you join our learning community as a {role}.

Your account has been successfully created. You can now:
- Browse our courses and programs
- Enroll in courses that interest you
- Schedule consultations with our expert instructors
- Access exclusive resources and materials

If you have any questions or need assistance, please don't hesitate to reach out to us at info@stempro.org or call 425-230-0688.

We look forward to supporting you on your STEM education journey!

Best regards,

Yong Ma
Principal
StemPro Academy"""

    return await send_email(to_email, subject, message)


# Add these functions to your existing email.py file

async def send_schedule_confirmation(email: str, first_name: str):
    """Send confirmation email for schedule request"""
    subject = "Schedule Request Received - AI Academy"
    body = f"""
    Dear {first_name},

    Thank you for scheduling a consultation with AI Academy!

    We have received your schedule request and our team will review it shortly.
    You can expect to hear from us within 1-2 business days to confirm your consultation time.

    If you have any urgent questions, please don't hesitate to contact us.

    Best regards,
    AI Academy Team
    """

    # Implement your email sending logic here
    # Example: await send_email(email, subject, body)
    print(f"Sending schedule confirmation to {email}")

async def send_schedule_update_notification(email: str, first_name: str, scheduled_date: datetime):
    """Send notification when consultation is scheduled"""
    subject = "Your Consultation is Scheduled - AI Academy"

    # Format the date nicely
    formatted_date = scheduled_date.strftime("%B %d, %Y at %I:%M %p")

    body = f"""
    Dear {first_name},

    Great news! Your consultation with AI Academy has been scheduled.

    Consultation Date & Time: {formatted_date}

    We look forward to discussing how our AI programs can help you achieve your goals.

    Important reminders:
    - Please be available at the scheduled time
    - Prepare any questions you'd like to discuss
    - Have a stable internet connection for the video call

    If you need to reschedule, please contact us at least 24 hours in advance.

    Best regards,
    AI Academy Team
    """

    # Implement your email sending logic here
    # Example: await send_email(email, subject, body)
    print(f"Sending schedule update to {email} for {formatted_date}")