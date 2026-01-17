import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface EnhancedSEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  structuredData?: object | object[];
  noindex?: boolean;
  nofollow?: boolean;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Enhanced SEO Component
 * Provides comprehensive meta tags, Open Graph tags, Twitter Cards, and JSON-LD structured data
 */
const EnhancedSEO: React.FC<EnhancedSEOProps> = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = '/الات حاسبه.png', // Keep as is if it's the valid asset path
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData,
  noindex = false,
  nofollow = false,
  author,
  publishedTime,
  modifiedTime
}) => {
  const { t, i18n } = useTranslation(['common', 'seo']);
  const robotsContent = `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`;
  const siteName = t('common.siteName');
  const defaultAuthor = author || siteName;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="author" content={defaultAuthor} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Language and Locale */}
      <meta httpEquiv="content-language" content={i18n.language} />
      <meta property="og:locale" content={i18n.language === 'ar' ? 'ar_SA' : i18n.language === 'he' ? 'he_IL' : 'en_US'} />
      <html lang={i18n.language} dir={i18n.dir()} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />

      {/* Additional Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="theme-color" content="#4361ee" />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(
            Array.isArray(structuredData) ? structuredData : [structuredData]
          )}
        </script>
      )}
    </Helmet>
  );
};

export default EnhancedSEO;
