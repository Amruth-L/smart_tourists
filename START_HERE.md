# Smart Tourist Safety Portal - Quick Start Guide

## 🚀 Starting the Application

### Backend (Django/Python)

**Terminal 1:**
```bash
cd backend
./run_server.sh
```

Or manually:
```bash
cd backend
source .venv/bin/activate
python manage.py runserver 8000
```

Backend will run at: **http://127.0.0.1:8000/**

### Frontend (React/Vite)

**Terminal 2:**
```bash
cd frontend
./start_dev.sh
```

Or manually:
```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: **http://localhost:5173/**

## 📋 Prerequisites

### Backend
- Python 3.8+
- Virtual environment (created automatically by `run_server.sh`)

### Frontend
- Node.js 16+
- npm (comes with Node.js)

## 🔧 Troubleshooting

### Backend Issues

**"ModuleNotFoundError: No module named 'django'"**
```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
```

**"Port 8000 already in use"**
```bash
python manage.py runserver 8001
```

### Frontend Issues

**"Cannot find module" errors**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**"Port 5173 already in use"**
- Vite will automatically use the next available port

**Frontend can't connect to backend**
1. Make sure backend is running on port 8000
2. Check `.env` file in frontend directory:
   ```
   VITE_API_URL=http://127.0.0.1:8000/api
   ```

## 📁 Project Structure

```
smart_tourists/
├── backend/          # Django REST API
│   ├── api/         # API app
│   ├── backend/     # Django settings
│   └── manage.py    # Django management script
│
└── frontend/        # React/Vite app
    ├── src/         # Source code
    │   ├── components/
    │   └── pages/
    └── package.json
```

## 🔐 Authentication Endpoints

- **Tourist Register**: `POST /api/auth/tourist/register/`
- **Tourist Login**: `POST /api/auth/tourist/login/`
- **Authority Register**: `POST /api/auth/authority/register/`
- **Authority Login**: `POST /api/auth/authority/login/`

## 📝 Notes

- Backend uses SQLite database (`db.sqlite3`)
- Media files are stored in `backend/media/`
- CORS is enabled for development (all origins allowed)

