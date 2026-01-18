# Bundle Optimization Implementation Guide
## Step-by-Step Instructions

This guide provides exact code changes to implement the optimizations identified in the Bundle Optimization Report.

---

## PHASE 1: QUICK WINS (60-70% Size Reduction)

### 1.1 Implement Vendor Chunk Splitting

**File:** `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/vite.config.ts`

**Current Code (Lines 38-54):**
```typescript
rollupOptions: {
  output: {
    // Only group calculators by category - let Vite handle vendors to avoid circular deps
    manualChunks(id) {
      // Group calculators by category to reduce chunk count
      if (id.includes('/calculators/')) {
        const match = id.match(/calculators\/([^/]+)\//);
        if (match) {
          return `calc-${match[1]}`;
        }
      }
    },
    chunkFileNames: 'assets/js/[name]-[hash].js',
    entryFileNames: 'assets/js/[name]-[hash].js',
    assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
  },
},
```

**Replace With:**
```typescript
rollupOptions: {
  output: {
    manualChunks(id) {
      // Vendor chunk splitting - extract shared dependencies
      if (id.includes('node_modules')) {
        // React core - used by all components
        if (id.includes('react/') || id.includes('react-dom/')) {
          return 'vendor-react';
        }

        // React Router - used by navigation
        if (id.includes('react-router-dom')) {
          return 'vendor-router';
        }

        // i18n ecosystem - used by all calculators
        if (id.includes('i18next') || id.includes('react-i18next')) {
          return 'vendor-i18n';
        }

        // Icons - used by all calculators
        if (id.includes('lucide-react')) {
          return 'vendor-icons';
        }

        // Date utilities - used by date/time calculators
        if (id.includes('date-fns')) {
          return 'vendor-date';
        }

        // Helmet for SEO - used by all pages
        if (id.includes('react-helmet')) {
          return 'vendor-helmet';
        }

        // Headless UI - used by UI components
        if (id.includes('@headlessui')) {
          return 'vendor-ui';
        }

        // All other node_modules
        return 'vendor';
      }

      // Calculator chunks by category (existing logic)
      if (id.includes('/calculators/')) {
        const match = id.match(/calculators\/([^/]+)\//);
        if (match) {
          return `calc-${match[1]}`;
        }
      }
    },
    chunkFileNames: 'assets/js/[name]-[hash].js',
    entryFileNames: 'assets/js/[name]-[hash].js',
    assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
  },
},
```

**Test:**
```bash
npm run build
du -sh dist/assets/js/*.js | sort -rh | head -20
```

**Expected Output:**
```
120K  vendor-react-[hash].js
50K   vendor-i18n-[hash].js
30K   vendor-icons-[hash].js
25K   vendor-router-[hash].js
20K   vendor-helmet-[hash].js
15K   vendor-ui-[hash].js
80K   calc-agriculture-[hash].js  (down from 433KB)
70K   calc-business-[hash].js     (down from 360KB)
65K   calc-construction-[hash].js (down from 322KB)
```

---

### 1.2 Fix Lucide Icons Tree-Shaking

#### Step 1: Create Icons Utility

**Create New File:** `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/src/utils/icons.ts`

