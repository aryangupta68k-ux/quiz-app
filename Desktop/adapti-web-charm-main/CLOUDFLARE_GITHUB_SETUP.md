# How to Connect GitHub to Cloudflare Pages

This guide will help you connect your GitHub repository to Cloudflare Pages for automatic deployments.

## Prerequisites

- ✅ GitHub account
- ✅ Cloudflare account (free tier available)
- ✅ Your project pushed to GitHub

## Step-by-Step Guide

### Step 1: Push Your Project to GitHub

If you haven't already, create a new GitHub repository and push your code:

```bash
# If you need to create a new repo, first update the remote:
git remote remove origin  # Remove old remote if needed
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push your code
git add .
git commit -m "Initial commit"
git push -u origin main
```

### Step 2: Sign in to Cloudflare Dashboard

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Sign in with your Cloudflare account (or create one for free)
3. Navigate to **Workers & Pages** in the left sidebar

### Step 3: Connect GitHub to Cloudflare

1. In the **Workers & Pages** section, click **Create application**
2. Click **Pages** tab
3. Click **Connect to Git**
4. You'll see a list of Git providers - click **GitHub**
5. Authorize Cloudflare to access your GitHub account
6. Select the repositories you want to give Cloudflare access to (or select all)
7. Click **Install & Authorize**

### Step 4: Create a New Pages Project

1. After connecting GitHub, click **Create a project**
2. Select **Connect to Git**
3. Choose your repository: `adapti-web-charm-main` (or your repo name)
4. Click **Begin setup**

### Step 5: Configure Build Settings

Cloudflare Pages will auto-detect Vite, but verify these settings:

**Build Configuration:**
- **Framework preset:** Vite (auto-detected)
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/` (leave as default)

**Environment Variables (if needed):**
- Add any environment variables your app needs
- Click **Save and Deploy**

### Step 6: Deploy

1. Cloudflare will automatically:
   - Install dependencies (`npm install`)
   - Build your project (`npm run build`)
   - Deploy to Cloudflare's global CDN
2. Wait for the build to complete (usually 2-5 minutes)
3. Your site will be live at: `https://YOUR_PROJECT_NAME.pages.dev`

### Step 7: Custom Domain (Optional)

To add a custom domain:

1. Go to your project dashboard
2. Click **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter your domain (e.g., `www.tokverify.com`)
5. Follow DNS configuration instructions
6. SSL certificate is **automatically provisioned** by Cloudflare

## Automatic Deployments

Once connected:
- ✅ **Every push to `main` branch** → Production deployment
- ✅ **Pull requests** → Preview deployments
- ✅ **Automatic SSL** for all deployments
- ✅ **Global CDN** for fast performance

## Build Configuration File (Optional)

You can create a `wrangler.toml` or use Cloudflare's dashboard settings. For Vite projects, the default settings usually work perfectly.

## Troubleshooting

### Build Fails

1. **Check build logs** in Cloudflare dashboard
2. **Verify build command:** Should be `npm run build`
3. **Check Node version:** Cloudflare uses Node 18 by default
4. **Verify output directory:** Should be `dist` for Vite

### GitHub Not Connecting

1. **Revoke and reconnect:**
   - Go to GitHub Settings → Applications → Authorized OAuth Apps
   - Revoke Cloudflare access
   - Reconnect in Cloudflare dashboard

2. **Check repository permissions:**
   - Ensure Cloudflare has access to the repository
   - Repository must be public or you must grant access

### Domain Not Working

1. **Check DNS records:**
   - Verify CNAME or A records are correct
   - Wait for DNS propagation (5-30 minutes)

2. **SSL Certificate:**
   - Cloudflare automatically provisions SSL
   - Wait 5-10 minutes after DNS propagates

## Quick Commands Reference

```bash
# Check current remote
git remote -v

# Update remote to your GitHub repo
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

## Benefits of Cloudflare Pages

- 🚀 **Unlimited bandwidth** (free tier)
- ⚡ **Global CDN** for fast loading
- 🔒 **Automatic SSL** certificates
- 🔄 **Automatic deployments** from Git
- 📊 **Analytics** and performance insights
- 🎯 **Preview deployments** for PRs
- 💰 **Free tier** is very generous

## Next Steps

1. ✅ Push your code to GitHub
2. ✅ Connect GitHub to Cloudflare
3. ✅ Configure build settings
4. ✅ Deploy your site
5. ✅ Add custom domain (optional)
6. ✅ Enjoy automatic deployments!

## Need Help?

- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/
- Cloudflare Community: https://community.cloudflare.com/
- GitHub Integration: https://developers.cloudflare.com/pages/platform/git-integration/

