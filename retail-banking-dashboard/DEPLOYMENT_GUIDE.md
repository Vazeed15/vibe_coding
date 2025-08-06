# 🚀 Deployment Guide

This guide covers multiple deployment options for the Smart Banking Dashboard project.

## 📋 Overview

The banking dashboard is a full-stack application requiring both frontend and backend deployment. Here are your options:

## 🎯 **Deployment Options**

### **Option 1: GitHub Pages (Frontend Only) + External Backend** ⭐️ Recommended for Demo

**Pros:** 
- Free hosting for frontend
- Easy setup with GitHub Actions
- Good for portfolio/demo purposes

**Cons:** 
- Backend needs separate hosting
- Limited to static frontend features

#### Steps:

1. **Enable GitHub Pages**
   ```bash
   # In your GitHub repo settings:
   # Settings > Pages > Source: GitHub Actions
   ```

2. **Update package.json homepage**
   ```json
   "homepage": "https://yourusername.github.io/retail-banking-dashboard"
   ```

3. **Deploy Frontend with Mock Data**
   ```bash
   # The GitHub Pages workflow will automatically:
   # - Build the React app with mock data
   # - Deploy to GitHub Pages
   # - Enable demo mode with client-side features
   ```

4. **Deploy Backend Separately** (Choose one):
   - **Railway**: Connect GitHub repo, auto-deploy
   - **Render**: Free tier with automatic builds
   - **Heroku**: Classic PaaS option
   - **Vercel**: Serverless functions

#### Manual GitHub Pages Deploy:
```bash
cd frontend
npm install
npm install -g gh-pages
npm run deploy
```

---

### **Option 2: Full-Stack on Railway** ⭐️ Recommended for Production

**Pros:** 
- Both frontend and backend together
- Automatic deployments from GitHub
- Built-in database support
- Easy environment management

#### Steps:

1. **Connect to Railway**
   ```bash
   # Visit railway.app
   # Connect your GitHub repository
   # Railway will auto-detect the services
   ```

2. **Configure Environment Variables**
   ```env
   DATABASE_URL=postgresql://user:pass@host:port/db
   REACT_APP_API_URL=https://your-backend-railway.up.railway.app
   ```

3. **Deploy**
   ```bash
   # Railway automatically deploys on git push to main
   git push origin main
   ```

---

### **Option 3: Docker on any VPS**

**Pros:** 
- Complete control
- Can run anywhere
- Production-ready setup

#### Steps:

1. **Prepare VPS**
   ```bash
   # Install Docker and Docker Compose
   sudo apt update
   sudo apt install docker.io docker-compose
   ```

2. **Deploy**
   ```bash
   git clone your-repo
   cd retail-banking-dashboard
   docker-compose up -d
   ```

3. **Configure Nginx (Optional)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
       }
       
       location /api {
           proxy_pass http://localhost:8000;
       }
   }
   ```

---

### **Option 4: Vercel (Frontend) + Railway (Backend)**

**Pros:** 
- Best of both worlds
- Excellent performance
- Great developer experience

#### Frontend on Vercel:

1. **Connect Repository**
   ```bash
   # Visit vercel.com
   # Import your GitHub repository
   # Set root directory to "frontend"
   ```

2. **Environment Variables**
   ```env
   REACT_APP_API_URL=https://your-backend-railway.up.railway.app
   ```

#### Backend on Railway:
- Follow Railway steps above

---

### **Option 5: Netlify (Frontend) + Render (Backend)**

Similar to Vercel + Railway but using Netlify and Render.

---

## 🛠️ **Environment Configuration**

### **Frontend (.env)**
```env
# For GitHub Pages (mock data)
REACT_APP_USE_MOCK_DATA=true

# For production with backend
REACT_APP_API_URL=https://your-backend-url.com
```

### **Backend (.env)**
```env
# Database
DATABASE_URL=sqlite:///./banking.db
# Or PostgreSQL: postgresql://user:pass@host:port/db

# CORS (if needed)
CORS_ORIGINS=["https://yourusername.github.io"]
```

---

## 🚀 **Quick Deploy Commands**

### **GitHub Pages (Frontend Only)**
```bash
# Method 1: Automatic with GitHub Actions
git push origin main  # Triggers workflow

# Method 2: Manual with gh-pages
cd frontend
npm run deploy
```

### **Railway (Full-Stack)**
```bash
# Connect repo at railway.app
# Configure environment variables
git push origin main  # Auto-deploys
```

### **Docker (Any Platform)**
```bash
docker-compose up --build -d
```

---

## 🔧 **Troubleshooting**

### **GitHub Pages Issues**

**Blank page after deployment:**
```bash
# Check homepage in package.json
"homepage": "https://yourusername.github.io/repo-name"

# Ensure proper routing for SPA
# Add _redirects file (already included)
```

**API calls failing:**
```bash
# Check if mock data is enabled
REACT_APP_USE_MOCK_DATA=true

# Verify API URL environment variable
REACT_APP_API_URL=https://your-backend.com
```

### **Railway Issues**

**Build failures:**
```bash
# Check Procfile or Dockerfile
# Verify environment variables
# Check build logs in Railway dashboard
```

**Database connection errors:**
```bash
# Verify DATABASE_URL format
# Check if PostgreSQL addon is attached
```

---

## 📊 **Deployment Comparison**

| Platform | Frontend | Backend | Database | Cost | Complexity |
|----------|----------|---------|----------|------|------------|
| GitHub Pages + Railway | ✅ | ✅ | ✅ | Free/Low | Medium |
| Vercel + Railway | ✅ | ✅ | ✅ | Free/Low | Medium |
| Railway Full-Stack | ✅ | ✅ | ✅ | Low | Low |
| Docker VPS | ✅ | ✅ | ✅ | Medium | High |
| GitHub Pages Only | ✅ | ❌ | ❌ | Free | Low |

---

## 🎯 **Recommended Approach**

### **For Demo/Portfolio:**
1. Deploy frontend to **GitHub Pages** with mock data
2. Add note about full-stack capabilities
3. Include link to live backend demo

### **For Production:**
1. Use **Railway** for full-stack deployment
2. Enable PostgreSQL database
3. Configure custom domain
4. Set up monitoring and backups

### **For Learning:**
1. Start with **GitHub Pages** (frontend only)
2. Deploy backend to **Railway**
3. Connect them together
4. Migrate to full Railway deployment

---

## 🔐 **Security Notes**

### **GitHub Pages Considerations:**
- No backend security layers
- All data is client-side
- Use mock data only for demos

### **Production Security:**
- Use HTTPS everywhere
- Configure CORS properly
- Set up proper authentication
- Use environment variables for secrets
- Regular security updates

---

## 📞 **Need Help?**

Check the troubleshooting section or create an issue in the repository for deployment-specific questions.