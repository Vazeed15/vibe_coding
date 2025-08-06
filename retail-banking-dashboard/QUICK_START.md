# 🚀 Quick Start Guide

## ⚡ Fastest Way to Run

```bash
git clone <repository-url>
cd retail-banking-dashboard
./start.sh
```

Choose option 1 (Docker) or 2 (Local) and you're ready!

## 🐳 Docker (Recommended)

**No dependencies needed - everything runs in containers**

```bash
# Start services
docker-compose up --build

# Or use the script
./start.sh docker
```

**Access URLs:**
- 🌐 Frontend: http://localhost:3000
- 🔧 Backend: http://localhost:8000
- 📚 API Docs: http://localhost:8000/docs

## 🖥️ Local Development

**Prerequisites:** Node.js 18+ and Python 3.11+

```bash
# Option 1: Use the script
./start.sh local

# Option 2: Manual setup
# Backend (Terminal 1)
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd db && python seed_data.py && cd ..
uvicorn main:app --reload

# Frontend (Terminal 2)
cd frontend
npm install
npm start
```

## 🔑 Demo Login

- **Email:** `john.doe@email.com`
- **Password:** `demo123`

## 🛠️ Management Commands

```bash
./start.sh status    # Check what's running
./start.sh stop      # Stop all services
./start.sh logs      # View logs
./start.sh clean     # Clean up Docker
./start.sh help      # All options
```

## 🌐 Deploy to GitHub Pages

1. Fork the repository
2. Go to Settings → Pages → Enable GitHub Actions
3. Push to main branch
4. Access at: `https://your-username.github.io/retail-banking-dashboard`

---

## 🔧 What Was Fixed

This repository has been updated to work properly for web deployment:

### ✅ Backend Fixes
- Removed invalid `sqlite3` from requirements.txt (built into Python)
- Added `requests` dependency for health checks
- Fixed Docker health check to use Python instead of curl

### ✅ Frontend Fixes  
- Updated Docker configuration to use build arguments
- Fixed API URL configuration for container networking
- Configured nginx proxy for `/api` endpoint routing

### ✅ Docker Improvements
- Fixed service communication (frontend → nginx → backend)
- Improved health check reliability
- Added build arguments for environment variables

### ✅ User Experience
- Created comprehensive startup script with interactive menu
- Added status checking and service management commands
- Updated README with clear, simple instructions
- Added troubleshooting and cleanup commands

The repository now supports:
- 🐳 **Docker deployment** (no dependencies needed)
- 🖥️ **Local development** (Node.js + Python)
- 🌐 **GitHub Pages** (static demo mode)
- 📋 **Easy management** (start/stop/status/logs)

Everything works out of the box! 🎉