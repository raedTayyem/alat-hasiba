/**
 * Smart Gumroad Products Database
 *
 * This system intelligently matches digital products to calculator usage.
 * Add new products here as you create them on Gumroad.
 */

export interface DigitalProduct {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  gumroadUrl: string; // Your Gumroad product link

  // Smart targeting
  categories: string[]; // Which calculator categories to show this on
  priority: number; // 1-10, higher = shown first

  // Conditional display logic
  showWhen?: {
    resultValueMin?: number; // Show when result value is above this
    resultValueMax?: number; // Show when result value is below this
    calculatorSlugs?: string[]; // Show only on specific calculators
    excludeCalculators?: string[]; // Don't show on these calculators
  };

  // Display settings
  displayType: 'premium-export' | 'sidebar-card' | 'post-calculation-modal' | 'exit-intent' | 'all';

  // Content
  features: string[];
  featuresAr: string[];
  badge?: string; // e.g., "BESTSELLER", "NEW", "LIMITED"
  badgeAr?: string;

  // Analytics
  conversionRate?: number; // Track conversion rate over time
  revenue?: number; // Track total revenue
}

// Your products database - add more as you create them
export const digitalProducts: DigitalProduct[] = [
  {
    id: 'finance-pdf-guide',
    name: 'Complete Financial Planning Guide',
    nameAr: 'دليل التخطيط المالي الكامل',
    description: 'Professional 50-page PDF guide with actionable strategies for managing your finances, budgeting, and wealth building.',
    descriptionAr: 'دليل PDF احترافي من 50 صفحة مع استراتيجيات عملية لإدارة أموالك والميزانية وبناء الثروة.',
    price: 9.99,
    gumroadUrl: 'PLACEHOLDER_FINANCE_PDF', // User will provide this

    // Show on ALL finance and real estate calculators
    categories: ['finance', 'real-estate', 'business'],
    priority: 10, // Highest priority - show this first

    showWhen: {
      // Show to everyone (no conditions)
    },

    displayType: 'all', // Show in all positions

    features: [
      '50+ pages of actionable financial strategies',
      'Budget planning templates included',
      'Investment roadmap for beginners',
      'Debt payoff strategies',
      'Instant PDF download'
    ],
    featuresAr: [
      '50+ صفحة من الاستراتيجيات المالية القابلة للتنفيذ',
      'قوالب تخطيط الميزانية مضمنة',
      'خارطة طريق الاستثمار للمبتدئين',
      'استراتيجيات سداد الديون',
      'تنزيل PDF فوري'
    ],

    badge: 'MOST POPULAR',
    badgeAr: 'الأكثر شعبية'
  },

  // Real Estate Analysis Suite
  {
    id: 'real-estate-excel-suite',
    name: 'Real Estate Investment Analysis Suite',
    nameAr: 'حزمة تحليل الاستثمار العقاري',
    description: 'Complete Excel toolkit with mortgage calculator, ROI analysis, cash flow projections, and property comparison tools.',
    descriptionAr: 'مجموعة أدوات Excel كاملة مع حاسبة الرهن العقاري وتحليل العائد على الاستثمار وتوقعات التدفق النقدي وأدوات مقارنة العقارات.',
    price: 14.99,
    gumroadUrl: 'https://gumroad.com/l/real-estate-analysis-suite',

    categories: ['real-estate', 'finance'],
    priority: 9,

    showWhen: {
      calculatorSlugs: [
        'mortgage-calculator-advanced',
        'rental-property-roi-calculator',
        'property-investment-calculator',
        'mortgage-calculator',
        'rent-vs-buy-calculator'
      ]
    },

    displayType: 'post-calculation-modal',

    features: [
      'Professional Excel templates',
      'Automatic amortization schedules',
      'Cash flow analysis with charts',
      'Property comparison matrix',
      'Lifetime updates included'
    ],
    featuresAr: [
      'قوالب Excel احترافية',
      'جداول إطفاء تلقائية',
      'تحليل التدفق النقدي مع الرسوم البيانية',
      'مصفوفة مقارنة العقارات',
      'تحديثات مدى الحياة مضمنة'
    ],

    badge: 'PROFESSIONAL',
    badgeAr: 'احترافي'
  },

  // Fitness & Nutrition Tracker
  {
    id: 'fitness-tracker-template',
    name: 'Complete Fitness & Nutrition Tracker',
    nameAr: 'متتبع اللياقة البدنية والتغذية الكامل',
    description: 'Google Sheets template with TDEE, macro tracking, workout planning, and progress visualization.',
    descriptionAr: 'قالب Google Sheets مع TDEE وتتبع الماكرو وتخطيط التمرين وتصور التقدم.',
    price: 9.99,
    gumroadUrl: 'https://gumroad.com/l/fitness-nutrition-tracker',

    categories: ['fitness', 'health'],
    priority: 8,

    showWhen: {
      calculatorSlugs: [
        'tdee-calculator',
        'bmr-calculator',
        'macro-calculator',
        'calorie-calculator',
        'bmi-calculator',
        'body-fat-calculator'
      ]
    },

    displayType: 'sidebar-card',

    features: [
      'Automated macro calculations',
      'Progress tracking with charts',
      '12-week meal planning template',
      'Workout log with auto-progression',
      'Body measurements tracker'
    ],
    featuresAr: [
      'حسابات الماكرو التلقائية',
      'تتبع التقدم مع الرسوم البيانية',
      'قالب تخطيط وجبات 12 أسبوع',
      'سجل التمرين مع التقدم التلقائي',
      'متتبع قياسات الجسم'
    ],

    badge: 'NEW',
    badgeAr: 'جديد'
  },

  // Business Planning Toolkit
  {
    id: 'business-planning-toolkit',
    name: 'Business Planning Toolkit',
    nameAr: 'مجموعة أدوات تخطيط الأعمال',
    description: 'Comprehensive business planning templates including financial projections, break-even analysis, and startup cost worksheets.',
    descriptionAr: 'قوالب شاملة لتخطيط الأعمال تشمل التوقعات المالية وتحليل نقطة التعادل وأوراق عمل تكاليف بدء التشغيل.',
    price: 19.99,
    gumroadUrl: 'https://gumroad.com/l/business-planning-toolkit',

    categories: ['business', 'finance'],
    priority: 8,

    showWhen: {
      calculatorSlugs: [
        'break-even-calculator',
        'profit-margin-calculator',
        'roi-calculator',
        'business-loan-calculator',
        'startup-cost-calculator',
        'cash-flow-calculator'
      ]
    },

    displayType: 'sidebar-card',

    features: [
      'Complete business plan template',
      'Financial projection spreadsheets',
      'Break-even analysis tools',
      'Startup cost calculator',
      'Cash flow forecasting templates'
    ],
    featuresAr: [
      'قالب خطة عمل كامل',
      'جداول بيانات التوقعات المالية',
      'أدوات تحليل نقطة التعادل',
      'حاسبة تكاليف بدء التشغيل',
      'قوالب توقعات التدفق النقدي'
    ],

    badge: 'BESTSELLER',
    badgeAr: 'الأكثر مبيعاً'
  }
];

