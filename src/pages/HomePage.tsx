import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  ChevronRight,
  Zap,
  CheckCircle2,
  Trophy,
  ArrowRight,
  TrendingUp,
  Star
} from '@/utils/icons';
import { getCategories, getMostPopularCalculators, getCalculators } from '../data/calculators';
import SearchAutocomplete from '../components/ui/SearchAutocomplete';
import { getCalculatorName } from '../utils/calculatorTranslation';
import { getCategoryName } from '../utils/categoryTranslation';
import { getCategoryIcon } from '../utils/categoryIcons';

const HomePage = () => {
  const { t, i18n } = useTranslation(['translation', 'common']);

  // Get categories from the data source
  const featuredCategories = getCategories().slice(0, 12);

  // Get popular calculators from the data source
  const popularCalculators = getMostPopularCalculators(8);

  // Get total number of calculators dynamically
  const totalCalculators = getCalculators().length;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": t('seo.siteName'),
    "url": "https://alathasiba.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://alathasiba.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "description": t('seo.defaultDescription'),
    "inLanguage": i18n.language === 'ar' ? 'ar-SA' : 'en-US'
  };

  return (
    <>
      <Helmet>
        <title>{t('seo.defaultTitle')}</title>
        <meta name="description" content={t('seo.defaultDescription')} />
        <meta name="keywords" content={t('seo.keywords')} />
        <link rel="canonical" href="https://alathasiba.com/" />

        {/* Open Graph tags */}
        <meta property="og:title" content={t('seo.defaultTitle')} />
        <meta property="og:description" content={t('seo.defaultDescription')} />
        <meta property="og:url" content="https://alathasiba.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://alathasiba.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={t('seo.siteName') + ' - ' + t('seo.defaultDescription')} />
        <meta property="og:locale" content={i18n.language === 'ar' ? 'ar_SA' : 'en_US'} />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('seo.defaultTitle')} />
        <meta name="twitter:description" content={t('seo.defaultDescription')} />
        <meta name="twitter:image" content="https://alathasiba.com/og-image.png" />

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Hero Section - Modern & Impactful */}
      <section className="relative py-16 md:py-28 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 delay-700"></div>

        <div className="text-center max-w-5xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8 animate-bounce">
            <Star className="w-4 h-4 fill-current" />
            <span>{t('hero.newFeatures', { count: totalCalculators })}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8 text-foreground">
            {t('hero.title')}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('hero.description', { count: totalCalculators })}
          </p>

          <div className="max-w-3xl mx-auto mb-12 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/30 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-1000 group-focus-within:duration-200"></div>
            <div className="relative bg-card shadow-2xl rounded-2xl p-2 md:p-3 border border-border">
              <SearchAutocomplete
                placeholder={t('search.placeholder')}
                maxSuggestions={6}
                className="w-full"
                variant="hero"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 bg-primary text-white py-4 px-8 rounded-2xl text-lg font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:-translate-y-1"
            >
              {t('hero.browseCategories')}
              <ArrowRight className={`w-5 h-5 ${i18n.dir() === 'rtl' ? 'rotate-180' : ''}`} />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground py-4 px-8 rounded-2xl text-lg font-bold hover:bg-secondary/80 transition-all border border-border hover:-translate-y-1"
            >
              {t('hero.learnAboutUs')}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories - Visual & Modern Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('categories.featuredTitle')}</h2>
              <p className="text-lg text-muted-foreground">
                {t('categories.featuredDescription')}
              </p>
            </div>
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
            >
              {t('categories.allCategories')}
              <ChevronRight className={`w-5 h-5 ${i18n.dir() === 'rtl' ? 'rotate-180' : ''}`} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map(category => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group relative bg-card rounded-3xl p-8 border border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                    {(() => {
                      const Icon = getCategoryIcon(category.slug);
                      return <Icon />;
                    })()}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {getCategoryName(category, i18n.language)}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-1">
                    {t('categories.calculatorCount', { count: category.count })}
                  </p>
                  
                  <div className="flex items-center text-primary font-bold text-sm">
                    <span>{t('pages.category.browseAllCategories', 'Explore tools')}</span>
                    <ChevronRight className={`w-4 h-4 ${i18n.dir() === 'rtl' ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Calculators - Clean Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('calculators.popularTitle')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('calculators.popularDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCalculators.map(calculator => {
              const name = getCalculatorName(calculator, i18n.language);

              return (
                <Link
                  key={calculator.id}
                  to={`/calculator/${calculator.slug}`}
                  className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                    {calculator.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-1">
                    {name}
                  </h3>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      {t(`categoryNames.${calculator.category}`)}
                    </span>
                    <TrendingUp className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/most-used"
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground py-3 px-8 rounded-xl font-bold hover:bg-secondary/80 transition-all border border-border"
            >
              <span>{t('calculators.allPopular')}</span>
              <ChevronRight className={`w-4 h-4 ${i18n.dir() === 'rtl' ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Modern Features */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">{t('benefits.title')}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('benefits.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="relative group p-8 rounded-3xl bg-card border border-border hover:shadow-2xl transition-all duration-500">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-3xl text-blue-500 mb-8 group-hover:rotate-12 transition-transform">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('benefits.easyToUse.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('benefits.easyToUse.description')}
              </p>
            </div>

            <div className="relative group p-8 rounded-3xl bg-card border border-border hover:shadow-2xl transition-all duration-500">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-3xl text-green-500 mb-8 group-hover:rotate-12 transition-transform">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('benefits.accurate.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('benefits.accurate.description')}
              </p>
            </div>

            <div className="relative group p-8 rounded-3xl bg-card border border-border hover:shadow-2xl transition-all duration-500">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-3xl text-amber-500 mb-8 group-hover:rotate-12 transition-transform">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('benefits.free.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('benefits.free.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coffee Support Section - Emotional & Friendly */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/40 rounded-[3rem] p-10 md:p-20 border border-amber-200 dark:border-amber-700 shadow-2xl">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-2xl text-center md:text-start">
                <h2 className="text-4xl md:text-5xl font-extrabold text-amber-900 dark:text-amber-100 mb-6 leading-tight">
                  {t('support.title')}
                </h2>
                <p className="text-xl text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                  {t('support.description')}
                </p>
              </div>
              
              <a
                href="https://buymeacoffee.com/erdasolutions"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-amber-500 text-white py-5 px-10 rounded-[2rem] text-xl font-bold hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 hover:-translate-y-1 whitespace-nowrap"
              >
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  ☕
                </div>
                {t('support.supportButton')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Final Push */}
      <section className="py-24 bg-foreground text-background rounded-t-[4rem]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight">
            {t('cta.title')}
          </h2>
          <p className="text-xl md:text-2xl text-background/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t('cta.description', { count: totalCalculators })}
          </p>
          <Link
            to="/categories"
            className="inline-flex items-center gap-3 bg-primary text-white py-5 px-12 rounded-[2rem] text-xl font-bold hover:bg-primary/90 transition-all shadow-2xl shadow-primary/20 hover:-translate-y-1"
          >
            {t('cta.browseCalculators')}
            <ArrowRight className={`w-6 h-6 ${i18n.dir() === 'rtl' ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </section>
    </>
  );
};

export default HomePage;