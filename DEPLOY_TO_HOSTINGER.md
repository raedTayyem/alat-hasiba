# How to Deploy to Hostinger - Complete Guide

## Build Completed Successfully ✅

Your production build is ready in the `/dist` folder with **all changes included**:
- ✅ Media.net ads removed
- ✅ All affiliate links removed
- ✅ Smart Gumroad product system integrated
- ✅ 266 calculators optimized

Build size: 224 KB (main bundle) - Very fast loading!

---

## Hostinger Deployment Options

### Option 1: File Manager Upload (Easiest - 5 minutes)

**Step 1: Access Hostinger File Manager**
1. Log in to Hostinger control panel (hpanel.hostinger.com)
2. Go to **Files** → **File Manager**
3. Navigate to `public_html` folder (or your domain folder)

**Step 2: Backup Current Site (Optional but Recommended)**
1. In File Manager, select all files in `public_html`
2. Click **Compress** → Create `backup-[date].zip`
3. Download the backup to your computer

**Step 3: Clear Old Files**
1. Select all files/folders in `public_html` (except backup)
2. Click **Delete**
3. Confirm deletion

**Step 4: Upload New Build**
1. On your computer, open `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/dist` folder
2. Select **ALL files and folders** inside `dist` (not the dist folder itself)
3. In Hostinger File Manager, click **Upload Files**
4. Drag and drop all files from dist folder
5. Wait for upload to complete (1-2 minutes)

**Step 5: Verify**
1. Visit your domain in browser
2. Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
3. Check that calculators work
4. Check that Gumroad product shows in sidebar (with placeholder URL for now)

**Done! Your site is live.**

---

### Option 2: FTP Upload (Traditional Way - 10 minutes)

**Step 1: Get FTP Credentials**
1. In Hostinger panel, go to **Files** → **FTP Accounts**
2. Note your FTP details:
   - Hostname: `ftp.yoursite.com` or IP address
   - Username: Usually your email or generated username
   - Password: Set if not already set
   - Port: 21 (FTP) or 22 (SFTP - more secure)

**Step 2: Connect with FTP Client**

Download FileZilla (free): https://filezilla-project.org

Or use built-in FTP:
```bash
# On Mac/Linux Terminal
cd /Users/raedtayyem/Desktop/work/alathasiba-claudecode/dist

# Connect to Hostinger
ftp ftp.yoursite.com
# Enter username
# Enter password

# Navigate to public_html
cd public_html

# Upload all files
mput *
```

**Step 3: Upload Files**

Using FileZilla:
1. Connect using your FTP credentials
2. Local site: Navigate to `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/dist`
3. Remote site: Navigate to `/public_html` (or your domain folder)
4. Select all files from local `dist` folder
5. Right-click → Upload
6. Wait for completion

**Step 4: Set Permissions (if needed)**
```
Folders: 755
Files: 644
```

**Step 5: Verify**
Visit your domain and hard refresh.

---

### Option 3: Git Deployment (Professional - One-time 20 min setup, then instant deploys)

**Step 1: Initialize Git (if not already)**
```bash
cd /Users/raedtayyem/Desktop/work/alathasiba-claudecode
git init
git add .
git commit -m "Smart Gumroad product system"
```

**Step 2: Create GitHub Repository**
1. Go to GitHub.com
2. Create new private repository
3. Push your code:
```bash
git remote add origin https://github.com/yourusername/alathasiba.git
git branch -M main
git push -u origin main
```

**Step 3: Set Up Hostinger Git Deployment**
1. In Hostinger panel, go to **Advanced** → **Git**
2. Click **Create Repository**
3. Fill in:
   - Repository URL: `https://github.com/yourusername/alathasiba.git`
   - Branch: `main`
   - Deployment path: `/public_html`
   - Build commands:
     ```
     npm install
     npm run build
     ```
   - Output directory: `dist`
4. Click **Create**
5. Click **Pull & Deploy**

**Future Deploys:**
```bash
# Make changes
git add .
git commit -m "Update products"
git push

# Then in Hostinger: Click "Pull & Deploy" button
```

**Pros:** Professional workflow, version control, easy rollbacks
**Cons:** Initial setup more complex

---

