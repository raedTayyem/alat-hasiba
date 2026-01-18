#!/usr/bin/env python3
"""
Complete translations for calculators 61-120 from partial-translations-61-120.json
"""

import json
import os
import re
from pathlib import Path
from collections import defaultdict

# Load the batch data
with open('partial-translations-61-120.json', 'r') as f:
    batch_data = json.load(f)

# Comprehensive translation mapping
translations = {
    # Common errors
    'common:common.errors.calculationError': {
        'en': 'An error occurred during calculation',
        'ar': 'حدث خطأ أثناء الحساب'
    },
    'common.errors.calculationError': {
        'en': 'An error occurred during calculation',
        'ar': 'حدث خطأ أثناء الحساب'
    },
    'common.error.invalid_input': {
        'en': 'Invalid input',
        'ar': 'مدخلات غير صالحة'
    },
    'common.formula': {
        'en': 'Formula',
        'ar': 'المعادلة'
    },
    'common.currencySymbol': {
        'en': '$',
        'ar': '$'
    },

    # Common units
    'common:common.units.m3': {
        'en': 'm³',
        'ar': 'م³'
    },
    'common:common.units.m2': {
        'en': 'm²',
        'ar': 'م²'
    },
    'common:common.units.s': {
        'en': 's',
        'ar': 'ث'
    },
    'common:common.units.h': {
        'en': 'h',
        'ar': 'س'
    },
    'common:common.units.min': {
        'en': 'min',
        'ar': 'د'
    },

    # Water footprint
    'sustainable_lifestyle.options.meat_heavy': {
        'en': 'Meat Heavy',
        'ar': 'كثير اللحوم'
    },

    # Investment
    'investment.options.': {
        'en': '',
        'ar': ''
    },

    # Pregnancy
    'pregnancy_calculator.error_calculation': {
        'en': 'Error in calculation',
        'ar': 'خطأ في الحساب'
    },

    # Hebrew calendar
    'hebrew-to-gregorian.result_note': {
        'en': 'Note: Hebrew calendar conversions may vary slightly depending on the calculation method',
        'ar': 'ملاحظة: قد تختلف تحويلات التقويم العبري قليلاً حسب طريقة الحساب'
    },

    # Sequences
    'sequences_calculator.formula_': {
        'en': '',
        'ar': ''
    },

    # Cat age
    'cat_age_calculator.error_calculation': {
        'en': 'Error in age calculation',
        'ar': 'خطأ في حساب العمر'
    },

    # Cat calorie
    'cat_food_calculator.unit_calories': {
        'en': 'kcal/day',
        'ar': 'سعرة/يوم'
    },

    # Dog calorie
    'dog-calorie-calculator.error_invalid_weight': {
        'en': 'Please enter a valid weight',
        'ar': 'الرجاء إدخال وزن صحيح'
    },

    # Pet insurance
    'pet-insurance-calculator.error_invalid_age': {
        'en': 'Please enter a valid age',
        'ar': 'الرجاء إدخال عمر صحيح'
    },

    # Rental yield
    'rental_yield_calculator.details': {
        'en': 'Details',
        'ar': 'التفاصيل'
    },

    # Yazidi calendar
    'yazidi-calendar.months.': {
        'en': '',
        'ar': ''
    },

    # Fuel economy
    'fuel_economy.use_case_3': {
        'en': 'Plan fuel budgets for trips',
        'ar': 'خطط ميزانيات الوقود للرحلات'
    },

    # Commission
    'commission.results.breakdown': {
        'en': 'Breakdown',
        'ar': 'التفصيل'
    },

    # Inventory turnover
    'inventory_turnover.results.rating_': {
        'en': '',
        'ar': ''
    },

    # Shingle
    'shingle.rolls': {
        'en': 'Rolls',
        'ar': 'لفات'
    },

    # Rep range
    'rep_range_calculator.footer_note': {
        'en': 'Note: These recommendations are general guidelines. Adjust based on your fitness level and goals.',
        'ar': 'ملاحظة: هذه التوصيات إرشادات عامة. عدّل بناءً على مستوى لياقتك وأهدافك.'
    },

    # Protein
    'protein.inputs.weight': {
        'en': 'Weight',
        'ar': 'الوزن'
    },

    # Calculus
    'calculators.calc_494': {
        'en': 'Calculus Calculator',
        'ar': 'حاسبة التفاضل والتكامل'
    },
    'calculus.description': {
        'en': 'Calculate derivatives, integrals, limits and series',
        'ar': 'احسب المشتقات والتكاملات والنهايات والمتسلسلات'
    },

    # Bird cage
    'bird_cage_calculator.error_invalid_birds': {
        'en': 'Please enter a valid number of birds',
        'ar': 'الرجاء إدخال عدد صحيح من الطيور'
    },

    # Hamster lifespan
    'hamster_lifespan_calculator.error_invalid_age': {
        'en': 'Please enter a valid age',
        'ar': 'الرجاء إدخال عمر صحيح'
    },

    # Rabbit care
    'rabbit-care-calculator.error_invalid_weight': {
        'en': 'Please enter a valid weight',
        'ar': 'الرجاء إدخال وزن صحيح'
    },

    # Property tax
    'property_tax_calculator.details': {
        'en': 'Tax Calculation Details',
        'ar': 'تفاصيل حساب الضريبة'
    },

    # pH calculator
    'ph_calculator.results.': {
        'en': '',
        'ar': ''
    },

    # Age on planets
    'age-on-planets.planets.': {
        'en': '',
        'ar': ''
    },

    # LTV
    'ltv.results.risk_levels.': {
        'en': '',
        'ar': ''
    },
    'ltv.results.risk_explanations.': {
        'en': '',
        'ar': ''
    },

    # Brick
    'brick.formula_title': {
        'en': 'Calculation Formula',
        'ar': 'معادلة الحساب'
    },

    # Roof pitch
    'roofPitch.': {
        'en': '',
        'ar': ''
    },

    # Weight loss time
    'weight-loss-time-calculator.enter_weight': {
        'en': 'Enter weight',
        'ar': 'أدخل الوزن'
    },

    # DPS
    'dps.info_title': {
        'en': 'About DPS',
        'ar': 'حول الضرر في الثانية'
    },
    'dps.info_description': {
        'en': 'DPS (Damage Per Second) is a measure of damage dealt over time in video games',
        'ar': 'الضرر في الثانية هو مقياس للضرر الذي يتم إلحاقه مع مرور الوقت في ألعاب الفيديو'
    },

    # FPS
    'fps.additional_info_title': {
        'en': 'Additional Information',
        'ar': 'معلومات إضافية'
    },

    # Dog food
    'dog_food_calculator.error_invalid_weight': {
        'en': 'Please enter a valid weight',
        'ar': 'الرجاء إدخال وزن صحيح'
    },
    'dog_food_calculator.results_title': {
        'en': 'Feeding Recommendations',
        'ar': 'توصيات التغذية'
    },

    # Debt to income
    'debt_to_income_ratio.interpretation.': {
        'en': '',
        'ar': ''
    },

    # Loan to value
    'loan_to_value.risk_level': {
        'en': 'Risk Level',
        'ar': 'مستوى المخاطر'
    },

    # Yazidi new year
    'yazidi_new_year.about_title': {
        'en': 'About Yazidi New Year',
        'ar': 'حول رأس السنة اليزيدية'
    },

    # Weight on planets
    'weight_on_planets.results.': {
        'en': '',
        'ar': ''
    },

    # Sand
    'sand.formula_section_title': {
        'en': 'Calculation Formula',
        'ar': 'معادلة الحساب'
    },
    'sand.formula': {
        'en': 'Volume = Length × Width × Depth',
        'ar': 'الحجم = الطول × العرض × العمق'
    },
    'sand.bags_formula': {
        'en': 'Bags needed = Total volume ÷ Bag volume',
        'ar': 'عدد الأكياس = الحجم الكلي ÷ حجم الكيس'
    },

    # Turkey cooking
    'turkey_cooking.title': {
        'en': 'Turkey Cooking Time Calculator',
        'ar': 'حاسبة وقت طهي الديك الرومي'
    },
    'turkey_cooking.description': {
        'en': 'Calculate optimal turkey cooking time based on weight',
        'ar': 'احسب وقت طهي الديك الرومي الأمثل بناءً على الوزن'
    },

    # Impedance
    'impedance.title': {
        'en': 'Impedance Calculator',
        'ar': 'حاسبة الممانعة'
    },
    'impedance.description': {
        'en': 'Calculate electrical impedance in AC circuits',
        'ar': 'احسب الممانعة الكهربائية في دوائر التيار المتردد'
    },

    # Material conversion
    'material-conversion-calculator.error_invalid_density': {
        'en': 'Please enter a valid density',
        'ar': 'الرجاء إدخال كثافة صحيحة'
    },
    'material-conversion-calculator.density': {
        'en': 'Density',
        'ar': 'الكثافة'
    },

    # Minecraft
    'minecraft.info_title': {
        'en': 'About Minecraft Resources',
        'ar': 'حول موارد ماين كرافت'
    },
    'minecraft.info_description': {
        'en': 'Calculate resources needed for Minecraft building projects',
        'ar': 'احسب الموارد اللازمة لمشاريع البناء في ماين كرافت'
    },
    'minecraft.formulas_title': {
        'en': 'Formulas',
        'ar': 'المعادلات'
    },

    # Win rate
    'win_rate.win_percentage': {
        'en': 'Win Percentage',
        'ar': 'نسبة الفوز'
    },
    'win_rate.loss_percentage': {
        'en': 'Loss Percentage',
        'ar': 'نسبة الخسارة'
    },

    # XP calculator
    'xp_calculator.target_level': {
        'en': 'Target Level',
        'ar': 'المستوى المستهدف'
    },
    'xp_calculator.current_xp': {
        'en': 'Current XP',
        'ar': 'النقاط الحالية'
    },

    # Half life
    'half_life.initial_amount': {
        'en': 'Initial Amount',
        'ar': 'الكمية الأولية'
    },
    'half_life.time_elapsed': {
        'en': 'Time Elapsed',
        'ar': 'الوقت المنقضي'
    }
}