```typescript
/**
 * Tree-shakeable icon imports from lucide-react
 * Import from this file instead of directly from 'lucide-react'
 * to ensure only used icons are bundled
 */

// Agriculture icons
export { default as Sprout } from 'lucide-react/dist/esm/icons/sprout';
export { default as Egg } from 'lucide-react/dist/esm/icons/egg';
export { default as Milk } from 'lucide-react/dist/esm/icons/milk';
export { default as Truck } from 'lucide-react/dist/esm/icons/truck';
export { default as Droplets } from 'lucide-react/dist/esm/icons/droplets';
export { default as FlaskConical } from 'lucide-react/dist/esm/icons/flask-conical';

// Common icons (used across many calculators)
export { default as DollarSign } from 'lucide-react/dist/esm/icons/dollar-sign';
export { default as Info } from 'lucide-react/dist/esm/icons/info';
export { default as Scale } from 'lucide-react/dist/esm/icons/scale';
export { default as Target } from 'lucide-react/dist/esm/icons/target';
export { default as Percent } from 'lucide-react/dist/esm/icons/percent';
export { default as Activity } from 'lucide-react/dist/esm/icons/activity';
export { default as Clock } from 'lucide-react/dist/esm/icons/clock';
export { default as Ruler } from 'lucide-react/dist/esm/icons/ruler';
export { default as Map } from 'lucide-react/dist/esm/icons/map';
export { default as HelpCircle } from 'lucide-react/dist/esm/icons/help-circle';

// Business icons
export { default as TrendingUp } from 'lucide-react/dist/esm/icons/trending-up';
export { default as TrendingDown } from 'lucide-react/dist/esm/icons/trending-down';
export { default as BarChart3 } from 'lucide-react/dist/esm/icons/bar-chart3';
export { default as PieChart } from 'lucide-react/dist/esm/icons/pie-chart';
export { default as FileText } from 'lucide-react/dist/esm/icons/file-text';

// Construction icons
export { default as Box } from 'lucide-react/dist/esm/icons/box';
export { default as Hammer } from 'lucide-react/dist/esm/icons/hammer';
export { default as Layers } from 'lucide-react/dist/esm/icons/layers';

// Automotive icons
export { default as Fuel } from 'lucide-react/dist/esm/icons/fuel';
export { default as Zap } from 'lucide-react/dist/esm/icons/zap';

// UI/Layout icons
export { default as Thermometer } from 'lucide-react/dist/esm/icons/thermometer';
export { default as Wind } from 'lucide-react/dist/esm/icons/wind';
export { default as Plus } from 'lucide-react/dist/esm/icons/plus';
export { default as Trash2 } from 'lucide-react/dist/esm/icons/trash2';
export { default as Plug } from 'lucide-react/dist/esm/icons/plug';

// Add more icons as needed...
// To find all icons needed, run:
// grep -roh "import {[^}]*} from 'lucide-react'" src/components/calculators/ | sort -u
```

#### Step 2: Update All Calculator Imports

**Find all files to update:**
```bash
grep -rl "from 'lucide-react'" src/components/calculators/
```

**Example Update - Agriculture Calculators:**

**File:** `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/src/components/calculators/agriculture/FertilizerCalculator.tsx`

**Before (Line 10):**
```typescript
import { Sprout, Info, Scale, FlaskConical, DollarSign } from 'lucide-react';
```

**After:**
```typescript
import { Sprout, Info, Scale, FlaskConical, DollarSign } from '@/utils/icons';
```

**Repeat for all agriculture calculators:**
- CompostCalculator.tsx
- EggProductionCalculator.tsx
- FarmProfitCalculator.tsx
- GreenhouseCalculator.tsx
- IrrigationCalculator.tsx
- MilkProductionCalculator.tsx
- PesticideCalculator.tsx
- SeedRateCalculator.tsx
- TractorFuelCalculator.tsx

**Automated Find/Replace (use with caution):**
```bash
# Backup first
cp -r src/components/calculators src/components/calculators.backup

# Replace in agriculture
find src/components/calculators/agriculture -name "*.tsx" -type f -exec sed -i '' "s/from 'lucide-react'/from '@\/utils\/icons'/g" {} +

# Repeat for other categories
find src/components/calculators/business -name "*.tsx" -type f -exec sed -i '' "s/from 'lucide-react'/from '@\/utils\/icons'/g" {} +
find src/components/calculators/construction -name "*.tsx" -type f -exec sed -i '' "s/from 'lucide-react'/from '@\/utils\/icons'/g" {} +
find src/components/calculators/automotive -name "*.tsx" -type f -exec sed -i '' "s/from 'lucide-react'/from '@\/utils\/icons'/g" {} +
```

