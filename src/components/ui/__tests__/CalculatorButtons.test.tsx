import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@/test/utils';
import { CalculatorButtons } from '../CalculatorButtons';

describe('CalculatorButtons', () => {
  it('renders both calculate and reset buttons', () => {
    const onCalculate = vi.fn();
    const onReset = vi.fn();

    render(<CalculatorButtons onCalculate={onCalculate} onReset={onReset} />);

    expect(screen.getByRole('button', { name: /calculate/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  it('calls onCalculate when calculate button is clicked', async () => {
    const user = userEvent.setup();
    const onCalculate = vi.fn();
    const onReset = vi.fn();

    render(<CalculatorButtons onCalculate={onCalculate} onReset={onReset} />);

    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await user.click(calculateButton);

    expect(onCalculate).toHaveBeenCalledTimes(1);
    expect(onReset).not.toHaveBeenCalled();
  });

  it('calls onReset when reset button is clicked', async () => {
    const user = userEvent.setup();
    const onCalculate = vi.fn();
    const onReset = vi.fn();

    render(<CalculatorButtons onCalculate={onCalculate} onReset={onReset} />);

    const resetButton = screen.getByRole('button', { name: /reset/i });
    await user.click(resetButton);

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onCalculate).not.toHaveBeenCalled();
  });

  it('handles multiple clicks correctly', async () => {
    const user = userEvent.setup();
    const onCalculate = vi.fn();
    const onReset = vi.fn();

    render(<CalculatorButtons onCalculate={onCalculate} onReset={onReset} />);

    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    const resetButton = screen.getByRole('button', { name: /reset/i });

    // Click calculate multiple times
    await user.click(calculateButton);
    await user.click(calculateButton);

    // Click reset once
    await user.click(resetButton);

    expect(onCalculate).toHaveBeenCalledTimes(2);
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when disabled prop is true', () => {
    const onCalculate = vi.fn();
    const onReset = vi.fn();

    render(
      <CalculatorButtons
        onCalculate={onCalculate}
        onReset={onReset}
        disabled={true}
      />
    );

    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    const resetButton = screen.getByRole('button', { name: /reset/i });

    expect(calculateButton).toBeDisabled();
    expect(resetButton).toBeDisabled();
  });

  it('enables buttons when disabled prop is false', () => {
    const onCalculate = vi.fn();
    const onReset = vi.fn();

    render(
      <CalculatorButtons
        onCalculate={onCalculate}
        onReset={onReset}
        disabled={false}
      />
    );

    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    const resetButton = screen.getByRole('button', { name: /reset/i });

    expect(calculateButton).not.toBeDisabled();
    expect(resetButton).not.toBeDisabled();
  });

  it('applies custom className when provided', () => {
    const onCalculate = vi.fn();
    const onReset = vi.fn();

    const { container } = render(
      <CalculatorButtons
        onCalculate={onCalculate}
        onReset={onReset}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
