import { Calculator } from './types';

/**
 * Real Estate & Property Calculators (30 calculators)
 * Comprehensive real estate, mortgage, and property calculation tools
 */
const realEstateCalculators: Calculator[] = [
  // Mortgage & Financing
  {
    id: 3100,
    nameKey: "calc/real-estate:mortgage-calculator-advanced.title", name: 'حاسبة القرض العقاري المتقدمة',
    nameEn: 'Advanced Mortgage Calculator',
    descriptionKey: "calc/real-estate:mortgage-calculator-advanced.description", description: 'احسب الأقساط والفوائد والجداول الزمنية',
    descriptionEn: 'Calculate payments, interest, and amortization',
    category: 'real-estate',
    slug: 'mortgage-calculator-advanced',
    icon: '🏠',
    keywords: ['قرض عقاري', 'mortgage', 'loan'],
    relatedCalculators: ['mortgage-affordability', 'refinance-calculator'],
    componentName: 'AdvancedMortgageCalculator'
  },
  {
    id: 3101,
    nameKey: "calc/real-estate:mortgage-affordability-calculator.title", name: 'حاسبة القدرة الشرائية للمنزل',
    nameEn: 'Home Affordability Calculator',
    descriptionKey: "calc/real-estate:mortgage-affordability-calculator.description", description: 'احسب سعر المنزل الذي تستطيع شراءه',
    descriptionEn: 'Calculate affordable home price',
    category: 'real-estate',
    slug: 'mortgage-affordability-calculator',
    icon: '💰',
    keywords: ['قدرة شرائية', 'affordability', 'home'],
    relatedCalculators: ['mortgage-calculator', 'debt-to-income-calculator'],
    componentName: 'HomeAffordabilityCalculator'
  },
  {
    id: 3102,
    nameKey: "calc/real-estate:refinance-calculator.title", name: 'حاسبة إعادة تمويل القرض',
    nameEn: 'Refinance Calculator',
    descriptionKey: "calc/real-estate:refinance-calculator.description", description: 'احسب فوائد إعادة تمويل القرض العقاري',
    descriptionEn: 'Calculate refinancing benefits',
    category: 'real-estate',
    slug: 'refinance-calculator',
    icon: '🔄',
    keywords: ['إعادة تمويل', 'refinance', 'mortgage'],
    relatedCalculators: ['mortgage-calculator', 'break-even-calculator'],
    componentName: 'RefinanceCalculator'
  },
  {
    id: 3103,
    nameKey: "calc/real-estate:down-payment-calculator.title", name: 'حاسبة الدفعة الأولى',
    nameEn: 'Down Payment Calculator',
    descriptionKey: "calc/real-estate:down-payment-calculator.description", description: 'احسب الدفعة الأولى المطلوبة',
    descriptionEn: 'Calculate required down payment',
    category: 'real-estate',
    slug: 'down-payment-calculator',
    icon: '💵',
    keywords: ['دفعة أولى', 'down payment'],
    relatedCalculators: ['mortgage-calculator', 'closing-cost-calculator'],
    componentName: 'DownPaymentCalculator'
  },
  {
    id: 3104,
    nameKey: "calc/real-estate:closing-cost-calculator.title", name: 'حاسبة تكاليف الإغلاق',
    nameEn: 'Closing Cost Calculator',
    descriptionKey: "calc/real-estate:closing-cost-calculator.description", description: 'احسب تكاليف إغلاق صفقة العقار',
    descriptionEn: 'Calculate real estate closing costs',
    category: 'real-estate',
    slug: 'closing-cost-calculator',
    icon: '📝',
    keywords: ['تكاليف إغلاق', 'closing cost'],
    relatedCalculators: ['down-payment-calculator', 'mortgage-calculator'],
    componentName: 'ClosingCostCalculator'
  },
  {
    id: 3105,
    nameKey: "calc/real-estate:pmi-calculator.title", name: 'حاسبة تأمين الرهن العقاري',
    nameEn: 'PMI Calculator',
    descriptionKey: "calc/real-estate:pmi-calculator.description", description: 'احسب تأمين الرهن العقاري PMI',
    descriptionEn: 'Calculate private mortgage insurance',
    category: 'real-estate',
    slug: 'pmi-calculator',
    icon: '🛡️',
    keywords: ['تأمين رهن', 'pmi', 'insurance'],
    relatedCalculators: ['mortgage-calculator', 'loan-to-value-calculator'],
    componentName: 'PMICalculator'
  },

  // Property Value & Investment
  {
    id: 3106,
    nameKey: "calc/real-estate:home-value-estimator.title", name: 'حاسبة تقييم العقار',
    nameEn: 'Home Value Estimator',
    descriptionKey: "calc/real-estate:home-value-estimator.description", description: 'قدر قيمة العقار السوقية',
    descriptionEn: 'Estimate property market value',
    category: 'real-estate',
    slug: 'home-value-estimator',
    icon: '🏡',
    keywords: ['تقييم', 'قيمة', 'valuation'],
    relatedCalculators: ['comparable-sales-calculator', 'appraisal-calculator'],
    componentName: 'HomeValueEstimator'
  },
  {
    id: 3107,
    nameKey: "calc/real-estate:rental-yield-calculator.title", name: 'حاسبة عائد الإيجار',
    nameEn: 'Rental Yield Calculator',
    descriptionKey: "calc/real-estate:rental-yield-calculator.description", description: 'احسب عائد الاستثمار من الإيجار',
    descriptionEn: 'Calculate rental investment return',
    category: 'real-estate',
    slug: 'rental-yield-calculator',
    icon: '📊',
    keywords: ['عائد إيجار', 'rental yield', 'roi'],
    relatedCalculators: ['cap-rate-calculator', 'cash-on-cash-return'],
    componentName: 'RentalYieldCalculator'
  },
  {
    id: 3108,
    nameKey: "calc/real-estate:cap-rate-calculator.title", name: 'حاسبة معدل الرسملة',
    nameEn: 'Cap Rate Calculator',
    descriptionKey: "calc/real-estate:cap-rate-calculator.description", description: 'احسب معدل الرسملة للعقار الاستثماري',
    descriptionEn: 'Calculate capitalization rate',
    category: 'real-estate',
    slug: 'cap-rate-calculator',
    icon: '📈',
    keywords: ['رسملة', 'cap rate', 'noi'],
    relatedCalculators: ['rental-yield-calculator', 'noi-calculator'],
    componentName: 'CapRateCalculator'
  },
  {
    id: 3109,
    nameKey: "calc/real-estate:cash-on-cash-return-calculator.title", name: 'حاسبة العائد النقدي',
    nameEn: 'Cash-on-Cash Return Calculator',
    descriptionKey: "calc/real-estate:cash-on-cash-return-calculator.description", description: 'احسب العائد النقدي على الاستثمار',
    descriptionEn: 'Calculate cash-on-cash return',
    category: 'real-estate',
    slug: 'cash-on-cash-return-calculator',
    icon: '💵',
    keywords: ['عائد نقدي', 'cash on cash'],
    relatedCalculators: ['rental-yield-calculator', 'roi-calculator'],
    componentName: 'CashOnCashReturnCalculator'
  },
  {
    id: 3110,
    nameKey: "calc/real-estate:noi-calculator.title", name: 'حاسبة صافي دخل التشغيل',
    nameEn: 'NOI Calculator',
    descriptionKey: "calc/real-estate:noi-calculator.description", description: 'احسب صافي دخل التشغيل للعقار',
    descriptionEn: 'Calculate net operating income',
    category: 'real-estate',
    slug: 'noi-calculator',
    icon: '💰',
    keywords: ['noi', 'صافي دخل', 'operating income'],
    relatedCalculators: ['cap-rate-calculator', 'gross-rent-multiplier'],
    componentName: 'NOICalculator'
  },
  {
    id: 3111,
    nameKey: "calc/real-estate:gross-rent-multiplier-calculator.title", name: 'حاسبة مضاعف الإيجار الإجمالي',
    nameEn: 'Gross Rent Multiplier Calculator',
    descriptionKey: "calc/real-estate:gross-rent-multiplier-calculator.description", description: 'احسب مضاعف الإيجار الإجمالي GRM',
    descriptionEn: 'Calculate gross rent multiplier',
    category: 'real-estate',
    slug: 'gross-rent-multiplier-calculator',
    icon: '×',
    keywords: ['مضاعف إيجار', 'grm', 'multiplier'],
    relatedCalculators: ['noi-calculator', 'property-valuation'],
    componentName: 'GrossRentMultiplierCalculator'
  },
  {
    id: 3112,
    nameKey: "calc/real-estate:real-estate-roi-calculator.title", name: 'حاسبة عائد الاستثمار العقاري',
    nameEn: 'Real Estate ROI Calculator',
    descriptionKey: "calc/real-estate:real-estate-roi-calculator.description", description: 'احسب العائد على الاستثمار العقاري',
    descriptionEn: 'Calculate real estate return on investment',
    category: 'real-estate',
    slug: 'real-estate-roi-calculator',
    icon: '📊',
    keywords: ['عائد استثمار', 'roi', 'return'],
    relatedCalculators: ['rental-yield-calculator', 'cash-on-cash-return'],
    componentName: 'RealEstateROICalculator'
  },
  {
    id: 3113,
    nameKey: "calc/real-estate:property-flip-calculator.title", name: 'حاسبة تقليب العقارات',
    nameEn: 'Property Flip Calculator',
    descriptionKey: "calc/real-estate:property-flip-calculator.description", description: 'احسب أرباح تجديد وبيع العقارات',
    descriptionEn: 'Calculate profit from flipping properties',
    category: 'real-estate',
    slug: 'property-flip-calculator',
    icon: '🔨',
    keywords: ['تقليب', 'flip', 'profit'],
    relatedCalculators: ['renovation-cost-calculator', 'after-repair-value'],
    componentName: 'PropertyFlipCalculator'
  },

  // Rental Property
  {
    id: 3114,
    nameKey: "calc/real-estate:rent-vs-buy-calculator.title", name: 'حاسبة الإيجار مقابل الشراء',
    nameEn: 'Rent vs Buy Calculator',
    descriptionKey: "calc/real-estate:rent-vs-buy-calculator.description", description: 'قارن بين الإيجار والشراء',
    descriptionEn: 'Compare renting versus buying',
    category: 'real-estate',
    slug: 'rent-vs-buy-calculator',
    icon: '⚖️',
    keywords: ['إيجار', 'شراء', 'rent', 'buy'],
    relatedCalculators: ['mortgage-calculator', 'rental-cost-calculator'],
    componentName: 'RentVsBuyCalculator'
  },
  {
    id: 3115,
    nameKey: "calc/real-estate:rental-income-calculator.title", name: 'حاسبة دخل الإيجار',
    nameEn: 'Rental Income Calculator',
    descriptionKey: "calc/real-estate:rental-income-calculator.description", description: 'احسب صافي دخل الإيجار',
    descriptionEn: 'Calculate net rental income',
    category: 'real-estate',
    slug: 'rental-income-calculator',
    icon: '💵',
    keywords: ['دخل إيجار', 'rental income'],
    relatedCalculators: ['rental-yield-calculator', 'noi-calculator'],
    componentName: 'RentalIncomeCalculator'
  },
  {
    id: 3116,
    nameKey: "calc/real-estate:vacancy-rate-calculator.title", name: 'حاسبة معدل الشواغر',
    nameEn: 'Vacancy Rate Calculator',
    descriptionKey: "calc/real-estate:vacancy-rate-calculator.description", description: 'احسب معدل شواغر العقارات',
    descriptionEn: 'Calculate property vacancy rate',
    category: 'real-estate',
    slug: 'vacancy-rate-calculator',
    icon: '🏚️',
    keywords: ['شواغر', 'vacancy', 'rate'],
    relatedCalculators: ['rental-income-calculator', 'occupancy-rate'],
    componentName: 'VacancyRateCalculator'
  },
  {
    id: 3117,
    nameKey: "calc/real-estate:security-deposit-calculator.title", name: 'حاسبة التأمين الإيجاري',
    nameEn: 'Security Deposit Calculator',
    descriptionKey: "calc/real-estate:security-deposit-calculator.description", description: 'احسب قيمة التأمين الإيجاري',
    descriptionEn: 'Calculate security deposit amount',
    category: 'real-estate',
    slug: 'security-deposit-calculator',
    icon: '🔒',
    keywords: ['تأمين', 'security deposit'],
    relatedCalculators: ['rental-income-calculator', 'lease-calculator'],
    componentName: 'SecurityDepositCalculator'
  },

  // Taxes & Costs
  {
    id: 3118,
    nameKey: "calc/real-estate:property-tax-calculator.title", name: 'حاسبة ضريبة العقار',
    nameEn: 'Property Tax Calculator',
    descriptionKey: "calc/real-estate:property-tax-calculator.description", description: 'احسب ضريبة العقار السنوية',
    descriptionEn: 'Calculate annual property tax',
    category: 'real-estate',
    slug: 'property-tax-calculator',
    icon: '📋',
    keywords: ['ضريبة عقار', 'property tax'],
    relatedCalculators: ['home-ownership-cost', 'hoa-fee-calculator'],
    componentName: 'PropertyTaxCalculator'
  },
  {
    id: 3119,
    nameKey: "calc/real-estate:hoa-fee-calculator.title", name: 'حاسبة رسوم جمعية الملاك',
    nameEn: 'HOA Fee Calculator',
    descriptionKey: "calc/real-estate:hoa-fee-calculator.description", description: 'احسب رسوم جمعية ملاك العقار',
    descriptionEn: 'Calculate homeowners association fees',
    category: 'real-estate',
    slug: 'hoa-fee-calculator',
    icon: '🏘️',
    keywords: ['hoa', 'جمعية ملاك', 'fees'],
    relatedCalculators: ['property-tax-calculator', 'home-maintenance-cost'],
    componentName: 'HOAFeeCalculator'
  },
  {
    id: 3120,
    nameKey: "calc/real-estate:home-maintenance-cost-calculator.title", name: 'حاسبة تكاليف صيانة المنزل',
    nameEn: 'Home Maintenance Cost Calculator',
    descriptionKey: "calc/real-estate:home-maintenance-cost-calculator.description", description: 'احسب تكاليف صيانة المنزل السنوية',
    descriptionEn: 'Calculate annual home maintenance costs',
    category: 'real-estate',
    slug: 'home-maintenance-cost-calculator',
    icon: '🔧',
    keywords: ['صيانة', 'maintenance', 'cost'],
    relatedCalculators: ['home-ownership-cost', 'renovation-cost-calculator'],
    componentName: 'HomeMaintenanceCostCalculator'
  },
  {
    id: 3121,
    nameKey: "calc/real-estate:capital-gains-tax-calculator.title", name: 'حاسبة ضريبة أرباح رأس المال',
    nameEn: 'Capital Gains Tax Calculator',
    descriptionKey: "calc/real-estate:capital-gains-tax-calculator.description", description: 'احسب ضريبة أرباح بيع العقار',
    descriptionEn: 'Calculate capital gains tax on property sale',
    category: 'real-estate',
    slug: 'capital-gains-tax-calculator',
    icon: '💰',
    keywords: ['ضريبة أرباح', 'capital gains'],
    relatedCalculators: ['real-estate-roi-calculator', 'profit-calculator'],
    componentName: 'CapitalGainsTaxCalculator'
  },

  // Loan & Equity
  {
    id: 3122,
    nameKey: "calc/real-estate:home-equity-calculator.title", name: 'حاسبة رأس مال المنزل',
    nameEn: 'Home Equity Calculator',
    descriptionKey: "calc/real-estate:home-equity-calculator.description", description: 'احسب رأس المال المتراكم في المنزل',
    descriptionEn: 'Calculate accumulated home equity',
    category: 'real-estate',
    slug: 'home-equity-calculator',
    icon: '🏠',
    keywords: ['رأس مال', 'equity', 'home'],
    relatedCalculators: ['loan-to-value-calculator', 'mortgage-calculator'],
    componentName: 'HomeEquityCalculator'
  },
  {
    id: 3123,
    nameKey: "calc/real-estate:heloc-calculator.title", name: 'حاسبة قرض رأس المال',
    nameEn: 'HELOC Calculator',
    descriptionKey: "calc/real-estate:heloc-calculator.description", description: 'احسب قرض رأس مال المنزل',
    descriptionEn: 'Calculate home equity line of credit',
    category: 'real-estate',
    slug: 'heloc-calculator',
    icon: '💳',
    keywords: ['heloc', 'قرض رأس مال'],
    relatedCalculators: ['home-equity-calculator', 'second-mortgage-calculator'],
    componentName: 'HELOCCalculator'
  },
  {
    id: 3124,
    nameKey: "calc/real-estate:loan-to-value-calculator.title", name: 'حاسبة نسبة القرض للقيمة',
    nameEn: 'Loan-to-Value (LTV) Calculator',
    descriptionKey: "calc/real-estate:loan-to-value-calculator.description", description: 'احسب نسبة القرض لقيمة العقار',
    descriptionEn: 'Calculate loan-to-value ratio',
    category: 'real-estate',
    slug: 'loan-to-value-calculator',
    icon: '%',
    keywords: ['ltv', 'قرض لقيمة', 'ratio'],
    relatedCalculators: ['home-equity-calculator', 'pmi-calculator'],
    componentName: 'LoanToValueCalculator'
  },
  {
    id: 3125,
    nameKey: "calc/real-estate:debt-to-income-ratio-calculator.title", name: 'حاسبة نسبة الدين للدخل',
    nameEn: 'Debt-to-Income Ratio Calculator',
    descriptionKey: "calc/real-estate:debt-to-income-ratio-calculator.description", description: 'احسب نسبة الدين للدخل DTI',
    descriptionEn: 'Calculate debt-to-income ratio',
    category: 'real-estate',
    slug: 'debt-to-income-ratio-calculator',
    icon: '📊',
    keywords: ['dti', 'دين لدخل', 'ratio'],
    relatedCalculators: ['mortgage-affordability', 'qualifying-income-calculator'],
    componentName: 'DebtToIncomeRatioCalculator'
  },

  // Commercial Real Estate
  {
    id: 3126,
    nameKey: "calc/real-estate:commercial-property-calculator.title", name: 'حاسبة العقار التجاري',
    nameEn: 'Commercial Property Calculator',
    descriptionKey: "calc/real-estate:commercial-property-calculator.description", description: 'احسب قيمة وعائد العقار التجاري',
    descriptionEn: 'Calculate commercial property value and return',
    category: 'real-estate',
    slug: 'commercial-property-calculator',
    icon: '🏢',
    keywords: ['عقار تجاري', 'commercial', 'property'],
    relatedCalculators: ['cap-rate-calculator', 'noi-calculator'],
    componentName: 'CommercialPropertyCalculator'
  },
  {
    id: 3127,
    nameKey: "calc/real-estate:cost-per-square-foot-calculator.title", name: 'حاسبة التكلفة للمتر المربع',
    nameEn: 'Cost per Square Foot Calculator',
    descriptionKey: "calc/real-estate:cost-per-square-foot-calculator.description", description: 'احسب تكلفة العقار للقدم أو المتر المربع',
    descriptionEn: 'Calculate property cost per square foot/meter',
    category: 'real-estate',
    slug: 'cost-per-square-foot-calculator',
    icon: '📐',
    keywords: ['تكلفة متر', 'cost per sqft'],
    relatedCalculators: ['home-value-estimator', 'construction-cost-calculator'],
    componentName: 'CostPerSquareFootCalculator'
  },
  {
    id: 3128,
    nameKey: "calc/real-estate:lease-analysis-calculator.title", name: 'حاسبة تحليل الإيجار التجاري',
    nameEn: 'Commercial Lease Analysis Calculator',
    descriptionKey: "calc/real-estate:lease-analysis-calculator.description", description: 'احسب وقارن عقود الإيجار التجاري',
    descriptionEn: 'Calculate and compare commercial leases',
    category: 'real-estate',
    slug: 'lease-analysis-calculator',
    icon: '📄',
    keywords: ['إيجار تجاري', 'lease', 'commercial'],
    relatedCalculators: ['nnn-lease-calculator', 'rent-escalation-calculator'],
    componentName: 'LeaseAnalysisCalculator'
  }
];

export default realEstateCalculators;
