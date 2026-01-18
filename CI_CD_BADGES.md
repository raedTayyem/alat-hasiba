# CI/CD Status Badges

This document provides all the badge markdown for your README.md file.

## How to Use

1. Replace `YOUR_USERNAME` with your GitHub username
2. Replace `REPO_NAME` with your repository name (default: `alathasiba-claudecode`)
3. Copy and paste the relevant badges into your README.md

---

## Complete Badge Set

```markdown
<!-- CI/CD Status Badges -->

![CI](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/CI/badge.svg)
![Translation Validation](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Translation%20Validation/badge.svg)
![Bundle Size Check](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Bundle%20Size%20Check/badge.svg)
![CodeQL](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/CodeQL%20Security%20Analysis/badge.svg)
![Deploy](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Deploy/badge.svg)

<!-- Optional: Code Coverage Badge (if using Codecov) -->
[![codecov](https://codecov.io/gh/YOUR_USERNAME/REPO_NAME/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/REPO_NAME)

<!-- Optional: Additional Badges -->
![GitHub package.json version](https://img.shields.io/github/package-json/v/YOUR_USERNAME/REPO_NAME)
![GitHub](https://img.shields.io/github/license/YOUR_USERNAME/REPO_NAME)
![GitHub issues](https://img.shields.io/github/issues/YOUR_USERNAME/REPO_NAME)
![GitHub pull requests](https://img.shields.io/github/issues-pr/YOUR_USERNAME/REPO_NAME)
```

---

## Individual Badges

### Main CI Workflow

**Markdown:**
```markdown
![CI](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/CI/badge.svg)
```

**HTML:**
```html
<img src="https://github.com/YOUR_USERNAME/REPO_NAME/workflows/CI/badge.svg" alt="CI Status">
```

**Shows:**
- ✅ Passing: Green badge
- ❌ Failing: Red badge
- ⚠️ Running: Yellow badge

---

### Translation Validation

**Markdown:**
```markdown
![Translation Validation](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Translation%20Validation/badge.svg)
```

**HTML:**
```html
<img src="https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Translation%20Validation/badge.svg" alt="Translation Check">
```

---

### Bundle Size Check

**Markdown:**
```markdown
![Bundle Size Check](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Bundle%20Size%20Check/badge.svg)
```

**HTML:**
```html
<img src="https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Bundle%20Size%20Check/badge.svg" alt="Bundle Size">
```

---

### CodeQL Security Analysis

**Markdown:**
```markdown
![CodeQL](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/CodeQL%20Security%20Analysis/badge.svg)
```

**HTML:**
```html
<img src="https://github.com/YOUR_USERNAME/REPO_NAME/workflows/CodeQL%20Security%20Analysis/badge.svg" alt="CodeQL">
```

---

### Deployment

**Markdown:**
```markdown
![Deploy](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Deploy/badge.svg)
```

**HTML:**
```html
<img src="https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Deploy/badge.svg" alt="Deployment">
```

---

## Custom Translation Coverage Badges

These badges show actual coverage percentages (updated by the workflow):

**English Coverage:**
```markdown
![EN Coverage](https://img.shields.io/badge/EN_Coverage-85%25-green)
```

**Arabic Coverage:**
```markdown
![AR Coverage](https://img.shields.io/badge/AR_Coverage-85%25-green)
```

**Color Codes:**
- 90%+: `brightgreen`
- 80-89%: `green`
- 70-79%: `yellow`
- Below 70%: `red`

---

## Codecov Integration

