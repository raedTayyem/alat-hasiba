import { Calculator } from './types';

// Miscellaneous Calculators
const miscCalculators: Calculator[] = [
  {
    id: 193,
    name: 'حاسبة الأبجد',
    nameEn: 'Abjad Calculator - Arabic Letter Number Values',
    nameKey: 'calc/misc:abjad.page_title',
    slug: 'abjad-calculator',
    description: 'حساب القيم العددية للحروف في اللغة العربية',
    descriptionEn: 'Calculate abjad numerical values of Arabic letters and words.',
    descriptionKey: 'calc/misc:abjad.page_desc',
    category: 'misc',
    icon: '🔤',
    popularity: 5,
    componentName: 'AbjadCalculator',
    keywords: ['abjad', 'أبجد', 'arabic', 'عربي', 'letters', 'حروف', 'numbers', 'أرقام', 'gematria', 'جيماتريا']
  },
  {
    id: 198,
    name: 'حاسبة الإيقاع الحيوي',
    nameEn: 'Biorhythm Calculator - Calculate Physical Emotional Mental Cycles',
    nameKey: 'calc/misc:biorhythm.page_title',
    slug: 'biorhythm-calculator',
    description: 'حساب الإيقاع الحيوي البدني والعاطفي والذهني',
    descriptionEn: 'Calculate your biorhythm cycles including physical, emotional, and intellectual rhythms.',
    descriptionKey: 'calc/misc:biorhythm.page_desc',
    category: 'misc',
    icon: '〰️',
    popularity: 5,
    componentName: 'BiorhythmCalculator',
    keywords: ['biorhythm', 'إيقاع حيوي', 'cycles', 'دورات', 'physical', 'بدني', 'emotional', 'عاطفي', 'mental', 'ذهني']
  },
  {
    id: 199,
    name: 'مولد أرقام عشوائية',
    nameEn: 'Random Number Generator',
    nameKey: 'calc/misc:random-number-generator.title',
    slug: 'random-number-generator',
    description: 'توليد أرقام عشوائية ضمن نطاق محدد',
    descriptionEn: 'Generate random numbers within a specified range.',
    descriptionKey: 'calc/misc:random-number-generator.description',
    category: 'misc',
    icon: '🎲',
    popularity: 6,
    componentName: 'RandomNumberGenerator',
    keywords: ['random', 'عشوائي', 'number', 'رقم', 'generator', 'مولد', 'range', 'نطاق', 'lottery', 'قرعة']
  },
  {
    id: 200,
    name: 'محول مقاسات الأحذية',
    nameEn: 'Shoe Size Converter',
    nameKey: 'calc/misc:shoe-size-converter.title',
    slug: 'shoe-size-converter',
    description: 'تحويل مقاسات الأحذية بين الأنظمة المختلفة',
    descriptionEn: 'Convert shoe sizes between different international systems.',
    descriptionKey: 'calc/misc:shoe-size-converter.description',
    category: 'misc',
    icon: '👟',
    popularity: 4,
    componentName: 'ShoeSizeConverter',
    keywords: ['shoe', 'حذاء', 'size', 'مقاس', 'converter', 'محول', 'footwear', 'أحذية', 'international', 'دولي']
  },
  {
    id: 201,
    name: 'محول مقاسات الملابس',
    nameEn: 'Clothing Size Converter',
    nameKey: 'calc/misc:clothing-size-converter.title',
    slug: 'clothing-size-converter',
    description: 'تحويل مقاسات الملابس بين الأنظمة العالمية',
    descriptionEn: 'Convert clothing sizes between different international systems.',
    descriptionKey: 'calc/misc:clothing-size-converter.description',
    category: 'misc',
    icon: '👕',
    popularity: 4,
    componentName: 'ClothingSizeConverter',
    keywords: ['clothing', 'ملابس', 'size', 'مقاس', 'converter', 'محول', 'fashion', 'أزياء', 'international', 'دولي']
  },
];

export default miscCalculators;
