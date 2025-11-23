#!/bin/bash

# Smart Tourist Safety Portal - Frontend Development Server
# This script runs the Vite development server (Node.js/npm)

echo "=========================================="
echo "Smart Tourist Safety Portal - Frontend"
echo "Vite/React Development Server"
echo "=========================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Dependencies not installed!"
    echo "Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    echo "VITE_API_URL=http://127.0.0.1:8000/api" > .env
    echo "✅ .env file created"
fi

echo ""
echo "=========================================="
echo "Starting Vite development server..."
echo "Frontend will run at: http://localhost:5173/"
echo "Backend API should be at: http://127.0.0.1:8000/api/"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=========================================="
echo ""

# Start the Vite dev server
npm run dev

