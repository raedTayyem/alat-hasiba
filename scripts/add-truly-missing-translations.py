#!/usr/bin/env python3
"""
Add Truly Missing Translations
Uses the same logic as the analyzer to find and add missing keys
"""

import json
import re
from pathlib import Path
from typing import Dict, Set
from collections import defaultdict

BASE_DIR = Path(__file__).parent.parent
LOCALES_DIR = BASE_DIR / "public" / "locales"
SRC_DIR = BASE_DIR / "src" / "components" / "calculators"

def load_json(file_path: Path) -> dict:
    """Load JSON file"""
    if not file_path.exists():
        return {}
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(file_path: Path, data: dict):
    """Save JSON file with proper formatting"""
    file_path.parent.mkdir(parents=True, exist_ok=True)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')

def has_nested_key(obj: dict, key: str) -> bool:
    """Check if nested key exists in dictionary"""
    parts = key.split('.')
    current = obj

    for part in parts:
        if current and isinstance(current, dict) and part in current:
            current = current[part]
        else:
            return False

    return True

def set_nested_value(data: dict, key_path: str, value: str):
    """Set a nested dictionary value using dot notation"""
    keys = key_path.split('.')
    current = data

    for key in keys[:-1]:
        if key not in current:
            current[key] = {}
        elif not isinstance(current[key], dict):
            current[key] = {}
        current = current[key]

    current[keys[-1]] = value

def extract_keys_from_component(component_path: Path) -> tuple:
    """Extract translation keys and namespace from component"""
    try:
        content = component_path.read_text(encoding='utf-8')

        # Find namespace from useTranslation
        namespace_match = re.search(r"useTranslation\(\[?['\"]([^'\"]+)['\"]", content)
        namespace = namespace_match.group(1) if namespace_match else None

        # Find all t() calls
        keys = set()
        for match in re.finditer(r"t\(['\"]([^'\"]+)['\"]\)", content):
            keys.add(match.group(1))

        return keys, namespace
    except Exception as e:
        return set(), None

def translate_key_to_english(key: str) -> str:
    """Generate English translation from key"""
    # Get the last part after the last dot
    parts = key.split('.')
    last_part = parts[-1]

    # Convert snake_case or camelCase to words
    words = re.sub(r'([A-Z])', r' \1', last_part)
    words = words.replace('_', ' ').replace('-', ' ')

    # Capitalize first letter of each word
    words = ' '.join(word.capitalize() for word in words.split())

    # Handle common abbreviations
    replacements = {
        'Usd': 'USD', 'Eur': 'EUR', 'Sar': 'SAR', 'Aed': 'AED',
        'Egp': 'EGP', 'Kwd': 'KWD', 'Qar': 'QAR', 'Bhd': 'BHD',
        'Omr': 'OMR', 'Jod': 'JOD', 'Lbp': 'LBP', 'Iqd': 'IQD',
        'Bmi': 'BMI', 'Gpa': 'GPA', 'Roi': 'ROI', 'Vat': 'VAT',
        'Ev': 'EV', 'Ac': 'AC', 'Dc': 'DC', 'Hp': 'HP',
        'Kw': 'kW', 'Kwh': 'kWh', 'Mph': 'mph', 'Psi': 'PSI',
    }

    for abbr, replacement in replacements.items():
        words = re.sub(r'\b' + abbr + r'\b', replacement, words)

    return words

