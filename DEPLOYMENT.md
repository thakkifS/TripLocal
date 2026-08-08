# TripLocal Deployment Guide

## Vercel Deployment Instructions

### 1. Prepare Your Project

Ensure your project is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user with username and password
5. Whitelist IP addresses (use 0.0.0.0/0 for Vercel)
6. Get your connection string from the "Connect" button
7. Replace `<password>` with your database password

Your connection string should look like:
```
mongodb+srv://username:password@cluster.mongodb.net/triplocal
```

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: (leave empty for auto-detection)
   - **Output Directory**: (leave empty)

5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate a secure random string (use: `openssl rand -base64 32`)
   - `REACT_APP_API_URL`: `/api`

6. Click "Deploy"

7. Wait for deployment to complete

8. Your app will be live at `https://your-project-name.vercel.app`

### 4. Seed Sample Data (Optional)

After deployment, you can seed the database with sample places:

1. Access your Vercel project dashboard
2. Go to "Settings" > "Functions"
3. Add a new function or use the Vercel CLI to run the seed script locally with your production database

Alternatively, use the Admin Dashboard to add places manually.

### 5. Test Your Deployment

1. Visit your deployed URL
2. Register a new account (select "admin" role for admin access)
3. Test all features:
   - Browse places
   - Search and filter
   - View place details
   - Add to day plan
   - Admin dashboard (if admin)

### Troubleshooting

**Build Errors:**
- Ensure all dependencies are in package.json files
- Check that Node.js version is compatible (use Node 18.x or higher)

**Database Connection Errors:**
- Verify MONGODB_URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

**API Errors:**
- Verify REACT_APP_API_URL is set to `/api` for production
- Check that JWT_SECRET is set

**Image Upload Issues:**
- Vercel serverless functions have size limits
- Consider using cloud storage (AWS S3, Cloudinary) for production image uploads

### Custom Domain (Optional)

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed by Vercel

### Updating Your App

To update your deployed app:
1. Make changes locally
2. Commit and push to Git
3. Vercel will automatically redeploy

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb+srv://user:pass@cluster.mongodb.net/triplocal |
| JWT_SECRET | Secret for JWT token generation | your-random-secret-string-here |
| REACT_APP_API_URL | API endpoint URL | /api (production) or http://localhost:5000/api (development) |

### Security Notes

- Never commit `.env` files to Git
- Use strong, random JWT_SECRET
- Enable MongoDB Atlas network access restrictions
- Regularly update dependencies
- Use HTTPS in production (Vercel provides this automatically)
