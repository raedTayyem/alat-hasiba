'use client';

/**
 * Car Depreciation Calculator
 * Calculates vehicle value over time using declining balance depreciation
 * Formula: Value = Purchase × (1 - rate)^years
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Calendar, Percent, Activity, TrendingDown, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface DepreciationResult {
  currentValue: number;
  totalDepreciation: number;
  depreciationPercent: number;
  yearlyValues: number[];
  averageYearlyDepreciation: number;
}

export default function CarDepreciationCalculator() {
  const { t } = useTranslation('calc/automotive');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [currentAge, setCurrentAge] = useState<string>('');
  const [depreciationRate, setDepreciationRate] = useState<string>('15');

  const [result, setResult] = useState<DepreciationResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const price = parseFloat(purchasePrice);
    const age = parseFloat(currentAge);
    const rate = parseFloat(depreciationRate);

    if (isNaN(price) || isNaN(age)) {
      setError(t("car_depreciation.error_missing_inputs"));
      return false;
    }

    if (price <= 0) {
      setError(t("car_depreciation.error_positive_price"));
      return false;
    }

    if (age < 0) {
      setError(t("car_depreciation.error_positive_age"));
      return false;
    }

    if (isNaN(rate) || rate < 0 || rate > 100) {
      setError(t("car_depreciation.error_valid_rate"));
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
        const initialPrice = parseFloat(purchasePrice);
        const age = parseFloat(currentAge);
        const rate = parseFloat(depreciationRate) / 100;

        // Declining balance depreciation formula: Value = Purchase × (1 - rate)^years
        const currentValue = initialPrice * Math.pow(1 - rate, age);

        // Calculate yearly values for display
        const yearlyValues: number[] = [initialPrice];
        for (let year = 1; year <= Math.ceil(age); year++) {
          const value = initialPrice * Math.pow(1 - rate, year);
          yearlyValues.push(value);
        }

        const totalDepreciation = initialPrice - currentValue;
        const depreciationPercent = (totalDepreciation / initialPrice) * 100;
        const averageYearlyDepreciation = age > 0 ? totalDepreciation / age : 0;

        setResult({
          currentValue: Math.max(currentValue, 0),
          totalDepreciation,
          depreciationPercent,
          yearlyValues,
          averageYearlyDepreciation
        });

        setShowResult(true);
      } catch (err) {
        setError(t("car_depreciation.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setPurchasePrice('');
      setCurrentAge('');
      setDepreciationRate('15');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatCurrency = (num: number): string => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("car_depreciation.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("car_depreciation.purchase_price")}
          tooltip={t("car_depreciation.purchase_price_tooltip")}
        >
          <NumberInput
            value={purchasePrice}
            onValueChange={(val) => { setPurchasePrice(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("car_depreciation.placeholders.purchase_price")}
            min={0}
            step={1000}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("car_depreciation.current_age")}
          tooltip={t("car_depreciation.current_age_tooltip")}
        >
          <NumberInput
            value={currentAge}
            onValueChange={(val) => { setCurrentAge(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("car_depreciation.placeholders.current_age")}
            min={0}
            step={1}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("car_depreciation.depreciation_rate")}
          tooltip={t("car_depreciation.depreciation_rate_tooltip")}
        >
          <NumberInput
            value={depreciationRate}
            onValueChange={(val) => { setDepreciationRate(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("car_depreciation.placeholders.depreciation_rate")}
            min={0}
            max={100}
            step={1}
            startIcon={<Percent className="h-4 w-4" />}
          />
        </FormField>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      {/* Error Message */}
      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("car_depreciation.about_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("car_depreciation.about_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("car_depreciation.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("car_depreciation.use_case_1")}</li>
              <li>{t("car_depreciation.use_case_2")}</li>
              <li>{t("car_depreciation.use_case_3")}</li>
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
          {t("car_depreciation.current_value_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {t("common.currencySymbol")}{formatCurrency(result.currentValue)}
        </div>
        <div className="text-lg text-foreground-70">
          {result.depreciationPercent.toFixed(1)}% {t("car_depreciation.depreciated")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("car_depreciation.detailed_results")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingDown className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("car_depreciation.total_depreciation")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t("common.currencySymbol")}{formatCurrency(result.totalDepreciation)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Activity className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("car_depreciation.average_yearly")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t("common.currencySymbol")}{formatCurrency(result.averageYearlyDepreciation)} / {t("car_depreciation.year")}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("car_depreciation.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("car_depreciation.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("car_depreciation.title")}
      description={t("car_depreciation.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
