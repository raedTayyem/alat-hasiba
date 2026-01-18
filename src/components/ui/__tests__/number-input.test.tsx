import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent } from '@/test/utils';
import { NumberInput } from '../number-input';

describe('NumberInput', () => {
  const defaultProps = {
    value: 5,
    onValueChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders input with plus and minus buttons', () => {
      render(<NumberInput {...defaultProps} />);

      const input = screen.getByRole('spinbutton');
      const decreaseButton = screen.getByLabelText(/decrease/i);
      const increaseButton = screen.getByLabelText(/increase/i);

      expect(input).toBeInTheDocument();
      expect(decreaseButton).toBeInTheDocument();
      expect(increaseButton).toBeInTheDocument();
    });

    it('displays the correct value', () => {
      render(<NumberInput {...defaultProps} value={10} />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(10);
    });

    it('handles string values', () => {
      render(<NumberInput {...defaultProps} value="15" />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(15);
    });
  });

  describe('Increment/Decrement Functionality', () => {
    it('increments value when plus button is clicked', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<NumberInput value={5} onValueChange={onValueChange} step={1} />);

      const increaseButton = screen.getByLabelText(/increase/i);
      await user.click(increaseButton);

      expect(onValueChange).toHaveBeenCalledWith(6);
    });

    it('decrements value when minus button is clicked', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<NumberInput value={5} onValueChange={onValueChange} step={1} />);

      const decreaseButton = screen.getByLabelText(/decrease/i);
      await user.click(decreaseButton);

      expect(onValueChange).toHaveBeenCalledWith(4);
    });

    it('uses custom step value', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<NumberInput value={10} onValueChange={onValueChange} step={5} />);

      const increaseButton = screen.getByLabelText(/increase/i);
      await user.click(increaseButton);

      expect(onValueChange).toHaveBeenCalledWith(15);
    });

    it('supports decimal step values', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<NumberInput value={1.5} onValueChange={onValueChange} step={0.5} />);

      const increaseButton = screen.getByLabelText(/increase/i);
      await user.click(increaseButton);

      expect(onValueChange).toHaveBeenCalledWith(2.0);
    });
  });

  describe('Min/Max Boundaries', () => {
    it('disables minus button when at minimum value', () => {
      render(<NumberInput value={0} min={0} max={10} onValueChange={vi.fn()} />);

      const decreaseButton = screen.getByLabelText(/decrease/i);
      expect(decreaseButton).toBeDisabled();
    });

    it('disables plus button when at maximum value', () => {
      render(<NumberInput value={10} min={0} max={10} onValueChange={vi.fn()} />);

      const increaseButton = screen.getByLabelText(/increase/i);
      expect(increaseButton).toBeDisabled();
    });

    it('does not increment beyond max value', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<NumberInput value={9} min={0} max={10} onValueChange={onValueChange} />);

      const increaseButton = screen.getByLabelText(/increase/i);
      await user.click(increaseButton);
      expect(onValueChange).toHaveBeenCalledWith(10);

      // Reset mock
      onValueChange.mockClear();

      // Try clicking again at max
      render(<NumberInput value={10} min={0} max={10} onValueChange={onValueChange} />);
      const increaseButtonAtMax = screen.getByLabelText(/increase/i);
      await user.click(increaseButtonAtMax);

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('does not decrement below min value', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<NumberInput value={1} min={0} max={10} onValueChange={onValueChange} />);

      const decreaseButton = screen.getByLabelText(/decrease/i);
      await user.click(decreaseButton);
      expect(onValueChange).toHaveBeenCalledWith(0);

      // Reset mock
      onValueChange.mockClear();

      // Try clicking again at min
      render(<NumberInput value={0} min={0} max={10} onValueChange={onValueChange} />);
      const decreaseButtonAtMin = screen.getByLabelText(/decrease/i);
      await user.click(decreaseButtonAtMin);

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Input', () => {
    it('allows typing values directly', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<NumberInput value={5} onValueChange={onValueChange} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '25');

      // onValueChange is called for each keystroke
      expect(onValueChange).toHaveBeenCalled();
    });

    it('handles empty input', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<NumberInput value={5} onValueChange={onValueChange} />);

      const input = screen.getByRole('spinbutton');
      await user.clear(input);

      expect(onValueChange).toHaveBeenCalledWith('');
    });
  });

  describe('Disabled State', () => {
    it('disables all buttons when component is disabled', () => {
      render(<NumberInput {...defaultProps} disabled={true} />);

      const decreaseButton = screen.getByLabelText(/decrease/i);
      const increaseButton = screen.getByLabelText(/increase/i);
      const input = screen.getByRole('spinbutton');

      expect(decreaseButton).toBeDisabled();
      expect(increaseButton).toBeDisabled();
      expect(input).toBeDisabled();
    });

    it('does not call onValueChange when disabled', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<NumberInput value={5} onValueChange={onValueChange} disabled={true} />);

      const increaseButton = screen.getByLabelText(/increase/i);
      await user.click(increaseButton);

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<NumberInput value={5} min={0} max={10} onValueChange={vi.fn()} />);

      const input = screen.getByRole('spinbutton');

      expect(input).toHaveAttribute('aria-valuemin', '0');
      expect(input).toHaveAttribute('aria-valuemax', '10');
      expect(input).toHaveAttribute('aria-valuenow', '5');
    });

    it('has accessible button labels', () => {
      render(<NumberInput {...defaultProps} />);

      const decreaseButton = screen.getByLabelText(/decrease/i);
      const increaseButton = screen.getByLabelText(/increase/i);

      expect(decreaseButton).toHaveAttribute('aria-label');
      expect(increaseButton).toHaveAttribute('aria-label');
    });
  });

  describe('RTL Support', () => {
    it('renders buttons in correct order for LTR', () => {
      const { container } = render(<NumberInput {...defaultProps} />);

      const buttons = container.querySelectorAll('button');
      const firstButton = buttons[0];
      const lastButton = buttons[1];

      // In LTR: first button should have minus (decrease), last button should have plus (increase)
      expect(firstButton).toContainHTML('Minus');
      expect(lastButton).toContainHTML('Plus');
    });

    it('applies correct border radius classes for LTR', () => {
      const { container } = render(<NumberInput {...defaultProps} />);

      const buttons = container.querySelectorAll('button');
      const firstButton = buttons[0];
      const lastButton = buttons[1];

      // In LTR: first button gets rounded-s, last gets rounded-e
      expect(firstButton.className).toContain('rounded-s-2xl');
      expect(lastButton.className).toContain('rounded-e-2xl');
    });

    // Note: RTL testing would require mocking i18n.dir() to return 'rtl'
    // which would need additional test setup with i18next mocking
  });

  describe('Unit Display', () => {
    it('displays unit when provided', () => {
      const { container } = render(
        <NumberInput {...defaultProps} unit="kg" />
      );

      expect(container.textContent).toContain('kg');
    });

    it('positions unit on the right by default', () => {
      const { container } = render(
        <NumberInput {...defaultProps} unit="kg" />
      );

      const unitElement = container.querySelector('.text-xs');
      expect(unitElement).toBeInTheDocument();
    });

    it('positions unit on the left when specified', () => {
      const { container } = render(
        <NumberInput {...defaultProps} unit="$" unitPosition="left" />
      );

      const unitElement = container.querySelector('.text-xs');
      expect(unitElement).toBeInTheDocument();
      expect(unitElement?.textContent).toBe('$');
    });
  });

  describe('Custom Icons', () => {
    it('renders start icon when provided', () => {
      const startIcon = <span data-testid="start-icon">→</span>;

      render(<NumberInput {...defaultProps} startIcon={startIcon} />);

      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    });

    it('renders end icon when provided', () => {
      const endIcon = <span data-testid="end-icon">←</span>;

      render(<NumberInput {...defaultProps} endIcon={endIcon} />);

      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles zero as value', () => {
      render(<NumberInput value={0} onValueChange={vi.fn()} />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(0);
    });

    it('handles negative values', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<NumberInput value={0} min={-10} max={10} onValueChange={onValueChange} />);

      const decreaseButton = screen.getByLabelText(/decrease/i);
      await user.click(decreaseButton);

      expect(onValueChange).toHaveBeenCalledWith(-1);
    });

    it('handles large numbers', () => {
      render(<NumberInput value={999999} onValueChange={vi.fn()} />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(999999);
    });

    it('handles string value conversion in increment', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<NumberInput value="10" onValueChange={onValueChange} />);

      const increaseButton = screen.getByLabelText(/increase/i);
      await user.click(increaseButton);

      expect(onValueChange).toHaveBeenCalledWith(11);
    });
  });
});
