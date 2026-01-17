import { Calculator } from './types';

/**
 * Pet Care Calculators (20 calculators)
 * Comprehensive pet health, care, and cost calculation tools
 */
const petCalculators: Calculator[] = [
  // Dogs
  {
    id: 3000,
    nameKey: "calc/pet:dog-age-calculator.title", name: 'حاسبة عمر الكلب',
    nameEn: 'Dog Age Calculator',
    descriptionKey: "calc/pet:dog-age-calculator.description", description: 'حول عمر الكلب إلى عمر بشري',
    descriptionEn: 'Convert dog age to human years',
    category: 'pet',
    slug: 'dog-age-calculator',
    icon: '🐕',
    keywords: ['كلب', 'dog', 'age', 'عمر'],
    relatedCalculators: ['dog-weight-calculator', 'puppy-growth-calculator'],
    componentName: 'DogAgeCalculator'
  },
  {
    id: 3001,
    nameKey: "calc/pet:dog-food-calculator.title", name: 'حاسبة طعام الكلب',
    nameEn: 'Dog Food Calculator',
    descriptionKey: "calc/pet:dog-food-calculator.description", description: 'احسب كمية الطعام المناسبة للكلب',
    descriptionEn: 'Calculate appropriate dog food amount',
    category: 'pet',
    slug: 'dog-food-calculator',
    icon: '🍖',
    keywords: ['طعام كلب', 'dog food', 'feeding'],
    relatedCalculators: ['dog-calorie-calculator', 'dog-weight-calculator'],
    componentName: 'DogFoodCalculator'
  },
  {
    id: 3002,
    nameKey: "calc/pet:dog-calorie-calculator.title", name: 'حاسبة سعرات الكلب',
    nameEn: 'Dog Calorie Calculator',
    descriptionKey: "calc/pet:dog-calorie-calculator.description", description: 'احسب احتياج الكلب اليومي من السعرات',
    descriptionEn: 'Calculate dog\'s daily calorie needs',
    category: 'pet',
    slug: 'dog-calorie-calculator',
    icon: '🔥',
    keywords: ['سعرات', 'calories', 'dog'],
    relatedCalculators: ['dog-food-calculator', 'dog-diet-calculator'],
    componentName: 'DogCalorieCalculator'
  },
  {
    id: 3003,
    nameKey: "calc/pet:puppy-growth-calculator.title", name: 'حاسبة نمو الجرو',
    nameEn: 'Puppy Growth Calculator',
    descriptionKey: "calc/pet:puppy-growth-calculator.description", description: 'توقع حجم الجرو عند البلوغ',
    descriptionEn: 'Predict puppy size at maturity',
    category: 'pet',
    slug: 'puppy-growth-calculator',
    icon: '🐶',
    keywords: ['جرو', 'puppy', 'growth'],
    relatedCalculators: ['dog-weight-calculator', 'breed-size-calculator'],
    componentName: 'PuppyGrowthCalculator'
  },
  {
    id: 3004,
    nameKey: "calc/pet:dog-pregnancy-calculator.title", name: 'حاسبة حمل الكلب',
    nameEn: 'Dog Pregnancy Calculator',
    descriptionKey: "calc/pet:dog-pregnancy-calculator.description", description: 'احسب موعد ولادة الكلب',
    descriptionEn: 'Calculate dog due date',
    category: 'pet',
    slug: 'dog-pregnancy-calculator',
    icon: '🤰',
    keywords: ['حمل', 'pregnancy', 'dog'],
    relatedCalculators: ['whelping-calculator', 'puppy-care-calculator'],
    componentName: 'DogPregnancyCalculator'
  },

  // Cats
  {
    id: 3005,
    nameKey: "calc/pet:cat-age-calculator.title", name: 'حاسبة عمر القطة',
    nameEn: 'Cat Age Calculator',
    descriptionKey: "calc/pet:cat-age-calculator.description", description: 'حول عمر القطة إلى عمر بشري',
    descriptionEn: 'Convert cat age to human years',
    category: 'pet',
    slug: 'cat-age-calculator',
    icon: '🐱',
    keywords: ['قطة', 'cat', 'age', 'عمر'],
    relatedCalculators: ['cat-weight-calculator', 'kitten-growth-calculator'],
    componentName: 'CatAgeCalculator'
  },
  {
    id: 3006,
    nameKey: "calc/pet:cat-food-calculator.title", name: 'حاسبة طعام القطة',
    nameEn: 'Cat Food Calculator',
    descriptionKey: "calc/pet:cat-food-calculator.description", description: 'احسب كمية الطعام المناسبة للقطة',
    descriptionEn: 'Calculate appropriate cat food amount',
    category: 'pet',
    slug: 'cat-food-calculator',
    icon: '🐟',
    keywords: ['طعام قطة', 'cat food', 'feeding'],
    relatedCalculators: ['cat-calorie-calculator', 'cat-weight-calculator'],
    componentName: 'CatFoodCalculator'
  },
  {
    id: 3007,
    nameKey: "calc/pet:cat-calorie-calculator.title", name: 'حاسبة سعرات القطة',
    nameEn: 'Cat Calorie Calculator',
    descriptionKey: "calc/pet:cat-calorie-calculator.description", description: 'احسب احتياج القطة اليومي من السعرات',
    descriptionEn: 'Calculate cat\'s daily calorie needs',
    category: 'pet',
    slug: 'cat-calorie-calculator',
    icon: '🔥',
    keywords: ['سعرات', 'calories', 'cat'],
    relatedCalculators: ['cat-food-calculator', 'cat-diet-calculator'],
    componentName: 'CatCalorieCalculator'
  },
  {
    id: 3008,
    nameKey: "calc/pet:kitten-growth-calculator.title", name: 'حاسبة نمو القطة الصغيرة',
    nameEn: 'Kitten Growth Calculator',
    descriptionKey: "calc/pet:kitten-growth-calculator.description", description: 'تتبع نمو القطة الصغيرة',
    descriptionEn: 'Track kitten growth progress',
    category: 'pet',
    slug: 'kitten-growth-calculator',
    icon: '🐈',
    keywords: ['قطة صغيرة', 'kitten', 'growth'],
    relatedCalculators: ['cat-weight-calculator', 'cat-age-calculator'],
    componentName: 'KittenGrowthCalculator'
  },
  {
    id: 3009,
    nameKey: "calc/pet:cat-pregnancy-calculator.title", name: 'حاسبة حمل القطة',
    nameEn: 'Cat Pregnancy Calculator',
    descriptionKey: "calc/pet:cat-pregnancy-calculator.description", description: 'احسب موعد ولادة القطة',
    descriptionEn: 'Calculate cat due date',
    category: 'pet',
    slug: 'cat-pregnancy-calculator',
    icon: '🤰',
    keywords: ['حمل', 'pregnancy', 'cat'],
    relatedCalculators: ['queening-calculator', 'kitten-care-calculator'],
    componentName: 'CatPregnancyCalculator'
  },

  // General Pet Care
  {
    id: 3010,
    nameKey: "calc/pet:pet-medication-dosage-calculator.title", name: 'حاسبة جرعة دواء الحيوان الأليف',
    nameEn: 'Pet Medication Dosage Calculator',
    descriptionKey: "calc/pet:pet-medication-dosage-calculator.description", description: 'احسب جرعة الدواء حسب وزن الحيوان',
    descriptionEn: 'Calculate medication dose by pet weight',
    category: 'pet',
    slug: 'pet-medication-dosage-calculator',
    icon: '💊',
    keywords: ['دواء', 'medication', 'dosage'],
    relatedCalculators: ['vet-visit-cost-calculator', 'pet-health-calculator'],
    componentName: 'PetMedicationDosageCalculator'
  },
  {
    id: 3011,
    nameKey: "calc/pet:pet-insurance-calculator.title", name: 'حاسبة تأمين الحيوانات الأليفة',
    nameEn: 'Pet Insurance Calculator',
    descriptionKey: "calc/pet:pet-insurance-calculator.description", description: 'احسب تكلفة وفوائد تأمين الحيوانات',
    descriptionEn: 'Calculate pet insurance costs and benefits',
    category: 'pet',
    slug: 'pet-insurance-calculator',
    icon: '🛡️',
    keywords: ['تأمين', 'insurance', 'pet'],
    relatedCalculators: ['pet-cost-calculator', 'vet-cost-calculator'],
    componentName: 'PetInsuranceCalculator'
  },
  {
    id: 3012,
    nameKey: "calc/pet:pet-adoption-cost-calculator.title", name: 'حاسبة تكلفة تبني حيوان أليف',
    nameEn: 'Pet Adoption Cost Calculator',
    descriptionKey: "calc/pet:pet-adoption-cost-calculator.description", description: 'احسب التكلفة السنوية للحيوان الأليف',
    descriptionEn: 'Calculate annual pet ownership cost',
    category: 'pet',
    slug: 'pet-adoption-cost-calculator',
    icon: '💰',
    keywords: ['تبني', 'adoption', 'cost'],
    relatedCalculators: ['pet-food-cost', 'pet-care-budget'],
    componentName: 'PetAdoptionCostCalculator'
  },
  {
    id: 3013,
    nameKey: "calc/pet:pet-travel-calculator.title", name: 'حاسبة سفر الحيوانات الأليفة',
    nameEn: 'Pet Travel Calculator',
    descriptionKey: "calc/pet:pet-travel-calculator.description", description: 'احسب تكاليف ومتطلبات سفر الحيوانات',
    descriptionEn: 'Calculate pet travel costs and requirements',
    category: 'pet',
    slug: 'pet-travel-calculator',
    icon: '✈️',
    keywords: ['سفر', 'travel', 'pet'],
    relatedCalculators: ['pet-crate-size-calculator', 'travel-certificate-calculator'],
    componentName: 'PetTravelCalculator'
  },
  {
    id: 3014,
    nameKey: "calc/pet:aquarium-calculator.title", name: 'حاسبة حوض الأسماك',
    nameEn: 'Aquarium Calculator',
    descriptionKey: "calc/pet:aquarium-calculator.description", description: 'احسب حجم الحوض وعدد الأسماك المناسب',
    descriptionEn: 'Calculate tank size and fish capacity',
    category: 'pet',
    slug: 'aquarium-calculator',
    icon: '🐠',
    keywords: ['حوض أسماك', 'aquarium', 'fish'],
    relatedCalculators: ['fish-stocking-calculator', 'water-volume-calculator'],
    componentName: 'AquariumCalculator'
  },
  {
    id: 3015,
    nameKey: "calc/pet:bird-cage-size-calculator.title", name: 'حاسبة حجم قفص الطيور',
    nameEn: 'Bird Cage Size Calculator',
    descriptionKey: "calc/pet:bird-cage-size-calculator.description", description: 'احسب حجم القفص المناسب للطائر',
    descriptionEn: 'Calculate appropriate bird cage size',
    category: 'pet',
    slug: 'bird-cage-size-calculator',
    icon: '🦜',
    keywords: ['طيور', 'bird', 'cage'],
    relatedCalculators: ['bird-food-calculator', 'aviary-size-calculator'],
    componentName: 'BirdCageSizeCalculator'
  },
  {
    id: 3016,
    nameKey: "calc/pet:rabbit-care-calculator.title", name: 'حاسبة رعاية الأرانب',
    nameEn: 'Rabbit Care Calculator',
    descriptionKey: "calc/pet:rabbit-care-calculator.description", description: 'احسب احتياجات الأرنب من الطعام والمساحة',
    descriptionEn: 'Calculate rabbit food and space needs',
    category: 'pet',
    slug: 'rabbit-care-calculator',
    icon: '🐰',
    keywords: ['أرنب', 'rabbit', 'care'],
    relatedCalculators: ['rabbit-diet-calculator', 'hutch-size-calculator'],
    componentName: 'RabbitCareCalculator'
  },
  {
    id: 3017,
    nameKey: "calc/pet:hamster-lifespan-calculator.title", name: 'حاسبة عمر الهامستر',
    nameEn: 'Hamster Lifespan Calculator',
    descriptionKey: "calc/pet:hamster-lifespan-calculator.description", description: 'احسب متوسط عمر الهامستر',
    descriptionEn: 'Calculate hamster average lifespan',
    category: 'pet',
    slug: 'hamster-lifespan-calculator',
    icon: '🐹',
    keywords: ['هامستر', 'hamster', 'lifespan'],
    relatedCalculators: ['small-pet-care-calculator', 'rodent-diet-calculator'],
    componentName: 'HamsterLifespanCalculator'
  },
  {
    id: 3018,
    nameKey: "calc/pet:reptile-tank-calculator.title", name: 'حاسبة خزان الزواحف',
    nameEn: 'Reptile Tank Calculator',
    descriptionKey: "calc/pet:reptile-tank-calculator.description", description: 'احسب حجم الخزان المناسب للزواحف',
    descriptionEn: 'Calculate appropriate reptile tank size',
    category: 'pet',
    slug: 'reptile-tank-calculator',
    icon: '🦎',
    keywords: ['زواحف', 'reptile', 'terrarium'],
    relatedCalculators: ['heating-requirements', 'uvb-lighting-calculator'],
    componentName: 'ReptileTankCalculator'
  },
  {
    id: 3019,
    nameKey: "calc/pet:horse-feed-calculator.title", name: 'حاسبة طعام الحصان',
    nameEn: 'Horse Feed Calculator',
    descriptionKey: "calc/pet:horse-feed-calculator.description", description: 'احسب كمية العلف المناسبة للحصان',
    descriptionEn: 'Calculate appropriate horse feed amount',
    category: 'pet',
    slug: 'horse-feed-calculator',
    icon: '🐴',
    keywords: ['حصان', 'horse', 'feed'],
    relatedCalculators: ['horse-weight-calculator', 'hay-consumption-calculator'],
    componentName: 'HorseFeedCalculator'
  }
];

export default petCalculators;