**Also Update CalculatorLayout:**

**File:** `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/src/components/ui/CalculatorLayout.tsx`

**Before (Line 12):**
```typescript
import { Info, HelpCircle } from 'lucide-react';
```

**After:**
```typescript
import { Info, HelpCircle } from '@/utils/icons';
```

**Test:**
```bash
npm run build
# Check if vendor-icons is smaller
du -sh dist/assets/js/vendor-icons-*.js
```

**Expected:** vendor-icons should be ~5-10KB instead of ~30KB

---

### 1.3 Optimize date-fns Imports

#### Step 1: Find All date-fns Usage

```bash
grep -rn "from 'date-fns'" src/
```

**Common imports found:**
```typescript
import { format, addDays, subDays, differenceInDays } from 'date-fns';
```

#### Step 2: Replace with Modular Imports

**Example files to update:**

**File:** Any file using date-fns (search results from Step 1)

**Before:**
```typescript
import { format, addDays, subDays, differenceInDays } from 'date-fns';
```

**After:**
```typescript
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import differenceInDays from 'date-fns/differenceInDays';
```

**Alternative: Create date-fns utility** (recommended for consistency)

**Create:** `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/src/utils/date.ts`

```typescript
/**
 * Tree-shakeable date utilities
 * Import from this file to ensure optimal bundling
 */

export { default as format } from 'date-fns/format';
export { default as addDays } from 'date-fns/addDays';
export { default as subDays } from 'date-fns/subDays';
export { default as addMonths } from 'date-fns/addMonths';
export { default as subMonths } from 'date-fns/subMonths';
export { default as addYears } from 'date-fns/addYears';
export { default as subYears } from 'date-fns/subYears';
export { default as differenceInDays } from 'date-fns/differenceInDays';
export { default as differenceInMonths } from 'date-fns/differenceInMonths';
export { default as differenceInYears } from 'date-fns/differenceInYears';
export { default as isAfter } from 'date-fns/isAfter';
export { default as isBefore } from 'date-fns/isBefore';
export { default as parseISO } from 'date-fns/parseISO';
export { default as startOfDay } from 'date-fns/startOfDay';
export { default as endOfDay } from 'date-fns/endOfDay';
```

**Then update imports:**
```typescript
// Before
import { format, addDays } from 'date-fns';

// After
import { format, addDays } from '@/utils/date';
```

**Test:**
```bash
npm run build
du -sh dist/assets/js/vendor-date-*.js
```

**Expected:** vendor-date should be ~8-12KB instead of ~25KB

---

### 1.4 Verify Translation Files Not Bundled

#### Step 1: Check for Static Imports

```bash
grep -rn "import.*\.json" src/
grep -rn "import.*locales" src/
```

**Expected:** Should find NO JSON imports except package.json and config files

#### Step 2: Add Build Optimization

**File:** `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/vite.config.ts`

**Add after line 12 (in the defineConfig):**

```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // ADD THIS SECTION:
  optimizeDeps: {
    exclude: [
      // Exclude translation files from optimization
      '/locales/**',
    ],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2020',
    minify: 'terser',
    // ... rest of build config
```

#### Step 3: Verify i18next Backend Config

**File:** `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/src/i18n/config.ts`

**Current config looks correct (Lines 158-162):**
```typescript
backend: {
  loadPath: '/locales/{{lng}}/{{ns}}.json',
  request: customRequest,
},
```

**Ensure translations are loaded at runtime, not bundled.**

**Test:**
```bash
npm run build

# Check if translation files are in dist/locales
ls -lh dist/locales/

# Check that they're NOT in JS bundles
grep -r "farm_profit" dist/assets/js/*.js
```

**Expected:**
- Translation files should exist in `dist/locales/`
- Should NOT find translation strings in JS bundles

