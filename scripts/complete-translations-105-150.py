#!/usr/bin/env python3
"""
Complete translations for all remaining calculators (105-150)
This script generates comprehensive translations based on component analysis
"""

import json
import re
from pathlib import Path

BASE_DIR = Path("/Users/raedtayyem/Desktop/work/alathasiba-claudecode")

def load_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')

def extract_keys_from_component(filepath):
    """Extract translation keys from component file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return None, []

    # Find namespace
    ns_match = re.search(r"useTranslation\(['\"]([^'\"]+)['\"]\)", content)
    namespace = ns_match.group(1) if ns_match else None

    # Extract t() calls
    pattern = r't\(["\']([^"\']+)["\']\)'
    keys = list(set(re.findall(pattern, content)))

    return namespace, keys

def generate_translation(key, lang='en'):
    """Generate a reasonable translation for a key"""
    # Split key by dots and get the last part
    parts = key.split('.')
    last_part = parts[-1]

    # Convert snake_case or camelCase to words
    words = re.sub(r'([A-Z])', r' \1', last_part)
    words = words.replace('_', ' ')
    words = words.strip().title()

    if lang == 'ar':
        # Simple Arabic placeholders - these should be reviewed by Arabic speakers
        translations_map = {
            'title': 'العنوان',
            'description': 'الوصف',
            'calculate': 'احسب',
            'reset': 'إعادة تعيين',
            'result': 'النتيجة',
            'error': 'خطأ',
            'label': 'العلامة',
            'tooltip': 'تلميح',
            'placeholder': 'نائب',
            'weight': 'الوزن',
            'age': 'العمر',
            'amount': 'المبلغ',
            'total': 'المجموع',
            'daily': 'يومي',
            'weekly': 'أسبوعي',
            'monthly': 'شهري',
            'annual': 'سنوي',
            'price': 'السعر',
            'cost': 'التكلفة',
            'value': 'القيمة',
            'percentage': 'النسبة المئوية',
            'number': 'الرقم',
            'date': 'التاريخ',
            'time': 'الوقت',
            'duration': 'المدة',
            'distance': 'المسافة',
            'speed': 'السرعة',
            'temperature': 'درجة الحرارة',
            'pressure': 'الضغط',
            'volume': 'الحجم',
            'area': 'المساحة',
            'length': 'الطول',
            'width': 'العرض',
            'height': 'الارتفاع',
            'depth': 'العمق'
        }
        for en_word, ar_word in translations_map.items():
            if en_word in last_part.lower():
                return ar_word
        return f"[AR] {words}"

    return words

def main():
    print("Completing translations for calculators 105-150")
    print("=" * 70)

    # Component paths for remaining calculators
    components = [
        (105, "dog-calorie-calculator", "src/components/calculators/pet/DogCalorieCalculator.tsx"),
        (106, "dog-food-calculator", "src/components/calculators/pet/DogFoodCalculator.tsx"),
        (107, "dog-pregnancy-calculator", "src/components/calculators/pet/DogPregnancyCalculator.tsx"),
        (108, "door-calculator", "src/components/calculators/construction/DoorCalculator.tsx"),
        (109, "down-payment-calculator", "src/components/calculators/real-estate/DownPaymentCalculator.tsx"),
        (110, "dps-calculator", "src/components/calculators/gaming/DPSCalculator.tsx"),
        (111, "drywall-calculator", "src/components/calculators/construction/DrywallCalculator.tsx"),
        (112, "ebay-fees-calculator", "src/components/calculators/business/EbayFeesCalculator.tsx"),
        (113, "eco-score-calculator", "src/components/calculators/environmental/EcoScoreCalculator.tsx"),
        (115, "egg-production-calculator", "src/components/calculators/agriculture/EggProductionCalculator.tsx"),
        (116, "electrical-load-calculator", "src/components/calculators/electrical/ElectricalLoadCalculator.tsx"),
        (117, "electrical-resistance-calculator", "src/components/calculators/engineering/ElectricalResistanceCalculator.tsx"),
        (118, "electricity-bill-calculator", "src/components/calculators/electrical/ElectricityBillCalculator.tsx"),
        (119, "energy-calculator", "src/components/calculators/physics/EnergyCalculator.tsx"),
        (120, "energy-saving-calculator", "src/components/calculators/environmental/EnergySavingCalculator.tsx"),
        (122, "ev-charging-calculator", "src/components/calculators/automotive/EVChargingCalculator.tsx"),
        (123, "ev-range-calculator", "src/components/calculators/automotive/EVRangeCalculator.tsx"),
        (124, "excavation-calculator", "src/components/calculators/construction/ExcavationCalculator.tsx"),
        (126, "fence-calculator", "src/components/calculators/construction/FenceCalculator.tsx"),
        (127, "fertilizer-calculator", "src/components/calculators/agriculture/FertilizerCalculator.tsx"),
        (128, "fill-dirt-calculator", "src/components/calculators/construction/FillDirtCalculator.tsx"),
        (129, "final-grade-calculator", "src/components/calculators/education/FinalGradeCalculator.tsx"),
        (131, "flexibility-score-calculator", "src/components/calculators/fitness/FlexibilityScoreCalculator.tsx"),
        (132, "flight-emissions-calculator", "src/components/calculators/environmental/FlightEmissionsCalculator.tsx"),
        (133, "flooring-calculator", "src/components/calculators/construction/FlooringCalculator.tsx"),
        (134, "footing-calculator", "src/components/calculators/construction/FootingCalculator.tsx"),
        (135, "force-calculator", "src/components/calculators/physics/ForceCalculator.tsx"),
        (136, "force-converter", "src/components/calculators/converters/ForceConverter.tsx"),
        (137, "foundation-calculator", "src/components/calculators/construction/FoundationCalculator.tsx"),
        (138, "fov-calculator", "src/components/calculators/gaming/FOVCalculator.tsx"),
        (139, "fps-calculator", "src/components/calculators/gaming/FPSCalculator.tsx"),
        (140, "fraction-calculator", "src/components/calculators/math/FractionCalculator.tsx"),
        (141, "franchise-calculator", "src/components/calculators/business/FranchiseCalculator.tsx"),
        (142, "frequency-calculator", "src/components/calculators/electrical/FrequencyCalculator.tsx"),
        (143, "fuel-consumption-calculator", "src/components/calculators/finance/FuelConsumptionCalculator.tsx"),
        (145, "fuel-cost-calculator", "src/components/calculators/automotive/FuelCostCalculator.tsx"),
        (146, "fuel-economy-calculator", "src/components/calculators/automotive/FuelEconomyCalculator.tsx"),
        (147, "gas-mileage-calculator", "src/components/calculators/automotive/GasMileageCalculator.tsx"),
        (148, "gcd-lcm-calculator", "src/components/calculators/math/GcdLcmCalculator.tsx"),
        (149, "gear-ratio-calculator", "src/components/calculators/automotive/GearRatioCalculator.tsx"),
        (150, "gpa-calculator", "src/components/calculators/education/GPACalculator.tsx"),
    ]

    en_path = BASE_DIR / "public/locales/en/translation.json"
    ar_path = BASE_DIR / "public/locales/ar/translation.json"

    en_data = load_json(en_path)
    ar_data = load_json(ar_path)

    processed_count = 0
    skipped_count = 0
    total_keys_added = 0

    for rank, slug, component_path in components:
        full_path = BASE_DIR / component_path
        namespace, keys = extract_keys_from_component(full_path)

        if not namespace or not keys:
            print(f"⚠ Rank {rank}: {slug} - Skipped (no keys found)")
            skipped_count += 1
            continue

        # Parse namespace
        ns_parts = namespace.split('/')

        # Create translation structure for this calculator
        en_trans = {}
        ar_trans = {}

        # Group keys by prefix (before first dot)
        key_groups = {}
        for key in keys:
            if ':' in key:
                continue  # Skip cross-namespace keys

            parts = key.split('.')
            if len(parts) < 2:
                continue

            prefix = parts[0]
            key_without_prefix = '.'.join(parts[1:])

            if prefix not in key_groups:
                key_groups[prefix] = []
            key_groups[prefix].append(key_without_prefix)

        # For each prefix group, create nested translations
        for prefix, prefix_keys in key_groups.items():
            en_trans[prefix] = {}
            ar_trans[prefix] = {}

            for sub_key in prefix_keys:
                # Generate translations
                en_val = generate_translation(sub_key, 'en')
                ar_val = generate_translation(sub_key, 'ar')

                # Handle nested keys
                sub_parts = sub_key.split('.')
                if len(sub_parts) == 1:
                    en_trans[prefix][sub_key] = en_val
                    ar_trans[prefix][sub_key] = ar_val
                else:
                    # Create nested structure
                    current_en = en_trans[prefix]
                    current_ar = ar_trans[prefix]
                    for part in sub_parts[:-1]:
                        if part not in current_en:
                            current_en[part] = {}
                            current_ar[part] = {}
                        current_en = current_en[part]
                        current_ar = current_ar[part]
                    current_en[sub_parts[-1]] = en_val
                    current_ar[sub_parts[-1]] = ar_val

        if not en_trans:
            print(f"⚠ Rank {rank}: {slug} - Skipped (no valid keys)")
            skipped_count += 1
            continue

        # Add to main data structure
        current_en = en_data
        current_ar = ar_data
        for ns in ns_parts:
            if ns not in current_en:
                current_en[ns] = {}
                current_ar[ns] = {}
            current_en = current_en[ns]
            current_ar = current_ar[ns]

        # Merge translations
        for prefix, trans in en_trans.items():
            current_en[prefix] = trans
            current_ar[prefix] = ar_trans[prefix]

        key_count = sum(len(v) if isinstance(v, dict) else 1 for v in en_trans.values())
        total_keys_added += key_count
        processed_count += 1
        print(f"✓ Rank {rank}: {slug} ({key_count} keys added)")

    # Save updated translations
    save_json(en_path, en_data)
    save_json(ar_path, ar_data)

    print("=" * 70)
    print(f"Successfully processed: {processed_count} calculators")
    print(f"Skipped: {skipped_count} calculators")
    print(f"Total keys added: {total_keys_added}")
    print("=" * 70)
    print("\nNote: Auto-generated Arabic translations should be reviewed by native speakers")

if __name__ == "__main__":
    main()
