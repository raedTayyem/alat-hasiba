import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const PrivacyPolicyPage = () => {
  const { t } = useTranslation('pages');

  return (
    <>
      <Helmet>
        <title>{t('privacy.title')}</title>
        <meta name="description" content={t('privacy.metaDescription')} />
        <meta name="keywords" content={t('privacy.metaKeywords')} />
      </Helmet>

      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">{t('privacy.heading')}</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('privacy.sections.intro.title')}</h2>
            <p>
              {t('privacy.sections.intro.p1')}
            </p>
            <p>
              {t('privacy.sections.intro.p2')}
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('privacy.sections.collection.title')}</h2>
            <p>
              {t('privacy.sections.collection.intro')}
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.sections.collection.personal.title')}</h3>
            <p>
              {t('privacy.sections.collection.personal.intro')}
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              {(t('privacy.sections.collection.personal.list', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.sections.collection.nonPersonal.title')}</h3>
            <p>
              {t('privacy.sections.collection.nonPersonal.intro')}
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              {(t('privacy.sections.collection.nonPersonal.list', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('privacy.sections.usage.title')}</h2>
            <p>
              {t('privacy.sections.usage.intro')}
            </p>
            <ul className="list-disc pl-5 space-y-3 mt-3">
              {(t('privacy.sections.usage.list', { returnObjects: true }) as { bold: string; text: string }[]).map((item, index) => (
                <li key={index}>
                  <strong>{item.bold}</strong> {item.text}
                </li>
              ))}
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('privacy.sections.cookies.title')}</h2>
            <p>
              {t('privacy.sections.cookies.p1')}
            </p>
            <p className="mt-3">
              {t('privacy.sections.cookies.p2')}
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.sections.cookies.types.title')}</h3>
            <ul className="list-disc pl-5 space-y-3 mt-2">
              {(t('privacy.sections.cookies.types.list', { returnObjects: true }) as { bold: string; text: string }[]).map((item, index) => (
                <li key={index}>
                  <strong>{item.bold}</strong> {item.text}
                </li>
              ))}
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('privacy.sections.ads.title')}</h2>
            <p>
              {t('privacy.sections.ads.p1')}
            </p>
            <p className="mt-3">
              {t('privacy.sections.ads.p2')}
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('privacy.sections.security.title')}</h2>
            <p>
              {t('privacy.sections.security.p1')}
            </p>
            <p className="mt-3">
              {t('privacy.sections.security.p2')}
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('privacy.sections.links.title')}</h2>
            <p>
              {t('privacy.sections.links.p1')}
            </p>
            <p className="mt-3">
              {t('privacy.sections.links.p2')}
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('privacy.sections.rights.title')}</h2>
            <p>
              {t('privacy.sections.rights.intro')}
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              {(t('privacy.sections.rights.list', { returnObjects: true }) as string[]).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="mt-3">
              {t('privacy.sections.rights.p1')}
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{t('privacy.sections.changes.title')}</h2>
            <p>
              {t('privacy.sections.changes.p1')}
            </p>
            <p className="mt-3">
              {t('privacy.sections.changes.p2')}
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage; 