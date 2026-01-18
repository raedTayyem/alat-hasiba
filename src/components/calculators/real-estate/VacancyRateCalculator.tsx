'use client';

/**
 * VACANCY RATE CALCULATOR
 * Calculates vacancy rate and lost income for rental properties
 * - Vacancy Rate = (Vacant Days / Total Days) × 100
 * - Lost income calculation
 * - Adjusted annual income for budgeting
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, Calendar, Info, AlertTriangle, CheckCircle } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

interface CalculatorResult {
  vacancyRate: number;
  monthlyRent: number;
  annualRent: number;
  lostIncome: number;
  adjustedAnnualIncome: number;
  occupancyRate: number;
}

export default function VacancyRateCalculator() {
  const { t } = useTranslation('calc/real-estate');
  const [monthlyRent, setMonthlyRent] = useState<string>('');
  const [vacantDays, setVacantDays] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const rent = parseFloat(monthlyRent);
    const days = parseFloat(vacantDays);

    if (isNaN(rent) || isNaN(days)) {
      setError(t("calculators.invalid_input"));
      return false;
    }

    if (rent <= 0) {
      setError(t("vacancy_rate_calculator.rent_required"));
      return false;
    }

    if (days < 0 || days > 365) {
      setError(t("vacancy_rate_calculator.days_range"));
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
        const rent = parseFloat(monthlyRent);
        const days = parseFloat(vacantDays);

        // Vacancy Rate = (Vacant Days / Total Days) × 100
        const vacancyRate = (days / 365) * 100;
        const occupancyRate = 100 - vacancyRate;

        // Income calculations
        const annualRent = rent * 12;
        const lostIncome = (annualRent * vacancyRate) / 100;
        const adjustedAnnualIncome = annualRent - lostIncome;

        setResult({
          vacancyRate,
          monthlyRent: rent,
          annualRent,
          lostIncome,
          adjustedAnnualIncome,
          occupancyRate,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("calculators.calculation_error"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setMonthlyRent('');
      setVacantDays('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatCurrency = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatPercent = (num: number): string => {
    return num.toFixed(2);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("vacancy_rate_calculator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("vacancy_rate_calculator.monthly_rent")}
          tooltip={t("vacancy_rate_calculator.monthly_rent_tooltip")}
        >
          <NumberInput
            value={monthlyRent}
            onValueChange={(val) => {
              setMonthlyRent(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="2000"
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("vacancy_rate_calculator.vacant_days")}
          tooltip={t("vacancy_rate_calculator.vacant_days_tooltip")}
        >
          <NumberInput
            value={vacantDays}
            onValueChange={(val) => {
              setVacantDays(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="30"
            min={0}
            max={365}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button
          onClick={calculate}
          className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Calculator className="w-5 h-5 mr-2" />
          {t("vacancy_rate_calculator.calculate_btn")}
        </button>

        <button
          onClick={resetCalculator}
          className="outline-button min-w-[120px] flex items-center justify-center"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          {t("vacancy_rate_calculator.reset_btn")}
        </button>
      </div>

      {error && (
        <div className="text-error mt-4 p-3 bg-error/10 rounded-lg border border-error/20 flex items-center animate-fadeIn max-w-md mx-auto">
          <Info className="w-5 h-5 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("vacancy_rate_calculator.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("vacancy_rate_calculator.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("vacancy_rate_calculator.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("vacancy_rate_calculator.use_case_1")}</li>
              <li>{t("vacancy_rate_calculator.use_case_2")}</li>
              <li>{t("vacancy_rate_calculator.use_case_3")}</li>
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
          {t("vacancy_rate_calculator.vacancy_rate_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2" dir="ltr">
          {formatPercent(result.vacancyRate)}%
        </div>
        <div className="text-lg text-foreground-70" dir="ltr">
          {formatPercent(result.occupancyRate)}% {t("vacancy_rate_calculator.occupancy")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("vacancy_rate_calculator.income_details")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("vacancy_rate_calculator.annual_rent")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              ${formatCurrency(result.annualRent)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <div className="font-medium">{t("vacancy_rate_calculator.lost_income")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              ${formatCurrency(result.lostIncome)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border col-span-1 sm:col-span-2">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <div className="font-medium">{t("vacancy_rate_calculator.adjusted_income")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              ${formatCurrency(result.adjustedAnnualIncome)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("vacancy_rate_calculator.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("vacancy_rate_calculator.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("vacancy_rate_calculator.title")}
      description={t("vacancy_rate_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
