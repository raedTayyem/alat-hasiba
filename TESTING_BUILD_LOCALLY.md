# Testing Your Build Locally

## Why Opening index.html Directly Doesn't Work

If you're seeing **CORS errors** or **file:// protocol errors**, this is because you're trying to open `dist/index.html` directly in your browser (by double-clicking it or using `file://` URLs).

### Why This Fails:

1. **CORS Policy**: Modern browsers block JavaScript from making requests when using the `file://` protocol for security reasons
2. **Module Scripts**: ES6 modules (which your app uses) require HTTP/HTTPS protocols and won't load from `file://`
3. **Asset Loading**: Many assets and resources fail to load correctly without a proper web server

**These errors are EXPECTED and NORMAL when opening files directly.** Your build is fine - it just needs to be served via HTTP.

---

## How to Test Your Build Properly

You MUST use a local HTTP server to test the production build. Here are three easy options:

### Option 1: Vite Preview Server (Recommended)

This is the easiest method since you already have Vite installed:

```bash
npm run preview
```

This will:
- Serve your `dist` folder on a local HTTP server
- Typically at `http://localhost:4173` or similar
- Show you the URL in the terminal

### Option 2: Python HTTP Server

If you have Python installed (most systems do):

```bash
# Navigate to the dist folder
cd dist

# Python 3
python -m http.server 8000

# Python 2 (if you're on an older system)
python -m SimpleHTTPServer 8000
```

Then open `http://localhost:8000` in your browser.

### Option 3: Any Other Local Server

You can use any simple HTTP server tool:

- **Node.js http-server**: `npx http-server dist -p 8000`
- **Live Server** (VS Code extension): Right-click on `dist/index.html` and select "Open with Live Server"
- **PHP**: `php -S localhost:8000 -t dist`

---

## Summary

- **DO NOT** open `dist/index.html` by double-clicking or using `file://` URLs
- **DO** use a local HTTP server to test your build
- **The errors you're seeing are expected** when using `file://` protocol
- **Your build is working correctly** - it just needs proper HTTP serving

Once you deploy to a real web server (like Netlify, Vercel, GitHub Pages, etc.), everything will work perfectly because those platforms serve files over HTTP/HTTPS automatically.