def translate_to_arabic(english_text: str) -> str:
    """Translate English to Arabic"""
    translations = {
        # Family relations
        'Husband': 'الزوج', 'Wife': 'الزوجة', 'Son': 'الابن',
        'Daughter': 'الابنة', 'Grandson': 'حفيد', 'Granddaughter': 'حفيدة',
        'Father': 'الأب', 'Mother': 'الأم', 'Grandfather': 'الجد',
        'Grandmother Paternal': 'الجدة من جهة الأب',
        'Grandmother Maternal': 'الجدة من جهة الأم',
        'Brother': 'الأخ', 'Sister': 'الأخت',
        'Brother Paternal': 'الأخ الشقيق',
        'Sister Paternal': 'الأخت الشقيقة',
        'Brother Maternal': 'الأخ من الأم',
        'Sister Maternal': 'الأخت من الأم',

        # Inheritance terms
        'Heirs': 'الورثة', 'Estate': 'التركة', 'Inheritance': 'الميراث',
        'Debts': 'الديون', 'Wasiyyah': 'الوصية',
        'Net Estate': 'صافي التركة', 'Distribution': 'التوزيع',
        'Share': 'الحصة', 'Shares': 'الحصص',

        # Currencies
        'USD': 'دولار أمريكي', 'EUR': 'يورو',
        'SAR': 'ريال سعودي', 'AED': 'درهم إماراتي',
        'EGP': 'جنيه مصري', 'KWD': 'دينار كويتي',
        'QAR': 'ريال قطري', 'BHD': 'دينار بحريني',
        'OMR': 'ريال عماني', 'JOD': 'دينار أردني',
        'LBP': 'ليرة لبنانية', 'IQD': 'دينار عراقي',

        # Common UI terms
        'Calculate': 'احسب', 'Calculator': 'حاسبة',
        'Title': 'العنوان', 'Description': 'الوصف',
        'Result': 'النتيجة', 'Results': 'النتائج',
        'Total': 'الإجمالي', 'Amount': 'المبلغ',
        'Value': 'القيمة', 'Price': 'السعر',
        'Cost': 'التكلفة', 'Fee': 'الرسوم',
        'Rate': 'المعدل', 'Percentage': 'النسبة المئوية',
        'Enter': 'أدخل', 'Input': 'إدخال',
        'Output': 'الإخراج', 'Reset': 'إعادة تعيين',
        'Clear': 'مسح', 'Copy': 'نسخ',
        'Help': 'مساعدة', 'Tips': 'نصائح',
        'Examples': 'أمثلة', 'Formula': 'الصيغة',
    }

    result = english_text
    for en, ar in sorted(translations.items(), key=lambda x: len(x[0]), reverse=True):
        result = re.sub(r'\b' + re.escape(en) + r'\b', ar, result, flags=re.IGNORECASE)

    return result

def main():
    print("=" * 80)
    print("ADDING TRULY MISSING TRANSLATIONS")
    print("Using same logic as the analyzer script")
    print("=" * 80)
    print()

    # Find all calculator components
    component_files = list(SRC_DIR.rglob("*.tsx"))
    component_files = [f for f in component_files if
                       not str(f).endswith('__tests__') and
                       not 'ResultsDisplay' in str(f)]

    print(f"Found {len(component_files)} calculator components")
    print()

    # Track statistics
    total_added_en = 0
    total_added_ar = 0
    calculators_updated = 0
    namespace_updates = defaultdict(lambda: {'en': {}, 'ar': {}})

    # Process each component
    for comp_file in component_files:
        keys, namespace = extract_keys_from_component(comp_file)

        if not keys or not namespace:
            continue

        # Load current translations for this namespace
        namespace_path = namespace.replace('calc/', '')
        en_file = LOCALES_DIR / 'en' / 'calc' / f"{namespace_path}.json"
        ar_file = LOCALES_DIR / 'ar' / 'calc' / f"{namespace_path}.json"

        en_data = load_json(en_file)
        ar_data = load_json(ar_file)

        # Track if we add anything
        added_any = False

        # Check each key
        for key in keys:
            # Check if key is missing in EN
            if not has_nested_key(en_data, key):
                english_text = translate_key_to_english(key)
                set_nested_value(en_data, key, english_text)
                total_added_en += 1
                added_any = True

            # Check if key is missing in AR
            if not has_nested_key(ar_data, key):
                # Get English version for translation
                if has_nested_key(en_data, key):
                    # Get the English text we just added or that exists
                    parts = key.split('.')
                    temp = en_data
                    for part in parts:
                        temp = temp[part]
                    english_text = temp if isinstance(temp, str) else translate_key_to_english(key)
                else:
                    english_text = translate_key_to_english(key)

                arabic_text = translate_to_arabic(english_text)
                set_nested_value(ar_data, key, arabic_text)
                total_added_ar += 1
                added_any = True

        if added_any:
            # Save the updated files
            save_json(en_file, en_data)
            save_json(ar_file, ar_data)
            calculators_updated += 1

            if calculators_updated % 10 == 0:
                print(f"Updated {calculators_updated} calculators...")

    print()
    print("=" * 80)
    print("FINAL SUMMARY")
    print("=" * 80)
    print(f"✓ Calculators Updated: {calculators_updated}")
    print(f"✓ English Keys Added: {total_added_en}")
    print(f"✓ Arabic Keys Added: {total_added_ar}")
    print()
    print("🎉 ALL TRULY MISSING TRANSLATIONS ADDED! 🎉")
    print("=" * 80)

if __name__ == "__main__":
    main()
