'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Home, ChevronDown, Lightbulb, AlertTriangle, BookOpen, Target } from 'lucide-react';
import { getCalculatorComponentBySlug, getRelatedCalculators } from '../utils/calculatorLoader';
import CalculatorSkeleton from '../components/CalculatorSkeleton';
import { Calculator, getCategoryBySlug, getCalculatorBySlug } from '../data/calculators';
import { getCalculatorName, getCalculatorDescription } from '../utils/calculatorTranslation';
import { getCategoryName } from '../utils/categoryTranslation';
import { generateFAQStructuredData, generateHowToStructuredData } from '../utils/seoUtils';

// Types for rich content
interface HowItWorks {
  title: string;
  formula?: string;
  explanation: string;
  steps?: { name: string; text: string }[];
}

// UseCase can be a string or various object formats
type UseCase = string | { title: string; description?: string; items?: string[] };

// Tip can be a string or an object with title/description
type Tip = string | { title: string; description?: string };

// CommonMistake can be a string or an object with mistake/solution or title/description
type CommonMistake = string | { mistake: string; solution?: string } | { title: string; description: string };

interface RichContent {
  howItWorks?: HowItWorks;
  useCases?: UseCase[];
  tips?: Tip[];
  commonMistakes?: CommonMistake[];
}

// Helper to get use case title from various formats
function getUseCaseTitle(useCase: UseCase): string {
  if (typeof useCase === 'string') return useCase;
  if ('title' in useCase) return useCase.title;
  return String(useCase);
}

// Helper to get use case description from various formats
function getUseCaseDescription(useCase: UseCase): string | null {
  if (typeof useCase === 'string') return null;
  if ('description' in useCase && useCase.description) return useCase.description;
  if ('items' in useCase && Array.isArray(useCase.items)) return useCase.items.join(', ');
  return null;
}

// Helper to get tip text from various formats
function getTipText(tip: Tip): string {
  if (typeof tip === 'string') return tip;
  if ('title' in tip) {
    if (tip.description) return `${tip.title}: ${tip.description}`;
    return tip.title;
  }
  return String(tip);
}

// Helper to get mistake text from various formats
function getMistakeText(mistake: CommonMistake): string {
  if (typeof mistake === 'string') return mistake;
  if ('mistake' in mistake) return mistake.mistake;
  if ('title' in mistake) return mistake.title;
  return String(mistake);
}

