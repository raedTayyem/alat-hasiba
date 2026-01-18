'use client';

/**
 * Tire Size Calculator
 * Parses tire size format (P225/65R17) and calculates diameter, circumference, and revolutions per mile
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Ruler, Circle, Hash, RotateCcw as Revolutions, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface TireSizeResult {
  width: number;
  aspectRatio: number;
  rimDiameter: number;
  sidewallHeight: number;
  tireDiameter: number;
  tireCircumference: number;
  revolutionsPerMile: number;
  revolutionsPerKm: number;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function TireSizeCalculator() {
  const { t } = useTranslation(['calc/automotive', 'common']);
  // State for inputs
  const [tireSize, setTireSize] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('');
  const [rimDiameter, setRimDiameter] = useState<string>('');
  const [inputMode, setInputMode] = useState<'format' | 'manual'>('format');

  // Result and UI state
  const [result, setResult] = useState<TireSizeResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Parse tire size format
  const parseTireSize = (size: string): { width: number; aspect: number; rim: number } | null => {
    // Remove spaces and convert to uppercase
    const cleaned = size.replace(/\s/g, '').toUpperCase();

    // Pattern: P225/65R17 or 225/65R17 or 225/65-17
    const pattern = /^P?(\d{3})\/(\d{2})[-R](\d{2})$/;
    const match = cleaned.match(pattern);

    if (match) {
      return {
        width: parseInt(match[1]),
        aspect: parseInt(match[2]),
        rim: parseInt(match[3]),
      };
    }

    return null;
  };

  // Validation
  const validateInputs = (): boolean => {
    setError('');

    if (inputMode === 'format') {
      if (!tireSize) {
        setError(t("tire_size.error_missing_tire_size"));
        return false;
      }

      const parsed = parseTireSize(tireSize);
      if (!parsed) {
        setError(t("tire_size.error_invalid_format"));
        return false;
      }
    } else {
      const w = parseFloat(width);
      const a = parseFloat(aspectRatio);
      const r = parseFloat(rimDiameter);

      if (isNaN(w) || isNaN(a) || isNaN(r)) {
        setError(t("tire_size.error_missing_inputs"));
        return false;
      }

      if (w <= 0 || a <= 0 || r <= 0) {
        setError(t("tire_size.error_positive_values"));
        return false;
      }

      if (a > 100) {
        setError(t("tire_size.error_invalid_aspect_ratio"));
        return false;
      }
    }

    return true;
  };

  // Calculation
  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        let w: number, a: number, r: number;

        if (inputMode === 'format') {
          const parsed = parseTireSize(tireSize);
          if (!parsed) return;
          w = parsed.width;
          a = parsed.aspect;
          r = parsed.rim;
        } else {
          w = parseFloat(width);
          a = parseFloat(aspectRatio);
          r = parseFloat(rimDiameter);
        }

        // Sidewall height (mm) = Width × Aspect Ratio / 100
        const sidewallHeight = (w * a) / 100;

        // Tire diameter (inches) = Rim Diameter + (2 × Sidewall Height in inches)
        const sidewallHeightInches = sidewallHeight / 25.4; // Convert mm to inches
        const tireDiameter = r + (2 * sidewallHeightInches);

        // Tire circumference (inches) = π × Diameter
        const tireCircumference = Math.PI * tireDiameter;

        // Revolutions per mile = 63,360 inches/mile ÷ Circumference
        const revolutionsPerMile = 63360 / tireCircumference;

        // Revolutions per km = 39,370 inches/km ÷ Circumference
        const revolutionsPerKm = 39370 / tireCircumference;

        setResult({
          width: w,
          aspectRatio: a,
          rimDiameter: r,
          sidewallHeight,
          tireDiameter,
          tireCircumference,
          revolutionsPerMile,
          revolutionsPerKm,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("tire_size.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setTireSize('');
      setWidth('');
      setAspectRatio('');
      setRimDiameter('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputModeOptions = [
    { value: 'format', label: t("tire_size.tire_format") },
    { value: 'manual', label: t("tire_size.manual_entry") },
  ];

  // INPUT SECTION
  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("tire_size.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Input Mode Selection */}
        <FormField
          label={t("tire_size.input_mode")}
          tooltip={t("tire_size.input_mode_tooltip")}
        >
          <Combobox
            options={inputModeOptions}
            value={inputMode}
            onChange={(val) => { setInputMode(val as 'format' | 'manual'); if (error) setError(''); }}
            placeholder={t("tire_size.input_mode")}
          />
        </FormField>

        {inputMode === 'format' ? (
          /* Tire Size Format Input */
          <FormField
            label={t("tire_size.tire_size_label")}
            tooltip={t("tire_size.tire_size_tooltip")}
          >
            <input
              type="text"
              value={tireSize}
              onChange={(e) => { setTireSize(e.target.value); if (error) setError(''); }}
              onKeyPress={handleKeyPress}
              className="w-full h-14 rounded-2xl border-2 border-border bg-background px-4 text-lg font-medium transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none"
              placeholder={t("tire_size.placeholders.tire_size")}
              dir="ltr"
            />
          </FormField>
        ) : (
          <>
            {/* Width */}
            <FormField
              label={t("tire_size.width")}
              tooltip={t("tire_size.width_tooltip")}
            >
              <NumberInput
                value={width}
                onValueChange={(val) => { setWidth(val.toString()); if (error) setError(''); }}
                onKeyPress={handleKeyPress}
                placeholder={t("tire_size.placeholders.width")}
                min={0}
                step={5}
                startIcon={<Ruler className="h-4 w-4" />}
              />
            </FormField>

            {/* Aspect Ratio */}
            <FormField
              label={t("tire_size.aspect_ratio")}
              tooltip={t("tire_size.aspect_ratio_tooltip")}
            >
              <NumberInput
                value={aspectRatio}
                onValueChange={(val) => { setAspectRatio(val.toString()); if (error) setError(''); }}
                onKeyPress={handleKeyPress}
                placeholder={t("tire_size.placeholders.aspect_ratio")}
                min={0}
                max={100}
                step={5}
                startIcon={<Hash className="h-4 w-4" />}
              />
            </FormField>

            {/* Rim Diameter */}
            <FormField
              label={t("tire_size.rim_diameter")}
              tooltip={t("tire_size.rim_diameter_tooltip")}
            >
              <NumberInput
                value={rimDiameter}
                onValueChange={(val) => { setRimDiameter(val.toString()); if (error) setError(''); }}
                onKeyPress={handleKeyPress}
                placeholder={t("tire_size.placeholders.rim_diameter")}
                min={0}
                step={1}
                startIcon={<Circle className="h-4 w-4" />}
              />
            </FormField>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      {/* Error Message */}
      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {/* Information Section */}
      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("tire_size.about_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("tire_size.about_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("tire_size.format_example_title")}
            </h2>
            <p className="text-foreground-70 mb-2">
              {t("tire_size.format_example_description")}
            </p>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("tire_size.format_width")}</li>
              <li>{t("tire_size.format_aspect")}</li>
              <li>{t("tire_size.format_rim")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  // RESULT SECTION
  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("tire_size.tire_specification")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2" dir="ltr">
          {result.width}/{result.aspectRatio}R{result.rimDiameter}
        </div>
        <div className="text-lg text-foreground-70">
          {(result.tireDiameter).toFixed(2)} {t("tire_size.inches_diameter")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("tire_size.detailed_measurements")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("tire_size.sidewall_height")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.sidewallHeight).toFixed(2)} {t("common:common.units.mm")} ({(result.sidewallHeight / 25.4).toFixed(2)} {t("common:common.units.in")})
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Circle className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("tire_size.tire_diameter")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.tireDiameter).toFixed(2)} {t("common:common.units.in")} ({(result.tireDiameter * 25.4).toFixed(2)} {t("common:common.units.mm")})
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Circle className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("tire_size.tire_circumference")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.tireCircumference).toFixed(2)} {t("common:common.units.in")} ({(result.tireCircumference * 25.4).toFixed(2)} {t("common:common.units.mm")})
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Revolutions className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("tire_size.revolutions_per_mile")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.revolutionsPerMile).toFixed(2)} {t("tire_size.revs")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border sm:col-span-2">
            <div className="flex items-center mb-2">
              <Revolutions className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("tire_size.revolutions_per_km")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.revolutionsPerKm).toFixed(2)} {t("tire_size.revs")}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("tire_size.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("tire_size.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("tire_size.title")}
      description={t("tire_size.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
