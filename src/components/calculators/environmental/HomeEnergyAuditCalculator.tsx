'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

export default function HomeEnergyAuditCalculator() {
  const { t } = useTranslation(['calc/environmental', 'common']);

  const [electricity, setElectricity] = useState<string>('');
  const [heating, setHeating] = useState<string>('');
  const [cooling, setCooling] = useState<string>('');
  const [waterHeater, setWaterHeater] = useState<string>('');
  const [appliances, setAppliances] = useState<string>('');
  const [result, setResult] = useState<{
    totalEnergy: number;
    monthlyCost: number;
    annualCost: number;
    co2Emissions: number;
    breakdown: { [key: string]: number };
    savingsPotential: number;
  } | null>(null);

  const calculate = () => {
    const electricityVal = parseFloat(electricity) || 0;
    const heatingVal = parseFloat(heating) || 0;
    const coolingVal = parseFloat(cooling) || 0;
    const waterHeaterVal = parseFloat(waterHeater) || 0;
    const appliancesVal = parseFloat(appliances) || 0;

    const totalEnergy = electricityVal + heatingVal + coolingVal + waterHeaterVal + appliancesVal;

    // Cost per kWh in SAR (approximate)
    const costPerKWh = 0.18;
    const monthlyCost = totalEnergy * costPerKWh;
    const annualCost = monthlyCost * 12;

    // CO2 emissions (0.5 kg CO2 per kWh)
    const co2 = totalEnergy * 12 * 0.5;

    // Breakdown percentages
    const breakdown = {
      electricity: electricityVal,
      heating: heatingVal,
      cooling: coolingVal,
      waterHeater: waterHeaterVal,
      appliances: appliancesVal
    };

    // Potential savings (estimated 20-30% with efficiency improvements)
    const savingsPotential = annualCost * 0.25;

    setResult({
      totalEnergy: parseFloat(totalEnergy.toFixed(2)),
      monthlyCost: parseFloat(monthlyCost.toFixed(2)),
      annualCost: parseFloat(annualCost.toFixed(2)),
      co2Emissions: parseFloat(co2.toFixed(2)),
      breakdown,
      savingsPotential: parseFloat(savingsPotential.toFixed(2))
    });
  };

  const reset = () => {
    setElectricity('');
    setHeating('');
    setCooling('');
    setWaterHeater('');
    setAppliances('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("home_energy_audit.section_title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer
          label={t("home_energy_audit.lighting")}
          tooltip={t("home_energy_audit.lighting_tooltip")}
        >
          <NumericInput
            value={electricity}
            onChange={(e: any) => setElectricity(e.target.value)}
            unit={t("common:units.kWh")}
            placeholder={t("home_energy_audit.enter_consumption")}
            min={0}
          />
        </InputContainer>

        <InputContainer
          label={t("home_energy_audit.heating")}
          tooltip={t("home_energy_audit.heating_tooltip")}
        >
          <NumericInput
            value={heating}
            onChange={(e: any) => setHeating(e.target.value)}
            unit={t("common:units.kWh")}
            placeholder={t("home_energy_audit.enter_consumption")}
            min={0}
          />
        </InputContainer>

        <InputContainer
          label={t("home_energy_audit.cooling")}
          tooltip={t("home_energy_audit.cooling_tooltip")}
        >
          <NumericInput
            value={cooling}
            onChange={(e: any) => setCooling(e.target.value)}
            unit={t("common:units.kWh")}
            placeholder={t("home_energy_audit.enter_consumption")}
            min={0}
          />
        </InputContainer>

        <InputContainer
          label={t("home_energy_audit.water_heater")}
          tooltip={t("home_energy_audit.water_heater_tooltip")}
        >
          <NumericInput
            value={waterHeater}
            onChange={(e: any) => setWaterHeater(e.target.value)}
            unit={t("common:units.kWh")}
            placeholder={t("home_energy_audit.enter_consumption")}
            min={0}
          />
        </InputContainer>

        <InputContainer
          label={t("home_energy_audit.appliances")}
          tooltip={t("home_energy_audit.appliances_tooltip")}
        >
          <NumericInput
            value={appliances}
            onChange={(e: any) => setAppliances(e.target.value)}
            unit={t("common:units.kWh")}
            placeholder={t("home_energy_audit.enter_consumption")}
            min={0}
          />
        </InputContainer>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("home_energy_audit.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("home_energy_audit.total_consumption")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {result.totalEnergy.toLocaleString()} kWh
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-foreground/5 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("home_energy_audit.monthly_cost")}
            </div>
            <div className="text-xl font-bold">
              {result.monthlyCost.toLocaleString()} {t("carbon_offset.sar")}
            </div>
          </div>

          <div className="bg-foreground/5 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("home_energy_audit.annual_cost")}
            </div>
            <div className="text-xl font-bold">
              {result.annualCost.toLocaleString()} {t("carbon_offset.sar")}
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-900/20">
            <div className="text-sm text-foreground-70 mb-1">
              {t("home_energy_audit.annual_emissions")}
            </div>
            <div className="text-xl font-bold text-orange-700 dark:text-orange-400">
              {result.co2Emissions.toLocaleString()} {t("co2_emissions.kg_co2")}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900/20">
            <div className="text-sm text-foreground-70 mb-1">
              {t("home_energy_audit.potential_savings")}
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-400">
              {result.savingsPotential.toLocaleString()} {t("carbon_offset.sar")}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">
            {t("home_energy_audit.tips_title")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("home_energy_audit.tip_led")}</li>
            <li>{t("home_energy_audit.tip_ac")}</li>
            <li>{t("home_energy_audit.tip_unplug")}</li>
            <li>{t("home_energy_audit.tip_insulation")}</li>
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
        {t("home_energy_audit.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("home_energy_audit.title")}
      description={t("home_energy_audit.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("home_energy_audit.footer_note")}
     className="rtl" />
  );
}
