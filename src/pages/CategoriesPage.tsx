import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Layers } from 'lucide-react';
import { getCategories, getCalculatorsByCategory } from '../data/calculators';
import { getCalculatorName } from '../utils/calculatorTranslation';
import { getCategoryIcon } from '../utils/categoryIcons';
import { getCategoryName, getCategoryDescription } from '../utils/categoryTranslation';

const CategoriesPage = () => {
  const { t, i18n } = useTranslation([
    'translation',
    'calculators',
    'common'
  ]);
  const categories = getCategories();

  return (
    <>
      <Helmet>
        <title>{t('pages.categories.title')}</title>
        <meta name="description" content={t('pages.categories.description')} />
        <meta name="keywords" content={t('pages.categories.keywords')} />

        {/* Canonical URL */}
        <link rel="canonical" href="https://alathasiba.com/categories" />

        {/* Open Graph tags */}
        <meta property="og:title" content={t('pages.categories.title')} />
        <meta property="og:description" content={t('pages.categories.description')} />
        <meta property="og:url" content="https://alathasiba.com/categories" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://alathasiba.com/og-image.png" />
        <meta property="og:locale" content={i18n.language === 'ar' ? 'ar_SA' : 'en_US'} />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('pages.categories.title')} />
        <meta name="twitter:description" content={t('pages.categories.description')} />
        <meta name="twitter:image" content="https://alathasiba.com/og-image.png" />

        {/* Structured Data - CollectionPage schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": t('pages.categories.title', 'Calculator Categories'),
            "description": t('pages.categories.description', 'Browse all calculator categories available on our website'),
            "url": "https://alathasiba.com/categories",
            "numberOfItems": categories.length,
            "hasPart": categories.map(cat => ({
              "@type": "CollectionPage",
              "name": getCategoryName(cat, i18n.language),
              "url": `https://alathasiba.com/category/${cat.slug}`
            }))
          })}
        </script>
      </Helmet>

      <div className="space-y-12 pb-12">
        {/* Hero-like section for categories */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-background p-8 md:p-12 border border-primary/10">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 tracking-wide uppercase">
              <Layers className="w-4 h-4" />
              {t('categories.allCategories', 'All Categories')}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              {t('categories.title')}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t('pages.categories.subtitle', 'Browse calculators by category. Choose the category that fits your needs.')}
            </p>
          </div>
          {/* Decorative element */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category) => {
            const categoryCalculators = getCalculatorsByCategory(category.slug);
            const localizedName = getCategoryName(category, i18n.language);
            const localizedDesc = getCategoryDescription(category, i18n.language);

            return (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group relative flex flex-col p-8 bg-card border border-border rounded-3xl hover:border-primary/50 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl text-primary group-hover:scale-110 transition-transform duration-300">
                    {(() => {
                      const Icon = getCategoryIcon(category.slug);
                      return <Icon />;
                    })()}
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-muted text-muted-foreground tracking-tight group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {t('categories.calculatorCount', { count: categoryCalculators.length })}
                  </span>
                </div>

                <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                  {localizedName}
                </h2>
                
                <p className="text-sm text-muted-foreground mb-8 line-clamp-2 leading-relaxed">
                  {localizedDesc}
                </p>

                <div className="mt-auto space-y-4">
                  <div className="pt-4 border-t border-border">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60 mb-3 block">
                      {t('pages.categories.someCalculators', 'Featured Tools')}
                    </span>
                    <div className="space-y-2">
                      {categoryCalculators.slice(0, 3).map(calc => (
                        <div key={calc.slug} className="text-xs text-muted-foreground flex items-center gap-2 group/item">
                          <div className="w-1 h-1 bg-primary/40 rounded-full group-hover/item:bg-primary"></div>
                          <span className="truncate group-hover/item:text-foreground transition-colors">
                            {getCalculatorName(calc, i18n.language)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-primary font-bold text-sm pt-2">
                    <span className="mr-1">{t('pages.category.browseAllCategories', 'Explore category')}</span>
                    <ChevronRight className={`w-4 h-4 ${i18n.dir() === 'rtl' ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;