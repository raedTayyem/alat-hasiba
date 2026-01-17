'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, Info, Percent, AlertCircle, CheckCircle } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function DebtToIncomeRatioCalculator() {
  const { t } = useTranslation('calc/real-estate');
  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const income = parseFloat(value1) || 0;
    const debt = parseFloat(value2) || 0;

    if (!income || !debt) return;

    // DTI = (Total Monthly Debt / Gross Monthly Income) * 100
    const dtiRatio = (debt / income) * 100;
    setResult(parseFloat(dtiRatio.toFixed(2)));
  };

  const reset = () => {
    setValue1('');
    setValue2('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("debt_to_income_ratio_calculator.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("debt_to_income_ratio_calculator.monthly_income")}
          tooltip={t("debt_to_income_ratio_calculator.monthly_income_tooltip")}
        >
          <NumberInput
            value={value1}
            onValueChange={(val) => setValue1(val.toString())}
            placeholder={t("calculators.enter_value_4")}
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("debt_to_income_ratio_calculator.monthly_debt")}
          tooltip={t("debt_to_income_ratio_calculator.monthly_debt_tooltip")}
        >
          <NumberInput
            value={value2}
            onValueChange={(val) => setValue2(val.toString())}
            placeholder={t("calculators.enter_value_4")}
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("debt_to_income_ratio_calculator.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("debt_to_income_ratio_calculator.reset_btn")}
        </button>
      </div>
    </>
  );

  const getResultStatus = (dti: number) => {
    if (dti <= 36) return { text: t("debt_to_income_ratio_calculator.result_status_good"), color: "text-green-600", icon: <CheckCircle className="w-5 h-5" /> };
    if (dti <= 43) return { text: t("debt_to_income_ratio_calculator.result_status_manageable"), color: "text-blue-600", icon: <Info className="w-5 h-5" /> };
    if (dti <= 50) return { text: t("debt_to_income_ratio_calculator.result_status_high"), color: "text-orange-600", icon: <AlertCircle className="w-5 h-5" /> };
    return { text: t("debt_to_income_ratio_calculator.result_status_critical"), color: "text-red-600", icon: <AlertCircle className="w-5 h-5" /> };
  };

  const resultSection = result !== null ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("debt_to_income_ratio_calculator.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("debt_to_income_ratio_calculator.dti_ratio")}
          </div>
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <Percent className="w-6 h-6" />
            {result}%
          </div>
          <div className={`text-lg font-medium mt-2 ${getResultStatus(result).color} flex items-center gap-2`}>
            {getResultStatus(result).icon}
            {getResultStatus(result).text}
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">
              {t("debt_to_income_ratio_calculator.tips_title")}
            </h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">
              <li>{t("debt_to_income_ratio_calculator.tip_good")}</li>
              <li>{t("debt_to_income_ratio_calculator.tip_manageable")}</li>
              <li>{t("debt_to_income_ratio_calculator.tip_high")}</li>
              <li>{t("debt_to_income_ratio_calculator.tip_critical")}</li>
            </ul>
            <p className="text-sm text-foreground-70 mt-2">
              {t("debt_to_income_ratio_calculator.footer_note")}
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
        {t("debt_to_income_ratio_calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("debt_to_income_ratio_calculator.title")}
      description={t("debt_to_income_ratio_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("debt_to_income_ratio_calculator.footer_note")}
     className="rtl" />
  );
}
