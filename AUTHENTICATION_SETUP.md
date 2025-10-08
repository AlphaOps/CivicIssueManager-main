# Authentication Setup - User & Admin Login

## Overview
The application now has **two separate login pages**:
1. **User Login** - For regular citizens (email + password)
2. **Admin Login** - For administrators (username + password with constant credentials)

## Features Implemented

### 1. User Login Page
- **Email & Password authentication**
- **Sign Up button** to create new user accounts
- **"Admin Login" link** at the bottom to switch to admin login
- Users can register and login with their email

### 2. Admin Login Page
- **Username & Password authentication**
- Uses **constant credentials** stored in environment variables
- **"Back to User Login" button** to return to user login
- Red theme to distinguish from user login

### 3. User Registration Page
- Full name, email, and password fields
- Link to go back to login page

## Backend Changes

### Environment Variables (`.env`)
Add these to your `.env` file:
```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```
**⚠️ Change these values in production!**

### New API Endpoint
- `POST /api/auth/admin-login` - Admin authentication endpoint
  - Body: `{ "username": "admin", "password": "admin123" }`
  - Returns JWT token for admin user

### Files Modified
1. **`server/src/config/env.ts`** - Added admin credentials to environment schema
2. **`server/src/routes/auth.ts`** - Added admin login endpoint and admin token handling
3. **`server/.env.example`** - Added admin credentials example

## Frontend Changes

### Files Modified
1. **`src/lib/api.ts`** - Added `adminLogin()` method
2. **`src/contexts/AuthContext.tsx`** - Added `adminLogin` to context
3. **`src/components/Auth/AdminLoginForm.tsx`** - Updated to use auth context
4. **`src/components/Auth/LoginForm.tsx`** - Added admin login link
5. **`src/App.tsx`** - Added routing between login pages

### Navigation Flow
```
User Login Page
    ├── "Sign Up" → Registration Page → Back to User Login
    ├── "Admin Login 🔒" → Admin Login Page
    │       └── "← Back to User Login" → User Login Page
    └── Login Success → Dashboard
```

## How to Use

### For Users:
1. Visit the app
2. Click **"Sign Up"** to create an account
3. Or **Sign In** with existing email and password

### For Admins:
1. Visit the app
2. Click **"🔒 Admin Login"** at the bottom of user login
3. Enter admin credentials:
   - Username: `admin`
   - Password: `admin123` (or your custom values from .env)
4. Click **"Admin Sign In"**

## Deployment Steps

### 1. Update Render Environment Variables
Go to your Render dashboard and add:
- `ADMIN_USERNAME=admin` (or your preferred username)
- `ADMIN_PASSWORD=your-secure-password` (use a strong password!)

### 2. Redeploy
The backend will automatically redeploy when you push these changes.

### 3. Test
- Test user login with email/password
- Test admin login with username/password
- Test registration flow
- Verify navigation between pages works correctly

## Security Notes
- Admin credentials are stored as environment variables (not hardcoded)
- JWT tokens are used for session management
- Passwords are hashed with bcryptjs
- Admin tokens have a 7-day expiration
- **Always use strong passwords in production!**

## Default Credentials (Development)
If not set in environment variables, defaults are:
- **Admin Username:** `admin`
- **Admin Password:** `admin123`

**⚠️ IMPORTANT: Change these immediately in production!**
