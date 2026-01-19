import { Calculator } from './types';

/**
 * Statistics & Probability Calculators (0 calculators)
 * Comprehensive statistical analysis and probability calculation tools
 */
const statisticsCalculators: Calculator[] = [
    {
        id: 111,
        name: 'حاسبة الاحتمالات',
        nameEn: 'Probability Calculator - Calculate Probability Distributions',
        nameKey: 'calc/statistics:probability-calculator.title',
        slug: 'probability-calculator',
        description: 'حساب الاحتمالات والتوزيعات الاحتمالية',
        descriptionEn: 'Calculate probabilities and probability distributions online. Solve probability problems including binomial, normal, and Poisson distributions. Perfect for statistics and probability courses.',
        descriptionKey: 'calc/statistics:probability-calculator.description',
        category: 'statistics',
        icon: '🎲',
        popularity: 6,
        componentName: 'ProbabilityCalculator',
        keywords: ['probability', 'احتمال', 'distribution', 'توزيع', 'statistics', 'إحصاء', 'binomial', 'ثنائي', 'normal', 'طبيعي']
    },
    {
        id: 112,
        name: 'حاسبة الإحصاء',
        nameEn: 'Statistics Calculator - Statistical Analysis and Calculations',
        nameKey: 'calc/statistics:statistics-calculator.title',
        slug: 'statistics-calculator',
        description: 'العمليات الإحصائية والتحليل الإحصائي',
        descriptionEn: 'Perform statistical calculations and analysis online with our free statistics calculator. Calculate mean, median, standard deviation, variance, and more. Essential for students and data analysts.',
        descriptionKey: 'calc/statistics:statistics-calculator.description',
        category: 'statistics',
        icon: '📊',
        popularity: 6,
        componentName: 'StatisticsCalculator',
        keywords: ['statistics', 'إحصاء', 'mean', 'متوسط', 'median', 'وسيط', 'deviation', 'انحراف', 'variance', 'تباين']
    },
    {
        id: 113,
        name: 'حاسبة الإحصاء الوصفي',
        nameEn: 'Descriptive Statistics Calculator - Mean, Median, Mode Online',
        nameKey: 'calc/statistics:descriptive-statistics-calculator.title',
        slug: 'descriptive-statistics-calculator',
        description: 'حساب مقاييس الإحصاء الوصفي',
        descriptionEn: 'Calculate descriptive statistics online including mean, median, mode, range, and quartiles. Analyze your data set quickly with our free descriptive statistics calculator.',
        descriptionKey: 'calc/statistics:descriptive-statistics-calculator.description',
        category: 'statistics',
        icon: '📊',
        popularity: 5,
        componentName: 'DescriptiveStatisticsCalculator',
        keywords: ['descriptive', 'وصفي', 'statistics', 'إحصاء', 'mean', 'متوسط', 'median', 'وسيط', 'mode', 'منوال']
    },
    {
        id: 12003,
        name: 'Confidence Interval Calculator',
        nameEn: 'Confidence Interval Calculator',
        nameKey: 'calc/statistics:confidence_interval.title',
        slug: 'confidence-interval-calculator',
        description: 'Calculate confidence intervals for mean and proportion.',
        descriptionEn: 'Calculate confidence intervals for mean and proportion.',
        descriptionKey: 'calc/statistics:confidence_interval.description',
        category: 'statistics',
        icon: '📊',
        popularity: 5,
        componentName: 'ConfidenceIntervalCalculator',
        keywords: ['confidence', 'ثقة', 'interval', 'فترة', 'statistics', 'إحصاء', 'mean', 'متوسط', 'proportion', 'نسبة']
    },
    {
        id: 12004,
        name: 'Sample Size Calculator',
        nameEn: 'Sample Size Calculator',
        nameKey: 'calc/statistics:sample_size.title',
        slug: 'sample-size-calculator',
        description: 'Determine the sample size required for a survey or experiment.',
        descriptionEn: 'Determine the sample size required for a survey or experiment.',
        descriptionKey: 'calc/statistics:sample_size.description',
        category: 'statistics',
        icon: '👥',
        popularity: 6,
        componentName: 'SampleSizeCalculator',
        keywords: ['sample', 'عينة', 'size', 'حجم', 'survey', 'استبيان', 'experiment', 'تجربة', 'statistics', 'إحصاء']
    }
];

export default statisticsCalculators;
