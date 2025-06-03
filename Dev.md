# 🚀 Quick Reference - Development Commands

## Initial Setup (One Time)

### macOS/Linux
```bash
# Make scripts executable
chmod +x setup.sh dev.sh test.sh

# Run setup
./setup.sh
```

### Windows
```cmd
# Run setup
setup.bat
```

### Manual Setup
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env

# Frontend
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

## 🏃‍♂️ Daily Development

### Start Both Servers

#### Option 1: Using Scripts
```bash
# macOS/Linux
./dev.sh

# Windows
dev.bat

# Using Make
make dev
```

#### Option 2: Manual (Two Terminals)
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### Option 3: VS Code Tasks
- Press `Ctrl+Shift+B`
- Select "Run Full Stack"

#### Option 4: Docker
```bash
docker-compose up
```

## 🧪 Testing

### Run All Tests
```bash
# Using script
./test.sh

# Using Make
make test
```

### Backend Tests Only
```bash
cd backend
source venv/bin/activate
pytest -v

# With coverage
pytest --cov=app --cov-report=html
```

### Frontend Tests Only
```bash
cd frontend
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

## 🔍 Common Tasks

### Create Admin User
```bash
# Option 1: Using Make
make create-admin

# Option 2: Manual
1. Register a user at http://localhost:3000/register
2. Edit backend/data/users.json
3. Change "is_admin": false to "is_admin": true
4. Restart backend server
```

### Reset Database
```bash
# Using Make
make db-reset

# Manual
rm backend/data/*.json
# Restart backend
```

### API Testing
```bash
# Open API docs
open http://localhost:8000/docs

# Or use VS Code REST Client
# Create a .http file and click "Send Request"
```

### Type Checking
```bash
# Frontend
cd frontend
npx tsc --noEmit

# Backend (optional)
cd backend
mypy app/
```

## 📝 VS Code Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Terminal | `` Ctrl+` `` |
| Split Terminal | `Ctrl+Shift+5` |
| Run Task | `Ctrl+Shift+B` |
| Debug | `F5` |
| Command Palette | `Ctrl+Shift+P` |
| Quick Fix | `Ctrl+.` |
| Format Document | `Shift+Alt+F` |
| Go to Definition | `F12` |
| Find All References | `Shift+F12` |

## 🌐 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Documentation | http://localhost:8000/docs |
| API ReDoc | http://localhost:8000/redoc |

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Clear Cache/Reset
```bash
# Frontend
rm -rf .next node_modules
npm install

# Backend
rm -rf __pycache__ venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### CORS Issues
1. Check `FRONTEND_URL` in backend `.env`
2. Clear browser cache
3. Use incognito mode

## 📦 Build for Production

### Frontend Build
```bash
cd frontend
npm run build
npm start  # Test production build
```

### Backend Production
```bash
cd backend
# Update requirements
pip freeze > requirements.txt

# Run with gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up --build
```

## 🎯 Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/your-feature

# Create pull request on GitHub
```

## 📚 File Structure Quick Reference

```
stempro-academy/
├── frontend/
│   ├── src/
│   │   ├── app/        # Pages
│   │   ├── components/ # Reusable components
│   │   ├── hooks/      # Custom hooks
│   │   ├── services/   # API calls
│   │   └── store/      # Zustand stores
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── api/        # Endpoints
│   │   ├── models/     # Pydantic models
│   │   └── utils/      # Helpers
│   ├── data/           # JSON storage
│   └── requirements.txt
└── docker-compose.yml
```