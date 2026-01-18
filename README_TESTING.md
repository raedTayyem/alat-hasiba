# Vitest Testing Framework - Complete Setup

This comprehensive testing framework has been set up for the Alathasiba Calculator project using **Vitest**, **React Testing Library**, and **jsdom**.

## Quick Links

- [Installation Guide](INSTALLATION_GUIDE.md) - Detailed installation instructions
- [Testing Guide](TESTING.md) - Comprehensive testing documentation
- [Quick Start](TEST_QUICKSTART.md) - Get started in 5 minutes
- [Setup Summary](TESTING_SETUP_SUMMARY.md) - Complete overview of all files

## What's Included

### Testing Framework
- ✅ **Vitest** v1.0.4 - Fast, modern test runner
- ✅ **@vitest/ui** - Interactive test UI
- ✅ **@vitest/coverage-v8** - Code coverage reporting
- ✅ **React Testing Library** - Component testing utilities
- ✅ **jsdom** - Browser environment for Node.js
- ✅ **TypeScript** support

### Sample Tests (23+ test cases)
- ✅ **PercentageCalculator.test.tsx** - 6 tests
- ✅ **BMICalculator.test.tsx** - 9 tests
- ✅ **CalculatorButtons.test.tsx** - 7 tests
- ✅ **calculator-imports.test.ts** - 8+ test suites

### Configuration Files
- ✅ **vitest.config.ts** - Main configuration
- ✅ **src/test/setup.ts** - Test environment setup
- ✅ **src/test/utils.tsx** - Custom testing utilities
- ✅ **.github/workflows/test.yml** - CI/CD workflow

### Documentation
- ✅ **TESTING.md** - Comprehensive guide (100+ sections)
- ✅ **TEST_QUICKSTART.md** - 5-minute quick start
- ✅ **INSTALLATION_GUIDE.md** - Installation details
- ✅ **TESTING_SETUP_SUMMARY.md** - Complete file overview

## Installation

```bash
npm install
```

This installs all required dependencies:
- vitest
- @vitest/ui
- @vitest/coverage-v8
- @testing-library/react
- @testing-library/user-event
- @testing-library/jest-dom
- jsdom

## Usage

### Run Tests (Watch Mode)
```bash
npm test
```

### Run Tests Once (CI Mode)
```bash
npm run test:run
```

### Interactive Test UI
```bash
npm run test:ui
```
Opens at `http://localhost:51204`

### Coverage Report
```bash
npm run test:coverage
open coverage/index.html
```

## Project Structure

```
project-root/
├── .github/
│   └── workflows/
│       └── test.yml                    # GitHub Actions CI/CD
├── coverage/                           # Generated coverage reports
├── src/
│   ├── components/
│   │   ├── calculators/
│   │   │   ├── math/
│   │   │   │   └── PercentageCalculator.tsx
│   │   │   ├── health/
│   │   │   │   └── BMICalculator.tsx
│   │   │   └── __tests__/
│   │   │       ├── PercentageCalculator.test.tsx
│   │   │       └── BMICalculator.test.tsx
│   │   └── ui/
│   │       ├── CalculatorButtons.tsx
│   │       └── __tests__/
│   │           └── CalculatorButtons.test.tsx
│   ├── test/
│   │   ├── setup.ts                    # Test setup
│   │   ├── utils.tsx                   # Testing utilities
│   │   └── mocks/                      # Mock handlers
│   └── utils/
│       ├── calculator-imports.ts
│       └── __tests__/
│           └── calculator-imports.test.ts
├── vitest.config.ts                    # Vitest configuration
├── package.json                        # Updated with scripts
├── TESTING.md                          # Full testing guide
├── TEST_QUICKSTART.md                  # Quick start guide
├── INSTALLATION_GUIDE.md               # Installation guide
├── TESTING_SETUP_SUMMARY.md            # Setup summary
└── README_TESTING.md                   # This file
```

## Test Commands

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm test` | Watch mode | Development |
| `npm run test:run` | Run once | CI/CD |
| `npm run test:ui` | Interactive UI | Debugging |
| `npm run test:coverage` | Coverage report | Quality check |

## Writing Tests

### Example: Component Test

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@/test/utils';
import MyCalculator from '../math/MyCalculator';

// Mock translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('MyCalculator', () => {
  it('calculates correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MyCalculator />);

    const input = screen.getByPlaceholderText('Enter value');
    await user.type(input, '42');

    const button = screen.getByRole('button', { name: /calculate/i });
    await user.click(button);

    expect(screen.getByText('Result: 42')).toBeInTheDocument();
  });
});
```

