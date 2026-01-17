import { Calculator } from './types';

/**
 * Environmental & Sustainability Calculators (20 calculators)
 * Comprehensive environmental impact and sustainability calculation tools
 */
const environmentalCalculators: Calculator[] = [
  // Carbon Footprint
  {
    id: 2700,
    name: 'حاسبة البصمة الكربونية',
    nameEn: 'Carbon Footprint Calculator',
    description: 'احسب بصمتك الكربونية السنوية',
    descriptionEn: 'Calculate your annual carbon footprint',
    category: 'environmental',
    slug: 'carbon-footprint-calculator',
    icon: '🌍',
    keywords: ['بصمة كربونية', 'carbon', 'footprint'],
    relatedCalculators: ['co2-emissions-calculator', 'eco-score-calculator'],
    componentName: 'CarbonFootprintCalculator'
  },
  {
    id: 2701,
    name: 'حاسبة انبعاثات ثاني أكسيد الكربون',
    nameEn: 'CO2 Emissions Calculator',
    description: 'احسب انبعاثات CO2 من أنشطتك',
    descriptionEn: 'Calculate CO2 emissions from activities',
    category: 'environmental',
    slug: 'co2-emissions-calculator',
    icon: '💨',
    keywords: ['co2', 'انبعاثات', 'emissions'],
    relatedCalculators: ['carbon-footprint-calculator', 'vehicle-emissions'],
    componentName: 'CO2EmissionsCalculator'
  },
  {
    id: 2702,
    name: 'حاسبة انبعاثات السيارة',
    nameEn: 'Vehicle Emissions Calculator',
    description: 'احسب انبعاثات سيارتك',
    descriptionEn: 'Calculate your vehicle emissions',
    category: 'environmental',
    slug: 'vehicle-emissions-calculator',
    icon: '🚗',
    keywords: ['سيارة', 'vehicle', 'emissions'],
    relatedCalculators: ['fuel-consumption-calculator', 'carbon-offset-calculator'],
    componentName: 'VehicleEmissionsCalculator'
  },
  {
    id: 2703,
    name: 'حاسبة انبعاثات الطيران',
    nameEn: 'Flight Emissions Calculator',
    description: 'احسب انبعاثات الكربون من رحلاتك الجوية',
    descriptionEn: 'Calculate carbon emissions from flights',
    category: 'environmental',
    slug: 'flight-emissions-calculator',
    icon: '✈️',
    keywords: ['طيران', 'flight', 'emissions'],
    relatedCalculators: ['travel-carbon-calculator', 'carbon-offset-calculator'],
    componentName: 'FlightEmissionsCalculator'
  },
  {
    id: 2704,
    name: 'حاسبة تعويض الكربون',
    nameEn: 'Carbon Offset Calculator',
    description: 'احسب كمية تعويض الكربون المطلوبة',
    descriptionEn: 'Calculate required carbon offset amount',
    category: 'environmental',
    slug: 'carbon-offset-calculator',
    icon: '🌳',
    keywords: ['تعويض كربون', 'offset', 'carbon'],
    relatedCalculators: ['tree-planting-calculator', 'carbon-credit-calculator'],
    componentName: 'CarbonOffsetCalculator'
  },

  // Energy & Resources
  {
    id: 2705,
    name: 'حاسبة تدقيق الطاقة المنزلية',
    nameEn: 'Home Energy Audit Calculator',
    description: 'احسب استهلاك الطاقة في منزلك',
    descriptionEn: 'Calculate your home energy consumption',
    category: 'environmental',
    slug: 'home-energy-audit-calculator',
    icon: '🏠',
    keywords: ['طاقة منزلية', 'energy audit', 'home'],
    relatedCalculators: ['electricity-cost-calculator', 'energy-saving-calculator'],
    componentName: 'HomeEnergyAuditCalculator'
  },
  {
    id: 2706,
    name: 'حاسبة عائد الألواح الشمسية',
    nameEn: 'Solar Panel ROI Calculator',
    description: 'احسب عائد الاستثمار في الطاقة الشمسية',
    descriptionEn: 'Calculate solar panel investment return',
    category: 'environmental',
    slug: 'solar-panel-roi-calculator',
    icon: '☀️',
    keywords: ['ألواح شمسية', 'solar', 'roi'],
    relatedCalculators: ['solar-panel-calculator', 'payback-period-calculator'],
    componentName: 'SolarPanelROICalculator'
  },
  {
    id: 2707,
    name: 'حاسبة استهلاك الماء',
    nameEn: 'Water Usage Calculator',
    description: 'احسب استهلاكك اليومي من الماء',
    descriptionEn: 'Calculate your daily water consumption',
    category: 'environmental',
    slug: 'water-usage-calculator',
    icon: '💧',
    keywords: ['ماء', 'water', 'usage'],
    relatedCalculators: ['water-footprint-calculator', 'water-saving-calculator'],
    componentName: 'WaterUsageCalculator'
  },
  {
    id: 2708,
    name: 'حاسبة البصمة المائية',
    nameEn: 'Water Footprint Calculator',
    description: 'احسب بصمتك المائية السنوية',
    descriptionEn: 'Calculate your annual water footprint',
    category: 'environmental',
    slug: 'water-footprint-calculator',
    icon: '💦',
    keywords: ['بصمة مائية', 'water footprint'],
    relatedCalculators: ['water-usage-calculator', 'virtual-water-calculator'],
    componentName: 'WaterFootprintCalculator'
  },
  {
    id: 2709,
    name: 'حاسبة توفير الطاقة',
    nameEn: 'Energy Saving Calculator',
    description: 'احسب المدخرات من ترشيد الطاقة',
    descriptionEn: 'Calculate savings from energy efficiency',
    category: 'environmental',
    slug: 'energy-saving-calculator',
    icon: '💡',
    keywords: ['توفير طاقة', 'energy saving'],
    relatedCalculators: ['led-savings-calculator', 'insulation-savings'],
    componentName: 'EnergySavingCalculator'
  },

  // Waste & Recycling
  {
    id: 2710,
    name: 'حاسبة النفايات',
    nameEn: 'Waste Calculator',
    description: 'احسب كمية النفايات التي تنتجها',
    descriptionEn: 'Calculate your waste generation',
    category: 'environmental',
    slug: 'waste-calculator',
    icon: '🗑️',
    keywords: ['نفايات', 'waste', 'garbage'],
    relatedCalculators: ['recycling-calculator', 'landfill-diversion'],
    componentName: 'WasteCalculator'
  },
  {
    id: 2711,
    name: 'حاسبة تأثير إعادة التدوير',
    nameEn: 'Recycling Impact Calculator',
    description: 'احسب الأثر البيئي لإعادة التدوير',
    descriptionEn: 'Calculate environmental impact of recycling',
    category: 'environmental',
    slug: 'recycling-impact-calculator',
    icon: '♻️',
    keywords: ['إعادة تدوير', 'recycling', 'impact'],
    relatedCalculators: ['waste-calculator', 'plastic-reduction-calculator'],
    componentName: 'RecyclingImpactCalculator'
  },
  {
    id: 2712,
    name: 'حاسبة البصمة البلاستيكية',
    nameEn: 'Plastic Footprint Calculator',
    description: 'احسب استهلاكك السنوي من البلاستيك',
    descriptionEn: 'Calculate your annual plastic consumption',
    category: 'environmental',
    slug: 'plastic-footprint-calculator',
    icon: '🛍️',
    keywords: ['بلاستيك', 'plastic', 'footprint'],
    relatedCalculators: ['waste-calculator', 'single-use-plastic-calculator'],
    componentName: 'PlasticFootprintCalculator'
  },
  {
    id: 2713,
    name: 'حاسبة التسميد العضوي',
    nameEn: 'Composting Calculator',
    description: 'احسب كمية السماد العضوي المنتج',
    descriptionEn: 'Calculate compost production amount',
    category: 'environmental',
    slug: 'composting-calculator',
    icon: '🌱',
    keywords: ['تسميد', 'composting', 'organic'],
    relatedCalculators: ['waste-reduction-calculator', 'garden-compost'],
    componentName: 'CompostingCalculator'
  },

  // Sustainability Scores
  {
    id: 2714,
    name: 'حاسبة النقاط البيئية',
    nameEn: 'Eco Score Calculator',
    description: 'احسب نقاطك البيئية الشاملة',
    descriptionEn: 'Calculate your overall environmental score',
    category: 'environmental',
    slug: 'eco-score-calculator',
    icon: '🌿',
    keywords: ['نقاط بيئية', 'eco score', 'sustainability'],
    relatedCalculators: ['carbon-footprint-calculator', 'sustainability-rating'],
    componentName: 'EcoScoreCalculator'
  },
  {
    id: 2715,
    name: 'حاسبة التنقل الأخضر',
    nameEn: 'Green Commute Calculator',
    description: 'قارن بين وسائل التنقل من حيث الأثر البيئي',
    descriptionEn: 'Compare transport methods by environmental impact',
    category: 'environmental',
    slug: 'green-commute-calculator',
    icon: '🚲',
    keywords: ['تنقل أخضر', 'commute', 'transport'],
    relatedCalculators: ['vehicle-emissions-calculator', 'public-transport-calculator'],
    componentName: 'GreenCommuteCalculator'
  },
  {
    id: 2716,
    name: 'حاسبة البصمة الكربونية للنظام الغذائي',
    nameEn: 'Diet Carbon Footprint Calculator',
    description: 'احسب البصمة الكربونية لنظامك الغذائي',
    descriptionEn: 'Calculate carbon footprint of your diet',
    category: 'environmental',
    slug: 'diet-carbon-footprint-calculator',
    icon: '🍽️',
    keywords: ['نظام غذائي', 'diet', 'carbon'],
    relatedCalculators: ['food-waste-calculator', 'plant-based-impact'],
    componentName: 'DietCarbonFootprintCalculator'
  },
  {
    id: 2717,
    name: 'حاسبة تأثير زراعة الأشجار',
    nameEn: 'Tree Planting Impact Calculator',
    description: 'احسب تأثير زراعة الأشجار على الكربون',
    descriptionEn: 'Calculate tree planting impact on carbon',
    category: 'environmental',
    slug: 'tree-planting-impact-calculator',
    icon: '🌳',
    keywords: ['أشجار', 'trees', 'planting'],
    relatedCalculators: ['carbon-offset-calculator', 'oxygen-production-calculator'],
    componentName: 'TreePlantingImpactCalculator'
  },
  {
    id: 2718,
    name: 'حاسبة حصاد مياه الأمطار',
    nameEn: 'Rainwater Harvesting Calculator',
    description: 'احسب كمية مياه الأمطار التي يمكن جمعها',
    descriptionEn: 'Calculate collectable rainwater amount',
    category: 'environmental',
    slug: 'rainwater-harvesting-calculator',
    icon: '🌧️',
    keywords: ['مياه أمطار', 'rainwater', 'harvesting'],
    relatedCalculators: ['water-saving-calculator', 'roof-area-calculator'],
    componentName: 'RainwaterHarvestingCalculator'
  },
  {
    id: 2719,
    name: 'حاسبة نمط الحياة المستدام',
    nameEn: 'Sustainable Lifestyle Calculator',
    description: 'قيّم مدى استدامة نمط حياتك',
    descriptionEn: 'Assess your lifestyle sustainability',
    category: 'environmental',
    slug: 'sustainable-lifestyle-calculator',
    icon: '🌍',
    keywords: ['استدامة', 'sustainable', 'lifestyle'],
    relatedCalculators: ['eco-score-calculator', 'green-living-calculator'],
    componentName: 'SustainableLifestyleCalculator'
  }
];

export default environmentalCalculators;
