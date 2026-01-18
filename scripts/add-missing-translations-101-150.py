#!/usr/bin/env python3
"""
Script to add missing translation keys for calculators ranked 101-150
"""

import json
import re
import os
from pathlib import Path

# Base directory
BASE_DIR = Path("/Users/raedtayyem/Desktop/work/alathasiba-claudecode")

# Translation data for calculators 101-150
TRANSLATIONS = {
    # 101: descriptive-statistics-calculator
    "descriptive_statistics_calculator": {
        "namespace": "calc/statistics",
        "en": {
            "empty_data": "Please enter valid numerical data",
            "minimum_three": "Please enter at least 3 data points",
            "calculation_error": "An error occurred during calculation",
            "title": "Descriptive Statistics Calculator",
            "data_label": "Data Points",
            "data_tooltip": "Enter numbers separated by commas or spaces",
            "data_placeholder": "Example: 12, 15, 18, 20, 22, 25, 28, 30",
            "format_hint": "Enter numbers separated by commas, spaces, or new lines",
            "results": "Statistical Analysis Results",
            "central_tendency": "Measures of Central Tendency",
            "mean": "Mean (Average)",
            "median": "Median",
            "mode": "Mode",
            "dispersion": "Measures of Dispersion",
            "variance": "Variance",
            "std_dev": "Standard Deviation",
            "range": "Range",
            "iqr": "Interquartile Range (IQR)",
            "shape": "Distribution Shape",
            "skewness": "Skewness",
            "kurtosis": "Kurtosis",
            "summary": "Summary Statistics",
            "count": "Count",
            "sum": "Sum",
            "min": "Minimum",
            "max": "Maximum",
            "page_title": "Descriptive Statistics Calculator",
            "page_description": "Calculate comprehensive descriptive statistics including mean, median, mode, variance, standard deviation, and more"
        },
        "ar": {
            "empty_data": "الرجاء إدخال بيانات رقمية صالحة",
            "minimum_three": "الرجاء إدخال 3 نقاط بيانات على الأقل",
            "calculation_error": "حدث خطأ أثناء الحساب",
            "title": "حاسبة الإحصاء الوصفي",
            "data_label": "نقاط البيانات",
            "data_tooltip": "أدخل الأرقام مفصولة بفواصل أو مسافات",
            "data_placeholder": "مثال: 12، 15، 18، 20، 22، 25، 28، 30",
            "format_hint": "أدخل الأرقام مفصولة بفواصل أو مسافات أو أسطر جديدة",
            "results": "نتائج التحليل الإحصائي",
            "central_tendency": "مقاييس النزعة المركزية",
            "mean": "المتوسط الحسابي",
            "median": "الوسيط",
            "mode": "المنوال",
            "dispersion": "مقاييس التشتت",
            "variance": "التباين",
            "std_dev": "الانحراف المعياري",
            "range": "المدى",
            "iqr": "المدى الربيعي (IQR)",
            "shape": "شكل التوزيع",
            "skewness": "الالتواء",
            "kurtosis": "التفرطح",
            "summary": "ملخص الإحصائيات",
            "count": "العدد",
            "sum": "المجموع",
            "min": "الحد الأدنى",
            "max": "الحد الأقصى",
            "page_title": "حاسبة الإحصاء الوصفي",
            "page_description": "احسب إحصائيات وصفية شاملة بما في ذلك المتوسط والوسيط والمنوال والتباين والانحراف المعياري والمزيد"
        }
    },

    # 102: diet-carbon-footprint-calculator
    "diet_footprint": {
        "namespace": "calc/environmental",
        "en": {
            "consumption_title": "Weekly Food Consumption (kg)",
            "beef": "Beef",
            "beef_tooltip": "Average kg of beef consumed per week",
            "chicken": "Chicken",
            "chicken_tooltip": "Average kg of chicken consumed per week",
            "fish": "Fish",
            "fish_tooltip": "Average kg of fish consumed per week",
            "dairy": "Dairy Products",
            "dairy_tooltip": "Average kg of dairy products per week",
            "vegetables": "Vegetables",
            "vegetables_tooltip": "Average kg of vegetables per week",
            "grains": "Grains & Cereals",
            "grains_tooltip": "Average kg of grains and cereals per week",
            "enter_amount": "Enter amount",
            "results_title": "Your Diet Carbon Footprint",
            "annual_emissions": "Annual CO₂ Emissions",
            "category": "Category:",
            "categories": {
                "very_low": "Very Low Carbon Diet",
                "low": "Low Carbon Diet",
                "average": "Average Carbon Diet",
                "high": "High Carbon Diet"
            },
            "trees_needed": "Trees needed to offset annually",
            "facts_title": "Environmental Facts",
            "fact_beef": "Beef production generates 13x more CO₂ than chicken",
            "fact_plant": "Plant-based diets can reduce carbon footprint by up to 73%",
            "fact_reduce": "Reducing meat consumption is one of the most effective climate actions",
            "empty_state": "Enter your weekly food consumption to calculate your diet's carbon footprint",
            "title": "Diet Carbon Footprint Calculator",
            "description": "Calculate the environmental impact of your diet and discover how food choices affect carbon emissions",
            "footer_note": "Emission factors based on lifecycle assessment data from scientific studies"
        },
        "ar": {
            "consumption_title": "استهلاك الطعام الأسبوعي (كجم)",
            "beef": "لحم البقر",
            "beef_tooltip": "متوسط كيلوجرام لحم البقر المستهلك أسبوعياً",
            "chicken": "الدجاج",
            "chicken_tooltip": "متوسط كيلوجرام الدجاج المستهلك أسبوعياً",
            "fish": "السمك",
            "fish_tooltip": "متوسط كيلوجرام السمك المستهلك أسبوعياً",
            "dairy": "منتجات الألبان",
            "dairy_tooltip": "متوسط كيلوجرام منتجات الألبان أسبوعياً",
            "vegetables": "الخضروات",
            "vegetables_tooltip": "متوسط كيلوجرام الخضروات أسبوعياً",
            "grains": "الحبوب والغلال",
            "grains_tooltip": "متوسط كيلوجرام الحبوب والغلال أسبوعياً",
            "enter_amount": "أدخل الكمية",
            "results_title": "البصمة الكربونية لنظامك الغذائي",
            "annual_emissions": "الانبعاثات السنوية من CO₂",
            "category": "الفئة:",
            "categories": {
                "very_low": "نظام غذائي منخفض الكربون جداً",
                "low": "نظام غذائي منخفض الكربون",
                "average": "نظام غذائي متوسط الكربون",
                "high": "نظام غذائي عالي الكربون"
            },
            "trees_needed": "الأشجار المطلوبة للموازنة سنوياً",
            "facts_title": "حقائق بيئية",
            "fact_beef": "إنتاج لحم البقر يولد 13 ضعف CO₂ مقارنة بالدجاج",
            "fact_plant": "الأنظمة الغذائية النباتية يمكن أن تقلل البصمة الكربونية بنسبة تصل إلى 73%",
            "fact_reduce": "تقليل استهلاك اللحوم هو أحد أكثر الإجراءات المناخية فعالية",
            "empty_state": "أدخل استهلاكك الأسبوعي من الطعام لحساب البصمة الكربونية لنظامك الغذائي",
            "title": "حاسبة البصمة الكربونية للنظام الغذائي",
            "description": "احسب التأثير البيئي لنظامك الغذائي واكتشف كيف تؤثر خيارات الطعام على انبعاثات الكربون",
            "footer_note": "عوامل الانبعاثات مبنية على بيانات تقييم دورة الحياة من دراسات علمية"
        }
    },

    # 103: discount-calculator
    "discount": {
        "namespace": "calc/business",
        "en": {
            "errors": {
                "invalid_percentage": "Discount percentage must be between 0 and 100",
                "invalid_final_price": "Final price must be less than or equal to original price"
            },
            "title": "Discount Calculator",
            "inputs": {
                "calculation_mode": "Calculation Mode",
                "calculation_mode_tooltip": "Choose whether to calculate by discount percentage or final sale price",
                "by_percentage": "By Percentage",
                "by_final_price": "By Final Price",
                "original_price": "Original Price",
                "original_price_tooltip": "The original price before discount",
                "original_price_placeholder": "Enter original price",
                "discount_percentage": "Discount Percentage",
                "discount_percentage_tooltip": "The discount percentage (0-100%)",
                "discount_percentage_placeholder": "Enter discount %",
                "final_price": "Final Sale Price",
                "final_price_tooltip": "The price after discount",
                "final_price_placeholder": "Enter final price"
            },
            "results": {
                "final_price": "Final Price",
                "you_save": "You Save",
                "breakdown": "Price Breakdown",
                "original_price": "Original Price",
                "discount_percentage": "Discount %",
                "discount_amount": "Discount Amount",
                "formula": "Final Price = Original Price - (Original Price × Discount % ÷ 100)"
            },
            "info": {
                "title": "About This Calculator",
                "use_cases": "Common Uses",
                "use_case_1": "Calculate sale prices and savings during shopping",
                "use_case_2": "Determine discount percentage from sale prices",
                "use_case_3": "Compare different discounts and promotions"
            },
            "description": "Calculate discount amounts, sale prices, and savings from percentage discounts or final prices"
        },
        "ar": {
            "errors": {
                "invalid_percentage": "يجب أن تكون نسبة الخصم بين 0 و 100",
                "invalid_final_price": "يجب أن يكون السعر النهائي أقل من أو يساوي السعر الأصلي"
            },
            "title": "حاسبة الخصم",
            "inputs": {
                "calculation_mode": "طريقة الحساب",
                "calculation_mode_tooltip": "اختر ما إذا كنت تريد الحساب بنسبة الخصم أو السعر النهائي",
                "by_percentage": "بالنسبة المئوية",
                "by_final_price": "بالسعر النهائي",
                "original_price": "السعر الأصلي",
                "original_price_tooltip": "السعر الأصلي قبل الخصم",
                "original_price_placeholder": "أدخل السعر الأصلي",
                "discount_percentage": "نسبة الخصم",
                "discount_percentage_tooltip": "نسبة الخصم (0-100%)",
                "discount_percentage_placeholder": "أدخل نسبة الخصم %",
                "final_price": "السعر النهائي",
                "final_price_tooltip": "السعر بعد الخصم",
                "final_price_placeholder": "أدخل السعر النهائي"
            },
            "results": {
                "final_price": "السعر النهائي",
                "you_save": "توفر",
                "breakdown": "تفصيل السعر",
                "original_price": "السعر الأصلي",
                "discount_percentage": "نسبة الخصم %",
                "discount_amount": "قيمة الخصم",
                "formula": "السعر النهائي = السعر الأصلي - (السعر الأصلي × نسبة الخصم ÷ 100)"
            },
            "info": {
                "title": "عن هذه الحاسبة",
                "use_cases": "الاستخدامات الشائعة",
                "use_case_1": "حساب أسعار التخفيضات والتوفير أثناء التسوق",
                "use_case_2": "تحديد نسبة الخصم من أسعار البيع",
                "use_case_3": "مقارنة الخصومات والعروض الترويجية المختلفة"
            },
            "description": "احسب مبالغ الخصم وأسعار البيع والتوفير من نسب الخصم أو الأسعار النهائية"
        }
    }
}