const CalculatorPage = () => {
  const { calculatorSlug } = useParams<{ calculatorSlug: string }>();
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [calculatorComponent, setCalculatorComponent] = useState<React.ComponentType | null>(null);
  const [calculatorData, setCalculatorData] = useState<{
    title: string;
    description: string;
    category: string;
    slug: string;
    keywords?: string[];
  } | null>(null);
  const [relatedCalculators, setRelatedCalculators] = useState<Calculator[]>([]);
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [richContent, setRichContent] = useState<RichContent>({});
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadCalculator = async () => {
      if (!calculatorSlug) {
        setIsNotFound(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setIsNotFound(false);

      try {
        const result = await getCalculatorComponentBySlug(calculatorSlug, i18n.language);

        if (!result) {
          setIsNotFound(true);
          setIsLoading(false);
          return;
        }

        setCalculatorComponent(() => result.component);

        // Get the full calculator data including keywords
        const fullCalculatorData = getCalculatorBySlug(calculatorSlug);

        setCalculatorData({
          title: result.title,
          description: result.description,
          category: result.category,
          slug: result.slug,
          keywords: fullCalculatorData?.keywords
        });

        // Get related calculators
        const related = getRelatedCalculators(calculatorSlug);
        setRelatedCalculators(related);

        // Load the category-specific namespace
        if (result.category) {
          await i18n.loadNamespaces(`calc/${result.category}`);

          // Try to load FAQs from the translation namespace
          // The translation key format varies by calculator, so we try multiple patterns
          const slugToKey = result.slug.replace(/-/g, '_');
          const possibleKeys = [
            `calc/${result.category}:${slugToKey}.faqs`,
            `calc/${result.category}:${result.slug.replace(/-calculator/g, '').replace(/-/g, '_')}.faqs`,
            `calc/${result.category}:${result.slug.replace(/-calculator/g, '').replace(/_calculator/g, '').replace(/-/g, '_')}.faqs`
          ];

          let loadedFaqs: { question: string; answer: string }[] = [];
          for (const key of possibleKeys) {
            const faqsData = i18n.t(key, { returnObjects: true, defaultValue: null }) as unknown;
            if (Array.isArray(faqsData) && faqsData.length > 0 && typeof faqsData[0] === 'object' && faqsData[0] !== null && 'question' in faqsData[0]) {
              loadedFaqs = faqsData as { question: string; answer: string }[];
              break;
            }
          }
          setFaqs(loadedFaqs);

          // Load rich content (howItWorks, useCases, tips, commonMistakes)
          const loadedRichContent: RichContent = {};
          const baseKey = slugToKey;
          const altKey = result.slug.replace(/-calculator/g, '').replace(/-/g, '_');

          // Try to load howItWorks
          for (const key of [baseKey, altKey]) {
            const howItWorksData = i18n.t(`calc/${result.category}:${key}.howItWorks`, { returnObjects: true, defaultValue: null }) as unknown;
            if (howItWorksData && typeof howItWorksData === 'object' && 'title' in (howItWorksData as Record<string, unknown>)) {
              loadedRichContent.howItWorks = howItWorksData as HowItWorks;
              break;
            }
          }

          // Try to load useCases
          for (const key of [baseKey, altKey]) {
            const useCasesData = i18n.t(`calc/${result.category}:${key}.useCases`, { returnObjects: true, defaultValue: null }) as unknown;
            if (Array.isArray(useCasesData) && useCasesData.length > 0) {
              loadedRichContent.useCases = useCasesData as UseCase[];
              break;
            }
          }

          // Try to load tips
          for (const key of [baseKey, altKey]) {
            const tipsData = i18n.t(`calc/${result.category}:${key}.seoTips`, { returnObjects: true, defaultValue: null }) as unknown;
            if (Array.isArray(tipsData) && tipsData.length > 0) {
              loadedRichContent.tips = tipsData as string[];
              break;
            }
          }

          // Try to load commonMistakes
          for (const key of [baseKey, altKey]) {
            const mistakesData = i18n.t(`calc/${result.category}:${key}.commonMistakes`, { returnObjects: true, defaultValue: null }) as unknown;
            if (Array.isArray(mistakesData) && mistakesData.length > 0) {
              loadedRichContent.commonMistakes = mistakesData as string[];
              break;
            }
          }

          setRichContent(loadedRichContent);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading calculator:', error);
        setIsNotFound(true);
        setIsLoading(false);
      }
    };

    loadCalculator();
  }, [calculatorSlug, i18n.language]);

  if (isLoading) {
    return (
      <div className="w-full px-4 md:px-6 lg:px-8 mx-auto">
        <CalculatorSkeleton />
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="w-full px-4 md:px-6 lg:px-8 mx-auto">
        <Helmet>
          <title>{t('calculator.notFound')}</title>
          <meta name="description" content={t('calculator.notFoundDescription')} />
        </Helmet>
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('calculator.notFound')}</h1>
          <p className="text-foreground-70 mb-6">
            {t('calculator.notFoundDescription')}
          </p>
          <Link
            to="/"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover transition duration-200"
          >
            {t('errors.goHome')}
          </Link>
        </div>
      </div>
    );
  }

  if (!calculatorComponent || !calculatorData) {
    return null;
  }

  const CalculatorComponent = calculatorComponent;

  // Get category information for breadcrumb
  const categoryInfo = getCategoryBySlug(calculatorData.category);
  const categoryName = categoryInfo
    ? getCategoryName(categoryInfo, i18n.language)
    : calculatorData.category;

  // Base URL for structured data and canonical
  const baseUrl = 'https://alathasiba.com';
  const canonicalUrl = `${baseUrl}/calculator/${calculatorData.slug}`;
  const ogLocale = i18n.language === 'ar' ? 'ar_SA' : 'en_US';
  const pageTitle = `${calculatorData.title} - ${t('seo.siteName')}`;

  // Generate breadcrumb structured data (JSON-LD)
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('breadcrumbs.home'),
        item: baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryName,
        item: `${baseUrl}/category/${calculatorData.category}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: calculatorData.title,
        item: `${baseUrl}/calculator/${calculatorData.slug}`
      }
    ]
  };

  // Generate FAQ structured data (JSON-LD) if FAQs are available
  const faqStructuredData = faqs.length > 0 ? generateFAQStructuredData(faqs) : null;

  // Generate HowTo structured data (JSON-LD) if howItWorks with steps is available
  const howToStructuredData = richContent.howItWorks?.steps && richContent.howItWorks.steps.length > 0
    ? generateHowToStructuredData(
        richContent.howItWorks.title,
        richContent.howItWorks.steps,
        'PT5M',
        richContent.howItWorks.explanation,
        i18n.language
      )
    : null;

  return (
    <div className="w-full max-w-full px-4 md:px-6 lg:px-8 mx-auto">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={calculatorData.description} />
        {/* Keywords meta tag */}
        {calculatorData.keywords && calculatorData.keywords.length > 0 && (
          <meta name="keywords" content={calculatorData.keywords.join(', ')} />
        )}
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={calculatorData.description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://alathasiba.com/og-image.png" />
        <meta property="og:locale" content={ogLocale} />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={calculatorData.description} />

        {/* Breadcrumb Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
        {/* FAQ Structured Data for SEO */}
        {faqStructuredData && (
          <script type="application/ld+json">
            {JSON.stringify(faqStructuredData)}
          </script>
        )}
        {/* HowTo Structured Data for SEO */}
        {howToStructuredData && (
          <script type="application/ld+json">
            {JSON.stringify(howToStructuredData)}
          </script>
        )}
      </Helmet>

      {/* Visual Breadcrumb Navigation */}
      <nav
        aria-label={t('breadcrumbs.calculator')}
        className="mb-6"
      >
        <ol className="flex flex-wrap items-center gap-1 text-sm">
          {/* Home */}
          <li className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors duration-200 group"
              aria-label={t('breadcrumbs.home')}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">{t('breadcrumbs.home')}</span>
            </Link>
          </li>

          {/* Separator */}
          <li className="flex items-center text-muted-foreground/50" aria-hidden="true">
            <ChevronRight className={`w-4 h-4 ${i18n.dir() === 'rtl' ? 'rotate-180' : ''}`} />
          </li>

          {/* Category */}
          <li className="flex items-center">
            <Link
              to={`/category/${calculatorData.category}`}
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {categoryName}
            </Link>
          </li>

          {/* Separator */}
          <li className="flex items-center text-muted-foreground/50" aria-hidden="true">
            <ChevronRight className={`w-4 h-4 ${i18n.dir() === 'rtl' ? 'rotate-180' : ''}`} />
          </li>

          {/* Current Calculator (not a link) */}
          <li className="flex items-center">
            <span
              className="text-foreground font-medium truncate max-w-[200px] sm:max-w-[300px]"
              aria-current="page"
            >
              {calculatorData.title}
            </span>
          </li>
        </ol>
      </nav>

      <div className="mb-8">
        <Suspense fallback={<CalculatorSkeleton />}>
          <CalculatorComponent />
        </Suspense>
      </div>

      {/* Rich Content Sections for SEO */}
      <div className="space-y-8 mt-12">
        {/* How It Works Section */}
        {richContent.howItWorks && (
          <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-2.5 rounded-xl">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold">{richContent.howItWorks.title}</h2>
            </div>

            {richContent.howItWorks.formula && (
              <div className="bg-muted/50 rounded-xl p-4 mb-6 font-mono text-center text-lg border border-border/50">
                {richContent.howItWorks.formula}
              </div>
            )}

            <p className="text-foreground-70 leading-relaxed mb-6">
              {richContent.howItWorks.explanation}
            </p>

            {richContent.howItWorks.steps && richContent.howItWorks.steps.length > 0 && (
              <ol className="space-y-4">
                {richContent.howItWorks.steps.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold mb-1">{step.name}</h3>
                      <p className="text-foreground-70 text-sm">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        )}

        {/* Use Cases Section */}
        {richContent.useCases && richContent.useCases.length > 0 && (
          <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-500/10 p-2.5 rounded-xl">
                <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold">{t('calculator.useCases', 'Use Cases')}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {richContent.useCases.map((useCase, index) => {
                const title = getUseCaseTitle(useCase);
                const description = getUseCaseDescription(useCase);
                return (
                  <div key={index} className="bg-muted/30 rounded-xl p-4 border border-border/50">
                    <h3 className="font-semibold mb-2">{title}</h3>
                    {description && <p className="text-foreground-70 text-sm">{description}</p>}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Tips Section */}
        {richContent.tips && richContent.tips.length > 0 && (
          <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-500/10 p-2.5 rounded-xl">
                <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold">{t('calculator.tips', 'Tips & Best Practices')}</h2>
            </div>

            <ul className="space-y-3">
              {richContent.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  <p className="text-foreground-70">{getTipText(tip)}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Common Mistakes Section */}
        {richContent.commonMistakes && richContent.commonMistakes.length > 0 && (
          <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-500/10 p-2.5 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold">{t('calculator.commonMistakes', 'Common Mistakes to Avoid')}</h2>
            </div>

            <ul className="space-y-3">
              {richContent.commonMistakes.map((mistake, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </span>
                  <p className="text-foreground-70">{getMistakeText(mistake)}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <section className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500/10 p-2.5 rounded-xl">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-bold">{t('calculator.faq', 'Frequently Asked Questions')}</h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-border/50 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-start hover:bg-muted/30 transition-colors"
                  >
                    <span className="font-medium pe-4">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaqIndex === index && (
                    <div className="px-4 pb-4 text-foreground-70 border-t border-border/50 pt-4 bg-muted/20">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Buy Me a Coffee Support Button */}
      <div className="mt-12 mb-12 bg-gradient-to-r from-amber-100/50 to-amber-200/50 dark:from-amber-900/30 dark:to-amber-800/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-8 text-center shadow-lg shadow-amber-500/5 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-start">
            <div className="bg-amber-100 dark:bg-amber-900/50 p-3 rounded-full">
              <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 01-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38 0 0 1.243.065 1.658.065.447 0 1.786-.065 1.786-.065.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 00-1.322-.238c-.826 0-1.491.284-2.26.613z" />
              </svg>
            </div>
            <div className="text-start">
              <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">{t('calculator.supportUs')}</h3>
              <p className="text-amber-700/80 dark:text-amber-300/80">{t('support.description')}</p>
            </div>
          </div>
          <a
            href="https://buymeacoffee.com/erdasolutions"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:-translate-y-1 flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.5 6.75V0h9v6.75h-9zm9 13.5h1.5a3 3 0 0 0 3-3v-6a.75.75 0 0 0-.75-.75h-1.5v9.75zm1.5 1.5a4.5 4.5 0 0 1-4.5-4.5V15h-9v2.25a4.5 4.5 0 0 1-4.5 4.5H0v1.5h24v-1.5h-6z" />
            </svg>
            {t('support.supportButton')}
          </a>
        </div>
      </div>

      {relatedCalculators.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-primary rounded-full"></div>
            <h3 className="text-2xl font-bold">{t('calculator.relatedCalculators')}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedCalculators.map((calculator) => {
              const name = getCalculatorName(calculator, i18n.language);
              const description = getCalculatorDescription(calculator, i18n.language);

              return (
                <Link
                  key={calculator.id}
                  to={`/calculator/${calculator.slug}`}
                  className="group bg-card hover:bg-card/80 border border-border hover:border-primary/30 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/5 p-3 rounded-xl group-hover:bg-primary/10 transition-colors">
                      <span className="text-primary text-2xl">{calculator.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{name}</h3>
                      <p className="text-sm text-foreground-70 line-clamp-2 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculatorPage; 