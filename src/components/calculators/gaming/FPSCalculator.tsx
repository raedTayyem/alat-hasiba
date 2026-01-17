'use client';

/**
 * FPS (Frames Per Second) Calculator
 * Calculates frame time = 1000/FPS ms
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Monitor, Clock, Activity } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  frameTime: number;
  framesPerSecond: number;
  framesPerMinute: number;
  framesPerHour: number;
}

export default function FPSCalculator() {
  const { t, i18n } = useTranslation('calc/gaming');
  const [fps, setFps] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const fpsVal = parseFloat(fps);

    if (isNaN(fpsVal)) {
      setError(t("fps.error_invalid"));
      return false;
    }

    if (fpsVal <= 0) {
      setError(t("fps.error_positive"));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const fpsVal = parseFloat(fps);

        // Frame time in milliseconds
        const frameTime = 1000 / fpsVal;
        const framesPerMinute = fpsVal * 60;
        const framesPerHour = fpsVal * 3600;

        setResult({
          frameTime,
          framesPerSecond: fpsVal,
          framesPerMinute,
          framesPerHour,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("fps.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setFps('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    if (Math.abs(num) < 1) return num.toFixed(3);
    if (Math.abs(num) < 100) return num.toFixed(2);
    return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("fps.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("fps.fps_label")}
          tooltip={t("fps.fps_tooltip")}
        >
          <NumberInput
            value={fps}
            onValueChange={(val) => {
              setFps(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("fps.fps_placeholder")}
            startIcon={<Monitor className="h-4 w-4" />}
            min={1}
          />
        </FormField>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("fps.formula_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("fps.formula_explanation")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("fps.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("fps.use_case_1")}</li>
              <li>{t("fps.use_case_2")}</li>
              <li>{t("fps.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("fps.result_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {formatNumber(result.frameTime)} ms
        </div>
        <div className="text-lg text-foreground-70">
          {t("fps.result_unit")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("fps.additional_info_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("fps.frames_per_minute_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.framesPerMinute)}</div>
            <div className="text-sm text-foreground-70">{t("fps.frames_per_minute_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Activity className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("fps.frames_per_hour_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.framesPerHour)}</div>
            <div className="text-sm text-foreground-70">{t("fps.frames_per_hour_unit")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("fps.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("fps.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("fps.title")}
      description={t("fps.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
