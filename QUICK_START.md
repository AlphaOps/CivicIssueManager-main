# 🚀 Quick Start Guide - Deploy in 30 Minutes

Follow these steps in order to deploy your Civic Issue Manager app.

---

## Step 1: Install Backend Dependencies (2 minutes)

```bash
cd server
npm install
cd ..
```

---

## Step 2: Setup MongoDB Atlas (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up/login → Click "Build a Database" → Choose FREE tier
3. Create cluster (wait 3-5 min)
4. **Database Access**: Add user (username: `civicapp`, autogenerate password, save it!)
5. **Network Access**: Add IP → "Allow Access from Anywhere" (0.0.0.0/0)
6. **Database**: Click "Connect" → "Connect your application"
7. Copy connection string and replace `<password>` with your saved password:
   ```
   mongodb+srv://civicapp:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/civic-issues?retryWrites=true&w=majority
   ```
8. **SAVE THIS STRING** - you'll need it for Render!

---

## Step 3: Push to GitHub (3 minutes)

```bash
# In project root
git init
git add .
git commit -m "Initial commit - ready for deployment"

# Create new repo on GitHub (don't initialize with README)
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy Backend on Render (5 minutes)

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub → Select your repository
4. **Configure:**
   - Name: `civic-issue-manager-api`
   - Root Directory: `server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: **Free**

5. **Add Environment Variables** (click "Advanced"):
   - `MONGODB_URI` = (your MongoDB connection string from Step 2)
   - `JWT_SECRET` = Generate random 32+ chars (run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `NODE_ENV` = `production`
   - `CORS_ORIGIN` = `*` (we'll update this later)
   - `PORT` = `5000`

6. Click **"Create Web Service"** → Wait 5-10 minutes
7. **SAVE YOUR RENDER URL**: `https://civic-issue-manager-api-XXXX.onrender.com`
8. Test: Visit `https://YOUR_RENDER_URL/health` (should return `{"status":"ok"}`)

---

## Step 5: Deploy Frontend on Netlify (5 minutes)

1. Go to https://app.netlify.com/
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect GitHub → Select your repository
4. **Configure:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click **"Add environment variables"**:
     - Key: `VITE_API_URL`
     - Value: Your Render URL (e.g., `https://civic-issue-manager-api-XXXX.onrender.com`)
     - **NO trailing slash!**

5. Click **"Deploy site"** → Wait 2-5 minutes
6. **SAVE YOUR NETLIFY URL**: `https://random-name-123.netlify.app`

---

## Step 6: Update CORS (2 minutes)

1. Go back to Render dashboard
2. Open your web service → **Environment** tab
3. Edit `CORS_ORIGIN`:
   - Change from `*` to your Netlify URL: `https://your-site.netlify.app`
4. Save → Service will auto-redeploy (1-2 min)

---

## Step 7: Create Admin User (3 minutes)

**Option A: Via MongoDB Atlas (Easiest)**
1. Register a normal user on your Netlify site
2. Go to MongoDB Atlas → Database → Browse Collections
3. Find `civic-issues` database → `users` collection
4. Find your user → Click edit
5. Change `"role": "citizen"` to `"role": "admin"`
6. Save → Logout and login again

**Option B: Via MongoDB Compass**
1. Download MongoDB Compass
2. Connect with your MongoDB URI
3. Navigate to `civic-issues` → `users`
4. Register via app first, then edit role to "admin"

---

## Step 8: Test Everything (5 minutes)

1. **Visit your Netlify URL**
2. **Register** a new account
3. **Create** a test issue
4. **Add** a comment
5. **Login as admin** and change issue status
6. **Check notifications**

---

## ✅ You're Live!

- **Frontend**: https://your-site.netlify.app
- **Backend**: https://your-api.onrender.com
- **Database**: MongoDB Atlas

---

## 🔧 Common Issues

### "Network Error" in frontend
- Check `VITE_API_URL` in Netlify env vars
- Ensure CORS_ORIGIN in Render matches Netlify URL exactly
- Redeploy frontend after changing env vars

### "Authentication failed" in backend logs
- Check MongoDB password in connection string
- Ensure special characters are URL-encoded

### Backend is slow on first request
- Free tier spins down after 15 min inactivity
- First request wakes it up (takes 30-60 seconds)

---

## 📝 Making Updates

**Backend changes:**
```bash
git add .
git commit -m "Update backend"
git push
# Render auto-deploys
```

**Frontend changes:**
```bash
git add .
git commit -m "Update frontend"
git push
# Netlify auto-deploys
```

---

## 🎉 Next Steps

- Customize your Netlify subdomain
- Add custom domain (both Render & Netlify support this)
- Monitor logs in dashboards
- Upgrade to paid tiers for better performance

Need detailed help? See `DEPLOYMENT_GUIDE.md`
