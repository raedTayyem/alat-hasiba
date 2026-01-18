'use client';

/**
 * STRESS AND STRAIN CALCULATOR
 *
 * Calculates mechanical stress, strain, and Young's modulus for materials.
 *
 * Formulas:
 * - Stress (σ) = Force (F) / Area (A) [Pa or N/m²]
 * - Strain (ε) = Change in Length (ΔL) / Original Length (L₀) [dimensionless]
 * - Young's Modulus (E) = Stress (σ) / Strain (ε) [Pa]
 * - Hooke's Law: σ = E × ε
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDown, Ruler, LayoutGrid, Info, Activity } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
type CalculationMode = 'stress' | 'strain' | 'youngs_modulus' | 'deformation';

interface StressStrainResult {
  stress: number;
  strain: number;
  youngsModulus: number;
  deformation: number;
  forceApplied?: number;
  crossSectionalArea?: number;
  originalLength?: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const COMMON_MATERIALS: Record<string, number> = {
  steel: 200e9,        // 200 GPa
  aluminum: 70e9,      // 70 GPa
  copper: 120e9,       // 120 GPa
  titanium: 110e9,     // 110 GPa
  glass: 70e9,         // 70 GPa
  concrete: 30e9,      // 30 GPa
  wood: 12e9,          // 12 GPa
  rubber: 0.01e9,      // 0.01 GPa
  plastic: 3e9,        // 3 GPa
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function StressStrainCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/engineering', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [mode, setMode] = useState<CalculationMode>('stress');
  const [force, setForce] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [originalLength, setOriginalLength] = useState<string>('');
  const [changeInLength, setChangeInLength] = useState<string>('');
  const [youngsModulus, setYoungsModulus] = useState<string>('');
  const [stress, setStress] = useState<string>('');
  const [strain, setStrain] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('steel');

  // Result state
  const [result, setResult] = useState<StressStrainResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    if (mode === 'stress') {
      const f = parseFloat(force);
      const a = parseFloat(area);
      if (isNaN(f) || isNaN(a)) {
        setError(t("stress_strain.errors.invalid_input"));
        return false;
      }
      if (a <= 0) {
        setError(t("stress_strain.errors.area_positive"));
        return false;
      }
    } else if (mode === 'strain') {
      const l0 = parseFloat(originalLength);
      const dl = parseFloat(changeInLength);
      if (isNaN(l0) || isNaN(dl)) {
        setError(t("stress_strain.errors.invalid_input"));
        return false;
      }
      if (l0 <= 0) {
        setError(t("stress_strain.errors.length_positive"));
        return false;
      }
    } else if (mode === 'youngs_modulus') {
      const s = parseFloat(stress);
      const e = parseFloat(strain);
      if (isNaN(s) || isNaN(e)) {
        setError(t("stress_strain.errors.invalid_input"));
        return false;
      }
      if (e === 0) {
        setError(t("stress_strain.errors.strain_zero"));
        return false;
      }
    } else if (mode === 'deformation') {
      const f = parseFloat(force);
      const a = parseFloat(area);
      const l0 = parseFloat(originalLength);
      if (isNaN(f) || isNaN(a) || isNaN(l0)) {
        setError(t("stress_strain.errors.invalid_input"));
        return false;
      }
      if (a <= 0 || l0 <= 0) {
        setError(t("stress_strain.errors.positive_values"));
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
        let resultStress = 0;
        let resultStrain = 0;
        let resultYoungsModulus = 0;
        let resultDeformation = 0;

        if (mode === 'stress') {
          const f = parseFloat(force);
          const a = parseFloat(area) * 1e-6; // Convert mm² to m²
          resultStress = f / a;

          // If Young's modulus is known, calculate strain
          const e = COMMON_MATERIALS[selectedMaterial] || parseFloat(youngsModulus);
          if (e > 0) {
            resultStrain = resultStress / e;
            resultYoungsModulus = e;
          }
        } else if (mode === 'strain') {
          const l0 = parseFloat(originalLength) * 0.001; // Convert mm to m
          const dl = parseFloat(changeInLength) * 0.001;
          resultStrain = dl / l0;
          resultDeformation = dl;

          // If Young's modulus is known, calculate stress
          const e = COMMON_MATERIALS[selectedMaterial] || parseFloat(youngsModulus);
          if (e > 0) {
            resultStress = resultStrain * e;
            resultYoungsModulus = e;
          }
        } else if (mode === 'youngs_modulus') {
          const s = parseFloat(stress) * 1e6; // Convert MPa to Pa
          const e = parseFloat(strain);
          resultStress = s;
          resultStrain = e;
          resultYoungsModulus = s / e;
        } else if (mode === 'deformation') {
          const f = parseFloat(force);
          const a = parseFloat(area) * 1e-6; // Convert mm² to m²
          const l0 = parseFloat(originalLength) * 0.001; // Convert mm to m
          const e = COMMON_MATERIALS[selectedMaterial] || parseFloat(youngsModulus);

          resultStress = f / a;
          resultStrain = resultStress / e;
          resultDeformation = resultStrain * l0;
          resultYoungsModulus = e;
        }

        setResult({
          stress: resultStress,
          strain: resultStrain,
          youngsModulus: resultYoungsModulus,
          deformation: resultDeformation * 1000, // Convert to mm
          forceApplied: parseFloat(force) || undefined,
          crossSectionalArea: parseFloat(area) || undefined,
          originalLength: parseFloat(originalLength) || undefined,
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
      setForce('');
      setArea('');
      setOriginalLength('');
      setChangeInLength('');
      setYoungsModulus('');
      setStress('');
      setStrain('');
      setResult(null);
      setError('');
    }, 300);
  };

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------
  const formatNumber = (num: number): string => {
    if (Math.abs(num) >= 1e9) {
      return (num / 1e9).toFixed(2) + ' GPa';
    } else if (Math.abs(num) >= 1e6) {
      return (num / 1e6).toFixed(2) + ' MPa';
    } else if (Math.abs(num) >= 1e3) {
      return (num / 1e3).toFixed(2) + ' kPa';
    } else if (Math.abs(num) < 0.001 && num !== 0) {
      return num.toExponential(4);
    }
    return num.toFixed(4);
  };

  const formatStrain = (num: number): string => {
    if (Math.abs(num) < 0.0001 && num !== 0) {
      return (num * 1e6).toFixed(2) + ' με';
    }
    return (num * 100).toFixed(4) + ' %';
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
            onClick={() => { setMode('stress'); setResult(null); setError(''); }}
            className={`px-3 py-2 rounded-lg transition-colors text-sm ${
              mode === 'stress' ? 'bg-primary text-white' : 'bg-muted dark:bg-muted'
            }`}
          >
            {t("stress_strain.modes.stress")}
          </button>
          <button
            onClick={() => { setMode('strain'); setResult(null); setError(''); }}
            className={`px-3 py-2 rounded-lg transition-colors text-sm ${
              mode === 'strain' ? 'bg-primary text-white' : 'bg-muted dark:bg-muted'
            }`}
          >
            {t("stress_strain.modes.strain")}
          </button>
          <button
            onClick={() => { setMode('youngs_modulus'); setResult(null); setError(''); }}
            className={`px-3 py-2 rounded-lg transition-colors text-sm ${
              mode === 'youngs_modulus' ? 'bg-primary text-white' : 'bg-muted dark:bg-muted'
            }`}
          >
            {t("stress_strain.modes.youngs_modulus")}
          </button>
          <button
            onClick={() => { setMode('deformation'); setResult(null); setError(''); }}
            className={`px-3 py-2 rounded-lg transition-colors text-sm ${
              mode === 'deformation' ? 'bg-primary text-white' : 'bg-muted dark:bg-muted'
            }`}
          >
            {t("stress_strain.modes.deformation")}
          </button>
        </div>

        {/* Force Input */}
        {(mode === 'stress' || mode === 'deformation') && (
          <InputContainer
            label={t("stress_strain.force")}
            tooltip={t("stress_strain.force_tooltip")}
          >
            <NumberInput
              value={force}
              onValueChange={(value) => {
                setForce(String(value));
                if (error) setError('');
              }}
              placeholder={t("stress_strain.placeholders.force")}
              unit={t("common:units.N")}
              min={0}
              step={1}
            />
          </InputContainer>
        )}

        {/* Area Input */}
        {(mode === 'stress' || mode === 'deformation') && (
          <InputContainer
            label={t("stress_strain.area")}
            tooltip={t("stress_strain.area_tooltip")}
          >
            <NumberInput
              value={area}
              onValueChange={(value) => {
                setArea(String(value));
                if (error) setError('');
              }}
              placeholder={t("stress_strain.placeholders.area")}
              unit={t("common:units.mm_squared")}
              min={0}
              step={0.1}
            />
          </InputContainer>
        )}

        {/* Original Length Input */}
        {(mode === 'strain' || mode === 'deformation') && (
          <InputContainer
            label={t("stress_strain.original_length")}
            tooltip={t("stress_strain.original_length_tooltip")}
          >
            <NumberInput
              value={originalLength}
              onValueChange={(value) => {
                setOriginalLength(String(value));
                if (error) setError('');
              }}
              placeholder={t("stress_strain.placeholders.original_length")}
              unit={t("common:units.mm")}
              min={0}
              step={0.1}
            />
          </InputContainer>
        )}

        {/* Change in Length Input */}
        {mode === 'strain' && (
          <InputContainer
            label={t("stress_strain.change_in_length")}
            tooltip={t("stress_strain.change_in_length_tooltip")}
          >
            <NumberInput
              value={changeInLength}
              onValueChange={(value) => {
                setChangeInLength(String(value));
                if (error) setError('');
              }}
              placeholder={t("stress_strain.placeholders.change_in_length")}
              unit={t("common:units.mm")}
              step={0.001}
            />
          </InputContainer>
        )}

        {/* Stress Input */}
        {mode === 'youngs_modulus' && (
          <InputContainer
            label={t("stress_strain.stress")}
            tooltip={t("stress_strain.stress_tooltip")}
          >
            <NumberInput
              value={stress}
              onValueChange={(value) => {
                setStress(String(value));
                if (error) setError('');
              }}
              placeholder={t("stress_strain.placeholders.stress")}
              unit={t("common:units.MPa")}
              min={0}
              step={0.1}
            />
          </InputContainer>
        )}

        {/* Strain Input */}
        {mode === 'youngs_modulus' && (
          <InputContainer
            label={t("stress_strain.strain")}
            tooltip={t("stress_strain.strain_tooltip")}
          >
            <NumberInput
              value={strain}
              onValueChange={(value) => {
                setStrain(String(value));
                if (error) setError('');
              }}
              placeholder={t("stress_strain.placeholders.strain")}
              step={0.0001}
            />
          </InputContainer>
        )}

        {/* Material Selection */}
        {(mode === 'stress' || mode === 'strain' || mode === 'deformation') && (
          <InputContainer
            label={t("stress_strain.material")}
            tooltip={t("stress_strain.material_tooltip")}
          >
            <Combobox
              options={Object.entries(COMMON_MATERIALS).map(([key, value]) => ({
                value: key,
                label: `${key.charAt(0).toUpperCase() + key.slice(1)} (${(value / 1e9).toFixed(0)} GPa)`
              }))}
              value={selectedMaterial}
              onChange={setSelectedMaterial}
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
              {t("stress_strain.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("stress_strain.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("stress_strain.formulas_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("stress_strain.formula_stress")}</li>
              <li>{t("stress_strain.formula_strain")}</li>
              <li>{t("stress_strain.formula_youngs")}</li>
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
          {mode === 'stress' && t("stress_strain.result_stress")}
          {mode === 'strain' && t("stress_strain.result_strain")}
          {mode === 'youngs_modulus' && t("stress_strain.result_youngs")}
          {mode === 'deformation' && t("stress_strain.result_deformation")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {mode === 'stress' && formatNumber(result.stress)}
          {mode === 'strain' && formatStrain(result.strain)}
          {mode === 'youngs_modulus' && formatNumber(result.youngsModulus)}
          {mode === 'deformation' && `${result.deformation.toFixed(4)} mm`}
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* All Values */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("stress_strain.all_values")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Stress */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <ArrowDown className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("stress_strain.stress")}</div>
            </div>
            <div className="text-xl font-bold text-primary">{formatNumber(result.stress)}</div>
          </div>

          {/* Strain */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("stress_strain.strain")}</div>
            </div>
            <div className="text-xl font-bold text-primary">{formatStrain(result.strain)}</div>
          </div>

          {/* Young's Modulus */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <LayoutGrid className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("stress_strain.youngs_modulus")}</div>
            </div>
            <div className="text-xl font-bold text-primary">{formatNumber(result.youngsModulus)}</div>
          </div>

          {/* Deformation */}
          {result.deformation > 0 && (
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center mb-2">
                <Activity className="w-5 h-5 text-primary ml-2" />
                <div className="font-medium">{t("stress_strain.deformation")}</div>
              </div>
              <div className="text-xl font-bold text-primary">{result.deformation.toFixed(4)} mm</div>
            </div>
          )}
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("stress_strain.hookes_law")}</h4>
            <p className="text-sm text-foreground-70">
              {t("stress_strain.hookes_law_explanation")}
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
      title={t("stress_strain.title")}
      description={t("stress_strain.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="engineering"
      resultValue={result?.stress}
      results={result}
    />
  );
}
