'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

export default function InrushCurrentCalculator() {
  const { t } = useTranslation(['calc/electrical', 'common']);
  const [loadType, setLoadType] = useState<string>('motor');
  const [ratedCurrent, setRatedCurrent] = useState<string>('');
  const [power, setPower] = useState<string>('');
  const [voltage, setVoltage] = useState<string>('');
  const [result, setResult] = useState<{
    inrushCurrent: number;
    inrushMultiplier: number;
    duration: number;
    requiredBreakerRating: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const i = parseFloat(ratedCurrent);
    const p = parseFloat(power);
    const v = parseFloat(voltage);

    if ((!i && !p) || !v) {
      setError(t("common:common.errors.invalid"));
      return;
    }

    let ratedCurrent_calculated = i;
    if (!i && p) {
      ratedCurrent_calculated = (p * 1000) / (Math.sqrt(3) * v * 0.85);
    }

    // Inrush current multipliers for different loads
    const multipliers: Record<string, { multiplier: number; duration: number }> = {
      motor: { multiplier: 6, duration: 100 },
      transformer: { multiplier: 12, duration: 50 },
      capacitor: { multiplier: 20, duration: 10 },
      led: { multiplier: 40, duration: 5 },
      incandescent: { multiplier: 10, duration: 20 }
    };

    const { multiplier, duration } = multipliers[loadType];
    const inrushCurrent = ratedCurrent_calculated * multiplier;

    // Recommended circuit breaker rating (typically 125% of rated current)
    const requiredBreakerRating = ratedCurrent_calculated * 1.25;

    setResult({
      inrushCurrent: parseFloat(inrushCurrent.toFixed(2)),
      inrushMultiplier: multiplier,
      duration,
      requiredBreakerRating: parseFloat(requiredBreakerRating.toFixed(2))
    });
  };

  const reset = () => {
    setLoadType('motor');
    setRatedCurrent('');
    setPower('');
    setVoltage('380');
    setResult(null);
    setError('');
  };

  const loadTypeOptions: ComboboxOption[] = [
    { value: 'motor', label: t("inrush_current.motor") },
    { value: 'transformer', label: t("inrush_current.transformer") },
    { value: 'capacitor', label: t("inrush_current.capacitor") },
    { value: 'led', label: t("inrush_current.led") },
    { value: 'incandescent', label: t("inrush_current.incandescent") }
  ];

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("inrush_current.load_type")} tooltip={t("inrush_current.load_type_tooltip")}>
          <Combobox
            options={loadTypeOptions}
            value={loadType}
            onChange={setLoadType}
          />
        </InputContainer>

        <InputContainer label={t("inrush_current.rated_power")} tooltip={t("inrush_current.rated_power_tooltip")}>
          <NumberInput
            value={ratedCurrent}
            onValueChange={(val) => setRatedCurrent(String(val))}
            unit={t("ohms_law.unit_current")}
            placeholder={t("inrush_current.placeholders.current")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("calculators.power_15")} tooltip={t("calculators.power_13")}>
          <NumberInput
            value={power}
            onValueChange={(val) => setPower(String(val))}
            unit={t("common:units.kW")}
            placeholder={t("inrush_current.enter_power")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("inrush_current.voltage")} tooltip={t("inrush_current.voltage_tooltip")}>
          <NumberInput
            value={voltage}
            onValueChange={(val) => setVoltage(String(val))}
            unit={t("ohms_law.unit_voltage")}
            placeholder={t("placeholders.voltage")}
            min={0}
            step={1}
          />
        </InputContainer>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("inrush_current.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("inrush_current.inrush_current_label")}</div>
          <div className="text-3xl font-bold text-red-600">{result.inrushCurrent} {t("ohms_law.unit_current")}</div>
          <div className="text-xs text-foreground-70 mt-1">{t("inrush_current.inrush_multiplier")}: {result.inrushMultiplier}x</div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("inrush_current.steady_state")}</div>
          <div className="text-2xl font-bold text-blue-600">{result.duration} {t("common:common.units.ms")}</div>
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("inrush_current.duration")}</div>
          <div className="text-2xl font-bold text-green-600">{result.requiredBreakerRating} {t("ohms_law.unit_current")}</div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("inrush_current.info_title")}</h4>
          <p className="text-sm">{t("inrush_current.info_notes")}</p>
        </div>
      </div>
    </div>
  ) : (
      <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <p className="text-foreground-70">{t("calculators.enter_243")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("inrush_current.title")}
      description={t("inrush_current.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("inrush_current.footer_note")}
     className="rtl" />
  );
}