def load_translation_file(filepath):
    """Load translation JSON file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_translation_file(filepath, data):
    """Save translation JSON file with proper formatting"""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')  # Add newline at end of file

def deep_update(base_dict, update_dict):
    """Recursively update nested dictionary"""
    for key, value in update_dict.items():
        if isinstance(value, dict) and key in base_dict and isinstance(base_dict[key], dict):
            deep_update(base_dict[key], value)
        else:
            base_dict[key] = value

def main():
    """Main function to add missing translations"""
    print("Adding missing translations for calculators 101-103...")
    print("=" * 60)

    # Paths to translation files
    en_path = BASE_DIR / "public/locales/en/translation.json"
    ar_path = BASE_DIR / "public/locales/ar/translation.json"

    # Load existing translations
    print("\nLoading existing translations...")
    en_data = load_translation_file(en_path)
    ar_data = load_translation_file(ar_path)

    # Add new translations
    calculators_processed = []

    for calc_key, trans_data in TRANSLATIONS.items():
        namespace = trans_data["namespace"]
        en_trans = trans_data["en"]
        ar_trans = trans_data["ar"]

        print(f"\nProcessing {calc_key} ({namespace})...")

        # Navigate to namespace in translation structure
        namespace_parts = namespace.split('/')

        # For EN
        current = en_data
        for part in namespace_parts:
            if part not in current:
                current[part] = {}
            current = current[part]
        current[calc_key] = en_trans

        # For AR
        current = ar_data
        for part in namespace_parts:
            if part not in current:
                current[part] = {}
            current = current[part]
        current[calc_key] = ar_trans

        calculators_processed.append(calc_key)
        print(f"  ✓ Added {len(en_trans)} EN keys and {len(ar_trans)} AR keys")

    # Save updated translations
    print("\nSaving updated translation files...")
    save_translation_file(en_path, en_data)
    save_translation_file(ar_path, ar_data)

    print("\n" + "=" * 60)
    print(f"Successfully processed {len(calculators_processed)} calculators:")
    for calc in calculators_processed:
        print(f"  ✓ {calc}")
    print("=" * 60)

if __name__ == "__main__":
    main()
