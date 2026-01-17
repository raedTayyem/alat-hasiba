import { Calculator } from './types';

/**
 * Automotive Calculators (30 calculators)
 * Comprehensive car, vehicle, and automotive calculation tools
 */

const automotiveCalculators: Calculator[] = [
  // Fuel & Economy
  {
    id: 2200,
    nameKey: "calc/automotive:fuel-economy-calculator.title", name: 'حاسبة استهلاك الوقود',
    nameEn: 'Fuel Economy Calculator - Free MPG & Fuel Consumption Tool',
    descriptionKey: "calc/automotive:fuel-economy-calculator.description", description: 'احسب معدل استهلاك الوقود (كم/لتر أو ميل/جالون)',
    descriptionEn: 'Calculate your vehicle fuel consumption rate in MPG or km/L. Free online fuel economy calculator for accurate gas mileage tracking.',
    slug: 'fuel-economy-calculator',
    category: 'automotive',
    icon: '⛽',
    componentName: 'FuelEconomyCalculator',
    popularity: 95,
    keywords: ['وقود', 'بنزين', 'استهلاك', 'كم لتر']
  },
    {
      id: 2201,
      nameKey: "calc/automotive:fuel-cost-calculator.title", name: 'حاسبة تكلفة الوقود',
      nameEn: 'Fuel Cost Calculator - Trip Gas Price Estimator',
      descriptionKey: "calc/automotive:fuel-cost-calculator.description", description: 'احسب تكلفة الوقود للرحلة',
      descriptionEn: 'Estimate total fuel costs for your trip. Calculate gas expenses based on distance, fuel price, and vehicle consumption instantly.',
      slug: 'fuel-cost-calculator',
      category: 'automotive',
      icon: '💵',
      componentName: 'FuelCostCalculator',
      popularity: 92,
      keywords: ['تكلفة وقود', 'سعر بنزين', 'رحلة']
    },
  {
    id: 2202,
    nameKey: "calc/automotive:gas-mileage-calculator.title", name: 'حاسبة المسافة بالوقود',
    nameEn: 'Gas Mileage Calculator - Free Distance Range Tool',
    descriptionKey: "calc/automotive:gas-mileage-calculator.description", description: 'احسب المسافة التي يمكن قطعها بكمية وقود',
    descriptionEn: 'Calculate how far you can drive with your fuel tank. Free gas mileage calculator to determine vehicle range and distance coverage.',
    slug: 'gas-mileage-calculator',
    category: 'automotive',
    icon: '📏',
    componentName: 'GasMileageCalculator',
    popularity: 88,
    keywords: ['مسافة', 'وقود', 'مدى السيارة']
  },

  // Car Purchase & Finance
  {
    id: 2203,
    nameKey: "calc/automotive:car-loan-calculator.title", name: 'حاسبة قرض السيارة',
    nameEn: 'Car Loan Calculator - Free Auto Financing Tool',
    descriptionKey: "calc/automotive:car-loan-calculator.description", description: 'احسب القسط الشهري لقرض السيارة',
    descriptionEn: 'Calculate monthly car loan payments easily. Compare auto financing options, interest rates, and total costs. Essential tool for car buyers.',
    slug: 'car-loan-calculator',
    category: 'automotive',
    icon: '🚗',
    componentName: 'CarLoanCalculator',
    popularity: 93,
    keywords: ['قرض سيارة', 'قسط', 'تمويل', 'تقسيط']
  },
    {
      id: 2204,
      nameKey: "calc/automotive:lease-calculator.title", name: 'حاسبة تأجير السيارة',
      nameEn: 'Car Lease Calculator - Vehicle Leasing Payment Tool',
      descriptionKey: "calc/automotive:lease-calculator.description", description: 'احسب تكلفة استئجار السيارة',
      descriptionEn: 'Calculate car lease payments and total leasing costs. Free online calculator for vehicle lease estimation and monthly payment planning.',
      slug: 'lease-calculator',
      category: 'automotive',
      icon: '📋',
      componentName: 'LeaseCalculator',
      popularity: 85,
      keywords: ['تأجير', 'إيجار', 'ليزينغ']
    },
    {
      id: 2205,
      nameKey: "calc/automotive:lease-vs-buy-calculator.title", name: 'حاسبة الشراء مقابل التأجير',
      nameEn: 'Lease vs Buy Calculator - Car Purchase Comparison Tool',
      descriptionKey: "calc/automotive:lease-vs-buy-calculator.description", description: 'قارن بين شراء وتأجير السيارة',
      descriptionEn: 'Compare leasing vs buying a car costs. Analyze financial benefits, monthly payments, and long-term savings to make informed decisions.',
      slug: 'lease-vs-buy-calculator',
      category: 'automotive',
      icon: '⚖️',
      componentName: 'LeaseVsBuyCalculator',
      popularity: 87,
      keywords: ['شراء', 'تأجير', 'مقارنة', 'قرار']
    },
  {
    id: 2206,
    nameKey: "calc/automotive:car-depreciation-calculator.title", name: 'حاسبة انخفاض قيمة السيارة',
    nameEn: 'Car Depreciation Calculator - Vehicle Value Loss Tool',
    descriptionKey: "calc/automotive:car-depreciation-calculator.description", description: 'احسب انخفاض قيمة السيارة مع الوقت',
    descriptionEn: 'Calculate car depreciation and resale value over time. Estimate vehicle value loss with free online auto depreciation calculator.',
    slug: 'car-depreciation-calculator',
    category: 'automotive',
    icon: '📉',
    componentName: 'CarDepreciationCalculator',
    popularity: 82,
    keywords: ['انخفاض قيمة', 'استهلاك', 'قيمة سيارة']
  },
    {
      id: 2207,
      nameKey: "calc/automotive:car-trade-in-calculator.title", name: 'حاسبة قيمة استبدال السيارة',
      nameEn: 'Car Trade-In Value Calculator - Free Appraisal Tool',
      descriptionKey: "calc/automotive:car-trade-in-calculator.description", description: 'احسب قيمة سيارتك القديمة للاستبدال',
      descriptionEn: 'Estimate your car trade-in value instantly. Calculate what your vehicle is worth for trade-in with our free online appraisal calculator.',
      slug: 'car-trade-in-calculator',
      category: 'automotive',
      icon: '🔄',
      componentName: 'CarTradeInCalculator',
      popularity: 84,
      keywords: ['استبدال', 'قيمة', 'سيارة قديمة']
    },

  // Maintenance & Costs
    {
      id: 2208,
      nameKey: "calc/automotive:car-maintenance-calculator.title", name: 'حاسبة تكلفة الصيانة',
      nameEn: 'Car Maintenance Cost Calculator - Annual Service Tool',
      descriptionKey: "calc/automotive:car-maintenance-calculator.description", description: 'احسب التكلفة السنوية لصيانة السيارة',
      descriptionEn: 'Calculate annual car maintenance costs and service expenses. Free online tool to estimate vehicle upkeep budget and repair costs.',
      slug: 'car-maintenance-calculator',
      category: 'automotive',
      icon: '🔧',
      componentName: 'CarMaintenanceCalculator',
      popularity: 89,
      keywords: ['صيانة', 'تكلفة', 'خدمة']
    },
  {
    id: 2209,
    nameKey: "calc/automotive:oil-change-calculator.title", name: 'حاسبة تغيير الزيت',
    nameEn: 'Oil Change Calculator - Engine Maintenance Reminder',
    descriptionKey: "calc/automotive:oil-change-calculator.description", description: 'احسب موعد تغيير زيت المحرك',
    descriptionEn: 'Calculate when to change engine oil based on mileage and time. Free oil change interval calculator for optimal vehicle maintenance.',
    slug: 'oil-change-calculator',
    category: 'automotive',
    icon: '🛢️',
    componentName: 'OilChangeCalculator',
    popularity: 86,
    keywords: ['زيت محرك', 'تغيير زيت', 'صيانة دورية']
  },
  {
    id: 2210,
    nameKey: "calc/automotive:tire-size-calculator.title", name: 'حاسبة مقاس الإطارات',
    nameEn: 'Tire Size Calculator - Free Wheel Comparison Tool',
    descriptionKey: "calc/automotive:tire-size-calculator.description", description: 'احسب وقارن مقاسات الإطارات',
    descriptionEn: 'Calculate and compare tire sizes with dimensions and fitment. Free online tire size calculator for accurate wheel measurements.',
    slug: 'tire-size-calculator',
    category: 'automotive',
    icon: '🛞',
    componentName: 'TireSizeCalculator',
    popularity: 83,
    keywords: ['إطارات', 'كفرات', 'مقاس', 'عجلات']
  },
    {
      id: 2211,
      nameKey: "calc/automotive:tire-pressure-calculator.title", name: 'حاسبة ضغط الإطارات',
      nameEn: 'Tire Pressure Calculator - Optimal PSI Tool',
      descriptionKey: "calc/automotive:tire-pressure-calculator.description", description: 'احسب ضغط الإطارات المثالي',
      descriptionEn: 'Calculate ideal tire pressure for your vehicle in PSI or Bar. Free online calculator for optimal tire inflation and safety.',
      slug: 'tire-pressure-calculator',
      category: 'automotive',
      icon: '💨',
      componentName: 'TirePressureCalculator',
      popularity: 79,
      keywords: ['ضغط إطارات', 'PSI', 'هواء']
    },

  // Performance & Specifications
  {
    id: 2212,
    nameKey: "calc/automotive:horsepower-calculator.title", name: 'حاسبة قوة المحرك',
    nameEn: 'Horsepower Calculator - Engine Power Conversion Tool',
    descriptionKey: "calc/automotive:horsepower-calculator.description", description: 'احسب قوة المحرك بالحصان',
    descriptionEn: 'Calculate engine horsepower and convert between HP, kW, and PS. Free online horsepower calculator for accurate power measurements.',
    slug: 'horsepower-calculator',
    category: 'automotive',
    icon: '🐎',
    componentName: 'HorsepowerCalculator',
    popularity: 81,
    keywords: ['حصان', 'قوة محرك', 'HP']
  },
  {
    id: 2213,
    nameKey: "calc/automotive:torque-calculator.title", name: 'حاسبة عزم الدوران',
    nameEn: 'Torque Calculator - Engine Torque Measurement Tool',
    descriptionKey: "calc/automotive:torque-calculator.description", description: 'احسب عزم الدوران للمحرك',
    descriptionEn: 'Calculate engine torque in Nm, lb-ft, and kg-m. Free torque calculator for precise rotational force measurements and conversions.',
    slug: 'torque-calculator',
    category: 'automotive',
    icon: '⚙️',
    componentName: 'TorqueCalculator',
    popularity: 76,
    keywords: ['عزم', 'عزم دوران', 'نيوتن متر']
  },
  {
    id: 2214,
    nameKey: "calc/automotive:acceleration-calculator.title", name: 'حاسبة التسارع',
    nameEn: 'Acceleration Calculator - 0-60 & 0-100 Speed Tool',
    descriptionKey: "calc/automotive:acceleration-calculator.description", description: 'احسب زمن تسارع السيارة 0-100',
    descriptionEn: 'Calculate car acceleration time from 0-60 mph or 0-100 km/h. Free online calculator for vehicle performance and speed metrics.',
    slug: 'acceleration-calculator',
    category: 'automotive',
    icon: '🏁',
    componentName: 'AccelerationCalculator',
    popularity: 78,
    keywords: ['تسارع', 'سرعة', '0-100']
  },
    {
      id: 2215,
      nameKey: "calc/automotive:top-speed-calculator.title", name: 'حاسبة السرعة القصوى',
      nameEn: 'Top Speed Calculator - Maximum Velocity Tool',
      descriptionKey: "calc/automotive:top-speed-calculator.description", description: 'احسب السرعة القصوى للسيارة',
      descriptionEn: 'Calculate vehicle top speed and maximum velocity. Free online calculator for estimating car performance and speed capabilities.',
      slug: 'top-speed-calculator',
      category: 'automotive',
      icon: '💨',
      componentName: 'TopSpeedCalculator',
      popularity: 74,
      keywords: ['سرعة قصوى', 'سرعة', 'كم/ساعة']
    },
  {
    id: 2216,
    nameKey: "calc/automotive:gear-ratio-calculator.title", name: 'حاسبة نسبة التروس',
    nameEn: 'Gear Ratio Calculator - Transmission Speed Tool',
    descriptionKey: "calc/automotive:gear-ratio-calculator.description", description: 'احسب نسبة التروس وسرعة كل غيار',
    descriptionEn: 'Calculate gear ratios and speed for each transmission gear. Free online tool for optimizing vehicle performance and gearing.',
    slug: 'gear-ratio-calculator',
    category: 'automotive',
    icon: '⚙️',
    componentName: 'GearRatioCalculator',
    popularity: 72,
    keywords: ['تروس', 'غيارات', 'نسبة']
  },

  // Trip & Distance
  {
    id: 2217,
    nameKey: "calc/automotive:trip-cost-calculator.title", name: 'حاسبة تكلفة الرحلة',
    nameEn: 'Trip Cost Calculator - Road Travel Expense Tool',
    descriptionKey: "calc/automotive:trip-cost-calculator.description", description: 'احسب التكلفة الإجمالية للرحلة بالسيارة',
    descriptionEn: 'Calculate total road trip costs including fuel, tolls, and expenses. Free online trip cost calculator for budget planning and travel.',
    slug: 'trip-cost-calculator',
    category: 'automotive',
    icon: '🗺️',
    componentName: 'TripCostCalculator',
    popularity: 90,
    keywords: ['رحلة', 'تكلفة', 'سفر', 'مصاريف']
  },
    {
      id: 2218,
      nameKey: "calc/automotive:travel-time-calculator.title", name: 'حاسبة وقت السفر',
      nameEn: 'Travel Time Calculator - Free Drive Duration Tool',
      descriptionKey: "calc/automotive:travel-time-calculator.description", description: 'احسب وقت الوصول بناءً على المسافة والسرعة',
      descriptionEn: 'Calculate travel time and arrival based on distance and speed. Free online calculator for accurate journey duration estimates.',
      slug: 'travel-time-calculator',
      category: 'automotive',
      icon: '⏱️',
      componentName: 'TravelTimeCalculator',
      popularity: 87,
      keywords: ['وقت سفر', 'مدة رحلة', 'وصول']
    },

  // Environmental
    {
      id: 2219,
      nameKey: "calc/automotive:carbon-emissions-calculator.title", name: 'حاسبة انبعاثات الكربون',
      nameEn: 'Carbon Emissions Calculator - Vehicle CO2 Tool',
      descriptionKey: "calc/automotive:carbon-emissions-calculator.description", description: 'احسب انبعاثات CO2 من سيارتك',
      descriptionEn: 'Calculate your car carbon footprint and CO2 emissions. Free online calculator for measuring vehicle environmental impact and pollution.',
      slug: 'carbon-emissions-calculator',
      category: 'automotive',
      icon: '🌍',
      componentName: 'CarbonEmissionsCalculator',
      popularity: 77,
      keywords: ['كربون', 'انبعاثات', 'بيئة', 'CO2']
    },
    {
      id: 2220,
      nameKey: "calc/automotive:ev-range-calculator.title", name: 'حاسبة مدى السيارة الكهربائية',
      nameEn: 'EV Range Calculator - Electric Vehicle Distance Tool',
      descriptionKey: "calc/automotive:ev-range-calculator.description", description: 'احسب مدى السيارة الكهربائية',
      descriptionEn: 'Calculate electric vehicle range and battery distance coverage. Free EV range calculator for accurate driving distance estimates.',
      slug: 'ev-range-calculator',
      category: 'automotive',
      icon: '🔋',
      componentName: 'EVRangeCalculator',
      popularity: 84,
      keywords: ['سيارة كهربائية', 'مدى', 'بطارية', 'EV']
    },
    {
      id: 2221,
      nameKey: "calc/automotive:ev-charging-calculator.title", name: 'حاسبة شحن السيارة الكهربائية',
      nameEn: 'EV Charging Calculator - Electric Car Cost & Time Tool',
      descriptionKey: "calc/automotive:ev-charging-calculator.description", description: 'احسب تكلفة ووقت شحن السيارة الكهربائية',
      descriptionEn: 'Calculate EV charging time and electricity costs. Free electric vehicle charging calculator for cost estimation and planning.',
      slug: 'ev-charging-calculator',
      category: 'automotive',
      icon: '⚡',
      componentName: 'EVChargingCalculator',
      popularity: 82,
      keywords: ['شحن', 'كهرباء', 'سيارة كهربائية']
    },
    {
      id: 2222,
      nameKey: "calc/automotive:hybrid-savings-calculator.title", name: 'حاسبة توفير السيارة الهجينة',
      nameEn: 'Hybrid Savings Calculator - Fuel Economy Tool',
      descriptionKey: "calc/automotive:hybrid-savings-calculator.description", description: 'احسب التوفير من استخدام سيارة هجينة',
      descriptionEn: 'Calculate fuel savings from hybrid vehicles vs gas cars. Free online hybrid car savings calculator for cost comparison and ROI.',
      slug: 'hybrid-savings-calculator',
      category: 'automotive',
      icon: '🔋',
      componentName: 'HybridSavingsCalculator',
      popularity: 79,
      keywords: ['هجينة', 'هايبرد', 'توفير', 'وقود']
    },

  // Braking & Safety
    {
      id: 2223,
      nameKey: "calc/automotive:braking-distance-calculator.title", name: 'حاسبة مسافة الفرملة',
      nameEn: 'Braking Distance Calculator - Vehicle Stopping Tool',
      descriptionKey: "calc/automotive:braking-distance-calculator.description", description: 'احسب مسافة التوقف عند السرعات المختلفة',
      descriptionEn: 'Calculate braking distance at different speeds for safe driving. Free stopping distance calculator for vehicle safety and awareness.',
      slug: 'braking-distance-calculator',
      category: 'automotive',
      icon: '🛑',
      componentName: 'BrakingDistanceCalculator',
      popularity: 75,
      keywords: ['فرامل', 'توقف', 'مسافة', 'سلامة']
    },
    {
      id: 2224,
      nameKey: "calc/automotive:stopping-distance-calculator.title", name: 'حاسبة مسافة رد الفعل والتوقف',
      nameEn: 'Stopping Distance Calculator - Reaction Time Tool',
      descriptionKey: "calc/automotive:stopping-distance-calculator.description", description: 'احسب المسافة الكلية للتوقف',
      descriptionEn: 'Calculate total stopping distance including reaction time and braking. Free online calculator for driving safety and distance awareness.',
      slug: 'stopping-distance-calculator',
      category: 'automotive',
      icon: '⚠️',
      componentName: 'StoppingDistanceCalculator',
      popularity: 73,
      keywords: ['توقف', 'رد فعل', 'مسافة أمان']
    },

  // Insurance & Registration
    {
      id: 2225,
      nameKey: "calc/automotive:car-insurance-calculator.title", name: 'حاسبة تأمين السيارة',
      nameEn: 'Car Insurance Calculator - Free Auto Coverage Tool',
      descriptionKey: "calc/automotive:car-insurance-calculator.description", description: 'احسب تكلفة تأمين السيارة التقريبية',
      descriptionEn: 'Calculate car insurance cost estimates and premium rates. Free online auto insurance calculator for coverage comparison and budgeting.',
      slug: 'car-insurance-calculator',
      category: 'automotive',
      icon: '🛡️',
      componentName: 'CarInsuranceCalculator',
      popularity: 91,
      keywords: ['تأمين', 'تأمين شامل', 'تأمين ضد الغير']
    },
    {
      id: 2226,
      nameKey: "calc/automotive:registration-fee-calculator.title", name: 'حاسبة رسوم الترخيص',
      nameEn: 'Registration Fee Calculator - Vehicle License Cost Tool',
      descriptionKey: "calc/automotive:registration-fee-calculator.description", description: 'احسب رسوم ترخيص وتسجيل السيارة',
      descriptionEn: 'Calculate vehicle registration and licensing fees. Free online calculator for car registration costs and renewal expenses estimation.',
      slug: 'registration-fee-calculator',
      category: 'automotive',
      icon: '📄',
      componentName: 'RegistrationFeeCalculator',
      popularity: 80,
      keywords: ['ترخيص', 'تسجيل', 'رسوم', 'استمارة']
    },

  // Specialized
    {
      id: 2227,
      nameKey: "calc/automotive:car-payment-calculator.title", name: 'حاسبة دفعات السيارة الشاملة',
      nameEn: 'Car Payment Calculator - Total Monthly Cost Tool',
      descriptionKey: "calc/automotive:car-payment-calculator.description", description: 'احسب جميع التكاليف الشهرية للسيارة',
      descriptionEn: 'Calculate total monthly car payments including loan, insurance, and expenses. Free comprehensive auto payment calculator for budgeting.',
      slug: 'car-payment-calculator',
      category: 'automotive',
      icon: '💳',
      componentName: 'CarPaymentCalculator',
      popularity: 88,
      keywords: ['دفعات', 'تكاليف شهرية', 'قسط']
    },
    {
      id: 2228,
      nameKey: "calc/automotive:car-comparison-calculator.title", name: 'حاسبة مقارنة السيارات',
      nameEn: 'Car Comparison Calculator - Vehicle Cost & Performance Tool',
      descriptionKey: "calc/automotive:car-comparison-calculator.description", description: 'قارن بين سيارتين من حيث التكلفة والأداء',
      descriptionEn: 'Compare two cars side-by-side for cost, performance, and features. Free online car comparison calculator for smart buying decisions.',
      slug: 'car-comparison-calculator',
      category: 'automotive',
      icon: '🔀',
      componentName: 'CarComparisonCalculator',
      popularity: 85,
      keywords: ['مقارنة', 'سيارات', 'اختيار']
    },
  {
    id: 2229,
    nameKey: "calc/automotive:wheel-offset-calculator.title", name: 'حاسبة إزاحة الجنوط',
    nameEn: 'Wheel Offset Calculator - Rim Fitment Tool',
    descriptionKey: "calc/automotive:wheel-offset-calculator.description", description: 'احسب إزاحة وملاءمة الجنوط',
    descriptionEn: 'Calculate wheel offset and rim fitment for proper installation. Free online ET offset calculator for wheels and tire compatibility.',
    slug: 'wheel-offset-calculator',
    category: 'automotive',
    icon: '⭕',
    componentName: 'WheelOffsetCalculator',
    popularity: 68,
    keywords: ['جنوط', 'إزاحة', 'offset', 'ET']
  },
  {
    id: 2230,
    nameKey: "calc/automotive:battery-life-calculator.title", name: 'حاسبة عمر البطارية',
    nameEn: 'Battery Life Calculator - Car Battery Estimator',
    descriptionKey: "calc/automotive:battery-life-calculator.description", description: 'احسب العمر المتبقي لبطارية السيارة',
    descriptionEn: 'Calculate remaining car battery life based on usage patterns, age, and climate conditions. Free battery life estimator for vehicle maintenance planning.',
    slug: 'battery-life-calculator',
    category: 'automotive',
    icon: '🔋',
    componentName: 'BatteryLifeCalculator',
    popularity: 76,
    keywords: ['بطارية', 'عمر بطارية', 'صيانة', 'سيارة']
  }
];

export default automotiveCalculators;