def get_namespace_from_key(key):
    """Determine the namespace file from the translation key"""

    # Remove the namespace prefix if present
    if ':' in key:
        namespace_part, key_part = key.split(':', 1)
        if namespace_part == 'common':
            return 'common'
        return namespace_part.replace(':', '/')

    # Map key prefixes to namespace files
    key_lower = key.lower()

    namespace_map = {
        'co2_emissions': 'calc/environmental/emissions',
        'energy_saving': 'calc/environmental/energy',
        'flight_emissions': 'calc/environmental/emissions',
        'water_footprint': 'calc/environmental/water-footprint',
        'sustainable_lifestyle': 'calc/environmental/carbon-footprint',
        'electrical-resistance': 'calc/engineering',
        'investment': 'calc/finance',
        'pregnancy': 'calc/health',
        'waist_hip': 'calc/health',
        'cat_age': 'calc/pet/age',
        'cat_food': 'calc/pet/nutrition',
        'cat_calorie': 'calc/pet/nutrition',
        'dog_calorie': 'calc/pet/nutrition',
        'dog-calorie': 'calc/pet/nutrition',
        'pet-insurance': 'calc/pet/costs',
        'pet_insurance': 'calc/pet/costs',
        'bird_cage': 'calc/pet/general',
        'hamster': 'calc/pet/general',
        'rabbit': 'calc/pet/general',
        'dog_food': 'calc/pet/nutrition',
        'rental_yield': 'calc/real-estate/rental',
        'property_tax': 'calc/real-estate/property-tax',
        'debt_to_income': 'calc/real-estate/general',
        'loan_to_value': 'calc/real-estate/general',
        'fuel_economy': 'calc/automotive/performance',
        'commission': 'calc/business/general',
        'inventory_turnover': 'calc/business/inventory',
        'ltv': 'calc/business/general',
        'concrete': 'calc/construction/concrete',
        'door': 'calc/construction/general',
        'shingle': 'calc/construction/roofing',
        'window': 'calc/construction/general',
        'brick': 'calc/construction/general',
        'roof': 'calc/construction/roofing',
        'sand': 'calc/construction/general',
        'number_system': 'calc/converters',
        'electrical_load': 'calc/electrical/power',
        'electricity_bill': 'calc/electrical/power',
        'inductor': 'calc/electrical/circuits',
        'impedance': 'calc/electrical/circuits',
        'rep_range': 'calc/fitness/strength',
        'swimming_pace': 'calc/fitness/cardio',
        'weight_loss': 'calc/fitness/general',
        'weight-loss': 'calc/fitness/general',
        'dps': 'calc/gaming',
        'fov': 'calc/gaming',
        'fps': 'calc/gaming',
        'minecraft': 'calc/gaming',
        'win_rate': 'calc/gaming',
        'xp': 'calc/gaming',
        'ideal_weight': 'calc/health',
        'protein': 'calc/health',
        'lean_body': 'calc/fitness/body-composition',
        'sequences': 'calc/math',
        'calculus': 'calc/math',
        'hebrew': 'calc/date-time/calendar',
        'yazidi': 'calc/date-time/calendar',
        'age-on-planets': 'calc/astronomy',
        'age_on_planets': 'calc/astronomy',
        'weight_on_planets': 'calc/astronomy',
        'cooking_time': 'calc/cooking',
        'turkey_cooking': 'calc/cooking',
        'material-conversion': 'calc/engineering',
        'material_conversion': 'calc/engineering',
        'ph_calculator': 'calc/science',
        'half_life': 'calc/science',
    }

    # Find matching namespace
    for prefix, namespace in namespace_map.items():
        if key_lower.startswith(prefix):
            return namespace

    return 'common'

