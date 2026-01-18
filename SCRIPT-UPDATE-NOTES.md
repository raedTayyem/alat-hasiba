# Translation Analysis Script Update Notes

## What Was Changed

### File: `analyze-translations.cjs`

The script was updated to check **ALL translation files**, not just `common.json`.

---

## Key Updates

### 1. New `loadAllTranslations()` Function
**Before:** Only loaded `/public/locales/en/common.json` and `/public/locales/ar/common.json`

**After:** Now loads:
- `common.json` for both languages
- All files in `/public/locales/{lang}/calc/**/*.json` (72 files per language)
- Total: 30,414 keys per language

```javascript
function loadAllTranslations(lang) {
  const translations = {};
  const keyToFile = {}; // Track which file each key comes from

  // Load common.json
  // Load all calc/**/*.json files recursively

  return { translations, keyToFile };
}
```

### 2. Enhanced `checkKey()` Function
**Before:** Simple dot-notation lookup

**After:** Handles multiple i18next namespace formats:
- `calc/misc:abjad.standard_title` (namespace with colon)
- `translation:common.error` (translation namespace)
- `calc.misc.abjad.title` (dot notation)
- `common.error.invalid_input` (common namespace)

```javascript
function checkKey(key, translations) {
  // Parse namespace format (namespace:key.path)
  // Check common namespace
  // Check calc namespace with format conversion
  // Fallback to simple path
}
```

### 3. New `getKeyFile()` Function
Tracks which translation file contains each key for debugging purposes.

### 4. Enhanced Reporting
**New console output includes:**
- Total keys loaded per language
- Percentage coverage for each calculator
- Top 20 calculators with most missing translations
- List of fully translated calculators
- Detailed missing key breakdown (showing first 5 + count)

**New file output:**
- `translation-coverage-report.txt` (26,248 lines)
- Complete breakdown of every calculator
- All missing keys listed individually
- Timestamp and summary statistics

---

## Results Comparison

### Before Update (Incorrect)
- Average Coverage: 2%
- Partially Translated: 61 calculators
- Missing All: 306 calculators

### After Update (Correct)
- Average Coverage: 5%
- Partially Translated: 159 calculators
- Missing All: 208 calculators

The improvement shows the script is now correctly detecting translations in the calc/**/*.json files.

---

## Technical Details

### Translation File Structure
```
/public/locales/
  en/
    common.json
    calc/
      finance.json
      education.json
      misc.json
      fitness/
        cardio.json
        nutrition.json
      construction/
        concrete.json
      ...72 files total
  ar/
    (same structure)
```

### How Keys Are Matched
1. Component uses: `t("calc/misc:abjad.standard_title")`
2. Script parses namespace: `calc/misc` and keyPath: `abjad.standard_title`
3. Converts to file path: `/public/locales/en/calc/misc.json`
4. Looks up: `misc.json > abjad > standard_title`

### Common Issues Detected
1. Many calculators reference keys that don't exist in translation files
2. Common pattern: missing `calculators.invalid_input` and `calculators.calculation_error`
3. Some calculators missing entire translation namespaces

---

## Files Generated

1. **`analyze-translations.cjs`** (Updated)
   - Main analysis script with all enhancements

2. **`translation-coverage-report.txt`** (26,248 lines)
   - Comprehensive report with every calculator
   - Lists all missing keys individually
   - Generated timestamp and statistics

3. **`TRANSLATION-SUMMARY.md`**
   - Executive summary for stakeholders
   - Key findings and recommendations
   - Top 20 most problematic calculators

4. **`SCRIPT-UPDATE-NOTES.md`** (This file)
   - Technical documentation of changes
   - Before/after comparison
   - Implementation details

---

## Usage

```bash
# Run the analysis
node analyze-translations.cjs

# Output files created:
# - Console output with summary
# - translation-coverage-report.txt (detailed)
```

---

## Performance

- Loads 30,414 keys × 2 languages = 60,828 total keys
- Analyzes 395 calculators
- Extracts ~12,390 translation key references from components
- Completes in ~5-10 seconds

---

## Future Enhancements

### Potential Improvements
1. Add JSON export option for CI/CD integration
2. Generate missing translation templates automatically
3. Add severity levels (error vs warning)
4. Track translation coverage over time (history)
5. Validate translation value quality (empty strings, placeholders)
6. Check for unused translations (keys in files but not in components)

### Suggested CI/CD Integration
```yaml
- name: Check Translation Coverage
  run: |
    node analyze-translations.cjs > coverage-report.txt
    # Fail if coverage drops below threshold
    # Fail if new calculators added without translations
```

---

## Notes

- The script now correctly handles the i18next namespace format
- Coverage improved from 2% to 5% after fixing the key detection
- Still 208 calculators with 0% coverage need translations
- 4 calculators are at 90%+ and could be completed quickly
