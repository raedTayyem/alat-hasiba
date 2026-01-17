import { useTranslation } from 'react-i18next';

const ErrorFallback = () => {
  const { t } = useTranslation();

  return <div>{t('errors.errorLoadingPage')}</div>;
};

export default ErrorFallback;
