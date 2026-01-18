'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

export default function CarbonOffsetCalculator() {
  const { t } = useTranslation('calc/environmental');

  const [co2Amount, setCo2Amount] = useState<string>('');
  const [offsetMethod, setOffsetMethod] = useState<string>('trees');
  const [result, setResult] = useState<{
    treesNeeded: number;
    solarPanels: number;
    windTurbines: number;
    offsetCost: number;
    landArea: number;
  } | null>(null);

  const methodOptions: ComboboxOption[] = [
    { value: 'trees', label: t("carbon_offset.options.trees") },
    { value: 'solar', label: t("carbon_offset.options.solar") },
    { value: 'wind', label: t("carbon_offset.options.wind") },
    { value: 'mixed', label: t("carbon_offset.options.mixed") }
  ];

  const calculate = () => {
    const co2Val = parseFloat(co2Amount);
    if (!co2Val) return;

    // Trees needed (one tree absorbs ~21 kg CO2 per year)
    const trees = co2Val / 21;

    // Solar panels needed (one panel offsets ~1500 kg CO2 per year)
    const solar = co2Val / 1500;

    // Wind turbines needed (one turbine offsets ~1500000 kg CO2 per year)
    const wind = co2Val / 1500000;

    // Carbon offset cost (approximate $5 per ton CO2)
    const cost = (co2Val / 1000) * 5 * 3.75; // Convert to SAR

    // Land area needed for trees (one tree needs ~10 m²)
    const area = trees * 10;

    setResult({
      treesNeeded: Math.ceil(trees),
      solarPanels: parseFloat(solar.toFixed(2)),
      windTurbines: parseFloat(wind.toFixed(4)),
      offsetCost: parseFloat(cost.toFixed(2)),
      landArea: parseFloat(area.toFixed(2))
    });
  };

  const reset = () => {
    setCo2Amount('');
    setOffsetMethod('trees');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("carbon_offset.carbon_amount")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer
          label={t("carbon_offset.co2_amount")}
          tooltip={t("carbon_offset.co2_amount_tooltip")}
        >
          <NumberInput
            value={co2Amount}
            onValueChange={(val) => setCo2Amount(String(val))}
            endIcon={<span className="text-xs text-muted-foreground">{t("co2_emissions.kg_co2")}</span>}
            placeholder={t("co2_emissions.enter_amount")}
            min={0}
          />
        </InputContainer>

        <InputContainer
          label={t("carbon_offset.preferred_method")}
          tooltip={t("carbon_offset.preferred_method_tooltip")}
        >
          <Combobox options={methodOptions} value={offsetMethod} onChange={setOffsetMethod} />
        </InputContainer>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("carbon_offset.offset_options")}
      </h3>

      <div className="space-y-4">
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-foreground-70">
              {t("carbon_offset.tree_planting")}
            </div>
            <div className="text-2xl">🌳</div>
          </div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-400">
            {result.treesNeeded.toLocaleString()} {t("carbon_offset.trees")}
          </div>
          <div className="text-sm text-foreground-70 mt-1">
            {t("carbon_offset.required_area")} {result.landArea.toLocaleString()} {t("carbon_offset.sq_m")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-900/20">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-foreground-70">
                {t("carbon_offset.solar_energy")}
              </div>
              <div className="text-2xl">☀️</div>
            </div>
            <div className="text-xl font-bold text-yellow-700 dark:text-yellow-400">
              {result.solarPanels.toLocaleString()} {t("carbon_offset.panels")}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900/20">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-foreground-70">
                {t("carbon_offset.wind_energy")}
              </div>
              <div className="text-2xl">💨</div>
            </div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
              {result.windTurbines.toLocaleString()} {t("carbon_offset.turbines")}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("carbon_offset.estimated_cost")}
            </div>
            <div className="text-xl font-bold text-primary">
              {result.offsetCost.toLocaleString()} {t("carbon_offset.sar")}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">
            {t("carbon_offset.tips_title")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("carbon_offset.tip_native")}</li>
            <li>{t("carbon_offset.tip_renewable")}</li>
            <li>{t("carbon_offset.tip_certified")}</li>
            <li>{t("carbon_offset.tip_reduce")}</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <p className="text-foreground-70">
        {t("carbon_offset.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("carbon_offset.title")}
      description={t("carbon_offset.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("carbon_offset.footer_note")}
     className="rtl" />
  );
}
