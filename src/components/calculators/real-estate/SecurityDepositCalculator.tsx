'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, Info, CreditCard, ShieldCheck, AlertCircle } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function SecurityDepositCalculator() {
  const { t } = useTranslation('calc/real-estate');
  const [monthlyRent, setMonthlyRent] = useState<string>('');
  const [creditScore, setCreditScore] = useState<string>('');
  const [result, setResult] = useState<{
    recommended: number;
    maxLimit: number;
  } | null>(null);

  const calculate = () => {
    const rent = parseFloat(monthlyRent) || 0;
    const score = parseFloat(creditScore) || 0;

    if (!rent) return;

    // Logic:
    // Recommended deposit is typically 1 month rent.
    // If credit score is low (< 650), maybe 1.5 or 2 months.
    // Max limit is often 2 months rent (varies by location).
    
    let multiplier = 1;
    if (score && score < 650) {
        multiplier = 1.5;
    }
    if (score && score < 600) {
        multiplier = 2;
    }

    const recommended = rent * multiplier;
    const maxLimit = rent * 2; // Common legal limit

    setResult({
      recommended: parseFloat(recommended.toFixed(2)),
      maxLimit: parseFloat(maxLimit.toFixed(2))
    });
  };

  const reset = () => {
    setMonthlyRent('');
    setCreditScore('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("security_deposit_calculator.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("security_deposit_calculator.monthly_rent")}
          tooltip={t("security_deposit_calculator.monthly_rent_tooltip")}
        >
          <NumberInput
            value={monthlyRent}
            onValueChange={(val) => setMonthlyRent(val.toString())}
            placeholder={t("security_deposit_calculator.enter_monthly_rent")}
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("security_deposit_calculator.credit_score")}
          tooltip={t("security_deposit_calculator.credit_score_tooltip")}
        >
          <NumberInput
            value={creditScore}
            onValueChange={(val) => setCreditScore(val.toString())}
            placeholder={t("placeholders.creditScore")}
            min={300}
            max={850}
            startIcon={<CreditCard className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("security_deposit_calculator.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("security_deposit_calculator.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("security_deposit_calculator.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("security_deposit_calculator.recommended_deposit")}
          </div>
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <ShieldCheck className="w-6 h-6" />
            {result.recommended.toLocaleString()} {t("security_deposit_calculator.currency")}
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-sm text-foreground-70 mb-1">
            {t("security_deposit_calculator.max_deposit")}
          </div>
          <div className="text-xl font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            {result.maxLimit.toLocaleString()} {t("security_deposit_calculator.currency")}
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">
              {t("security_deposit_calculator.tips_title")}
            </h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">
              <li>{t("security_deposit_calculator.tip_credit")}</li>
              <li>{t("security_deposit_calculator.tip_laws")}</li>
              <li>{t("security_deposit_calculator.tip_pets")}</li>
            </ul>
            <p className="text-sm text-foreground-70 mt-2">
              {t("security_deposit_calculator.footer_note")}
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
        {t("security_deposit_calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("security_deposit_calculator.title")}
      description={t("security_deposit_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("security_deposit_calculator.footer_note")}
     className="rtl" />
  );
}
