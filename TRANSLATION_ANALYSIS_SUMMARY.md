# Translation Keys Analysis Report for All Calculators

**Generated:** 2026-01-18
**Project:** Alathasiba Calculator Suite

---

## Executive Summary

- **Total Unique Calculators:** 389 (after removing duplicates)
- **Total Translation Keys Across All:** 12,390 keys
- **Average Keys per Calculator:** 32 keys
- **Fully Translated (EN+AR):** 1 calculator (0.3%)
- **Partially Translated:** 61 calculators (15.7%)
- **Missing Translations:** 306 calculators (78.7%)
- **No Component Found:** 21 calculators (5.4%)

---

## Duplicate Slugs (7 Found)

These calculator slugs appear in multiple category files and need to be documented/resolved:

### 1. **acceleration-calculator**
- **automotive:** `src/data/calculators/automotiveCalculators.ts:204`
- **physics:** `src/data/calculators/physicsCalculators.ts:53`

### 2. **battery-life-calculator**
- **automotive:** `src/data/calculators/automotiveCalculators.ts:422`
- **electrical:** `src/data/calculators/electricalCalculators.ts:282`

### 3. **loan-amortization-calculator**
- **business:** `src/data/calculators/businessCalculators.ts:674`
- **finance:** `src/data/calculators/financeCalculators.ts:53` (commented out)

### 4. **travel-cost-calculator**
- **business:** `src/data/calculators/businessCalculators.ts:687`
- **finance:** `src/data/calculators/financeCalculators.ts:97` (commented out)

### 5. **concrete-calculator**
- **construction:** `src/data/calculators/constructionCalculators.ts:16`
- **engineering:** `src/data/calculators/engineeringCalculators.ts:37`

### 6. **reading-speed-calculator**
- **education:** `src/data/calculators/educationCalculators.ts:10` (commented out)
- **education:** `src/data/calculators/educationCalculators.ts:119`

### 7. **water-intake-calculator**
- **fitness:** `src/data/calculators/fitnessCalculators.ts:135`
- **health:** `src/data/calculators/healthCalculators.ts:81`

---

## Translation Status Overview

### Categories by Translation Status

#### Fully Translated (1 calculator)
Only **1 calculator** has complete EN and AR translations:
- `holy-week-traditions` - Component has all translations in both languages

#### Partially Translated (61 calculators - 15.7%)
These calculators have some translation keys present but are incomplete.

#### Missing All Translations (306 calculators - 78.7%)
The vast majority of calculators have **NO translations** in the common.json files. All translation keys are missing in both EN and AR.

#### No Component Found (21 calculators - 5.4%)
These calculator slugs exist in the data files but their component files could not be located:
- 401k-calculator
- 555-timer-calculator
- And 19 others (see detailed report)

---

## Critical Findings

### 1. Massive Translation Gap
**98.7% of calculators** (383 out of 389) are either partially translated or completely missing translations. This represents approximately **12,300+ missing translation keys** across both languages.

### 2. Translation File Structure
The current `common.json` files for EN and AR contain:
- Basic UI elements (buttons, labels, common terms)
- General navigation
- Error messages
- But **very few calculator-specific translations**

### 3. Translation Key Pattern
Calculator components use the pattern:
```
calc/{category}:{calculator}.{key}
```
Examples:
- `calc/automotive:acceleration.title`
- `calc/fitness:water-intake-calculator.description`
- `calc/finance:zakat.inputs.wealth_label`

These namespaced keys are **NOT present** in the `common.json` files. They likely need to be in separate translation files like:
- `/public/locales/en/calc/automotive.json`
- `/public/locales/ar/calc/finance.json`
etc.

### 4. Component Files Missing
21 calculator slugs don't have corresponding component files, suggesting:
- Calculators not yet implemented
- Component naming mismatch
- Components in unexpected locations

---

## Recommendations

### Immediate Actions

1. **Create Category-Specific Translation Files**
   - Create translation files for each calculator category
   - Structure: `/public/locales/{lang}/calc/{category}.json`
   - This will reduce the size of `common.json` and organize translations better

2. **Address Duplicate Slugs**
   - Document which duplicate slug should be primary
   - Either merge similar calculators or rename one to be unique
   - Update routing to handle duplicates properly

3. **Prioritize High-Traffic Calculators**
   - Based on popularity scores in the data files
   - Translate the most-used calculators first
   - Focus on: BMI, Calorie, Zakat, Loan calculators (popularity 8-10)

4. **Missing Components Audit**
   - Investigate the 21 calculators with no component files
   - Either create components or remove from data files
   - Update component naming conventions for consistency

### Long-Term Strategy

1. **Translation Pipeline**
   - Set up a systematic translation workflow
   - Create translation templates for each category
   - Use i18n best practices for pluralization and formatting

2. **Automated Checks**
   - Add pre-commit hooks to verify translation keys exist
   - Create scripts to detect missing translations
   - Track translation coverage in CI/CD

3. **Documentation**
   - Document translation key naming conventions
   - Create a translation guide for contributors
   - Maintain a translation status dashboard

---

## Sample Missing Keys (Common Patterns)

Most calculators are missing keys in these categories:
- `{calc}.title` - Calculator title
- `{calc}.description` - Calculator description
- `{calc}.inputs.*` - Input field labels and tooltips
- `{calc}.results.*` - Result display labels
- `{calc}.errors.*` - Validation error messages
- `{calc}.info.*` - Help text and information sections
- `{calc}.placeholders.*` - Input placeholder text

---

## Next Steps

1. Review this analysis with the development team
2. Decide on translation file structure (separate category files vs monolithic)
3. Create a translation priority list based on calculator popularity
4. Assign translation work for high-priority calculators
5. Resolve duplicate slug conflicts
6. Investigate and fix missing component files
7. Set up translation automation and verification tools

---

## Detailed Data

For the complete detailed analysis of all 389 calculators including:
- Individual calculator translation status
- Specific missing keys for each calculator
- Component file locations
- Full translation statistics

See: `translation-analysis-report.txt` (800KB detailed report)

---

**Report Generated By:** Automated Translation Analysis Script
**Total Analysis Time:** ~30 seconds
**Files Analyzed:** 25 calculator data files, 368 component files, 2 translation files
