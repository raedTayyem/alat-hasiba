import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const TermsOfServicePage = () => {
  const { t, i18n } = useTranslation('pages');

  return (
    <>
      <Helmet>
        <title>{t('terms.title')}</title>
        <meta name="description" content={t('terms.metaDescription')} />
        <meta name="keywords" content={t('terms.metaKeywords')} />
        <link rel="canonical" href="https://alathasiba.com/terms" />

        {/* Open Graph tags */}
        <meta property="og:title" content={t('terms.title')} />
        <meta property="og:description" content={t('terms.metaDescription')} />
        <meta property="og:url" content="https://alathasiba.com/terms" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={i18n.language === 'ar' ? 'ar_SA' : 'en_US'} />
        <meta property="og:image" content="https://alathasiba.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Terms of Service - Alathasiba" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={t('terms.title')} />
        <meta name="twitter:description" content={t('terms.metaDescription')} />
        <meta name="twitter:image" content="https://alathasiba.com/og-image.png" />
      </Helmet>

      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">{t('terms.heading')}</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('terms.sections.intro.title')}</h2>
            <p>
              {t('terms.sections.intro.p1')}
            </p>
            <p className="mt-3">
              {t('terms.sections.intro.p2')}
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('terms.sections.usage.title')}</h2>
            <p>
              {t('terms.sections.usage.content')}
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">{t('terms.sections.usage.restrictions.title')}</h3>
            <p>{t('terms.sections.usage.restrictions.intro')}</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              {(t('terms.sections.usage.restrictions.list', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('terms.sections.accuracy.title')}</h2>
            <p>
              {t('terms.sections.accuracy.p1')}
            </p>
            <p className="mt-3">
              {t('terms.sections.accuracy.p2')}
            </p>
            <p className="mt-3">
              {t('terms.sections.accuracy.p3')}
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('terms.sections.ip.title')}</h2>
            <p>
              {t('terms.sections.ip.p1')}
            </p>
            <p className="mt-3">
              {t('terms.sections.ip.p2')}
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('terms.sections.userContent.title')}</h2>
            <p>
              {t('terms.sections.userContent.p1')}
            </p>
            <p className="mt-3">
              {t('terms.sections.userContent.p2')}
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('terms.sections.links.title')}</h2>
            <p>
              {t('terms.sections.links.p1')}
            </p>
            <p className="mt-3">
              {t('terms.sections.links.p2')}
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('terms.sections.ads.title')}</h2>
            <p>
              {t('terms.sections.ads.p1')}
            </p>
            <p className="mt-3">
              {t('terms.sections.ads.p2')}
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('terms.sections.indemnification.title')}</h2>
            <p>
              {t('terms.sections.indemnification.p1')}
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('terms.sections.disclaimer.title')}</h2>
            <p>
              {t('terms.sections.disclaimer.p1')}
            </p>
            <p className="mt-3">
              {t('terms.sections.disclaimer.p2')}
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('terms.sections.limitation.title')}</h2>
            <p>
              {t('terms.sections.limitation.p1')}
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('terms.sections.governingLaw.title')}</h2>
            <p>
              {t('terms.sections.governingLaw.p1')}
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default TermsOfServicePage; 