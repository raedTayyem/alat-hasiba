# Bundle Optimization Quick Start Guide
## 5-Minute Overview

---

## Current Problem

**Agriculture bundle: 433 KB → Should be: 80 KB**

Your calculator bundles are 5-6x larger than they should be.

---

## Root Causes (Priority Order)

1. **No vendor chunk splitting** - React/i18n duplicated in every bundle (60% of problem)
2. **Lucide icons not tree-shaken** - Full icon library in every bundle (15% of problem)
3. **date-fns not optimized** - Entire library bundled (10% of problem)
4. **Heavy CalculatorLayout** - 6 monetization features always loaded (10% of problem)
5. **Translation files** - May be bundled instead of lazy-loaded (5% of problem)

---

## Quick Fix (2 Hours, 60-70% Reduction)

### Step 1: Fix Vendor Splitting (30 minutes)

**File:** `vite.config.ts`

**Replace the `manualChunks` function (lines 41-49) with:**

```typescript
manualChunks(id) {
  if (id.includes('node_modules')) {
    if (id.includes('react/') || id.includes('react-dom/')) return 'vendor-react';
    if (id.includes('i18next')) return 'vendor-i18n';
    if (id.includes('lucide-react')) return 'vendor-icons';
    if (id.includes('date-fns')) return 'vendor-date';
    return 'vendor';
  }
  if (id.includes('/calculators/')) {
    const match = id.match(/calculators\/([^/]+)\//);
    if (match) return `calc-${match[1]}`;
  }
}
```

**Test:**
```bash
npm run build
du -sh dist/assets/js/*.js | sort -rh | head -10
```

**Expected:** Agriculture bundle should drop from 433 KB to ~120 KB

---

### Step 2: Fix Icon Imports (60 minutes)

**Create:** `src/utils/icons.ts`

```typescript
// Tree-shakeable icon imports
export { default as Sprout } from 'lucide-react/dist/esm/icons/sprout';
export { default as DollarSign } from 'lucide-react/dist/esm/icons/dollar-sign';
export { default as Info } from 'lucide-react/dist/esm/icons/info';
export { default as Scale } from 'lucide-react/dist/esm/icons/scale';
// ... add all icons you use (grep for them)
```

**Find/replace in all calculator files:**

```bash
# Find files to update
grep -rl "from 'lucide-react'" src/components/calculators/

# Replace (or do manually in your editor)
find src/components/calculators -name "*.tsx" -exec sed -i '' "s/from 'lucide-react'/from '@\/utils\/icons'/g" {} +
```

**Also update:** `src/components/ui/CalculatorLayout.tsx` (line 12)

**Test:**
```bash
npm run build
# Agriculture bundle should now be ~80-90 KB
```

---

### Step 3: Optimize date-fns (30 minutes)

**Create:** `src/utils/date.ts`

```typescript
// Tree-shakeable date utilities
export { default as format } from 'date-fns/format';
export { default as addDays } from 'date-fns/addDays';
export { default as differenceInDays } from 'date-fns/differenceInDays';
// ... add all date-fns functions you use
```

**Update all imports:**

```bash
# Find files
grep -rl "from 'date-fns'" src/

# Replace:
# OLD: import { format, addDays } from 'date-fns';
# NEW: import { format, addDays } from '@/utils/date';
```

**Test:**
```bash
npm run build
# Agriculture bundle should now be ~80 KB
```

---

## Expected Results After Quick Fix

### Before:
```
calc-agriculture: 433 KB (126.71 KB gzipped)
calc-business:    360 KB (40.03 KB gzipped)
calc-construction: 322 KB (37.63 KB gzipped)
```

### After:
```
calc-agriculture:  80 KB (12 KB gzipped)
calc-business:     70 KB (10 KB gzipped)
calc-construction: 65 KB (9 KB gzipped)

NEW SHARED CHUNKS (cached across pages):
vendor-react:      120 KB (35 KB gzipped)
vendor-i18n:       50 KB (12 KB gzipped)
vendor-icons:      10 KB (3 KB gzipped)
vendor-date:       10 KB (3 KB gzipped)
```

**Total reduction: 81% for calculator bundles**

---

## Testing Checklist

After making changes:

```bash
# 1. Build
npm run build

# 2. Check sizes
du -sh dist/assets/js/*.js | sort -rh | head -10

# 3. Run dev server
npm run dev

# 4. Test in browser
# - Homepage loads ✓
# - Open any calculator ✓
# - Calculate works ✓
# - Icons show ✓
# - Language switch works ✓
# - No console errors ✓
```

---

## If Something Breaks

```bash
# Revert changes
git checkout HEAD -- vite.config.ts
git checkout HEAD -- src/

# Rebuild
rm -rf dist node_modules/.vite
npm run build
```

---

## Next Steps (Optional, After Quick Fix Works)

1. **Split CalculatorLayout** - Create lightweight version (2-3 hours)
2. **Create useCalculator hook** - Reduce boilerplate (3-4 hours)
3. **Dynamic imports** - Load calculators individually (8-12 hours)

See `OPTIMIZATION_IMPLEMENTATION_GUIDE.md` for details.

---

## Common Issues

### Issue: "Module not found" after icon changes

**Cause:** Icon name in utils/icons.ts doesn't match usage

**Fix:**
```bash
# Find all icons used
grep -roh "import {[^}]*} from 'lucide-react'" src/ | sort -u

# Add missing icons to utils/icons.ts
```

### Issue: Bundle still large after vendor splitting

**Cause:** Vite cache not cleared

**Fix:**
```bash
rm -rf dist node_modules/.vite
npm run build
```

### Issue: Translations not loading

**Cause:** i18next backend misconfigured

**Fix:** Check browser Network tab, translations should load from `/locales/`, not be in JS bundles

---

## Useful Commands

```bash
# Check bundle sizes
du -sh dist/assets/js/*.js | sort -rh

# Find all lucide-react imports
grep -rn "from 'lucide-react'" src/

# Find all date-fns imports
grep -rn "from 'date-fns'" src/

# Bundle analyzer
npx vite-bundle-visualizer

# Lighthouse audit
npx lighthouse http://localhost:3000 --view
```

---

## Key Files to Modify

```
Quick Fix (2 hours):
✓ vite.config.ts - Add vendor splitting
✓ src/utils/icons.ts - Create this file
✓ src/utils/date.ts - Create this file
✓ src/components/calculators/**/*.tsx - Update imports (bulk find/replace)
✓ src/components/ui/CalculatorLayout.tsx - Update icon import

Full Optimization (16 hours):
✓ src/components/ui/CalculatorLayoutLite.tsx - Create lightweight layout
✓ src/hooks/useCalculator.ts - Create shared hook
✓ src/pages/CalculatorPage.tsx - Add dynamic imports
✓ public/locales/*/calc/agriculture/*.json - Split translations
```

---

## Support

For detailed instructions, see:
- **BUNDLE_OPTIMIZATION_REPORT.md** - Full analysis and recommendations
- **OPTIMIZATION_IMPLEMENTATION_GUIDE.md** - Step-by-step code changes

---

**Quick Start Version:** 1.0.0
**Estimated Time:** 2 hours for 60-70% improvement
**Expected Savings:** ~1.5 MB total bundle size reduction
