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


async def send_job_application_confirmation(email: str, name: str, position: str):
    """Send confirmation email to job applicant"""
    subject = f"Application Received - {position} at StemPro Academy"
    body = f"""
    Dear {name},

    Thank you for your interest in joining StemPro Academy as a {position}!

    We have received your application and our hiring team will review it carefully.
    You can expect to hear from us within 5-7 business days if your qualifications
    match our requirements.

    In the meantime, feel free to explore our website to learn more about our mission
    and the impact we're making in STEM education.

    Thank you for considering StemPro Academy as your next career opportunity.

    Best regards,
    StemPro Academy Hiring Team
    """

    # Implement your email sending logic here
    # Example: await send_email(email, subject, body)
    print(f"Sending job application confirmation to {email}")

async def send_job_application_notification(name: str, position: str, email: str):
    """Send notification to admin about new job application"""
    subject = f"New Job Application - {position}"
    body = f"""
    New job application received:

    Applicant: {name}
    Position: {position}
    Email: {email}
    Date: {datetime.now().strftime("%Y-%m-%d %H:%M")}

    Please log in to the admin panel to review the application.

    Best regards,
    StemPro Academy System
    """

    # Send to admin email
    admin_email = "hr@stempro.org"  # or get from settings
    # Example: await send_email(admin_email, subject, body)
    print(f"Sending job application notification to admin about {name}'s application")

# Add these functions to your existing email.py file

async def send_collegeninja_student_confirmation(email: str, name: str):
    """Send confirmation email to CollegeNinja student/parent signup"""
    subject = "Welcome to CollegeNinja - Early Access Confirmed!"
    body = f"""
    Dear {name},

    Thank you for signing up for early access to CollegeNinja!

    We're thrilled to have you join our revolutionary college planning platform.
    CollegeNinja will transform how students navigate the college application process
    with AI-powered recommendations, smart timeline planning, and expert guidance.

    What's Next:
    - We'll add you to our early access list
    - You'll receive exclusive updates about our launch
    - Be among the first to experience CollegeNinja when we go live in Q2 2025

    In the meantime, explore our other programs at StemPro Academy to get a head start
    on your college preparation journey.

    Stay tuned for exciting updates!

    Best regards,
    The CollegeNinja Team
    StemPro Academy
    """

    # Implement your email sending logic here
    print(f"Sending CollegeNinja student confirmation to {email}")

async def send_collegeninja_counselor_confirmation(email: str, name: str):
    """Send confirmation email to CollegeNinja counselor signup"""
    subject = "CollegeNinja Partnership - Thank You for Your Interest!"
    body = f"""
    Dear {name},

    Thank you for your interest in partnering with CollegeNinja!

    We're excited about the possibility of working together to revolutionize
    college planning and admissions guidance. As a counselor partner, you'll
    have access to cutting-edge AI tools and resources to better serve your students.

    Partnership Benefits:
    - Early access to our AI-powered platform
    - Professional development opportunities
    - Collaboration with our expert team
    - Tools to enhance your counseling practice

    Our partnership team will review your information and contact you within
    5-7 business days to discuss next steps and explore how we can work together.

    We look forward to partnering with you!

    Best regards,
    The CollegeNinja Team
    StemPro Academy
    """

    # Implement your email sending logic here
    print(f"Sending CollegeNinja counselor confirmation to {email}")

async def send_collegeninja_admin_notification(signup_type: str, name: str, email: str, grade_level: str = None):
    """Send notification to admin about new CollegeNinja signup"""
    subject = f"New CollegeNinja {signup_type.title()} Signup"

    if signup_type == "student":
        body = f"""
        New CollegeNinja student/parent signup:

        Name: {name}
        Email: {email}
        Grade Level: {grade_level}
        Date: {datetime.now().strftime("%Y-%m-%d %H:%M")}

        Please add them to the early access list and follow up as needed.
        """
    else:
        body = f"""
        New CollegeNinja counselor partnership inquiry:

        Name: {name}
        Email: {email}
        Date: {datetime.now().strftime("%Y-%m-%d %H:%M")}

        Please review and reach out to discuss partnership opportunities.
        """

    # Send to admin email
    admin_email = "collegeninja@stempro.org"  # or get from settings
    # Example: await send_email(admin_email, subject, body)
    print(f"Sending CollegeNinja admin notification about {name}'s signup")