#!/usr/bin/env python3
"""
Manually add remaining translations for calculators that were skipped
This includes proper, meaningful translations based on component analysis
"""

import json
from pathlib import Path

BASE_DIR = Path("/Users/raedtayyem/Desktop/work/alathasiba-claudecode")

def load_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write('\n')

# Comprehensive translations for remaining calculators
TRANSLATIONS = {
    'door': {
        'ns': ['calc', 'construction'],
        'en': {
            'errors': {
                'invalid_dimensions': 'Please enter valid dimensions',
                'positive_values': 'All values must be positive numbers'
            },
            'title': 'Door Calculator',
            'description': 'Calculate door rough opening sizes and material requirements',
            'opening_width': 'Opening Width',
            'opening_height': 'Opening Height',
            'door_type': 'Door Type',
            'single': 'Single Door',
            'double': 'Double Door',
            'sliding': 'Sliding Door',
            'units': 'Units',
            'inches': 'Inches',
            'feet': 'Feet',
            'results_title': 'Door Specifications',
            'rough_opening': 'Rough Opening Size',
            'door_width': 'Door Width',
            'door_height': 'Door Height',
            'frame_material': 'Frame Material Needed',
            'linear_feet': 'Linear Feet',
            'jamb_width': 'Jamb Width',
            'header_height': 'Header Height',
            'installation_tips': 'Installation Tips',
            'tip_1': 'Add 2 inches to width and height for rough opening',
            'tip_2': 'Ensure level and plumb installation',
            'tip_3': 'Account for door swing clearance'
        },
        'ar': {
            'errors': {
                'invalid_dimensions': 'الرجاء إدخال أبعاد صالحة',
                'positive_values': 'يجب أن تكون جميع القيم أرقاماً موجبة'
            },
            'title': 'حاسبة الأبواب',
            'description': 'احسب أحجام فتحات الأبواب ومتطلبات المواد',
            'opening_width': 'عرض الفتحة',
            'opening_height': 'ارتفاع الفتحة',
            'door_type': 'نوع الباب',
            'single': 'باب مفرد',
            'double': 'باب مزدوج',
            'sliding': 'باب منزلق',
            'units': 'الوحدات',
            'inches': 'بوصة',
            'feet': 'قدم',
            'results_title': 'مواصفات الباب',
            'rough_opening': 'حجم الفتحة الخام',
            'door_width': 'عرض الباب',
            'door_height': 'ارتفاع الباب',
            'frame_material': 'مادة الإطار المطلوبة',
            'linear_feet': 'قدم خطي',
            'jamb_width': 'عرض العتبة',
            'header_height': 'ارتفاع الرأس',
            'installation_tips': 'نصائح التركيب',
            'tip_1': 'أضف 2 بوصة للعرض والارتفاع للفتحة الخام',
            'tip_2': 'تأكد من التركيب المستوي والعمودي',
            'tip_3': 'احسب مساحة تأرجح الباب'
        }
    },
    'drywall': {
        'ns': ['calc', 'construction'],
        'en': {
            'title': 'Drywall Calculator',
            'description': 'Calculate drywall sheets, joint compound, and screws needed for your project',
            'room_width': 'Room Width',
            'room_length': 'Room Length',
            'ceiling_height': 'Ceiling Height',
            'include_ceiling': 'Include Ceiling',
            'door_count': 'Number of Doors',
            'window_count': 'Number of Windows',
            'sheet_size': 'Drywall Sheet Size',
            'size_4x8': '4\' x 8\'',
            'size_4x12': '4\' x 12\'',
            'results_title': 'Material Requirements',
            'total_area': 'Total Wall Area',
            'sheets_needed': 'Drywall Sheets Needed',
            'joint_compound': 'Joint Compound',
            'buckets': 'Buckets',
            'screws_needed': 'Screws Needed',
            'tape_needed': 'Tape Needed',
            'linear_feet': 'Linear Feet',
            'waste_factor': 'Includes 10% waste factor',
            'cost_estimate': 'Estimated Cost'
        },
        'ar': {
            'title': 'حاسبة الجبس',
            'description': 'احسب ألواح الجبس ومركب المفاصل والبراغي المطلوبة لمشروعك',
            'room_width': 'عرض الغرفة',
            'room_length': 'طول الغرفة',
            'ceiling_height': 'ارتفاع السقف',
            'include_ceiling': 'تضمين السقف',
            'door_count': 'عدد الأبواب',
            'window_count': 'عدد النوافذ',
            'sheet_size': 'حجم لوح الجبس',
            'size_4x8': '4\' × 8\'',
            'size_4x12': '4\' × 12\'',
            'results_title': 'متطلبات المواد',
            'total_area': 'إجمالي مساحة الجدار',
            'sheets_needed': 'ألواح الجبس المطلوبة',
            'joint_compound': 'مركب المفاصل',
            'buckets': 'دلاء',
            'screws_needed': 'البراغي المطلوبة',
            'tape_needed': 'الشريط المطلوب',
            'linear_feet': 'قدم خطي',
            'waste_factor': 'يتضمن 10% عامل الهدر',
            'cost_estimate': 'التكلفة المقدرة'
        }
    },
    'ebay_fees': {
        'ns': ['calc', 'business'],
        'en': {
            'title': 'eBay Fees Calculator',
            'description': 'Calculate eBay selling fees, PayPal fees, and final profit',
            'item_price': 'Item Sale Price',
            'item_cost': 'Item Cost',
            'shipping_charged': 'Shipping Charged to Buyer',
            'shipping_cost': 'Actual Shipping Cost',
            'category': 'Item Category',
            'listing_type': 'Listing Type',
            'auction': 'Auction',
            'fixed_price': 'Buy It Now',
            'store_subscription': 'eBay Store Subscription',
            'no_store': 'No Store',
            'basic_store': 'Basic Store',
            'premium_store': 'Premium Store',
            'results_title': 'Fee Breakdown',
            'total_fees': 'Total eBay Fees',
            'insertion_fee': 'Insertion Fee',
            'final_value_fee': 'Final Value Fee',
            'paypal_fee': 'PayPal Fee',
            'total_cost': 'Total Costs',
            'gross_profit': 'Gross Profit',
            'net_profit': 'Net Profit',
            'profit_margin': 'Profit Margin',
            'break_even': 'Break Even Price'
        },
        'ar': {
            'title': 'حاسبة رسوم eBay',
            'description': 'احسب رسوم البيع على eBay ورسوم PayPal والربح النهائي',
            'item_price': 'سعر بيع المنتج',
            'item_cost': 'تكلفة المنتج',
            'shipping_charged': 'رسوم الشحن المحملة على المشتري',
            'shipping_cost': 'تكلفة الشحن الفعلية',
            'category': 'فئة المنتج',
            'listing_type': 'نوع القائمة',
            'auction': 'مزاد',
            'fixed_price': 'اشتري الآن',
            'store_subscription': 'اشتراك متجر eBay',
            'no_store': 'بدون متجر',
            'basic_store': 'متجر أساسي',
            'premium_store': 'متجر مميز',
            'results_title': 'تفصيل الرسوم',
            'total_fees': 'إجمالي رسوم eBay',
            'insertion_fee': 'رسوم الإدراج',
            'final_value_fee': 'رسوم القيمة النهائية',
            'paypal_fee': 'رسوم PayPal',
            'total_cost': 'إجمالي التكاليف',
            'gross_profit': 'الربح الإجمالي',
            'net_profit': 'صافي الربح',
            'profit_margin': 'هامش الربح',
            'break_even': 'سعر التعادل'
        }
    },
    'gpa': {
        'ns': ['calc', 'education'],
        'en': {
            'title': 'GPA Calculator',
            'description': 'Calculate your Grade Point Average (GPA) from course grades and credits',
            'add_course': 'Add Course',
            'remove_course': 'Remove Course',
            'course_name': 'Course Name',
            'grade': 'Grade',
            'credits': 'Credit Hours',
            'grade_a': 'A (4.0)',
            'grade_a_minus': 'A- (3.7)',
            'grade_b_plus': 'B+ (3.3)',
            'grade_b': 'B (3.0)',
            'grade_b_minus': 'B- (2.7)',
            'grade_c_plus': 'C+ (2.3)',
            'grade_c': 'C (2.0)',
            'grade_c_minus': 'C- (1.7)',
            'grade_d': 'D (1.0)',
            'grade_f': 'F (0.0)',
            'results_title': 'GPA Results',
            'cumulative_gpa': 'Cumulative GPA',
            'total_credits': 'Total Credits',
            'total_courses': 'Total Courses',
            'grade_distribution': 'Grade Distribution',
            'academic_standing': 'Academic Standing',
            'excellent': 'Excellent (3.5-4.0)',
            'good': 'Good (3.0-3.49)',
            'satisfactory': 'Satisfactory (2.0-2.99)',
            'poor': 'Poor (Below 2.0)',
            'points_earned': 'Quality Points Earned',
            'scale_type': 'GPA Scale',
            'scale_4': '4.0 Scale',
            'scale_5': '5.0 Scale',
            'weighted': 'Weighted GPA'
        },
        'ar': {
            'title': 'حاسبة المعدل التراكمي',
            'description': 'احسب المعدل التراكمي (GPA) من درجات المقررات والساعات المعتمدة',
            'add_course': 'إضافة مقرر',
            'remove_course': 'حذف مقرر',
            'course_name': 'اسم المقرر',
            'grade': 'الدرجة',
            'credits': 'الساعات المعتمدة',
            'grade_a': 'A (4.0)',
            'grade_a_minus': 'A- (3.7)',
            'grade_b_plus': 'B+ (3.3)',
            'grade_b': 'B (3.0)',
            'grade_b_minus': 'B- (2.7)',
            'grade_c_plus': 'C+ (2.3)',
            'grade_c': 'C (2.0)',
            'grade_c_minus': 'C- (1.7)',
            'grade_d': 'D (1.0)',
            'grade_f': 'F (0.0)',
            'results_title': 'نتائج المعدل التراكمي',
            'cumulative_gpa': 'المعدل التراكمي',
            'total_credits': 'إجمالي الساعات المعتمدة',
            'total_courses': 'إجمالي المقررات',
            'grade_distribution': 'توزيع الدرجات',
            'academic_standing': 'المستوى الأكاديمي',
            'excellent': 'ممتاز (3.5-4.0)',
            'good': 'جيد (3.0-3.49)',
            'satisfactory': 'مقبول (2.0-2.99)',
            'poor': 'ضعيف (أقل من 2.0)',
            'points_earned': 'نقاط الجودة المكتسبة',
            'scale_type': 'مقياس المعدل',
            'scale_4': 'مقياس 4.0',
            'scale_5': 'مقياس 5.0',
            'weighted': 'معدل تراكمي موزون'
        }
    }
}

