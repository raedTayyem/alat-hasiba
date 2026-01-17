import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Layers, Search, ArrowLeft, Home } from 'lucide-react';
import { Calculator, getCalculatorsByCategory, getCategoryBySlug } from '../data/calculators';
import CalculatorCard from '../components/CalculatorCard';
import { getCalculatorName, getCalculatorDescription } from '../utils/calculatorTranslation';
import { getCategoryName, getCategoryDescription } from '../utils/categoryTranslation';
import { siteConfig } from '../config/site';

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  // Dynamically load the category-specific namespace along with core ones
  const { t, i18n } = useTranslation(['translation', 'calculators', 'common', `calc/${categorySlug}`]);
  const [calculators, setCalculators] = useState<Calculator[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryDesc, setCategoryDesc] = useState<string>('');

  useEffect(() => {
    if (!categorySlug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const decodedCategory = decodeURIComponent(categorySlug);
    const categoryInfo = getCategoryBySlug(decodedCategory);
    const categoryCalculators = getCalculatorsByCategory(decodedCategory);

    if (categoryCalculators.length === 0) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // Sort calculators by popularity (highest first)
    const sortedCalculators = [...categoryCalculators].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    setCalculators(sortedCalculators);

    if (categoryInfo) {
      const localizedCategoryName = getCategoryName(categoryInfo, i18n.language);
      const localizedCategoryDesc = getCategoryDescription(categoryInfo, i18n.language);
      setCategoryName(localizedCategoryName);
      setCategoryDesc(localizedCategoryDesc);
      document.title = `${localizedCategoryName} | ${t('siteName')}`;
    }
    setLoading(false);
  }, [categorySlug, i18n.language, t]);

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Search className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-4">{t('pages.category.notFound')}</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-md">
          {t('pages.category.notFoundDescription')}
        </p>
        <Link to="/categories" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">
          <ArrowLeft className={`w-5 h-5 ${i18n.dir() === 'rtl' ? 'rotate-180' : ''}`} />
          {t('pages.category.browseAllCategories')}
        </Link>
      </div>
    );
  }

  const websiteUrl = siteConfig.url;
  const canonicalUrl = `${websiteUrl}/category/${categorySlug}`;

  // Create structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": categoryName || t('pages.category.defaultName'),
    "description": categoryDesc || t('pages.category.defaultDescription'),
    "url": canonicalUrl,
    "inLanguage": i18n.language === 'ar' ? 'ar-SA' : 'en-US',
    "isPartOf": {
      "@type": "WebSite",
      "name": t('siteName'),
      "url": websiteUrl
    },
    "about": calculators.map(calc => ({
      "@type": "SoftwareApplication",
      "name": getCalculatorName(calc, i18n.language),
      "applicationCategory": "Calculator",
      "operatingSystem": "Web"
    }))
  };

  // Generate breadcrumb structured data (JSON-LD)
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('breadcrumbs.home'),
        item: websiteUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('breadcrumbs.categories'),
        item: `${websiteUrl}/categories`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryName,
        item: canonicalUrl
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{categoryName ? t('seo.categoryTitle', { category: categoryName }) : t('pages.category.notFoundTitle')}</title>
        <meta name="description" content={categoryDesc || t('pages.category.defaultMetaDescription')} />
        <meta name="keywords" content={t('pages.category.metaKeywords', { category: categoryName })} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph tags */}
        <meta property="og:title" content={t('seo.categoryTitle', { category: categoryName })} />
        <meta property="og:description" content={categoryDesc || t('pages.category.defaultMetaDescription')} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />

        {/* Twitter card tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={t('seo.categoryTitle', { category: categoryName })} />
        <meta name="twitter:description" content={categoryDesc || t('pages.category.defaultMetaDescription')} />

        {/* Structured data for search engines */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>

        {/* Breadcrumb structured data for search engines */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      </Helmet>

      {/* Visual Breadcrumb Navigation */}
      <nav
        aria-label={t('breadcrumbs.category')}
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

          {/* Categories */}
          <li className="flex items-center">
            <Link
              to="/categories"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {t('breadcrumbs.categories')}
            </Link>
          </li>

          {/* Separator */}
          <li className="flex items-center text-muted-foreground/50" aria-hidden="true">
            <ChevronRight className={`w-4 h-4 ${i18n.dir() === 'rtl' ? 'rotate-180' : ''}`} />
          </li>

          {/* Current Category (not a link) */}
          <li className="flex items-center">
            <span
              className="text-foreground font-medium truncate max-w-[200px] sm:max-w-[300px]"
              aria-current="page"
            >
              {categoryName}
            </span>
          </li>
        </ol>
      </nav>

      <div className="space-y-12 pb-12">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-background p-8 md:p-12 border border-primary/10">
          <div className="relative z-10 max-w-3xl">
            <Link to="/categories" className="inline-flex items-center gap-2 text-sm font-bold text-primary mb-6 hover:underline group">
              <ArrowLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${i18n.dir() === 'rtl' ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
              {t('breadcrumbs.categories')}
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                {t('categories.calculatorCount', { count: calculators.length })}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              {categoryName}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {categoryDesc || t('pages.category.defaultCategoryDescription', { category: categoryName })}
            </p>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        {/* Calculators Grid */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse bg-card border border-border rounded-3xl p-8 h-64">
                  <div className="w-14 h-14 bg-muted rounded-2xl mb-6"></div>
                  <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {calculators.map(calculator => (
                <CalculatorCard key={calculator.slug} calculator={calculator} />
              ))}
            </div>
          )}
        </div>

        {/* AdSense-friendly content section */}
        <section className="pt-12 border-t border-border">
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-primary rounded-full"></div>
              {t('pages.category.aboutCategory', { category: categoryName })}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                <p className="mb-6">
                  {t('pages.category.aboutParagraph1', { category: categoryName })}
                </p>
                <p>
                  {t('pages.category.aboutParagraph2', { category: categoryName })}
                </p>
              </div>
              
              {calculators.length >= 5 && (
                <div className="bg-muted/30 rounded-2xl p-8 border border-border/50">
                  <h3 className="text-xl font-bold mb-6 text-foreground">{t('pages.category.topCalculators', { category: categoryName })}</h3>
                  <div className="space-y-4">
                    {calculators.slice(0, 5).map((calc, idx) => (
                      <Link 
                        key={calc.id} 
                        to={`/calculator/${calc.slug}`} 
                        className="group flex items-center gap-4 p-3 rounded-xl hover:bg-card hover:shadow-md transition-all duration-200"
                      >
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {getCalculatorName(calc, i18n.language)}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {getCalculatorDescription(calc, i18n.language)}
                          </p>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity ${i18n.dir() === 'rtl' ? 'rotate-180' : ''}`} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CategoryPage;