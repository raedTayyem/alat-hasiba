'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function HOAFeeCalculator() {
  const { t } = useTranslation('calc/real-estate');
  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const monthlyFee = parseFloat(value1) || 0;
    const annualFee = parseFloat(value2) || 0;

    if (monthlyFee > 0) {
      setResult(parseFloat((monthlyFee * 12).toFixed(2)));
    } else if (annualFee > 0) {
      setResult(parseFloat((annualFee / 12).toFixed(2)));
    } else {
      return;
    }
  };

  const reset = () => {
    setValue1('');
    setValue2('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("hoa_fee_calculator.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("hoa_fee_calculator.monthly_fee")}
          tooltip={t("hoa_fee_calculator.monthly_fee_tooltip")}
        >
          <NumberInput
            value={value1}
            onValueChange={(val) => {
              setValue1(val.toString());
              if (val) setValue2(''); // Clear annual if monthly is entered
            }}
            placeholder={t("calculators.enter_value_4")}
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("hoa_fee_calculator.annual_fee")}
          tooltip={t("hoa_fee_calculator.annual_fee_tooltip")}
        >
          <NumberInput
            value={value2}
            onValueChange={(val) => {
              setValue2(val.toString());
              if (val) setValue1(''); // Clear monthly if annual is entered
            }}
            placeholder={t("calculators.enter_value_4")}
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("hoa_fee_calculator.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("hoa_fee_calculator.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result !== null ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("hoa_fee_calculator.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {value1 ? t("hoa_fee_calculator.total_annual_cost") : t("hoa_fee_calculator.total_monthly_cost")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {result.toLocaleString()} {t("calculators.calc_726") || "$"}
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">
              {t("hoa_fee_calculator.tips_title")}
            </h4>
            <p className="text-sm text-foreground-70">
              {t("hoa_fee_calculator.footer_note")}
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
        {t("hoa_fee_calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("hoa_fee_calculator.title")}
      description={t("hoa_fee_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("hoa_fee_calculator.footer_note")}
     className="rtl" />
  );
}
