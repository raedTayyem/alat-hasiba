'use client';

/**
 * Conversion Rate Calculator
 *
 * Calculates Conversion Rate
 * Formula: Rate = Conversions / Visitors × 100%
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, UserPlus, TrendingUp, Percent } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

interface CalculatorResult {
  conversionRate: number;
  totalVisitors: number;
  totalConversions: number;
  nonConverted: number;
}

export default function ConversionRateCalculator() {
  const { t } = useTranslation('calc/business');
  const [conversions, setConversions] = useState<string>('');
  const [visitors, setVisitors] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const conv = parseFloat(conversions);
    const vis = parseFloat(visitors);

    if (isNaN(conv) || isNaN(vis)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (conv < 0 || vis <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (conv > vis) {
      setError(t("conversion_rate.errors.conversions_exceed_visitors"));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const conv = parseFloat(conversions);
        const vis = parseFloat(visitors);

        const conversionRate = (conv / vis) * 100;
        const nonConverted = vis - conv;

        setResult({
          conversionRate,
          totalVisitors: vis,
          totalConversions: conv,
          nonConverted,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("errors.calculation_error"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setConversions('');
      setVisitors('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("conversion_rate.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("conversion_rate.inputs.conversions")}
          tooltip={t("conversion_rate.inputs.conversions_tooltip")}
        >
          <NumberInput
            value={conversions}
            onValueChange={(val) => {
              setConversions(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("conversion_rate.inputs.conversions_placeholder")}
            startIcon={<UserPlus className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("conversion_rate.inputs.visitors")}
          tooltip={t("conversion_rate.inputs.visitors_tooltip")}
        >
          <NumberInput
            value={visitors}
            onValueChange={(val) => {
              setVisitors(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("conversion_rate.inputs.visitors_placeholder")}
            startIcon={<Users className="h-4 w-4" />}
            min={0}
          />
        </FormField>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("conversion_rate.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("conversion_rate.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("conversion_rate.info.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("conversion_rate.info.use_case_1")}</li>
              <li>{t("conversion_rate.info.use_case_2")}</li>
              <li>{t("conversion_rate.info.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("conversion_rate.results.rate")}
        </div>
        <div className={`text-4xl font-bold mb-2 ${result.conversionRate >= 3 ? 'text-success' : result.conversionRate >= 1 ? 'text-warning' : 'text-error'}`}>
          {formatNumber(result.conversionRate)}%
        </div>
        <div className="text-lg text-foreground-70">
          {t("conversion_rate.results.of_visitors")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("conversion_rate.results.breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("conversion_rate.results.total_visitors")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.totalVisitors, 0)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <UserPlus className="w-5 h-5 text-success ml-2" />
              <div className="font-medium">{t("conversion_rate.results.converted")}</div>
            </div>
            <div className="text-2xl font-bold text-success">{formatNumber(result.totalConversions, 0)}</div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <Percent className="w-5 h-5 text-primary ml-2" />
            <div className="font-medium">{t("conversion_rate.results.non_converted")}</div>
          </div>
          <div className="text-2xl font-bold text-foreground-70">{formatNumber(result.nonConverted, 0)}</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <TrendingUp className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("calculators.formula")}</h4>
            <p className="text-sm text-foreground-70">
              {t("conversion_rate.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("conversion_rate.title")}
      description={t("conversion_rate.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
