#!/usr/bin/env python3
"""
Complete Remaining Translations - Batch 2
Adds all remaining ~660 missing translations
"""

import json
import os
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
    print("COMPLETING REMAINING TRANSLATIONS - BATCH 2")
    print("=" * 70)
    print()

    # ALL remaining translations
    translations = {
        # Lumber Calculator
        "lumber.errors.invalid_dimensions": {
            "en": "Please enter valid lumber dimensions",
            "ar": "الرجاء إدخال أبعاد خشب صحيحة"
        },
        "lumber.cm": {
            "en": "cm",
            "ar": "سم"
        },
        "lumber.lumber_size": {
            "en": "Lumber Size",
            "ar": "حجم الخشب"
        },
        "lumber.lumber_size_tooltip": {
            "en": "Standard lumber size or custom dimensions",
            "ar": "حجم الخشب القياسي أو الأبعاد المخصصة"
        },
        "lumber.sizes.2x4": {
            "en": "2x4 (1.5\" × 3.5\")",
            "ar": "2×4 (1.5\" × 3.5\")"
        },
        "lumber.sizes.2x6": {
            "en": "2x6 (1.5\" × 5.5\")",
            "ar": "2×6 (1.5\" × 5.5\")"
        },
        "lumber.sizes.2x8": {
            "en": "2x8 (1.5\" × 7.25\")",
            "ar": "2×8 (1.5\" × 7.25\")"
        },
        "lumber.sizes.2x10": {
            "en": "2x10 (1.5\" × 9.25\")",
            "ar": "2×10 (1.5\" × 9.25\")"
        },
        "lumber.sizes.2x12": {
            "en": "2x12 (1.5\" × 11.25\")",
            "ar": "2×12 (1.5\" × 11.25\")"
        },
        "lumber.sizes.4x4": {
            "en": "4x4 (3.5\" × 3.5\")",
            "ar": "4×4 (3.5\" × 3.5\")"
        },
        "lumber.sizes.4x6": {
            "en": "4x6 (3.5\" × 5.5\")",
            "ar": "4×6 (3.5\" × 5.5\")"
        },
        "lumber.sizes.1x4": {
            "en": "1x4 (0.75\" × 3.5\")",
            "ar": "1×4 (0.75\" × 3.5\")"
        },
        "lumber.sizes.1x6": {
            "en": "1x6 (0.75\" × 5.5\")",
            "ar": "1×6 (0.75\" × 5.5\")"
        },
        "lumber.sizes.1x8": {
            "en": "1x8 (0.75\" × 7.25\")",
            "ar": "1×8 (0.75\" × 7.25\")"
        },
        "lumber.sizes.1x12": {
            "en": "1x12 (0.75\" × 11.25\")",
            "ar": "1×12 (0.75\" × 11.25\")"
        },
        "lumber.sizes.custom": {
            "en": "Custom Size",
            "ar": "حجم مخصص"
        },
        "lumber.custom_thickness": {
            "en": "Thickness",
            "ar": "السماكة"
        },
        "lumber.custom_thickness_tooltip": {
            "en": "Lumber thickness",
            "ar": "سماكة الخشب"
        },
        "lumber.custom_width": {
            "en": "Width",
            "ar": "العرض"
        },
        "lumber.custom_width_tooltip": {
            "en": "Lumber width",
            "ar": "عرض الخشب"
        },
        "lumber.length": {
            "en": "Length",
            "ar": "الطول"
        },
        "lumber.length_tooltip": {
            "en": "Length of each lumber piece",
            "ar": "طول كل قطعة خشب"
        },
        "lumber.quantity": {
            "en": "Quantity",
            "ar": "الكمية"
        },
        "lumber.quantity_tooltip": {
            "en": "Number of lumber pieces",
            "ar": "عدد قطع الخشب"
        },
        "lumber.placeholders.thickness": {
            "en": "e.g., 2",
            "ar": "مثال: 2"
        },
        "lumber.placeholders.width": {
            "en": "e.g., 4",
            "ar": "مثال: 4"
        },
        "lumber.placeholders.length": {
            "en": "e.g., 8",
            "ar": "مثال: 8"
        },
        "lumber.placeholders.quantity": {
            "en": "e.g., 10",
            "ar": "مثال: 10"
        },
        "lumber.meters": {
            "en": "Meters",
            "ar": "متر"
        },

        # Water Intake Calculator
        "protein.inputs.very_active": {
            "en": "Very Active (intense exercise 6-7 days/week)",
            "ar": "نشط جدًا (تمارين مكثفة 6-7 أيام/أسبوع)"
        },
        "water.inputs.climate_cold": {
            "en": "Cold Climate",
            "ar": "مناخ بارد"
        },
        "water.inputs.climate_moderate": {
            "en": "Moderate Climate",
            "ar": "مناخ معتدل"
        },
        "water.inputs.climate_hot": {
            "en": "Hot Climate",
            "ar": "مناخ حار"
        },
        "water.inputs.climate_very_hot": {
            "en": "Very Hot Climate",
            "ar": "مناخ حار جدًا"
        },

        # Waterproofing Calculator
        "waterproofing.errors.invalid_dimensions": {
            "en": "Please enter valid dimensions",
            "ar": "الرجاء إدخال أبعاد صحيحة"
        },
        "waterproofing.errors.invalid_overlap": {
            "en": "Overlap percentage must be between 0 and 50",
            "ar": "يجب أن تكون نسبة التداخل بين 0 و 50"
        },
        "waterproofing.membrane_type": {
            "en": "Membrane Type",
            "ar": "نوع الغشاء"
        },
        "waterproofing.membrane_type_tooltip": {
            "en": "Type of waterproofing membrane",
            "ar": "نوع غشاء العزل المائي"
        },
        "waterproofing.types.pvc": {
            "en": "PVC Membrane",
            "ar": "غشاء PVC"
        },
        "waterproofing.types.tpo": {
            "en": "TPO Membrane",
            "ar": "غشاء TPO"
        },
        "waterproofing.types.epdm": {
            "en": "EPDM Rubber",
            "ar": "مطاط EPDM"
        },
        "waterproofing.types.bitumen": {
            "en": "Bitumen Sheet",
            "ar": "صفائح البيتومين"
        },
        "waterproofing.types.liquid": {
            "en": "Liquid Membrane",
            "ar": "غشاء سائل"
        },
        "waterproofing.area": {
            "en": "Area to Waterproof",
            "ar": "المساحة للعزل"
        },
        "waterproofing.area_tooltip": {
            "en": "Total area that needs waterproofing",
            "ar": "إجمالي المساحة التي تحتاج للعزل"
        },
        "waterproofing.overlap": {
            "en": "Overlap Percentage",
            "ar": "نسبة التداخل"
        },
        "waterproofing.overlap_tooltip": {
            "en": "Percentage of overlap between membrane sheets",
            "ar": "نسبة التداخل بين صفائح الغشاء"
        },
        "waterproofing.result.membrane_area": {
            "en": "Membrane Needed",
            "ar": "الغشاء المطلوب"
        },
        "waterproofing.result.rolls": {
            "en": "Number of Rolls",
            "ar": "عدد اللفات"
        },
        "waterproofing.result.primer": {
            "en": "Primer Needed",
            "ar": "البرايمر المطلوب"
        },
        "waterproofing.result.adhesive": {
            "en": "Adhesive Needed",
            "ar": "المادة اللاصقة المطلوبة"
        },
        "waterproofing.sqm": {
            "en": "m²",
            "ar": "م²"
        },
        "waterproofing.liters": {
            "en": "liters",
            "ar": "لتر"
        },

        # Joint Compound Calculator
        "jointCompound.errors.invalid_input": {
            "en": "Please enter valid measurements",
            "ar": "الرجاء إدخال قياسات صحيحة"
        },
        "jointCompound.errors.invalid_coats": {
            "en": "Number of coats must be between 1 and 5",
            "ar": "يجب أن يكون عدد الطبقات بين 1 و 5"
        },
        "jointCompound.meters": {
            "en": "Meters",
            "ar": "متر"
        },
        "jointCompound.feet": {
            "en": "Feet",
            "ar": "قدم"
        },
        "jointCompound.number_of_sheets": {
            "en": "Number of Drywall Sheets",
            "ar": "عدد ألواح الجبس"
        },
        "jointCompound.number_of_sheets_tooltip": {
            "en": "Total number of drywall sheets to tape",
            "ar": "إجمالي عدد ألواح الجبس للتسجيل"
        },
        "jointCompound.placeholders.sheets": {
            "en": "e.g., 20",
            "ar": "مثال: 20"
        },
        "jointCompound.joint_length": {
            "en": "Total Joint Length",
            "ar": "طول المفاصل الإجمالي"
        },
        "jointCompound.joint_length_tooltip": {
            "en": "Total length of joints to tape and mud",
            "ar": "الطول الإجمالي للمفاصل للتسجيل والتلبيس"
        },
        "jointCompound.placeholders.length": {
            "en": "e.g., 100",
            "ar": "مثال: 100"
        },
        "jointCompound.number_of_coats": {
            "en": "Number of Coats",
            "ar": "عدد الطبقات"
        },
        "jointCompound.number_of_coats_tooltip": {
            "en": "Typically 3 coats: tape, fill, and finish",
            "ar": "عادة 3 طبقات: شريط، تعبئة، وتشطيب"
        },
        "jointCompound.placeholders.coats": {
            "en": "e.g., 3",
            "ar": "مثال: 3"
        },
        "jointCompound.result.compound_needed": {
            "en": "Joint Compound Needed",
            "ar": "معجون المفاصل المطلوب"
        },
        "jointCompound.result.tape_needed": {
            "en": "Tape Needed",
            "ar": "الشريط المطلوب"
        },
        "jointCompound.result.buckets": {
            "en": "Buckets (5 gal)",
            "ar": "سطول (5 جالون)"
        },
        "jointCompound.result.kg": {
            "en": "kg",
            "ar": "كجم"
        },

        # Yazidi Calendar
        "yazidi-calendar.error_yazidi_month_range": {
            "en": "Yazidi month must be between 1 and 12",
            "ar": "يجب أن يكون الشهر اليزيدي بين 1 و 12"
        },
        "yazidi-calendar.error_yazidi_day_range": {
            "en": "Day must be valid for the selected Yazidi month",
            "ar": "يجب أن يكون اليوم صحيحًا للشهر اليزيدي المحدد"
        },
        "yazidi-calendar.input_title": {
            "en": "Enter Date",
            "ar": "أدخل التاريخ"
        },
        "yazidi-calendar.tooltip_gregorian_year": {
            "en": "Gregorian calendar year (CE)",
            "ar": "سنة التقويم الميلادي"
        },
        "yazidi-calendar.enter_year": {
            "en": "Enter year",
            "ar": "أدخل السنة"
        },
        "yazidi-calendar.tooltip_gregorian_month": {
            "en": "Month in the Gregorian calendar",
            "ar": "الشهر في التقويم الميلادي"
        },
        "yazidi-calendar.enter_month": {
            "en": "Select month",
            "ar": "اختر الشهر"
        },
        "yazidi-calendar.tooltip_gregorian_day": {
            "en": "Day of the month",
            "ar": "يوم من الشهر"
        },
        "yazidi-calendar.enter_day": {
            "en": "Enter day",
            "ar": "أدخل اليوم"
        },
        "yazidi-calendar.tooltip_yazidi_year": {
            "en": "Year in the Yazidi calendar",
            "ar": "السنة في التقويم اليزيدي"
        },
        "yazidi-calendar.tooltip_yazidi_month": {
            "en": "Month in the Yazidi calendar",
            "ar": "الشهر في التقويم اليزيدي"
        },
        "yazidi-calendar.tooltip_yazidi_day": {
            "en": "Day in the Yazidi calendar",
            "ar": "اليوم في التقويم اليزيدي"
        },

        # Foundation Calculator
        "foundation.placeholders.building_area": {
            "en": "e.g., 100",
            "ar": "مثال: 100"
        },
        "foundation.inputs.number_of_floors": {
            "en": "Number of Floors",
            "ar": "عدد الطوابق"
        },
        "foundation.inputs.number_of_floors_tooltip": {
            "en": "Total number of floors above ground",
            "ar": "إجمالي عدد الطوابق فوق الأرض"
        },
        "foundation.placeholders.number_of_floors": {
            "en": "e.g., 2",
            "ar": "مثال: 2"
        },
        "foundation.soil_types.soft_clay": {
            "en": "Soft Clay",
            "ar": "طين لين"
        },
        "foundation.soil_types.stiff_clay": {
            "en": "Stiff Clay",
            "ar": "طين صلب"
        },
        "foundation.soil_types.loose_sand": {
            "en": "Loose Sand",
            "ar": "رمل فضفاض"
        },
        "foundation.soil_types.dense_sand": {
            "en": "Dense Sand",
            "ar": "رمل مضغوط"
        },
        "foundation.soil_types.gravel": {
            "en": "Gravel",
            "ar": "حصى"
        },
        "foundation.soil_types.rock": {
            "en": "Rock",
            "ar": "صخر"
        },

        # Reptile Tank Calculator
        "reptile-tank-calculator.substrate_iguana": {
            "en": "Cypress mulch, coconut fiber, or organic topsoil",
            "ar": "نشارة السرو، أو ألياف جوز الهند، أو تربة عضوية"
        },
        "reptile-tank-calculator.reptile_bearded_dragon": {
            "en": "Bearded Dragon",
            "ar": "التنين الملتحي"
        },
        "reptile-tank-calculator.reptile_gecko": {
            "en": "Leopard Gecko",
            "ar": "وزغ النمر"
        },
        "reptile-tank-calculator.reptile_snake": {
            "en": "Snake (Ball Python/Corn Snake)",
            "ar": "ثعبان (كروي/ذرة)"
        },
        "reptile-tank-calculator.reptile_tortoise": {
            "en": "Tortoise",
            "ar": "سلحفاة"
        },
        "reptile-tank-calculator.reptile_iguana": {
            "en": "Iguana",
            "ar": "إغوانا"
        },
        "reptile-tank-calculator.length": {
            "en": "Reptile Length",
            "ar": "طول الزاحف"
        },
        "reptile-tank-calculator.length_tooltip": {
            "en": "Adult length of your reptile (from nose to tail)",
            "ar": "طول الزاحف البالغ (من الأنف إلى الذيل)"
        },
        "reptile-tank-calculator.placeholders.length": {
            "en": "e.g., 20",
            "ar": "مثال: 20"
        },
        "reptile-tank-calculator.unit": {
            "en": "Unit",
            "ar": "الوحدة"
        },
        "reptile-tank-calculator.unit_tooltip": {
            "en": "Measurement unit for length",
            "ar": "وحدة قياس الطول"
        },
        "reptile-tank-calculator.inches": {
            "en": "Inches",
            "ar": "بوصة"
        },
        "reptile-tank-calculator.cm": {
            "en": "Centimeters",
            "ar": "سنتيمتر"
        },

        # Half Life Calculator
        "half_life.errors.enter_initial_amount": {
            "en": "Please enter initial amount",
            "ar": "الرجاء إدخال الكمية الأولية"
        },
        "half_life.errors.initial_amount_positive": {
            "en": "Initial amount must be positive",
            "ar": "يجب أن تكون الكمية الأولية موجبة"
        },
        "half_life.errors.enter_half_life": {
            "en": "Please enter half-life",
            "ar": "الرجاء إدخال نصف العمر"
        },
        "half_life.errors.half_life_positive": {
            "en": "Half-life must be positive",
            "ar": "يجب أن يكون نصف العمر موجبًا"
        },
        "half_life.errors.enter_elapsed_time": {
            "en": "Please enter elapsed time",
            "ar": "الرجاء إدخال الوقت المنقضي"
        },
        "half_life.errors.elapsed_time_positive": {
            "en": "Elapsed time must be positive",
            "ar": "يجب أن يكون الوقت المنقضي موجبًا"
        },
        "half_life.initial_amount": {
            "en": "Initial Amount",
            "ar": "الكمية الأولية"
        },
        "half_life.initial_amount_tooltip": {
            "en": "Starting amount of substance",
            "ar": "كمية المادة الأولية"
        },
        "half_life.placeholders.initial_amount": {
            "en": "e.g., 100",
            "ar": "مثال: 100"
        },
        "half_life.half_life_value": {
            "en": "Half-Life",
            "ar": "نصف العمر"
        },
        "half_life.half_life_tooltip": {
            "en": "Time it takes for substance to decay to half",
            "ar": "الوقت الذي تستغرقه المادة للتحلل إلى النصف"
        },
        "half_life.placeholders.half_life": {
            "en": "e.g., 5730 (Carbon-14)",
            "ar": "مثال: 5730 (كربون-14)"
        },
        "half_life.elapsed_time": {
            "en": "Elapsed Time",
            "ar": "الوقت المنقضي"
        },
        "half_life.elapsed_time_tooltip": {
            "en": "Time that has passed",
            "ar": "الوقت الذي مضى"
        },
        "half_life.placeholders.elapsed_time": {
            "en": "e.g., 11460",
            "ar": "مثال: 11460"
        },
        "half_life.time_unit": {
            "en": "Time Unit",
            "ar": "وحدة الوقت"
        },
        "half_life.time_unit_tooltip": {
            "en": "Unit of time for half-life and elapsed time",
            "ar": "وحدة الوقت لنصف العمر والوقت المنقضي"
        },
        "half_life.seconds": {
            "en": "Seconds",
            "ar": "ثواني"
        },
        "half_life.minutes": {
            "en": "Minutes",
            "ar": "دقائق"
        },
        "half_life.hours": {
            "en": "Hours",
            "ar": "ساعات"
        },
        "half_life.days": {
            "en": "Days",
            "ar": "أيام"
        },
        "half_life.years": {
            "en": "Years",
            "ar": "سنوات"
        },

        # Timezone Converter
        "timezone_converter.timezone_utc": {
            "en": "UTC (Coordinated Universal Time)",
            "ar": "التوقيت العالمي المنسق (UTC)"
        },
        "timezone_converter.timezone_eastern": {
            "en": "Eastern Time (ET)",
            "ar": "التوقيت الشرقي (ET)"
        },
        "timezone_converter.timezone_central": {
            "en": "Central Time (CT)",
            "ar": "التوقيت المركزي (CT)"
        },
        "timezone_converter.timezone_mountain": {
            "en": "Mountain Time (MT)",
            "ar": "التوقيت الجبلي (MT)"
        },
        "timezone_converter.timezone_pacific": {
            "en": "Pacific Time (PT)",
            "ar": "توقيت المحيط الهادئ (PT)"
        },
        "timezone_converter.timezone_alaska": {
            "en": "Alaska Time (AKT)",
            "ar": "توقيت ألاسكا (AKT)"
        },
        "timezone_converter.timezone_hawaii": {
            "en": "Hawaii Time (HST)",
            "ar": "توقيت هاواي (HST)"
        },
        "timezone_converter.timezone_london": {
            "en": "London (GMT/BST)",
            "ar": "لندن (GMT/BST)"
        },
        "timezone_converter.timezone_paris": {
            "en": "Paris (CET)",
            "ar": "باريس (CET)"
        },
        "timezone_converter.timezone_dubai": {
            "en": "Dubai (GST)",
            "ar": "دبي (GST)"
        },
        "timezone_converter.timezone_tokyo": {
            "en": "Tokyo (JST)",
            "ar": "طوكيو (JST)"
        },
        "timezone_converter.timezone_sydney": {
            "en": "Sydney (AEDT)",
            "ar": "سيدني (AEDT)"
        },
        "timezone_converter.from_timezone": {
            "en": "From Timezone",
            "ar": "من المنطقة الزمنية"
        },
        "timezone_converter.to_timezone": {
            "en": "To Timezone",
            "ar": "إلى المنطقة الزمنية"
        },
        "timezone_converter.time": {
            "en": "Time",
            "ar": "الوقت"
        },
        "timezone_converter.date": {
            "en": "Date",
            "ar": "التاريخ"
        },
        "timezone_converter.result_time": {
            "en": "Converted Time",
            "ar": "الوقت المحول"
        },

        # Bar/Bat Mitzvah Calculator
        "bar_bat_mitzvah_calculator.planning_description": {
            "en": "Important planning tips for your celebration",
            "ar": "نصائح تخطيط مهمة لاحتفالك"
        },
        "bar_bat_mitzvah_calculator.error_calculation": {
            "en": "Error calculating celebration date",
            "ar": "خطأ في حساب تاريخ الاحتفال"
        },
        "bar_bat_mitzvah_calculator.input_title": {
            "en": "Enter Information",
            "ar": "أدخل المعلومات"
        },
        "bar_bat_mitzvah_calculator.birth_date": {
            "en": "Birth Date",
            "ar": "تاريخ الميلاد"
        },
        "bar_bat_mitzvah_calculator.birth_date_tooltip": {
            "en": "Child's date of birth in Gregorian calendar",
            "ar": "تاريخ ميلاد الطفل في التقويم الميلادي"
        },
        "bar_bat_mitzvah_calculator.gender_tooltip": {
            "en": "Bar Mitzvah is at 13 for boys, Bat Mitzvah at 12 for girls",
            "ar": "البار متسفا في سن 13 للأولاد، البات متسفا في سن 12 للبنات"
        },
        "bar_bat_mitzvah_calculator.time_until": {
            "en": "Time Until Celebration",
            "ar": "الوقت حتى الاحتفال"
        },

        # Ceiling Calculator
        "ceiling.errors.invalid_tile_size": {
            "en": "Please select a valid tile size",
            "ar": "الرجاء اختيار حجم بلاط صحيح"
        },
        "ceiling.placeholders.length": {
            "en": "e.g., 5",
            "ar": "مثال: 5"
        },
        "ceiling.placeholders.width": {
            "en": "e.g., 4",
            "ar": "مثال: 4"
        },
        "ceiling.sizes.600x600": {
            "en": "600x600 mm (24\"x24\")",
            "ar": "600×600 مم (24\"×24\")"
        },
        "ceiling.sizes.600x1200": {
            "en": "600x1200 mm (24\"x48\")",
            "ar": "600×1200 مم (24\"×48\")"
        },
        "ceiling.sizes.595x595": {
            "en": "595x595 mm (23.5\"x23.5\")",
            "ar": "595×595 مم (23.5\"×23.5\")"
        },
        "ceiling.sizes.300x300": {
            "en": "300x300 mm (12\"x12\")",
            "ar": "300×300 مم (12\"×12\")"
        },
        "ceiling.tile_size": {
            "en": "Ceiling Tile Size",
            "ar": "حجم بلاط السقف"
        },
        "ceiling.tile_size_tooltip": {
            "en": "Standard ceiling tile dimensions",
            "ar": "أبعاد بلاط السقف القياسية"
        },
        "ceiling.room_length": {
            "en": "Room Length",
            "ar": "طول الغرفة"
        },
        "ceiling.room_width": {
            "en": "Room Width",
            "ar": "عرض الغرفة"
        },
        "ceiling.result.tiles_needed": {
            "en": "Tiles Needed",
            "ar": "عدد البلاطات المطلوبة"
        },
        "ceiling.result.grid_length": {
            "en": "Grid Rails Needed",
            "ar": "قضبان الشبكة المطلوبة"
        },

        # Drywall Calculator
        "drywall.errors.invalid_dimensions": {
            "en": "Please enter valid wall dimensions",
            "ar": "الرجاء إدخال أبعاد جدار صحيحة"
        },
        "drywall.sizes.4x14": {
            "en": "4x14 ft (1.22 x 4.27 m)",
            "ar": "4×14 قدم (1.22 × 4.27 م)"
        },
        "drywall.thickness": {
            "en": "Sheet Thickness",
            "ar": "سماكة اللوح"
        },
        "drywall.thickness_tooltip": {
            "en": "Thickness of drywall sheets",
            "ar": "سماكة ألواح الجبس"
        },
        "drywall.thickness_options.quarter": {
            "en": "1/4 inch (6.4 mm)",
            "ar": "1/4 بوصة (6.4 مم)"
        },
        "drywall.thickness_options.three_eighth": {
            "en": "3/8 inch (9.5 mm)",
            "ar": "3/8 بوصة (9.5 مم)"
        },
        "drywall.thickness_options.half": {
            "en": "1/2 inch (12.7 mm)",
            "ar": "1/2 بوصة (12.7 مم)"
        },
        "drywall.thickness_options.five_eighth": {
            "en": "5/8 inch (15.9 mm)",
            "ar": "5/8 بوصة (15.9 مم)"
        },
        "drywall.result.sheets_needed": {
            "en": "Drywall Sheets Needed",
            "ar": "عدد ألواح الجبس المطلوبة"
        },
        "drywall.result.screws": {
            "en": "Screws Needed (approx)",
            "ar": "عدد البراغي المطلوبة (تقريبًا)"
        },

        # Flooring Calculator
        "flooring.types.engineered": {
            "en": "Engineered Hardwood",
            "ar": "خشب صلب مصنّع"
        },
        "flooring.errors.invalid_coverage": {
            "en": "Coverage per box must be greater than 0",
            "ar": "يجب أن تكون التغطية لكل صندوق أكبر من 0"
        },
        "flooring.placeholders.length": {
            "en": "e.g., 5",
            "ar": "مثال: 5"
        },
        "flooring.placeholders.width": {
            "en": "e.g., 4",
            "ar": "مثال: 4"
        },
        "flooring.coverage_per_box": {
            "en": "Coverage per Box",
            "ar": "التغطية لكل صندوق"
        },
        "flooring.coverage_per_box_tooltip": {
            "en": "Square footage covered by one box of flooring",
            "ar": "المساحة التي يغطيها صندوق واحد من الأرضيات"
        },
        "flooring.placeholders.coverage": {
            "en": "e.g., 20",
            "ar": "مثال: 20"
        },
        "flooring.result.boxes_needed": {
            "en": "Boxes Needed",
            "ar": "عدد الصناديق المطلوبة"
        },
        "flooring.result.total_sqft": {
            "en": "Total Coverage",
            "ar": "التغطية الإجمالية"
        },

        # Shingle Calculator
        "shingle.errors.invalid_coverage": {
            "en": "Coverage per bundle must be greater than 0",
            "ar": "يجب أن تكون التغطية لكل حزمة أكبر من 0"
        },
        "shingle.coverage_per_bundle": {
            "en": "Coverage per Bundle",
            "ar": "التغطية لكل حزمة"
        },
        "shingle.coverage_per_bundle_tooltip": {
            "en": "Square footage covered by one bundle of shingles",
            "ar": "المساحة التي تغطيها حزمة واحدة من القرميد"
        },
        "shingle.placeholders.coverage": {
            "en": "e.g., 33.3",
            "ar": "مثال: 33.3"
        },
        "shingle.sqft_short": {
            "en": "sq ft",
            "ar": "قدم²"
        },
        "shingle.roof_area": {
            "en": "Roof Area",
            "ar": "مساحة السقف"
        },
        "shingle.roof_area_tooltip": {
            "en": "Total area of the roof to be shingled",
            "ar": "إجمالي مساحة السقف المراد تغطيته بالقرميد"
        },
        "shingle.placeholders.area": {
            "en": "e.g., 1500",
            "ar": "مثال: 1500"
        },
        "shingle.result.bundles_needed": {
            "en": "Bundles Needed",
            "ar": "عدد الحزم المطلوبة"
        },
        "shingle.result.squares": {
            "en": "Roof Squares",
            "ar": "مربعات السقف"
        },

        # Date Format Converter
        "date_format_converter.format_iso_8601": {
            "en": "ISO 8601 (YYYY-MM-DD)",
            "ar": "ISO 8601 (سنة-شهر-يوم)"
        },
        "date_format_converter.format_rfc_2822": {
            "en": "RFC 2822 (Day, DD Mon YYYY)",
            "ar": "RFC 2822 (يوم، DD شهر سنة)"
        },
        "date_format_converter.format_us": {
            "en": "US Format (MM/DD/YYYY)",
            "ar": "صيغة أمريكية (شهر/يوم/سنة)"
        },
        "date_format_converter.format_european": {
            "en": "European Format (DD/MM/YYYY)",
            "ar": "صيغة أوروبية (يوم/شهر/سنة)"
        },
        "date_format_converter.format_iso_short": {
            "en": "ISO Short (YYYYMMDD)",
            "ar": "ISO مختصر (سنةشهريوم)"
        },
        "date_format_converter.format_long": {
            "en": "Long Format",
            "ar": "صيغة طويلة"
        },
        "date_format_converter.format_medium": {
            "en": "Medium Format",
            "ar": "صيغة متوسطة"
        },
        "date_format_converter.format_short": {
            "en": "Short Format",
            "ar": "صيغة قصيرة"
        },
        "date_format_converter.input_date": {
            "en": "Input Date",
            "ar": "أدخل التاريخ"
        },
        "date_format_converter.output_format": {
            "en": "Output Format",
            "ar": "صيغة الإخراج"
        },
        "date_format_converter.converted_date": {
            "en": "Converted Date",
            "ar": "التاريخ المحول"
        },

        # Day of Week Calculator
        "day_of_week_calculator.error_empty": {
            "en": "Please enter a date",
            "ar": "الرجاء إدخال تاريخ"
        },
        "day_of_week_calculator.error_invalid": {
            "en": "Please enter a valid date",
            "ar": "الرجاء إدخال تاريخ صحيح"
        },
        "day_of_week_calculator.sunday": {
            "en": "Sunday",
            "ar": "الأحد"
        },
        "day_of_week_calculator.monday": {
            "en": "Monday",
            "ar": "الاثنين"
        },
        "day_of_week_calculator.tuesday": {
            "en": "Tuesday",
            "ar": "الثلاثاء"
        },
        "day_of_week_calculator.wednesday": {
            "en": "Wednesday",
            "ar": "الأربعاء"
        },
        "day_of_week_calculator.thursday": {
            "en": "Thursday",
            "ar": "الخميس"
        },
        "day_of_week_calculator.friday": {
            "en": "Friday",
            "ar": "الجمعة"
        },
        "day_of_week_calculator.saturday": {
            "en": "Saturday",
            "ar": "السبت"
        },
        "day_of_week_calculator.input_date": {
            "en": "Enter Date",
            "ar": "أدخل التاريخ"
        },
        "day_of_week_calculator.result_day": {
            "en": "Day of Week",
            "ar": "يوم الأسبوع"
        },

        # Unix Timestamp Converter
        "unix_timestamp_converter.error_invalid_timestamp": {
            "en": "Please enter a valid Unix timestamp",
            "ar": "الرجاء إدخال طابع زمني يونكس صحيح"
        },
        "unix_timestamp_converter.error_empty_date": {
            "en": "Please enter a date",
            "ar": "الرجاء إدخال تاريخ"
        },
        "unix_timestamp_converter.error_invalid_date": {
            "en": "Please enter a valid date",
            "ar": "الرجاء إدخال تاريخ صحيح"
        },
        "unix_timestamp_converter.timestamp_to_date": {
            "en": "Timestamp to Date",
            "ar": "الطابع الزمني إلى تاريخ"
        },
        "unix_timestamp_converter.date_to_timestamp": {
            "en": "Date to Timestamp",
            "ar": "التاريخ إلى طابع زمني"
        },
        "unix_timestamp_converter.unix_timestamp": {
            "en": "Unix Timestamp",
            "ar": "طابع زمني يونكس"
        },
        "unix_timestamp_converter.placeholder_timestamp": {
            "en": "e.g., 1609459200",
            "ar": "مثال: 1609459200"
        },
        "unix_timestamp_converter.datetime": {
            "en": "Date & Time",
            "ar": "التاريخ والوقت"
        },
        "unix_timestamp_converter.result_date": {
            "en": "Converted Date",
            "ar": "التاريخ المحول"
        },
        "unix_timestamp_converter.result_timestamp": {
            "en": "Unix Timestamp",
            "ar": "الطابع الزمني"
        },

        # Hebrew to Gregorian
        "hebrew-to-gregorian.year_tooltip": {
            "en": "Hebrew year (e.g., 5784)",
            "ar": "السنة العبرية (مثال: 5784)"
        },
        "hebrew-to-gregorian.month_tooltip": {
            "en": "Hebrew month (1-12 or 13 in leap years)",
            "ar": "الشهر العبري (1-12 أو 13 في السنوات الكبيسة)"
        },
        "hebrew-to-gregorian.day_tooltip": {
            "en": "Day of the Hebrew month (1-30)",
            "ar": "يوم من الشهر العبري (1-30)"
        },
        "hebrew-to-gregorian.creation_year": {
            "en": "Year from Creation",
            "ar": "سنة من الخليقة"
        },
        "hebrew-to-gregorian.months_structure": {
            "en": "The Hebrew calendar has 12 or 13 months depending on the year",
            "ar": "التقويم العبري له 12 أو 13 شهرًا حسب السنة"
        },
        "hebrew-to-gregorian.leap_year": {
            "en": "Leap Year (13 months)",
            "ar": "سنة كبيسة (13 شهرًا)"
        },
        "hebrew-to-gregorian.regular_year": {
            "en": "Regular Year (12 months)",
            "ar": "سنة عادية (12 شهرًا)"
        },

        # GPA Calculator additions
        "gpa.errors.invalid_credits": {
            "en": "Please enter valid credit hours",
            "ar": "الرجاء إدخال ساعات معتمدة صحيحة"
        },
        "gpa.errors.invalid_current_credits": {
            "en": "Current credit hours must be 0 or greater",
            "ar": "يجب أن تكون الساعات المعتمدة الحالية 0 أو أكثر"
        },
        "gpa.grading_scale": {
            "en": "Grading Scale",
            "ar": "مقياس الدرجات"
        },
        "gpa.courses": {
            "en": "Courses",
            "ar": "المواد الدراسية"
        },
        "gpa.course": {
            "en": "Course",
            "ar": "المادة"
        },
        "gpa.add_course": {
            "en": "Add Course",
            "ar": "إضافة مادة"
        },
        "gpa.remove_course": {
            "en": "Remove",
            "ar": "إزالة"
        },
        "gpa.current_gpa": {
            "en": "Current GPA",
            "ar": "المعدل الحالي"
        },
        "gpa.current_credits": {
            "en": "Current Credits",
            "ar": "الساعات المعتمدة الحالية"
        },

        # Training Age Calculator additions
        "training_age.consistency_levels.low": {
            "en": "Low (< 50% sessions completed)",
            "ar": "منخفض (< 50٪ من الجلسات أُكملت)"
        },
        "training_age.consistency_levels.moderate": {
            "en": "Moderate (50-80% sessions completed)",
            "ar": "متوسط (50-80٪ من الجلسات أُكملت)"
        },
        "training_age.consistency_levels.high": {
            "en": "High (> 80% sessions completed)",
            "ar": "عالي (> 80٪ من الجلسات أُكملت)"
        },
        "training_age.consistency": {
            "en": "Training Consistency",
            "ar": "انتظام التدريب"
        },
        "training_age.consistency_tooltip": {
            "en": "How consistently you have maintained your training over the years",
            "ar": "مدى انتظامك في الحفاظ على تدريبك على مر السنين"
        },
        "training_age.start_date": {
            "en": "Training Start Date",
            "ar": "تاريخ بدء التدريب"
        },
        "training_age.start_date_tooltip": {
            "en": "When you first started consistent training",
            "ar": "متى بدأت التدريب المنتظم لأول مرة"
        },
        "training_age.result_years": {
            "en": "Training Age",
            "ar": "عمر التدريب"
        },
        "training_age.result_effective_years": {
            "en": "Effective Training Years",
            "ar": "سنوات التدريب الفعلية"
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
    print("BATCH 2 COMPLETION SUMMARY")
    print("=" * 70)
    print(f"Total keys added in this batch: {added_count}")
    print(f"Files updated: {EN_FILE.name}, {AR_FILE.name}")
    print()
    print("Run verification to check final coverage")
    print("=" * 70)

if __name__ == "__main__":
    main()
