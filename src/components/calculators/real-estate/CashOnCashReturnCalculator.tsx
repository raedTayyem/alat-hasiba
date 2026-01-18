'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, Info, Coins, Banknote } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function CashOnCashReturnCalculator() {
  const { t } = useTranslation('calc/real-estate');
  const [totalInvestment, setTotalInvestment] = useState<string>('');
  const [annualCashFlow, setAnnualCashFlow] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const investment = parseFloat(totalInvestment) || 0;
    const cashFlow = parseFloat(annualCashFlow) || 0;

    if (!investment || !cashFlow) return;

    const cocReturn = (cashFlow / investment) * 100;
    setResult(parseFloat(cocReturn.toFixed(2)));
  };

  const reset = () => {
    setTotalInvestment('');
    setAnnualCashFlow('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("cash_on_cash_return_calculator.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("cash_on_cash_return_calculator.total_investment")}
          tooltip={t("cash_on_cash_return_calculator.total_investment_tooltip")}
        >
          <NumberInput
            value={totalInvestment}
            onValueChange={(val) => setTotalInvestment(val.toString())}
            placeholder={t("calculators.calc_a2d73026")}
            min={0}
            startIcon={<Coins className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("cash_on_cash_return_calculator.annual_cash_flow")}
          tooltip={t("cash_on_cash_return_calculator.annual_cash_flow_tooltip")}
        >
          <NumberInput
            value={annualCashFlow}
            onValueChange={(val) => setAnnualCashFlow(val.toString())}
            placeholder={t("calculators.calc_a30e2b7a")}
            min={0}
            startIcon={<Banknote className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("cash_on_cash_return_calculator.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("cash_on_cash_return_calculator.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result !== null ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("cash_on_cash_return_calculator.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("cash_on_cash_return_calculator.result_coc")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {result}%
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">
              {t("cash_on_cash_return_calculator.tips_title")}
            </h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">
              <li>{t("cash_on_cash_return_calculator.good_range")}</li>
              <li>{t("cash_on_cash_return_calculator.measures")}</li>
              <li>{t("cash_on_cash_return_calculator.excludes_appreciation")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <DollarSign className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">
        {t("cash_on_cash_return_calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("cash_on_cash_return_calculator.title")}
      description={t("cash_on_cash_return_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("cash_on_cash_return_calculator.footer_note")}
     className="rtl" />
  );
}
