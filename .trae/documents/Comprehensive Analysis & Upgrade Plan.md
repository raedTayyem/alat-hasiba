I have analyzed the codebase and identified the key areas for improvement. The project is a large React application with over 300 calculators. While the infrastructure for internationalization (i18n) exists, there are significant opportunities to clean up hardcoded text and modernize the UI/UX.

Here is the comprehensive plan to address your request, broken down into 200 granular tasks across 4 phases.

### Phase 1: Internationalization (i18n) Audit & Fixes (Tasks 1-50)
**Goal:** Eliminate all hardcoded text and ensure complete Arabic/English support.
1.  **Audit:** Run a script to find all non-`t()` strings in `src/components`.
2.  **Data Layer:** Refactor `src/data/calculators/*.ts` to remove hardcoded `name` and `description` fallbacks, enforcing `nameKey` usage.
3.  **Translation Files:** synchronize `en` and `ar` JSON files to ensure no keys are missing.
4.  **Hardcoded Text Removal:** SYSTEMATICALLY go through `HomePage`, `CalculatorLayout`, `Footer`, `Header`, and `NotFoundPage` to replace raw text with translation keys.
5.  **RTL Fixes:** Remove manual CSS overrides in `index.css` where possible and rely on Tailwind's logical properties (e.g., `ms-auto` instead of `ml-auto`).

### Phase 2: UI/UX Foundation & Design System (Tasks 51-100)
**Goal:** Create a modern, cohesive design language.
1.  **Color Palette:** Update `tailwind.config.js` and `index.css` with a new, modern color scheme (soft blues, teals, and warm grays).
2.  **Typography:** Implement a better Arabic/English font pairing (e.g., *IBM Plex Sans Arabic* with *Inter*).
3.  **Component Refresh:** Redesign core UI components:
    *   **Buttons:** Add subtle gradients, better hover states, and focus rings.
    *   **Inputs:** Modernize borders, focus states, and floating labels.
    *   **Cards:** Increase padding, soften shadows (`shadow-lg` -> `shadow-xl` with lower opacity), and add glassmorphism effects.
4.  **Animations:** Add a global animation system for page transitions and element appearances (fade-in, slide-up).

### Phase 3: Major Page Redesigns (Tasks 101-150)
**Goal:** Apply the new design system to main pages.
1.  **Home Page:**
    *   Redesign Hero section to be cleaner and more focused on Search.
    *   Revamp the "Featured Categories" grid with better icons and hover effects.
    *   Simplify the "Popular Calculators" section.
2.  **Calculator Layout:**
    *   Redesign the split-view (Input vs. Result).
    *   Make the "Results" section pop with a distinct background or card style.
    *   Improve mobile responsiveness for complex forms.
3.  **Navigation:** Redesign the Header and Footer for better accessibility and aesthetics.

### Phase 4: High-Priority Calculator Polish (Tasks 151-200)
**Goal:** Polishing the top 50 most used calculators.
1.  **Top 50 Audit:** Manually review the top 50 calculators (BMI, Age, Loan, etc.).
2.  **Custom UI:** Add specific visualizations (charts, graphs, progress bars) to these calculators where applicable.
3.  **Consistency:** Ensure all top calculators strictly follow the new UI patterns.

I will start by creating a detailed task list in the `todo` system and then execute them one by one, starting with the **i18n audit**.