**Requirements:**
1. Sign up at [codecov.io](https://codecov.io)
2. Enable your repository
3. Add `CODECOV_TOKEN` to GitHub secrets

**Badge:**
```markdown
[![codecov](https://codecov.io/gh/YOUR_USERNAME/REPO_NAME/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/REPO_NAME)
```

**Advanced Codecov Badge:**
```markdown
[![codecov](https://codecov.io/gh/YOUR_USERNAME/REPO_NAME/branch/main/graph/badge.svg?token=YOUR_TOKEN)](https://codecov.io/gh/YOUR_USERNAME/REPO_NAME)
```

---

## Additional Useful Badges

### Version Badge

```markdown
![GitHub package.json version](https://img.shields.io/github/package-json/v/YOUR_USERNAME/REPO_NAME)
```

### License Badge

```markdown
![GitHub](https://img.shields.io/github/license/YOUR_USERNAME/REPO_NAME)
```

### Issues Badge

```markdown
![GitHub issues](https://img.shields.io/github/issues/YOUR_USERNAME/REPO_NAME)
```

### Pull Requests Badge

```markdown
![GitHub pull requests](https://img.shields.io/github/issues-pr/YOUR_USERNAME/REPO_NAME)
```

### Last Commit Badge

```markdown
![GitHub last commit](https://img.shields.io/github/last-commit/YOUR_USERNAME/REPO_NAME)
```

### Stars Badge

```markdown
![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/REPO_NAME?style=social)
```

### Forks Badge

```markdown
![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/REPO_NAME?style=social)
```

---

## Platform-Specific Badges

### Netlify

```markdown
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_SITE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_SITE_NAME/deploys)
```

### Vercel

```markdown
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://your-app.vercel.app)
```

### GitHub Pages

```markdown
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-blue?logo=github)](https://YOUR_USERNAME.github.io/REPO_NAME)
```

---

## Custom Shields.io Badges

Create custom badges at [shields.io](https://shields.io):

**Example: Project Status**
```markdown
![Status](https://img.shields.io/badge/Status-Active-success)
```

**Example: Maintenance**
```markdown
![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)
```

**Example: Node Version**
```markdown
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
```

**Example: TypeScript**
```markdown
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
```

**Example: React**
```markdown
![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
```

**Example: Vite**
```markdown
![Vite](https://img.shields.io/badge/Vite-7.1-purple?logo=vite)
```

---

## README.md Example Layout

Here's a complete example of how to organize badges in your README:

```markdown
# Alathasiba Calculator

> Comprehensive calculator collection with multi-language support

<!-- Build Status -->
![CI](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/CI/badge.svg)
![Deploy](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Deploy/badge.svg)
![CodeQL](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/CodeQL%20Security%20Analysis/badge.svg)

<!-- Quality Metrics -->
![Translation Validation](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Translation%20Validation/badge.svg)
![Bundle Size Check](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Bundle%20Size%20Check/badge.svg)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/REPO_NAME/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/REPO_NAME)

<!-- Project Info -->
![GitHub package.json version](https://img.shields.io/github/package-json/v/YOUR_USERNAME/REPO_NAME)
![GitHub](https://img.shields.io/github/license/YOUR_USERNAME/REPO_NAME)
![GitHub issues](https://img.shields.io/github/issues/YOUR_USERNAME/REPO_NAME)
![GitHub pull requests](https://img.shields.io/github/issues-pr/YOUR_USERNAME/REPO_NAME)

<!-- Tech Stack -->
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1-purple?logo=vite)

## Features

[Your content here...]

## Demo

[Your demo link here...]

## Installation

[Your installation instructions here...]
```

---

## Centered Badges

For a centered badge display in your README:

```markdown
<div align="center">

# Alathasiba Calculator

![CI](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/CI/badge.svg)
![Translation Validation](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Translation%20Validation/badge.svg)
![Bundle Size Check](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Bundle%20Size%20Check/badge.svg)
![CodeQL](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/CodeQL%20Security%20Analysis/badge.svg)
![Deploy](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Deploy/badge.svg)

</div>
```

---

## Multi-line Badge Layout

For better organization with multiple badges:

```markdown
## Status

### Build & Deployment
![CI](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/CI/badge.svg)
![Deploy](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Deploy/badge.svg)

### Quality & Security
![Translation Validation](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Translation%20Validation/badge.svg)
![Bundle Size Check](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Bundle%20Size%20Check/badge.svg)
![CodeQL](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/CodeQL%20Security%20Analysis/badge.svg)

### Coverage & Metrics
[![codecov](https://codecov.io/gh/YOUR_USERNAME/REPO_NAME/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/REPO_NAME)
![EN Coverage](https://img.shields.io/badge/EN_Coverage-85%25-green)
![AR Coverage](https://img.shields.io/badge/AR_Coverage-85%25-green)
```

---

## Table Layout

For a clean table format:

```markdown
## Project Status

| Category | Status |
|----------|--------|
| CI/CD | ![CI](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/CI/badge.svg) |
| Deployment | ![Deploy](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Deploy/badge.svg) |
| Security | ![CodeQL](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/CodeQL%20Security%20Analysis/badge.svg) |
| Translations | ![Translation Validation](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Translation%20Validation/badge.svg) |
| Bundle Size | ![Bundle Size Check](https://github.com/YOUR_USERNAME/REPO_NAME/workflows/Bundle%20Size%20Check/badge.svg) |
| Coverage | [![codecov](https://codecov.io/gh/YOUR_USERNAME/REPO_NAME/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/REPO_NAME) |
```

---

## Notes

1. **Badge Updates**: GitHub badges update automatically when workflows run
2. **Custom Colors**: Use shields.io for custom badge colors and styles
3. **Linking**: Badges can be clickable links to Actions tab or external services
4. **Caching**: Badges may cache for up to 5 minutes

---

## Quick Start

1. Copy the "Complete Badge Set" section above
2. Replace `YOUR_USERNAME` with your GitHub username
3. Replace `REPO_NAME` with `alathasiba-claudecode` (or your repo name)
4. Paste into your README.md
5. Commit and push!

---

**Last Updated:** 2026-01-18
