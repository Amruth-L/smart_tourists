#!/bin/bash

# Smart Tourist Safety Portal - Django Backend Server Startup Script
# This script runs the Django development server (Python), NOT Node.js

echo "=========================================="
echo "Smart Tourist Safety Portal - Backend"
echo "Django/Python Server (NOT Node.js)"
echo "=========================================="
echo ""

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "❌ Virtual environment not found!"
    echo "Creating virtual environment..."
    python3 -m venv .venv
    echo "✅ Virtual environment created"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Check if requirements are installed
if ! python -c "import django" 2>/dev/null; then
    echo "Installing requirements..."
    pip install -r requirements.txt
    echo "✅ Requirements installed"
fi

# Run migrations
echo "Running database migrations..."
python manage.py makemigrations
python manage.py migrate

echo ""
echo "=========================================="
echo "Starting Django development server..."
echo "Server will run at: http://127.0.0.1:8000/"
echo "API endpoints at: http://127.0.0.1:8000/api/"
echo "Admin panel at: http://127.0.0.1:8000/admin/"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=========================================="
echo ""

# Start the Django server
python manage.py runserver 8000

