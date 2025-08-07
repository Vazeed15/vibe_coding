# GitHub Pages Deployment Troubleshooting Guide

## Quick Checklist

✅ **Verify these settings first:**

1. **Repository Settings > Pages**
   - Source: "Deploy from a branch"
   - Branch: `gh-pages`
   - Folder: `/ (root)`

2. **Package.json Configuration**
   - `"homepage": "https://Vazeed15.github.io/vibe_coding"`
   - `"predeploy": "npm run build"`
   - `"deploy": "gh-pages -d build"`

3. **GitHub Actions Workflow**
   - Check if workflows are enabled in repository settings
   - Verify the `github-pages.yml` workflow exists in `.github/workflows/`

## Common Issues and Solutions

### 🔴 Issue: Blank White Screen

**Symptoms:** Site loads but shows only a white page
**Causes & Solutions:**

1. **Incorrect homepage URL**
   ```json
   // ❌ Wrong
   "homepage": "https://Vazeed15.github.io/"
   
   // ✅ Correct
   "homepage": "https://Vazeed15.github.io/vibe_coding"
   ```

2. **Missing .nojekyll file**
   - Our workflow automatically creates this
   - GitHub Pages uses Jekyll by default, which ignores files starting with `_`

3. **JavaScript errors**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed resource loading

### 🔴 Issue: 404 Error on Routes

**Symptoms:** Homepage works but other routes show 404
**Solution:** We already use `HashRouter` which should fix this!

```jsx
// ✅ Already implemented in App.jsx
import { HashRouter as Router } from 'react-router-dom';
```

### 🔴 Issue: Assets Not Loading

**Symptoms:** CSS/JS files return 404 errors
**Solutions:**

1. **Check build output**
   ```bash
   cd frontend
   npm run build
   ls -la build/static/
   ```

2. **Verify PUBLIC_URL**
   ```bash
   export PUBLIC_URL="/vibe_coding"
   npm run build
   ```

### 🔴 Issue: Deployment Workflow Fails

**Check GitHub Actions:**

1. Go to repository → Actions tab
2. Click on the failed workflow
3. Check logs for error messages

**Common workflow fixes:**

1. **Permissions issue**
   - Repository Settings → Actions → General
   - Workflow permissions: "Read and write permissions"

2. **Node.js version**
   - Our workflow uses Node 18 (recommended)

3. **Dependencies issue**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

## Manual Deployment (Alternative)

If GitHub Actions fails, you can deploy manually:

```bash
# Run our deployment script
./deploy-github-pages.sh

# Or manually:
cd frontend
export PUBLIC_URL="/vibe_coding"
export REACT_APP_DEMO_MODE="true"
npm run build
touch build/.nojekyll
npm run deploy
```

## Verification Steps

1. **Check deployment status:**
   - GitHub repository → Actions tab
   - Look for green checkmark on latest workflow

2. **Test the live site:**
   - Visit: https://Vazeed15.github.io/vibe_coding/
   - Try navigation between pages
   - Check browser console for errors

3. **Verify demo mode:**
   - Should see yellow demo banner
   - Login with: `john.doe@email.com` / `demo123`

## Environment Variables

The app uses these environment variables in GitHub Pages:

- `PUBLIC_URL="/vibe_coding"` - Base path for assets
- `REACT_APP_API_URL=""` - API URL (empty for demo mode)
- `REACT_APP_DEMO_MODE="true"` - Enables demo mode

## Still Having Issues?

1. **Check the live example:**
   - Our deployment should work at: https://Vazeed15.github.io/vibe_coding/

2. **Compare with working examples:**
   - [Create React App deployment docs](https://create-react-app.dev/docs/deployment/#github-pages)

3. **Debug locally:**
   ```bash
   cd frontend
   npm start
   # App should work at http://localhost:3000
   ```

4. **Check recent changes:**
   ```bash
   git log --oneline -5
   # See if recent commits broke anything
   ```

## Need Help?

If you're still stuck:
1. Check the GitHub Actions logs for specific error messages
2. Verify all file paths are correct (case-sensitive!)
3. Try clearing browser cache and hard refresh (Ctrl+F5)
4. Test in an incognito/private browser window