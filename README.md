# Smart Tourist Safety Portal

**Complete Django-based application serving both backend API and React frontend.**

## 🚀 Quick Start

### All-in-One Setup (Recommended)

```bash
./build_and_run.sh
```

This script will:
1. Install frontend dependencies (if needed)
2. Build the React frontend
3. Install backend dependencies (if needed)
4. Run database migrations
5. Collect static files
6. Start Django server serving everything

### Manual Setup

#### Step 1: Build Frontend
```bash
cd frontend
npm install
npm run build
```

#### Step 2: Start Django Backend
```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py runserver 8000
```

## 📍 Access Points

- **Frontend**: http://127.0.0.1:8000/
- **API**: http://127.0.0.1:8000/api/
- **Admin**: http://127.0.0.1:8000/admin/

## 🏗️ Architecture

- **Backend**: Django REST Framework (Python)
- **Frontend**: React + Vite (built and served by Django)
- **Database**: SQLite
- **Static Files**: Served by Django

## 📁 Project Structure

```
smart_tourists/
├── backend/
│   ├── api/              # API endpoints
│   ├── backend/          # Django settings
│   ├── templates/        # Django templates (React app)
│   ├── static/           # Built frontend files
│   └── manage.py
├── frontend/
│   ├── src/              # React source code
│   └── package.json
└── build_and_run.sh      # All-in-one startup script
```

## 🔐 Authentication Endpoints

- `POST /api/auth/tourist/register/` - Tourist registration
- `POST /api/auth/tourist/login/` - Tourist login
- `POST /api/auth/authority/register/` - Authority registration
- `POST /api/auth/authority/login/` - Authority login

## 📝 Notes

- **No Node.js server needed** - Frontend is built and served by Django
- All `node_modules` are only needed during build time
- After building, Django serves the static files
- Frontend API calls use relative paths (`/api/`) when served by Django

## 🔧 Troubleshooting

**Frontend not loading:**
1. Make sure you ran `npm run build` in the frontend directory
2. Check that `backend/static/` directory exists with built files
3. Run `python manage.py collectstatic --noinput`

**API calls failing:**
- Make sure API base URL in `frontend/src/api.js` is `/api` (relative path)

**Port already in use:**
- Change port: `python manage.py runserver 8001`

