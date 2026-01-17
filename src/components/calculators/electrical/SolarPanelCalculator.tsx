'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function SolarPanelCalculator() {
  const { t } = useTranslation('calc/electrical');
  const [dailyConsumption, setDailyConsumption] = useState<string>('');
  const [peakSunHours, setPeakSunHours] = useState<string>('');
  const [systemVoltage, setSystemVoltage] = useState<string>('');
  const [panelWattage, setPanelWattage] = useState<string>('100');
  const [result, setResult] = useState<{
    numPanels: number;
    totalWattage: number;
    batteryCapacity: number;
    chargeCurrent: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const consumption = parseFloat(dailyConsumption);
    const sunHours = parseFloat(peakSunHours);
    const voltage = parseFloat(systemVoltage);
    const wattage = parseFloat(panelWattage);

    if (!consumption || !sunHours || !voltage || !wattage) {
      setError(t("common.errors.invalid"));
      return;
    }

    // Calculate required solar panel capacity
    const systemEfficiency = 0.85; // Account for losses
    const requiredWattage = consumption / (sunHours * systemEfficiency);

    // Number of panels needed
    const numPanels = Math.ceil(requiredWattage / wattage);

    // Total system wattage
    const totalWattage = numPanels * wattage;

    // Recommended battery capacity (2-3 days autonomy)
    const batteryCapacity = (consumption * 2) / voltage;

    // Charge current
    const chargeCurrent = totalWattage / voltage;

    setResult({
      numPanels,
      totalWattage: parseFloat(totalWattage.toFixed(2)),
      batteryCapacity: parseFloat(batteryCapacity.toFixed(2)),
      chargeCurrent: parseFloat(chargeCurrent.toFixed(2))
    });
  };

  const reset = () => {
    setDailyConsumption('');
    setPeakSunHours('5');
    setSystemVoltage('12');
    setPanelWattage('100');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("solar_panel.inputs.daily_consumption")} tooltip={t("solar_panel.tooltips.daily_consumption")}>
          <NumericInput
            value={dailyConsumption}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDailyConsumption(e.target.value)}
            unit={t("ohms_law.unit_watt_hour")}
            placeholder={t("solar_panel.placeholders.daily_consumption")}
            min={0}
            step={100}
          />
        </InputContainer>

        <InputContainer label={t("solar_panel.inputs.sun_hours")} tooltip={t("solar_panel.tooltips.sun_hours")}>
          <NumericInput
            value={peakSunHours}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPeakSunHours(e.target.value)}
            unit={t("battery_life.hours")}
            placeholder={t("solar_panel.placeholders.sun_hours")}
            min={0}
            step={0.5}
          />
        </InputContainer>

        <InputContainer label={t("solar_panel.inputs.system_voltage")} tooltip={t("solar_panel.tooltips.system_voltage")}>
          <select
            value={systemVoltage}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSystemVoltage(e.target.value)}
            className="calculator-input w-full"
          >
            <option value="12">12{t("ohms_law.unit_voltage")}</option>
            <option value="24">24{t("ohms_law.unit_voltage")}</option>
            <option value="48">48{t("ohms_law.unit_voltage")}</option>
          </select>
        </InputContainer>

        <InputContainer label={t("solar_panel.inputs.panel_wattage")} tooltip={t("solar_panel.tooltips.panel_wattage")}>
          <NumericInput
            value={panelWattage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPanelWattage(e.target.value)}
            unit={t("ohms_law.unit_power")}
            placeholder={t("solar_panel.placeholders.panel_wattage")}
            min={0}
            step={10}
          />
        </InputContainer>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("ohms_law.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("solar_panel.results.num_panels")}
          </div>
          <div className="text-3xl font-bold text-primary">{result.numPanels}</div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("solar_panel.results.total_wattage")}</div>
          <div className="text-xl font-bold text-purple-600">{result.totalWattage} {t("ohms_law.unit_power")}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("solar_panel.results.battery_capacity")}
            </div>
            <div className="text-xl font-bold text-green-600">{result.batteryCapacity} {t("ohms_law.unit_amp_hour")}</div>
            <div className="text-xs text-foreground-70">
              {t("solar_panel.results.batteries_desc")}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("solar_panel.results.charge_controller")}
            </div>
            <div className="text-xl font-bold text-blue-600">{result.chargeCurrent} {t("ohms_law.unit_current")}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("solar_panel.info.title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">{t("solar_panel.info.desc")}</ul>
        </div>
      </div>
    </div>
  ) : (
      <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
      <p className="text-foreground-70">{t("solar_panel.description")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("solar_panel.title")}
      description={t("solar_panel.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("solar_panel.info.desc")}
     className="rtl" />
  );
}
