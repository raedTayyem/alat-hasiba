import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { TrendingUp, ArrowLeft, Search } from '@/utils/icons';
import { getMostPopularCalculators } from '../data/calculators';
import CalculatorCard from '../components/CalculatorCard';

const MostUsedPage = () => {
  const { t, i18n } = useTranslation(['translation', 'common']);
  const popularCalculators = getMostPopularCalculators(24);
  const currentLocale = i18n.language === 'ar' ? 'ar_SA' : 'en_US';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": t('pages.mostUsed.heading'),
    "description": t('pages.mostUsed.description'),
    "numberOfItems": popularCalculators.length,
    "itemListElement": popularCalculators.map((calc, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://alathasiba.com/calculator/${calc.slug}`
    }))
  };

  return (
    <>
      <Helmet>
        <title>{t('pages.mostUsed.title')} | {t('siteName')}</title>
        <meta
          name="description"
          content={t('pages.mostUsed.description')}
        />
        <meta
          name="keywords"
          content={t('pages.mostUsed.keywords')}
        />
        <link rel="canonical" href="https://alathasiba.com/most-used" />

        {/* Open Graph tags */}
        <meta property="og:title" content={`${t('pages.mostUsed.title')} | ${t('siteName')}`} />
        <meta property="og:description" content={t('pages.mostUsed.description')} />
        <meta property="og:url" content="https://alathasiba.com/most-used" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://alathasiba.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${t('pages.mostUsed.title')} - ${t('siteName')}`} />
        <meta property="og:locale" content={currentLocale} />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('pages.mostUsed.title')} | ${t('siteName')}`} />
        <meta name="twitter:description" content={t('pages.mostUsed.description')} />
        <meta name="twitter:image" content="https://alathasiba.com/og-image.png" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="space-y-12 pb-12">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-background p-8 md:p-12 border border-primary/10">
          <div className="relative z-10 max-w-3xl">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary mb-6 hover:underline group">
              <ArrowLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${i18n.dir() === 'rtl' ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
              {t('breadcrumbs.home')}
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                {t('hero.newFeatures', 'Trending Now')}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              {t('pages.mostUsed.heading')}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t('pages.mostUsed.subtitle')}
            </p>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        {popularCalculators.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {popularCalculators.map(calculator => (
              <CalculatorCard key={calculator.id} calculator={calculator} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-[3rem] text-center px-4">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-8">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-4">{t('pages.mostUsed.noCalculatorsFound')}</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
              {t('pages.mostUsed.noCalculatorsDescription')}
            </p>
            <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:-translate-y-1">
              <ArrowLeft className={`w-5 h-5 ${i18n.dir() === 'rtl' ? 'rotate-180' : ''}`} />
              {t('errors.goHome')}
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default MostUsedPage;