# NumberInput Component - RTL-Aware Redesign

## Overview
The NumberInput component has been redesigned to support RTL (Right-to-Left) languages with proper button positioning that adapts based on the current language direction.

## File Location
`/Users/raedtayyem/Desktop/work/alathasiba-claudecode/src/components/ui/number-input.tsx`

---

## Key Changes Made

### 1. RTL Detection
- Added i18n direction detection using `i18n.dir()`
- Component now dynamically determines if it's in RTL mode
- Used the `isRtl` boolean to conditionally render button positions

```typescript
const { t, i18n } = useTranslation();
const isRtl = i18n.dir() === 'rtl';
```

### 2. Button Positioning Logic
The buttons now swap positions based on language direction:

**LTR (Left-to-Right):** `[−] [Input] [+]`
**RTL (Right-to-Left):** `[+] [Input] [−]`

This is achieved by conditionally rendering the buttons:
```typescript
{isRtl ? incrementButton : decrementButton}
<div className="flex-1 relative h-full">
  {/* Input field */}
</div>
{isRtl ? decrementButton : incrementButton}
```

### 3. Border Radius Adaptation
Border radius classes are now RTL-aware:
- **Decrement button:** `rounded-s-2xl` in LTR, `rounded-e-2xl` in RTL
- **Increment button:** `rounded-e-2xl` in LTR, `rounded-s-2xl` in RTL

```typescript
className={cn(
  "flex h-full w-14 items-center justify-center ...",
  isRtl ? "rounded-e-2xl" : "rounded-s-2xl"  // for decrement
  isRtl ? "rounded-s-2xl" : "rounded-e-2xl"  // for increment
)}
```

### 4. Enhanced Button Disabled States
Improved button disabled logic:
- Minus button disabled when `value <= min`
- Plus button disabled when `value >= max`
- Both disabled when component is disabled

```typescript
const isMinDisabled = disabled || (min !== undefined && numericValue <= min);
const isMaxDisabled = disabled || (max !== undefined && numericValue >= max);
```

---

## Component API (Unchanged)

All existing props remain the same:

```typescript
interface NumberInputProps {
  value: number | string;           // Current value
  onValueChange?: (value: number | string) => void;  // Value change handler
  min?: number;                     // Minimum allowed value
  max?: number;                     // Maximum allowed value
  step?: number;                    // Increment/decrement step (default: 1)
  unit?: string;                    // Optional unit display (e.g., "kg", "m")
  unitPosition?: "left" | "right";  // Unit position (default: "right")
  startIcon?: React.ReactNode;      // Icon at the start
  endIcon?: React.ReactNode;        // Icon at the end
  disabled?: boolean;               // Disabled state
  // ...all standard input HTML attributes
}
```

---

## Usage Examples

### Basic Usage
```tsx
<NumberInput
  value={count}
  onValueChange={setCount}
  min={0}
  max={100}
  step={1}
/>
```

### With Unit
```tsx
<NumberInput
  value={weight}
  onValueChange={setWeight}
  min={20}
  max={300}
  step={0.1}
  unit="kg"
  startIcon={<Scale className="h-4 w-4" />}
/>
```

### Decimal Steps
```tsx
<NumberInput
  value={temperature}
  onValueChange={setTemperature}
  min={-50}
  max={50}
  step={0.5}
  unit="°C"
/>
```

---

## Testing the RTL Functionality

### Manual Testing Steps

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to a calculator that uses NumberInput:**
   - Example: Water Intake Calculator (`/calc/fitness/water-intake`)
   - Example: BMR Calculator (`/calc/fitness/bmr`)

3. **Test in LTR mode (English):**
   - Verify buttons appear as: `[−] [Input] [+]`
   - Click minus button → value decreases
   - Click plus button → value increases
   - Check that minus is disabled at minimum
   - Check that plus is disabled at maximum

4. **Switch to RTL mode (Arabic):**
   - Change language to Arabic in the language selector
   - Verify buttons swap to: `[+] [Input] [−]`
   - Plus button should now be on the left
   - Minus button should now be on the right
   - Test functionality works the same

5. **Test keyboard input:**
   - Click on the input field
   - Type numbers directly
   - Verify step up/down arrow keys work

6. **Test boundary conditions:**
   - Set value to minimum → minus button should be disabled
   - Set value to maximum → plus button should be disabled
   - Try clicking disabled buttons → no change should occur

