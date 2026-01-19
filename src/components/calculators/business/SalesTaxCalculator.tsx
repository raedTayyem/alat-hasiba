'use client';

/**
 * Sales Tax Calculator
 *
 * Calculates sales tax and total price
 * Formulas:
 * - Tax Amount = Subtotal × Tax Rate / 100
 * - Total = Subtotal + Tax Amount
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Percent, Receipt, Calculator } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

type CalculationMode = 'add_tax' | 'extract_tax';

export default function SalesTaxCalculator() {
  const { t } = useTranslation('calc/business');
  const [subtotal, setSubtotal] = useState<string>('');
  const [taxRate, setTaxRate] = useState<string>('');
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('add_tax');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const amount = parseFloat(subtotal);
    const rate = parseFloat(taxRate);

    if (isNaN(amount) || amount <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (isNaN(rate) || rate < 0 || rate > 100) {
      setError(t("sales_tax.errors.invalid_rate"));
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
        const amount = parseFloat(subtotal);
        const rate = parseFloat(taxRate);
        let sub: number;
        let taxAmt: number;
        let total: number;

        if (calculationMode === 'add_tax') {
          // Adding tax to subtotal
          sub = amount;
          taxAmt = sub * (rate / 100);
          total = sub + taxAmt;
        } else {
          // Extracting tax from total (price includes tax)
          total = amount;
          // Formula: subtotal = total / (1 + rate/100)
          sub = total / (1 + rate / 100);
          taxAmt = total - sub;
        }

        setResult({
          subtotal: sub,
          taxRate: rate,
          taxAmount: taxAmt,
          total: total,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("errors.calculation_error"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setSubtotal('');
      setTaxRate('');
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
        {t("sales_tax.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("sales_tax.inputs.calculation_mode")}
          tooltip={t("sales_tax.inputs.calculation_mode_tooltip")}
        >
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCalculationMode('add_tax')}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                calculationMode === 'add_tax'
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {t("sales_tax.inputs.add_tax")}
            </button>
            <button
              type="button"
              onClick={() => setCalculationMode('extract_tax')}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                calculationMode === 'extract_tax'
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {t("sales_tax.inputs.extract_tax")}
            </button>
          </div>
        </FormField>

        <FormField
          label={calculationMode === 'add_tax' ? t("sales_tax.inputs.subtotal") : t("sales_tax.inputs.total_with_tax")}
          tooltip={calculationMode === 'add_tax' ? t("sales_tax.inputs.subtotal_tooltip") : t("sales_tax.inputs.total_with_tax_tooltip")}
        >
          <NumberInput
            value={subtotal}
            onValueChange={(val) => {
              setSubtotal(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={calculationMode === 'add_tax' ? t("sales_tax.inputs.subtotal_placeholder") : t("sales_tax.inputs.total_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("sales_tax.inputs.tax_rate")}
          tooltip={t("sales_tax.inputs.tax_rate_tooltip")}
        >
          <NumberInput
            value={taxRate}
            onValueChange={(val) => {
              setTaxRate(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("sales_tax.inputs.tax_rate_placeholder")}
            startIcon={<Percent className="h-4 w-4" />}
            min={0}
            max={100}
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
              {t("sales_tax.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("sales_tax.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("sales_tax.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("sales_tax.info.use_case_1")}</li>
              <li>{t("sales_tax.info.use_case_2")}</li>
              <li>{t("sales_tax.info.use_case_3")}</li>
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
          {t("sales_tax.results.total")}
        </div>
        <div className="text-4xl font-bold mb-2 text-success">
          ${formatNumber(result.total)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("sales_tax.results.tax_amount")}: ${formatNumber(result.taxAmount)}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("sales_tax.results.breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Receipt className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("sales_tax.results.subtotal")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.subtotal)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("sales_tax.results.tax_rate")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.taxRate)}%</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-warning ml-2" />
              <div className="font-medium">{t("sales_tax.results.tax_amount")}</div>
            </div>
            <div className="text-2xl font-bold text-warning">+${formatNumber(result.taxAmount)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Calculator className="w-5 h-5 text-success ml-2" />
              <div className="font-medium">{t("sales_tax.results.total")}</div>
            </div>
            <div className="text-2xl font-bold text-success">${formatNumber(result.total)}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Calculator className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("calculators.formula")}</h4>
            <p className="text-sm text-foreground-70">
              {t("sales_tax.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("sales_tax.title")}
      description={t("sales_tax.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
