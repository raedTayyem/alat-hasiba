#!/usr/bin/env python3
"""
Batch add translations for calculators 104-150
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

def main():
    print("Batch Adding Translations for Calculators 104-150")
    print("=" * 70)
    
    en_path = BASE_DIR / "public/locales/en/translation.json"
    ar_path = BASE_DIR / "public/locales/ar/translation.json"
    
    en_data = load_json(en_path)
    ar_data = load_json(ar_path)
    
    # Define all translations
    translations = []
    
    # Calculator 104: Dog Age Calculator
    translations.append({
        'calc': 'dog_age_calculator',
        'ns': ['calc', 'pet'],
        'en': {
            'error_invalid': 'Please enter a valid age',
            'error_positive': 'Age must be greater than 0',
            'error_max_age': 'Age must be less than 30 years',
            'error_calculation': 'Calculation error occurred',
            'calculate_btn': 'Calculate Dog Age',
            'reset_btn': 'Reset',
            'dog_age_label': 'Dog Age (years)',
            'dog_age_tooltip': 'Enter your dog\'s current age in years',
            'dog_age_placeholder': 'e.g., 5',
            'dog_size_label': 'Dog Size',
            'dog_size_tooltip': 'Select your dog\'s size category',
            'size_small': 'Small (< 20 lbs)',
            'size_medium': 'Medium (21-50 lbs)',
            'size_large': 'Large (51-90 lbs)',
            'size_giant': 'Giant (> 90 lbs)',
            'results_title': 'Dog to Human Age',
            'human_years': 'Human Years',
            'life_stage': 'Life Stage',
            'stage_puppy': 'Puppy',
            'stage_young': 'Young Adult',
            'stage_adult': 'Adult',
            'stage_mature': 'Mature Adult',
            'stage_senior': 'Senior',
            'health_tips': 'Health Tips',
            'tip_puppy_1': 'Focus on socialization and training',
            'tip_puppy_2': 'Schedule regular vet checkups and vaccinations',
            'tip_young_1': 'Maintain regular exercise routine',
            'tip_young_2': 'Annual vet checkups recommended',
            'tip_adult_1': 'Monitor weight and dental health',
            'tip_adult_2': 'Continue regular exercise',
            'tip_mature_1': 'Watch for signs of aging',
            'tip_mature_2': 'Increase vet visit frequency',
            'tip_senior_1': 'Provide joint support and softer food',
            'tip_senior_2': 'Bi-annual vet checkups recommended',
            'formula_title': 'How It Works',
            'formula_explanation': 'The calculation uses veterinary-approved aging formulas that vary by dog size. Small dogs age slower than large dogs.',
            'info_title': 'About Dog Age Conversion',
            'info_description': 'Convert your dog\'s age to equivalent human years based on size and breed. Different sized dogs age at different rates.',
            'title': 'Dog Age Calculator',
            'description': 'Convert dog years to human years accurately based on your dog\'s size'
        },
        'ar': {
            'error_invalid': 'الرجاء إدخال عمر صالح',
            'error_positive': 'يجب أن يكون العمر أكبر من 0',
            'error_max_age': 'يجب أن يكون العمر أقل من 30 سنة',
            'error_calculation': 'حدث خطأ في الحساب',
            'calculate_btn': 'احسب عمر الكلب',
            'reset_btn': 'إعادة تعيين',
            'dog_age_label': 'عمر الكلب (بالسنوات)',
            'dog_age_tooltip': 'أدخل العمر الحالي لكلبك بالسنوات',
            'dog_age_placeholder': 'مثال: 5',
            'dog_size_label': 'حجم الكلب',
            'dog_size_tooltip': 'اختر فئة حجم كلبك',
            'size_small': 'صغير (< 20 رطل)',
            'size_medium': 'متوسط (21-50 رطل)',
            'size_large': 'كبير (51-90 رطل)',
            'size_giant': 'عملاق (> 90 رطل)',
            'results_title': 'عمر الكلب بالنسبة للإنسان',
            'human_years': 'السنوات البشرية',
            'life_stage': 'مرحلة الحياة',
            'stage_puppy': 'جرو',
            'stage_young': 'بالغ شاب',
            'stage_adult': 'بالغ',
            'stage_mature': 'بالغ ناضج',
            'stage_senior': 'كبير السن',
            'health_tips': 'نصائح صحية',
            'tip_puppy_1': 'ركز على التنشئة الاجتماعية والتدريب',
            'tip_puppy_2': 'حدد فحوصات بيطرية منتظمة وتطعيمات',
            'tip_young_1': 'حافظ على روتين تمرين منتظم',
            'tip_young_2': 'يوصى بفحص بيطري سنوي',
            'tip_adult_1': 'راقب الوزن وصحة الأسنان',
            'tip_adult_2': 'استمر في التمرين المنتظم',
            'tip_mature_1': 'راقب علامات الشيخوخة',
            'tip_mature_2': 'زد تكرار الزيارات البيطرية',
            'tip_senior_1': 'وفر دعم المفاصل وطعام أنعم',
            'tip_senior_2': 'يوصى بفحوصات بيطرية كل ستة أشهر',
            'formula_title': 'كيف يعمل',
            'formula_explanation': 'يستخدم الحساب صيغ شيخوخة معتمدة بيطرياً تختلف حسب حجم الكلب. الكلاب الصغيرة تتقدم في العمر بشكل أبطأ من الكلاب الكبيرة.',
            'info_title': 'حول تحويل عمر الكلب',
            'info_description': 'حول عمر كلبك إلى سنوات بشرية معادلة بناءً على الحجم والسلالة. الكلاب ذات الأحجام المختلفة تتقدم في العمر بمعدلات مختلفة.',
            'title': 'حاسبة عمر الكلب',
            'description': 'حول سنوات الكلب إلى سنوات بشرية بدقة بناءً على حجم كلبك'
        }
    })
    
    # Process translations
    count = 0
    for trans in translations:
        calc_name = trans['calc']
        namespace_path = trans['ns']
        
        # Add to EN
        current = en_data
        for ns in namespace_path:
            if ns not in current:
                current[ns] = {}
            current = current[ns]
        current[calc_name] = trans['en']
        
        # Add to AR
        current = ar_data
        for ns in namespace_path:
            if ns not in current:
                current[ns] = {}
            current = current[ns]
        current[calc_name] = trans['ar']
        
        count += 1
        print(f"✓ Added {calc_name} ({len(trans['en'])} keys)")
    
    # Save files
    save_json(en_path, en_data)
    save_json(ar_path, ar_data)
    
    print("=" * 70)
    print(f"Successfully added translations for {count} calculator(s)")
    print("=" * 70)

if __name__ == "__main__":
    main()
