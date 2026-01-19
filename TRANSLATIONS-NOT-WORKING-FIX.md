# TRANSLATIONS NOT WORKING - QUICK FIX GUIDE

## Problem: Translations Not Connected After Deployment

If your site loads but shows translation keys instead of actual text (like "common.calculate" instead of "Calculate"), here's how to fix it.

---

## ✅ DIAGNOSIS

Your translations ARE in the build - they're in the `dist/locales/` folder. The issue is likely one of these:

### 1. Folder Upload Issue (Most Common)

**Problem:** The `locales` folder didn't upload correctly to Hostinger

**Check:**
- Log into Hostinger File Manager
- Navigate to `public_html/locales/`
- Verify you see folders: `ar/` and `en/`
- Inside each, verify you see: `common.json`, `translation.json`, and `calc/` folder

**If folder is missing, follow Step 2 below.**

---

## 🔧 SOLUTION

### Step 1: Verify Your Local Build

```bash
cd /Users/raedtayyem/Desktop/work/alathasiba-claudecode

# Check if locales folder exists in dist
ls -la dist/locales/

# You should see:
# dist/locales/ar/
# dist/locales/en/
```

**If you don't see the locales folder in dist:**
```bash
# Rebuild
rm -rf dist
npm run build
ls -la dist/locales/  # Verify it's created
```

---

### Step 2: Re-upload the Locales Folder to Hostinger

**Using Hostinger File Manager:**

1. **On your computer**, navigate to:
   ```
   /Users/raedtayyem/Desktop/work/alathasiba-claudecode/dist/
   ```

2. **Compress the locales folder:**
   - Right-click the `locales` folder
   - Create ZIP: `locales.zip`

3. **Upload to Hostinger:**
   - Log into Hostinger hPanel
   - Open File Manager
   - Navigate to `public_html/`
   - Upload `locales.zip`
   - Extract the ZIP file (right-click → Extract)
   - Delete `locales.zip` after extraction

4. **Verify the structure:**
   ```
   public_html/
   ├── index.html
   ├── assets/
   ├── locales/          ← This folder must exist
   │   ├── ar/
   │   │   ├── common.json
   │   │   ├── translation.json
   │   │   └── calc/
   │   │       ├── business/
   │   │       ├── construction/
   │   │       └── [other categories]
   │   └── en/
   │       ├── common.json
   │       ├── translation.json
   │       └── calc/
   │           └── [same structure]
   └── [other files]
   ```

---

### Step 3: Check File Permissions

In Hostinger File Manager:

1. Right-click the `locales` folder
2. Change Permissions → **755** (rwxr-xr-x)
3. For all JSON files inside → **644** (rw-r--r--)

---

### Step 4: Test Translation Loading

**Open browser DevTools (F12):**

1. Go to **Network** tab
2. Reload your page
3. Filter by **XHR** or **Fetch**
4. Look for requests to `/locales/ar/common.json` or `/locales/en/common.json`

**If you see 404 errors:**
- The locales folder is missing or in wrong location
- Re-upload as per Step 2

**If you see 200 OK:**
- Files are loading correctly
- Check browser Console for JavaScript errors

---

## 🔍 ALTERNATIVE CAUSES

### Issue 2: Browser Cache

**Fix:**
```bash
# Clear browser cache completely
# Or use Incognito/Private mode
```

### Issue 3: CORS Headers (Rare)

Some servers block loading JSON files. Check if you see CORS errors in Console.

**Fix:** Add to `.htaccess`:
```apache
<IfModule mod_headers.c>
  <FilesMatch "\.json$">
    Header set Access-Control-Allow-Origin "*"
  </FilesMatch>
</IfModule>
```

### Issue 4: Wrong Path in Build

The i18n config uses: `/locales/{{lng}}/{{ns}}.json`

This means files must be at:
- `/locales/ar/common.json` (not `/public/locales/`)
- `/locales/en/calc/business.json`

**Verify structure matches this on Hostinger.**

---

## 🧪 TESTING

