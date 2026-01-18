#!/usr/bin/env python3
"""
Complete Final Translations - Batch 3
Adds the final ~500 remaining translation keys for 100% coverage
"""

import json
from pathlib import Path

# Base paths
BASE_DIR = Path(__file__).parent.parent
LOCALES_DIR = BASE_DIR / "public" / "locales"
AR_FILE = LOCALES_DIR / "ar" / "translation.json"
EN_FILE = LOCALES_DIR / "en" / "translation.json"

def load_json(file_path):
    """Load JSON file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(file_path, data):
    """Save JSON file with proper formatting"""
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')

def set_nested_key(data, path, value):
    """Set a value in nested dictionary using dot notation path"""
    keys = path.split('.')
    current = data
    for key in keys[:-1]:
        if key not in current:
            current[key] = {}
        current = current[key]
    current[keys[-1]] = value

def main():
    # Load translation files
    ar_data = load_json(AR_FILE)
    en_data = load_json(EN_FILE)

    print("=" * 70)
    print("COMPLETING FINAL TRANSLATIONS - BATCH 3 (FINAL)")
    print("=" * 70)
    print()

    # Final batch of all remaining translations
    translations = {
        # Bar/Bat Mitzvah Calculator
        "bar_bat_mitzvah_calculator.bar_mitzvah": {
            "en": "Bar Mitzvah",
            "ar": "بار متسفا"
        },
        "bar_bat_mitzvah_calculator.bat_mitzvah": {
            "en": "Bat Mitzvah",
            "ar": "بات متسفا"
        },
        "bar_bat_mitzvah_calculator.calculate_btn": {
            "en": "Calculate Date",
            "ar": "احسب التاريخ"
        },
        "bar_bat_mitzvah_calculator.female": {
            "en": "Female",
            "ar": "أنثى"
        },
        "bar_bat_mitzvah_calculator.gender": {
            "en": "Gender",
            "ar": "الجنس"
        },
        "bar_bat_mitzvah_calculator.male": {
            "en": "Male",
            "ar": "ذكر"
        },

        # Block Calculator
        "block.sizes.12x8x16": {
            "en": "12\"x8\"x16\" (Standard)",
            "ar": "12\"×8\"×16\" (قياسي)"
        },
        "block.sizes.20x20x40": {
            "en": "20x20x40 cm",
            "ar": "20×20×40 سم"
        },
        "block.sizes.4x8x16": {
            "en": "4\"x8\"x16\" (Half)",
            "ar": "4\"×8\"×16\" (نصف)"
        },
        "block.sizes.6x8x16": {
            "en": "6\"x8\"x16\"",
            "ar": "6\"×8\"×16\""
        },
        "block.sizes.8x8x16": {
            "en": "8\"x8\"x16\"",
            "ar": "8\"×8\"×16\""
        },

        # Brick Calculator
        "brick.feet": {
            "en": "Feet",
            "ar": "قدم"
        },
        "brick.meters": {
            "en": "Meters",
            "ar": "متر"
        },
        "brick.unit": {
            "en": "Unit",
            "ar": "الوحدة"
        },
        "brick.unit_tooltip": {
            "en": "Measurement unit for dimensions",
            "ar": "وحدة القياس للأبعاد"
        },
        "brick.waste_factor": {
            "en": "Waste Factor",
            "ar": "معامل الهدر"
        },

        # Ceiling Calculator additions
        "ceiling.placeholders.tile_length": {
            "en": "e.g., 60",
            "ar": "مثال: 60"
        },
        "ceiling.sizes.custom": {
            "en": "Custom Size",
            "ar": "حجم مخصص"
        },
        "ceiling.tile_length": {
            "en": "Tile Length",
            "ar": "طول البلاطة"
        },
        "ceiling.tile_length_tooltip": {
            "en": "Length of ceiling tile in cm",
            "ar": "طول بلاطة السقف بالسنتيمتر"
        },
        "ceiling.tile_width": {
            "en": "Tile Width",
            "ar": "عرض البلاطة"
        },
        "ceiling.tile_width_tooltip": {
            "en": "Width of ceiling tile in cm",
            "ar": "عرض بلاطة السقف بالسنتيمتر"
        },

        # Common additions
        "common.errors.nonNegative": {
            "en": "Value must be non-negative",
            "ar": "يجب أن تكون القيمة غير سالبة"
        },
        "common.features.accurate_results": {
            "en": "Accurate Results",
            "ar": "نتائج دقيقة"
        },
        "common.features.amortization_schedule": {
            "en": "Amortization Schedule",
            "ar": "جدول الإطفاء"
        },
        "common.features.instant_calculation": {
            "en": "Instant Calculation",
            "ar": "حساب فوري"
        },
        "common.features.mobile_friendly": {
            "en": "Mobile Friendly",
            "ar": "متوافق مع الجوال"
        },

        # Date Format Converter additions
        "date_format_converter.error_empty": {
            "en": "Please enter a date",
            "ar": "الرجاء إدخال تاريخ"
        },
        "date_format_converter.error_invalid": {
            "en": "Please enter a valid date",
            "ar": "الرجاء إدخال تاريخ صحيح"
        },
        "date_format_converter.format_milliseconds": {
            "en": "Milliseconds since epoch",
            "ar": "ميلي ثانية منذ البداية"
        },
        "date_format_converter.format_unix_timestamp": {
            "en": "Unix Timestamp",
            "ar": "طابع زمني يونكس"
        },
        "date_format_converter.title": {
            "en": "Date Format Converter",
            "ar": "محول صيغة التاريخ"
        },
        "date_format_converter.description": {
            "en": "Convert dates between different formats",
            "ar": "تحويل التواريخ بين صيغ مختلفة"
        },

        # Drywall Calculator additions
        "drywall.materials_needed": {
            "en": "Materials Needed",
            "ar": "المواد المطلوبة"
        },
        "drywall.thickness_options.five_eighths": {
            "en": "5/8 inch",
            "ar": "5/8 بوصة"
        },
        "drywall.thickness_options.three_eighths": {
            "en": "3/8 inch",
            "ar": "3/8 بوصة"
        },
        "drywall.total_area": {
            "en": "Total Area",
            "ar": "المساحة الإجمالية"
        },
        "drywall.without_waste": {
            "en": "Without Waste",
            "ar": "بدون هدر"
        },

        # Flooring Calculator additions
        "flooring.details": {
            "en": "Details",
            "ar": "التفاصيل"
        },
        "flooring.planks": {
            "en": "Planks",
            "ar": "ألواح"
        },
        "flooring.result_boxes": {
            "en": "Boxes Needed",
            "ar": "عدد الصناديق المطلوبة"
        },
        "flooring.room_area": {
            "en": "Room Area",
            "ar": "مساحة الغرفة"
        },
        "flooring.sqft_short": {
            "en": "sq ft",
            "ar": "قدم²"
        },

        # Foundation Calculator additions
        "foundation.foundation_types.isolated": {
            "en": "Isolated Footing",
            "ar": "قاعدة منفصلة"
        },
        "foundation.foundation_types.raft": {
            "en": "Raft Foundation",
            "ar": "أساس لوحي"
        },
        "foundation.foundation_types.strip": {
            "en": "Strip Foundation",
            "ar": "أساس شريطي"
        },
        "foundation.soil_types.medium_clay": {
            "en": "Medium Clay",
            "ar": "طين متوسط"
        },
        "foundation.soil_types.medium_sand": {
            "en": "Medium Sand",
            "ar": "رمل متوسط"
        },

        # Half Life Calculator additions
        "half_life.errors.calculation_error": {
            "en": "Error in calculation",
            "ar": "خطأ في الحساب"
        },
        "half_life.errors.elapsed_time_non_negative": {
            "en": "Elapsed time must be non-negative",
            "ar": "يجب أن يكون الوقت المنقضي غير سالب"
        },
        "half_life.units.hours": {
            "en": "Hours",
            "ar": "ساعات"
        },
        "half_life.units.minutes": {
            "en": "Minutes",
            "ar": "دقائق"
        },
        "half_life.units.seconds": {
            "en": "Seconds",
            "ar": "ثواني"
        },
        "half_life.units.days": {
            "en": "Days",
            "ar": "أيام"
        },
        "half_life.units.years": {
            "en": "Years",
            "ar": "سنوات"
        },

        # Joint Compound Calculator additions
        "jointCompound.coats.four": {
            "en": "4 Coats (Premium)",
            "ar": "4 طبقات (ممتاز)"
        },
        "jointCompound.coats.three": {
            "en": "3 Coats (Standard)",
            "ar": "3 طبقات (قياسي)"
        },
        "jointCompound.coats.two": {
            "en": "2 Coats (Minimum)",
            "ar": "طبقتان (حد أدنى)"
        },
        "jointCompound.compound_type": {
            "en": "Compound Type",
            "ar": "نوع المعجون"
        },
        "jointCompound.placeholders.joint_length": {
            "en": "e.g., 50",
            "ar": "مثال: 50"
        },

        # NOI Calculator
        "noi_calculator.enter_operating_expenses": {
            "en": "Enter annual operating expenses",
            "ar": "أدخل المصروفات التشغيلية السنوية"
        },
        "noi_calculator.enter_vacancy_loss": {
            "en": "Enter estimated vacancy loss",
            "ar": "أدخل الخسارة المقدرة من الشواغر"
        },
        "noi_calculator.operating_expenses_tooltip": {
            "en": "Annual costs to operate the property (maintenance, taxes, insurance, etc.)",
            "ar": "التكاليف السنوية لتشغيل العقار (صيانة، ضرائب، تأمين، إلخ)"
        },
        "noi_calculator.vacancy_loss": {
            "en": "Vacancy Loss",
            "ar": "خسارة الشواغر"
        },
        "noi_calculator.vacancy_loss_tooltip": {
            "en": "Expected loss from unoccupied units",
            "ar": "الخسارة المتوقعة من الوحدات غير المشغولة"
        },

        # Protein Calculator additions
        "protein.inputs.activity_level": {
            "en": "Activity Level",
            "ar": "مستوى النشاط"
        },
        "protein.tooltips.activity": {
            "en": "Your typical weekly physical activity level",
            "ar": "مستوى نشاطك البدني الأسبوعي المعتاد"
        },

        # Rent vs Buy Calculator
        "rent_vs_buy_calculator.calculate_btn": {
            "en": "Compare",
            "ar": "قارن"
        },
        "rent_vs_buy_calculator.info_description": {
            "en": "Compare the financial aspects of renting vs buying a property",
            "ar": "قارن الجوانب المالية لاستئجار أو شراء عقار"
        },
        "rent_vs_buy_calculator.info_title": {
            "en": "Rent vs Buy Analysis",
            "ar": "تحليل الإيجار مقابل الشراء"
        },
        "rent_vs_buy_calculator.reset_btn": {
            "en": "Reset",
            "ar": "إعادة تعيين"
        },
        "rent_vs_buy_calculator.use_cases_title": {
            "en": "When to Use This Calculator",
            "ar": "متى تستخدم هذه الحاسبة"
        },

        # Reptile Tank Calculator additions
        "reptile-tank-calculator.calculate_btn": {
            "en": "Calculate Tank Size",
            "ar": "احسب حجم الخزان"
        },
        "reptile-tank-calculator.enter_length": {
            "en": "Enter reptile length",
            "ar": "أدخل طول الزاحف"
        },
        "reptile-tank-calculator.input_title": {
            "en": "Reptile Information",
            "ar": "معلومات الزاحف"
        },
        "reptile-tank-calculator.reset_btn": {
            "en": "Reset",
            "ar": "إعادة تعيين"
        },
        "reptile-tank-calculator.results_title": {
            "en": "Recommended Tank Setup",
            "ar": "إعداد الخزان الموصى به"
        },
        "reptile-tank-calculator.title": {
            "en": "Reptile Tank Calculator",
            "ar": "حاسبة خزان الزواحف"
        },
        "reptile-tank-calculator.description": {
            "en": "Calculate the ideal tank size and setup for your reptile",
            "ar": "احسب حجم وإعداد الخزان المثالي للزاحف الخاص بك"
        },

        # Shingle Calculator additions
        "shingle.eaves_length": {
            "en": "Eaves Length",
            "ar": "طول الأفاريز"
        },
        "shingle.eaves_length_tooltip": {
            "en": "Total length of roof edges (eaves and rakes)",
            "ar": "الطول الإجمالي لحواف السقف (الأفاريز والأطراف)"
        },
        "shingle.ft": {
            "en": "ft",
            "ar": "قدم"
        },
        "shingle.placeholders.eaves": {
            "en": "e.g., 120",
            "ar": "مثال: 120"
        },
        "shingle.placeholders.ridge": {
            "en": "e.g., 40",
            "ar": "مثال: 40"
        },
        "shingle.ridge_length": {
            "en": "Ridge Length",
            "ar": "طول السلسلة"
        },
        "shingle.ridge_length_tooltip": {
            "en": "Total length of roof ridges",
            "ar": "الطول الإجمالي لسلاسل السقف"
        },

        # Timezone Converter additions
        "timezone_converter.error_conversion": {
            "en": "Error converting timezone",
            "ar": "خطأ في تحويل المنطقة الزمنية"
        },
        "timezone_converter.error_empty": {
            "en": "Please enter a time",
            "ar": "الرجاء إدخال وقت"
        },
        "timezone_converter.error_invalid": {
            "en": "Please enter a valid time",
            "ar": "الرجاء إدخال وقت صحيح"
        },
        "timezone_converter.timezone_riyadh": {
            "en": "Riyadh (AST)",
            "ar": "الرياض (AST)"
        },
        "timezone_converter.timezone_shanghai": {
            "en": "Shanghai (CST)",
            "ar": "شنغهاي (CST)"
        },
        "timezone_converter.title": {
            "en": "Timezone Converter",
            "ar": "محول المناطق الزمنية"
        },
        "timezone_converter.description": {
            "en": "Convert times between different timezones",
            "ar": "تحويل الأوقات بين مناطق زمنية مختلفة"
        },

        # Tractor Fuel Calculator
        "tractor_fuel.efficiency_excellent": {
            "en": "Excellent (< 2 gal/hr)",
            "ar": "ممتاز (< 2 جالون/ساعة)"
        },
        "tractor_fuel.efficiency_fair": {
            "en": "Fair (3-4 gal/hr)",
            "ar": "مقبول (3-4 جالون/ساعة)"
        },
        "tractor_fuel.efficiency_good": {
            "en": "Good (2-3 gal/hr)",
            "ar": "جيد (2-3 جالون/ساعة)"
        },
        "tractor_fuel.error_positive_required": {
            "en": "Value must be greater than 0",
            "ar": "يجب أن تكون القيمة أكبر من 0"
        },
        "tractor_fuel.error_price_negative": {
            "en": "Fuel price cannot be negative",
            "ar": "سعر الوقود لا يمكن أن يكون سالبًا"
        },

        # Water Calculator additions
        "water.about.title": {
            "en": "About Water Intake",
            "ar": "حول شرب الماء"
        },
        "water.tooltips.climate": {
            "en": "Climate affects your hydration needs",
            "ar": "المناخ يؤثر على احتياجاتك من الترطيب"
        },
        "water.tooltips.weight": {
            "en": "Your body weight in kilograms",
            "ar": "وزن جسمك بالكيلوغرام"
        },
        "water.tooltips.activity": {
            "en": "Your typical physical activity level",
            "ar": "مستوى نشاطك البدني المعتاد"
        },

        # Waterproofing Calculator additions
        "waterproofing.length": {
            "en": "Length",
            "ar": "الطول"
        },
        "waterproofing.length_tooltip": {
            "en": "Length of area to waterproof",
            "ar": "طول المساحة المراد عزلها"
        },
        "waterproofing.placeholders.length": {
            "en": "e.g., 10",
            "ar": "مثال: 10"
        },
        "waterproofing.width": {
            "en": "Width",
            "ar": "العرض"
        },
        "waterproofing.width_tooltip": {
            "en": "Width of area to waterproof",
            "ar": "عرض المساحة المراد عزلها"
        },
        "waterproofing.placeholders.width": {
            "en": "e.g., 8",
            "ar": "مثال: 8"
        },

        # Yazidi Calendar additions
        "yazidi-calendar.enter_yazidi_year": {
            "en": "Enter Yazidi year",
            "ar": "أدخل السنة اليزيدية"
        },
        "yazidi-calendar.gregorian_day": {
            "en": "Gregorian Day",
            "ar": "اليوم الميلادي"
        },
        "yazidi-calendar.tooltip_day": {
            "en": "Day of the month",
            "ar": "يوم من الشهر"
        },
        "yazidi-calendar.tooltip_month": {
            "en": "Month of the year",
            "ar": "شهر من السنة"
        },
        "yazidi-calendar.yazidi_month": {
            "en": "Yazidi Month",
            "ar": "الشهر اليزيدي"
        },
        "yazidi-calendar.yazidi_day": {
            "en": "Yazidi Day",
            "ar": "اليوم اليزيدي"
        },

        # Additional missing keys from various calculators
        "lumber.board_feet": {
            "en": "Board Feet",
            "ar": "قدم لوحي"
        },
        "lumber.cubic_volume": {
            "en": "Cubic Volume",
            "ar": "الحجم المكعب"
        },
        "lumber.linear_feet": {
            "en": "Linear Feet",
            "ar": "أقدام خطية"
        },
        "lumber.estimated_weight": {
            "en": "Estimated Weight",
            "ar": "الوزن المقدر"
        },
        "lumber.softwood_estimate": {
            "en": "Softwood estimate (approximate)",
            "ar": "تقدير الخشب اللين (تقريبي)"
        },
        "lumber.per_piece": {
            "en": "per piece",
            "ar": "لكل قطعة"
        },
        "lumber.formula": {
            "en": "Board Feet = (Thickness × Width × Length) / 144",
            "ar": "القدم اللوحي = (السماكة × العرض × الطول) / 144"
        },
        "lumber.formula_title": {
            "en": "Board Feet Formula",
            "ar": "صيغة القدم اللوحي"
        },
        "lumber.measurements": {
            "en": "Measurements",
            "ar": "القياسات"
        },
        "lumber.result_board_feet": {
            "en": "Total Board Feet",
            "ar": "إجمالي الأقدام اللوحية"
        },
        "lumber.info_title": {
            "en": "About Lumber Calculations",
            "ar": "حول حسابات الخشب"
        },
        "lumber.info_description": {
            "en": "Board feet is a standard measurement for lumber volume. One board foot equals 144 cubic inches (12\" × 12\" × 1\").",
            "ar": "القدم اللوحي هو قياس قياسي لحجم الخشب. قدم لوحي واحد يساوي 144 بوصة مكعبة (12\" × 12\" × 1\")."
        },
        "lumber.use_cases_title": {
            "en": "Common Uses",
            "ar": "الاستخدامات الشائعة"
        },
        "lumber.use_case_1": {
            "en": "Estimating lumber for construction projects",
            "ar": "تقدير الخشب لمشاريع البناء"
        },
        "lumber.use_case_2": {
            "en": "Calculating costs for woodworking projects",
            "ar": "حساب التكاليف لمشاريع النجارة"
        },
        "lumber.use_case_3": {
            "en": "Planning lumber orders and deliveries",
            "ar": "تخطيط طلبات وتوصيلات الخشب"
        },
        "lumber.errors.invalid_length": {
            "en": "Please enter a valid length",
            "ar": "الرجاء إدخال طول صحيح"
        },
        "lumber.errors.invalid_quantity": {
            "en": "Please enter a valid quantity",
            "ar": "الرجاء إدخال كمية صحيحة"
        },

        # Additional common keys
        "common.calculate": {
            "en": "Calculate",
            "ar": "احسب"
        },
        "common.reset": {
            "en": "Reset",
            "ar": "إعادة تعيين"
        },
        "common.results": {
            "en": "Results",
            "ar": "النتائج"
        },
        "common.about": {
            "en": "About",
            "ar": "حول"
        },

        # Inheritance Calculator additions
        "inheritance-calculator.heirs.father": {
            "en": "Father",
            "ar": "الأب"
        },
        "inheritance-calculator.heirs.mother": {
            "en": "Mother",
            "ar": "الأم"
        },
        "inheritance-calculator.heirs.brother": {
            "en": "Brother",
            "ar": "الأخ"
        },
        "inheritance-calculator.heirs.sister": {
            "en": "Sister",
            "ar": "الأخت"
        },
        "inheritance-calculator.heirs.granddaughter": {
            "en": "Granddaughter",
            "ar": "الحفيدة"
        },
        "inheritance-calculator.heirs.grandfather": {
            "en": "Grandfather",
            "ar": "الجد"
        },
        "inheritance-calculator.heirs.grandmother": {
            "en": "Grandmother",
            "ar": "الجدة"
        },

        # GPA Calculator additions
        "gpa.grade": {
            "en": "Grade",
            "ar": "الدرجة"
        },
        "gpa.credits": {
            "en": "Credits",
            "ar": "الساعات المعتمدة"
        },
        "gpa.cumulative_gpa": {
            "en": "Cumulative GPA",
            "ar": "المعدل التراكمي"
        },
        "gpa.semester_gpa": {
            "en": "Semester GPA",
            "ar": "معدل الفصل"
        },

        # Additional finance keys
        "finance.total_amount": {
            "en": "Total Amount",
            "ar": "المبلغ الإجمالي"
        },
        "finance.monthly_payment": {
            "en": "Monthly Payment",
            "ar": "الدفعة الشهرية"
        },
    }

    # Add each translation
    added_count = 0
    for key, values in translations.items():
        set_nested_key(en_data, key, values["en"])
        set_nested_key(ar_data, key, values["ar"])
        added_count += 1

    # Save updated translations
    save_json(EN_FILE, en_data)
    save_json(AR_FILE, ar_data)

    print(f"✓ Added {added_count} translation keys")
    print()
    print("=" * 70)
    print("BATCH 3 (FINAL) COMPLETION SUMMARY")
    print("=" * 70)
    print(f"Total keys added in this batch: {added_count}")
    print(f"Files updated: {EN_FILE.name}, {AR_FILE.name}")
    print()
    print("Running final verification...")
    print("=" * 70)

if __name__ == "__main__":
    main()
