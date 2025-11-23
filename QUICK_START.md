# Quick Start Guide

## 🚀 Run Everything with One Command

```bash
./run_django.sh
```

This script will:
1. ✅ Install frontend dependencies (if needed)
2. ✅ Build the React frontend
3. ✅ Install backend dependencies (if needed)
4. ✅ Run database migrations
5. ✅ Start Django server

## 📍 Access Points

- **Frontend**: http://127.0.0.1:8000/
- **API**: http://127.0.0.1:8000/api/
- **Admin**: http://127.0.0.1:8000/admin/

## 🔧 Manual Steps (if needed)

### Build Frontend Only
```bash
cd frontend
npm install
npm run build
```

### Run Django Only
```bash
cd backend
source .venv/bin/activate
python manage.py runserver 8000
```

## ⚠️ Important Notes

1. **Frontend must be built** before Django can serve it
2. Built files go to `backend/static/` directory
3. Django serves both backend API and frontend
4. No separate Node.js server needed after building

## 🐛 Troubleshooting

**404 on static files:**
- Make sure you ran `npm run build` in the frontend directory
- Check that `backend/static/assets/` contains `main.js` and `main.css`

**Port already in use:**
- Change port: `python manage.py runserver 8001`

**Build errors:**
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