### Test Individual Translation Files:

Visit these URLs directly in your browser:

```
https://alathasiba.com/locales/ar/common.json
https://alathasiba.com/locales/en/common.json
https://alathasiba.com/locales/ar/calc/business.json
```

**Should see:** JSON file content
**If you see 404:** Files not uploaded or wrong location

---

## 📋 QUICK VERIFICATION CHECKLIST

On Hostinger, verify these paths exist:

```
public_html/locales/ar/common.json ✓
public_html/locales/ar/translation.json ✓
public_html/locales/ar/calc/business.json ✓
public_html/locales/ar/calc/construction.json ✓
public_html/locales/en/common.json ✓
public_html/locales/en/translation.json ✓
public_html/locales/en/calc/business.json ✓
```

If ANY are missing, re-upload the locales folder.

---

## 🚀 COMPLETE RE-UPLOAD PROCEDURE

If nothing works, do a complete re-upload:

### On Your Computer:

```bash
cd /Users/raedtayyem/Desktop/work/alathasiba-claudecode

# Clean build
rm -rf dist
npm run build

# Verify locales folder exists
ls -la dist/locales/ar/
ls -la dist/locales/en/

# Create a complete backup
cd dist
zip -r site-backup.zip .
```

### On Hostinger:

1. **Delete everything** in `public_html/`
2. **Upload** `site-backup.zip` to `public_html/`
3. **Extract** the ZIP file
4. **Delete** the ZIP file
5. **Verify** the structure:
   - index.html in root
   - locales/ folder in root
   - assets/ folder in root

### Test:

Visit: https://alathasiba.com

Should now show translated text instead of translation keys.

---

## 🎯 EXPECTED BEHAVIOR

### What You Should See:

**Arabic (Default):**
- "احسب" button (not "common.calculate")
- "إعادة تعيين" button (not "common.reset")
- Arabic calculator names
- Arabic descriptions

**English (After switching):**
- "Calculate" button
- "Reset" button
- English calculator names
- English descriptions

### What Indicates a Problem:

- Translation keys showing: `common.calculate`, `bmi.title`, etc.
- Empty strings
- Missing text
- Console errors about loading translations

---

## 💡 MOST LIKELY ISSUE & FIX

**90% of the time, it's this:**

**Problem:** The `locales` folder wasn't uploaded or is in the wrong location

**Fix:**
1. Check Hostinger File Manager
2. Ensure `public_html/locales/` exists
3. If not, upload it from `dist/locales/`
4. Refresh your site

---

## 📞 IF STILL NOT WORKING

### Diagnostic Steps:

1. **Open browser DevTools (F12)**
2. **Go to Console tab**
3. **Look for errors**
4. **Take screenshot**
5. **Check Network tab** for failed requests

### Common Errors:

**Error: "Failed to load /locales/ar/common.json"**
- **Fix:** Upload the locales folder

**Error: "CORS policy blocked"**
- **Fix:** Add CORS headers to .htaccess (see Issue 3 above)

**Error: "Unexpected token < in JSON"**
- **Fix:** JSON files corrupted, re-upload

---

## ✅ VERIFICATION COMMAND

After fixing, run this in browser Console:

```javascript
// Check if translations loaded
console.log(i18n.store.data);

// Should show object with 'ar' and 'en' keys
// Each with translation namespaces
```

---

## 🎊 SUCCESS CHECKLIST

- [ ] `dist/locales/` folder exists locally
- [ ] Built with `npm run build`
- [ ] Uploaded entire `dist` contents to `public_html/`
- [ ] `public_html/locales/` exists on Hostinger
- [ ] Can access https://alathasiba.com/locales/ar/common.json
- [ ] Site shows Arabic text (not translation keys)
- [ ] Language switcher works
- [ ] No console errors
- [ ] Translations display correctly

---

**Once the `locales` folder is properly uploaded, translations will work perfectly!** ✅

**Your platform is ready - just need to ensure the folder structure is correct on Hostinger.** 🚀
