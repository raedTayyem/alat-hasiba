# Translation Coverage Analysis - Summary Report

**Generated:** January 18, 2026
**Analysis Tool:** `analyze-translations.cjs` (Updated to check ALL translation files)

---

## Executive Summary

The translation coverage analysis has been updated to check **ALL translation files** including:
- `/public/locales/en/common.json` and `/public/locales/ar/common.json`
- **72 category-specific files** in `/public/locales/{lang}/calc/**/*.json`

### Key Statistics

| Metric | Value |
|--------|-------|
| **Total Calculators** | 395 |
| **Total Translation Keys** | 12,390 |
| **Average Keys per Calculator** | 31 |
| **Average EN Coverage** | 5% |
| **Average AR Coverage** | 5% |
| **Fully Translated (100% EN+AR)** | 1 calculator |
| **Partially Translated** | 159 calculators |
| **Missing All Translations** | 208 calculators |
| **No Component Found** | 27 calculators |

---

## Critical Findings

### 1. Translation Files Loaded
- **English (EN):** 30,414 keys across all files
- **Arabic (AR):** 30,414 keys across all files

### 2. Coverage Issues
- Only **1 calculator** (0.25%) is fully translated in both languages
- **208 calculators** (52.7%) have NO translations at all
- **159 calculators** (40.3%) have partial translations
- Overall coverage is critically low at just **5%**

### 3. The Only Fully Translated Calculator
- `holy-week-traditions` (34 keys) - 100% EN+AR coverage

### 4. High Coverage Calculators (90%+)
Several calculators are very close to being fully translated:
- `abjad-calculator` - 97% (29/30 keys) - Missing only "description"
- `random-number-generator` - 94% (30/32 keys)
- `shoe-size-converter` - 94% (30/32 keys)
- `clothing-size-converter` - 92% (33/36 keys)

---

## Top 20 Calculators with Most Missing Translations

| Rank | Calculator | Total Keys | EN Coverage | AR Coverage | Total Missing |
|------|-----------|------------|-------------|-------------|---------------|
| 1 | inheritance-calculator | 82 | 2% | 2% | 160 |
| 2 | power-electricity-calculator | 81 | 5% | 5% | 154 |
| 3 | rent-vs-buy-calculator | 68 | 0% | 0% | 136 |
| 4 | momentum-calculator | 67 | 1% | 1% | 132 |
| 5 | gravel-calculator | 65 | 0% | 0% | 130 |
| 6 | energy-calculator | 65 | 3% | 3% | 126 |
| 7 | deck-calculator | 62 | 2% | 2% | 122 |
| 8 | velocity-acceleration-calculator | 64 | 5% | 5% | 122 |
| 9 | sustainable-lifestyle-calculator | 60 | 0% | 0% | 120 |
| 10 | wallpaper-calculator | 61 | 2% | 2% | 120 |
| 11 | amazon-fba-calculator | 60 | 2% | 2% | 118 |
| 12 | lease-vs-buy-calculator | 59 | 0% | 0% | 118 |
| 13 | paint-calculator | 58 | 0% | 0% | 116 |
| 14 | pipe-calculator | 59 | 2% | 2% | 116 |
| 15 | labor-cost-construction-calculator | 59 | 3% | 3% | 114 |
| 16 | roofing-calculator | 58 | 2% | 2% | 114 |
| 17 | tile-calculator | 58 | 2% | 2% | 114 |
| 18 | carbon-emissions-calculator | 55 | 2% | 2% | 108 |
| 19 | ceiling-calculator | 55 | 2% | 2% | 108 |
| 20 | eco-score-calculator | 54 | 0% | 0% | 108 |

---

## Issues Identified

### 1. Translation Key Format (RESOLVED)
The script has been updated to correctly handle i18next namespace format:
- `calc/misc:abjad.standard_title` (namespace format with colon)
- `common.error.invalid_input` (dot notation)
- `translation:key.path` (translation namespace)

**Status:** FIXED - The checkKey function now properly parses and validates both formats.

### 2. Missing Translation Entries
While we have 72 category files loaded with 30,414 keys each, many calculators are referencing keys that don't exist in any of the translation files.

**Statistics:**
- 208 calculators (52.7%) have 0% translations
- 159 calculators (40.3%) have partial translations
- This suggests many components were created without adding corresponding translation entries

### 3. Duplicate Slugs
The analysis found **0 duplicate slugs** after removing duplicates, resulting in 395 unique calculators.

### 4. Common Missing Keys Pattern
Many calculators are missing common keys like:
- `calculators.invalid_input`
- `calculators.calculation_error`
- `calc/[category]:[calculator].description`
- `calc/[category]:[calculator].use_cases_title`

These could be centralized in common.json or a shared namespace.

---

## Recommendations

### Immediate Actions (Quick Wins)
1. **Complete Near-Finished Calculators:** Add missing translations for the 4 calculators at 90%+ coverage
   - `abjad-calculator` - Only needs 1 key: "description"
   - `random-number-generator` - Only needs 2 keys
   - `shoe-size-converter` - Only needs 2 keys
   - `clothing-size-converter` - Only needs 3 keys

2. **Add Common Error Keys:** Create centralized error messages in common.json:
   - `calculators.invalid_input`
   - `calculators.calculation_error`
   - These are used by multiple calculators

3. **Prioritize High-Impact Calculators:** Focus on the top 20 with most missing keys (listed above)

### Long-term Strategy
1. **Implement Translation CI/CD:** Add automated checks to prevent missing translations
2. **Create Translation Guidelines:** Document the correct format for translation keys
3. **Prioritize High-Traffic Calculators:** Start with calculators that have the most missing keys
4. **Add Translation Validation:** Update the build process to fail if translations are missing

---

## Files Generated

1. **`analyze-translations.cjs`** - Updated script that checks ALL translation files
2. **`translation-coverage-report.txt`** - Detailed breakdown of every calculator (395 calculators)
3. **`TRANSLATION-SUMMARY.md`** - This executive summary

---

## Script Updates

The `analyze-translations.cjs` script has been updated to:
- Load `common.json` for both EN and AR
- Recursively load all files in `/public/locales/{lang}/calc/**/*.json`
- Track which file each translation key comes from
- Merge all keys before checking
- Report detailed coverage statistics
- Generate comprehensive reports

### New Features
- Shows which translation file contains each key
- Reports total keys loaded (30,414 per language)
- Provides detailed missing key lists for each calculator
- Generates both console output and text file report
- Sorts calculators by most missing translations

---

## Next Steps

1. Review the detailed report: `translation-coverage-report.txt`
2. Identify the root cause of the translation key format mismatch
3. Create a plan to add missing translations systematically
4. Update component files to use correct translation key format
5. Re-run the analysis after fixes to verify improvements
