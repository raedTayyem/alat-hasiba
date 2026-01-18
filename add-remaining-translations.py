#!/usr/bin/env python3
"""
Add remaining missing translations for calculators 61-120
"""

import json
import os
from pathlib import Path
from collections import defaultdict

# Additional translations needed
additional_translations = {
    # General calculators placeholders
    'calculators.enter_value_4': {
        'en': 'Enter value',
        'ar': 'أدخل القيمة',
        'namespace': 'calculators'
    },

    # Minecraft calculator
    'minecraft_calculator.error_calculation': {
        'en': 'Error in calculation',
        'ar': 'خطأ في الحساب',
        'namespace': 'calc/gaming'
    },
    'minecraft_calculator.info_title': {
        'en': 'Minecraft Resources',
        'ar': 'موارد ماين كرافت',
        'namespace': 'calc/gaming'
    },
    'minecraft_calculator.info_description': {
        'en': 'Calculate materials and resources needed for Minecraft building projects',
        'ar': 'احسب المواد والموارد اللازمة لمشاريع البناء في ماين كرافت',
        'namespace': 'calc/gaming'
    },

    # Win rate calculator
    'win_rate.info_title': {
        'en': 'Win Rate Statistics',
        'ar': 'إحصائيات معدل الفوز',
        'namespace': 'calc/gaming'
    },
    'win_rate.info_description': {
        'en': 'Track your gaming performance with win rate calculations',
        'ar': 'تتبع أدائك في الألعاب من خلال حسابات معدل الفوز',
        'namespace': 'calc/gaming'
    },

    # XP calculator
    'xp.info_title': {
        'en': 'Experience Points',
        'ar': 'نقاط الخبرة',
        'namespace': 'calc/gaming'
    },
    'xp.info_description': {
        'en': 'Calculate XP needed for leveling up in games',
        'ar': 'احسب نقاط الخبرة اللازمة للترقي في الألعاب',
        'namespace': 'calc/gaming'
    },

    # Half life calculator
    'half_life.results.remaining': {
        'en': 'Remaining Amount',
        'ar': 'الكمية المتبقية',
        'namespace': 'calc/science'
    },
}

def set_nested_value(obj, key_path, value):
    """Set a value in a nested dictionary using dot notation"""
    parts = key_path.split('.')
    current = obj

    for part in parts[:-1]:
        if part not in current:
            current[part] = {}
        current = current[part]

    current[parts[-1]] = value

def deep_merge(target, source):
    """Deep merge two dictionaries"""
    for key, value in source.items():
        if key in target and isinstance(target[key], dict) and isinstance(value, dict):
            deep_merge(target[key], value)
        else:
            target[key] = value
    return target

# Process translations
translations_by_file = defaultdict(lambda: {'en': {}, 'ar': {}})

print("Adding remaining translations...")
print("=" * 80)

for key, data in additional_translations.items():
    namespace = data['namespace']
    en_value = data['en']
    ar_value = data['ar']

    # Set nested values
    set_nested_value(translations_by_file[namespace]['en'], key, en_value)
    set_nested_value(translations_by_file[namespace]['ar'], key, ar_value)

    print(f"✓ {key} -> {namespace}")

# Write translations to files
print("\n" + "=" * 80)
print("Writing translation files...")
print("=" * 80 + "\n")

base_path = Path('public/locales')
updated_files = []

for namespace, data in translations_by_file.items():
    en_path = base_path / 'en' / f'{namespace}.json'
    ar_path = base_path / 'ar' / f'{namespace}.json'

    # Create directories if needed
    en_path.parent.mkdir(parents=True, exist_ok=True)
    ar_path.parent.mkdir(parents=True, exist_ok=True)

    # Load existing data
    en_data = {}
    ar_data = {}

    if en_path.exists():
        with open(en_path, 'r', encoding='utf-8') as f:
            en_data = json.load(f)

    if ar_path.exists():
        with open(ar_path, 'r', encoding='utf-8') as f:
            ar_data = json.load(f)

    # Merge new translations
    en_data = deep_merge(en_data, data['en'])
    ar_data = deep_merge(ar_data, data['ar'])

    # Write files
    with open(en_path, 'w', encoding='utf-8') as f:
        json.dump(en_data, f, ensure_ascii=False, indent=2)
        f.write('\n')

    with open(ar_path, 'w', encoding='utf-8') as f:
        json.dump(ar_data, f, ensure_ascii=False, indent=2)
        f.write('\n')

    updated_files.append(namespace)
    print(f"✓ {namespace}")

# Summary
print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)
print(f"Additional translations added: {len(additional_translations)}")
print(f"Translation files updated: {len(updated_files)}")
print("\nUpdated namespaces:")
for ns in sorted(updated_files):
    print(f"  - {ns}")
