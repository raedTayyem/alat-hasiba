'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Factory, Fuel, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function CO2EmissionsCalculator() {
  const { t } = useTranslation('calc/environmental');

  const [activityType, setActivityType] = useState<string>('electricity');
  const [amount, setAmount] = useState<string>('');
  const [result, setResult] = useState<{
    co2Emissions: number;
    treesEquivalent: number;
    carsEquivalent: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const activityOptions = [
    { value: 'electricity', label: t("co2_emissions.options.electricity") },
    { value: 'naturalgas', label: t("co2_emissions.options.naturalgas") },
    { value: 'petrol', label: t("co2_emissions.options.petrol") },
    { value: 'diesel', label: t("co2_emissions.options.diesel") },
    { value: 'coal', label: t("co2_emissions.options.coal") },
    { value: 'propane', label: t("co2_emissions.options.propane") }
  ];

  const emissionFactors: { [key: string]: number } = {
    'electricity': 0.5,      // kg CO2 per kWh
    'naturalgas': 2.0,       // kg CO2 per m³
    'petrol': 2.31,          // kg CO2 per liter
    'diesel': 2.68,          // kg CO2 per liter
    'coal': 2.42,            // kg CO2 per kg
    'propane': 3.00          // kg CO2 per kg
  };

  const calculate = () => {
    setError('');
    const amountVal = parseFloat(amount);
    if (!amountVal) {
        setError(t('common.error.invalid_input'));
        return;
    }

    const factor = emissionFactors[activityType];
    const co2 = amountVal * factor;

    // One tree absorbs ~21 kg CO2 per year
    const trees = co2 / 21;

    // Average car emits ~4.6 metric tons per year
    const carsPerYear = co2 / 4600;

    setResult({
      co2Emissions: parseFloat(co2.toFixed(2)),
      treesEquivalent: parseFloat(trees.toFixed(2)),
      carsEquivalent: parseFloat(carsPerYear.toFixed(4))
    });
  };

  const reset = () => {
    setActivityType('electricity');
    setAmount('');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("co2_emissions.activity_details")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("co2_emissions.activity_type")}
          tooltip={t("co2_emissions.activity_type_tooltip")}
        >
          <Combobox
            options={activityOptions}
            value={activityType}
            onChange={(val) => setActivityType(val)}
            placeholder={t("co2_emissions.activity_type")}
          />
        </FormField>

        <FormField
          label={t("co2_emissions.amount")}
          tooltip={t("co2_emissions.amount_tooltip")}
        >
          <NumberInput
            value={amount}
            onValueChange={(val) => setAmount(val.toString())}
            placeholder={t("co2_emissions.enter_amount")}
            min={0}
            step={0.1}
            startIcon={<Fuel className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />

      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("co2_emissions.results")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("co2_emissions.co2_emissions_result")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {result.co2Emissions.toLocaleString()} {t("co2_emissions.kg_co2")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900/20">
            <div className="text-sm text-foreground-70 mb-1">
              {t("co2_emissions.trees_needed")}
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-400">
              {result.treesEquivalent.toLocaleString()} {t("co2_emissions.trees")}
            </div>
            <div className="text-xs text-foreground-70 mt-1">
              {t("co2_emissions.per_year")}
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-900/20">
            <div className="text-sm text-foreground-70 mb-1">
              {t("co2_emissions.car_equivalent")}
            </div>
            <div className="text-xl font-bold text-orange-700 dark:text-orange-400">
              {(result.carsEquivalent * 365).toFixed(1)} {t("co2_emissions.days")}
            </div>
            <div className="text-xs text-foreground-70 mt-1">
              {t("co2_emissions.avg_car")}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            {t("co2_emissions.facts_title")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("co2_emissions.fact_trees")}</li>
            <li>{t("co2_emissions.fact_car")}</li>
            <li>{t("co2_emissions.fact_emissions")}</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Factory className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">
        {t("co2_emissions.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("co2_emissions.title")}
      description={t("co2_emissions.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("co2_emissions.footer_note")}
     className="rtl" />
  );
}
