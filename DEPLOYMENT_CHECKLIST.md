# ✅ Deployment Checklist

Use this as your step-by-step checklist. Check off each item as you complete it.

---

## Pre-Deployment

- [ ] Install server dependencies: `cd server && npm install && cd ..`
- [ ] Test frontend locally: `npm run dev`
- [ ] Test backend locally: `cd server && npm run dev`

---

## MongoDB Atlas Setup

- [ ] Create MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
- [ ] Create FREE cluster (M0 Sandbox)
- [ ] Create database user:
  - Username: `civicapp` (or your choice)
  - Password: _________________ (save this!)
- [ ] Add IP whitelist: 0.0.0.0/0 (allow all)
- [ ] Get connection string:
  ```
  mongodb+srv://civicapp:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/civic-issues?retryWrites=true&w=majority
  ```
- [ ] Connection string saved: _________________________________

---

## GitHub Setup

- [ ] Create new GitHub repository
- [ ] Repository URL: _________________________________
- [ ] Push code:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin YOUR_GITHUB_URL
  git branch -M main
  git push -u origin main
  ```

---

## Render Backend Deployment

- [ ] Create Render account at https://dashboard.render.com/
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Configure:
  - Root Directory: `server`
  - Build Command: `npm install && npm run build`
  - Start Command: `npm start`
  - Plan: Free

- [ ] Add environment variables:
  - [ ] `MONGODB_URI` = (your MongoDB connection string)
  - [ ] `JWT_SECRET` = (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
        Value: _________________________________
  - [ ] `NODE_ENV` = `production`
  - [ ] `CORS_ORIGIN` = `*` (temporary, will update later)
  - [ ] `PORT` = `5000`

- [ ] Deploy and wait for completion
- [ ] Render URL: _________________________________
- [ ] Test health endpoint: `https://YOUR_RENDER_URL/health`
- [ ] Health check passed ✓

---

## Netlify Frontend Deployment

- [ ] Create Netlify account at https://app.netlify.com/
- [ ] Import project from GitHub
- [ ] Configure:
  - Build command: `npm run build`
  - Publish directory: `dist`

- [ ] Add environment variable:
  - [ ] `VITE_API_URL` = (your Render URL, NO trailing slash)
        Value: _________________________________

- [ ] Deploy and wait for completion
- [ ] Netlify URL: _________________________________
- [ ] Site loads successfully ✓

---

## Update CORS

- [ ] Go back to Render dashboard
- [ ] Update `CORS_ORIGIN` environment variable:
  - Old: `*`
  - New: (your Netlify URL)
- [ ] Save and wait for redeploy

---

## Create Admin User

- [ ] Register a user on your Netlify site
  - Email: _________________________________
  - Password: _________________________________

- [ ] Go to MongoDB Atlas → Database → Browse Collections
- [ ] Navigate to `civic-issues` → `users`
- [ ] Find your user and edit
- [ ] Change `role` from `"citizen"` to `"admin"`
- [ ] Save changes
- [ ] Logout and login again on site
- [ ] Verify admin features are visible ✓

---

## Testing

- [ ] Register new user
- [ ] Create test issue
- [ ] View issue list
- [ ] Add comment to issue
- [ ] Login as admin
- [ ] Change issue status
- [ ] Check notifications
- [ ] All features working ✓

---

## Final URLs

**Production URLs:**
- Frontend: _________________________________
- Backend: _________________________________
- Database: MongoDB Atlas

**Admin Credentials:**
- Email: _________________________________
- Password: _________________________________

---

## Post-Deployment (Optional)

- [ ] Customize Netlify subdomain
- [ ] Add custom domain to Netlify
- [ ] Add custom domain to Render
- [ ] Set up monitoring/alerts
- [ ] Configure backup strategy
- [ ] Update README with live URLs

---

## Troubleshooting

If something doesn't work:

1. **Check Render logs**: Dashboard → Your Service → Logs
2. **Check Netlify logs**: Site → Deploys → Deploy log
3. **Check browser console**: F12 → Console tab
4. **Verify environment variables**: All set correctly?
5. **Test backend directly**: `curl https://YOUR_RENDER_URL/api/issues`

Common fixes:
- Clear browser cache
- Redeploy after env var changes
- Check CORS_ORIGIN matches exactly
- Verify MongoDB connection string

---

## Need Help?

- Detailed guide: See `DEPLOYMENT_GUIDE.md`
- Quick reference: See `QUICK_START.md`
- Backend docs: See `server/README.md`

---

**Estimated Total Time: 30-40 minutes**

Good luck! 🚀
