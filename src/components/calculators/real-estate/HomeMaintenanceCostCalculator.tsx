'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, Clock, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function HomeMaintenanceCostCalculator() {
  const { t } = useTranslation('calc/real-estate');
  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const homeValue = parseFloat(value1) || 0;
    const homeAge = parseFloat(value2) || 0;

    if (!homeValue) return;

    // 1% Rule: 1% of home value per year
    // Square Footage Rule: $1 per square foot (not using here as we don't have sq ft input)
    // Age adjustment: Older homes cost more. 
    // Base 1% + 0.1% per 10 years of age?
    // Let's stick to a range or a simple formula.
    // 1% to 4% depending on age.
    
    let maintenanceRate = 0.01; // 1% base
    if (homeAge > 10) maintenanceRate += 0.005; // 1.5%
    if (homeAge > 20) maintenanceRate += 0.005; // 2%
    if (homeAge > 30) maintenanceRate += 0.01;  // 3%
    
    const annualCost = homeValue * maintenanceRate;
    setResult(parseFloat(annualCost.toFixed(2)));
  };

  const reset = () => {
    setValue1('');
    setValue2('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("home_maintenance_cost_calculator.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("home_maintenance_cost_calculator.home_value")}
          tooltip={t("home_maintenance_cost_calculator.home_value_tooltip")}
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
          label={t("home_maintenance_cost_calculator.home_age")}
          tooltip={t("home_maintenance_cost_calculator.home_age_tooltip")}
        >
          <NumberInput
            value={value2}
            onValueChange={(val) => setValue2(val.toString())}
            placeholder={t("calculators.enter_value_4")}
            min={0}
            startIcon={<Clock className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("home_maintenance_cost_calculator.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("home_maintenance_cost_calculator.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result !== null ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("home_maintenance_cost_calculator.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("home_maintenance_cost_calculator.annual_cost")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {result.toLocaleString()} {t("calculators.calc_726") || "$"}
          </div>
        </div>

        <div className="bg-foreground/5 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("home_maintenance_cost_calculator.monthly_cost")}
          </div>
          <div className="text-xl font-bold">
            {(result / 12).toLocaleString(undefined, { maximumFractionDigits: 2 })} {t("calculators.calc_726") || "$"}
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">
              {t("home_maintenance_cost_calculator.tips_title")}
            </h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">
              <li>{t("home_maintenance_cost_calculator.tip_savings")}</li>
              <li>{t("home_maintenance_cost_calculator.tip_age")}</li>
              <li>{t("home_maintenance_cost_calculator.tip_emergency")}</li>
            </ul>
            <p className="text-sm text-foreground-70 mt-2">
              {t("home_maintenance_cost_calculator.footer_note")}
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
        {t("home_maintenance_cost_calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("home_maintenance_cost_calculator.title")}
      description={t("home_maintenance_cost_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("home_maintenance_cost_calculator.footer_note")}
     className="rtl" />
  );
}
