// Link is available for future use if needed
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t, i18n } = useTranslation('pages');
  const missionList = t('about.mission.list', { returnObjects: true }) as unknown;

  const pageTitle = t('about.title');
  const pageDescription = t('about.metaDescription');
  const pageUrl = 'https://alathasiba.com/about';
  const ogLocale = i18n.language === 'ar' ? 'ar_SA' : 'en_US';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Alathasiba',
    description: pageDescription,
    url: pageUrl,
    mainEntity: {
      '@type': 'Organization',
      name: 'آلات حاسبة',
      url: 'https://alathasiba.com',
    },
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={t('about.metaKeywords')} />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://alathasiba.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={t('about.ogImageAlt')} />
        <meta property="og:locale" content={ogLocale} />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://alathasiba.com/og-image.png" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Main header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('about.mainHeading')}</h1>
          <p className="text-foreground-70 text-lg max-w-2xl mx-auto">
            {t('about.subHeading')}
          </p>
        </div>

        {/* Our story */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {t('about.story.title')}
          </h2>
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <p>
              {t('about.story.p1')}
            </p>
            <p>
              {t('about.story.p2')}
            </p>
          </div>
        </section>

        {/* Our mission */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {t('about.mission.title')}
          </h2>
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <p>
              {t('about.mission.intro')}
            </p>
            <ul>
              {Array.isArray(missionList) &&
                missionList.map((item, index) => <li key={index}>{String(item)}</li>)}
            </ul>
          </div>
        </section>

        {/* What we offer */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {t('about.offering.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">{t('about.offering.varied.title')}</h3>
              <p className="text-foreground-70">{t('about.offering.varied.desc')}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">{t('about.offering.converters.title')}</h3>
              <p className="text-foreground-70">{t('about.offering.converters.desc')}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">{t('about.offering.finance.title')}</h3>
              <p className="text-foreground-70">{t('about.offering.finance.desc')}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">{t('about.offering.health.title')}</h3>
              <p className="text-foreground-70">{t('about.offering.health.desc')}</p>
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {t('about.whyChooseUs.title')}
          </h2>
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <ul>
              <li><strong>{t('about.whyChooseUs.accuracy.title')}</strong> {t('about.whyChooseUs.accuracy.desc')}</li>
              <li><strong>{t('about.whyChooseUs.ease.title')}</strong> {t('about.whyChooseUs.ease.desc')}</li>
              <li><strong>{t('about.whyChooseUs.compatibility.title')}</strong> {t('about.whyChooseUs.compatibility.desc')}</li>
              <li><strong>{t('about.whyChooseUs.free.title')}</strong> {t('about.whyChooseUs.free.desc')}</li>
              <li><strong>{t('about.whyChooseUs.updates.title')}</strong> {t('about.whyChooseUs.updates.desc')}</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;
