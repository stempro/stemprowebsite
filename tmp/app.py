from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash, send_file
import zipfile
from functools import wraps
#from google.oauth2 import id_token
import requests as py_requests
#from google.auth.transport import requests
from werkzeug.security import check_password_hash, generate_password_hash

from dotenv import load_dotenv
import os, re
import random
from msal import ConfidentialClientApplication
from datetime import datetime, timedelta, timezone

from flask import Flask
# from flask_mail import Mail, Message

from flask import session, g
import pandas as pd


load_dotenv()
if os.getenv("ENVIRONMENT") != "production":
    load_dotenv()
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
TENANT_ID = os.getenv("TENANT_ID")

MAILGUN_API_KEY = os.getenv("MAILGUN_API_KEY")
MAILGUN_DOMAIN = os.getenv("MAILGUN_DOMAIN")

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

############ azure ############################
AUTHORITY = f"https://login.microsoftonline.com/{TENANT_ID}"
REDIRECT_PATH = "/get_token"  # Redirect URI path
SCOPE = ["Calendars.ReadWrite", "User.Read"]
SCOPE = ["https://graph.microsoft.com/.default"]
#####################################
# Initialize MSAL Confidential Client
msal_app = ConfidentialClientApplication(
    CLIENT_ID,
    authority=AUTHORITY,
    client_credential=CLIENT_SECRET
)

from scripts import db
from scripts import store_registeration

app = Flask(__name__, static_url_path='/static')
app.secret_key = os.getenv("APP_SECRET_KEY")
#app.secret_key = os.urandom(24)

EMAIL_REGEX = re.compile(r'^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$', re.IGNORECASE)
#################################### azure calendar ############################################
@app.route(REDIRECT_PATH)
def authorized_azure_code():
    code = request.args.get('code')
    if not code:
        return "Authorization failed. No code received."

    # Exchange the code for tokens
    result = msal_app.acquire_token_by_authorization_code(
        code,
        scopes=SCOPE,
        redirect_uri=url_for('authorized_azure', _external=True)
    )
    if "access_token" in result:
        session['access_token'] = result['access_token']
        return redirect(url_for('calendar'))
    else:
        return "Login failed. " + str(result.get("error_description"))


def authorized_azure():
    result = msal_app.acquire_token_for_client(scopes=SCOPE)
    if "access_token" in result:
        return result['access_token']
    else:
        raise Exception("Could not acquire access token.")

@app.route('/calendar_azure')
def calendar_azure():
    if 'access_token' not in session and 11==112:
        return redirect(url_for('login'))

    headers = {'Authorization': 'Bearer ' + session['access_token']}
    events = py_requests.get('https://graph.microsoft.com/v1.0/me/calendar/events', headers=headers).json()

    return render_template('calendar_azure.html', events=events['value'])

@app.route('/schedule_azure_experiment', methods=['GET', 'POST'])
def schedule_azure_experiment():

    authorized_azure()

    if 'access_token' not in session and 11==112:
        return redirect(url_for('login'))

    if request.method == 'POST':
        # Create an event
        event_data = {
            "subject": request.form['subject'],
            "start": {
                "dateTime": request.form['start'],
                "timeZone": "UTC"
            },
            "end": {
                "dateTime": request.form['end'],
                "timeZone": "UTC"
            }
        }
        headers = {'Authorization': 'Bearer ' + session['access_token'], 'Content-Type': 'application/json'}
        response = py_requests.post('https://graph.microsoft.com/v1.0/me/calendar/events', headers=headers, json=event_data)

        if response.status_code == 201:
            return "Event created successfully!"
        else:
            return "Failed to create event: " + response.text

    return render_template('schedule_azure.html')

