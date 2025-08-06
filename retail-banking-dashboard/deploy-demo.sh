#!/bin/bash

# Smart Retail Banking Dashboard - Demo Mode Deployment Script
# This script builds and serves the frontend in demo mode for local testing

echo "🏦 Smart Retail Banking Dashboard - Demo Mode"
echo "============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "📂 Navigating to frontend directory..."
cd frontend || { echo "❌ Frontend directory not found!"; exit 1; }

echo "📦 Installing dependencies..."
npm install

echo "🏗️  Building for demo mode..."
export REACT_APP_API_URL=""
export REACT_APP_DEMO_MODE="true"
export PUBLIC_URL="."

npm run build

echo "🚀 Starting demo server..."
echo ""
echo "🌐 Demo will be available at: http://localhost:3000"
echo "👤 Login credentials:"
echo "   Email: john.doe@email.com"
echo "   Password: demo123"
echo ""
echo "📝 Features available in demo mode:"
echo "   ✅ Customer dashboard with mock data"
echo "   ✅ Transaction history and analytics"
echo "   ✅ AI-powered loan prediction"
echo "   ✅ Responsive design and charts"
echo ""

# Serve the built files
if command -v python3 &> /dev/null; then
    echo "🐍 Using Python3 to serve files..."
    cd build && python3 -m http.server 3000
elif command -v python &> /dev/null; then
    echo "🐍 Using Python to serve files..."
    cd build && python -m http.server 3000
elif command -v npx &> /dev/null; then
    echo "📦 Using npx serve to serve files..."
    npx serve -s build -p 3000
else
    echo "✅ Build completed! Files are in the 'build' directory."
    echo "💡 To serve locally, you can use:"
    echo "   - Python: cd build && python3 -m http.server 3000"
    echo "   - Node.js: npx serve -s build -p 3000"
    echo "   - Any other static file server"
fi