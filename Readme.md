# StemPro Academy - Modern Full-Stack Application

A modern web application for StemPro Academy built with Next.js, FastAPI, Chakra UI, and Zustand.

## 🚀 Features

- **User Management**: Registration, login, password reset with email verification
- **Course Enrollment**: Browse and enroll in AI/programming courses
- **Schedule Consultations**: Book free evaluation sessions
- **Admin Dashboard**: Manage users, enrollments, and schedules
- **Responsive Design**: Mobile-friendly UI with Chakra UI and Tailwind CSS
- **File-based Storage**: JSON file storage for easy deployment
- **JWT Authentication**: Secure token-based authentication
- **Email Integration**: Mailgun integration for transactional emails

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **UI Libraries**: Chakra UI + Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI
- **Authentication**: JWT with python-jose
- **Password Hashing**: bcrypt
- **Data Storage**: JSON files with file locking
- **Email**: Mailgun API

## 📋 Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose (optional)

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/stempro-academy.git
cd stempro-academy
```

### 2. Set up environment variables
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your configuration
# Required: MAILGUN_API_KEY and MAILGUN_DOMAIN
```

### 3. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend
uvicorn app.main:app --reload --port 8000
```

### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

### 5. Using Docker (Alternative)
```bash
# From the root directory
docker-compose up
```

## 🏗️ Project Structure

```
stempro-academy/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # Pages and layouts
│   │   ├── components/      # Reusable components
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities
│   │   ├── services/       # API services
│   │   ├── store/          # Zustand stores
│   │   └── types/          # TypeScript types
│   └── ...
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Core configurations
│   │   ├── models/         # Pydantic models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   └── data/               # JSON file storage
└── docker-compose.yml       # Docker configuration
```

## 🔐 Default Admin Account

Create an admin account by:
1. Register a regular account
2. Manually edit `backend/data/users.json`
3. Set `"is_admin": true` for your user

## 📱 Available Pages

### Public Pages
- `/` - Home page
- `/courses` - Browse AI courses
- `/programs` - View special programs
- `/about` - About StemPro Academy
- `/success-stories` - Student achievements
- `/login` - User login
- `/register` - User registration
- `/enroll` - Course enrollment form
- `/schedule` - Schedule consultation

### Protected Pages
- `/dashboard` - User dashboard
- `/profile` - Edit profile
- `/admin` - Admin dashboard (admin only)
- `/admin/users` - Manage users
- `/admin/enrollments` - Manage enrollments
- `/admin/schedules` - Manage schedules

## 🚀 Deployment to Azure

### Backend Deployment
1. Create an Azure App Service (Linux, Python 3.11)
2. Configure environment variables in Azure
3. Deploy using Git or GitHub Actions
4. Set startup command: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app`

### Frontend Deployment
1. Build the Next.js app: `npm run build`
2. Deploy to Azure Static Web Apps or App Service
3. Configure environment variables
4. Set up custom domain (optional)

### Database Persistence
- For production, mount Azure File Storage to `/app/data`
- Or migrate to Azure Cosmos DB for better scalability

## 🔧 API Documentation

Once the backend is running, visit:
- API docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📧 Email Configuration

The application uses Mailgun for sending emails. Configure your Mailgun credentials in the `.env` file:

```env
MAILGUN_API_KEY=your-api-key
MAILGUN_DOMAIN=your-domain.mailgun.org
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Contact

StemPro Academy
- Email: info@stempro.org
- Phone: 425-230-0688
- Website: https://www.stempro.org

---

Built with ❤️ by StemPro Academy