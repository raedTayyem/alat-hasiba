'use client';

/**
 * FOV (Field of View) Calculator
 * Converts FOV between horizontal, vertical, and different aspect ratios
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Monitor, Eye } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  horizontalFOV: number;
  verticalFOV: number;
  fov43: number;
  fov169: number;
  fov219: number;
}

export default function FOVCalculator() {
  const { t } = useTranslation('calc/gaming');
  const [fovValue, setFovValue] = useState<string>('');
  const [fovType, setFovType] = useState<string>('horizontal');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const fov = parseFloat(fovValue);

    if (isNaN(fov)) {
      setError(t("fov.errors.invalid"));
      return false;
    }

    if (fov <= 0 || fov >= 180) {
      setError(t("fov.errors.range"));
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
        const fov = parseFloat(fovValue);
        const [width, height] = aspectRatio.split(':').map(Number);
        const aspect = width / height;

        let horizontalFOV: number;
        let verticalFOV: number;

        // Convert to horizontal and vertical FOV
        if (fovType === 'horizontal') {
          horizontalFOV = fov;
          verticalFOV = 2 * Math.atan(Math.tan((fov * Math.PI / 180) / 2) / aspect) * 180 / Math.PI;
        } else {
          verticalFOV = fov;
          horizontalFOV = 2 * Math.atan(Math.tan((fov * Math.PI / 180) / 2) * aspect) * 180 / Math.PI;
        }

        // Calculate for different aspect ratios
        const fov43 = 2 * Math.atan(Math.tan((verticalFOV * Math.PI / 180) / 2) * (4 / 3)) * 180 / Math.PI;
        const fov169 = 2 * Math.atan(Math.tan((verticalFOV * Math.PI / 180) / 2) * (16 / 9)) * 180 / Math.PI;
        const fov219 = 2 * Math.atan(Math.tan((verticalFOV * Math.PI / 180) / 2) * (21 / 9)) * 180 / Math.PI;

        setResult({
          horizontalFOV,
          verticalFOV,
          fov43,
          fov169,
          fov219,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("common.errors.calculationError"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setFovValue('');
      setFovType('horizontal');
      setAspectRatio('16:9');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const fovTypeOptions = [
    { value: 'horizontal', label: t("fov.options.horizontal") },
    { value: 'vertical', label: t("fov.options.vertical") },
  ];

  const aspectRatioOptions = [
    { value: '4:3', label: '4:3' },
    { value: '16:9', label: '16:9' },
    { value: '16:10', label: '16:10' },
    { value: '21:9', label: '21:9' },
    { value: '32:9', label: '32:9' },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("fov.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("fov.inputs.fov_value")}
          tooltip={t("fov.tooltips.fov_value")}
        >
          <NumberInput
            value={fovValue}
            onValueChange={(val) => {
              setFovValue(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("fov.placeholders.fov_value")}
            startIcon={<Eye className="h-4 w-4" />}
            min={0}
            max={180}
          />
        </FormField>

        <FormField
          label={t("fov.inputs.fov_type")}
          tooltip={t("fov.tooltips.fov_type")}
        >
          <Combobox
            options={fovTypeOptions}
            value={fovType}
            onChange={(val) => setFovType(val)}
            placeholder={t("fov.inputs.fov_type")}
          />
        </FormField>

        <FormField
          label={t("fov.inputs.aspect_ratio")}
          tooltip={t("fov.tooltips.aspect_ratio")}
        >
          <Combobox
            options={aspectRatioOptions}
            value={aspectRatio}
            onChange={(val) => setAspectRatio(val)}
            placeholder={t("fov.inputs.aspect_ratio")}
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
              {t("fov.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("fov.info.desc")}
            </p>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("fov.results.horizontal")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.horizontalFOV).toFixed(2)}°
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Eye className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("fov.results.vertical")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{(result.verticalFOV).toFixed(2)}°</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Monitor className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("fov.results.fov_4_3")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{(result.fov43).toFixed(2)}°</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Monitor className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("fov.results.fov_16_9")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{(result.fov169).toFixed(2)}°</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Monitor className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("fov.results.fov_21_9")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{(result.fov219).toFixed(2)}°</div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("fov.title")}
      description={t("fov.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