---

## PHASE 1 TESTING CHECKLIST

After implementing all Phase 1 changes:

### Build Test
```bash
# Clean build
rm -rf dist node_modules/.vite
npm run build

# Check bundle sizes
du -sh dist/assets/js/*.js | sort -rh

# Expected output:
# 120K  vendor-react-[hash].js
# 80K   calc-agriculture-[hash].js (down from 433KB)
# 70K   calc-business-[hash].js (down from 360KB)
# 65K   calc-construction-[hash].js (down from 322KB)
# 50K   vendor-i18n-[hash].js
# 30K   vendor-router-[hash].js
# 10K   vendor-icons-[hash].js (down from 30KB)
# 10K   vendor-date-[hash].js (down from 25KB)
```

### Functional Testing

```bash
# Start dev server
npm run dev

# Test in browser (http://localhost:3000):
# 1. Homepage loads ✓
# 2. Navigate to Agriculture category ✓
# 3. Open FarmProfitCalculator ✓
# 4. Enter values and calculate ✓
# 5. Switch language (EN → AR → HE) ✓
# 6. Icons display correctly ✓
# 7. No console errors ✓
# 8. Check Network tab - translations loaded separately ✓
```

### Performance Testing

```bash
# Lighthouse audit
npm run build
npx serve dist
npx lighthouse http://localhost:3000 --view

# Expected improvements:
# Performance: 65-75 → 80-90
# LCP: 3.5-4.5s → 2.0-2.5s
```

---

## PHASE 2: MEDIUM-TERM IMPROVEMENTS (15-20% Additional Reduction)

### 2.1 Split CalculatorLayout Component

#### Step 1: Create Lightweight Layout

**Create:** `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/src/components/ui/CalculatorLayoutLite.tsx`

```typescript
import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { initDateInputRTLOnContainer } from '@/utils/dateInputRTL';

interface CalculatorLayoutLiteProps {
  title?: string;
  titleTooltip?: string;
  description?: string;
  inputSection?: React.ReactNode;
  resultSection?: React.ReactNode;
  children?: React.ReactNode;
  footerNote?: string;
  className?: string;
}

/**
 * Lightweight calculator layout without monetization features
 * Use this for simple calculators that don't need premium features
 */
const CalculatorLayoutLite: React.FC<CalculatorLayoutLiteProps> = ({
  title,
  titleTooltip,
  description,
  inputSection,
  resultSection,
  children,
  footerNote,
  className = '',
}) => {
  const { i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      initDateInputRTLOnContainer(containerRef.current);
    }
  }, []);

  return (
    <>
      {title && (
        <Helmet>
          <title>{title}</title>
          {description && <meta name="description" content={description} />}
        </Helmet>
      )}

      <div
        ref={containerRef}
        className={`calculator-layout ${className}`}
        dir={i18n.language === 'ar' || i18n.language === 'he' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        {title && (
          <div className="calculator-header">
            <h1 className="calculator-title">
              {title}
              {titleTooltip && (
                <span className="tooltip-icon" title={titleTooltip}>
                  ⓘ
                </span>
              )}
            </h1>
            {description && <p className="calculator-description">{description}</p>}
          </div>
        )}

        {/* Input Section */}
        {inputSection && <div className="calculator-inputs">{inputSection}</div>}

        {/* Result Section */}
        {resultSection && <div className="calculator-results">{resultSection}</div>}

        {/* Children (for custom content) */}
        {children}

        {/* Footer Note */}
        {footerNote && <div className="calculator-footer">{footerNote}</div>}
      </div>
    </>
  );
};

export default CalculatorLayoutLite;
```

#### Step 2: Update Simple Calculators to Use Lite Layout

**Example - Update CompostCalculator:**

**File:** `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/src/components/calculators/agriculture/CompostCalculator.tsx`

**Before (Line 11):**
```typescript
import CalculatorLayout from '@/components/ui/CalculatorLayout';
```

