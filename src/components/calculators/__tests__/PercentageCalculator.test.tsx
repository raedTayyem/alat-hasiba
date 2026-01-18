import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithProviders, screen, userEvent, waitFor } from '@/test/utils';
import PercentageCalculator from '../math/PercentageCalculator';

// Mock the translation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'percentage.title': 'Percentage Calculator',
        'percentage.page_title': 'Percentage Calculator',
        'percentage.page_description': 'Calculate percentages easily',
        'percentage.calculation_type': 'Calculation Type',
        'percentage.calculation_type_tooltip': 'Select the type of calculation',
        'percentage.what_is_percent_of': 'What is X% of Y?',
        'percentage.is_what_percent_of': 'X is what % of Y?',
        'percentage.percentage_change': 'Percentage change from X to Y',
        'percentage.is_percent_of_what': 'X is Y% of what?',
        'percentage.percent_label': 'Percentage',
        'percentage.of_value_label': 'Of Value',
        'percentage.percent_placeholder': 'Enter percentage',
        'percentage.of_value_placeholder': 'Enter value',
        'percentage.result_is': 'Result is',
        'percentage.value_label': 'Value',
        'percentage.total_label': 'Total',
        'percentage.value_placeholder': 'Enter value',
        'percentage.total_placeholder': 'Enter total',
        'percentage.is_percent': 'Is',
        'percentage.original_label': 'Original Value',
        'percentage.new_label': 'New Value',
        'percentage.original_placeholder': 'Enter original',
        'percentage.new_placeholder': 'Enter new value',
        'percentage.change_is': 'Change is',
        'percentage.part_label': 'Part',
        'percentage.percentage_label': 'Percentage',
        'percentage.part_placeholder': 'Enter part',
        'percentage.percentage_placeholder': 'Enter percentage',
        'percentage.whole_is': 'Whole is',
        'percentage.invalid_input': 'Invalid input values',
        'percentage.cannot_divide_by_zero': 'Cannot divide by zero',
        'percentage.original_cannot_be_zero': 'Original value cannot be zero',
        'percentage.calculation_error': 'Calculation error occurred',
        'percentage.calculation_details': 'Calculation Details',
        'percentage.calculation_used': 'Formula Used',
        'percentage.formula_title': 'Formula',
        'percentage.formula_explanation': 'Percentage calculation formula',
        'percentage.info_title': 'About Percentage Calculator',
        'percentage.description': 'Calculate various percentage operations',
        'percentage.use_cases_title': 'Use Cases',
        'percentage.use_case_1': 'Calculate discounts',
        'percentage.use_case_2': 'Find percentage increase/decrease',
        'percentage.use_case_3': 'Calculate tips and taxes',
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

describe('PercentageCalculator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the calculator with initial state', () => {
    renderWithProviders(<PercentageCalculator />);

    expect(screen.getByText('Percentage Calculator')).toBeInTheDocument();
    expect(screen.getByText('Calculation Type')).toBeInTheDocument();
  });

  it('calculates "What is X% of Y?" correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PercentageCalculator />);

    // Find input fields by their placeholders
    const percentInput = screen.getByPlaceholderText('Enter percentage');
    const valueInput = screen.getByPlaceholderText('Enter value');

    // Enter values: 20% of 100
    await user.type(percentInput, '20');
    await user.type(valueInput, '100');

    // Click calculate button
    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await user.click(calculateButton);

    // Wait for result to appear
    await waitFor(() => {
      expect(screen.getByText('20.00')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('handles invalid input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PercentageCalculator />);

    const percentInput = screen.getByPlaceholderText('Enter percentage');
    const valueInput = screen.getByPlaceholderText('Enter value');

    // Leave one field empty
    await user.type(percentInput, '20');

    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await user.click(calculateButton);

    // Should show error
    await waitFor(() => {
      expect(screen.getByText('Invalid input values')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('handles division by zero error', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PercentageCalculator />);

    // Change to "X is what % of Y?" calculation type
    const combobox = screen.getByRole('combobox');
    await user.click(combobox);

    const option = screen.getByText('X is what % of Y?');
    await user.click(option);

    // Get inputs after changing calculation type
    const valueInput = screen.getByPlaceholderText('Enter value');
    const totalInput = screen.getByPlaceholderText('Enter total');

    // Try to divide by zero
    await user.type(valueInput, '50');
    await user.type(totalInput, '0');

    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await user.click(calculateButton);

    // Should show error
    await waitFor(() => {
      expect(screen.getByText('Cannot divide by zero')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('resets the calculator when reset button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PercentageCalculator />);

    const percentInput = screen.getByPlaceholderText('Enter percentage');
    const valueInput = screen.getByPlaceholderText('Enter value');

    // Enter values
    await user.type(percentInput, '20');
    await user.type(valueInput, '100');

    // Click reset button
    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    // Wait for reset animation
    await waitFor(() => {
      expect(percentInput).toHaveValue(null);
      expect(valueInput).toHaveValue(null);
    }, { timeout: 500 });
  });

  it('calculates percentage change correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PercentageCalculator />);

    // Change to percentage change calculation
    const combobox = screen.getByRole('combobox');
    await user.click(combobox);

    const option = screen.getByText('Percentage change from X to Y');
    await user.click(option);

    // Get inputs after changing calculation type
    const originalInput = screen.getByPlaceholderText('Enter original');
    const newInput = screen.getByPlaceholderText('Enter new value');

    // Calculate percentage change from 100 to 150 (50% increase)
    await user.type(originalInput, '100');
    await user.type(newInput, '150');

    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await user.click(calculateButton);

    // Should show 50% increase
    await waitFor(() => {
      expect(screen.getByText('50.00')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('updates result when inputs change', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PercentageCalculator />);

    const percentInput = screen.getByPlaceholderText('Enter percentage');
    const valueInput = screen.getByPlaceholderText('Enter value');

    // First calculation: 20% of 100 = 20
    await user.type(percentInput, '20');
    await user.type(valueInput, '100');

    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await user.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('20.00')).toBeInTheDocument();
    }, { timeout: 1000 });

    // Clear and recalculate: 50% of 200 = 100
    await user.clear(percentInput);
    await user.clear(valueInput);
    await user.type(percentInput, '50');
    await user.type(valueInput, '200');
    await user.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('100.00')).toBeInTheDocument();
    }, { timeout: 1000 });
  });
});
