#!/bin/bash

# GitHub Pages Deployment Script for React Banking Dashboard
echo "🚀 Deploying React Banking Dashboard to GitHub Pages..."

# Navigate to frontend directory
cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Set environment variables for GitHub Pages
export PUBLIC_URL="/vibe_coding"
export REACT_APP_API_URL=""
export REACT_APP_DEMO_MODE="true"

echo "🔨 Building the application..."
npm run build

# Create .nojekyll file to bypass Jekyll processing
touch build/.nojekyll

echo "📤 Deploying to GitHub Pages..."
npm run deploy

echo "✅ Deployment complete! Your app should be available at:"
echo "🌐 https://Vazeed15.github.io/vibe_coding/"
echo ""
echo "Note: It may take a few minutes for changes to appear on GitHub Pages."
echo "Check the Actions tab in your GitHub repository for deployment status."