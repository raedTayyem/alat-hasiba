/**
 * SEO Utilities for Enhanced Search Engine Optimization
 * Provides comprehensive SEO metadata, structured data, and optimization functions
 */

interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  locale?: string;
}

interface CalculatorSEO {
  name: string;
  description: string;
  category: string;
  keywords: string[];
  useCases: string[];
  relatedCalculators?: string[];
}

/**
 * Generate comprehensive SEO metadata for a calculator page
 */
export function generateCalculatorSEO(calculator: CalculatorSEO, slug: string, language: string = 'ar'): SEOMetadata {
  const baseUrl = 'https://alathasiba.com';
  const title = `${calculator.name} | آلات حاسبة - حاسبات دقيقة ومجانية`;
  const description = `${calculator.description} - استخدم ${calculator.name} المجاني والدقيق لحساباتك. ${calculator.useCases.slice(0, 2).join('، ')}.`;

  return {
    title,
    description,
    keywords: [
      calculator.name,
      ...calculator.keywords,
      'آلة حاسبة',
      'حاسبة مجانية',
      'حاسبة دقيقة',
      calculator.category,
      'حاسبة أونلاين',
      'أدوات حساب'
    ],
    canonicalUrl: `${baseUrl}/calculator/${slug}`,
    ogImage: `${baseUrl}/images/og/${slug}.png`,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    author: 'آلات حاسبة',
    locale: language === 'en' ? 'en_US' : 'ar_SA',
    modifiedTime: new Date().toISOString()
  };
}

/**
 * Generate JSON-LD structured data for calculator
 */
export function generateCalculatorStructuredData(calculator: CalculatorSEO, slug: string, language: string = 'ar') {
  const baseUrl = 'https://alathasiba.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: calculator.name,
    description: calculator.description,
    url: `${baseUrl}/calculator/${slug}`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    publisher: {
      '@type': 'Organization',
      name: 'آلات حاسبة',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    inLanguage: language === 'en' ? 'en' : 'ar',
    isAccessibleForFree: true,
    keywords: calculator.keywords.join(', ')
  };
}

/**
 * Generate FAQ structured data for calculator page
 */
export function generateFAQStructuredData(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  const baseUrl = 'https://alathasiba.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`
    }))
  };
}

/**
 * Generate HowTo structured data for calculator usage
 * Supports translations from locale files with howto object structure
 */
export function generateHowToStructuredData(
  name: string,
  steps: { name: string; text: string }[],
  totalTime?: string,
  description?: string,
  language: string = 'ar'
) {
  const baseUrl = 'https://alathasiba.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: name,
    ...(description && { description: description }),
    inLanguage: language === 'en' ? 'en' : 'ar',
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text
    })),
    totalTime: totalTime || 'PT2M' // Default 2 minutes
  };
}

export default {
  generateCalculatorSEO,
  generateCalculatorStructuredData,
  generateFAQStructuredData,
  generateBreadcrumbStructuredData,
  generateHowToStructuredData
};