**After:**
```typescript
import CalculatorLayoutLite from '@/components/ui/CalculatorLayoutLite';
```

**And update component usage (find `<CalculatorLayout` and replace with `<CalculatorLayoutLite`):**

**Simple calculators to migrate (150 lines or less):**
- agriculture/CompostCalculator.tsx
- agriculture/EggProductionCalculator.tsx
- agriculture/MilkProductionCalculator.tsx
- agriculture/GreenhouseCalculator.tsx
- agriculture/TractorFuelCalculator.tsx

**Keep full CalculatorLayout for complex calculators:**
- agriculture/FarmProfitCalculator.tsx (370 lines)
- agriculture/FertilizerCalculator.tsx (306 lines)
- agriculture/SeedRateCalculator.tsx (374 lines)

#### Step 3: Lazy-Load Monetization in Full Layout

**File:** `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/src/components/ui/CalculatorLayout.tsx`

**Replace imports (Lines 6-11):**

**Before:**
```typescript
import PremiumExport from '../monetization/PremiumExport';
import SmartRecommendations from '../monetization/SmartRecommendations';
import ExitIntentModal from '../monetization/ExitIntentModal';
import ProductShowcase from '../monetization/ProductShowcase';
import EmbedWidget from '../monetization/EmbedWidget';
import ProductBanner from '../monetization/ProductBanner';
```

**After:**
```typescript
import React, { Suspense, lazy } from 'react';

// Lazy-load monetization features (only when needed)
const PremiumExport = lazy(() => import('../monetization/PremiumExport'));
const SmartRecommendations = lazy(() => import('../monetization/SmartRecommendations'));
const ExitIntentModal = lazy(() => import('../monetization/ExitIntentModal'));
const ProductShowcase = lazy(() => import('../monetization/ProductShowcase'));
const EmbedWidget = lazy(() => import('../monetization/EmbedWidget'));
const ProductBanner = lazy(() => import('../monetization/ProductBanner'));
```

**Wrap monetization features in Suspense:**

**Find where these components are rendered and wrap them:**

```typescript
{showExitIntent !== false && (
  <Suspense fallback={null}>
    <ExitIntentModal category={category} calculatorSlug={calculatorSlug} />
  </Suspense>
)}

{showProductShowcase && results && (
  <Suspense fallback={null}>
    <ProductShowcase category={category} results={results} />
  </Suspense>
)}

{/* Similar for other monetization components */}
```

---

### 2.2 Create Shared Calculator Hook

**Create:** `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/src/hooks/useCalculator.ts`

```typescript
import { useState, useCallback } from 'react';

export interface UseCalculatorOptions<T> {
  /**
   * Validation function - return true if inputs are valid
   */
  validate: () => boolean;

  /**
   * Calculation function - return the result object
   */
  calculate: () => T;

  /**
   * Optional reset function - called when reset button clicked
   */
  onReset?: () => void;
}

export interface UseCalculatorReturn<T> {
  result: T | null;
  showResult: boolean;
  error: string;
  setError: (error: string) => void;
  calculate: () => void;
  reset: () => void;
}

/**
 * Shared calculator hook for consistent state management
 * Reduces boilerplate code across all calculators
 *
 * @example
 * ```tsx
 * const { result, showResult, error, setError, calculate, reset } = useCalculator({
 *   validate: () => {
 *     if (!inputValue) {
 *       setError('Please enter a value');
 *       return false;
 *     }
 *     return true;
 *   },
 *   calculate: () => {
 *     return { total: parseFloat(inputValue) * 2 };
 *   },
 *   onReset: () => {
 *     setInputValue('');
 *   },
 * });
 * ```
 */
export function useCalculator<T>({
  validate,
  calculate,
  onReset,
}: UseCalculatorOptions<T>): UseCalculatorReturn<T> {
  const [result, setResult] = useState<T | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = useCallback(() => {
    // Clear previous errors
    setError('');

    // Validate inputs
    if (!validate()) {
      return;
    }

    // Hide result temporarily for smooth transition
    setShowResult(false);

    // Calculate with small delay for UX
    setTimeout(() => {
      try {
        const calculatedResult = calculate();
        setResult(calculatedResult);
        setShowResult(true);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'An error occurred during calculation'
        );
      }
    }, 300);
  }, [validate, calculate]);

  const handleReset = useCallback(() => {
    setResult(null);
    setShowResult(false);
    setError('');
    onReset?.();
  }, [onReset]);

  return {
    result,
    showResult,
    error,
    setError,
    calculate: handleCalculate,
    reset: handleReset,
  };
}
```