@app.route('/schedule_azure', methods=['POST','GET'])
def schedule_azure():
    if request.method == 'POST':
        # Create an event
        event_data = {
            "subject": request.form['subject'],
            "start": {
                "dateTime": request.form['start'],
                "timeZone": "UTC"
            },
            "end": {
                "dateTime": request.form['end'],
                "timeZone": "UTC"
            }
        }

        # Acquire access token using the Client Credentials Flow
        access_token = authorized_azure()

        # Use the access token to create the event in the specified calendar
        headers = {
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        }

        # Specify the calendar ID (e.g., a shared or service account calendar)
        calendar_id = "yong.ma@stempro.org"  # Replace with the calendar ID/email

        # Send the request to Microsoft Graph to create the event
        response = py_requests.post(
            f'https://graph.microsoft.com/v1.0/users/{calendar_id}/events',
            headers=headers,
            json=event_data
        )

        # Check if the event was created successfully
        if response.status_code == 201:
            return "Event created successfully!"
        else:
            return f"Failed to create event: {response.status_code} - {response.text}"

    elif request.method == 'GET':
        return render_template('schedule_azure.html')

@app.route('/logout')
def logout():
    session.pop('user_email', None)  # Remove user email from the session
    flash("You have been logged out", "info")
    return redirect(url_for('programs'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Handle form submission
        email = request.form.get('email')
        password = request.form.get('password')

        # Check if user exists in the database
        user = db.get_user_by_email_cosmos(email)
        if user:
            if check_password_hash(user['password_hash'], password):
                # Successful login
                session['user_email'] = user['email']
                return redirect(url_for('programs'))  # Redirect to a dashboard or home page
            else:
                # Incorrect password
                return render_template('login.html', error="Invalid password.", email=email)
        else:
            # Email not found
            return render_template('login.html', error="Email not registered.")

    # For GET requests, render the login form
    return render_template('login.html')

# Pass user_logged_in to templates
@app.context_processor
def inject_user_status():
    return {'user_logged_in': 'user_email' in session}

####################################### end login ############################################

@app.route('/auth/google')
def google_auth():
    # The googleLogin() function in the HTML will handle the Firebase authentication.
    # No server-side processing here is necessary for login initiation.
    return redirect(url_for('login'))

####################################### reset pw ############################################
# Route to render the reset password page
@app.route('/reset_password', methods=['GET', 'POST'])
def reset_password():
    if request.method == 'POST':
        email = request.form.get('email' )
        email = email.lower()  # Normalize email to lowercase
        reset_code = request.form.get('reset_code')
        new_password = request.form.get('new_password')
        repeat_password = request.form.get('repeat_password')

        # Add your code validation and password reset logic here
        if new_password == repeat_password:
            db.reset_password_cosmos(email, new_password)
            # Check if reset_code is valid, and proceed with password update
            flash("Your password has been reset successfully.")
            send_email_general(email,email, "reset_password")
            return redirect(url_for('login'))
        else:
            flash("Passwords do not match. Please try again.")
    else:
        email = request.args.get('email', '')
        email = email.lower()  # Normalize email to lowercase
    return render_template('reset_password.html', email=email)


#@app.route('/generate_code', methods=['POST'])
@app.route('/generate_code', methods=['POST'])
def generate_code():
    code = f"{random.randint(100000, 999999)}"  # Generate a random 6-digit code
    session['reset_code'] = code  # Store code in session for later verification
    session['code_expiration'] = datetime.now(timezone.utc) + timedelta(minutes=15)  # Set expiration time to 5 minutes from now

    email = request.args.get('email') or request.json.get('email')
    if not email:
        return jsonify({"error": "Email address is required"}), 400

        # Send the code via SendGrid
    try:
        send_email(email, code)
    except Exception as e:
        print(f"Failed to send email: {e}")
        return jsonify({"error": "Failed to send email"}), 500

    # In a real application, you'd also send this code to the user's email
    return jsonify({"message": "Code generated and sent to email"}), 200

@app.route('/verify_code', methods=['POST'])
def verify_code():
    # Retrieve code from request JSON
    entered_code = request.json.get('code')

    # Ensure reset code and expiration are in the session
    stored_code = session.get('reset_code')
    expiration_time = session.get('code_expiration')

    # Check if reset code or expiration time is missing
    if not stored_code or not expiration_time:
        return jsonify({"match": False, "error": "Invalid session data"}), 400

    # Convert expiration_time to datetime if stored as string
    if isinstance(expiration_time, str):
        expiration_time = datetime.fromisoformat(expiration_time)

    # Ensure expiration time is timezone-aware for comparison
    current_time = datetime.now(timezone.utc)
    if current_time > expiration_time:
        return jsonify({"match": False, "error": "Code expired"}), 400

    # Check if entered code matches the stored code
    if entered_code == stored_code:
        return jsonify({"match": True, "error": ""}), 200
    else:
        return jsonify({"match": False, "error": "Code doesnot match. Please try again"}), 200

####################################### end reset pw ############################################

###################################### zoho email ############################################

MAILGUN_BASE_URL = f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages"
def send_email(to_email,code):
    ##to_email = "stemproaca@gmail.com"  # Replace with actual recipient's email
    subject = "Please don't Reply. StemPro Academy Password Reset Code"
    message = f"""
Hi {to_email},

We received a request to reset your password.
Here's your 6-digit verification code:

{code}

This code will expire in 15 minutes.
To complete the password reset process:

Return to the password reset page
Enter the 6-digit code above
Create your new password

If you didn't request this password reset, please ignore this email or contact our support team immediately.
For security reasons, please don't share this code with anyone.

Best regards,
StemPro Academy Support Team

This is an automated message, please do not reply to this email.
"""
    response = py_requests.post(
        MAILGUN_BASE_URL,
        auth=("api", MAILGUN_API_KEY),
        data={
            "from": f"Info <yong.ma@{MAILGUN_DOMAIN}>",
            "to": [to_email],
            "bcc": "stemproaca@gmail.com",
            "subject": subject,
            "text": message
        }
    )
    return response

def send_email_general(to_email,name, action, content1=None):
    #to_email = "stemproaca@gmail.com"  # Replace with actual recipient's email

    if action == "register":
        subject = f"Thank you for registering {content1} to StemPro Academy!"
        message = f"""
        Dear {name},

        Thank you for registering to StemPro Academy. We are excited to have you as part of our learning community.

        We will get in touch with you soon. Meanwhile, if you have any questions, please feel free to contact us.

        Yong Ma
        Principal
        StemPro Academy
        """
    elif action == "schedule":
        subject = "We Look Forward to Meeting With You!"
        message = f"""
        Dear {name},

        We have received your request for a free consultation! Our team will get in touch with you soon.

        Thanks you and wish you success in your learning journey.

        Yong Ma
        Principal
        StemPro Academy
        """
    elif action == "inquiry":
        subject = "Thank you for your inquiry!"
        message = f"""
        Dear {name},

        Thank you for your inquiry. We will get back to you soon.

        Thanks you and wish you success in your learning journey.

        Yong Ma
        Principal
        StemPro Academy
        """
    elif action == "reset_password":
        subject = "Password Reset Confirmation"
        message = f"""
        Dear {name},

        Your password has been reset successfully.

        If you did not request this change, please contact us immediately.

        Thanks you and wish you success in your learning journey.

        StemPro Academy
        """
    response = py_requests.post(
        MAILGUN_BASE_URL,
        auth=("api", MAILGUN_API_KEY),
        data={
            "from": f"Info <yong.ma@{MAILGUN_DOMAIN}>",
            "to": [to_email],
            "bcc": "stemproaca@gmail.com",
            "subject": subject,
            "text": message
        }
    )
    return response

def send_enroll_email(to_email,name,role, country):
    #to_email = "stemproaca@gmail.com"  # Replace with actual recipient's email
    subject = "Thank you for enrolling to StemPro Academy!"
    message = f"""
    Dear {name},

    Thank you for enrolling to StemPro Academy. We are excited to have you as part of our learning community.

    You registered as a {role} from {country}.

    Thanks you and wish you success in your learning journey.

    Yong Ma
    Principal
    StemPro Academy
    """
    response = py_requests.post(
        MAILGUN_BASE_URL,
        auth=("api", MAILGUN_API_KEY),
        data={
            "from": f"Info <info@{MAILGUN_DOMAIN}>",
            "to": [to_email],
            "bcc": "stemproaca@gmail.com",
            "subject": subject,
            "text": message
        }
    )
    return response

##################################### end zoho email ############################################

@app.route('/send_test_email')
def send_test_email():
    to_email = "stemproaca@gmail.com"  # Replace with actual recipient's email
    subject = "Hello from Mailgun and Flask!"
    message = "This is a test email sent from a Flask app using Mailgun."

    response = send_email(to_email, 1234)

    if response.status_code == 200:
        return jsonify({"message": "Email sent successfully!"}), 200
    else:
        return jsonify({"error": "Failed to send email", "details": response.json()}), response.status_code

###################################### end zoho email ############################################

@app.route('/')
def index():
    return render_template('programs.html')  # Public landing page

###############################################################################

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:  # Check for 'user' instead of 'firebase_user'
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/login')
def login_page():
    return render_template('login.html')


@app.route('/courses')
def courses():
    return render_template('courses.html' )

@app.route('/programs')
def programs():
    return render_template('programs.html' )

@app.route('/colleges')
def colleges():
    return render_template('colleges.html' )

@app.route('/success')
def success():
    return render_template('success.html' )

@app.route('/privacy')
def privacy():
    return render_template('privacy.html' )

@app.route('/terms')
def terms():
    return render_template('terms.html' )

@app.route('/joinus')
def joinus():
    return render_template('joinus.html' )

@app.route('/resources')
def resources():
    return render_template('resources.html' )

@app.route('/about')
def about():
    return render_template('about.html' )  # The about page


# Registration page route
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Capture form data
        first_name = request.form['first_name']
        last_name = request.form['last_name']
        student_type = request.form['student_type']  # "I am a" dropdown selection
        email = request.form['email']
        course = request.form['course']  # "Select Course" dropdown selection
        country = request.form['country']  # Country dropdown selection
        zip_code = request.form['zip_code']  # Zip/Postal Code
        comments = request.form['comments']  # Multiline text box for additional comments

        db.save_register_to_dbcosmos(first_name, last_name, student_type, email, course, country, zip_code, comments)

        send_email_general(email,first_name, "register", course)

        return redirect(url_for('thankyou',heading=f"{first_name}: Thank You for Registering!", message=f"We have received your registration for {course}. Our team will get in touch with you soon."))


    return render_template('register.html')

@app.route('/schedule', methods=['GET', 'POST'])
def schedule():
    if request.method == 'POST':
        # Capture form data from schedule form
        first_name = request.form['first_name']
        last_name = request.form['last_name']
        email = request.form['email']
        phone = request.form['phone']
        zip_code = request.form['zip_code']
        student_type = request.form['student_type']
        country = request.form['country']
        comments = request.form['comments']

        db.save_schedule_to_dbcosmos(first_name, last_name, email, phone, zip_code, student_type, country, comments)
        send_email_general(email,first_name, "schedule")

        # Redirect to thank you page with a customized message
        return redirect(url_for(
            'thankyou',
            heading="We Look Forward to Meeting With You!",
            message="We have received your request for a free consultation! Our team will get in touch with you soon."
        ))

    # Render the schedule form for GET requests
    return render_template('schedule.html')

# Thank you page route
@app.route('/thankyou')
def thankyou():
    thank_you_heading = request.args.get('heading', 'Thank You!')
    thank_you_message = request.args.get('message', 'Thank you for your submission.')
    return render_template('thankyou.html', heading=thank_you_heading, message=thank_you_message)
    #return render_template('thankyou.html')

@app.route('/auth/callback')
def auth_callback():
    # Get the ID token from the request
    token = request.args.get('credential')

    if token:
        try:
            # Verify the token with Google's OAuth2 API
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)

            # Extract user information
            user_id = idinfo['sub']  # Unique Google user ID
            user_email = idinfo['email']
            user_name = idinfo.get('name', '')

            # Store user info in session
            session['user'] = {
                'id': user_id,
                'email': user_email,
                'name': user_name
            }

            # Redirect the user to a secure page (e.g., dashboard)
            return redirect(url_for('dashboard'))

        except ValueError:
            # Invalid token; handle the error
            return redirect(url_for('login'))

    return redirect(url_for('login'))

@app.route('/dashboard')
def dashboard():
    # Check if the user is logged in
    if 'user' in session:
        user = session['user']
        return f"Welcome to your dashboard, {user['email']}!"
    elif 'user_email' in session:
        return f"Welcome {session['user_email']}!"

    # Redirect to login if neither 'user' nor 'user_email' is in session
    return redirect(url_for('login'))

############################ enroll page ########################################
@app.route("/check_email", methods=["POST"])
def check_email():
    """
    API endpoint to check if an email exists in the Cosmos DB.

    Returns:
        JSON: {"email_taken": bool}
    """
    email = request.json.get("email", "").strip().lower()  # Normalize email
    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        # Use the function from the db module
        email_taken = db.is_email_taken_cosmos(email)
        return jsonify({"email_taken": email_taken})
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500


@app.route("/check_email", methods=["POST"])
def check_email_cosmos():
    email = request.json.get("email")
    email = email.lower()  # Normalize email to lowercase
    conn = sqlite3.connect(db.DATABASE)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()
    return jsonify({"email_taken": bool(user)})


#################### enrollment ########################################
@app.route("/enroll", methods=["GET", "POST"])
def enroll():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        role = request.form.get("role")
        country = request.form.get("country")
        postal_code = request.form.get("postal_code")
        comments = request.form.get("comments")
        password = request.form.get("password")

        # Generate hashed password
        password_hash = generate_password_hash(password)

        # # Save to SQLite database
        # db.save_user_to_db(DB_NAME, name, email, role, country, postal_code, comments, password_hash)

        # conn = sqlite3.connect(DB_NAME)
        # cursor = conn.cursor()
        # email = email.lower()  # Normalize email to lowercase
        try:
            # Save to SQLite database
            # db.save_user_to_db(name, email, role, country, postal_code, comments, password_hash)
            db.save_user_to_dbcosmos(name, email, role, country, postal_code, comments, password_hash)

            # cursor.execute('''
            #     INSERT INTO users (name, email, role, country, postal_code, comments, password_hash)
            #     VALUES (?, ?, ?, ?, ?, ?, ?)
            # ''', (name, email, role, country, postal_code, comments, password_hash))
            # conn.commit()

            send_enroll_email(email,name,role, country)

            return redirect(url_for("thankyou", heading='Welcome to StemPro Academy',  message="Thank you for enrolling!"))

        except exceptions.CosmosHttpResponseError as e:
            print(f"Cosmos DB HTTP Error: {e.message}")
            return "An error occurred while processing your enrollment. Please try again."
        except Exception as e:
            print(f"Unexpected error: {e}")
            return "An unexpected error occurred. Please try again."

    # Render the enrollment form for GET requests
    return render_template("enroll.html")


@app.route('/download-db', methods=['GET', 'POST'])
def download_db():
    # Only allow logged-in users
    if not session.get('logged_in'):
        return redirect(url_for('login'))

    if request.method == 'POST':
        supercode = request.form.get('supercode')
        if supercode == "dafasfljadfdasf":  # Check for correct supercode
            # Connect to the database
            conn = sqlite3.connect(sqlite3.connect)
            cursor = conn.cursor()

            # Retrieve all table names
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = [table[0] for table in cursor.fetchall()]

            # Export each table to a CSV file
            csv_files = []
            os.makedirs('data', exist_ok=True)
            for table_name in tables:
                query = f"SELECT * FROM {table_name}"
                df = pd.read_sql(query, conn)

                # Save each table as a CSV file in the 'data' directory
                csv_file_path = os.path.join('data', f"{table_name}.csv")
                df.to_csv(csv_file_path, index=False)
                csv_files.append(csv_file_path)

            conn.close()

            # If only one table, download directly; otherwise, zip for download
            if len(csv_files) == 1:
                return send_file(csv_files[0], as_attachment=True)
            else:
                # Create a zip file of all CSVs

                zip_path = os.path.join('data', 'all_tables.zip')
                with zipfile.ZipFile(zip_path, 'w') as zipf:
                    for file in csv_files:
                        zipf.write(file, os.path.basename(file))
                return send_file(zip_path, as_attachment=True)

        else:
            flash("Invalid supercode.")
            return redirect(url_for('download_db'))

    return render_template('download_db.html')

#################### end download data ########################################
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000 )

# if __name__ == "__main__":
#     app.run(host='0.0.0.0', port=8000, debug=True)
#     # app.run(debug=True)
#     gunicorn -w 4 -b 0.0.0.0:8000 app:app
