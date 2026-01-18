'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

export default function Timer555Calculator() {
  const { t } = useTranslation('calc/electrical');
  const [mode, setMode] = useState<string>('astable');
  const [r1, setR1] = useState<string>('');
  const [r2, setR2] = useState<string>('');
  const [capacitance, setCapacitance] = useState<string>('');
  const [result, setResult] = useState<{
    frequency: number;
    period: number;
    highTime: number;
    lowTime: number;
    dutyCycle: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const r1Val = parseFloat(r1) * 1000; // kΩ to Ω
    const r2Val = parseFloat(r2) * 1000;
    const c = parseFloat(capacitance) / 1000000; // µF to F

    if (!r1Val || !c) return;

    if (mode === 'astable') {
      if (!r2Val) return;
      // Astable mode
      const highTime = 0.693 * (r1Val + r2Val) * c;
      const lowTime = 0.693 * r2Val * c;
      const period = highTime + lowTime;
      const frequency = 1 / period;
      const dutyCycle = (highTime / period) * 100;

      setResult({
        frequency: parseFloat(frequency.toFixed(2)),
        period: parseFloat((period * 1000).toFixed(3)),
        highTime: parseFloat((highTime * 1000).toFixed(3)),
        lowTime: parseFloat((lowTime * 1000).toFixed(3)),
        dutyCycle: parseFloat(dutyCycle.toFixed(2))
      });
    } else {
      // Monostable mode
      const period = 1.1 * r1Val * c;
      setResult({
        frequency: 0,
        period: parseFloat((period * 1000).toFixed(3)),
        highTime: parseFloat((period * 1000).toFixed(3)),
        lowTime: 0,
        dutyCycle: 0
      });
    }
  };

  const reset = () => {
    setMode('astable');
    setR1('');
    setR2('');
    setCapacitance('');
    setResult(null);
    setError('');
  };

  const modeOptions: ComboboxOption[] = [
    { value: 'astable', label: t("timer_555.astable") },
    { value: 'monostable', label: t("timer_555.monostable") }
  ];

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("timer_555.mode")} tooltip={t("timer_555.mode_tooltip")}>
          <Combobox
            options={modeOptions}
            value={mode}
            onChange={setMode}
          />
        </InputContainer>

        <InputContainer label={t("timer_555.r1")} tooltip={t("timer_555.r1_tooltip")}>
          <NumericInput
            value={r1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setR1(e.target.value)}
            unit={t("ohms_law.unit_kilo_ohm")}
            placeholder={t("timer_555.enter_r1")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        {mode === 'astable' && (
          <InputContainer label={t("timer_555.r2")} tooltip={t("timer_555.r2_tooltip")}>
            <NumericInput
              value={r2}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setR2(e.target.value)}
              unit={t("ohms_law.unit_kilo_ohm")}
              placeholder={t("timer_555.enter_r2")}
              min={0}
              step={0.1}
            />
          </InputContainer>
        )}

        <InputContainer label={t("timer_555.capacitance")} tooltip={t("timer_555.capacitance_tooltip")}>
          <NumericInput
            value={capacitance}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCapacitance(e.target.value)}
            unit={t("ohms_law.unit_micro_farad")}
            placeholder={t("timer_555.enter_capacitance")}
            min={0}
            step={0.1}
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
        {mode === 'astable' ? (
          <>
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
              <div className="text-sm text-foreground-70 mb-1">
            {t("timer_555.frequency")}</div>
          <div className="text-3xl font-bold text-primary">{result.frequency} {t("ohms_law.unit_hertz")}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
                <div className="text-sm text-foreground-70 mb-1">
            {t("timer_555.high_time")}</div>
          <div className="text-xl font-bold text-green-600">{result.highTime} {t("common:common.units.ms")}</div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
                <div className="text-sm text-foreground-70 mb-1">
            {t("timer_555.low_time")}</div>
          <div className="text-xl font-bold text-blue-600">{result.lowTime} {t("common:common.units.ms")}</div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 p-4 rounded-lg">
                <div className="text-sm text-foreground-70 mb-1">
            {t("timer_555.period")}</div>
          <div className="text-xl font-bold text-purple-600">{result.period} {t("common:common.units.ms")}</div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 p-4 rounded-lg">
                <div className="text-sm text-foreground-70 mb-1">{t("timer_555.duty_cycle")}</div>
                <div className="text-xl font-bold text-orange-600">{result.dutyCycle}%</div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("timer_555.pulse_width")}</div>
          <div className="text-3xl font-bold text-primary">{result.period} {t("common:common.units.ms")}</div>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("timer_555.how_it_works")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            {mode === 'astable' ? (
              <>
                <li>{t("timer_555.astable_high")}</li>
                <li>{t("timer_555.astable_low")}</li>
                <li>{t("timer_555.astable_freq")}</li>
              </>
            ) : (
              <>
                <li>{t("timer_555.monostable_pulse")}</li>
                <li>{t("timer_555.monostable_trigger")}</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-foreground-70">{t("resistors_parallel.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("timer_555.title")}
      description={t("timer_555.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("resistors_parallel.footer_note")}
     className="rtl" />
  );
}
