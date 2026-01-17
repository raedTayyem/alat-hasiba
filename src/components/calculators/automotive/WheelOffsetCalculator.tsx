'use client';

/**
 * Wheel Offset Calculator
 * Calculates wheel offset, backspacing, and fitment analysis
 * Offset = (Hub mounting surface distance from centerline) in mm
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Ruler, Circle, ArrowLeftRight, Info, Calculator, RotateCcw, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface WheelOffsetResult {
  offset: number;
  backspacing: number;
  centerline: number;
  hubToOuterEdge: number;
  fitmentStatus: 'positive' | 'zero' | 'negative';
  fitmentDescription: string;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function WheelOffsetCalculator() {
  const { t } = useTranslation('calc/automotive');
  // State for inputs
  const [wheelWidth, setWheelWidth] = useState<string>('');
  const [backspacing, setBackspacing] = useState<string>('');
  const [offset, setOffset] = useState<string>('');
  const [inputMode, setInputMode] = useState<'offset' | 'backspacing'>('offset');

  // Result and UI state
  const [result, setResult] = useState<WheelOffsetResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Validation
  const validateInputs = (): boolean => {
    setError('');

    const width = parseFloat(wheelWidth);

    if (isNaN(width)) {
      setError(t("wheel_offset.error_missing_width"));
      return false;
    }

    if (width <= 0) {
      setError(t("wheel_offset.error_positive_width"));
      return false;
    }

    if (inputMode === 'offset') {
      const off = parseFloat(offset);
      if (isNaN(off)) {
        setError(t("wheel_offset.error_missing_offset"));
        return false;
      }
    } else {
      const back = parseFloat(backspacing);
      if (isNaN(back)) {
        setError(t("wheel_offset.error_missing_backspacing"));
        return false;
      }
      if (back <= 0) {
        setError(t("wheel_offset.error_positive_backspacing"));
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
        const width = parseFloat(wheelWidth);

        // Centerline is half the wheel width
        const centerline = width / 2;

        let calculatedOffset: number;
        let calculatedBackspacing: number;

        if (inputMode === 'offset') {
          // Calculate backspacing from offset
          // Backspacing = (Wheel Width / 2) + Offset
          calculatedOffset = parseFloat(offset);
          calculatedBackspacing = (width / 2) + (calculatedOffset / 25.4); // Convert offset from mm to inches
        } else {
          // Calculate offset from backspacing
          // Offset = (Backspacing - (Wheel Width / 2)) × 25.4
          calculatedBackspacing = parseFloat(backspacing);
          calculatedOffset = (calculatedBackspacing - centerline) * 25.4; // Convert to mm
        }

        // Hub to outer edge distance
        const hubToOuterEdge = width - calculatedBackspacing;

        // Determine fitment status
        let fitmentStatus: 'positive' | 'zero' | 'negative';
        let fitmentDescription: string;

        if (calculatedOffset > 0) {
          fitmentStatus = 'positive';
          fitmentDescription = t("wheel_offset.positive_offset_description");
        } else if (calculatedOffset === 0) {
          fitmentStatus = 'zero';
          fitmentDescription = t("wheel_offset.zero_offset_description");
        } else {
          fitmentStatus = 'negative';
          fitmentDescription = t("wheel_offset.negative_offset_description");
        }

        setResult({
          offset: calculatedOffset,
          backspacing: calculatedBackspacing,
          centerline,
          hubToOuterEdge,
          fitmentStatus,
          fitmentDescription,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("wheel_offset.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setWheelWidth('');
      setBackspacing('');
      setOffset('');
      setInputMode('offset');
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
    { value: 'offset', label: t("wheel_offset.mode_offset") },
    { value: 'backspacing', label: t("wheel_offset.mode_backspacing") },
  ];

  // INPUT SECTION
  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("wheel_offset.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Input Mode Selection */}
        <FormField
          label={t("wheel_offset.input_mode")}
          tooltip={t("wheel_offset.input_mode_tooltip")}
        >
          <Combobox
            options={inputModeOptions}
            value={inputMode}
            onChange={(val) => { setInputMode(val as 'offset' | 'backspacing'); setError(''); }}
            placeholder={t("wheel_offset.input_mode")}
          />
        </FormField>

        {/* Wheel Width */}
        <FormField
          label={t("wheel_offset.wheel_width")}
          tooltip={t("wheel_offset.wheel_width_tooltip")}
        >
          <NumberInput
            value={wheelWidth}
            onValueChange={(val) => { setWheelWidth(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("wheel_offset.placeholders.wheel_width")}
            min={0}
            step={0.5}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

        {inputMode === 'offset' ? (
          /* Offset Input */
          <FormField
            label={t("wheel_offset.offset")}
            tooltip={t("wheel_offset.offset_tooltip")}
          >
            <NumberInput
              value={offset}
              onValueChange={(val) => { setOffset(val.toString()); if (error) setError(''); }}
              onKeyPress={handleKeyPress}
              placeholder={t("wheel_offset.placeholders.offset")}
              step={1}
              startIcon={<ArrowLeftRight className="h-4 w-4" />}
            />
          </FormField>
        ) : (
          /* Backspacing Input */
          <FormField
            label={t("wheel_offset.backspacing")}
            tooltip={t("wheel_offset.backspacing_tooltip")}
          >
            <NumberInput
              value={backspacing}
              onValueChange={(val) => { setBackspacing(val.toString()); if (error) setError(''); }}
              onKeyPress={handleKeyPress}
              placeholder={t("wheel_offset.placeholders.backspacing")}
              min={0}
              step={0.1}
              startIcon={<ArrowLeftRight className="h-4 w-4" />}
            />
          </FormField>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button
          onClick={calculate}
          className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Calculator className="w-5 h-5 ml-1" />
          {t("common.calculate")}
        </button>

        <button
          onClick={resetCalculator}
          className="outline-button min-w-[120px] flex items-center justify-center"
        >
          <RotateCcw className="w-5 h-5 ml-1" />
          {t("common.reset")}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-error mt-4 p-3 bg-error/10 rounded-lg border border-error/20 flex items-center animate-fadeIn max-w-md mx-auto">
          <AlertTriangle className="w-5 h-5 ml-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Information Section */}
      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">
            {t("wheel_offset.about_title")}
          </h2>
          <p className="text-foreground-70 mb-3">
            {t("wheel_offset.about_description")}
          </p>
        </div>
      )}
    </>
  );

  // RESULT SECTION
  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("wheel_offset.offset_result")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.offset).toFixed(1)} mm
        </div>
        <div className={`text-lg font-medium flex items-center justify-center gap-2 ${
          result.fitmentStatus === 'positive' ? 'text-success' :
          result.fitmentStatus === 'zero' ? 'text-warning' : 'text-info'
        }`}>
          {result.fitmentStatus === 'positive' && <CheckCircle className="w-5 h-5" />}
          {result.fitmentStatus === 'zero' && <HelpCircle className="w-5 h-5" />}
          {result.fitmentStatus === 'negative' && <Info className="w-5 h-5" />}
          {result.fitmentStatus === 'positive' && t("wheel_offset.positive_offset")}
          {result.fitmentStatus === 'zero' && t("wheel_offset.zero_offset")}
          {result.fitmentStatus === 'negative' && t("wheel_offset.negative_offset")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("wheel_offset.measurements")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <ArrowLeftRight className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("wheel_offset.backspacing_result")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.backspacing).toFixed(2)} {t("wheel_offset.inches")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Circle className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("wheel_offset.centerline")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.centerline).toFixed(2)} {t("wheel_offset.inches")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border sm:col-span-2">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("wheel_offset.hub_to_outer_edge")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.hubToOuterEdge).toFixed(2)} {t("wheel_offset.inches")}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("wheel_offset.fitment_info")}</h4>
            <p className="text-sm text-foreground-70">
              {result.fitmentDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("wheel_offset.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("wheel_offset.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("wheel_offset.title")}
      description={t("wheel_offset.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
