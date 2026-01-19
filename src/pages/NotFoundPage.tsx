import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation('pages');

  return (
    <>
      <Helmet>
        <title>{t('notFound.title')} | {t('common:siteName')}</title>
        <meta name="description" content={t('notFound.metaDescription')} />
        <meta name="keywords" content="404, page not found, error, alathasiba" />
        <meta name="robots" content="noindex, nofollow" />

        {/* Canonical with noindex */}
        <link rel="canonical" href={`https://alathasiba.com${window.location.pathname}`} />

        {/* Open Graph tags */}
        <meta property="og:title" content={t('notFound.title')} />
        <meta property="og:description" content={t('notFound.metaDescription')} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={t('common:siteName')} />
        <meta property="og:image" content="https://alathasiba.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Page Not Found - Alathasiba" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('notFound.title')} />
        <meta name="twitter:description" content={t('notFound.metaDescription')} />
        <meta name="twitter:image" content="https://alathasiba.com/og-image.png" />

        {/* HTTP status hint for crawlers */}
        <meta name="prerender-status-code" content="404" />
      </Helmet>

      <div className="text-center py-16 max-w-2xl mx-auto">
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-6">{t('notFound.heading')}</h2>
        <p className="text-foreground-70 mb-8 text-lg">
          {t('notFound.description')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary">
            {t('notFound.goHome')}
          </Link>
          <Link to="/categories" className="btn-secondary">
            {t('notFound.browseCategories')}
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage; 