'use client';

/**
 * ELECTRICAL RESISTANCE CALCULATOR
 *
 * Calculates electrical resistance, voltage, current, and power using Ohm's Law.
 *
 * Formulas:
 * - V = I × R (Voltage = Current × Resistance)
 * - I = V / R (Current = Voltage / Resistance)
 * - R = V / I (Resistance = Voltage / Current)
 * - P = V × I = I²R = V²/R (Power)
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Activity, CircuitBoard, Info } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
type CalculationMode = 'resistance' | 'voltage' | 'current' | 'power';

interface OhmsLawResult {
  voltage: number;
  current: number;
  resistance: number;
  power: number;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function ElectricalResistanceCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t, i18n } = useTranslation(['calc/engineering', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [mode, setMode] = useState<CalculationMode>('resistance');
  const [voltage, setVoltage] = useState<string>('');
  const [current, setCurrent] = useState<string>('');
  const [resistance, setResistance] = useState<string>('');

  // Result state
  const [result, setResult] = useState<OhmsLawResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    if (mode === 'resistance') {
      const v = parseFloat(voltage);
      const i = parseFloat(current);
      if (isNaN(v) || isNaN(i)) {
        setError(t("electrical-resistance.errors.invalid_input"));
        return false;
      }
      if (i === 0) {
        setError(t("electrical-resistance.errors.current_zero"));
        return false;
      }
    } else if (mode === 'voltage') {
      const i = parseFloat(current);
      const r = parseFloat(resistance);
      if (isNaN(i) || isNaN(r)) {
        setError(t("electrical-resistance.errors.invalid_input"));
        return false;
      }
    } else if (mode === 'current') {
      const v = parseFloat(voltage);
      const r = parseFloat(resistance);
      if (isNaN(v) || isNaN(r)) {
        setError(t("electrical-resistance.errors.invalid_input"));
        return false;
      }
      if (r === 0) {
        setError(t("electrical-resistance.errors.resistance_zero"));
        return false;
      }
    }

    return true;
  };

  // ---------------------------------------------------------------------------
  // CALCULATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        let v = parseFloat(voltage) || 0;
        let i = parseFloat(current) || 0;
        let r = parseFloat(resistance) || 0;
        let p = 0;

        if (mode === 'resistance') {
          r = v / i;
          p = v * i;
        } else if (mode === 'voltage') {
          v = i * r;
          p = v * i;
        } else if (mode === 'current') {
          i = v / r;
          p = v * i;
        } else if (mode === 'power') {
          p = v * i;
        }

        setResult({
          voltage: v,
          current: i,
          resistance: r,
          power: p
        });

        setShowResult(true);
      } catch (err) {
        setError(t("common:common.errors.calculationError"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setVoltage('');
      setCurrent('');
      setResistance('');
      setResult(null);
      setError('');
    }, 300);
  };

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------
  const formatNumber = (num: number): string => {
    if (Math.abs(num) < 0.001 && num !== 0) {
      return num.toExponential(4);
    }
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  };

  // ---------------------------------------------------------------------------
  // INPUT SECTION
  // ---------------------------------------------------------------------------
  const inputSection = (
    <>
      <div className="max-w-md mx-auto space-y-4">

        {/* Mode Selection */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            onClick={() => { setMode('resistance'); setResult(null); setError(''); }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'resistance' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            {t("electrical-resistance.modes.resistance")}
          </button>
          <button
            onClick={() => { setMode('voltage'); setResult(null); setError(''); }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'voltage' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            {t("electrical-resistance.modes.voltage")}
          </button>
          <button
            onClick={() => { setMode('current'); setResult(null); setError(''); }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'current' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            {t("electrical-resistance.modes.current")}
          </button>
        </div>

        {/* Voltage Input (for resistance and current modes) */}
        {(mode === 'resistance' || mode === 'current') && (
          <InputContainer
            label={t("electrical-resistance.voltage")}
            tooltip={t("electrical-resistance.voltage_tooltip")}
          >
            <NumericInput
              value={voltage}
              onChange={(e) => {
                setVoltage(e.target.value);
                if (error) setError('');
              }}
              placeholder={t("electrical-resistance.placeholders.voltage")}
              unit={t("common:units.V")}
              min={0}
              step={0.1}
            />
          </InputContainer>
        )}

        {/* Current Input (for resistance and voltage modes) */}
        {(mode === 'resistance' || mode === 'voltage') && (
          <InputContainer
            label={t("electrical-resistance.current")}
            tooltip={t("electrical-resistance.current_tooltip")}
          >
            <NumericInput
              value={current}
              onChange={(e) => {
                setCurrent(e.target.value);
                if (error) setError('');
              }}
              placeholder={t("electrical-resistance.placeholders.current")}
              unit={t("common:units.A")}
              min={0}
              step={0.001}
            />
          </InputContainer>
        )}

        {/* Resistance Input (for voltage and current modes) */}
        {(mode === 'voltage' || mode === 'current') && (
          <InputContainer
            label={t("electrical-resistance.resistance")}
            tooltip={t("electrical-resistance.resistance_tooltip")}
          >
            <NumericInput
              value={resistance}
              onChange={(e) => {
                setResistance(e.target.value);
                if (error) setError('');
              }}
              placeholder={t("electrical-resistance.placeholders.resistance")}
              unit={t("common:units.ohm")}
              min={0}
              step={0.1}
            />
          </InputContainer>
        )}
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto">
        <CalculatorButtons
          onCalculate={calculate}
          onReset={resetCalculator}
        />
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
              {t("electrical-resistance.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("electrical-resistance.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("electrical-resistance.formulas_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>V = I × R ({t("electrical-resistance.formula_v")})</li>
              <li>I = V / R ({t("electrical-resistance.formula_i")})</li>
              <li>R = V / I ({t("electrical-resistance.formula_r")})</li>
              <li>P = V × I ({t("electrical-resistance.formula_p")})</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  // ---------------------------------------------------------------------------
  // RESULT SECTION
  // ---------------------------------------------------------------------------
  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">

      {/* Main Result */}
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {mode === 'resistance' && t("electrical-resistance.result_resistance")}
          {mode === 'voltage' && t("electrical-resistance.result_voltage")}
          {mode === 'current' && t("electrical-resistance.result_current")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {mode === 'resistance' && `${formatNumber(result.resistance)} Ω`}
          {mode === 'voltage' && `${formatNumber(result.voltage)} V`}
          {mode === 'current' && `${formatNumber(result.current)} A`}
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* All Values */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("electrical-resistance.all_values")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Voltage */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("electrical-resistance.voltage")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.voltage)} V</div>
          </div>

          {/* Current */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Activity className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("electrical-resistance.current")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.current)} A</div>
          </div>

          {/* Resistance */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <CircuitBoard className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("electrical-resistance.resistance")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.resistance)} Ω</div>
          </div>

          {/* Power */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("electrical-resistance.power")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.power)} W</div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("electrical-resistance.ohms_law")}</h4>
            <p className="text-sm text-foreground-70">
              {t("electrical-resistance.ohms_law_explanation")}
            </p>
          </div>
        </div>
      </div>

    </div>
  ) : null;

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <CalculatorLayout
      title={t("electrical-resistance.title")}
      description={t("electrical-resistance.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="engineering"
      resultValue={result?.resistance}
      results={result}
    />
  );
}
