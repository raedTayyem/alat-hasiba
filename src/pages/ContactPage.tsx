import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Mail, Coffee, ExternalLink } from '@/utils/icons';

const ContactPage = () => {
  const { t, i18n } = useTranslation('pages');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": t('contact.title'),
    "description": t('contact.metaDescription'),
    "url": "https://alathasiba.com/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Alathasiba",
      "email": "contact@alathasiba.com",
      "url": "https://alathasiba.com"
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('contact.title')}</title>
        <meta name="description" content={t('contact.metaDescription')} />
        <meta name="keywords" content={t('contact.metaKeywords')} />
        <link rel="canonical" href="https://alathasiba.com/contact" />

        {/* Open Graph tags */}
        <meta property="og:title" content={t('contact.title')} />
        <meta property="og:description" content={t('contact.metaDescription')} />
        <meta property="og:url" content="https://alathasiba.com/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={i18n.language === 'ar' ? 'ar_SA' : 'en_US'} />
        <meta property="og:image" content="https://alathasiba.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Contact Alathasiba - آلات حاسبة" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('contact.title')} />
        <meta name="twitter:description" content={t('contact.metaDescription')} />
        <meta name="twitter:image" content="https://alathasiba.com/og-image.png" />

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="max-w-4xl mx-auto py-8 px-4" dir={i18n.dir()}>
        {/* Main header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('contact.heading')}</h1>
          <p className="text-foreground-70 text-lg max-w-2xl mx-auto">
            {t('contact.subHeading')}
          </p>
        </div>

        {/* Contact options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Email contact */}
          <a
            href="mailto:contact@alathasiba.com"
            className="group bg-card border border-border rounded-xl p-8 hover:border-primary/50 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
              <Mail className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              {t('contact.email.title')}
            </h2>
            <p className="text-foreground-70 mb-4">
              {t('contact.email.description')}
            </p>
            <span className="inline-flex items-center gap-2 text-primary font-medium">
              contact@alathasiba.com
              <ExternalLink className={`w-4 h-4 ${i18n.dir() === 'rtl' ? 'rotate-180' : ''}`} />
            </span>
          </a>

          {/* Support / Buy Me a Coffee */}
          <a
            href="https://buymeacoffee.com/erdasolutions"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-card border border-border rounded-xl p-8 hover:border-amber-500/50 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Coffee className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold mb-2 group-hover:text-amber-500 transition-colors">
              {t('contact.support.title')}
            </h2>
            <p className="text-foreground-70 mb-4">
              {t('contact.support.description')}
            </p>
            <span className="inline-flex items-center gap-2 text-amber-500 font-medium">
              {t('contact.support.link')}
              <ExternalLink className={`w-4 h-4 ${i18n.dir() === 'rtl' ? 'rotate-180' : ''}`} />
            </span>
          </a>
        </div>

        {/* Social links section */}
        <section className="bg-muted/30 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('contact.social.title')}</h2>
          <p className="text-foreground-70 mb-6">
            {t('contact.social.description')}
          </p>
          <div className="flex justify-center gap-4">
            {/* Placeholder for social links - can be expanded later */}
            <span className="text-muted-foreground text-sm">
              {t('contact.social.comingSoon')}
            </span>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;