### Example: Utility Test

```typescript
import { describe, it, expect } from 'vitest';
import { myUtility } from '../myUtility';

describe('myUtility', () => {
  it('returns correct value', () => {
    expect(myUtility(10)).toBe(20);
  });
});
```

## Coverage Configuration

### Minimum Thresholds (60%)
- Lines: 60%
- Functions: 60%
- Branches: 60%
- Statements: 60%

### Excluded from Coverage
- node_modules/
- src/test/
- *.d.ts
- *.config.*
- dist/

## CI/CD Integration

### GitHub Actions
Tests automatically run on:
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

Matrix testing on:
- Node.js 18.x
- Node.js 20.x

### Workflow Steps
1. Type checking (`npm run type-check`)
2. Linting (`npm run lint`)
3. Tests (`npm run test:run`)
4. Coverage (`npm run test:coverage`)
5. Build verification (`npm run build`)
6. Upload to Codecov

## Features

### Test Environment
- ✅ jsdom for DOM simulation
- ✅ React Testing Library for component testing
- ✅ User event simulation
- ✅ Async testing support
- ✅ Mock functions and modules

### Developer Experience
- ✅ Fast test execution
- ✅ Watch mode for instant feedback
- ✅ Interactive UI for debugging
- ✅ Clear error messages
- ✅ TypeScript support

### Coverage Reporting
- ✅ Multiple formats (text, HTML, LCOV, JSON)
- ✅ Threshold enforcement
- ✅ Detailed file coverage
- ✅ Browser-viewable reports

### Testing Utilities
- ✅ `renderWithProviders()` - Render with all providers
- ✅ `waitFor()` - Wait for async operations
- ✅ `userEvent` - Simulate user interactions
- ✅ Custom helpers for common patterns

## Best Practices

### 1. Test Structure
```typescript
describe('Feature', () => {
  beforeEach(() => {
    // Setup
  });

  it('does something specific', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### 2. Query Priority
1. `getByRole` (best for accessibility)
2. `getByLabelText` (good for forms)
3. `getByPlaceholderText` (fallback)
4. `getByText` (non-interactive)
5. `getByTestId` (last resort)

### 3. Async Testing
```typescript
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### 4. User Events
```typescript
const user = userEvent.setup();
await user.type(input, 'value');
await user.click(button);
```

## Documentation Quick Reference

### For Quick Start
Read: [TEST_QUICKSTART.md](TEST_QUICKSTART.md)
- 5-minute setup
- First test example
- Common patterns

### For Installation
Read: [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)
- Prerequisites
- Package installation
- Verification steps
- Troubleshooting

### For Comprehensive Guide
Read: [TESTING.md](TESTING.md)
- Complete testing guide
- All features explained
- Advanced patterns
- Best practices

### For File Overview
Read: [TESTING_SETUP_SUMMARY.md](TESTING_SETUP_SUMMARY.md)
- All files created
- Configuration details
- Test statistics

## Troubleshooting

### Tests not running?
```bash
rm -rf node_modules package-lock.json
npm install
npm test
```

### Coverage not generating?
```bash
npm install -D @vitest/coverage-v8
npm run test:coverage
```

### Port already in use?
```bash
lsof -ti:51204 | xargs kill -9
npm run test:ui
```

### TypeScript errors?
```bash
npm run type-check
```

## Resources

### Official Documentation
- [Vitest](https://vitest.dev/) - Test framework
- [Testing Library](https://testing-library.com/) - Component testing
- [jsdom](https://github.com/jsdom/jsdom) - DOM implementation

### Internal Documentation
- [TESTING.md](TESTING.md) - Full guide
- [TEST_QUICKSTART.md](TEST_QUICKSTART.md) - Quick start
- [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) - Installation
- [TESTING_SETUP_SUMMARY.md](TESTING_SETUP_SUMMARY.md) - Overview

## Next Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run existing tests**
   ```bash
   npm test
   ```

3. **Explore test UI**
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

## Support

Need help?
1. Check the documentation files
2. Review sample tests
3. Consult official Vitest/Testing Library docs
4. Check existing GitHub issues

## Summary

You now have a production-ready testing framework with:

✅ Fast test execution
✅ Interactive debugging UI
✅ Comprehensive coverage reporting
✅ CI/CD integration
✅ Sample tests for reference
✅ Complete documentation
✅ Best practices guide

**Start testing today!**

---

**Setup Date:** 2026-01-18
**Framework:** Vitest 1.0.4
**Coverage Provider:** v8
**Test Files:** 4 test files, 23+ test cases
**Documentation:** 4 comprehensive guides
