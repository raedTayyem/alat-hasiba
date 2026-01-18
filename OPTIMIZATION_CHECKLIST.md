# Bundle Optimization Progress Checklist

Track your optimization progress with this checklist.

---

## Pre-Optimization Baseline

**Record Initial Measurements:**

```bash
npm run build
```

- [ ] Agriculture bundle size: ______ KB (gzipped: ______ KB)
- [ ] Business bundle size: ______ KB (gzipped: ______ KB)
- [ ] Construction bundle size: ______ KB (gzipped: ______ KB)
- [ ] Automotive bundle size: ______ KB (gzipped: ______ KB)
- [ ] Total dist/assets/js/ size: ______ MB
- [ ] Lighthouse Performance Score: ______
- [ ] LCP: ______ seconds
- [ ] TTI: ______ seconds

**Date Started:** ______________

---

## PHASE 1: Quick Wins (Target: 2 hours, 60-70% reduction)

### 1.1 Vendor Chunk Splitting (30 minutes)

**File:** `/vite.config.ts`

- [ ] **Backup original file**
  ```bash
  cp vite.config.ts vite.config.ts.backup
  ```

- [ ] **Update manualChunks function** (lines 41-49)
  - [ ] Add React vendor chunk (`vendor-react`)
  - [ ] Add i18n vendor chunk (`vendor-i18n`)
  - [ ] Add icons vendor chunk (`vendor-icons`)
  - [ ] Add date vendor chunk (`vendor-date`)
  - [ ] Add router vendor chunk (`vendor-router`)
  - [ ] Add helmet vendor chunk (`vendor-helmet`)
  - [ ] Add UI vendor chunk (`vendor-ui`)
  - [ ] Keep calculator category chunking logic

- [ ] **Test build**
  ```bash
  rm -rf dist node_modules/.vite
  npm run build
  ```

- [ ] **Verify new chunks created**
  ```bash
  ls -lh dist/assets/js/vendor-*.js
  ```

  Expected files:
  - [ ] vendor-react-[hash].js (~120 KB)
  - [ ] vendor-i18n-[hash].js (~50 KB)
  - [ ] vendor-icons-[hash].js (~30 KB before optimization)
  - [ ] vendor-date-[hash].js (~25 KB before optimization)

- [ ] **Record new bundle sizes**
  - [ ] Agriculture bundle: ______ KB (target: <150 KB)
  - [ ] Business bundle: ______ KB (target: <130 KB)
  - [ ] Construction bundle: ______ KB (target: <120 KB)

- [ ] **Functional testing**
  - [ ] Homepage loads
  - [ ] Calculator pages load
  - [ ] Calculations work
  - [ ] No console errors

- [ ] **Commit changes**
  ```bash
  git add vite.config.ts
  git commit -m "feat: implement vendor chunk splitting for bundle optimization"
  ```

**Status:** ☐ Not Started | ☐ In Progress | ☐ Completed | ☐ Blocked

**Notes:** _______________________________________________________________

---

### 1.2 Fix Lucide Icons Tree-Shaking (60 minutes)

#### Part A: Create Icons Utility

- [ ] **Create new file:** `/src/utils/icons.ts`

- [ ] **Add tree-shakeable exports**
  - [ ] Export common icons (DollarSign, Info, Scale, etc.)
  - [ ] Export agriculture icons (Sprout, Egg, Milk, etc.)
  - [ ] Export business icons (TrendingUp, BarChart3, etc.)
  - [ ] Export construction icons (Hammer, Box, Layers, etc.)
  - [ ] Export automotive icons (Fuel, Zap, etc.)

- [ ] **Find all icons currently used**
  ```bash
  grep -roh "import {[^}]*} from 'lucide-react'" src/ | sort -u > icons-used.txt
  ```

- [ ] **Verify all used icons are exported**

#### Part B: Update Calculator Imports

- [ ] **Update CalculatorLayout.tsx** (line 12)
  ```typescript
  // Before: import { Info, HelpCircle } from 'lucide-react';
  // After: import { Info, HelpCircle } from '@/utils/icons';
  ```

- [ ] **Update agriculture calculators** (10 files)
  - [ ] CompostCalculator.tsx
  - [ ] EggProductionCalculator.tsx
  - [ ] FarmProfitCalculator.tsx
  - [ ] FertilizerCalculator.tsx
  - [ ] GreenhouseCalculator.tsx
  - [ ] IrrigationCalculator.tsx
  - [ ] MilkProductionCalculator.tsx
  - [ ] PesticideCalculator.tsx
  - [ ] SeedRateCalculator.tsx
  - [ ] TractorFuelCalculator.tsx

