import { Calculator } from './types';

// Finance Calculators
const financeCalculators: Calculator[] = [
  {
    id: 18,
    name: 'حاسبة الفائدة المركبة',
    nameEn: 'Compound Interest Calculator - Calculate Investment Growth',
    nameKey: 'calc/finance:compound-interest.title',
    slug: 'compound-interest',
    description: 'احسب الفائدة المركبة على استثماراتك ومدخراتك',
    descriptionEn: 'Calculate compound interest on your investments and savings online. See how your money grows over time with our free compound interest calculator. Perfect for financial planning and investment analysis.',
    descriptionKey: 'calc/finance:compound-interest.description',
    category: 'finance',
    icon: '📈',
    popularity: 8,
    componentName: 'InvestmentCalculator',
    keywords: ['compound interest', 'فائدة مركبة', 'investment', 'استثمار', 'savings', 'مدخرات', 'growth', 'نمو', 'finance', 'مالية']
  },
  {
    id: 19,
    name: 'حاسبة الزكاة',
    nameEn: 'Zakat Calculator - Calculate Islamic Zakat on Wealth Online',
    nameKey: 'calc/finance:zakat-calculator.title',
    slug: 'zakat-calculator',
    description: 'احسب زكاة المال، الذهب، والفضة بدقة وفق الشريعة الإسلامية',
    descriptionEn: 'Calculate Zakat on money, gold, and silver accurately according to Islamic law. Free online Zakat calculator that helps Muslims determine their Zakat obligations with precision.',
    descriptionKey: 'calc/finance:zakat-calculator.description',
    category: 'finance',
    icon: '☪️',
    popularity: 9,
    componentName: 'ZakatCalculator',
    keywords: ['zakat', 'زكاة', 'islamic', 'إسلامي', 'charity', 'صدقة', 'wealth', 'مال', 'gold', 'ذهب']
  },
  {
    id: 20,
    name: 'حاسبة القروض',
    nameEn: 'Loan Calculator - Calculate Monthly Payments and Interest',
    nameKey: 'calc/finance:loan-calculator.title',
    slug: 'loan-calculator',
    description: 'احسب أقساط القروض والفوائد المستحقة',
    descriptionEn: 'Calculate loan payments and interest online with our free loan calculator. Find out your monthly payment amount, total interest, and payoff schedule. Essential for personal loans, mortgages, and auto loans.',
    descriptionKey: 'calc/finance:loan-calculator.description',
    category: 'finance',
    icon: '💳',
    popularity: 8,
    componentName: 'LoanCalculator',
    keywords: ['loan', 'قرض', 'payment', 'دفعة', 'interest', 'فائدة', 'mortgage', 'رهن عقاري', 'debt', 'دين']
  },
  /*
    {
      id: 151,
      name: 'حاسبة استهلاك القرض',
      nameEn: 'Loan Amortization Calculator - Create Payment Schedule',
      nameKey: 'calc/finance:loan-amortization-calculator.title',
      slug: 'loan-amortization-calculator',
      description: 'حساب جدول استهلاك القرض',
      descriptionEn: 'Create a detailed loan amortization schedule online. See how each payment is split between principal and interest over the life of your loan. Free amortization calculator for all loan types.',
      descriptionKey: 'calc/finance:loan-amortization-calculator.description',
      category: 'finance',
      icon: '📊',
      popularity: 7,
      componentName: 'LoanAmortizationCalculator'
    },
    */
  {
    id: 152,
    name: 'حاسبة الاستثمار',
    nameEn: 'Investment Calculator - Calculate Investment Returns Online',
    nameKey: 'calc/finance:investment-calculator.title',
    slug: 'investment-calculator',
    description: 'حساب عوائد الاستثمارات',
    descriptionEn: 'Calculate investment returns and future value online. Analyze your investment growth with different contribution amounts and time periods. Free investment calculator for smart financial planning.',
    descriptionKey: 'calc/finance:investment-calculator.description',
    category: 'finance',
    icon: '💰',
    popularity: 7,
    componentName: 'InvestmentCalculator',
    keywords: ['investment', 'استثمار', 'returns', 'عوائد', 'profit', 'ربح', 'portfolio', 'محفظة', 'stocks', 'أسهم']
  },
  {
    id: 910,
    name: 'حاسبة استهلاك الوقود',
    nameEn: 'Fuel Consumption Calculator - Calculate Gas Mileage',
    nameKey: 'calc/finance:fuel-consumption-calculator.title',
    slug: 'fuel-consumption-calculator',
    description: 'حساب استهلاك الوقود للمركبات',
    descriptionEn: 'Calculate fuel consumption and gas mileage for your vehicle online. Track your fuel efficiency in MPG or L/100km. Free fuel calculator to help you save money on gas.',
    descriptionKey: 'calc/finance:fuel-consumption-calculator.description',
    category: 'finance',
    icon: '⛽',
    popularity: 8,
    componentName: 'FuelConsumptionCalculator',
    keywords: ['fuel', 'وقود', 'consumption', 'استهلاك', 'gas', 'بنزين', 'mileage', 'استهلاك', 'car', 'سيارة']
  },
  /*
    {
      id: 911,
      name: 'حاسبة تكلفة السفر',
      nameEn: 'Travel Cost Calculator - Estimate Trip Expenses Online',
      nameKey: 'calc/finance:travel-cost-calculator.title',
      slug: 'travel-cost-calculator',
      description: 'تقدير تكاليف السفر والرحلات',
      descriptionEn: 'Estimate travel and trip costs online with our free calculator. Calculate transportation, accommodation, food, and activity expenses for your vacation. Plan your travel budget effectively.',
      descriptionKey: 'calc/finance:travel-cost-calculator.description',
      category: 'finance',
      icon: '✈️',
      popularity: 7,
      componentName: 'TravelCostCalculator'
    },
    */
  /*
    {
      id: 155,
      name: 'حاسبة العُشر المسيحي',
      nameEn: 'Christian Tithe Calculator - Calculate Church Donations',
      nameKey: 'calc/finance:christian-tithe-calculator.title',
      slug: 'christian-tithe-calculator',
      description: 'حساب العُشر المسيحي للتبرعات الدينية',
      descriptionEn: 'Calculate Christian tithe and church donations based on your income. Free online tithe calculator to help you determine your religious giving according to biblical principles.',
      descriptionKey: 'calc/finance:christian-tithe-calculator.description',
      category: 'finance',
      icon: '✝️',
      popularity: 6,
      componentName: 'ChristianTitheCalculator'
    },
    */
  {
    id: 156,
    name: 'حاسبة المواريث',
    nameEn: 'Inheritance Calculator - Calculate Estate Distribution',
    nameKey: 'calc/finance:inheritance-calculator.title',
    slug: 'inheritance-calculator',
    description: 'حساب المواريث وتوزيع التركات',
    descriptionEn: 'Calculate inheritance and estate distribution online. Determine how assets should be divided among heirs according to Islamic or legal inheritance laws. Free inheritance calculator for accurate estate planning.',
    descriptionKey: 'calc/finance:inheritance-calculator.description',
    category: 'finance',
    icon: '📜',
    popularity: 7,
    componentName: 'InheritanceCalculator',
    keywords: ['inheritance', 'ميراث', 'estate', 'تركة', 'distribution', 'توزيع', 'heirs', 'ورثة', 'islamic law', 'شريعة إسلامية']
  },
];

export default financeCalculators;