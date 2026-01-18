'use client';

/**
 * HYDRAULIC CYLINDER CALCULATOR
 *
 * Calculates force, pressure, and area for hydraulic cylinders and systems.
 *
 * Formulas:
 * - Force = Pressure × Area (F = P × A)
 * - Pressure = Force / Area (P = F / A)
 * - Area = Force / Pressure (A = F / P)
 * - Cylinder Area = π × (d/2)² for single-acting
 * - Annular Area = π × (D² - d²) / 4 for double-acting (retraction)
 * - Flow Rate = Area × Velocity (Q = A × v)
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Circle, ArrowDown, Gauge, Info, Droplets, Activity } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
type CalculationMode = 'force' | 'pressure' | 'area' | 'cylinder_sizing';

interface HydraulicResult {
  force: number;
  pressure: number;
  area: number;
  pistonDiameter?: number;
  rodDiameter?: number;
  extensionForce?: number;
  retractionForce?: number;
  flowRate?: number;
  velocity?: number;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function HydraulicCylinderCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/engineering', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [mode, setMode] = useState<CalculationMode>('force');
  const [pressure, setPressure] = useState<string>('');
  const [force, setForce] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [pistonDiameter, setPistonDiameter] = useState<string>('');
  const [rodDiameter, setRodDiameter] = useState<string>('');
  const [velocity, setVelocity] = useState<string>('');

  // Result state
  const [result, setResult] = useState<HydraulicResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    if (mode === 'force') {
      const p = parseFloat(pressure);
      const a = parseFloat(area);
      if (isNaN(p) || isNaN(a)) {
        setError(t("hydraulic_cylinder.errors.invalid_input"));
        return false;
      }
      if (p <= 0 || a <= 0) {
        setError(t("hydraulic_cylinder.errors.positive_values"));
        return false;
      }
    } else if (mode === 'pressure') {
      const f = parseFloat(force);
      const a = parseFloat(area);
      if (isNaN(f) || isNaN(a)) {
        setError(t("hydraulic_cylinder.errors.invalid_input"));
        return false;
      }
      if (a <= 0) {
        setError(t("hydraulic_cylinder.errors.area_positive"));
        return false;
      }
    } else if (mode === 'area') {
      const f = parseFloat(force);
      const p = parseFloat(pressure);
      if (isNaN(f) || isNaN(p)) {
        setError(t("hydraulic_cylinder.errors.invalid_input"));
        return false;
      }
      if (p <= 0) {
        setError(t("hydraulic_cylinder.errors.pressure_positive"));
        return false;
      }
    } else if (mode === 'cylinder_sizing') {
      const p = parseFloat(pressure);
      const d = parseFloat(pistonDiameter);
      if (isNaN(p) || isNaN(d)) {
        setError(t("hydraulic_cylinder.errors.invalid_input"));
        return false;
      }
      if (p <= 0 || d <= 0) {
        setError(t("hydraulic_cylinder.errors.positive_values"));
        return false;
      }
      const rod = parseFloat(rodDiameter);
      if (!isNaN(rod) && rod >= d) {
        setError(t("hydraulic_cylinder.errors.rod_smaller"));
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
        let resultForce = 0;
        let resultPressure = 0;
        let resultArea = 0;
        let extensionForce = 0;
        let retractionForce = 0;
        let flowRate = 0;

        if (mode === 'force') {
          // P in bar, A in cm² -> F in N
          const p = parseFloat(pressure) * 100000; // bar to Pa
          const a = parseFloat(area) * 0.0001; // cm² to m²
          resultForce = p * a;
          resultPressure = p;
          resultArea = a;
        } else if (mode === 'pressure') {
          // F in N, A in cm² -> P in bar
          const f = parseFloat(force);
          const a = parseFloat(area) * 0.0001; // cm² to m²
          resultPressure = f / a;
          resultForce = f;
          resultArea = a;
        } else if (mode === 'area') {
          // F in N, P in bar -> A in cm²
          const f = parseFloat(force);
          const p = parseFloat(pressure) * 100000; // bar to Pa
          resultArea = f / p;
          resultForce = f;
          resultPressure = p;
        } else if (mode === 'cylinder_sizing') {
          const p = parseFloat(pressure) * 100000; // bar to Pa
          const d = parseFloat(pistonDiameter) * 0.001; // mm to m
          const rod = (parseFloat(rodDiameter) || 0) * 0.001; // mm to m
          const v = parseFloat(velocity) || 0; // m/s

          // Piston area
          const pistonArea = Math.PI * Math.pow(d / 2, 2);
          // Annular area (piston area minus rod area)
          const annularArea = Math.PI * (Math.pow(d / 2, 2) - Math.pow(rod / 2, 2));

          // Extension force (full piston area)
          extensionForce = p * pistonArea;
          // Retraction force (annular area)
          retractionForce = p * annularArea;

          resultForce = extensionForce;
          resultPressure = p;
          resultArea = pistonArea;

          // Flow rate if velocity is provided
          if (v > 0) {
            flowRate = pistonArea * v * 1000 * 60; // m³/s to L/min
          }
        }

        setResult({
          force: resultForce,
          pressure: resultPressure / 100000, // Pa to bar
          area: resultArea * 10000, // m² to cm²
          pistonDiameter: parseFloat(pistonDiameter) || undefined,
          rodDiameter: parseFloat(rodDiameter) || undefined,
          extensionForce: extensionForce || undefined,
          retractionForce: retractionForce || undefined,
          flowRate: flowRate || undefined,
          velocity: parseFloat(velocity) || undefined,
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
      setPressure('');
      setForce('');
      setArea('');
      setPistonDiameter('');
      setRodDiameter('');
      setVelocity('');
      setResult(null);
      setError('');
    }, 300);
  };

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------
  const formatNumber = (num: number): string => {
    if (Math.abs(num) >= 1e6) {
      return (num / 1e6).toFixed(2) + ' MN';
    } else if (Math.abs(num) >= 1e3) {
      return (num / 1e3).toFixed(2) + ' kN';
    } else if (Math.abs(num) < 0.01 && num !== 0) {
      return num.toExponential(4);
    }
    return num.toFixed(2) + ' N';
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
            onClick={() => { setMode('force'); setResult(null); setError(''); }}
            className={`px-3 py-2 rounded-lg transition-colors text-sm ${
              mode === 'force' ? 'bg-primary text-white' : 'bg-muted dark:bg-muted'
            }`}
          >
            {t("hydraulic_cylinder.modes.force")}
          </button>
          <button
            onClick={() => { setMode('pressure'); setResult(null); setError(''); }}
            className={`px-3 py-2 rounded-lg transition-colors text-sm ${
              mode === 'pressure' ? 'bg-primary text-white' : 'bg-muted dark:bg-muted'
            }`}
          >
            {t("hydraulic_cylinder.modes.pressure")}
          </button>
          <button
            onClick={() => { setMode('area'); setResult(null); setError(''); }}
            className={`px-3 py-2 rounded-lg transition-colors text-sm ${
              mode === 'area' ? 'bg-primary text-white' : 'bg-muted dark:bg-muted'
            }`}
          >
            {t("hydraulic_cylinder.modes.area")}
          </button>
          <button
            onClick={() => { setMode('cylinder_sizing'); setResult(null); setError(''); }}
            className={`px-3 py-2 rounded-lg transition-colors text-sm ${
              mode === 'cylinder_sizing' ? 'bg-primary text-white' : 'bg-muted dark:bg-muted'
            }`}
          >
            {t("hydraulic_cylinder.modes.cylinder_sizing")}
          </button>
        </div>

        {/* Pressure Input */}
        {(mode === 'force' || mode === 'area' || mode === 'cylinder_sizing') && (
          <InputContainer
            label={t("hydraulic_cylinder.pressure")}
            tooltip={t("hydraulic_cylinder.pressure_tooltip")}
          >
            <NumericInput
              value={pressure}
              onChange={(e) => {
                setPressure(e.target.value);
                if (error) setError('');
              }}
              placeholder={t("hydraulic_cylinder.placeholders.pressure")}
              unit={t("common:units.bar")}
              min={0}
              step={1}
            />
          </InputContainer>
        )}

        {/* Force Input */}
        {(mode === 'pressure' || mode === 'area') && (
          <InputContainer
            label={t("hydraulic_cylinder.force")}
            tooltip={t("hydraulic_cylinder.force_tooltip")}
          >
            <NumericInput
              value={force}
              onChange={(e) => {
                setForce(e.target.value);
                if (error) setError('');
              }}
              placeholder={t("hydraulic_cylinder.placeholders.force")}
              unit={t("common:units.N")}
              min={0}
              step={100}
            />
          </InputContainer>
        )}

        {/* Area Input */}
        {(mode === 'force' || mode === 'pressure') && (
          <InputContainer
            label={t("hydraulic_cylinder.area")}
            tooltip={t("hydraulic_cylinder.area_tooltip")}
          >
            <NumericInput
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                if (error) setError('');
              }}
              placeholder={t("hydraulic_cylinder.placeholders.area")}
              unit={t("common:units.cm_squared")}
              min={0}
              step={0.1}
            />
          </InputContainer>
        )}

        {/* Cylinder Sizing Inputs */}
        {mode === 'cylinder_sizing' && (
          <>
            <InputContainer
              label={t("hydraulic_cylinder.piston_diameter")}
              tooltip={t("hydraulic_cylinder.piston_diameter_tooltip")}
            >
              <NumericInput
                value={pistonDiameter}
                onChange={(e) => {
                  setPistonDiameter(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t("hydraulic_cylinder.placeholders.piston_diameter")}
                unit={t("common:units.mm")}
                min={0}
                step={1}
              />
            </InputContainer>

            <InputContainer
              label={t("hydraulic_cylinder.rod_diameter")}
              tooltip={t("hydraulic_cylinder.rod_diameter_tooltip")}
            >
              <NumericInput
                value={rodDiameter}
                onChange={(e) => {
                  setRodDiameter(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t("hydraulic_cylinder.placeholders.rod_diameter")}
                unit={t("common:units.mm")}
                min={0}
                step={1}
              />
            </InputContainer>

            <InputContainer
              label={t("hydraulic_cylinder.velocity")}
              tooltip={t("hydraulic_cylinder.velocity_tooltip")}
            >
              <NumericInput
                value={velocity}
                onChange={(e) => {
                  setVelocity(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t("hydraulic_cylinder.placeholders.velocity")}
                unit={t("common:units.m_per_s")}
                min={0}
                step={0.01}
              />
            </InputContainer>
          </>
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
              {t("hydraulic_cylinder.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("hydraulic_cylinder.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("hydraulic_cylinder.formulas_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>F = P × A ({t("hydraulic_cylinder.formula_force")})</li>
              <li>P = F / A ({t("hydraulic_cylinder.formula_pressure")})</li>
              <li>A = F / P ({t("hydraulic_cylinder.formula_area")})</li>
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
          {mode === 'force' && t("hydraulic_cylinder.result_force")}
          {mode === 'pressure' && t("hydraulic_cylinder.result_pressure")}
          {mode === 'area' && t("hydraulic_cylinder.result_area")}
          {mode === 'cylinder_sizing' && t("hydraulic_cylinder.result_force")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {mode === 'force' && formatNumber(result.force)}
          {mode === 'pressure' && `${result.pressure.toFixed(2)} bar`}
          {mode === 'area' && `${result.area.toFixed(2)} cm²`}
          {mode === 'cylinder_sizing' && formatNumber(result.force)}
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* All Values */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("hydraulic_cylinder.all_values")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Force */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <ArrowDown className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("hydraulic_cylinder.force")}</div>
            </div>
            <div className="text-xl font-bold text-primary">{formatNumber(result.force)}</div>
          </div>

          {/* Pressure */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Gauge className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("hydraulic_cylinder.pressure")}</div>
            </div>
            <div className="text-xl font-bold text-primary">{result.pressure.toFixed(2)} bar</div>
          </div>

          {/* Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Circle className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("hydraulic_cylinder.area")}</div>
            </div>
            <div className="text-xl font-bold text-primary">{result.area.toFixed(2)} cm²</div>
          </div>

          {/* Extension Force (cylinder sizing mode) */}
          {result.extensionForce && (
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center mb-2">
                <Activity className="w-5 h-5 text-primary ml-2" />
                <div className="font-medium">{t("hydraulic_cylinder.extension_force")}</div>
              </div>
              <div className="text-xl font-bold text-primary">{formatNumber(result.extensionForce)}</div>
            </div>
          )}

          {/* Retraction Force (cylinder sizing mode) */}
          {result.retractionForce && (
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center mb-2">
                <Activity className="w-5 h-5 text-primary ml-2" />
                <div className="font-medium">{t("hydraulic_cylinder.retraction_force")}</div>
              </div>
              <div className="text-xl font-bold text-primary">{formatNumber(result.retractionForce)}</div>
            </div>
          )}

          {/* Flow Rate (if provided velocity) */}
          {result.flowRate && result.flowRate > 0 && (
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center mb-2">
                <Droplets className="w-5 h-5 text-primary ml-2" />
                <div className="font-medium">{t("hydraulic_cylinder.flow_rate")}</div>
              </div>
              <div className="text-xl font-bold text-primary">{result.flowRate.toFixed(2)} L/min</div>
            </div>
          )}
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("hydraulic_cylinder.pascals_law")}</h4>
            <p className="text-sm text-foreground-70">
              {t("hydraulic_cylinder.pascals_law_explanation")}
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
      title={t("hydraulic_cylinder.title")}
      description={t("hydraulic_cylinder.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="engineering"
      resultValue={result?.force}
      results={result}
    />
  );
}
