# GitHub Actions CI/CD Pipeline Documentation

This directory contains all GitHub Actions workflows for the Alathasiba Calculator project. Our CI/CD pipeline ensures code quality, security, and reliable deployments.

## Workflows Overview

### 1. CI Workflow (`ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**
- **Lint**: Runs ESLint to check code quality
- **Type Check**: Validates TypeScript types
- **Test**: Runs tests on Node.js 18 and 20 (matrix)
  - Generates coverage reports
  - Uploads coverage to Codecov
- **Build**: Compiles the project and verifies output
- **Quality Gate**: Ensures all checks pass before allowing merge

**Artifacts:**
- Coverage reports (7 days retention)
- Build output (7 days retention)

**Status Badges:**
```markdown
![CI](https://github.com/YOUR_USERNAME/alathasiba-claudecode/workflows/CI/badge.svg)
```

---

### 2. Translation Validation Workflow (`translation-check.yml`)

**Triggers:**
- Pull requests with changes to translation files or components
- Push to `main` or `develop` branches
- Manual workflow dispatch

**Jobs:**
- Analyzes translation coverage using `analyze-translations.cjs`
- Checks coverage thresholds (minimum 80% for EN and AR)
- Posts detailed coverage report as PR comment
- Fails if coverage drops below threshold

**Key Metrics:**
- Total calculators analyzed
- Average EN/AR coverage percentage
- Number of fully translated calculators
- Top calculators with missing translations

**Artifacts:**
- Translation analysis report (30 days retention)

**Status Badges:**
```markdown
![Translation Coverage](https://img.shields.io/badge/EN_Coverage-XX%25-green)
![Translation Coverage](https://img.shields.io/badge/AR_Coverage-XX%25-green)
```

---

### 3. Bundle Size Check Workflow (`bundle-size.yml`)

**Triggers:**
- Pull requests to `main` or `develop` branches
- Push to `main` branch
- Manual workflow dispatch

**Jobs:**
- Builds the project and analyzes bundle sizes
- Compares bundle sizes with base branch (on PRs)
- Checks against size limits:
  - Main bundle: 500 KB limit
  - Total JS: 2 MB limit
- Posts detailed bundle analysis as PR comment

**Artifacts:**
- Bundle analysis report (30 days retention)
- Build output (30 days retention)

**Quality Gates:**
- Fails if bundle size exceeds configured limits
- Warns if bundle size increases significantly

---

### 4. Deployment Workflow (`deploy.yml`)

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**Environment:** Production

**Supported Deployment Targets:**
1. **GitHub Pages** (default)
2. **Netlify**
3. **Vercel**
4. **FTP/SFTP**
5. **AWS S3 + CloudFront**

**Configuration:**
Set the `DEPLOY_TARGET` repository variable to your preferred platform.

**Required Secrets by Platform:**

**GitHub Pages:**
- No additional secrets needed

**Netlify:**
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

**Vercel:**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

**FTP:**
- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`

**AWS S3:**
- `AWS_S3_BUCKET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_CLOUDFRONT_DISTRIBUTION_ID` (optional)

**Jobs:**
- Build production assets
- Deploy to configured platform
- Create deployment summary
- Notify via Slack (optional)
- Create GitHub release (optional)

**Artifacts:**
- Production deployment (90 days retention)

---

### 5. CodeQL Security Analysis Workflow (`codeql.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Weekly schedule (Mondays at 2:00 AM)
- Manual workflow dispatch

**Jobs:**
- **CodeQL Analysis**: Scans code for security vulnerabilities
- **Dependency Review**: Reviews dependency changes in PRs
- **Secret Scanning**: Uses TruffleHog to detect leaked secrets
- **Security Summary**: Aggregates all security scan results

**Security Checks:**
- Code quality and security patterns
- Vulnerable dependencies
- Exposed secrets and credentials

---

## Dependabot Configuration (`dependabot.yml`)

Automatically creates pull requests for dependency updates.

**NPM Dependencies:**
- Schedule: Weekly on Mondays at 3:00 AM
- Max open PRs: 10
- Groups related dependencies (React, Vite, ESLint, etc.)

**GitHub Actions:**
- Schedule: Monthly on Mondays at 3:00 AM
- Max open PRs: 5

**Dependency Groups:**
- `react`: All React-related packages
- `vite`: Vite and plugins
- `eslint`: ESLint and TypeScript ESLint
- `i18n`: Internationalization libraries
- `tailwind`: Tailwind CSS and related packages

---

## Setting Up CI/CD

### 1. Enable GitHub Actions

1. Go to repository Settings > Actions > General
2. Enable "Allow all actions and reusable workflows"
3. Set workflow permissions to "Read and write permissions"

