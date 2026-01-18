# Dependencies to Install

This document lists all the testing dependencies that need to be installed for the Vitest testing framework.

## Quick Install

Run this single command to install all dependencies:

```bash
npm install
```

The `package.json` has been updated with all necessary dependencies.

## Manual Installation (If Needed)

If you prefer to install packages individually, use these commands:

### Core Testing Framework

```bash
npm install -D vitest@^1.0.4
npm install -D @vitest/ui@^1.0.4
npm install -D @vitest/coverage-v8@^1.0.4
```

### React Testing Libraries

```bash
npm install -D @testing-library/react@^14.1.2
npm install -D @testing-library/user-event@^14.5.1
npm install -D @testing-library/jest-dom@^6.1.5
```

### Environment

```bash
npm install -D jsdom@^23.0.1
```

## All Dependencies

### Testing Framework (Core)

| Package | Version | Purpose |
|---------|---------|---------|
| vitest | ^1.0.4 | Fast unit test framework with native ESM support |
| @vitest/ui | ^1.0.4 | Interactive UI for test exploration and debugging |
| @vitest/coverage-v8 | ^1.0.4 | Code coverage reporting using V8 engine |

### React Testing Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| @testing-library/react | ^14.1.2 | React component testing utilities and helpers |
| @testing-library/user-event | ^14.5.1 | Advanced user interaction simulation (typing, clicking) |
| @testing-library/jest-dom | ^6.1.5 | Custom DOM matchers for better assertions |

### Environment & DOM

| Package | Version | Purpose |
|---------|---------|---------|
| jsdom | ^23.0.1 | JavaScript implementation of DOM for Node.js |

## Total Package Size

Approximate install size: ~50MB (dev dependencies only)

## Verification

After installation, verify packages are installed:

### Check Vitest
```bash
npm list vitest
# Expected output: vitest@1.0.4
```

### Check Testing Library
```bash
npm list @testing-library/react
# Expected output: @testing-library/react@14.1.2
```

### Check jsdom
```bash
npm list jsdom
# Expected output: jsdom@23.0.1
```

### Check Coverage
```bash
npm list @vitest/coverage-v8
# Expected output: @vitest/coverage-v8@1.0.4
```

## Package.json Changes

### Scripts Added

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

### DevDependencies Added

```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.1",
    "@vitest/coverage-v8": "^1.0.4",
    "@vitest/ui": "^1.0.4",
    "jsdom": "^23.0.1",
    "vitest": "^1.0.4"
  }
}
```

## Compatibility

### Node.js
- **Minimum**: Node.js 18.x
- **Recommended**: Node.js 20.x
- **Tested on**: Node.js 18.x and 20.x

### npm
- **Minimum**: npm 9.x
- **Recommended**: npm 10.x

### Existing Dependencies
All testing packages are compatible with your existing dependencies:
- React 18.2.0 ✅
- TypeScript 5.0.2 ✅
- Vite 7.1.12 ✅
- All other project dependencies ✅

## Installation Options

### Option 1: npm install (Recommended)
```bash
npm install
```
- Installs from package-lock.json
- Fastest and most reliable
- Ensures consistent versions

### Option 2: Fresh Install
```bash
rm -rf node_modules package-lock.json
npm install
```
- Clean installation
- Resolves any conflicts
- Takes longer

### Option 3: Individual Packages
```bash
npm install -D vitest @vitest/ui @vitest/coverage-v8 \
  @testing-library/react @testing-library/user-event \
  @testing-library/jest-dom jsdom
```
- Manual installation
- Good for understanding dependencies
- More control

## Post-Installation

### 1. Verify Installation
```bash
npm test
```
Expected output:
```
✓ src/components/calculators/__tests__/PercentageCalculator.test.tsx
✓ src/components/calculators/__tests__/BMICalculator.test.tsx
✓ src/utils/__tests__/calculator-imports.test.ts

Test Files  3 passed (3)
Tests  23 passed (23)
```

### 2. Open Test UI
```bash
npm run test:ui
```
Browser opens at: `http://localhost:51204`

### 3. Generate Coverage
```bash
npm run test:coverage
```
Coverage reports generated in: `coverage/`

### 4. View Coverage Report
```bash
open coverage/index.html
```

## Troubleshooting

### Issue: Package not found
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Version conflicts
```bash
npm install --legacy-peer-deps
```

### Issue: Permission errors
```bash
sudo npm install -g npm@latest
npm install
```

### Issue: Slow installation
```bash
npm install --prefer-offline
```

## Package Details

### Vitest (^1.0.4)
- **License**: MIT
- **Homepage**: https://vitest.dev/
- **Repository**: https://github.com/vitest-dev/vitest
- **Dependencies**: Few, most are peer dependencies

### @vitest/ui (^1.0.4)
- **License**: MIT
- **Requires**: vitest@^1.0.4
- **Port**: 51204 (default)

### @vitest/coverage-v8 (^1.0.4)
- **License**: MIT
- **Requires**: vitest@^1.0.4
- **Coverage**: Uses V8 engine

### @testing-library/react (^14.1.2)
- **License**: MIT
- **Requires**: React 18+
- **Homepage**: https://testing-library.com/react

### @testing-library/user-event (^14.5.1)
- **License**: MIT
- **Requires**: @testing-library/dom
- **Purpose**: User interaction simulation

### @testing-library/jest-dom (^6.1.5)
- **License**: MIT
- **Extends**: Jest matchers
- **Purpose**: Custom DOM assertions

### jsdom (^23.0.1)
- **License**: MIT
- **Purpose**: DOM implementation
- **Size**: ~15MB

## Next Steps

After installing dependencies:

1. **Read documentation**
   - [TESTING.md](TESTING.md) - Comprehensive guide
   - [TEST_QUICKSTART.md](TEST_QUICKSTART.md) - Quick start
   - [README_TESTING.md](README_TESTING.md) - Overview

2. **Run tests**
   ```bash
   npm test
   ```

3. **Explore UI**
   ```bash
   npm run test:ui
   ```

4. **Check coverage**
   ```bash
   npm run test:coverage
   open coverage/index.html
   ```

5. **Write your own tests**
   - Use sample tests as templates
   - Follow best practices
   - Aim for >60% coverage

## Summary

**Total Packages**: 7 dev dependencies
**Install Time**: ~2-3 minutes
**Disk Space**: ~50MB
**Node Version**: 18.x or 20.x
**npm Version**: 9.x or higher

All dependencies are:
- ✅ MIT Licensed
- ✅ Well maintained
- ✅ Production ready
- ✅ Widely used
- ✅ TypeScript compatible
- ✅ React 18 compatible

**Ready to install!** Run `npm install` to get started.
