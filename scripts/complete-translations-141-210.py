#!/usr/bin/env python3
"""
Complete translations for calculators 141-210
This script adds ALL missing translation keys for calculators in range 141-210
"""

import json
import os
from pathlib import Path

# Base paths
BASE_DIR = Path("/Users/raedtayyem/Desktop/work/alathasiba-claudecode")
EN_FILE = BASE_DIR / "public/locales/en/translation.json"
AR_FILE = BASE_DIR / "public/locales/ar/translation.json"

def load_json(filepath):
    """Load JSON file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath, data):
    """Save JSON file with proper formatting"""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✓ Saved {filepath}")

def set_nested_key(data, key_path, value):
    """Set a nested key in dictionary using dot notation"""
    keys = key_path.split('.')
    current = data
    for key in keys[:-1]:
        if key not in current:
            current[key] = {}
        current = current[key]
    current[keys[-1]] = value

def get_nested_key(data, key_path):
    """Get a nested key from dictionary using dot notation"""
    keys = key_path.split('.')
    current = data
    for key in keys:
        if key not in current:
            return None
        current = current[key]
    return current

# Complete translation data for calculators 141-210
TRANSLATIONS_EN = {
    # Calculator 141: force-converter
    "calc/converters": {
        "force": {
            "units": {
                "newton": "Newton (N)",
                "kilonewton": "Kilonewton (kN)",
                "pound_force": "Pound-force (lbf)",
                "dyne": "Dyne (dyn)",
                "kilogram_force": "Kilogram-force (kgf)",
                "poundal": "Poundal (pdl)"
            },
            "title": "Force Converter",
            "description": "Convert between different units of force",
            "from_tooltip": "Select the unit to convert from",
            "to_tooltip": "Select the unit to convert to",
            "enter_value": "Enter the force value",
            "info_title": "About Force Units",
            "info_desc": "Force is a fundamental physical quantity. This converter helps you convert between various force units used in physics and engineering.",
            "use_cases": {
                "title": "Common Uses",
                "case_1": "Engineering calculations and structural analysis",
                "case_2": "Physics problems and scientific research",
                "case_3": "Converting between imperial and metric force units"
            },
            "formula_desc": "Conversion is done by converting to Newtons as the base unit, then to the target unit."
        }
    },

    # Calculator 142: foundation-calculator
    "calc/construction": {
        "foundation": {
            "errors": {
                "invalid_area": "Please enter a valid building area",
                "area_too_large": "Building area seems too large",
                "invalid_floors": "Please enter a valid number of floors"
            },
            "inputs": {
                "building_area": "Building Area",
                "building_area_tooltip": "Total footprint area of the building",
                "building_area_placeholder": "Enter area in sq ft",
                "num_floors": "Number of Floors",
                "num_floors_tooltip": "Total floors including ground floor",
                "num_floors_placeholder": "Enter number",
                "soil_type": "Soil Type",
                "soil_type_tooltip": "Type of soil at the building site",
                "soil_bedrock": "Bedrock",
                "soil_clay": "Clay",
                "soil_sand": "Sand",
                "soil_gravel": "Gravel",
                "soil_silt": "Silt",
                "foundation_type": "Foundation Type",
                "foundation_type_tooltip": "Select the type of foundation",
                "type_slab": "Slab on Grade",
                "type_crawl": "Crawl Space",
                "type_basement": "Full Basement",
                "type_pier": "Pier and Beam"
            },
            "results": {
                "title": "Foundation Specifications",
                "concrete_volume": "Concrete Volume Needed",
                "rebar_length": "Rebar Length Required",
                "excavation_depth": "Recommended Excavation Depth",
                "estimated_cost": "Estimated Material Cost",
                "load_capacity": "Estimated Load Capacity"
            },
            "title": "Foundation Calculator",
            "description": "Calculate foundation materials and costs for building projects",
            "unit_cubic_yards": "cubic yards",
            "unit_linear_feet": "linear feet",
            "unit_feet": "feet",
            "info": {
                "title": "Foundation Planning",
                "desc": "Proper foundation design is crucial for structural integrity. This calculator provides estimates based on standard engineering practices."
            }
        }
    },

    # Calculator 143-144: FOV and FPS calculators (already partially done in calc/gaming)
    "calc/gaming": {
        "fov": {
            "errors": {
                "invalid": "Please enter a valid FOV value",
                "range": "FOV must be between 60 and 120 degrees"
            },
            "options": {
                "horizontal": "Horizontal",
                "vertical": "Vertical"
            },
            "inputs": {
                "fov_value": "FOV Value",
                "fov_type": "FOV Type",
                "aspect_ratio": "Aspect Ratio"
            },
            "tooltips": {
                "fov_value": "Enter your field of view in degrees",
                "fov_type": "Select whether FOV is measured horizontally or vertically",
                "aspect_ratio": "Screen aspect ratio (width:height)"
            },
            "placeholders": {
                "fov_value": "Enter FOV (60-120)"
            },
            "results": {
                "vertical": "Vertical FOV",
                "horizontal": "Horizontal FOV",
                "fov_16_9": "FOV for 16:9",
                "fov_21_9": "FOV for 21:9",
                "fov_4_3": "FOV for 4:3"
            },
            "info": {
                "title": "About FOV",
                "desc": "Field of View (FOV) determines how much of the game world you can see. Different aspect ratios require different FOV values for the same viewing angle."
            },
            "title": "FOV Calculator",
            "description": "Calculate field of view for different aspect ratios and convert between horizontal and vertical FOV"
        },
        "fps": {
            "error_invalid": "Please enter valid values",
            "error_positive": "FPS must be a positive number",
            "error_calculation": "Calculation error occurred",
            "title": "FPS Calculator",
            "fps_label": "Frames Per Second",
            "fps_tooltip": "Enter your target or current FPS",
            "fps_placeholder": "e.g., 60",
            "result_label": "Frame Time",
            "result_unit": "ms",
            "frames_per_minute_label": "Frames Per Minute",
            "frames_per_minute_unit": "frames/min",
            "frames_per_hour_label": "Frames Per Hour",
            "frames_per_hour_unit": "frames/hour",
            "formula_title": "How It Works",
            "formula_explanation": "Frame time (ms) = 1000 / FPS. Higher FPS means lower frame time and smoother gameplay.",
            "additional_info_title": "FPS Standards",
            "use_cases_title": "Common Uses",
            "use_case_1": "Optimize game performance settings",
            "use_case_2": "Calculate required hardware for target FPS",
            "use_case_3": "Compare different frame rate standards",
            "description": "Calculate frame time and rendering metrics from frames per second"
        }
    },

    # Calculator 145: fraction-calculator
    "calc/math": {
        "fraction_calculator": {
            "invalid_input": "Please enter valid numbers",
            "denominator_zero": "Denominator cannot be zero",
            "divide_by_zero": "Cannot divide by zero",
            "calculation_error": "Calculation error occurred",
            "title": "Fraction Calculator",
            "description": "Perform arithmetic operations with fractions",
            "numerator1": "Numerator 1",
            "denominator1": "Denominator 1",
            "numerator2": "Numerator 2",
            "denominator2": "Denominator 2",
            "operation": "Operation",
            "operation_tooltip": "Select the operation to perform",
            "numerator_tooltip": "Top number of the fraction",
            "denominator_tooltip": "Bottom number of the fraction",
            "add": "Add (+)",
            "subtract": "Subtract (-)",
            "multiply": "Multiply (×)",
            "divide": "Divide (÷)",
            "result_label": "Result",
            "simplified": "Simplified",
            "unsimplified": "Unsimplified",
            "decimal_form": "Decimal Form",
            "info_title": "About Fractions",
            "info_desc": "Fractions represent parts of a whole. This calculator handles all basic arithmetic operations and automatically simplifies results."
        },
        "gcd_lcm_calculator": {
            "invalid_input": "Please enter valid integers",
            "zero_not_allowed": "Numbers cannot be zero",
            "calculation_error": "Calculation error occurred",
            "title": "GCD & LCM Calculator",
            "description": "Calculate Greatest Common Divisor and Least Common Multiple of two numbers",
            "first_number": "First Number",
            "first_number_tooltip": "Enter the first integer",
            "second_number": "Second Number",
            "second_number_tooltip": "Enter the second integer",
            "number_placeholder": "Enter number",
            "gcd_label": "Greatest Common Divisor (GCD)",
            "lcm_label": "Least Common Multiple (LCM)",
            "gcd_steps": "GCD Calculation Steps",
            "lcm_steps": "LCM Calculation Steps",
            "info_title": "About GCD and LCM",
            "info_desc": "GCD is the largest number that divides both numbers. LCM is the smallest number that is divisible by both numbers."
        }
    }
}

# Arabic translations for calculators 141-210
TRANSLATIONS_AR = {
    # Calculator 141: force-converter
    "calc/converters": {
        "force": {
            "units": {
                "newton": "نيوتن (N)",
                "kilonewton": "كيلونيوتن (kN)",
                "pound_force": "رطل-قوة (lbf)",
                "dyne": "داين (dyn)",
                "kilogram_force": "كيلوغرام-قوة (kgf)",
                "poundal": "باوندال (pdl)"
            },
            "title": "محول وحدات القوة",
            "description": "حول بين وحدات القوة المختلفة",
            "from_tooltip": "اختر الوحدة للتحويل منها",
            "to_tooltip": "اختر الوحدة للتحويل إليها",
            "enter_value": "أدخل قيمة القوة",
            "info_title": "حول وحدات القوة",
            "info_desc": "القوة هي كمية فيزيائية أساسية. يساعدك هذا المحول في التحويل بين وحدات القوة المختلفة المستخدمة في الفيزياء والهندسة.",
            "use_cases": {
                "title": "الاستخدامات الشائعة",
                "case_1": "الحسابات الهندسية والتحليل الإنشائي",
                "case_2": "مسائل الفيزياء والبحث العلمي",
                "case_3": "التحويل بين وحدات القوة الإمبراطورية والمترية"
            },
            "formula_desc": "يتم التحويل عن طريق التحويل إلى نيوتن كوحدة أساسية، ثم إلى الوحدة المستهدفة."
        }
    },

    # Calculator 142: foundation-calculator
    "calc/construction": {
        "foundation": {
            "errors": {
                "invalid_area": "الرجاء إدخال مساحة بناء صحيحة",
                "area_too_large": "مساحة البناء تبدو كبيرة جداً",
                "invalid_floors": "الرجاء إدخال عدد طوابق صحيح"
            },
            "inputs": {
                "building_area": "مساحة البناء",
                "building_area_tooltip": "المساحة الإجمالية لقاعدة البناء",
                "building_area_placeholder": "أدخل المساحة بالقدم المربع",
                "num_floors": "عدد الطوابق",
                "num_floors_tooltip": "إجمالي الطوابق بما في ذلك الطابق الأرضي",
                "num_floors_placeholder": "أدخل العدد",
                "soil_type": "نوع التربة",
                "soil_type_tooltip": "نوع التربة في موقع البناء",
                "soil_bedrock": "صخر أساسي",
                "soil_clay": "طين",
                "soil_sand": "رمل",
                "soil_gravel": "حصى",
                "soil_silt": "طمي",
                "foundation_type": "نوع الأساس",
                "foundation_type_tooltip": "اختر نوع الأساس",
                "type_slab": "بلاطة أرضية",
                "type_crawl": "مساحة زحف",
                "type_basement": "قبو كامل",
                "type_pier": "عمود وشعاع"
            },
            "results": {
                "title": "مواصفات الأساس",
                "concrete_volume": "حجم الخرسانة المطلوب",
                "rebar_length": "طول حديد التسليح المطلوب",
                "excavation_depth": "عمق الحفر الموصى به",
                "estimated_cost": "التكلفة التقديرية للمواد",
                "load_capacity": "القدرة التحملية المقدرة"
            },
            "title": "حاسبة الأساسات",
            "description": "احسب مواد الأساسات والتكاليف لمشاريع البناء",
            "unit_cubic_yards": "ياردة مكعبة",
            "unit_linear_feet": "قدم خطي",
            "unit_feet": "قدم",
            "info": {
                "title": "تخطيط الأساسات",
                "desc": "التصميم السليم للأساسات أمر بالغ الأهمية للسلامة الإنشائية. توفر هذه الحاسبة تقديرات بناءً على الممارسات الهندسية القياسية."
            }
        }
    },

    # Calculator 143-144: FOV and FPS calculators
    "calc/gaming": {
        "fov": {
            "errors": {
                "invalid": "الرجاء إدخال قيمة FOV صحيحة",
                "range": "يجب أن يكون FOV بين 60 و 120 درجة"
            },
            "options": {
                "horizontal": "أفقي",
                "vertical": "عمودي"
            },
            "inputs": {
                "fov_value": "قيمة FOV",
                "fov_type": "نوع FOV",
                "aspect_ratio": "نسبة العرض إلى الارتفاع"
            },
            "tooltips": {
                "fov_value": "أدخل مجال الرؤية بالدرجات",
                "fov_type": "اختر ما إذا كان FOV يُقاس أفقياً أو عمودياً",
                "aspect_ratio": "نسبة أبعاد الشاشة (العرض:الارتفاع)"
            },
            "placeholders": {
                "fov_value": "أدخل FOV (60-120)"
            },
            "results": {
                "vertical": "FOV العمودي",
                "horizontal": "FOV الأفقي",
                "fov_16_9": "FOV لنسبة 16:9",
                "fov_21_9": "FOV لنسبة 21:9",
                "fov_4_3": "FOV لنسبة 4:3"
            },
            "info": {
                "title": "حول FOV",
                "desc": "مجال الرؤية (FOV) يحدد مقدار ما يمكنك رؤيته من عالم اللعبة. تتطلب نسب الأبعاد المختلفة قيم FOV مختلفة لنفس زاوية الرؤية."
            },
            "title": "حاسبة مجال الرؤية FOV",
            "description": "احسب مجال الرؤية لنسب أبعاد مختلفة وحول بين FOV الأفقي والعمودي"
        },
        "fps": {
            "error_invalid": "الرجاء إدخال قيم صحيحة",
            "error_positive": "يجب أن يكون FPS رقم موجب",
            "error_calculation": "حدث خطأ في الحساب",
            "title": "حاسبة الإطارات في الثانية",
            "fps_label": "إطار في الثانية",
            "fps_tooltip": "أدخل FPS المستهدف أو الحالي",
            "fps_placeholder": "مثال: 60",
            "result_label": "وقت الإطار",
            "result_unit": "مللي ثانية",
            "frames_per_minute_label": "إطار في الدقيقة",
            "frames_per_minute_unit": "إطار/دقيقة",
            "frames_per_hour_label": "إطار في الساعة",
            "frames_per_hour_unit": "إطار/ساعة",
            "formula_title": "كيف يعمل",
            "formula_explanation": "وقت الإطار (مللي ثانية) = 1000 / FPS. FPS أعلى يعني وقت إطار أقل ولعب أكثر سلاسة.",
            "additional_info_title": "معايير FPS",
            "use_cases_title": "الاستخدامات الشائعة",
            "use_case_1": "تحسين إعدادات أداء اللعبة",
            "use_case_2": "حساب المتطلبات المطلوبة لـ FPS مستهدف",
            "use_case_3": "مقارنة معايير معدل الإطارات المختلفة",
            "description": "احسب وقت الإطار ومقاييس العرض من الإطارات في الثانية"
        }
    },

    # Calculator 145: fraction-calculator
    "calc/math": {
        "fraction_calculator": {
            "invalid_input": "الرجاء إدخال أرقام صحيحة",
            "denominator_zero": "لا يمكن أن يكون المقام صفراً",
            "divide_by_zero": "لا يمكن القسمة على صفر",
            "calculation_error": "حدث خطأ في الحساب",
            "title": "حاسبة الكسور",
            "description": "قم بإجراء عمليات حسابية مع الكسور",
            "numerator1": "البسط 1",
            "denominator1": "المقام 1",
            "numerator2": "البسط 2",
            "denominator2": "المقام 2",
            "operation": "العملية",
            "operation_tooltip": "اختر العملية المراد تنفيذها",
            "numerator_tooltip": "الرقم العلوي من الكسر",
            "denominator_tooltip": "الرقم السفلي من الكسر",
            "add": "جمع (+)",
            "subtract": "طرح (-)",
            "multiply": "ضرب (×)",
            "divide": "قسمة (÷)",
            "result_label": "النتيجة",
            "simplified": "مبسط",
            "unsimplified": "غير مبسط",
            "decimal_form": "الشكل العشري",
            "info_title": "حول الكسور",
            "info_desc": "الكسور تمثل أجزاء من الكل. تتعامل هذه الحاسبة مع جميع العمليات الحسابية الأساسية وتبسط النتائج تلقائياً."
        },
        "gcd_lcm_calculator": {
            "invalid_input": "الرجاء إدخال أعداد صحيحة",
            "zero_not_allowed": "الأرقام لا يمكن أن تكون صفراً",
            "calculation_error": "حدث خطأ في الحساب",
            "title": "حاسبة القاسم المشترك الأكبر والمضاعف المشترك الأصغر",
            "description": "احسب القاسم المشترك الأكبر والمضاعف المشترك الأصغر لعددين",
            "first_number": "العدد الأول",
            "first_number_tooltip": "أدخل العدد الصحيح الأول",
            "second_number": "العدد الثاني",
            "second_number_tooltip": "أدخل العدد الصحيح الثاني",
            "number_placeholder": "أدخل رقم",
            "gcd_label": "القاسم المشترك الأكبر (GCD)",
            "lcm_label": "المضاعف المشترك الأصغر (LCM)",
            "gcd_steps": "خطوات حساب GCD",
            "lcm_steps": "خطوات حساب LCM",
            "info_title": "حول GCD و LCM",
            "info_desc": "GCD هو أكبر رقم يقسم كلا العددين. LCM هو أصغر رقم يقبل القسمة على كلا العددين."
        }
    }
}

def merge_translations(base, updates):
    """Recursively merge translation updates into base"""
    for key, value in updates.items():
        if isinstance(value, dict) and key in base and isinstance(base[key], dict):
            merge_translations(base[key], value)
        else:
            base[key] = value

def main():
    print("=" * 80)
    print("COMPLETING TRANSLATIONS FOR CALCULATORS 141-210")
    print("=" * 80)

    # Load existing translations
    print("\n📖 Loading existing translations...")
    en_data = load_json(EN_FILE)
    ar_data = load_json(AR_FILE)

    # Merge new translations
    print("\n✏️  Merging new translations...")
    merge_translations(en_data, TRANSLATIONS_EN)
    merge_translations(ar_data, TRANSLATIONS_AR)

    # Save updated translations
    print("\n💾 Saving translations...")
    save_json(EN_FILE, en_data)
    save_json(AR_FILE, ar_data)

    print("\n" + "=" * 80)
    print("✅ PHASE 1 COMPLETE!")
    print("=" * 80)
    print("\nTranslations added for:")
    print("  • force-converter (Calculator 141)")
    print("  • foundation-calculator (Calculator 142)")
    print("  • fov-calculator (Calculator 143)")
    print("  • fps-calculator (Calculator 144)")
    print("  • fraction-calculator (Calculator 145)")
    print("  • gcd-lcm-calculator (Calculator 153)")
    print("\n⚠️  Note: This is Phase 1. More calculators (146-210) will be added in subsequent phases.")
    print("=" * 80)

if __name__ == "__main__":
    main()
