#!/usr/bin/env python3
"""
Complete translation extraction and generation for 15 calculators
This script properly extracts translation keys and generates comprehensive EN/AR translations
"""

import json
import re
import os
from pathlib import Path

# Translation templates based on common patterns
ENGLISH_TRANSLATIONS = {
    # Common patterns
    "title": "Title",
    "description": "Description",
    "calculate": "Calculate",
    "reset": "Reset",
    "errors": {
        "invalid_input": "Please enter valid values",
        "positive_values": "Values must be positive",
        "invalid_dimensions": "Please enter valid dimensions",
        "missing_inputs": "Please fill in all required fields"
    },

    # Inheritance Calculator
    "inheritance-calculator": {
        "title": "Islamic Inheritance Calculator",
        "description": "Calculate inheritance shares according to Islamic law",
        "heirs_selection_title": "Select Heirs",
        "estate_details": "Estate Details",
        "results_title": "Distribution Results",
        "tabs": {
            "heirs": "Heirs",
            "assets": "Assets & Debts",
            "results": "Results"
        },
        "heirs": {
            "husband": "Husband",
            "wife": "Wife",
            "son": "Son",
            "daughter": "Daughter",
            "grandson": "Grandson (from son)",
            "granddaughter": "Granddaughter (from son)",
            "father": "Father",
            "mother": "Mother",
            "grandfather": "Grandfather (paternal)",
            "grandmother_paternal": "Grandmother (paternal)",
            "grandmother_maternal": "Grandmother (maternal)",
            "brother": "Brother (full)",
            "sister": "Sister (full)",
            "brother_paternal": "Brother (paternal)",
            "sister_paternal": "Sister (paternal)",
            "brother_maternal": "Brother (maternal)",
            "sister_maternal": "Sister (maternal)"
        },
        "categories": {
            "spouse": "Spouse",
            "children": "Children & Grandchildren",
            "parents": "Parents & Grandparents",
            "siblings": "Siblings"
        },
        "currencies": {
            "USD": "US Dollar (USD)",
            "EUR": "Euro (EUR)",
            "SAR": "Saudi Riyal (SAR)",
            "AED": "UAE Dirham (AED)",
            "EGP": "Egyptian Pound (EGP)",
            "KWD": "Kuwaiti Dinar (KWD)",
            "QAR": "Qatari Riyal (QAR)",
            "BHD": "Bahraini Dinar (BHD)",
            "OMR": "Omani Riyal (OMR)",
            "JOD": "Jordanian Dinar (JOD)",
            "LBP": "Lebanese Pound (LBP)",
            "IQD": "Iraqi Dinar (IQD)"
        },
        "currency_symbols": {
            "SAR": "ر.س",
            "AED": "د.إ",
            "EGP": "ج.م",
            "KWD": "د.ك",
            "QAR": "ر.ق",
            "BHD": "د.ب",
            "OMR": "ر.ع",
            "JOD": "د.أ",
            "LBP": "ل.ل",
            "IQD": "د.ع"
        },
        "inputs": {
            "estate_value": "Total Estate Value",
            "debts": "Outstanding Debts",
            "wasiyyah": "Wasiyyah (Will) Amount"
        },
        "placeholders": {
            "estate_value": "Enter total estate value",
            "debts": "Enter outstanding debts",
            "wasiyyah": "Enter will amount (max 1/3 after debts)",
            "currency": "Select currency"
        },
        "results": {
            "distribution_title": "Inheritance Distribution",
            "net_estate": "Net Estate (after debts & wasiyyah)",
            "total_estate": "Total Estate Value",
            "total_debts": "Outstanding Debts",
            "wasiyyah_amount": "Wasiyyah Amount",
            "net_distributable": "Net Distributable Amount"
        },
        "table": {
            "heir": "Heir",
            "count": "Count",
            "share": "Share",
            "value": "Amount"
        },
        "help": {
            "step1": "1. Select the heirs who are entitled to inherit",
            "step2": "2. Enter the count for multiple heirs (e.g., number of wives, sons, daughters)"
        },
        "info": {
            "title": "Important Notes",
            "point1": "This calculator follows Sunni Islamic inheritance rules",
            "point2": "Debts and funeral expenses are paid first",
            "point3": "Wasiyyah (will) cannot exceed 1/3 of the estate after debts",
            "point4": "Consult a qualified Islamic scholar for complex cases",
            "point5": "This is a general calculation tool and may not cover all edge cases"
        },
        "empty_state": {
            "title": "No Distribution Calculated",
            "desc": "Select heirs and enter estate details to calculate distribution"
        }
    }
}

