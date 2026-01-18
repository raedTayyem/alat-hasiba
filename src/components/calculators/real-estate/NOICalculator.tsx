'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, TrendingDown, Info, CreditCard } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function NOICalculator() {
  const { t } = useTranslation('calc/real-estate');
  const [grossIncome, setGrossIncome] = useState<string>('');
  const [vacancyLoss, setVacancyLoss] = useState<string>('');
  const [operatingExpenses, setOperatingExpenses] = useState<string>('');
  const [result, setResult] = useState<{
    effectiveIncome: number;
    noi: number;
  } | null>(null);

  const calculate = () => {
    const income = parseFloat(grossIncome) || 0;
    const vacancy = parseFloat(vacancyLoss) || 0;
    const expenses = parseFloat(operatingExpenses) || 0;

    if (!income) return;

    const effectiveIncome = income - vacancy;
    const noi = effectiveIncome - expenses;

    setResult({
      effectiveIncome: parseFloat(effectiveIncome.toFixed(2)),
      noi: parseFloat(noi.toFixed(2))
    });
  };

  const reset = () => {
    setGrossIncome('');
    setVacancyLoss('');
    setOperatingExpenses('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("noi_calculator.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("noi_calculator.gross_income")}
          tooltip={t("noi_calculator.gross_income_tooltip")}
        >
          <NumberInput
            value={grossIncome}
            onValueChange={(val) => setGrossIncome(val.toString())}
            placeholder={t("noi_calculator.enter_gross_income")}
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("noi_calculator.vacancy_loss")}
          tooltip={t("noi_calculator.vacancy_loss_tooltip")}
        >
          <NumberInput
            value={vacancyLoss}
            onValueChange={(val) => setVacancyLoss(val.toString())}
            placeholder={t("noi_calculator.enter_vacancy_loss")}
            min={0}
            startIcon={<TrendingDown className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("noi_calculator.operating_expenses")}
          tooltip={t("noi_calculator.operating_expenses_tooltip")}
        >
          <NumberInput
            value={operatingExpenses}
            onValueChange={(val) => setOperatingExpenses(val.toString())}
            placeholder={t("noi_calculator.enter_operating_expenses")}
            min={0}
            startIcon={<CreditCard className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("noi_calculator.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("noi_calculator.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("noi_calculator.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("noi_calculator.noi")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {result.noi.toLocaleString()} {t("noi_calculator.currency")}
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-sm text-foreground-70 mb-1">
            {t("noi_calculator.effective_income")}
          </div>
          <div className="text-xl font-bold">
            {result.effectiveIncome.toLocaleString()} {t("noi_calculator.currency")}
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">
              {t("noi_calculator.tips_title")}
            </h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">
              <li>{t("noi_calculator.tip_definition")}</li>
              <li>{t("noi_calculator.tip_mortgage")}</li>
              <li>{t("noi_calculator.tip_cap_rate")}</li>
            </ul>
            <p className="text-sm text-foreground-70 mt-2">
              {t("noi_calculator.footer_note")}
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
        {t("noi_calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("noi_calculator.title")}
      description={t("noi_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("noi_calculator.footer_note")}
     className="rtl" />
  );
}
