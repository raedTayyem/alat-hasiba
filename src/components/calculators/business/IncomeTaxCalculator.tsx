'use client';

/**
 * Income Tax Calculator
 *
 * Estimates income tax based on progressive tax brackets
 * Formula: Apply progressive tax brackets to taxable income
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Receipt, TrendingUp, Calculator } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { Select, SelectItem } from '@/components/ui/select';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

interface CalculatorResult {
  totalTax: number;
  effectiveRate: number;
  taxableIncome: number;
  afterTaxIncome: number;
  bracketBreakdown: {
    bracket: TaxBracket;
    taxableAmount: number;
    taxAmount: number;
  }[];
}

// Default US-style tax brackets (can be customized)
const DEFAULT_TAX_BRACKETS: Record<string, TaxBracket[]> = {
  single: [
    { min: 0, max: 11000, rate: 10 },
    { min: 11000, max: 44725, rate: 12 },
    { min: 44725, max: 95375, rate: 22 },
    { min: 95375, max: 182100, rate: 24 },
    { min: 182100, max: 231250, rate: 32 },
    { min: 231250, max: 578125, rate: 35 },
    { min: 578125, max: Infinity, rate: 37 },
  ],
  married: [
    { min: 0, max: 22000, rate: 10 },
    { min: 22000, max: 89450, rate: 12 },
    { min: 89450, max: 190750, rate: 22 },
    { min: 190750, max: 364200, rate: 24 },
    { min: 364200, max: 462500, rate: 32 },
    { min: 462500, max: 693750, rate: 35 },
    { min: 693750, max: Infinity, rate: 37 },
  ],
  head_of_household: [
    { min: 0, max: 15700, rate: 10 },
    { min: 15700, max: 59850, rate: 12 },
    { min: 59850, max: 95350, rate: 22 },
    { min: 95350, max: 182100, rate: 24 },
    { min: 182100, max: 231250, rate: 32 },
    { min: 231250, max: 578100, rate: 35 },
    { min: 578100, max: Infinity, rate: 37 },
  ],
};

export default function IncomeTaxCalculator() {
  const { t } = useTranslation('calc/business');
  const [grossIncome, setGrossIncome] = useState<string>('');
  const [deductions, setDeductions] = useState<string>('');
  const [filingStatus, setFilingStatus] = useState<string>('single');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const income = parseFloat(grossIncome);
    const deduct = parseFloat(deductions) || 0;

    if (isNaN(income)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (income < 0 || deduct < 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    return true;
  };

  const calculateTax = (taxableIncome: number, brackets: TaxBracket[]): { totalTax: number; breakdown: CalculatorResult['bracketBreakdown'] } => {
    let totalTax = 0;
    let remainingIncome = taxableIncome;
    const breakdown: CalculatorResult['bracketBreakdown'] = [];

    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;

      const bracketWidth = bracket.max - bracket.min;
      const taxableAmount = Math.min(remainingIncome, bracketWidth);
      const taxAmount = taxableAmount * (bracket.rate / 100);

      if (taxableAmount > 0) {
        breakdown.push({
          bracket,
          taxableAmount,
          taxAmount,
        });
        totalTax += taxAmount;
        remainingIncome -= taxableAmount;
      }
    }

    return { totalTax, breakdown };
  };

  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const income = parseFloat(grossIncome);
        const deduct = parseFloat(deductions) || 0;
        const taxableIncome = Math.max(0, income - deduct);

        const brackets = DEFAULT_TAX_BRACKETS[filingStatus] || DEFAULT_TAX_BRACKETS.single;
        const { totalTax, breakdown } = calculateTax(taxableIncome, brackets);

        const effectiveRate = taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0;
        const afterTaxIncome = income - totalTax;

        setResult({
          totalTax,
          effectiveRate,
          taxableIncome,
          afterTaxIncome,
          bracketBreakdown: breakdown,
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
      setGrossIncome('');
      setDeductions('');
      setFilingStatus('single');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("income_tax.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("income_tax.gross_income")}
          tooltip={t("income_tax.gross_income_tooltip")}
        >
          <NumberInput
            value={grossIncome}
            onValueChange={(val) => {
              setGrossIncome(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("income_tax.gross_income_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("income_tax.deductions")}
          tooltip={t("income_tax.deductions_tooltip")}
        >
          <NumberInput
            value={deductions}
            onValueChange={(val) => {
              setDeductions(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("income_tax.deductions_placeholder")}
            startIcon={<Receipt className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("income_tax.filing_status")}
          tooltip={t("income_tax.filing_status_tooltip")}
        >
          <Select
            value={filingStatus}
            onValueChange={(val) => setFilingStatus(val)}
            className="h-14 rounded-2xl border-2 border-border bg-background px-4 text-lg"
          >
            <SelectItem value="single">{t("income_tax.status_single")}</SelectItem>
            <SelectItem value="married">{t("income_tax.status_married")}</SelectItem>
            <SelectItem value="head_of_household">{t("income_tax.status_head_of_household")}</SelectItem>
          </Select>
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
              {t("income_tax.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("income_tax.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("income_tax.info.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("income_tax.info.use_case_1")}</li>
              <li>{t("income_tax.info.use_case_2")}</li>
              <li>{t("income_tax.info.use_case_3")}</li>
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
          {t("income_tax.results.total_tax")}
        </div>
        <div className="text-4xl font-bold text-error mb-2">
          ${formatNumber(result.totalTax)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("income_tax.results.effective_rate")}: {formatNumber(result.effectiveRate)}%
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("income_tax.results.summary")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("income_tax.results.taxable_income")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.taxableIncome)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-success ml-2" />
              <div className="font-medium">{t("income_tax.results.after_tax_income")}</div>
            </div>
            <div className="text-2xl font-bold text-success">${formatNumber(result.afterTaxIncome)}</div>
          </div>
        </div>
      </div>

      {result.bracketBreakdown.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-3">
            {t("income_tax.results.bracket_breakdown")}
          </h3>
          <div className="space-y-2">
            {result.bracketBreakdown.map((item, index) => (
              <div key={index} className="bg-card p-3 rounded-lg border border-border flex justify-between items-center">
                <div>
                  <span className="font-medium">{item.bracket.rate}%</span>
                  <span className="text-foreground-70 text-sm mx-2">
                    (${formatNumber(item.bracket.min)} - {item.bracket.max === Infinity ? '+' : '$' + formatNumber(item.bracket.max)})
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-medium">${formatNumber(item.taxAmount)}</div>
                  <div className="text-sm text-foreground-70">{t("income_tax.results.on")} ${formatNumber(item.taxableAmount)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Calculator className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("income_tax.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("income_tax.results.formula_desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("income_tax.title")}
      description={t("income_tax.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