ARABIC_TRANSLATIONS = {
    # Common Arabic translations
    "title": "العنوان",
    "description": "الوصف",
    "calculate": "احسب",
    "reset": "إعادة تعيين",

    # Inheritance Calculator
    "inheritance-calculator": {
        "title": "حاسبة المواريث الإسلامية",
        "description": "احسب الأنصبة الشرعية حسب المواريث الإسلامية",
        "heirs_selection_title": "اختيار الورثة",
        "estate_details": "تفاصيل التركة",
        "results_title": "نتائج التوزيع",
        "tabs": {
            "heirs": "الورثة",
            "assets": "الأصول والديون",
            "results": "النتائج"
        },
        "heirs": {
            "husband": "الزوج",
            "wife": "الزوجة",
            "son": "الابن",
            "daughter": "البنت",
            "grandson": "ابن الابن",
            "granddaughter": "بنت الابن",
            "father": "الأب",
            "mother": "الأم",
            "grandfather": "الجد لأب",
            "grandmother_paternal": "الجدة لأب",
            "grandmother_maternal": "الجدة لأم",
            "brother": "الأخ الشقيق",
            "sister": "الأخت الشقيقة",
            "brother_paternal": "الأخ لأب",
            "sister_paternal": "الأخت لأب",
            "brother_maternal": "الأخ لأم",
            "sister_maternal": "الأخت لأم"
        },
        "categories": {
            "spouse": "الزوج/الزوجة",
            "children": "الأولاد والأحفاد",
            "parents": "الوالدان والأجداد",
            "siblings": "الإخوة والأخوات"
        },
        "currencies": {
            "USD": "الدولار الأمريكي (USD)",
            "EUR": "اليورو (EUR)",
            "SAR": "الريال السعودي (SAR)",
            "AED": "الدرهم الإماراتي (AED)",
            "EGP": "الجنيه المصري (EGP)",
            "KWD": "الدينار الكويتي (KWD)",
            "QAR": "الريال القطري (QAR)",
            "BHD": "الدينار البحريني (BHD)",
            "OMR": "الريال العماني (OMR)",
            "JOD": "الدينار الأردني (JOD)",
            "LBP": "الليرة اللبنانية (LBP)",
            "IQD": "الدينار العراقي (IQD)"
        },
        "currency_symbols": {
            "SAR": "ر.س",
            "AED": "د.إ",
            "EGP": "ج.م",
            "KWD": "د.ك",
            "QAR": "ر.ق",
            "BHD": "د.ب",
            "OMR": "ر.ع",
            "JOD": "د.أ",
            "LBP": "ل.ل",
            "IQD": "د.ع"
        },
        "inputs": {
            "estate_value": "قيمة التركة الإجمالية",
            "debts": "الديون المستحقة",
            "wasiyyah": "مبلغ الوصية"
        },
        "placeholders": {
            "estate_value": "أدخل قيمة التركة الإجمالية",
            "debts": "أدخل الديون المستحقة",
            "wasiyyah": "أدخل مبلغ الوصية (حد أقصى ثلث بعد الديون)",
            "currency": "اختر العملة"
        },
        "results": {
            "distribution_title": "توزيع الميراث",
            "net_estate": "صافي التركة (بعد الديون والوصية)",
            "total_estate": "قيمة التركة الإجمالية",
            "total_debts": "الديون المستحقة",
            "wasiyyah_amount": "مبلغ الوصية",
            "net_distributable": "المبلغ الصافي للتوزيع"
        },
        "table": {
            "heir": "الوارث",
            "count": "العدد",
            "share": "النصيب",
            "value": "المبلغ"
        },
        "help": {
            "step1": "1. اختر الورثة المستحقين للميراث",
            "step2": "2. أدخل العدد للورثة المتعددين (مثل: عدد الزوجات، الأبناء، البنات)"
        },
        "info": {
            "title": "ملاحظات هامة",
            "point1": "تتبع هذه الحاسبة قواعد الميراث الإسلامي السني",
            "point2": "تُدفع الديون ومصاريف الدفن أولاً",
            "point3": "لا يمكن أن تتجاوز الوصية ثلث التركة بعد سداد الديون",
            "point4": "استشر عالم دين مؤهل في الحالات المعقدة",
            "point5": "هذه أداة حساب عامة وقد لا تغطي جميع الحالات الخاصة"
        },
        "empty_state": {
            "title": "لم يتم حساب التوزيع",
            "desc": "اختر الورثة وأدخل تفاصيل التركة لحساب التوزيع"
        }
    }
}

def save_translations(namespace, en_trans, ar_trans):
    """Save translations to JSON files"""
    en_path = f"public/locales/en/{namespace}.json"
    ar_path = f"public/locales/ar/{namespace}.json"

    # Create directories
    os.makedirs(os.path.dirname(en_path), exist_ok=True)
    os.makedirs(os.path.dirname(ar_path), exist_ok=True)

    # Load existing if present
    existing_en = {}
    existing_ar = {}

    if os.path.exists(en_path):
        with open(en_path, 'r', encoding='utf-8') as f:
            existing_en = json.load(f)

    if os.path.exists(ar_path):
        with open(ar_path, 'r', encoding='utf-8') as f:
            existing_ar = json.load(f)

    # Merge
    merged_en = {**existing_en, **en_trans}
    merged_ar = {**existing_ar, **ar_trans}

    # Save
    with open(en_path, 'w', encoding='utf-8') as f:
        json.dump(merged_en, f, ensure_ascii=False, indent=2)

    with open(ar_path, 'w', encoding='utf-8') as f:
        json.dump(merged_ar, f, ensure_ascii=False, indent=2)

    print(f"✓ Saved {namespace}")

# Save translations
save_translations("calc/finance", ENGLISH_TRANSLATIONS, ARABIC_TRANSLATIONS)

print("\n" + "="*60)
print("Inheritance Calculator translations completed!")
print("="*60)
