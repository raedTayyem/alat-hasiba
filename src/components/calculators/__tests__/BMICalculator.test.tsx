import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithProviders, screen, userEvent, waitFor } from '@/test/utils';
import BMICalculator from '../health/BMICalculator';

// Mock the translation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        // BMI translations
        'bmi.title': 'BMI Calculator',
        'bmi.description': 'Calculate your Body Mass Index',
        'bmi.inputs.enter_details': 'Enter Your Details',
        'bmi.inputs.height': 'Height (cm)',
        'bmi.inputs.weight': 'Weight (kg)',
        'bmi.inputs.age': 'Age',
        'bmi.inputs.gender': 'Gender',
        'bmi.inputs.male': 'Male',
        'bmi.inputs.female': 'Female',
        'bmi.tooltips.height': 'Enter your height in centimeters',
        'bmi.tooltips.weight': 'Enter your weight in kilograms',
        'bmi.tooltips.age': 'Enter your age',
        'bmi.tooltips.gender': 'Select your gender',
        'bmi.placeholders.height': 'e.g., 175',
        'bmi.placeholders.weight': 'e.g., 70',
        'bmi.placeholders.age': 'e.g., 25',
        'bmi.results.your_bmi': 'Your BMI',
        'bmi.results.underweight': 'Underweight',
        'bmi.results.normal': 'Normal Weight',
        'bmi.results.overweight': 'Overweight',
        'bmi.results.obese_1': 'Obese Class I',
        'bmi.results.obese_2': 'Obese Class II',
        'bmi.results.obese_3': 'Obese Class III',
        'bmi.results.range_title': 'BMI Range',
        'bmi.results.category': 'Category',
        'bmi.results.ideal_weight': 'Ideal Weight Range',
        'bmi.results.ideal_range': 'Your ideal weight range is:',
        'bmi.categories.underweight_range': '< 18.5',
        'bmi.categories.normal_range': '18.5 - 24.9',
        'bmi.categories.overweight_range': '25 - 29.9',
        'bmi.categories.obese_1_range': '30 - 34.9',
        'bmi.categories.obese_2_range': '35 - 39.9',
        'bmi.categories.obese_3_range': '≥ 40',
        'bmi.errors.all_fields': 'Please fill in all required fields',
        'bmi.errors.positive': 'Values must be positive',
        'bmi.errors.empty_state.title': 'Enter your details to calculate BMI',
        'bmi.errors.empty_state.subtitle': 'Fill in the form above',
        // Common translations
        'common:common.units.kg': 'kg',
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

describe('BMICalculator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the calculator with initial state', () => {
    renderWithProviders(<BMICalculator />);

    expect(screen.getByText('Enter Your Details')).toBeInTheDocument();
    expect(screen.getByText('Height (cm)')).toBeInTheDocument();
    expect(screen.getByText('Weight (kg)')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
  });

  it('calculates BMI correctly for normal weight', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BMICalculator />);

    // Find input fields
    const heightInput = screen.getByPlaceholderText('e.g., 175');
    const weightInput = screen.getByPlaceholderText('e.g., 70');

    // Enter values: Height 175cm, Weight 70kg
    // Expected BMI = 70 / (1.75 * 1.75) = 22.86 (Normal)
    await user.type(heightInput, '175');
    await user.type(weightInput, '70');

    // Click calculate button
    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await user.click(calculateButton);

    // Wait for result to appear
    await waitFor(() => {
      expect(screen.getByText('22.9')).toBeInTheDocument();
      expect(screen.getByText('Normal Weight')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('calculates BMI correctly for underweight', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BMICalculator />);

    const heightInput = screen.getByPlaceholderText('e.g., 175');
    const weightInput = screen.getByPlaceholderText('e.g., 70');

    // Height 180cm, Weight 50kg
    // Expected BMI = 50 / (1.8 * 1.8) = 15.43 (Underweight)
    await user.type(heightInput, '180');
    await user.type(weightInput, '50');

    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await user.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('15.4')).toBeInTheDocument();
      expect(screen.getByText('Underweight')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('calculates BMI correctly for overweight', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BMICalculator />);

    const heightInput = screen.getByPlaceholderText('e.g., 175');
    const weightInput = screen.getByPlaceholderText('e.g., 70');

    // Height 170cm, Weight 80kg
    // Expected BMI = 80 / (1.7 * 1.7) = 27.68 (Overweight)
    await user.type(heightInput, '170');
    await user.type(weightInput, '80');

    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await user.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('27.7')).toBeInTheDocument();
      expect(screen.getByText('Overweight')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('calculates BMI correctly for obese', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BMICalculator />);

    const heightInput = screen.getByPlaceholderText('e.g., 175');
    const weightInput = screen.getByPlaceholderText('e.g., 70');

    // Height 170cm, Weight 100kg
    // Expected BMI = 100 / (1.7 * 1.7) = 34.6 (Obese Class I)
    await user.type(heightInput, '170');
    await user.type(weightInput, '100');

    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await user.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('34.6')).toBeInTheDocument();
      expect(screen.getByText('Obese Class I')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('shows error when required fields are missing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BMICalculator />);

    const heightInput = screen.getByPlaceholderText('e.g., 175');

    // Only fill height
    await user.type(heightInput, '175');

    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await user.click(calculateButton);

    // Should show error
    await waitFor(() => {
      expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('shows error when values are not positive', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BMICalculator />);

    const heightInput = screen.getByPlaceholderText('e.g., 175');
    const weightInput = screen.getByPlaceholderText('e.g., 70');

    // Enter invalid values
    await user.type(heightInput, '0');
    await user.type(weightInput, '70');

    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await user.click(calculateButton);

    // Should show error
    await waitFor(() => {
      expect(screen.getByText('Values must be positive')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('resets the calculator when reset button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BMICalculator />);

    const heightInput = screen.getByPlaceholderText('e.g., 175');
    const weightInput = screen.getByPlaceholderText('e.g., 70');

    // Enter values
    await user.type(heightInput, '175');
    await user.type(weightInput, '70');

    // Click reset button
    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    // Wait for reset animation
    await waitFor(() => {
      expect(heightInput).toHaveValue(null);
      expect(weightInput).toHaveValue(null);
    }, { timeout: 500 });
  });

  it('displays ideal weight range', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BMICalculator />);

    const heightInput = screen.getByPlaceholderText('e.g., 175');
    const weightInput = screen.getByPlaceholderText('e.g., 70');

    await user.type(heightInput, '175');
    await user.type(weightInput, '70');

    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await user.click(calculateButton);

    // Wait for ideal weight range to appear
    await waitFor(() => {
      expect(screen.getByText('Ideal Weight Range')).toBeInTheDocument();
      expect(screen.getByText('Your ideal weight range is:')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('clears error when inputs change', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BMICalculator />);

    const heightInput = screen.getByPlaceholderText('e.g., 175');

    // Try to calculate with missing fields
    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await user.click(calculateButton);

    // Error should appear
    await waitFor(() => {
      expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument();
    }, { timeout: 1000 });

    // Start typing - error should clear
    await user.type(heightInput, '175');

    // Error should be gone (after useEffect triggers)
    await waitFor(() => {
      expect(screen.queryByText('Please fill in all required fields')).not.toBeInTheDocument();
    }, { timeout: 500 });
  });
});