/**
 * Smart Product Recommendation Engine
 *
 * This function determines which products to show based on:
 * - Calculator category
 * - Result value
 * - Calculator slug
 * - Priority ranking
 */
export function getRecommendedProducts(
  category: string,
  calculatorSlug?: string,
  resultValue?: number | string
): DigitalProduct[] {
  const matchedProducts = digitalProducts.filter(product => {
    // Check category match
    const categoryMatch =
      product.categories.includes('all') ||
      product.categories.includes(category);

    if (!categoryMatch) return false;

    // Check calculator-specific targeting
    if (product.showWhen?.calculatorSlugs && calculatorSlug) {
      if (!product.showWhen.calculatorSlugs.includes(calculatorSlug)) {
        return false;
      }
    }

    // Check calculator exclusions
    if (product.showWhen?.excludeCalculators && calculatorSlug) {
      if (product.showWhen.excludeCalculators.includes(calculatorSlug)) {
        return false;
      }
    }

    // Check result value conditions
    if (typeof resultValue === 'number') {
      if (product.showWhen?.resultValueMin && resultValue < product.showWhen.resultValueMin) {
        return false;
      }
      if (product.showWhen?.resultValueMax && resultValue > product.showWhen.resultValueMax) {
        return false;
      }
    }

    return true;
  });

  // Sort by priority (highest first)
  matchedProducts.sort((a, b) => b.priority - a.priority);

  return matchedProducts;
}

/**
 * Get product for specific display type
 */
export function getProductByDisplayType(
  displayType: DigitalProduct['displayType'],
  category: string,
  calculatorSlug?: string,
  resultValue?: number | string
): DigitalProduct | null {
  const products = getRecommendedProducts(category, calculatorSlug, resultValue);

  const filtered = products.filter(
    p => p.displayType === displayType || p.displayType === 'all'
  );

  return filtered.length > 0 ? filtered[0] : null;
}

/**
 * Track product impression (for analytics)
 */
export function trackProductImpression(productId: string, location: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      product_id: productId,
      location: location
    });
  }
}

/**
 * Track product click (for analytics)
 */
export function trackProductClick(productId: string, productName: string, price: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: price,
      items: [{
        item_id: productId,
        item_name: productName,
        price: price
      }]
    });
  }
}
