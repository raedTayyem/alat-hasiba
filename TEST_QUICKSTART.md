# Test Quick Start Guide

Get started with testing in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

This will install all testing dependencies including:
- vitest
- @vitest/ui
- @testing-library/react
- @testing-library/jest-dom
- jsdom

## Step 2: Run Your First Test

```bash
npm test
```

This opens Vitest in watch mode. You should see:
- ✓ 3 test suites passing
- ✓ Multiple test cases passing

## Step 3: Explore Test UI (Optional)

```bash
npm run test:ui
```

Opens an interactive UI at `http://localhost:51204` where you can:
- Browse all tests
- See which tests pass/fail
- View code coverage
- Debug failing tests

## Step 4: Check Coverage

```bash
npm run test:coverage
```

Then open the HTML report:

```bash
open coverage/index.html
```

You'll see:
- Line coverage
- Function coverage
- Branch coverage
- Files that need more tests

## Example: Writing Your First Test

Create a new test file at `src/components/calculators/__tests__/MyCalculator.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen, userEvent } from '@/test/utils';
import MyCalculator from '../math/MyCalculator';

describe('MyCalculator', () => {
  it('renders correctly', () => {
    renderWithProviders(<MyCalculator />);

    expect(screen.getByText('My Calculator')).toBeInTheDocument();
  });

  it('performs calculation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MyCalculator />);

    // Find inputs
    const input1 = screen.getByPlaceholderText('Enter first number');
    const input2 = screen.getByPlaceholderText('Enter second number');

    // Type values
    await user.type(input1, '10');
    await user.type(input2, '5');

    // Click calculate
    const calculateBtn = screen.getByRole('button', { name: /calculate/i });
    await user.click(calculateBtn);

    // Check result
    expect(screen.getByText('15')).toBeInTheDocument();
  });
});
```

## Common Testing Patterns

### 1. Test User Input

```typescript
const user = userEvent.setup();
const input = screen.getByPlaceholderText('Enter value');
await user.type(input, '42');
```

### 2. Test Button Clicks

```typescript
const button = screen.getByRole('button', { name: /calculate/i });
await user.click(button);
```

### 3. Wait for Async Results

```typescript
await waitFor(() => {
  expect(screen.getByText('Result')).toBeInTheDocument();
});
```

### 4. Test Error States

```typescript
const calculateBtn = screen.getByRole('button', { name: /calculate/i });
await user.click(calculateBtn);

expect(screen.getByText('Error message')).toBeInTheDocument();
```

## Test Scripts Reference

| Command | Description |
|---------|-------------|
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once (for CI) |
| `npm run test:ui` | Open interactive test UI |
| `npm run test:coverage` | Generate coverage report |

## Tips for Success

1. **Start Small**: Test one thing at a time
2. **Use Descriptive Names**: `it('calculates BMI correctly')`
3. **Mock When Needed**: Mock translations, APIs, etc.
4. **Wait for Async**: Always use `waitFor` for async operations
5. **Check Coverage**: Aim for >60% coverage

## Existing Tests

Check out these examples:

- **PercentageCalculator**: `/src/components/calculators/__tests__/PercentageCalculator.test.tsx`
  - Shows multiple calculation types
  - Error handling
  - Reset functionality

- **BMICalculator**: `/src/components/calculators/__tests__/BMICalculator.test.tsx`
  - Form validation
  - Different BMI categories
  - Ideal weight calculation

- **calculator-imports**: `/src/utils/__tests__/calculator-imports.test.ts`
  - Utility function testing
  - Import validation
  - Error cases

## Need Help?

1. Read `TESTING.md` for comprehensive guide
2. Check existing tests for examples
3. Visit [Vitest docs](https://vitest.dev/)
4. Visit [Testing Library docs](https://testing-library.com/)

## Next Steps

1. Run existing tests: `npm test`
2. Explore test UI: `npm run test:ui`
3. Check coverage: `npm run test:coverage`
4. Write tests for your calculators
5. Aim for >60% coverage

Happy Testing!