#### Example Refactor - CompostCalculator

**File:** `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/src/components/calculators/agriculture/CompostCalculator.tsx`

**Before:**
```typescript
const [result, setResult] = useState<CompostResult | null>(null);
const [showResult, setShowResult] = useState<boolean>(false);
const [error, setError] = useState<string>('');

const validateInputs = (): boolean => {
  setError('');
  // ... validation logic
  return true;
};

const calculate = () => {
  if (!validateInputs()) return;
  setShowResult(false);
  setTimeout(() => {
    try {
      // ... calculation logic
      setResult(calculatedResult);
      setShowResult(true);
    } catch (err) {
      setError('Calculation error');
    }
  }, 300);
};

const resetCalculator = () => {
  setResult(null);
  setShowResult(false);
  setError('');
  // ... reset inputs
};
```

**After:**
```typescript
import { useCalculator } from '@/hooks/useCalculator';

// Component state (inputs only)
const [greenMaterial, setGreenMaterial] = useState('');
const [brownMaterial, setBrownMaterial] = useState('');

const { result, showResult, error, setError, calculate, reset } = useCalculator<CompostResult>({
  validate: () => {
    const green = parseFloat(greenMaterial);
    const brown = parseFloat(brownMaterial);

    if (!green || !brown) {
      setError(t('compost.error_missing_inputs'));
      return false;
    }

    if (green <= 0 || brown <= 0) {
      setError(t('compost.error_negative_values'));
      return false;
    }

    return true;
  },

  calculate: () => {
    const green = parseFloat(greenMaterial);
    const brown = parseFloat(brownMaterial);

    // ... calculation logic
    return {
      totalMaterial: green + brown,
      ratio: green / brown,
      // ... other results
    };
  },

  onReset: () => {
    setGreenMaterial('');
    setBrownMaterial('');
  },
});
```

**Savings:** ~20-30 lines per calculator × 397 calculators = significant code reduction

---

## PHASE 3: LONG-TERM OPTIMIZATIONS

### 3.1 Dynamic Calculator Imports

**File:** `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/src/pages/CalculatorPage.tsx`

**Add dynamic import function:**

```typescript
import React, { Suspense, lazy, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ErrorFallback from '@/components/ErrorFallback';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Mapping of calculator slugs to component paths
const CALCULATOR_PATHS: Record<string, Record<string, string>> = {
  agriculture: {
    'farm-profit': 'FarmProfitCalculator',
    'fertilizer': 'FertilizerCalculator',
    'seed-rate': 'SeedRateCalculator',
    // ... add all agriculture calculators
  },
  business: {
    'profit-margin': 'ProfitMarginCalculator',
    // ... add all business calculators
  },
  // ... other categories
};

function CalculatorPage() {
  const { category, slug } = useParams<{ category: string; slug: string }>();

  // Dynamically import calculator component
  const CalculatorComponent = useMemo(() => {
    if (!category || !slug) return null;

    const componentName = CALCULATOR_PATHS[category]?.[slug];
    if (!componentName) return null;

    return lazy(() =>
      import(`@/components/calculators/${category}/${componentName}`)
        .catch(err => {
          console.error(`Failed to load calculator: ${category}/${componentName}`, err);
          return { default: ErrorFallback };
        })
    );
  }, [category, slug]);

  if (!CalculatorComponent) {
    return <ErrorFallback />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CalculatorComponent />
    </Suspense>
  );
}

export default CalculatorPage;
```

