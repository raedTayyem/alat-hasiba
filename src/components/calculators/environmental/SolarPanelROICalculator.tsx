'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

export default function SolarPanelROICalculator() {
  const { t } = useTranslation(['calc/environmental', 'common']);

  const [systemSize, setSystemSize] = useState<string>('');
  const [installCost, setInstallCost] = useState<string>('');
  const [monthlyBill, setMonthlyBill] = useState<string>('');
  const [sunHours, setSunHours] = useState<string>('5.5');
  const [result, setResult] = useState<{
    annualProduction: number;
    annualSavings: number;
    paybackPeriod: number;
    roi25Years: number;
    co2Offset: number;
    treesEquivalent: number;
  } | null>(null);

  const calculate = () => {
    const systemSizeVal = parseFloat(systemSize);
    const installCostVal = parseFloat(installCost);
    const monthlyBillVal = parseFloat(monthlyBill);
    const sunHoursVal = parseFloat(sunHours);

    if (!systemSizeVal || !installCostVal || !monthlyBillVal) return;

    // Annual production (kWh) = System size (kW) × Sun hours × 365 × 0.75 (efficiency factor)
    const annualProduction = systemSizeVal * sunHoursVal * 365 * 0.75;

    // Annual savings = Annual production × electricity rate (0.18 SAR/kWh)
    const electricityRate = 0.18;
    const annualSavings = annualProduction * electricityRate;

    // Payback period (years)
    const paybackPeriod = installCostVal / annualSavings;

    // ROI over 25 years (typical panel lifespan)
    const totalSavings25Years = annualSavings * 25;
    const roi25Years = ((totalSavings25Years - installCostVal) / installCostVal) * 100;

    // CO2 offset (0.5 kg CO2 per kWh)
    const co2Offset = annualProduction * 0.5;

    // Trees equivalent (one tree absorbs ~21 kg CO2 per year)
    const treesEquivalent = co2Offset / 21;

    setResult({
      annualProduction: parseFloat(annualProduction.toFixed(2)),
      annualSavings: parseFloat(annualSavings.toFixed(2)),
      paybackPeriod: parseFloat(paybackPeriod.toFixed(1)),
      roi25Years: parseFloat(roi25Years.toFixed(2)),
      co2Offset: parseFloat(co2Offset.toFixed(2)),
      treesEquivalent: parseFloat(treesEquivalent.toFixed(1))
    });
  };

  const reset = () => {
    setSystemSize('');
    setInstallCost('');
    setMonthlyBill('');
    setSunHours('5.5');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("solar-panel-roi-calculator.input_title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer
          label={t("solar-panel-roi-calculator.system_size")}
          tooltip={t("solar-panel-roi-calculator.system_size_tooltip")}
        >
          <NumericInput
            value={systemSize}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSystemSize(e.target.value)}
            unit={t("common:units.kW")}
            placeholder={t("solar-panel-roi-calculator.enter_size")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer
          label={t("solar-panel-roi-calculator.install_cost")}
          tooltip={t("solar-panel-roi-calculator.install_cost_tooltip")}
        >
          <NumericInput
            value={installCost}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInstallCost(e.target.value)}
            unit={t("solar-panel-roi-calculator.currency")}
            placeholder={t("solar-panel-roi-calculator.enter_cost")}
            min={0}
          />
        </InputContainer>

        <InputContainer
          label={t("solar-panel-roi-calculator.monthly_bill")}
          tooltip={t("solar-panel-roi-calculator.monthly_bill_tooltip")}
        >
          <NumericInput
            value={monthlyBill}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMonthlyBill(e.target.value)}
            unit={t("solar-panel-roi-calculator.currency")}
            placeholder={t("solar-panel-roi-calculator.enter_bill")}
            min={0}
          />
        </InputContainer>

        <InputContainer
          label={t("solar-panel-roi-calculator.sun_hours")}
          tooltip={t("solar-panel-roi-calculator.sun_hours_tooltip")}
        >
          <NumericInput
            value={sunHours}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSunHours(e.target.value)}
            unit={t("solar-panel-roi-calculator.hours")}
            placeholder={t("solar-panel-roi-calculator.enter_hours")}
            min={0}
            step={0.1}
          />
        </InputContainer>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("solar-panel-roi-calculator.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("solar-panel-roi-calculator.payback_period")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {result.paybackPeriod} {t("solar-panel-roi-calculator.years")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-foreground/5 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("solar-panel-roi-calculator.annual_production")}
            </div>
            <div className="text-xl font-bold">
              {result.annualProduction.toLocaleString()} kWh
            </div>
          </div>

          <div className="bg-foreground/5 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("solar-panel-roi-calculator.annual_savings")}
            </div>
            <div className="text-xl font-bold">
              {result.annualSavings.toLocaleString()} {t("solar-panel-roi-calculator.currency")}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900/20">
            <div className="text-sm text-foreground-70 mb-1">
              {t("solar-panel-roi-calculator.roi_25_years")}
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-400">
              {result.roi25Years.toLocaleString()}%
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900/20">
            <div className="text-sm text-foreground-70 mb-1">
              {t("solar-panel-roi-calculator.co2_offset")}
            </div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
              {result.co2Offset.toLocaleString()} {t("solar-panel-roi-calculator.kg")}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900/20">
            <div className="text-sm text-foreground-70 mb-1">
              {t("solar-panel-roi-calculator.trees_equivalent")}
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-400">
              {result.treesEquivalent.toLocaleString()} {t("solar-panel-roi-calculator.trees")}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">
            {t("solar-panel-roi-calculator.benefits_title")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("solar-panel-roi-calculator.benefit_1")}</li>
            <li>{t("solar-panel-roi-calculator.benefit_2")}</li>
            <li>{t("solar-panel-roi-calculator.benefit_3")}</li>
            <li>{t("solar-panel-roi-calculator.benefit_4")}</li>
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
        {t("solar-panel-roi-calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("solar-panel-roi-calculator.title")}
      description={t("solar-panel-roi-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("solar-panel-roi-calculator.footer_note")}
     className="rtl" />
  );
}
