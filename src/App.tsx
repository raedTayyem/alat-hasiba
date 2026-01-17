import React, { Suspense, useEffect, useMemo } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { initDateInputRTL } from './utils/dateInputRTL';
import './i18n/config'; // Initialize i18n
import { siteConfig } from './config/site';

import { ThemeProvider } from './components/ThemeProvider';
import { ToastProvider } from './components/ui/Toast';
import Header from './components/Header';
import Footer from './components/Footer';
// Lazy load page components with error boundaries
import ErrorFallback from './components/ErrorFallback';

const HomePage = React.lazy(() => 
  import('./pages/HomePage').catch(err => {
    console.error('Error loading HomePage:', err);
    return { default: () => <ErrorFallback /> };
  })
);
const CategoriesPage = React.lazy(() => 
  import('./pages/CategoriesPage').catch(err => {
    console.error('Error loading CategoriesPage:', err);
    return { default: () => <ErrorFallback /> };
  })
);
const CategoryPage = React.lazy(() => 
  import('./pages/CategoryPage').catch(err => {
    console.error('Error loading CategoryPage:', err);
    return { default: () => <ErrorFallback /> };
  })
);
const CalculatorPage = React.lazy(() => 
  import('./pages/CalculatorPage').catch(err => {
    console.error('Error loading CalculatorPage:', err);
    return { default: () => <ErrorFallback /> };
  })
);
const AboutPage = React.lazy(() => 
  import('./pages/AboutPage').catch(err => {
    console.error('Error loading AboutPage:', err);
    return { default: () => <ErrorFallback /> };
  })
);
const PrivacyPolicyPage = React.lazy(() => 
  import('./pages/PrivacyPolicyPage').catch(err => {
    console.error('Error loading PrivacyPolicyPage:', err);
    return { default: () => <ErrorFallback /> };
  })
);
const TermsOfServicePage = React.lazy(() => 
  import('./pages/TermsOfServicePage').catch(err => {
    console.error('Error loading TermsOfServicePage:', err);
    return { default: () => <ErrorFallback /> };
  })
);
const MostUsedPage = React.lazy(() => 
  import('./pages/MostUsedPage').catch(err => {
    console.error('Error loading MostUsedPage:', err);
    return { default: () => <ErrorFallback /> };
  })
);
const NotFoundPage = React.lazy(() => 
  import('./pages/NotFoundPage').catch(err => {
    console.error('Error loading NotFoundPage:', err);
    return { default: () => <ErrorFallback /> };
  })
);
const SearchPage = React.lazy(() =>
  import('./pages/SearchPage').catch(err => {
    console.error('Error loading SearchPage:', err);
    return { default: () => <ErrorFallback /> };
  })
);
const ContactPage = React.lazy(() =>
  import('./pages/ContactPage').catch(err => {
    console.error('Error loading ContactPage:', err);
    return { default: () => <ErrorFallback /> };
  })
);
import './styles/index.css';

// Optimized loading spinner with reduced paint
const LoadingFallback = React.memo(() => {
  const { t } = useTranslation();
  return (
    <div
      className="flex justify-center items-center h-64"
      role="status"
      aria-busy="true"
      aria-label={t('common.loading')}
    >
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      <span className="sr-only">{t('common.loading')}</span>
    </div>
  );
});

// ScrollToTop component with performance optimization
const ScrollToTop = React.memo(() => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.scrollY > 0) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [pathname]);

  return null;
});

function App() {
  const location = useLocation();
  const { i18n, t } = useTranslation();

  // Set document direction based on language
  useEffect(() => {
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // Initialize date input RTL styling on route changes
  useEffect(() => {
    try {
      // Apply RTL styling to all date inputs after route changes
      setTimeout(initDateInputRTL, 100);
    } catch (error) {
      console.error('Error applying RTL to date inputs:', error);
    }
  }, [location.pathname]);

  // Memoize routes to prevent unnecessary re-renders
  const routes = useMemo(() => (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/calculator/:calculatorSlug" element={<CalculatorPage />} />
      <Route path="/category/:categorySlug" element={<CategoryPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/most-used" element={<MostUsedPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  ), []);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <ToastProvider>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Helmet>
            {/* Default meta tags - dir and lang will be set by useEffect */}
            <html lang={i18n.language} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} />
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
            <meta name="theme-color" content="#4361ee" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

            {/* SEO tags */}
            <meta name="robots" content="index, follow" />
            <meta name="author" content={t('common.siteName')} />
            <meta property="og:site_name" content={t('common.siteName')} />
            <meta property="og:type" content="website" />
            <meta property="og:locale" content={i18n.language === 'ar' ? 'ar_SA' : 'en_US'} />
            <link rel="canonical" href={siteConfig.url} />

            {/* Hreflang tags for multilingual SEO */}
            <link rel="alternate" hrefLang="ar" href={siteConfig.url} />
            <link rel="alternate" hrefLang="en" href={siteConfig.url} />
            <link rel="alternate" hrefLang="x-default" href={siteConfig.url} />

            {/* Resource hints */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
            
            {/* Preload critical images */}
            <link rel="preload" href="/android-chrome-192x192.png" as="image" />
            <link rel="preload" href="/android-chrome-512x512.png" as="image" />

            {/* Organization Schema for brand signals */}
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": siteConfig.nameAr,
                "alternateName": siteConfig.name,
                "url": siteConfig.url,
                "logo": `${siteConfig.url}/logo.svg`,
                "description": "موقع آلات حاسبة يقدم مجموعة شاملة من الآلات الحاسبة المجانية",
                "sameAs": []
              })}
            </script>
          </Helmet>
          <Header />
          <main className={`${location.pathname.startsWith('/calculator/') ? 'w-full' : 'container mx-auto'} px-4 py-8 flex-1 mt-16 md:mt-20`}>
            <Suspense fallback={<LoadingFallback />}>
              {routes}
            </Suspense>
          </main>
          <Footer />
          </div>
        </ToastProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default React.memo(App); 