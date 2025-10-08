# 🚀 Complete Deployment Guide

This guide will walk you through deploying your Civic Issue Manager application with:
- **Backend** on Render (with MongoDB Atlas)
- **Frontend** on Netlify

---

## 📋 Prerequisites

Before starting, you'll need:
1. GitHub account (to push your code)
2. MongoDB Atlas account (free tier is fine)
3. Render account (free tier available)
4. Netlify account (free tier available)

---

## Part 1: Setup MongoDB Atlas (Database)

### Step 1: Create MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click **"Build a Database"**
4. Choose **FREE** tier (M0 Sandbox)
5. Select a cloud provider and region (choose closest to you)
6. Click **"Create Cluster"** (takes 3-5 minutes)

### Step 2: Create Database User

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username: `civicapp` (or your choice)
5. Click **"Autogenerate Secure Password"** - **SAVE THIS PASSWORD**
6. Set privileges to **"Read and write to any database"**
7. Click **"Add User"**

### Step 3: Allow Network Access

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### Step 4: Get Connection String

1. Go back to **"Database"** in sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://civicapp:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace `<password>`** with the password you saved earlier
6. **Add database name** before the `?`:
   ```
   mongodb+srv://civicapp:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/civic-issues?retryWrites=true&w=majority
   ```
7. **SAVE THIS CONNECTION STRING** - you'll need it for Render

---

## Part 2: Deploy Backend to Render

### Step 1: Push Code to GitHub

1. Open Terminal in your project folder
2. Initialize git (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit with backend"
   ```
3. Create a new repository on GitHub (don't initialize with README)
4. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"** and authorize Render
4. Select your repository
5. Configure the service:

   **Basic Settings:**
   - Name: `civic-issue-manager-api` (or your choice)
   - Region: Choose closest to you
   - Branch: `main`
   - Root Directory: `server`
   - Runtime: `Node`

   **Build & Deploy:**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

   **Plan:**
   - Select **Free** tier

6. Click **"Advanced"** to add environment variables

### Step 3: Add Environment Variables in Render

Click **"Add Environment Variable"** for each:

1. **MONGODB_URI**
   - Value: `mongodb+srv://civicapp:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/civic-issues?retryWrites=true&w=majority`
   - (Use the connection string from MongoDB Atlas)

2. **JWT_SECRET**
   - Value: Generate a random 32+ character string
   - Example: `super-secret-jwt-key-change-this-to-random-string-min-32-chars`
   - Or generate one: Open terminal and run:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```

3. **NODE_ENV**
   - Value: `production`

4. **CORS_ORIGIN**
   - Value: `*` (for now, we'll update after Netlify deployment)

5. **PORT**
   - Value: `5000`

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Once deployed, you'll see a URL like: `https://civic-issue-manager-api.onrender.com`
4. **SAVE THIS URL** - you'll need it for frontend
5. Test it by visiting: `https://YOUR_RENDER_URL.onrender.com/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

---

## Part 3: Deploy Frontend to Netlify

### Step 1: Create Netlify Site

1. Go to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Click **"Deploy with GitHub"**
4. Authorize Netlify and select your repository
5. Configure build settings:

   **Build Settings:**
   - Base directory: (leave empty)
   - Build command: `npm run build`
   - Publish directory: `dist`

6. Click **"Add environment variables"**

### Step 2: Add Environment Variable

1. Click **"New variable"**
2. Key: `VITE_API_URL`
3. Value: Your Render URL (e.g., `https://civic-issue-manager-api.onrender.com`)
4. **DO NOT include trailing slash**

### Step 3: Deploy

1. Click **"Deploy site"**
2. Wait 2-5 minutes for deployment
3. Once deployed, you'll get a URL like: `https://random-name-123.netlify.app`
4. Click **"Domain settings"** to customize the subdomain if you want

### Step 4: Update CORS in Render

1. Go back to your Render dashboard
2. Open your web service
3. Go to **"Environment"**
4. Update **CORS_ORIGIN** variable:
   - Old value: `*`
   - New value: `https://your-netlify-site.netlify.app`
5. Click **"Save Changes"**
6. Service will automatically redeploy

---

## Part 4: Create Admin User

Your app needs an admin user. You have two options:

### Option A: Use API to Register Admin (Recommended)

1. Open your browser console (F12)
2. Go to your Netlify site
3. Register a new user normally
4. Connect to MongoDB Atlas:
   - Go to MongoDB Atlas → Database → Browse Collections
   - Find `civic-issues` database → `users` collection
   - Find your user and click edit
   - Change `role` from `"citizen"` to `"admin"`
   - Save

### Option B: Use MongoDB Compass (Desktop App)

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your MongoDB URI
3. Navigate to `civic-issues` → `users`
4. Create a new document:
   ```json
   {
     "email": "admin@civic.com",
     "password": "$2a$10$...", 
     "full_name": "Admin User",
     "role": "admin",
     "created_at": "2025-10-08T18:00:00.000Z"
   }
   ```
   Note: Password needs to be bcrypt hashed. Easier to register via app first, then change role.

---

## Part 5: Testing Your Deployment

### Test Backend (Render)

1. Visit: `https://YOUR_RENDER_URL.onrender.com/health`
   - Should return: `{"status":"ok",...}`

2. Test API endpoints:
   ```bash
   # Get issues (should return empty array initially)
   curl https://YOUR_RENDER_URL.onrender.com/api/issues
   ```

### Test Frontend (Netlify)

1. Visit your Netlify URL
2. Register a new account
3. Create a test issue
4. Check if it appears in the list
5. Add a comment
6. Login as admin and change issue status

---

## 🎉 You're Done!

Your app is now live:
- **Frontend**: https://your-site.netlify.app
- **Backend**: https://your-api.onrender.com
- **Database**: MongoDB Atlas

---

## 🔧 Troubleshooting

### Backend Issues

**"Application failed to respond"**
- Check Render logs: Dashboard → Your Service → Logs
- Verify MONGODB_URI is correct
- Ensure JWT_SECRET is at least 32 characters

**"CORS Error" in browser**
- Update CORS_ORIGIN in Render to match your Netlify URL exactly
- No trailing slash in URL

### Frontend Issues

**"Network Error" or "Failed to fetch"**
- Check VITE_API_URL in Netlify environment variables
- Ensure it matches your Render URL exactly
- Trigger a new deploy after changing env vars

**"Cannot read property of undefined"**
- Clear browser cache and reload
- Check browser console for specific errors

### Database Issues

**"MongoServerError: Authentication failed"**
- Double-check MongoDB password in connection string
- Ensure special characters in password are URL-encoded

**"Connection timeout"**
- Verify IP whitelist includes 0.0.0.0/0 in MongoDB Atlas

---

## 📝 Environment Variables Summary

### Render (Backend)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/civic-issues?retryWrites=true&w=majority
JWT_SECRET=your-32-char-random-string
NODE_ENV=production
CORS_ORIGIN=https://your-site.netlify.app
PORT=5000
```

### Netlify (Frontend)
```
VITE_API_URL=https://your-api.onrender.com
```

---

## 🔄 Making Updates

### Update Backend
1. Make changes to code
2. Commit and push to GitHub
3. Render auto-deploys from `main` branch

### Update Frontend
1. Make changes to code
2. Commit and push to GitHub
3. Netlify auto-deploys from `main` branch

---

## 💡 Tips

- **Free tier limitations**: Render free tier spins down after 15 min inactivity (first request may be slow)
- **Custom domain**: Both Render and Netlify support custom domains
- **Monitoring**: Check Render and Netlify dashboards for logs and metrics
- **Backup**: MongoDB Atlas has automatic backups on paid tiers

---

Need help? Check the logs in Render/Netlify dashboards for detailed error messages.
