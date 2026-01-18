# Testing Guide

This document provides comprehensive information about the testing setup for the Alathasiba Calculator project.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Coverage](#coverage)
- [Best Practices](#best-practices)

## Overview

The project uses **Vitest** as the testing framework along with **React Testing Library** for component testing. This setup provides:

- Fast test execution with native ESM support
- Built-in coverage reporting with v8
- UI for interactive test exploration
- Full TypeScript support
- Component testing with jsdom

## Installation

Install all testing dependencies:

```bash
npm install
```

The following testing packages are included:

- `vitest` - Fast unit test framework
- `@vitest/ui` - Interactive UI for tests
- `@vitest/coverage-v8` - Code coverage reporting
- `@testing-library/react` - React component testing utilities
- `@testing-library/user-event` - User interaction simulation
- `@testing-library/jest-dom` - Custom DOM matchers
- `jsdom` - DOM implementation for Node.js

## Running Tests

### Basic Commands

```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Watch Mode

Watch mode automatically re-runs tests when files change:

```bash
npm test
```

### UI Mode

Interactive UI for exploring and debugging tests:

```bash
npm run test:ui
```

The UI will open at `http://localhost:51204` where you can:
- View test results in real-time
- Filter and search tests
- See code coverage
- Debug individual tests

### Coverage Reports

Generate coverage reports:

```bash
npm run test:coverage
```

Coverage reports are generated in multiple formats:
- **Text**: Console output
- **HTML**: `coverage/index.html` (open in browser)
- **LCOV**: `coverage/lcov.info` (for CI tools)
- **JSON**: `coverage/coverage-final.json`

## Test Structure

### Directory Organization

```
src/
├── components/
│   └── calculators/
│       └── __tests__/
│           ├── PercentageCalculator.test.tsx
│           └── BMICalculator.test.tsx
├── utils/
│   └── __tests__/
│       └── calculator-imports.test.ts
└── test/
    ├── setup.ts       # Test environment setup
    └── utils.tsx      # Testing utilities
```

### File Naming Convention

- Test files: `*.test.ts` or `*.test.tsx`
- Test directory: `__tests__/` folder
- Place tests near the code they test

## Writing Tests

### Component Tests

Example of testing a calculator component:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithProviders, screen, userEvent, waitFor } from '@/test/utils';
import PercentageCalculator from '../math/PercentageCalculator';

describe('PercentageCalculator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the calculator with initial state', () => {
    renderWithProviders(<PercentageCalculator />);

    expect(screen.getByText('Percentage Calculator')).toBeInTheDocument();
  });

  it('calculates percentage correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PercentageCalculator />);

    const percentInput = screen.getByPlaceholderText('Enter percentage');
    const valueInput = screen.getByPlaceholderText('Enter value');

    await user.type(percentInput, '20');
    await user.type(valueInput, '100');

    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await user.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('20.00')).toBeInTheDocument();
    });
  });
});
```

### Utility Tests

Example of testing utility functions:

```typescript
import { describe, it, expect } from 'vitest';
import { calculatorImports } from '../calculator-imports';

describe('calculator-imports', () => {
  it('should have defined calculator imports', () => {
    expect(calculatorImports).toBeDefined();
    expect(typeof calculatorImports).toBe('object');
  });

  it('should return promises from imports', () => {
    const result = calculatorImports.InheritanceCalculator();
    expect(result).toBeInstanceOf(Promise);
  });
});
```

### Testing Utilities

#### renderWithProviders

Use this helper to render components with all necessary providers:

```typescript
import { renderWithProviders } from '@/test/utils';

const { container } = renderWithProviders(<MyComponent />);
```

#### User Events

Simulate user interactions:

```typescript
import { userEvent } from '@/test/utils';

const user = userEvent.setup();
await user.type(input, 'value');
await user.click(button);
```

#### Waiting for Elements

Wait for async updates:

```typescript
import { waitFor } from '@/test/utils';

await waitFor(() => {
  expect(screen.getByText('Result')).toBeInTheDocument();
});
```

### Mocking

#### Mock Translation Hook

```typescript
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));
```

#### Mock Functions

```typescript
const mockFn = vi.fn();
mockFn.mockReturnValue('value');
mockFn.mockResolvedValue('async value');
```

## Coverage

### Coverage Thresholds

Minimum coverage requirements are set in `vitest.config.ts`:

- **Lines**: 60%
- **Functions**: 60%
- **Branches**: 60%
- **Statements**: 60%

### Excluded Files

The following are excluded from coverage:

- `node_modules/`
- `src/test/`
- Type definition files (`*.d.ts`)
- Configuration files (`*.config.*`)
- Mock data directories
- Build output (`dist/`)

### Viewing Coverage

After running `npm run test:coverage`, open the HTML report:

```bash
open coverage/index.html
```

## Best Practices

### 1. Test Structure

- Use `describe` blocks to group related tests
- Use clear, descriptive test names
- Follow the Arrange-Act-Assert pattern
- Keep tests focused and isolated

### 2. What to Test

**DO Test:**
- Component rendering
- User interactions
- State changes
- Error handling
- Calculations and logic
- Accessibility

**DON'T Test:**
- Implementation details
- External libraries
- Styles (unless critical to functionality)

### 3. Async Testing

Always wait for async operations:

```typescript
await waitFor(() => {
  expect(screen.getByText('Result')).toBeInTheDocument();
});
```

### 4. Query Priority

Use queries in this order:

1. `getByRole` - Best for accessibility
2. `getByLabelText` - Good for form inputs
3. `getByPlaceholderText` - Fallback for inputs
4. `getByText` - For non-interactive elements
5. `getByTestId` - Last resort

### 5. Cleanup

- Tests automatically cleanup after each run
- Clear mocks in `beforeEach` hooks
- Reset test state between tests

### 6. Performance

- Use `test:run` for CI/CD pipelines
- Avoid unnecessary `waitFor` calls
- Mock expensive operations
- Keep tests fast and focused

## Continuous Integration

### Running in CI

```bash
# Run tests without watch mode
npm run test:run

# Run with coverage
npm run test:coverage
```

### GitHub Actions Example

```yaml
- name: Run tests
  run: npm run test:run

- name: Generate coverage
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

## Troubleshooting

### Tests Not Running

1. Ensure all dependencies are installed: `npm install`
2. Check for TypeScript errors: `npm run type-check`
3. Clear cache: `rm -rf node_modules/.vite`

### Async Tests Timing Out

- Increase timeout in test: `{ timeout: 10000 }`
- Use proper `waitFor` with conditions
- Check for unresolved promises

### Coverage Not Generated

- Ensure you're using `npm run test:coverage`
- Check that files are not in the exclude list
- Verify files match the include pattern

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Support

For questions or issues with testing, please:
1. Check this documentation
2. Review existing tests for examples
3. Consult the official Vitest and Testing Library docs
