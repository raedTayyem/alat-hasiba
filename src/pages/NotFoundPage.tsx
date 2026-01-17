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
        <meta name="robots" content="noindex, nofollow" />

        {/* Open Graph tags */}
        <meta property="og:title" content={t('notFound.title')} />
        <meta property="og:description" content={t('notFound.metaDescription')} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={t('common:siteName')} />

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