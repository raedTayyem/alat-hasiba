'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, Info, Zap } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function FrequencyCalculator() {
  const { t } = useTranslation('calc/electrical');
  const [calculateFor, setCalculateFor] = useState<string>('frequency');
  const [frequency, setFrequency] = useState<string>('');
  const [period, setPeriod] = useState<string>('');
  const [, setWavelength] = useState<string>('');
  const [result, setResult] = useState<{
    frequency: number;
    period: number;
    wavelength: number;
    angularFrequency: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const c = 299792458; // Speed of light in m/s
    let freq = 0;
    let per = 0;
    let wave = 0;

    if (calculateFor === 'frequency' && period) {
      per = parseFloat(period) / 1000; // ms to s
      freq = 1 / per;
    } else if (calculateFor === 'period' && frequency) {
      freq = parseFloat(frequency);
      per = 1 / freq;
    } else if (calculateFor === 'wavelength' && frequency) {
      freq = parseFloat(frequency);
      wave = c / freq;
      per = 1 / freq;
    } else {
        setError(t('common.error.invalid_input'));
        return;
    }

    if (!wave && freq) {
      wave = c / freq;
    }
    if (!per && freq) {
      per = 1 / freq;
    }
    if (!freq && per) {
      freq = 1 / per;
    }

    const angularFrequency = 2 * Math.PI * freq;

    setResult({
      frequency: parseFloat(freq.toFixed(3)),
      period: parseFloat((per * 1000).toFixed(6)),
      wavelength: parseFloat(wave.toFixed(3)),
      angularFrequency: parseFloat(angularFrequency.toFixed(3))
    });
  };

  const reset = () => {
    setCalculateFor('frequency');
    setFrequency('');
    setPeriod('');
    setWavelength('');
    setResult(null);
    setError('');
  };

  const calculateForOptions = [
    { value: 'frequency', label: t("frequency-calculator.option_frequency") },
    { value: 'period', label: t("frequency-calculator.option_period") },
    { value: 'wavelength', label: t("frequency-calculator.option_wavelength") },
  ];

  const inputSection = (
    <>
      <div className="grid grid-cols-1 gap-4">
        <FormField label={t("frequency-calculator.calculate_for")} tooltip={t("frequency-calculator.calculate_for_tooltip")}>
          <Combobox
            options={calculateForOptions}
            value={calculateFor}
            onChange={(val) => setCalculateFor(val)}
            placeholder={t("frequency-calculator.calculate_for")}
          />
        </FormField>

        {(calculateFor === 'period' || calculateFor === 'wavelength') && (
          <FormField label={t("frequency-calculator.frequency_input")} tooltip={t("frequency-calculator.frequency_tooltip")}>
            <NumberInput
              value={frequency}
              onValueChange={(val) => setFrequency(val.toString())}
              placeholder={t("frequency-calculator.enter_frequency")}
              min={0}
              step={1}
              startIcon={<Activity className="h-4 w-4" />}
            />
          </FormField>
        )}

        <FormField label={t("frequency-calculator.period_input")} tooltip={t("frequency-calculator.period_tooltip")}>
          <NumberInput
            value={period}
            onValueChange={(val) => setPeriod(val.toString())}
            placeholder={t("frequency-calculator.enter_period")}
            min={0}
            step={0.001}
            unit={t("common:common.units.ms")}
            startIcon={<Zap className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("frequency-calculator.results_title")}</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("frequency-calculator.frequency_result")}</div>
            <div className="text-2xl font-bold text-primary">{result.frequency} {t("ohms_law.unit_hertz")}</div>
            <div className="text-xs text-foreground-70 mt-1">
              {(result.frequency / 1000).toFixed(3)} {t("ohms_law.unit_kilo_hertz")}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("frequency-calculator.period_result")}</div>
            <div className="text-2xl font-bold text-green-600">{result.period} {t("common:common.units.ms")}</div>
            <div className="text-xs text-foreground-70 mt-1">
              {(result.period / 1000).toFixed(9)} {t("common:common.units.s")}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("frequency-calculator.wavelength_result")}</div>
            <div className="text-2xl font-bold text-blue-600">{result.wavelength} {t("common:common.units.m")}</div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("frequency-calculator.angular_frequency")}</div>
            <div className="text-2xl font-bold text-purple-600">{result.angularFrequency} {t("ohms_law.unit_rad_s")}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            {t("frequency-calculator.tips_title")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">{t("frequency-calculator.tips_list")}</ul>
        </div>
      </div>
    </div>
  ) : (
      <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Activity className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("frequency-calculator.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("frequency-calculator.title")}
      description={t("frequency-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("frequency-calculator.footer_note")}
     className="rtl" />
  );
}