# Add more translations for other skipped calculators
TRANSLATIONS.update({
    'egg_production': {
        'ns': ['calc', 'agriculture'],
        'en': {
            'title': 'Egg Production Calculator',
            'description': 'Calculate egg production rates and profitability for your flock',
            'flock_size': 'Flock Size',
            'hen_count': 'Number of Hens',
            'production_rate': 'Production Rate (%)',
            'egg_price': 'Price per Dozen Eggs',
            'feed_cost_per_hen': 'Feed Cost per Hen/Day',
            'results_title': 'Production Analysis',
            'daily_eggs': 'Daily Egg Production',
            'weekly_eggs': 'Weekly Production',
            'monthly_eggs': 'Monthly Production',
            'annual_eggs': 'Annual Production',
            'daily_revenue': 'Daily Revenue',
            'monthly_revenue': 'Monthly Revenue',
            'annual_revenue': 'Annual Revenue',
            'feed_costs': 'Feed Costs',
            'net_profit': 'Net Profit',
            'profit_per_hen': 'Profit per Hen',
            'break_even_rate': 'Break-even Production Rate'
        },
        'ar': {
            'title': 'حاسبة إنتاج البيض',
            'description': 'احسب معدلات إنتاج البيض والربحية لقطيعك',
            'flock_size': 'حجم القطيع',
            'hen_count': 'عدد الدجاج',
            'production_rate': 'معدل الإنتاج (%)',
            'egg_price': 'السعر لكل دزينة بيض',
            'feed_cost_per_hen': 'تكلفة العلف لكل دجاجة/يوم',
            'results_title': 'تحليل الإنتاج',
            'daily_eggs': 'إنتاج البيض اليومي',
            'weekly_eggs': 'الإنتاج الأسبوعي',
            'monthly_eggs': 'الإنتاج الشهري',
            'annual_eggs': 'الإنتاج السنوي',
            'daily_revenue': 'الإيرادات اليومية',
            'monthly_revenue': 'الإيرادات الشهرية',
            'annual_revenue': 'الإيرادات السنوية',
            'feed_costs': 'تكاليف العلف',
            'net_profit': 'صافي الربح',
            'profit_per_hen': 'الربح لكل دجاجة',
            'break_even_rate': 'معدل الإنتاج لنقطة التعادل'
        }
    }
})

