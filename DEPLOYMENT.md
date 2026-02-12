# Deployment Guide - Aggroso

This guide covers deploying Aggroso to Vercel with a Neon PostgreSQL database.

## Prerequisites
- GitHub account
- Vercel account (free tier works)
- Neon account (free tier works)
- Gemini API key

## Step 1: Set Up Neon PostgreSQL Database

1. Go to [neon.tech](https://neon.tech) and sign up/login
2. Click **"Create a project"**
3. Choose a name (e.g., "aggroso-db")
4. Select a region close to your users
5. Click **"Create project"**
6. Copy the connection string from the dashboard
   - It looks like: `postgresql://user:password@host/database?sslmode=require`
   - Save this for later

## Step 2: Prepare Your Code

1. Make sure all changes are committed:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   ```

2. Push to GitHub:
   ```bash
   git push origin main
   ```

## Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and login
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. Add Environment Variables:
   - Click **"Environment Variables"**
   - Add `DATABASE_URL`:
     - Key: `DATABASE_URL`
     - Value: Your Neon connection string
     - Environments: Production, Preview, Development
   - Add `GEMINI_API_KEY`:
     - Key: `GEMINI_API_KEY`
     - Value: Your Gemini API key
     - Environments: Production, Preview, Development

6. Click **"Deploy"**

## Step 4: Verify Deployment

1. Wait for the build to complete (usually 2-3 minutes)
2. Click on the deployment URL
3. Navigate to `/status` page
4. Verify all three health checks are green:
   - ✅ Backend API
   - ✅ Storage Layer (PostgreSQL)
   - ✅ AI Engine (Gemini)

## Step 5: Test the Application

1. Go to the home page
2. Paste a sample transcript from `TRANSCRIPT_EXAMPLES.md`
3. Click "Generate Action Items"
4. Verify tasks are extracted and saved
5. Refresh the page - data should persist

## Troubleshooting

### Build Fails
- Check Vercel build logs for errors
- Ensure `DATABASE_URL` is set correctly
- Verify Prisma schema is valid

### Database Connection Errors
- Verify the Neon connection string includes `?sslmode=require`
- Check that the database is not paused (Neon free tier auto-pauses)
- Ensure the connection string has the correct password

### AI Extraction Fails
- Verify `GEMINI_API_KEY` is set in Vercel
- Check Gemini API quota/limits
- Review Vercel function logs for errors

### Status Page Shows "Degraded"
- Database: Check Neon dashboard for connection issues
- AI Engine: Verify API key is valid
- Backend: Check Vercel deployment logs

## Updating the Deployment

To deploy new changes:

1. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```

2. Vercel automatically deploys on push
3. Monitor the deployment in Vercel dashboard

## Database Migrations

When you update the Prisma schema:

1. Create a migration locally:
   ```bash
   npx prisma migrate dev --name your_migration_name
   ```

2. Commit the migration files:
   ```bash
   git add prisma/migrations
   git commit -m "Add migration: your_migration_name"
   git push
   ```

3. Vercel runs `prisma migrate deploy` automatically during build

## Cost Considerations

### Free Tier Limits
- **Vercel**: 100GB bandwidth, unlimited deployments
- **Neon**: 0.5GB storage, 1 project, auto-pauses after inactivity
- **Gemini**: 15 requests/minute, 1500 requests/day (free tier)

### Scaling Up
If you exceed free tiers:
- Vercel Pro: $20/month
- Neon Scale: $19/month
- Gemini: Pay-as-you-go pricing

## Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Rotate API keys** if accidentally exposed
3. **Use environment variables** for all secrets
4. **Enable Vercel password protection** for preview deployments (optional)

## Monitoring

- **Vercel Analytics**: Monitor page views and performance
- **Vercel Logs**: Check function execution logs
- **Neon Dashboard**: Monitor database queries and connections
- **Status Page**: Built-in health monitoring at `/status`

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Vercel deployment logs
3. Check Neon database status
4. Verify all environment variables are set correctly
