'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { DollarSign, Calendar, Percent, Info, Activity } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { initDateInputRTL, enhanceCalculatorRTL } from '@/utils/dateInputRTL';

const LoanCalculator: React.FC = () => {
  const { t, i18n } = useTranslation(['calc/finance', 'common']);
  const isRTL = i18n.language === 'ar';
  const currentLanguage = i18n.language;
  const calculatorSlug = 'loan';

  // Form state
  const [inputs, setInputs] = useState({
    principal: 10000,
    annualRate: 5,
    years: 5
  });

  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSchedule, setShowSchedule] = useState(false);

  // SEO Meta Tags
  const generateMetaTags = useMemo(() => ({
    title: `${t('loan.title')} - ${t('common.siteName')}`,
    description: t('loan.description'),
    keywords: t('loan.keywords'),
    canonical: `https://alathasiba.com/${currentLanguage === 'ar' ? 'ar/' : ''}calculator/${calculatorSlug}`
  }), [calculatorSlug, currentLanguage, t]);

  // Structured Data
  const generateStructuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: t('loan.title'),
    description: t('loan.description'),
    url: generateMetaTags.canonical,
    applicationCategory: 'CalculatorApplication',
    operatingSystem: 'Web Browser',
    featureList: [
      t('common.features.instant_calculation'),
      t('common.features.mobile_friendly'),
      t('common.features.accurate_results'),
      t('common.features.amortization_schedule')
    ]
  }), [calculatorSlug, currentLanguage, t, generateMetaTags.canonical]);

  // RTL/LTR Enhancement
  useEffect(() => {
    initDateInputRTL();
    enhanceCalculatorRTL();
    document.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage, isRTL]);

  // Input change handler
  const handleInputChange = useCallback((fieldName: string, value: number) => {
    setInputs(prevInputs => ({ ...prevInputs, [fieldName]: value }));

    setErrors(prevErrors => {
      if (prevErrors[fieldName]) {
        const newErrors = { ...prevErrors };
        delete newErrors[fieldName];
        return newErrors;
      }
      return prevErrors;
    });
  }, []);

  // Validation
  const validateInputs = useCallback(() => {
    const validationErrors: Record<string, string> = {};

    if (inputs.principal <= 0) {
      validationErrors.principal = t('common.errors.positiveNumber');
    }
    if (inputs.annualRate < 0) {
      validationErrors.annualRate = t('common.errors.nonNegative');
    }
    if (inputs.years <= 0) {
      validationErrors.years = t('common.errors.positiveNumber');
    }

    return validationErrors;
  }, [inputs.principal, inputs.annualRate, inputs.years, t]);

  // Calculate loan
  const calculateLoan = useCallback(() => {
    const validationErrors = validateInputs();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setResults(null);
      return;
    }

    try {
      const P = inputs.principal;
      const r = inputs.annualRate / 100 / 12; // Monthly interest rate
      const n = inputs.years * 12; // Total number of payments

      // Monthly Payment Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
      let M: number;
      if (r === 0) {
        M = P / n;
      } else {
        M = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }

      const totalPayment = M * n;
      const totalInterest = totalPayment - P;

      // Generate amortization schedule
      const schedule: any[] = [];
      let balance = P;

      for (let month = 1; month <= n; month++) {
        const interestPayment = balance * r;
        const principalPayment = M - interestPayment;
        balance -= principalPayment;

        schedule.push({
          month,
          payment: M,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, balance)
        });
      }

      setResults({
        values: {
          monthlyPayment: M,
          totalPayment,
          totalInterest,
          interestPercentage: (totalInterest / P) * 100
        },
        schedule,
        formulas: {
          monthlyPayment: t('loan.formulaExpressions.monthlyPayment'),
          totalPayment: t('loan.formulaExpressions.totalPayment'),
          totalInterest: t('loan.formulaExpressions.totalInterest')
        },
        inputs
      });

      setErrors({});
    } catch (error) {
      console.error('Calculation error:', error);
      setErrors({ general: t('common.errors.calculationError') });
      setResults(null);
    }
  }, [validateInputs, inputs, t]);

  // Reset calculator
  const resetCalculator = useCallback(() => {
    setInputs({
      principal: 10000,
      annualRate: 5,
      years: 5
    });
    setResults(null);
    setErrors({});
    setShowSchedule(false);
  }, []);

  // Format currency
  const formatCurrency = (value: number): string => {
    return value.toLocaleString(currentLanguage, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculateLoan();
    }
  }, [calculateLoan]);

  const inputGridClass = `grid grid-cols-1 md:grid-cols-2 gap-6 mb-8`;
  const layoutClass = `grid grid-cols-1 lg:grid-cols-3 gap-8`;
  const mainContentClass = `lg:col-span-2 space-y-8`;
  const sidebarClass = `space-y-6`;

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{generateMetaTags.title}</title>
        <meta name="description" content={generateMetaTags.description} />
        <meta name="keywords" content={generateMetaTags.keywords} />
        <link rel="canonical" href={generateMetaTags.canonical} />

        <meta property="og:title" content={generateMetaTags.title} />
        <meta property="og:description" content={generateMetaTags.description} />
        <meta property="og:url" content={generateMetaTags.canonical} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={generateMetaTags.title} />
        <meta name="twitter:description" content={generateMetaTags.description} />

        <link rel="alternate" hrefLang="ar" href={`https://alathasiba.com/ar/calculator/${calculatorSlug}`} />
        <link rel="alternate" hrefLang="en" href={`https://alathasiba.com/calculator/${calculatorSlug}`} />
        <link rel="alternate" hrefLang="x-default" href={`https://alathasiba.com/calculator/${calculatorSlug}`} />

        <script type="application/ld+json">
          {JSON.stringify(generateStructuredData)}
        </script>
      </Helmet>

      <CalculatorLayout
        title={t('loan.title')}
        description={t('loan.description')}
      >
        <div className={layoutClass}>
          <div className={mainContentClass}>
            
            <div className="bg-card rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                {t('common.inputs')}
              </h2>
              
              <div className={inputGridClass}>
                <FormField
                  label={t('loan.inputs.principal')}
                  tooltip={t('loan.tooltips.principal')}
                  error={errors.principal}
                >
                  <NumberInput
                    value={inputs.principal}
                    onValueChange={(val) => handleInputChange('principal', Number(val))}
                    onKeyPress={handleKeyPress}
                    placeholder="10000"
                    min={0}
                    step={100}
                    startIcon={<DollarSign className="h-4 w-4" />}
                  />
                </FormField>

                <FormField
                  label={t('loan.inputs.annualRate')}
                  tooltip={t('loan.tooltips.annualRate')}
                  error={errors.annualRate}
                >
                  <NumberInput
                    value={inputs.annualRate}
                    onValueChange={(val) => handleInputChange('annualRate', Number(val))}
                    onKeyPress={handleKeyPress}
                    placeholder="5"
                    min={0}
                    step={0.1}
                    startIcon={<Percent className="h-4 w-4" />}
                  />
                </FormField>

                <FormField
                  label={t('loan.inputs.years')}
                  tooltip={t('loan.tooltips.years')}
                  error={errors.years}
                >
                  <NumberInput
                    value={inputs.years}
                    onValueChange={(val) => handleInputChange('years', Number(val))}
                    onKeyPress={handleKeyPress}
                    placeholder="5"
                    min={1}
                    step={1}
                    startIcon={<Calendar className="h-4 w-4" />}
                  />
                </FormField>
              </div>

              <CalculatorButtons onCalculate={calculateLoan} onReset={resetCalculator} />
              <ErrorDisplay error={errors.general || ''} />
            </div>

            {results && (
              <div className="bg-card rounded-xl shadow-lg p-6 mb-8 border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  {t('common.results')}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                    <h3 className="text-sm font-medium text-primary mb-2 flex items-center">
                      <Activity className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                      {t('loan.results.monthlyPayment')}
                    </h3>
                    <p className="text-3xl font-bold text-primary">
                      {formatCurrency(results.values.monthlyPayment)}
                    </p>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      {t('loan.results.totalPayment')}
                    </h3>
                    <p className="text-3xl font-bold text-foreground">
                      {formatCurrency(results.values.totalPayment)}
                    </p>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      {t('loan.results.totalInterest')}
                    </h3>
                    <p className="text-3xl font-bold text-foreground">
                      {formatCurrency(results.values.totalInterest)}
                    </p>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      {t('loan.results.interestPercentage')}
                    </h3>
                    <p className="text-3xl font-bold text-foreground">
                      {results.values.interestPercentage.toFixed(2)}%
                    </p>
                  </div>
                </div>

                {/* Formulas */}
                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <Info className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0 text-primary" />
                    {t('common.formulas')}
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(results.formulas).map(([name, formula]) => (
                      <div
                        key={name}
                        className="bg-muted rounded-lg p-4"
                      >
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                          {t(`loan.formulas.${name}`)}
                        </h4>
                        <p className="font-mono text-sm text-foreground">
                          {formula as string}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amortization Schedule Toggle */}
                <div className="mt-8 text-center">
                  <Button
                    variant="secondary"
                    onClick={() => setShowSchedule(!showSchedule)}
                  >
                    {showSchedule ? t('loan.hideSchedule') : t('loan.showSchedule')}
                  </Button>
                </div>

                {/* Amortization Schedule */}
                {showSchedule && results.schedule && (
                  <div className="mt-8 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-start p-2">{t('loan.schedule.month')}</th>
                          <th className="text-end p-2">{t('loan.schedule.payment')}</th>
                          <th className="text-end p-2">{t('loan.schedule.principal')}</th>
                          <th className="text-end p-2">{t('loan.schedule.interest')}</th>
                          <th className="text-end p-2">{t('loan.schedule.balance')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.schedule.map((entry: any) => (
                          <tr key={entry.month} className="border-b border-border/50 hover:bg-muted/50">
                            <td className="p-2">{entry.month}</td>
                            <td className="text-end p-2">{formatCurrency(entry.payment)}</td>
                            <td className="text-end p-2">{formatCurrency(entry.principal)}</td>
                            <td className="text-end p-2">{formatCurrency(entry.interest)}</td>
                            <td className="text-end p-2">{formatCurrency(entry.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className={sidebarClass}>
            {/* How to Use */}
            <div className="bg-card rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Activity className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0 text-primary" />
                {t('common.how_to_use')}
              </h3>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal pl-5">
                <li>{t('loan.how_to_use.step1')}</li>
                <li>{t('loan.how_to_use.step2')}</li>
                <li>{t('loan.how_to_use.step3')}</li>
                <li>{t('loan.how_to_use.step4')}</li>
              </ol>
            </div>

            {/* Features */}
            <div className="bg-card rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Info className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0 text-primary" />
                {t('common.features')}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary ml-2 rtl:mr-2 rtl:ml-0">✓</span>
                  {t('common.features.instant_calculation')}
                </li>
                <li className="flex items-start">
                  <span className="text-primary ml-2 rtl:mr-2 rtl:ml-0">✓</span>
                  {t('common.features.mobile_friendly')}
                </li>
                <li className="flex items-start">
                  <span className="text-primary ml-2 rtl:mr-2 rtl:ml-0">✓</span>
                  {t('common.features.accurate_results')}
                </li>
                <li className="flex items-start">
                  <span className="text-primary ml-2 rtl:mr-2 rtl:ml-0">✓</span>
                  {t('common.features.amortization_schedule')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CalculatorLayout>
    </>
  );
};

export default LoanCalculator;