## Important: .htaccess for React Router

Since your site uses React Router, you need an `.htaccess` file to handle routes properly.

**Create this file in Hostinger:**

### Step 1: Create .htaccess
1. In Hostinger File Manager, go to `public_html`
2. Click **New File**
3. Name it `.htaccess` (with the dot at the beginning)
4. Click **Edit**

### Step 2: Add This Content
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  # Rewrite everything else to index.html for React Router
  RewriteRule ^ index.html [L]
</IfModule>

# Cache static assets for 1 year
<FilesMatch "\.(jpg|jpeg|png|gif|webp|svg|woff|woff2|ttf|css|js|ico)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>

# Security headers
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# Compress text files
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

### Step 3: Save
Click **Save Changes**

**This ensures:**
- All calculator URLs work properly (/calculator/mortgage-calculator-advanced)
- Static assets cached for performance
- Security headers enabled
- Files compressed for faster loading

---

## Post-Deployment Checklist

### ✅ Immediate Checks (5 minutes)
1. **Homepage loads**: Visit yourdomain.com
2. **Calculator pages work**: Click on any calculator
3. **Routing works**: Navigate between calculators, refresh page (should not 404)
4. **Language switch works**: Toggle Arabic/English
5. **Mobile responsive**: Test on phone or resize browser
6. **Gumroad placeholder shows**: Check sidebar on finance calculators

### ✅ Product System Check
1. Visit any finance calculator (mortgage, loan, investment)
2. Calculate a result
3. **Sidebar should show:** "Complete Financial Planning Guide - $9.99"
4. Click "Get Instant Access" → Should alert "Product link coming soon" (until you add real URL)
5. Try to leave page (mouse to top) → Exit intent modal should appear

### ✅ Analytics Working
1. Open browser console (F12)
2. Use a calculator
3. Check for Google Analytics events (gtag events)
4. No errors in console

---

## Adding Your Gumroad Link After Deployment

### Via File Manager (Easiest)
1. In Hostinger File Manager, navigate to `public_html/assets`
2. Find the file starting with `products-` (e.g., `products-abc123.js`)
3. Click **Edit**
4. Find: `PLACEHOLDER_FINANCE_PDF`
5. Replace with: `https://yourusername.gumroad.com/l/your-product`
6. Save

### Via FTP
1. Download `public_html/assets/products-*.js`
2. Edit locally
3. Replace placeholder
4. Upload back

### Via Git (Best for Future Updates)
1. Edit `/src/data/products.ts` locally
2. Update Gumroad URL
3. Run `npm run build`
4. Deploy updated dist folder

---

## Testing Checklist

### Before Going Live
- [ ] Test on Chrome, Safari, Firefox
- [ ] Test on mobile device
- [ ] Test calculator calculations (verify accuracy)
- [ ] Test product purchase flow (click button, Gumroad opens)
- [ ] Check all 45 finance/real-estate/business calculators show product
- [ ] Verify no console errors
- [ ] Test Arabic language mode
- [ ] Check page load speed (should be under 2 seconds)

### After Adding Gumroad Link
- [ ] Test complete purchase flow
- [ ] Verify Gumroad delivery works
- [ ] Check analytics tracking in Gumroad dashboard
- [ ] Monitor first week for any issues

---

## Troubleshooting

### Issue: 404 errors when navigating
**Solution:** Add .htaccess file (see above)

### Issue: White screen / blank page
**Solution:**
1. Check browser console for errors
2. Verify all files uploaded correctly
3. Clear browser cache (hard refresh)
4. Check file permissions (644 for files, 755 for folders)

### Issue: Product not showing
**Solution:**
1. Hard refresh browser (Cmd+Shift+R)
2. Check that you're on a finance/real-estate/business calculator
3. Ensure results are displayed (product only shows after calculation)
4. Check browser console for errors

### Issue: Slow loading
**Solution:**
1. Verify .htaccess caching is working
2. Enable Cloudflare if using it
3. Optimize images in `dist/assets`

### Issue: Arabic not working
**Solution:**
1. Verify all files uploaded (especially translation JSON files)
2. Check that public/locales folder uploaded correctly
3. Hard refresh browser

---

## Performance Optimization (Optional)