- [ ] **Update business calculators** (54 files)
  ```bash
  find src/components/calculators/business -name "*.tsx" | wc -l
  ```
  - [ ] Bulk find/replace or manual update
  - [ ] Test 5 random calculators

- [ ] **Update construction calculators** (40 files)
  - [ ] Bulk find/replace or manual update
  - [ ] Test 5 random calculators

- [ ] **Update automotive calculators** (31 files)
  - [ ] Bulk find/replace or manual update
  - [ ] Test 5 random calculators

- [ ] **Update remaining calculator categories**
  - [ ] electrical (31 files)
  - [ ] real-estate (30 files)
  - [ ] fitness (30 files)
  - [ ] pet (21 files)
  - [ ] environmental (21 files)
  - [ ] health (12 files)
  - [ ] converters (12 files)
  - [ ] math (11 files)
  - [ ] physics (10 files)
  - [ ] gaming (10 files)
  - [ ] cooking (10 files)

#### Part C: Test & Verify

- [ ] **Build and check sizes**
  ```bash
  npm run build
  du -sh dist/assets/js/vendor-icons-*.js
  ```

  Expected: ~5-10 KB (down from ~30 KB)

- [ ] **Visual test - icons display correctly**
  - [ ] Agriculture calculator icons ✓
  - [ ] Business calculator icons ✓
  - [ ] Construction calculator icons ✓
  - [ ] Other category icons ✓

- [ ] **Record new bundle sizes**
  - [ ] Agriculture bundle: ______ KB (target: <100 KB)
  - [ ] vendor-icons: ______ KB (target: <10 KB)

- [ ] **Commit changes**
  ```bash
  git add src/utils/icons.ts src/components/
  git commit -m "feat: implement tree-shakeable icon imports"
  ```

**Status:** ☐ Not Started | ☐ In Progress | ☐ Completed | ☐ Blocked

**Notes:** _______________________________________________________________

---

### 1.3 Optimize date-fns Imports (30 minutes)

- [ ] **Find all date-fns usage**
  ```bash
  grep -rn "from 'date-fns'" src/ > date-fns-usage.txt
  ```

- [ ] **Create date utility:** `/src/utils/date.ts`
  - [ ] Export format
  - [ ] Export addDays, subDays
  - [ ] Export addMonths, subMonths
  - [ ] Export differenceInDays, differenceInMonths
  - [ ] Export other used functions

- [ ] **Update imports** (all files from grep results)
  ```typescript
  // Before: import { format, addDays } from 'date-fns';
  // After: import { format, addDays } from '@/utils/date';
  ```

- [ ] **Test date functionality**
  - [ ] Date calculators work
  - [ ] Age calculator works
  - [ ] Date difference calculator works

- [ ] **Build and verify**
  ```bash
  npm run build
  du -sh dist/assets/js/vendor-date-*.js
  ```

  Expected: ~8-12 KB (down from ~25 KB)

- [ ] **Record new bundle sizes**
  - [ ] vendor-date: ______ KB (target: <12 KB)

- [ ] **Commit changes**
  ```bash
  git add src/utils/date.ts src/
  git commit -m "feat: optimize date-fns imports for better tree-shaking"
  ```

**Status:** ☐ Not Started | ☐ In Progress | ☐ Completed | ☐ Blocked

**Notes:** _______________________________________________________________

---

### 1.4 Verify Translations Not Bundled (30 minutes)

- [ ] **Check for static JSON imports**
  ```bash
  grep -rn "import.*\.json" src/ | grep -v package.json
  ```

  Expected: No results (or only config files)