def deep_merge(target, source):
    """Deep merge two dictionaries"""
    for key, value in source.items():
        if key in target and isinstance(target[key], dict) and isinstance(value, dict):
            deep_merge(target[key], value)
        else:
            target[key] = value
    return target

def set_nested_value(obj, key_path, value):
    """Set a value in a nested dictionary using dot notation"""
    parts = key_path.split('.')
    current = obj

    for part in parts[:-1]:
        if part not in current:
            current[part] = {}
        current = current[part]

    current[parts[-1]] = value

# Process translations
translations_by_file = defaultdict(lambda: {'en': {}, 'ar': {}})
processed_count = 0
skipped_count = 0

print("Processing translations for calculators 61-120...")
print("=" * 80)

for calc in batch_data['batch']:
    calc_name = calc['name']
    missing_keys = calc['missingENKeys']

    if not missing_keys:
        continue

    print(f"\n{calc_name}: {len(missing_keys)} keys")

    for key in missing_keys:
        # Skip empty or partial keys
        if not key or key.endswith('.') or key.endswith('_'):
            print(f"  ⚠ Skipping incomplete key: {key}")
            skipped_count += 1
            continue

        if key in translations:
            trans = translations[key]
            namespace = get_namespace_from_key(key)

            # Clean the key
            clean_key = key.split(':', 1)[-1] if ':' in key else key

            # Set the nested value
            set_nested_value(translations_by_file[namespace]['en'], clean_key, trans['en'])
            set_nested_value(translations_by_file[namespace]['ar'], clean_key, trans['ar'])

            processed_count += 1
            print(f"  ✓ {key} -> {namespace}")
        else:
            print(f"  ⚠ No translation for: {key}")
            skipped_count += 1

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
print(f"Total calculators in batch: {len(batch_data['batch'])}")
print(f"Translation keys processed: {processed_count}")
print(f"Keys skipped (incomplete/not found): {skipped_count}")
print(f"Translation files updated: {len(updated_files)}")
print("\nUpdated namespaces:")
for ns in sorted(updated_files):
    print(f"  - {ns}")