### 3.2 Split Agriculture Translations

**Create directory:** `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/public/locales/en/calc/agriculture/`

**Split the current agriculture.json into:**

```bash
mkdir -p public/locales/en/calc/agriculture
mkdir -p public/locales/ar/calc/agriculture
```

**Files to create:**

1. **general.json** - Common terms
2. **crops.json** - Fertilizer, SeedRate, Pesticide
3. **livestock.json** - EggProduction, MilkProduction
4. **equipment.json** - TractorFuel
5. **sustainability.json** - Compost, Greenhouse
6. **finance.json** - FarmProfit
7. **water.json** - Irrigation

**Update i18n config:**

**File:** `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/src/i18n/config.ts`

**Add to splitNamespaces (Line 8):**

```typescript
const splitNamespaces: Record<string, string[]> = {
  'calc/agriculture': ['crops', 'livestock', 'equipment', 'sustainability', 'finance', 'water', 'general'],
  'calc/business': ['vat', 'profit-margin', 'investment', 'inventory', 'depreciation', 'payroll', 'general'],
  // ... existing splits
}
```

---

## Verification Scripts

### Bundle Size Comparison Script

**Create:** `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/scripts/compare-bundle-sizes.sh`

```bash
#!/bin/bash

echo "=== BUNDLE SIZE COMPARISON ==="
echo ""
echo "Agriculture Bundle:"
du -h dist/assets/js/calc-agriculture-*.js | awk '{print "  Size: " $1}'
echo ""
echo "Business Bundle:"
du -h dist/assets/js/calc-business-*.js | awk '{print "  Size: " $1}'
echo ""
echo "Construction Bundle:"
du -h dist/assets/js/calc-construction-*.js | awk '{print "  Size: " $1}'
echo ""
echo "Vendor Chunks:"
du -h dist/assets/js/vendor-*.js | awk '{print "  " $2 ": " $1}'
echo ""
echo "=== TOTAL JS SIZE ==="
du -sh dist/assets/js/*.js | tail -1
```

**Run:**
```bash
chmod +x scripts/compare-bundle-sizes.sh
npm run build && ./scripts/compare-bundle-sizes.sh
```

---

## Rollback Plan

If something breaks:

```bash
# Restore from backup
git checkout HEAD -- vite.config.ts
git checkout HEAD -- src/

# Or restore specific file
git checkout HEAD -- src/components/calculators/agriculture/CompostCalculator.tsx

# Rebuild
rm -rf dist node_modules/.vite
npm run build
```

---

## Success Criteria

### Phase 1 Complete When:
- [ ] Agriculture bundle < 100 KB (target: 80 KB)
- [ ] Business bundle < 90 KB (target: 70 KB)
- [ ] Construction bundle < 80 KB (target: 65 KB)
- [ ] vendor-react chunk exists (~120 KB)
- [ ] vendor-i18n chunk exists (~50 KB)
- [ ] vendor-icons < 15 KB (target: 10 KB)
- [ ] All calculators still functional
- [ ] Translations load correctly
- [ ] No console errors

### Phase 2 Complete When:
- [ ] Additional 15-20% size reduction
- [ ] Monetization features lazy-loaded
- [ ] useCalculator hook used in 10+ calculators
- [ ] Code duplication reduced

### Phase 3 Complete When:
- [ ] Individual calculators < 10 KB each
- [ ] Translations split and lazy-loaded
- [ ] Lighthouse performance score > 85
- [ ] LCP < 2.5s

---

**Implementation Guide Version:** 1.0.0
**Last Updated:** 2026-01-18