- [ ] **Check translation files exist in public/**
  ```bash
  ls -lh public/locales/en/calc/
  ```

  Expected: All translation JSON files present

- [ ] **Test translation loading in Network tab**
  - [ ] Open browser DevTools → Network
  - [ ] Load agriculture calculator
  - [ ] Filter by "locales"
  - [ ] Verify: agriculture.json loaded as XHR/Fetch request
  - [ ] Verify: NOT embedded in JS bundle

- [ ] **If translations are bundled (bad):**
  - [ ] Add to vite.config.ts optimizeDeps.exclude
  - [ ] Add rollupOptions.external pattern
  - [ ] Test again

- [ ] **Build and check bundle contents**
  ```bash
  npm run build
  # Translations should NOT be in JS bundles
  grep -r "farm_profit" dist/assets/js/*.js
  ```

  Expected: No matches (translations in separate files)

- [ ] **Record final Phase 1 sizes**
  - [ ] Agriculture bundle: ______ KB (target: <80 KB)
  - [ ] Business bundle: ______ KB (target: <70 KB)
  - [ ] Construction bundle: ______ KB (target: <65 KB)
  - [ ] Total JS size: ______ MB (target: <2 MB)

- [ ] **Commit if changes made**
  ```bash
  git add vite.config.ts
  git commit -m "fix: ensure translations loaded at runtime, not bundled"
  ```

**Status:** ☐ Not Started | ☐ In Progress | ☐ Completed | ☐ Blocked

**Notes:** _______________________________________________________________

---

## PHASE 1 COMPLETION CHECKLIST

### Bundle Size Targets Met?

- [ ] Agriculture bundle < 100 KB (current: ______)
- [ ] Business bundle < 90 KB (current: ______)
- [ ] Construction bundle < 80 KB (current: ______)
- [ ] vendor-react exists (~120 KB)
- [ ] vendor-i18n exists (~50 KB)
- [ ] vendor-icons < 15 KB
- [ ] vendor-date < 15 KB

### Functional Testing

- [ ] **Homepage**
  - [ ] Loads correctly
  - [ ] Navigation works
  - [ ] Language switch works (EN/AR/HE)

- [ ] **Agriculture Calculators** (test all 10)
  - [ ] CompostCalculator ✓
  - [ ] EggProductionCalculator ✓
  - [ ] FarmProfitCalculator ✓
  - [ ] FertilizerCalculator ✓
  - [ ] GreenhouseCalculator ✓
  - [ ] IrrigationCalculator ✓
  - [ ] MilkProductionCalculator ✓
  - [ ] PesticideCalculator ✓
  - [ ] SeedRateCalculator ✓
  - [ ] TractorFuelCalculator ✓

- [ ] **Sample Other Categories**
  - [ ] Business calculator (any) ✓
  - [ ] Construction calculator (any) ✓
  - [ ] Automotive calculator (any) ✓

- [ ] **Visual Checks**
  - [ ] Icons display correctly
  - [ ] Translations load (no missing text)
  - [ ] Date pickers work
  - [ ] Results display properly

- [ ] **Console Checks**
  - [ ] No errors in console
  - [ ] No missing module warnings
  - [ ] Translations loaded (check Network tab)

### Performance Testing

- [ ] **Lighthouse Audit**
  ```bash
  npm run build
  npx serve dist
  npx lighthouse http://localhost:3000 --view
  ```

  - [ ] Performance score: ______ (target: >80)
  - [ ] LCP: ______ seconds (target: <2.5s)
  - [ ] TTI: ______ seconds (target: <3.0s)

- [ ] **Bundle Analyzer**
  ```bash
  npx vite-bundle-visualizer
  ```

  - [ ] Verify vendor chunks separated
  - [ ] No duplicate dependencies visible
  - [ ] Calculator bundles are smaller

### Documentation

- [ ] **Update CHANGELOG.md** (if exists)
- [ ] **Record before/after metrics**

**PHASE 1 COMPLETION DATE:** ______________

**Total Time Spent:** ______ hours

**Bundle Size Reduction Achieved:** ______ %

**Notes/Lessons Learned:**
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________

---

## PHASE 2: Medium-Term Improvements (Target: 8 hours, 15-20% additional)

### 2.1 Split CalculatorLayout Component (3 hours)

- [ ] **Create CalculatorLayoutLite.tsx**
  - [ ] Copy minimal layout code
  - [ ] Remove monetization imports
  - [ ] Keep essential props only

- [ ] **Update simple calculators** (100-200 lines)
  - [ ] List calculators to migrate: __________
  - [ ] Update imports
  - [ ] Test each calculator

- [ ] **Lazy-load monetization in full layout**
  - [ ] Convert imports to React.lazy()
  - [ ] Wrap in Suspense
  - [ ] Test monetization features still work

- [ ] **Test and measure**
  - [ ] Build and check sizes
  - [ ] Functional testing
  - [ ] Commit changes

**Status:** ☐ Not Started | ☐ In Progress | ☐ Completed | ☐ Blocked

---

### 2.2 Create useCalculator Hook (4 hours)

- [ ] **Create hook:** `/src/hooks/useCalculator.ts`
  - [ ] Implement state management
  - [ ] Add validation wrapper
  - [ ] Add calculation wrapper
  - [ ] Add reset function

- [ ] **Refactor sample calculators** (5-10)
  - [ ] CompostCalculator
  - [ ] EggProductionCalculator
  - [ ] MilkProductionCalculator
  - [ ] _______________ (add more)
  - [ ] _______________ (add more)

- [ ] **Document pattern**
  - [ ] Add JSDoc comments
  - [ ] Create usage examples
  - [ ] Update developer guide

- [ ] **Test and commit**

**Status:** ☐ Not Started | ☐ In Progress | ☐ Completed | ☐ Blocked

---

### 2.3 Optimize react-helmet-async (1 hour)

- [ ] **Add to vite.config.ts optimizeDeps**
- [ ] **Test SEO meta tags still work**
- [ ] **Measure impact**

**Status:** ☐ Not Started | ☐ In Progress | ☐ Completed | ☐ Blocked

---

## PHASE 2 COMPLETION CHECKLIST

- [ ] Bundle sizes reduced by 15-20% from Phase 1
- [ ] CalculatorLayoutLite used in 20+ calculators
- [ ] useCalculator hook used in 10+ calculators
- [ ] All tests passing
- [ ] Code quality improved

**PHASE 2 COMPLETION DATE:** ______________

---

## PHASE 3: Long-Term Optimizations (Target: 20 hours, 50% additional)

### 3.1 Dynamic Calculator Imports (12 hours)

- [ ] **Create calculator path mapping**
- [ ] **Update CalculatorPage.tsx**
- [ ] **Test all calculator categories**
- [ ] **Measure individual calculator sizes**

**Status:** ☐ Not Started | ☐ In Progress | ☐ Completed | ☐ Blocked

---

### 3.2 Split Translation Files (8 hours)

- [ ] **Split agriculture translations**
  - [ ] Create subdirectory structure
  - [ ] Split into 7 files
  - [ ] Update i18n config
  - [ ] Test loading

- [ ] **Split other large translation files**
  - [ ] business (already split)
  - [ ] construction (already split)
  - [ ] automotive (already split)

**Status:** ☐ Not Started | ☐ In Progress | ☐ Completed | ☐ Blocked

---

### 3.3 Additional Optimizations

- [ ] **Implement preloading strategy**
- [ ] **Add brotli compression**
- [ ] **Final performance tuning**

**Status:** ☐ Not Started | ☐ In Progress | ☐ Completed | ☐ Blocked

---

## PHASE 3 COMPLETION CHECKLIST

- [ ] Individual calculators < 10 KB each
- [ ] Translations fully split and lazy-loaded
- [ ] Lighthouse performance score > 90
- [ ] LCP < 2.0 seconds
- [ ] All 397 calculators functional

**PHASE 3 COMPLETION DATE:** ______________

---

## FINAL RESULTS

### Bundle Size Comparison

| Metric | Before | After Phase 1 | After Phase 2 | After Phase 3 |
|--------|--------|---------------|---------------|---------------|
| Agriculture | 433 KB | ______ KB | ______ KB | ______ KB |
| Business | 360 KB | ______ KB | ______ KB | ______ KB |
| Construction | 322 KB | ______ KB | ______ KB | ______ KB |
| Total JS | ______ MB | ______ MB | ______ MB | ______ MB |

### Performance Comparison

| Metric | Before | After |
|--------|--------|-------|
| Lighthouse Score | ______ | ______ |
| LCP | ______ s | ______ s |
| TTI | ______ s | ______ s |
| TBT | ______ ms | ______ ms |

### Total Impact

- **Total Time Invested:** ______ hours
- **Bundle Size Reduction:** ______ %
- **Performance Improvement:** ______ %
- **User Experience Impact:** ______

---

## Rollback Procedures

If critical issues occur:

```bash
# Restore from git
git checkout HEAD -- vite.config.ts
git checkout HEAD -- src/

# Or restore from backup
cp vite.config.ts.backup vite.config.ts

# Rebuild
rm -rf dist node_modules/.vite
npm run build
npm run dev
```

---

## Notes & Issues Encountered

**Date:** __________ **Issue:** ___________________________________ **Resolution:** ___________________________________

**Date:** __________ **Issue:** ___________________________________ **Resolution:** ___________________________________

**Date:** __________ **Issue:** ___________________________________ **Resolution:** ___________________________________

---

**Checklist Version:** 1.0.0
**Project:** Alathasiba Calculator Platform
**Last Updated:** 2026-01-18
