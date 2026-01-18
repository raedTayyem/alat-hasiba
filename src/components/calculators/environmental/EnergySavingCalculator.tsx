'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Info, Lightbulb } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function EnergySavingCalculator() {
  const { t } = useTranslation(['calc/environmental', 'common']);

  const [improvementType, setImprovementType] = useState<string>('led');
  const [currentUsage, setCurrentUsage] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [result, setResult] = useState<{
    energySaved: number;
    moneySaved: number;
    co2Reduced: number;
    paybackPeriod: number;
    investmentCost: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const improvementOptions = [
    { value: 'led', label: t("energy_saving.options.led") },
    { value: 'ac-upgrade', label: t("energy_saving.options.ac_upgrade") },
    { value: 'insulation', label: t("energy_saving.options.insulation") },
    { value: 'solar-heater', label: t("energy_saving.options.solar_heater") },
    { value: 'smart-thermostat', label: t("energy_saving.options.smart_thermostat") }
  ];

  const calculate = () => {
    setError('');
    const usageVal = parseFloat(currentUsage);
    const quantityVal = parseFloat(quantity);

    if (!usageVal || !quantityVal) {
        setError(t('common.error.invalid_input'));
        return;
    }

    let energySaved = 0;
    let investmentCost = 0;

    // Energy savings and costs per improvement type
    switch (improvementType) {
      case 'led':
        // LED saves ~75% energy, costs ~30 SAR per bulb
        energySaved = usageVal * 0.75 * quantityVal * 365 / 1000; // kWh per year
        investmentCost = 30 * quantityVal;
        break;
      case 'ac-upgrade':
        // Efficient AC saves ~30% energy, costs ~3000 SAR per unit
        energySaved = usageVal * 0.30 * quantityVal * 365; // kWh per year
        investmentCost = 3000 * quantityVal;
        break;
      case 'insulation':
        // Insulation saves ~30% heating/cooling, costs ~50 SAR per m²
        energySaved = usageVal * 0.30 * 365; // kWh per year
        investmentCost = 50 * quantityVal; // quantity = m²
        break;
      case 'solar-heater':
        // Solar heater saves ~80% water heating, costs ~5000 SAR
        energySaved = usageVal * 0.80 * quantityVal * 365; // kWh per year
        investmentCost = 5000 * quantityVal;
        break;
      case 'smart-thermostat':
        // Smart thermostat saves ~20% HVAC, costs ~500 SAR
        energySaved = usageVal * 0.20 * quantityVal * 365; // kWh per year
        investmentCost = 500 * quantityVal;
        break;
    }

    // Cost per kWh in SAR
    const costPerKWh = 0.18;
    const moneySaved = energySaved * costPerKWh;

    // CO2 reduction (0.5 kg CO2 per kWh)
    const co2Reduced = energySaved * 0.5;

    // Payback period in years
    const paybackPeriod = investmentCost / moneySaved;

    setResult({
      energySaved: parseFloat(energySaved.toFixed(2)),
      moneySaved: parseFloat(moneySaved.toFixed(2)),
      co2Reduced: parseFloat(co2Reduced.toFixed(2)),
      paybackPeriod: parseFloat(paybackPeriod.toFixed(1)),
      investmentCost: parseFloat(investmentCost.toFixed(2))
    });
  };

  const reset = () => {
    setImprovementType('led');
    setCurrentUsage('');
    setQuantity('1');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("energy_saving.section_title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("energy_saving.improvement_type")} tooltip={t("energy_saving.improvement_type_tooltip")}>
          <Combobox
            options={improvementOptions}
            value={improvementType}
            onChange={(val) => setImprovementType(val)}
            placeholder={t("energy_saving.improvement_type")}
          />
        </FormField>

        <FormField label={t("energy_saving.current_usage")} tooltip={t("energy_saving.current_usage_tooltip")}>
          <NumberInput
            value={currentUsage}
            onValueChange={(val) => setCurrentUsage(val.toString())}
            unit={t("common:units.kWh")}
            placeholder={t("energy_saving.enter_usage")}
            min={0}
            step={0.1}
            startIcon={<Zap className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("energy_saving.quantity")} tooltip={t("energy_saving.quantity_tooltip")}>
          <NumberInput
            value={quantity}
            onValueChange={(val) => setQuantity(val.toString())}
            placeholder={t("energy_saving.enter_quantity")}
            min={1}
            step={1}
            startIcon={<Lightbulb className="h-4 w-4" />}
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
        {t("energy_saving.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("energy_saving.energy_saved")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {result.energySaved.toLocaleString()} kWh
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900/20">
            <div className="text-sm text-foreground-70 mb-1">
              {t("energy_saving.money_saved")}
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-400">
              {result.moneySaved.toLocaleString()} {t("carbon_offset.sar")}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900/20">
            <div className="text-sm text-foreground-70 mb-1">
              {t("energy_saving.co2_reduction")}
            </div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
              {result.co2Reduced.toLocaleString()} {t("co2_emissions.kg_co2").split(' ')[0]}
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-900/20">
            <div className="text-sm text-foreground-70 mb-1">
              {t("energy_saving.investment_cost")}
            </div>
            <div className="text-xl font-bold text-orange-700 dark:text-orange-400">
              {result.investmentCost.toLocaleString()} {t("carbon_offset.sar")}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("energy_saving.payback_period")}
            </div>
            <div className="text-xl font-bold text-primary">
              {result.paybackPeriod} {t("energy_saving.years")}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            {t("energy_saving.tips_title")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("energy_saving.tip_payback")}</li>
            <li>{t("energy_saving.tip_combine")}</li>
            <li>{t("energy_saving.tip_finance")}</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Zap className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">
        {t("energy_saving.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("energy_saving.title")}
      description={t("energy_saving.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("energy_saving.footer_note")}
     className="rtl" />
  );
}
