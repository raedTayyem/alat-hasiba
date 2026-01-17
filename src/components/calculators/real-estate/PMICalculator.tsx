'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, Percent, Info, ShieldAlert, ShieldCheck } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function PMICalculator() {
  const { t } = useTranslation('calc/real-estate');
  const [homePrice, setHomePrice] = useState<string>('');
  const [downPayment, setDownPayment] = useState<string>('');
  const [pmiRate, setPmiRate] = useState<string>('0.5');
  const [result, setResult] = useState<{
    loanAmount: number;
    ltvRatio: number;
    needsPMI: boolean;
    monthlyPMI: number;
    annualPMI: number;
    equityNeeded: number;
  } | null>(null);

  const calculate = () => {
    const price = parseFloat(homePrice) || 0;
    const down = parseFloat(downPayment) || 0;
    const rate = parseFloat(pmiRate) || 0;

    if (!price || !down) return;

    const loanAmount = price - down;
    const ltvRatio = (loanAmount / price) * 100;
    const needsPMI = ltvRatio > 80;

    const annualPMI = needsPMI ? (loanAmount * rate / 100) : 0;
    const monthlyPMI = annualPMI / 12;

    // Equity needed to reach 80% LTV (20% equity)
    const targetEquity = price * 0.20;
    const currentEquity = down;
    const equityNeeded = Math.max(0, targetEquity - currentEquity);

    setResult({
      loanAmount: parseFloat(loanAmount.toFixed(2)),
      ltvRatio: parseFloat(ltvRatio.toFixed(2)),
      needsPMI,
      monthlyPMI: parseFloat(monthlyPMI.toFixed(2)),
      annualPMI: parseFloat(annualPMI.toFixed(2)),
      equityNeeded: parseFloat(equityNeeded.toFixed(2))
    });
  };

  const reset = () => {
    setHomePrice('');
    setDownPayment('');
    setPmiRate('0.5');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("pmi_calculator.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("pmi_calculator.home_price")}
          tooltip={t("pmi_calculator.home_price_tooltip")}
        >
          <NumberInput
            value={homePrice}
            onValueChange={(val) => setHomePrice(val.toString())}
            placeholder={t("pmi_calculator.enter_home_price")}
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("pmi_calculator.down_payment")}
          tooltip={t("pmi_calculator.down_payment_tooltip")}
        >
          <NumberInput
            value={downPayment}
            onValueChange={(val) => setDownPayment(val.toString())}
            placeholder={t("pmi_calculator.enter_down_payment")}
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("pmi_calculator.pmi_rate")}
          tooltip={t("pmi_calculator.pmi_rate_tooltip")}
        >
          <NumberInput
            value={pmiRate}
            onValueChange={(val) => setPmiRate(val.toString())}
            placeholder={t("pmi_calculator.enter_pmi_rate")}
            min={0}
            step={0.1}
            startIcon={<Percent className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("pmi_calculator.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("pmi_calculator.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("pmi_calculator.results_title")}
      </h3>

      <div className="space-y-4">
        {result.needsPMI ? (
          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 p-4 rounded-lg flex items-center justify-center gap-2">
            <ShieldAlert className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <div className="text-orange-700 dark:text-orange-300 font-bold text-center">
              {t("pmi_calculator.pmi_required")}
            </div>
          </div>
        ) : (
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 p-4 rounded-lg flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div className="text-green-700 dark:text-green-300 font-bold text-center">
              {t("pmi_calculator.pmi_not_required")}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("pmi_calculator.loan_amount")}
            </div>
            <div className="text-xl font-bold">
              {result.loanAmount.toLocaleString()} {t("pmi_calculator.currency")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("pmi_calculator.ltv_ratio")}
            </div>
            <div className={`text-xl font-bold ${result.ltvRatio > 80 ? 'text-orange-600' : 'text-green-600'}`}>
              {result.ltvRatio}%
            </div>
          </div>
        </div>

        {result.needsPMI && (
          <>
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
              <div className="text-sm text-foreground-70 mb-1">
                {t("pmi_calculator.monthly_pmi")}
              </div>
              <div className="text-3xl font-bold text-primary">
                {result.monthlyPMI.toLocaleString()} {t("pmi_calculator.currency")}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="text-sm text-foreground-70 mb-1">
                  {t("pmi_calculator.annual_pmi")}
                </div>
                <div className="text-xl font-bold">
                  {result.annualPMI.toLocaleString()} {t("pmi_calculator.currency")}
                </div>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="text-sm text-foreground-70 mb-1">
                  {t("pmi_calculator.equity_needed")}
                </div>
                <div className="text-xl font-bold">
                  {result.equityNeeded.toLocaleString()} {t("pmi_calculator.currency")}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">
              {t("pmi_calculator.tips_title")}
            </h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">
              <li>{t("pmi_calculator.tip_when_required")}</li>
              <li>{t("pmi_calculator.tip_cancellation")}</li>
              <li>{t("pmi_calculator.tip_cost")}</li>
              <li>{t("pmi_calculator.tip_rates")}</li>
              <li>{t("pmi_calculator.tip_removal")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <ShieldAlert className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">
        {t("pmi_calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("pmi_calculator.title")}
      description={t("pmi_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("pmi_calculator.description")}
     className="rtl" />
  );
}
