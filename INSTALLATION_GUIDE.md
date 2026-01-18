# Testing Framework Installation Guide

This guide walks you through installing the Vitest testing framework for the Alathasiba Calculator project.

## Prerequisites

- Node.js 18.x or 20.x
- npm 9.x or higher

## Installation Steps

### Step 1: Install Dependencies

Run the following command to install all testing dependencies:

```bash
npm install
```

This will install the following packages:

### Core Testing Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `vitest` | ^1.0.4 | Fast unit test framework with ESM support |
| `@vitest/ui` | ^1.0.4 | Interactive UI for test exploration |
| `@vitest/coverage-v8` | ^1.0.4 | Code coverage using V8 |

### React Testing Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `@testing-library/react` | ^14.1.2 | React component testing utilities |
| `@testing-library/user-event` | ^14.5.1 | Advanced user interaction simulation |
| `@testing-library/jest-dom` | ^6.1.5 | Custom DOM matchers for assertions |

### Environment Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `jsdom` | ^23.0.1 | DOM implementation for Node.js |

## Manual Installation (If Needed)

If you prefer to install packages manually:

```bash
# Core testing framework
npm install -D vitest @vitest/ui @vitest/coverage-v8

# React testing utilities
npm install -D @testing-library/react @testing-library/user-event @testing-library/jest-dom

# DOM environment
npm install -D jsdom
```

## Verification

After installation, verify the setup:

### 1. Check Package Installation

```bash
npm list vitest
npm list @testing-library/react
npm list jsdom
```

### 2. Run Tests

```bash
npm test
```

You should see output like:

```
✓ src/components/calculators/__tests__/PercentageCalculator.test.tsx (6)
✓ src/components/calculators/__tests__/BMICalculator.test.tsx (9)
✓ src/utils/__tests__/calculator-imports.test.ts (8)

Test Files  3 passed (3)
Tests  23 passed (23)
```

### 3. Check Test UI

```bash
npm run test:ui
```

Should open a browser at `http://localhost:51204`

### 4. Generate Coverage

```bash
npm run test:coverage
```

Should generate coverage reports in the `coverage/` directory.

## Configuration Files

The following files have been created/modified:

### New Files

1. **vitest.config.ts** - Vitest configuration
   - Test environment: jsdom
   - Coverage settings
   - Path aliases
   - File patterns

2. **src/test/setup.ts** - Test environment setup
   - Global test configuration
   - DOM API mocks
   - Cleanup hooks

3. **src/test/utils.tsx** - Testing utilities
   - Custom render function with providers
   - Helper functions
   - Re-exported testing library functions

4. **Test files:**
   - `src/components/calculators/__tests__/PercentageCalculator.test.tsx`
   - `src/components/calculators/__tests__/BMICalculator.test.tsx`
   - `src/components/ui/__tests__/CalculatorButtons.test.tsx`
   - `src/utils/__tests__/calculator-imports.test.ts`

### Modified Files

1. **package.json**
   - Added test scripts
   - Added devDependencies

## Scripts Added

The following npm scripts are now available:

```json
{
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage",
  "test:run": "vitest run"
}
```

## Directory Structure

After installation, your project structure will include:

```
project-root/
├── .github/
│   └── workflows/
│       └── test.yml                    # CI/CD workflow
├── coverage/                           # Generated coverage reports
│   ├── index.html
│   └── lcov.info
├── src/
│   ├── components/
│   │   ├── calculators/
│   │   │   └── __tests__/
│   │   │       ├── PercentageCalculator.test.tsx
│   │   │       └── BMICalculator.test.tsx
│   │   └── ui/
│   │       └── __tests__/
│   │           └── CalculatorButtons.test.tsx
│   ├── test/
│   │   ├── setup.ts
│   │   ├── utils.tsx
│   │   └── mocks/
│   │       ├── handlers.ts
│   │       └── server.ts
│   └── utils/
│       └── __tests__/
│           ├── calculator-imports.test.ts
│           └── dateFormatters.test.ts
├── vitest.config.ts                   # Vitest configuration
├── TESTING.md                         # Comprehensive testing guide
├── TEST_QUICKSTART.md                 # Quick start guide
└── INSTALLATION_GUIDE.md              # This file
```

## Troubleshooting

### Issue: "Cannot find module 'vitest'"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "jsdom not found"

**Solution:**
```bash
npm install -D jsdom
```

### Issue: Tests fail with TypeScript errors

**Solution:**
```bash
npm run type-check
```

Fix any TypeScript errors before running tests.

### Issue: Coverage not generating

**Solution:**
```bash
npm install -D @vitest/coverage-v8
npm run test:coverage
```

### Issue: Port already in use (test:ui)

**Solution:**

Kill the process using port 51204:
```bash
lsof -ti:51204 | xargs kill -9
```

Or specify a different port:
```bash
vitest --ui --port 51205
```

## Next Steps

1. **Read Documentation**
   - Review `TESTING.md` for comprehensive guide
   - Review `TEST_QUICKSTART.md` for quick start

2. **Run Existing Tests**
   ```bash
   npm test
   ```

3. **Explore Test UI**
   ```bash
   npm run test:ui
   ```

4. **Check Coverage**
   ```bash
   npm run test:coverage
   open coverage/index.html
   ```

5. **Write Your Own Tests**
   - Use existing tests as templates
   - Follow testing best practices
   - Aim for >60% coverage

## Support

For issues or questions:
1. Check this guide and `TESTING.md`
2. Review Vitest documentation: https://vitest.dev/
3. Review Testing Library docs: https://testing-library.com/
4. Check existing test files for examples

## Summary

You now have a complete testing framework installed with:

- Fast test execution with Vitest
- Interactive test UI
- Code coverage reporting
- React component testing utilities
- Sample tests to learn from
- CI/CD workflow for GitHub Actions

Start testing your calculator components today!
