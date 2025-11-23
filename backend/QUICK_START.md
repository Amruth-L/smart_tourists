# Quick Start Guide - Django Backend

## ⚠️ IMPORTANT: This is a Python/Django Backend
**DO NOT use Node.js/npm to run this backend.**
**Use Python and Django's development server instead.**

## Quick Start

### Option 1: Using the Startup Script (Recommended)
```bash
cd backend
./run_server.sh
```

### Option 2: Manual Start
```bash
cd backend
source .venv/bin/activate
python manage.py runserver 8000
```

## Authentication Endpoints

All endpoints are available at: `http://127.0.0.1:8000/api/`

### Tourist Authentication
- **Register**: `POST http://127.0.0.1:8000/api/auth/tourist/register/`
- **Login**: `POST http://127.0.0.1:8000/api/auth/tourist/login/`

### Authority Authentication
- **Register**: `POST http://127.0.0.1:8000/api/auth/authority/register/`
- **Login**: `POST http://127.0.0.1:8000/api/auth/authority/login/`

## Verify Endpoints

To verify all endpoints are properly configured:
```bash
python verify_endpoints.py
```

## Server Information

- **Framework**: Django 4.2 (Python)
- **Port**: 8000
- **Base URL**: http://127.0.0.1:8000/
- **API Base**: http://127.0.0.1:8000/api/
- **Admin Panel**: http://127.0.0.1:8000/admin/

## Troubleshooting

If you see "ModuleNotFoundError: No module named 'django'":
1. Make sure virtual environment is activated: `source .venv/bin/activate`
2. Install requirements: `pip install -r requirements.txt`

If you see port already in use:
- Change the port: `python manage.py runserver 8001`

