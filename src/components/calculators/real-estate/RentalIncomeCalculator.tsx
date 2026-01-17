'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, TrendingUp, Info, Coins } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function RentalIncomeCalculator() {
  const { t } = useTranslation('calc/real-estate');
  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');
  const [result, setResult] = useState<{
    gross: number;
    expenses: number;
    net: number;
  } | null>(null);

  const calculate = () => {
    const v1 = parseFloat(value1) || 0;
    const v2 = parseFloat(value2) || 0;

    if (!v1) return;

    // Gross Annual Income = (Monthly Rent + Other Income) * 12
    const gross = (v1 + v2) * 12;
    // Assuming expenses are around 30% of gross income for a simple estimate without detailed inputs
    const expenses = gross * 0.30;
    const net = gross - expenses;

    setResult({
      gross: parseFloat(gross.toFixed(2)),
      expenses: parseFloat(expenses.toFixed(2)),
      net: parseFloat(net.toFixed(2))
    });
  };

  const reset = () => {
    setValue1('');
    setValue2('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("rental_income_calculator.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("rental_income_calculator.monthly_rent")}
          tooltip={t("rental_income_calculator.monthly_rent_tooltip")}
        >
          <NumberInput
            value={value1}
            onValueChange={(val) => setValue1(val.toString())}
            placeholder={t("rental_income_calculator.enter_monthly_rent")}
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("rental_income_calculator.other_income")}
          tooltip={t("rental_income_calculator.other_income_tooltip")}
        >
          <NumberInput
            value={value2}
            onValueChange={(val) => setValue2(val.toString())}
            placeholder={t("rental_income_calculator.enter_monthly_rent")}
            min={0}
            startIcon={<Coins className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("rental_income_calculator.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("rental_income_calculator.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("rental_income_calculator.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("rental_income_calculator.net_income")}
          </div>
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            {result.net.toLocaleString()} {t("rental_income_calculator.currency")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("rental_income_calculator.gross_income")}
            </div>
            <div className="text-xl font-bold">
              {result.gross.toLocaleString()} {t("rental_income_calculator.currency")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("rental_income_calculator.total_expenses")}
            </div>
            <div className="text-xl font-bold text-red-600">
              {result.expenses.toLocaleString()} {t("rental_income_calculator.currency")}
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">
              {t("rental_income_calculator.tips_title")}
            </h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">
              <li>{t("rental_income_calculator.tip_expenses")}</li>
              <li>{t("rental_income_calculator.tip_cashflow")}</li>
            </ul>
            <p className="text-sm text-foreground-70 mt-2">
              {t("rental_income_calculator.footer_note")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Calculator className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">
        {t("rental_income_calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("rental_income_calculator.title")}
      description={t("rental_income_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("rental_income_calculator.footer_note")}
     className="rtl" />
  );
}