def main():
    print("Adding manual translations for remaining calculators")
    print("=" * 70)

    en_path = BASE_DIR / "public/locales/en/translation.json"
    ar_path = BASE_DIR / "public/locales/ar/translation.json"

    en_data = load_json(en_path)
    ar_data = load_json(ar_path)

    count = 0
    total_keys = 0

    for calc_key, trans_data in TRANSLATIONS.items():
        ns_path = trans_data['ns']
        en_trans = trans_data['en']
        ar_trans = trans_data['ar']

        # Navigate to namespace
        current_en = en_data
        current_ar = ar_data
        for ns in ns_path:
            if ns not in current_en:
                current_en[ns] = {}
                current_ar[ns] = {}
            current_en = current_en[ns]
            current_ar = current_ar[ns]

        # Add translations
        current_en[calc_key] = en_trans
        current_ar[calc_key] = ar_trans

        keys_added = len(str(en_trans).count(':'))
        total_keys += keys_added
        count += 1
        print(f"✓ Added {calc_key} ({len(en_trans)} top-level keys)")

    # Save
    save_json(en_path, en_data)
    save_json(ar_path, ar_data)

    print("=" * 70)
    print(f"Successfully added {count} calculators")
    print(f"Total keys added: {total_keys}")
    print("=" * 70)

if __name__ == "__main__":
    main()
