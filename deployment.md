# Deploying OpenManus UI to Vercel

This document provides instructions for deploying the OpenManus UI application to Vercel.

## Prerequisites

Before deploying, ensure you have:

1. A Vercel account (sign up at https://vercel.com)
2. A Supabase project set up with the required tables and authentication
3. The necessary environment variables ready

## Environment Variables

The following environment variables need to be configured in your Vercel project:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment Steps

1. Install Vercel CLI (optional):
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel (if using CLI):
   ```bash
   vercel login
   ```

3. Deploy from the project directory:
   ```bash
   cd /path/to/openmanus-ui-app
   vercel
   ```

4. Alternatively, deploy directly from the Vercel dashboard:
   - Connect your GitHub repository
   - Import the project
   - Configure the environment variables
   - Deploy

## Post-Deployment

After deployment:

1. Set up a custom domain if desired
2. Configure any additional environment variables
3. Set up team access if needed

## Continuous Deployment

For continuous deployment:

1. Connect your GitHub repository to Vercel
2. Configure automatic deployments for main/master branch
3. Set up preview deployments for pull requests

## Troubleshooting

If you encounter issues:

1. Check the Vercel deployment logs
2. Verify environment variables are correctly set
3. Ensure Supabase connection is working properly
