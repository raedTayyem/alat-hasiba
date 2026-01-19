import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Search, ArrowLeft, ChevronRight } from '@/utils/icons';
import { searchCalculators } from '../data/calculators';
import { Calculator } from '../data/calculators/types';
// getCalculatorName and getCalculatorDescription are used in CalculatorCard component
import CalculatorCard from '../components/CalculatorCard';

const SearchPage = () => {
  const { t, i18n } = useTranslation(['translation', 'common']);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<Calculator[]>([]);

  useEffect(() => {
    if (query) {
      const results = searchCalculators(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [query]);

  return (
    <>
      <Helmet>
        <title>{query ? `${t('search.resultsFor')} "${query}" | ${t('siteName')}` : `${t('search.search')} | ${t('siteName')}`}</title>
        <meta
          name="description"
          content={query
            ? `${t('search.foundResults', { count: searchResults.length })} ${t('search.resultsFor')} "${query}" - ${t('siteName')}`
            : `${t('search.searchDescription')} - ${t('siteName')}`
          }
        />
        <meta name="robots" content="noindex, follow" />

        {/* Open Graph tags */}
        <meta property="og:title" content={query ? `${t('search.resultsFor')} "${query}"` : t('search.search')} />
        <meta property="og:description" content={query
          ? `${t('search.foundResults', { count: searchResults.length })} ${t('search.resultsFor')} "${query}"`
          : t('search.searchDescription')
        } />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={t('siteName')} />
        <meta property="og:image" content="https://alathasiba.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={t('pages.search.ogImageAlt')} />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={query ? `${t('search.resultsFor')} "${query}"` : t('search.search')} />
        <meta name="twitter:description" content={query
          ? `${t('search.foundResults', { count: searchResults.length })} ${t('search.resultsFor')} "${query}"`
          : t('search.searchDescription')
        } />
        <meta name="twitter:image" content="https://alathasiba.com/og-image.png" />

        {/* Canonical URL - points to base search page without query params */}
        <link rel="canonical" href={`${window.location.origin}/search`} />
      </Helmet>

      <div className="space-y-12 pb-12">
        {/* Search Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-background p-8 md:p-12 border border-primary/10">
          <div className="relative z-10 max-w-3xl">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-primary mb-6 hover:underline group">
              <ArrowLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${i18n.dir() === 'rtl' ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
              {t('breadcrumbs.home')}
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                <Search className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                {t('search.foundResults', { count: searchResults.length })}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              {t('search.resultsFor')} <span className="text-primary italic">"{query}"</span>
            </h1>
            
            {query && (
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t('search.showingResultsFor')}: <span className="font-bold text-foreground">{query}</span>
              </p>
            )}
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {searchResults.map(calculator => (
              <CalculatorCard key={calculator.id} calculator={calculator} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-[3rem] text-center px-4">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-8">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-4">{t('search.noResults')}</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
              {query
                ? `${t('search.noResultsFor')} "${query}"`
                : t('search.tryDifferent')
              }
            </p>
            <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:-translate-y-1">
              <ArrowLeft className={`w-5 h-5 ${i18n.dir() === 'rtl' ? 'rotate-180' : ''}`} />
              {t('errors.goHome')}
            </Link>
          </div>
        )}

        {/* Explore more section if few results */}
        {searchResults.length > 0 && searchResults.length < 4 && (
          <div className="bg-primary/5 rounded-3xl p-10 text-center">
            <h3 className="text-2xl font-bold mb-4">{t('calculator.relatedCalculators')}</h3>
            <Link to="/categories" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
              {t('hero.browseCategories')}
              <ChevronRight className={`w-4 h-4 ${i18n.dir() === 'rtl' ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchPage;