# GitHub Pages Deployment Guide

## What Was Fixed

This project had several issues preventing successful GitHub Pages deployment:

### 1. Missing Base Path Configuration
**Problem**: Vite builds assets with absolute paths (`/assets/...`), which don't work on GitHub Pages subdirectories.

**Fix**: Added `base: '/sketchvg/'` to `vite.config.ts`

### 2. Missing GitHub Actions Workflow
**Problem**: No automated deployment process.

**Fix**: Created `.github/workflows/deploy.yml` with:
- Automatic builds on push to `main`
- Proper artifact handling
- GitHub Pages deployment

### 3. Client-Side Routing Issues
**Problem**: Direct navigation to routes like `/paint` would return 404 on GitHub Pages.

**Fix**: 
- Created `public/404.html` with redirect script
- Updated `App.tsx` to use `import.meta.env.BASE_URL` for router base path

### 4. Router Base Path
**Problem**: Router didn't account for the subdirectory path.

**Fix**: Updated `App.tsx` to use wouter's `base` prop with Vite's `BASE_URL` env variable

## Deployment Steps

### First Time Setup

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Under "Source", select "GitHub Actions"
   - Save

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

3. **Monitor deployment**:
   - Go to repository → Actions tab
   - Watch the workflow run
   - Once complete, your site will be live at:
     `https://HMTEUNIS.github.io/sketchvg/`

### Updating the Base Path

If your repository name changes or you deploy to a custom domain:

1. **For different repository name**:
   - Update `base` in `vite.config.ts`:
     ```ts
     base: '/your-repo-name/',
     ```
   - Update `pathSegmentsToKeep` in `public/404.html`:
     ```js
     var pathSegmentsToKeep = 1; // Keep this as 1 for repo-name structure
     ```

2. **For custom domain (root deployment)**:
   - Update `base` in `vite.config.ts`:
     ```ts
     base: '/',
     ```
   - Update `pathSegmentsToKeep` in `public/404.html`:
     ```js
     var pathSegmentsToKeep = 0; // 0 for root domain
     ```
   - Remove or comment out the router base in `App.tsx`:
     ```tsx
     <WouterRouter> {/* Remove base prop */}
     ```

## Troubleshooting

### Assets Not Loading
- Check that `base` path in `vite.config.ts` matches your repository name
- Verify the base path doesn't have trailing issues (should end with `/`)

### 404 Errors on Refresh
- Ensure `public/404.html` exists and is being copied to dist
- Check that `pathSegmentsToKeep` in `404.html` matches your deployment structure

### Build Fails in GitHub Actions
- Check the Actions tab for error messages
- Verify Node.js version in workflow matches your local setup
- Ensure all dependencies are in `package.json` (not just devDependencies)

### Page Loads But Looks Broken
- Open browser DevTools → Console
- Check for 404 errors on asset loading
- Verify all paths are using the correct base path

## Files Modified for Deployment

1. `vite.config.ts` - Added base path
2. `.github/workflows/deploy.yml` - Created deployment workflow
3. `public/404.html` - Created for client-side routing
4. `src/App.tsx` - Added router base path handling
5. `package.json` - Already had build script

## Verification

After deployment, verify:
- ✅ Homepage loads correctly
- ✅ Assets (CSS, JS) load without 404 errors
- ✅ Routes work on refresh (no 404)
- ✅ Console has no path-related errors


