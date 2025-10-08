# Civic Issue Manager - Backend API

Express + MongoDB backend for the Civic Issue Manager application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (see `.env.example`):
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Random secret key (min 32 characters)
- `CORS_ORIGIN`: Your frontend URL (Netlify)

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Issues
- `GET /api/issues` - Get all issues (with filters)
- `GET /api/issues/:id` - Get single issue
- `POST /api/issues` - Create issue (auth required)
- `PATCH /api/issues/:id/status` - Update status (admin only)
- `DELETE /api/issues/:id` - Delete issue (admin only)

### Comments
- `GET /api/comments/issue/:issueId` - Get comments for issue
- `POST /api/comments/issue/:issueId` - Add comment (auth required)

### Notifications
- `GET /api/notifications` - Get user notifications (auth required)
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read

## Deployment to Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Configure:
   - Build Command: `cd server && npm install && npm run build`
   - Start Command: `cd server && npm start`
5. Add environment variables in Render dashboard
6. Deploy!