### Hostinger Settings
1. Go to **Advanced** → **Performance**
2. Enable:
   - PHP OPcache (if using PHP)
   - Browser caching
   - GZIP compression (if not in .htaccess)

### Cloudflare Integration (Recommended)
1. Sign up for Cloudflare (free)
2. Point DNS to Cloudflare
3. Benefits:
   - Global CDN (faster worldwide)
   - DDoS protection
   - Additional caching
   - Free SSL

---

## File Structure on Hostinger

After upload, your `public_html` should look like:
```
public_html/
├── index.html              (Main entry point)
├── .htaccess               (URL rewriting)
├── assets/                 (All JS, CSS, images)
│   ├── index-[hash].js
│   ├── index-[hash].css
│   ├── products-[hash].js  (Your products database)
│   └── [many calculator files]
├── locales/                (Translations)
│   ├── ar/
│   └── en/
├── sitemap.xml             (SEO)
├── robots.txt              (SEO)
└── [other files]
```

**Total size:** ~3-5 MB (very manageable)

---

## SSL Certificate (HTTPS)

### Hostinger Includes Free SSL
1. Go to **Advanced** → **SSL**
2. If not enabled, click **Install SSL**
3. Choose **Let's Encrypt** (free)
4. Wait 15 minutes for activation
5. Force HTTPS:
   - Add to .htaccess:
   ```apache
   # Force HTTPS
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
   ```

**Result:** Your site will use https:// automatically

---

## Deployment Schedule

### Recommended Workflow

**Initial Deploy (Now):**
- Upload dist folder
- Add .htaccess
- Test everything
- Get Gumroad link
- Update products.ts

**Weekly Updates (Optional):**
- Monitor Gumroad sales
- Adjust product pricing if needed
- Add new products to products.ts
- Rebuild and redeploy

**Monthly Maintenance (Optional):**
- Check analytics
- Update product descriptions
- Add new calculators
- Optimize conversion rates

**Actual ongoing work: 0-1 hours/month** (mostly just monitoring revenue)

---

## Quick Command Reference

### Local Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Deploy via File Manager
1. Build: `npm run build`
2. Zip dist folder contents
3. Upload zip to Hostinger
4. Extract in public_html
5. Delete zip file

### Deploy via FTP
```bash
npm run build
cd dist
# Upload all contents via FTP to public_html
```

### Deploy via Git
```bash
npm run build
git add .
git commit -m "Update"
git push
# Then click "Pull & Deploy" in Hostinger
```

---

## Expected Results After Deployment

### Immediate (Day 1)
- Site live with new product system
- Clean layout (no ads cluttering interface)
- Professional product display
- Fast page loads

### Week 1 (After Adding Gumroad Link)
- First product sales start
- 1-3 sales expected at 500 visits/month
- Revenue: $10-30

### Month 1
- 4-12 sales at 2% conversion
- Revenue: $40-120
- Zero ongoing work

### Month 3+
- Optimized conversion (2.5-3%)
- 6-15 sales/month
- Revenue: $60-150/month
- Still zero ongoing work

---

## Support Resources

**Hostinger Documentation:**
- File Manager: https://support.hostinger.com/en/articles/1583258-how-to-use-file-manager
- FTP Access: https://support.hostinger.com/en/articles/1583229-how-to-upload-files-using-ftp
- Git Deployment: https://support.hostinger.com/en/articles/6990283-how-to-deploy-from-git

**Need Help?**
- Hostinger Live Chat (24/7)
- Hostinger Knowledge Base

---

## Summary: Fastest Deployment Path

**If you want to go live in 5 minutes:**

1. Log in to Hostinger → File Manager
2. Navigate to `public_html`
3. Delete all current files
4. Upload all files from `/dist` folder
5. Create `.htaccess` file with content from above
6. Visit your site
7. **Done!**

**Then when you have your Gumroad link:**
1. Edit `/src/data/products.ts` on your computer
2. Replace `PLACEHOLDER_FINANCE_PDF` with your real URL
3. Run `npm run build`
4. Upload new `dist` contents to Hostinger
5. Refresh your site
6. **Product is now live and selling!**

---

Your build is ready to deploy right now. The `/dist` folder contains everything you need.
