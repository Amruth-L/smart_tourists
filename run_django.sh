#!/bin/bash

# Smart Tourist Safety Portal - Run Django Server
# This script builds the frontend and runs Django

echo "=========================================="
echo "Smart Tourist Safety Portal"
echo "Building Frontend and Starting Django"
echo "=========================================="
echo ""

# Step 1: Build the frontend
echo "Step 1: Building React frontend..."
cd frontend

# Check if node_modules exists, if not install
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Build the frontend
echo "Building frontend for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "✅ Frontend built successfully"
echo ""

# Step 2: Start Django backend
echo "Step 2: Starting Django backend..."
cd ../backend

# Activate virtual environment
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

source .venv/bin/activate

# Install requirements if needed
if ! python -c "import django" 2>/dev/null; then
    echo "Installing backend dependencies..."
    pip install -r requirements.txt
fi

# Run migrations
echo "Running database migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo ""
echo "=========================================="
echo "✅ Setup complete!"
echo ""
echo "Starting Django server..."
echo "Server will run at: http://127.0.0.1:8000/"
echo "Frontend is served by Django at: http://127.0.0.1:8000/"
echo "API endpoints at: http://127.0.0.1:8000/api/"
echo "Admin panel at: http://127.0.0.1:8000/admin/"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=========================================="
echo ""

# Start Django server
python manage.py runserver 8000

