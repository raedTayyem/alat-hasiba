# Translation Files Structure

The translations for this project are organized into category-based files for easier management and maintenance.

## Directory Structure

```
public/locales/
├── ar/                          # Arabic translations
│   ├── translation.json         # Main file (auto-generated from categories)
│   ├── translation.backup.json  # Original backup
│   ├── common.json              # Common UI text, errors, placeholders
│   ├── navigation.json          # Navigation, hero, footer, SEO
│   ├── calculators.json         # Calculator-specific translations
│   ├── pages.json               # Static pages content
│   └── specialized.json         # Specialized calendar systems
└── en/                          # English translations
    ├── translation.json         # Main file (auto-generated from categories)
    ├── translation.backup.json  # Original backup
    ├── common.json              # Common UI text, errors, placeholders
    ├── navigation.json          # Navigation, hero, footer, SEO
    ├── calculators.json         # Calculator-specific translations
    ├── pages.json               # Static pages content
    └── specialized.json         # Specialized calendar systems
```

## File Descriptions

### common.json
Contains shared UI text used throughout the application:
- `common`: Buttons, labels, actions (calculate, reset, etc.)
- `placeholders`: Input field placeholders
- `search`: Search-related text
- `errors`: Error messages
- `language`: Language switcher text

### navigation.json
Contains navigation and marketing content:
- `navigation`: Header menu items
- `hero`: Homepage hero section
- `categories`: Category page content
- `benefits`: Feature benefits
- `support`: Support section
- `cta`: Call-to-action text
- `footer`: Footer content
- `seo`: SEO meta descriptions

### calculators.json
Contains calculator-specific translations:
- `calculators`: All calculator names, descriptions, inputs, results
- `calculator`: Generic calculator UI elements
- `categoryNames`: Calculator category names

### pages.json
Contains static page content:
- `pages`: About, Contact, Privacy Policy, Terms of Service

### specialized.json
Contains specialized calendar system translations:
- `specialized_calendar`: Special calendar systems (Coptic, Hebrew, etc.)

## How to Edit Translations

### Option 1: Edit Category Files (Recommended)
1. Find the appropriate category file (e.g., `common.json` for button text)
2. Edit the JSON file directly
3. Run `node split-translations.cjs` to merge changes back to `translation.json`

### Option 2: Edit Main File
1. Edit `translation.json` directly
2. Run `node split-translations.cjs` to split into category files

## Rebuilding Translations

After editing any translation files, run:

```bash
node split-translations.cjs
```

This will:
- ✅ Split `translation.json` into category files
- ✅ Merge category files back into `translation.json`
- ✅ Create backups of original files
- ✅ Update both English and Arabic versions

## Usage in Code

The translations work seamlessly with i18next namespaces:

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  // These all work automatically:
  return (
    <>
      <button>{t('common.calculate')}</button>
      <h1>{t('calculators.bmi_calculator')}</h1>
      <p>{t('navigation.hero.title')}</p>
    </>
  );
}
```

You can also explicitly specify namespaces:

```typescript
const { t } = useTranslation(['calculators', 'common']);
```

## Adding New Translations

1. Add your translation keys to the appropriate category file
2. Add the same keys to both `en/` and `ar/` versions
3. Run `node split-translations.cjs` to merge changes
4. Test in your application

## File Sizes

Before splitting:
- English: ~10,500 lines
- Arabic: ~10,800 lines

After splitting (per category):
- common.json: ~200-500 lines
- navigation.json: ~100-300 lines
- calculators.json: ~9,000 lines (largest)
- pages.json: ~500-1000 lines
- specialized.json: ~200-500 lines

## Benefits of This Structure

✅ **Easier to Navigate**: Find translations faster in smaller files
✅ **Better Git Diffs**: Changes are more focused and reviewable
✅ **Parallel Editing**: Multiple people can work on different categories
✅ **Lazy Loading**: Can load only needed translations (future optimization)
✅ **Maintainability**: Easier to keep translations organized
✅ **Backwards Compatible**: Old code still works with `translation` namespace

## Troubleshooting

### Translations not showing?
1. Check browser console for i18next errors
2. Verify the namespace is loaded in `src/i18n/config.ts`
3. Clear browser cache and localStorage
4. Rebuild with `node split-translations.cjs`

### Missing translations?
1. Check if key exists in the appropriate category file
2. Verify both English and Arabic versions have the key
3. Check for typos in translation keys
4. Use the backup files if needed: `translation.backup.json`

## Maintenance Scripts

### split-translations.cjs
Located in project root. Splits and merges translation files.

```bash
node split-translations.cjs
```

This is the master script that manages all translation files.