### Automated Tests

A comprehensive test suite has been created at:
`/Users/raedtayyem/Desktop/work/alathasiba-claudecode/src/components/ui/__tests__/number-input.test.tsx`

The test suite covers:
- ✅ Basic rendering
- ✅ Increment/decrement functionality
- ✅ Min/max boundary enforcement
- ✅ Button disabled states
- ✅ Keyboard input support
- ✅ Decimal step values
- ✅ Accessibility (ARIA attributes)
- ✅ Unit display positioning
- ✅ Custom icons
- ✅ Edge cases (negative numbers, zero, large numbers)

---

## Design Features

### Visual Styling
- **Height:** 56px (h-14) - comfortable touch target
- **Border:** 2px border with focus ring effect
- **Border Radius:** Rounded corners (rounded-2xl)
- **Button Width:** 56px (w-14) - square buttons
- **Icons:** Lucide-react `Minus` and `Plus` icons (5x5)
- **Transitions:** Smooth hover and focus states

### States
1. **Default:** Muted foreground color on buttons
2. **Hover:** Background changes, text color brightens
3. **Focus:** Border color changes to primary, ring effect appears
4. **Disabled:** Reduced opacity (50%), cursor not-allowed

### Accessibility
- Proper ARIA labels for screen readers
- `role="spinbutton"` on the input
- `aria-valuemin`, `aria-valuemax`, `aria-valuenow` attributes
- Keyboard navigation support
- Focus indicators

---

## Browser Compatibility

The component uses CSS logical properties for RTL support:
- `rounded-s-*` (start) and `rounded-e-*` (end) for border radius
- Tailwind's RTL-aware utilities
- Works in all modern browsers that support CSS logical properties

---

## Performance Considerations

- Button components are memoized within the render to avoid recreating on every render
- Event handlers use `preventDefault()` to avoid form submission
- Minimal re-renders - only when value or direction changes

---

## Migration Notes

**For existing code using NumberInput:**
- ✅ No changes required - API is backward compatible
- ✅ RTL support is automatic based on current language
- ✅ All existing props continue to work exactly the same
- ✅ No breaking changes

---

## Example Calculators Using This Component

The NumberInput component is used throughout the application:

1. **Fitness Calculators:**
   - Water Intake Calculator
   - Body Recomposition Calculator
   - Calorie Deficit Calculator
   - BMR Calculator
   - Body Fat Percentage Calculator
   - And more...

2. **All categories** that require numeric input use this component

---

## Screenshots Description

### LTR Mode (English):
```
┌─────────────────────────────────────┐
│  [−]    │     50     │    [+]      │
└─────────────────────────────────────┘
```

### RTL Mode (Arabic):
```
┌─────────────────────────────────────┐
│  [+]    │     50     │    [−]      │
└─────────────────────────────────────┘
```

---

## Technical Implementation Details

### Component Structure
```
<div> (container with border and focus styles)
  {isRtl ? incrementButton : decrementButton}
  <div> (input wrapper)
    <input> (number input)
    <div> (optional icon overlay)
  </div>
  {isRtl ? decrementButton : incrementButton}
</div>
```

### Button Definition
Each button is defined once and conditionally positioned:
- **decrementButton:** Minus icon, calls `handleDecrement`, disabled by `isMinDisabled`
- **incrementButton:** Plus icon, calls `handleIncrement`, disabled by `isMaxDisabled`

### Value Handling
The component handles both numeric and string values:
```typescript
const numericValue = typeof value === "string"
  ? (parseFloat(value) || 0)
  : value;
```

This allows flexibility in parent components for form handling.

---

## Future Enhancements (Optional)

Potential future improvements:
1. Long-press to continuously increment/decrement
2. Customizable button icons
3. Vertical orientation option
4. Animation on value change
5. Haptic feedback on mobile devices

---

## Conclusion

The NumberInput component is now fully RTL-aware and provides a consistent, accessible, and user-friendly experience across all language directions. The implementation maintains backward compatibility while adding intelligent direction detection and automatic button repositioning.

**Status:** ✅ Complete and Ready for Production

**Build Status:** ✅ Successfully builds without errors

**Testing:** ✅ Comprehensive test suite created

**RTL Support:** ✅ Fully implemented and working
