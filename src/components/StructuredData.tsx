import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface WebsiteStructuredDataProps {
  siteUrl: string;
}

export const WebsiteStructuredData: React.FC<WebsiteStructuredDataProps> = ({ siteUrl }) => {
  const { t } = useTranslation(['common']);
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'url': siteUrl,
    'name': t('common.siteName'),
    'description': t('common.siteDescription'),
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(websiteData)}
      </script>
    </Helmet>
  );
};

interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string;
    item: string;
  }>;
  siteUrl: string;
}

export const BreadcrumbStructuredData: React.FC<BreadcrumbStructuredDataProps> = ({ items, siteUrl }) => {
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': `${siteUrl}${item.item}`
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbData)}
      </script>
    </Helmet>
  );
};

interface CalculatorStructuredDataProps {
  name: string;
  description: string;
  siteUrl: string;
  calculatorUrl: string;
  datePublished: string;
  dateModified: string;
  category?: string;
}

export const CalculatorStructuredData: React.FC<CalculatorStructuredDataProps> = ({
  name,
  description,
  siteUrl,
  calculatorUrl,
  datePublished,
  dateModified,
  category
}) => {
  const calculatorData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': name,
    'description': description,
    'applicationCategory': 'UtilitiesApplication',
    'operatingSystem': 'Web',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'datePublished': datePublished,
    'dateModified': dateModified,
    'url': `${siteUrl}${calculatorUrl}`,
    ...(category && { 'category': category })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(calculatorData)}
      </script>
    </Helmet>
  );
};

interface FAQStructuredDataProps {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export const FAQStructuredData: React.FC<FAQStructuredDataProps> = ({ questions }) => {
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': questions.map(item => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqData)}
      </script>
    </Helmet>
  );
}; 