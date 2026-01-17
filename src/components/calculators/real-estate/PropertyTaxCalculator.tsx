'use client';

/**
 * PROPERTY TAX CALCULATOR
 * - Annual Tax = Assessed Value × Tax Rate
 * - Monthly escrow amount
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, Percent, Calendar, Info, FileText, CheckCircle } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

interface CalculatorResult {
  annualTax: number;
  monthlyEscrow: number;
  effectiveTaxRate: number;
  totalOverYears: number;
}

export default function PropertyTaxCalculator() {
  const { t } = useTranslation('calc/real-estate');
  const [assessedValue, setAssessedValue] = useState<string>('');
  const [taxRate, setTaxRate] = useState<string>('');
  const [years, setYears] = useState<string>('30');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');
    const value = parseFloat(assessedValue);
    const rate = parseFloat(taxRate);
    const yrs = parseFloat(years);

    if (isNaN(value) || isNaN(rate) || isNaN(yrs)) {
      setError(t("calculators.invalid_input"));
      return false;
    }

    if (value <= 0 || rate <= 0 || yrs <= 0) {
      setError(t("property_tax_calculator.positive_values"));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;
    setShowResult(false);

    setTimeout(() => {
      try {
        const value = parseFloat(assessedValue);
        const rate = parseFloat(taxRate) / 100;
        const yrs = parseFloat(years);

        const annualTax = value * rate;
        const monthlyEscrow = annualTax / 12;
        const effectiveTaxRate = rate * 100;
        const totalOverYears = annualTax * yrs;

        setResult({ annualTax, monthlyEscrow, effectiveTaxRate, totalOverYears });
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
      setAssessedValue('');
      setTaxRate('');
      setYears('30');
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
    if (e.key === 'Enter') calculate();
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("property_tax_calculator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("property_tax_calculator.assessed_value")} tooltip={t("property_tax_calculator.assessed_value_tooltip")}>
          <NumberInput
            value={assessedValue}
            onValueChange={(val) => { setAssessedValue(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder="300000"
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField label={t("property_tax_calculator.tax_rate")} tooltip={t("property_tax_calculator.tax_rate_tooltip")}>
          <NumberInput
            value={taxRate}
            onValueChange={(val) => { setTaxRate(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder="1.25"
            step={0.01}
            min={0}
            startIcon={<Percent className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("property_tax_calculator.years")} tooltip={t("property_tax_calculator.years_tooltip")}>
          <NumberInput
            value={years}
            onValueChange={(val) => { setYears(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder="30"
            min={1}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0">
          <Calculator className="w-5 h-5 mr-2" />
          {t("property_tax_calculator.calculate_btn")}
        </button>
        <button onClick={resetCalculator} className="outline-button min-w-[120px] flex items-center justify-center">
          <RotateCcw className="w-5 h-5 mr-2" />
          {t("property_tax_calculator.reset_btn")}
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
            <h2 className="font-bold mb-2 text-lg">{t("property_tax_calculator.info_title")}</h2>
            <p className="text-foreground-70 mb-3">{t("property_tax_calculator.info_description")}</p>
          </div>
          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t("property_tax_calculator.use_cases_title")}</h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("property_tax_calculator.use_case_1")}</li>
              <li>{t("property_tax_calculator.use_case_2")}</li>
              <li>{t("property_tax_calculator.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("property_tax_calculator.annual_tax_label")}</div>
        <div className="text-4xl font-bold text-primary mb-2" dir="ltr">${formatCurrency(result.annualTax)}</div>
        <div className="text-lg text-foreground-70">{t("property_tax_calculator.per_year")}</div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t("property_tax_calculator.details")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("property_tax_calculator.monthly_escrow")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">${formatCurrency(result.monthlyEscrow)}</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("property_tax_calculator.effective_rate")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">{formatPercent(result.effectiveTaxRate)}%</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border col-span-1 sm:col-span-2">
            <div className="flex items-center mb-2">
              <FileText className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("property_tax_calculator.total_over_years")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">${formatCurrency(result.totalOverYears)}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("property_tax_calculator.formula_title")}</h4>
            <p className="text-sm text-foreground-70">{t("property_tax_calculator.formula_explanation")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("property_tax_calculator.title")}
      description={t("property_tax_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
