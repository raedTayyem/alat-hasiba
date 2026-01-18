# CI/CD Pipeline Setup Guide

Complete guide for setting up and configuring the GitHub Actions CI/CD pipeline for the Alathasiba Calculator project.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Detailed Configuration](#detailed-configuration)
- [Deployment Setup](#deployment-setup)
- [Quality Gates](#quality-gates)
- [Troubleshooting](#troubleshooting)
- [Advanced Configuration](#advanced-configuration)

---

## Overview

This project includes a comprehensive CI/CD pipeline with the following features:

### Continuous Integration

- **Code Quality**: ESLint, TypeScript type checking
- **Testing**: Vitest with coverage reporting
- **Security**: CodeQL analysis, secret scanning, dependency review
- **Translation Validation**: Automated coverage checking
- **Bundle Size Analysis**: Size limits and comparison

### Continuous Deployment

- **Multi-platform Support**: GitHub Pages, Netlify, Vercel, FTP, AWS S3
- **Automated Deployments**: Deploy on merge to main
- **Environment Management**: Production environment configuration
- **Rollback Support**: Artifact retention for quick rollbacks

---

## Quick Start

### 1. Fork or Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/alathasiba-claudecode.git
cd alathasiba-claudecode
```

### 2. Enable GitHub Actions

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Actions** > **General**
3. Under "Actions permissions", select **"Allow all actions and reusable workflows"**
4. Under "Workflow permissions", select **"Read and write permissions"**
5. Check **"Allow GitHub Actions to create and approve pull requests"**
6. Click **Save**

### 3. Set Up Branch Protection (Recommended)

1. Go to **Settings** > **Branches**
2. Click **"Add rule"**
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - Select required checks:
     - `Lint`
     - `TypeScript Type Check`
     - `Test (Node 20)`
     - `Build`
     - `Quality Gate`
   - ✅ Require branches to be up to date before merging
5. Click **Create**

### 4. Test the Pipeline

Create a test branch and PR:

```bash
git checkout -b test/ci-pipeline
# Make a small change
echo "# Testing CI/CD Pipeline" >> README.md
git add README.md
git commit -m "test: verify CI/CD pipeline"
git push -u origin test/ci-pipeline
```

Create a Pull Request on GitHub and watch the workflows run!

---

## Detailed Configuration

### GitHub Secrets

Go to **Settings** > **Secrets and variables** > **Actions** > **Secrets tab**

#### Optional Secrets (Enhanced Features)

| Secret Name | Purpose | Required |
|-------------|---------|----------|
| `CODECOV_TOKEN` | Code coverage reporting | No |
| `SLACK_WEBHOOK_URL` | Deployment notifications | No |

#### Deployment Secrets (Choose based on platform)

**For Netlify:**
```
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_site_id
```

**For Vercel:**
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

**For FTP/SFTP:**
```
FTP_SERVER=ftp.yourhost.com
FTP_USERNAME=your_username
FTP_PASSWORD=your_password
```

**For AWS S3:**
```
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_CLOUDFRONT_DISTRIBUTION_ID=your_distribution_id (optional)
```

### GitHub Variables

Go to **Settings** > **Secrets and variables** > **Actions** > **Variables tab**

| Variable Name | Purpose | Example | Required |
|--------------|---------|---------|----------|
| `DEPLOY_TARGET` | Deployment platform | `github-pages`, `netlify`, `vercel`, `ftp`, `s3` | No (defaults to github-pages) |
| `CUSTOM_DOMAIN` | Custom domain for GitHub Pages | `calculators.example.com` | No |
| `PRODUCTION_URL` | Production URL | `https://example.com` | No |
| `AUTO_RELEASE` | Enable automatic releases | `true` or `false` | No |
| `AWS_REGION` | AWS region | `us-east-1` | No (defaults to us-east-1) |
| `FTP_SERVER_DIR` | FTP server directory | `/public_html` | No (defaults to /) |

---

## Deployment Setup

### Option 1: GitHub Pages (Default)

**No additional configuration needed!**

The pipeline will automatically deploy to GitHub Pages when you push to `main`.

**Setup GitHub Pages:**

1. Go to **Settings** > **Pages**
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** / **root**
4. Click **Save**

**Custom Domain (Optional):**

1. Set the `CUSTOM_DOMAIN` variable: `calculators.example.com`
2. Add a CNAME record in your DNS settings:
   ```
   CNAME calculators YOUR_USERNAME.github.io
   ```
3. GitHub will handle the rest!

**Access your site:**
```
https://YOUR_USERNAME.github.io/alathasiba-claudecode/
```

---

### Option 2: Netlify

**1. Create Netlify Site:**

- Go to [Netlify](https://netlify.com)
- Create a new site (or use existing)
- Get your Site ID from Site Settings

**2. Generate Access Token:**

- Go to User Settings > Applications
- Create a new personal access token

**3. Configure Secrets:**

```bash
# In GitHub Settings > Secrets
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_site_id
```

**4. Set Variable:**

```bash
# In GitHub Settings > Variables
DEPLOY_TARGET=netlify
```

**5. Push to main branch - automatic deployment!**

---

### Option 3: Vercel

**1. Install Vercel CLI:**

```bash
npm i -g vercel
```

**2. Link Your Project:**

```bash
vercel login
vercel link
```

**3. Get IDs:**

```bash
# Your .vercel/project.json will contain:
# - projectId
# - orgId
```

**4. Generate Token:**

- Go to [Vercel Account Settings > Tokens](https://vercel.com/account/tokens)
- Create new token

**5. Configure Secrets:**

```bash
# In GitHub Settings > Secrets
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

**6. Set Variable:**

```bash
# In GitHub Settings > Variables
DEPLOY_TARGET=vercel
```

---

### Option 4: Custom Hosting (FTP/SFTP)

**1. Get FTP Credentials:**

- From your hosting provider (cPanel, Plesk, etc.)

**2. Configure Secrets:**

```bash
# In GitHub Settings > Secrets
FTP_SERVER=ftp.yourhost.com
FTP_USERNAME=your_username
FTP_PASSWORD=your_password
```

**3. Configure Variables:**

```bash
# In GitHub Settings > Variables
DEPLOY_TARGET=ftp
PRODUCTION_URL=https://yoursite.com
FTP_SERVER_DIR=/public_html  # Optional, defaults to /
```

---

### Option 5: AWS S3 + CloudFront

**1. Create S3 Bucket:**

```bash
# Enable static website hosting
# Set bucket policy for public access
```

**2. Create IAM User:**

```bash
# Permissions needed:
# - s3:PutObject
# - s3:DeleteObject
# - s3:ListBucket
# - cloudfront:CreateInvalidation (if using CloudFront)
```

**3. Configure Secrets:**

```bash
# In GitHub Settings > Secrets
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_CLOUDFRONT_DISTRIBUTION_ID=your_distribution_id  # Optional
```

**4. Configure Variables:**

```bash
# In GitHub Settings > Variables
DEPLOY_TARGET=s3
AWS_REGION=us-east-1  # Optional
PRODUCTION_URL=https://your-cloudfront-url.cloudfront.net
```

---

## Quality Gates

The pipeline enforces the following quality gates:

### 1. Code Quality

- **ESLint**: No errors allowed, warnings tolerated
- **TypeScript**: Must compile without errors
- **Code Style**: Follows project conventions

**Local Check:**
```bash
npm run lint
npm run type-check
```

### 2. Testing

- **All Tests Pass**: Required for merge
- **Coverage Threshold**: 80% (recommended)
- **Multi-version**: Tested on Node 18 and 20

**Local Check:**
```bash
npm test:run
npm run test:coverage
```

### 3. Translation Coverage

- **Minimum EN Coverage**: 80%
- **Minimum AR Coverage**: 80%
- **Analysis**: Automated translation key checking

**Local Check:**
```bash
npm run analyze:translations
```

**Review Report:**
```bash
cat translation-coverage-report.txt
```

### 4. Bundle Size

- **Main Bundle**: < 500 KB
- **Total JS**: < 2 MB
- **Comparison**: Shows size changes in PRs

**Local Check:**
```bash
npm run build
du -sh dist/assets/js/*
```

### 5. Security

- **CodeQL**: No high/critical vulnerabilities
- **Dependency Review**: No vulnerable dependencies
- **Secret Scanning**: No exposed secrets

**Review:**
- Check Security tab on GitHub
- Review Dependabot alerts

---

## Troubleshooting

### CI Workflow Failing

**Problem: Type Check Fails**

```bash
# Run locally to see errors
npm run type-check

# Common fix: update types
npm install --save-dev @types/react @types/react-dom
```

**Problem: Lint Errors**

```bash
# See errors
npm run lint

# Auto-fix where possible
npm run lint:fix
```

**Problem: Tests Fail**

```bash
# Run tests locally
npm test

# Run with UI for debugging
npm run test:ui

# Check specific test
npm test -- path/to/test.spec.ts
```

### Translation Coverage Below Threshold

```bash
# Run analysis
npm run analyze:translations

# View full report
cat translation-coverage-report.txt | less

# Find specific calculator issues
grep "Calculator: your-calculator-name" translation-coverage-report.txt -A 10
```

**Fix:**
1. Add missing translation keys to `public/locales/en/` and `public/locales/ar/`
2. Ensure keys match the structure expected by components
3. Re-run analysis to verify

### Bundle Size Exceeded

**Analysis:**
```bash
# Build and analyze
npm run build

# Check individual file sizes
ls -lh dist/assets/js/

# Find largest chunks
du -sh dist/assets/js/* | sort -rh | head -10
```

**Solutions:**
1. **Lazy Load Components**: Use React.lazy() for calculator components
2. **Code Splitting**: Split large components into smaller chunks
3. **Remove Unused Dependencies**: Check and remove unused packages
4. **Optimize Images**: Compress and optimize image assets
5. **Tree Shaking**: Ensure imports are tree-shakeable

**Example Lazy Loading:**
```typescript
const CalculatorComponent = lazy(() => import('./CalculatorComponent'));
```

### Deployment Fails

**Problem: GitHub Pages 404**

1. Check Settings > Pages is configured correctly
2. Ensure `gh-pages` branch exists
3. Verify `CNAME` file if using custom domain

**Problem: Netlify Deployment Fails**

1. Verify `NETLIFY_AUTH_TOKEN` is correct
2. Check `NETLIFY_SITE_ID` matches your site
3. Review Netlify deploy logs

**Problem: Vercel Deployment Fails**

1. Verify all Vercel secrets are set correctly
2. Check project is linked properly
3. Review Vercel deployment logs

**Problem: FTP Upload Fails**

1. Test FTP credentials manually
2. Check FTP_SERVER_DIR path exists
3. Verify file permissions on server

**Problem: AWS S3 Deployment Fails**

1. Check IAM permissions
2. Verify bucket exists and is accessible
3. Check bucket policy for public access (if needed)

### Codecov Integration Issues

**Setup:**
1. Go to [codecov.io](https://codecov.io)
2. Sign in with GitHub
3. Enable your repository
4. Copy the token
5. Add as `CODECOV_TOKEN` secret

**Problem: Coverage Not Uploading**

1. Ensure `CODECOV_TOKEN` is set correctly
2. Check workflow logs for upload errors
3. Verify coverage files are generated (`coverage/lcov.info`)

---

## Advanced Configuration

### Custom Workflow Triggers

**Add Custom Branch:**

Edit `.github/workflows/ci.yml`:
```yaml
on:
  push:
    branches: [ main, develop, staging ]  # Add staging
```

**Add Path Filters:**

```yaml
on:
  push:
    paths:
      - 'src/**'
      - 'public/**'
      - 'package.json'
```

### Custom Environment Variables

**Add to deployment workflow:**

```yaml
env:
  VITE_API_URL: ${{ secrets.API_URL }}
  VITE_ANALYTICS_ID: ${{ secrets.ANALYTICS_ID }}
```

### Manual Workflow Dispatch

All workflows support manual triggering:

1. Go to **Actions** tab
2. Select workflow
3. Click **Run workflow**
4. Choose branch
5. Click **Run workflow**

### Slack Notifications

**1. Create Slack Webhook:**

- Go to Slack App Settings
- Create Incoming Webhook
- Copy webhook URL

**2. Add Secret:**

```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

**3. Notifications will be sent on deployment success/failure!**

### Custom Quality Thresholds

**Translation Coverage:**

Edit `.github/workflows/translation-check.yml`:
```yaml
MIN_EN_THRESHOLD=90  # Change from 80
MIN_AR_THRESHOLD=90  # Change from 80
```

**Bundle Size:**

Edit `.github/workflows/bundle-size.yml`:
```yaml
MAIN_BUNDLE_LIMIT=$((700 * 1024))  # Change from 500 KB
TOTAL_JS_LIMIT=$((3 * 1024 * 1024))  # Change from 2 MB
```

### Scheduled Workflows

**Example: Weekly Dependency Check**

Create `.github/workflows/weekly-check.yml`:
```yaml
name: Weekly Health Check

on:
  schedule:
    - cron: '0 0 * * 0'  # Every Sunday at midnight

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm audit
      - run: npm outdated
```

---

## Performance Optimization

### Workflow Performance Tips

1. **Use Caching Effectively:**
   - npm packages are cached by default
   - Consider caching node_modules between jobs

2. **Parallel Execution:**
   - Independent jobs run in parallel
   - Use job dependencies wisely

3. **Artifact Size:**
   - Upload only necessary files
   - Use compression for large artifacts

4. **Concurrency:**
   - Cancel outdated runs automatically (already configured)

### Build Performance

**Optimize Vite Build:**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'es2020',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendors
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          i18n: ['i18next', 'react-i18next'],
        }
      }
    }
  }
})
```

---

## Status Badges

Add these to your `README.md`:

```markdown
# Alathasiba Calculator

![CI](https://github.com/YOUR_USERNAME/alathasiba-claudecode/workflows/CI/badge.svg)
![Translation Validation](https://github.com/YOUR_USERNAME/alathasiba-claudecode/workflows/Translation%20Validation/badge.svg)
![Bundle Size Check](https://github.com/YOUR_USERNAME/alathasiba-claudecode/workflows/Bundle%20Size%20Check/badge.svg)
![CodeQL](https://github.com/YOUR_USERNAME/alathasiba-claudecode/workflows/CodeQL%20Security%20Analysis/badge.svg)
![Deploy](https://github.com/YOUR_USERNAME/alathasiba-claudecode/workflows/Deploy/badge.svg)

[![codecov](https://codecov.io/gh/YOUR_USERNAME/alathasiba-claudecode/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/alathasiba-claudecode)
```

**Replace `YOUR_USERNAME` with your GitHub username!**

---

## Best Practices

### Git Workflow

1. **Always create feature branches**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Run CI checks locally before pushing**
   ```bash
   npm run ci
   ```

3. **Write meaningful commit messages**
   ```bash
   git commit -m "feat: add new calculator component"
   git commit -m "fix: resolve translation key issue"
   git commit -m "docs: update setup guide"
   ```

4. **Keep PRs focused and small**
   - One feature/fix per PR
   - Easier to review
   - Faster CI execution

### Continuous Improvement

1. **Monitor Workflow Performance:**
   - Check execution times in Actions tab
   - Optimize slow workflows

2. **Review Dependabot PRs Weekly:**
   - Keep dependencies up to date
   - Test updates before merging

3. **Check Security Alerts:**
   - Review CodeQL findings
   - Address vulnerabilities promptly

4. **Maintain Translation Coverage:**
   - Add translations with new features
   - Review translation reports

5. **Monitor Bundle Sizes:**
   - Track size trends
   - Optimize when approaching limits

---

## Support & Resources

### Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [CodeQL Documentation](https://codeql.github.com/docs/)

### Getting Help

1. **Check workflow logs** in Actions tab
2. **Review this documentation**
3. **Check existing issues** in repository
4. **Create new issue** using bug report template

### Contributing

Contributions to improve the CI/CD pipeline are welcome!

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## Changelog

### 2026-01-18 - Initial Release

- ✅ Complete CI/CD pipeline setup
- ✅ Multi-platform deployment support
- ✅ Translation validation
- ✅ Bundle size analysis
- ✅ Security scanning
- ✅ Comprehensive documentation

---

**Maintained by:** Raed Tayyem
**Last Updated:** 2026-01-18
**Version:** 1.0.0
