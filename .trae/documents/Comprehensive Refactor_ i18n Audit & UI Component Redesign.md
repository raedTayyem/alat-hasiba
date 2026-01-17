# Phase 1: Comprehensive Internationalization (i18n) Fix
I will perform a "root-up" audit to eliminate hardcoded text and ensure all translation keys exist.

1.  **Create and Run Audit Scripts:**
    *   `scripts/audit-missing-keys.py`: Scan all `src/**/*.{tsx,ts}` for usage of `t('key')` and verify existence in `public/locales/{en,ar}/*.json`.
    *   `scripts/extract-hardcoded-text.py`: Use advanced regex to find raw text strings in components (ignoring import statements, console logs, etc.).

2.  **Fix Translation Files:**
    *   **Create missing keys:** Automatically populate `en` and `ar` JSON files with missing keys found in step 1.
    *   **Manual Review:** Manually translate critical UI elements (Hero, Navigation, Footer) to ensure high-quality Arabic.

3.  **Refactor Components with Hardcoded Text:**
    *   `ScientificCalculator.tsx`: Move math labels (`sin`, `cos`, etc.) to translation files.
    *   `SearchAutocomplete.tsx` & `CalculatorLayout.tsx`: Replace hardcoded symbols (`→`, `★`, `✓`) with Lucide icons or proper RTL-aware Unicode.
    *   **Placeholders:** Update all calculator inputs to use `t('placeholders.number_example')` instead of hardcoded "100" or "0".

# Phase 2: Complete `NumberInput` Redesign
I will completely rewrite `src/components/ui/number-input.tsx` to fix the RTL border issues and visual bugs.

1.  **Structural Change:**
    *   Remove the `Button` + `Input` + `Button` sibling structure which causes the "open border" issue.
    *   **New Design:** Wrap everything in a single `div` container that handles the border and rounded corners. The internal input will be transparent (`border-0`).
    *   **Buttons:** Place the `+` and `-` buttons *inside* this container as absolute positioned elements or flex children, ensuring no double borders.

2.  **RTL/LTR Handling:**
    *   Use logical properties (`border-inline-start`, `rounded-e-none`) or Tailwind's `rtl:` modifiers to ensure the `-` button is always on the logical "down" side and `+` on the "up" side, with correct border radii.
    *   **Fix:** Ensure the `Input` component (which I modified previously) plays nicely inside this new wrapper without double padding.

3.  **Visual Polish:**
    *   Increase height to `h-14` to match the new `Input` style.
    *   Add hover/focus states to the entire container group.
    *   Ensure icons (`startIcon`/`endIcon`) don't overlap with the stepper buttons.

# Phase 3: Global Layout & Visual Consistency
1.  **Input Component Cleanup:**
    *   Revisit `src/components/ui/input.tsx`.
    *   Remove `shadow-sm` if it conflicts with the new `NumberInput` wrapper.
    *   Ensure `startIcon` padding (`ps-12`) is strictly enforced in RTL mode.

2.  **Final Verification:**
    *   Verify the "Embed" section is full-width (already done, but double-check responsiveness).
    *   Check `HomePage` hero text color (already fixed, confirm contrast).