### 2. Configure Secrets

Go to Settings > Secrets and variables > Actions

**Required for All:**
- None (basic CI works out of the box)

**Optional for Enhanced Features:**
- `CODECOV_TOKEN`: For code coverage reporting
- `SLACK_WEBHOOK_URL`: For deployment notifications

**Deployment Secrets:**
Add secrets based on your deployment target (see Deployment Workflow section)

### 3. Configure Variables

Go to Settings > Secrets and variables > Actions > Variables tab

**Recommended Variables:**
- `DEPLOY_TARGET`: `github-pages`, `netlify`, `vercel`, `ftp`, or `s3`
- `CUSTOM_DOMAIN`: Your custom domain (for GitHub Pages)
- `PRODUCTION_URL`: Production URL (for FTP/S3 deployments)
- `AUTO_RELEASE`: `true` to enable automatic releases
- `AWS_REGION`: AWS region (default: `us-east-1`)

### 4. Set Up Branch Protection

1. Go to Settings > Branches
2. Add rule for `main` branch:
   - Require pull request reviews
   - Require status checks to pass:
     - `Lint`
     - `TypeScript Type Check`
     - `Test (Node 20)`
     - `Build`
   - Require branches to be up to date
   - Include administrators

---

## Local Testing

### Run CI checks locally:

```bash
# Run all CI checks
npm run ci

# Individual checks
npm run type-check
npm run lint
npm test:run
npm run build

# Translation analysis
npm run analyze:translations

# Bundle analysis
npm run analyze:bundle
```

---

## Troubleshooting

### CI Failing on Type Check

```bash
# Run locally to see errors
npm run type-check

# Fix automatically where possible
npm run lint:fix
```

### Translation Coverage Below Threshold

```bash
# Run translation analysis
npm run analyze:translations

# Check the report
cat translation-coverage-report.txt
```

### Bundle Size Exceeded

```bash
# Build and check sizes
npm run build
du -sh dist/*

# Analyze bundle
npm run analyze:bundle
```

### Deployment Fails

1. Verify all required secrets are set
2. Check deployment logs in Actions tab
3. Ensure `DEPLOY_TARGET` variable is set correctly
4. Verify platform-specific credentials

---

## Badge Markdown

Add these badges to your README.md:

```markdown
# Status Badges

![CI](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/CI/badge.svg)
![Translation Check](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Translation%20Validation/badge.svg)
![Bundle Size](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Bundle%20Size%20Check/badge.svg)
![CodeQL](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/CodeQL%20Security%20Analysis/badge.svg)
![Deploy](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Deploy/badge.svg)

# Coverage Badge (if using Codecov)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/REPO_NAME/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/REPO_NAME)
```

---

## Workflow Execution Flow

### Pull Request Flow

```
1. Developer creates PR
   ↓
2. CI Workflow runs
   ↓
3. Translation Check runs (if translations changed)
   ↓
4. Bundle Size Check runs
   ↓
5. CodeQL Analysis runs
   ↓
6. All checks must pass (Quality Gate)
   ↓
7. PR can be merged
```

### Deployment Flow

```
1. PR merged to main
   ↓
2. CI Workflow runs
   ↓
3. All checks pass
   ↓
4. Deploy Workflow triggers
   ↓
5. Production deployment
   ↓
6. Notifications sent
   ↓
7. Optional: GitHub release created
```

---

## Performance Optimization

### Caching Strategy

- **npm dependencies**: Cached using `actions/setup-node@v4` with `cache: 'npm'`
- **Build outputs**: Cached between jobs using artifacts
- **Cache invalidation**: Automatic on package-lock.json changes

### Parallel Execution

- Lint, Type Check, and Test jobs run in parallel
- Build job runs after lint and type-check (optimized path)
- Matrix strategy for testing multiple Node versions

### Concurrency Control

- Automatic cancellation of in-progress runs on new pushes
- Prevents duplicate deployments with deployment concurrency groups

---

## Best Practices

1. **Always run CI checks locally before pushing**
2. **Keep translation coverage above 80%**
3. **Monitor bundle sizes regularly**
4. **Review Dependabot PRs weekly**
5. **Check security alerts promptly**
6. **Use conventional commit messages**
7. **Add tests for new features**
8. **Update documentation with code changes**

---

## Support

For issues or questions about the CI/CD pipeline:

1. Check this documentation
2. Review workflow logs in Actions tab
3. Check existing issues and PRs
4. Create a new issue using the bug report template

---

## Contributing

When modifying workflows:

1. Test changes in a fork first
2. Document new requirements
3. Update this README
4. Add comments to workflow files
5. Test locally when possible

---

**Last Updated:** 2026-01-18
**Maintainer:** Raed Tayyem
