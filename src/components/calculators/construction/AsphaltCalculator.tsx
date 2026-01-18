'use client';

/**
 * ASPHALT CALCULATOR
 *
 * Calculates asphalt quantity needed for paving projects
 * including driveways, parking lots, and road construction.
 *
 * Formulas:
 * - Volume: V = Area × Thickness
 * - Weight (tons): Volume × Density / 2000 (for lbs to tons)
 * - Metric: Weight (tonnes) = Volume × Density
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layers, Info, Calculator } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface AsphaltResult {
  volumeCubicFeet: number;
  volumeCubicMeters: number;
  weightTons: number;
  weightTonnes: number;
  areaSquareFeet: number;
  areaSquareMeters: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const CUBIC_FEET_TO_CUBIC_METERS = 0.0283168;
const SQUARE_FEET_TO_SQUARE_METERS = 0.092903;
const LBS_PER_TON = 2000;
const KG_PER_TONNE = 1000;
const LBS_TO_KG = 0.453592;

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function AsphaltCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [area, setArea] = useState<string>('');
  const [thickness, setThickness] = useState<string>('');
  const [density, setDensity] = useState<string>('145');
  const [unit, setUnit] = useState<string>('imperial');

  // Result state
  const [result, setResult] = useState<AsphaltResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const a = parseFloat(area);
    const th = parseFloat(thickness);
    const d = parseFloat(density);

    if (isNaN(a) || isNaN(th)) {
      setError(t("asphalt.errors.invalid_dimensions"));
      return false;
    }

    if (a <= 0 || th <= 0) {
      setError(t("asphalt.errors.positive_values"));
      return false;
    }

    if (isNaN(d) || d <= 0) {
      setError(t("asphalt.errors.invalid_density"));
      return false;
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
        const areaValue = parseFloat(area);
        const thicknessValue = parseFloat(thickness);
        const densityValue = parseFloat(density);

        let areaSquareFeet: number;
        let volumeCubicFeet: number;

        if (unit === 'imperial') {
          // Area in square feet, thickness in inches
          areaSquareFeet = areaValue;
          volumeCubicFeet = areaSquareFeet * (thicknessValue / 12);
        } else {
          // Area in square meters, thickness in centimeters
          // Convert to imperial for calculation
          areaSquareFeet = areaValue / SQUARE_FEET_TO_SQUARE_METERS;
          const thicknessInches = thicknessValue / 2.54;
          volumeCubicFeet = areaSquareFeet * (thicknessInches / 12);
        }

        // Calculate weight: Tons = Area × Thickness × Density / 2000
        const weightLbs = volumeCubicFeet * densityValue;
        const weightTons = weightLbs / LBS_PER_TON;
        const weightTonnes = (weightLbs * LBS_TO_KG) / KG_PER_TONNE;

        // Convert to metric
        const volumeCubicMeters = volumeCubicFeet * CUBIC_FEET_TO_CUBIC_METERS;
        const areaSquareMeters = areaSquareFeet * SQUARE_FEET_TO_SQUARE_METERS;

        setResult({
          volumeCubicFeet,
          volumeCubicMeters,
          weightTons,
          weightTonnes,
          areaSquareFeet,
          areaSquareMeters
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
      setArea('');
      setThickness('');
      setDensity('145');
      setUnit('imperial');
      setResult(null);
      setError('');
    }, 300);
  };

  // ---------------------------------------------------------------------------
  // INPUT SECTION
  // ---------------------------------------------------------------------------
  const inputSection = (
    <>
      <div className="max-w-md mx-auto space-y-4">

        {/* Unit Selection */}
        <InputContainer
          label={t("asphalt.unit")}
          tooltip={t("asphalt.unit_tooltip")}
        >
          <Combobox
            value={unit}
            onChange={setUnit}
            options={[
              { value: 'imperial', label: t("asphalt.imperial") },
              { value: 'metric', label: t("asphalt.metric") }
            ]}
          />
        </InputContainer>

        {/* Area */}
        <InputContainer
          label={t("asphalt.area")}
          tooltip={t("asphalt.area_tooltip")}
        >
          <NumberInput
            value={area}
            onValueChange={(value) => {
                setArea(String(value));
                if (error) setError('');
              }}
            placeholder={t("asphalt.placeholders.area")}
            min={0}
            step={1}
            unit={unit === 'imperial' ? t("asphalt.sqft") : t("asphalt.sqm")}
          />
        </InputContainer>

        {/* Thickness */}
        <InputContainer
          label={t("asphalt.thickness")}
          tooltip={t("asphalt.thickness_tooltip")}
        >
          <NumberInput
            value={thickness}
            onValueChange={(value) => {
                setThickness(String(value));
                if (error) setError('');
              }}
            placeholder={t("asphalt.placeholders.thickness")}
            min={0}
            step={0.5}
            unit={unit === 'imperial' ? t("asphalt.inches") : t("asphalt.cm")}
          />
        </InputContainer>

        {/* Density */}
        <InputContainer
          label={t("asphalt.density")}
          tooltip={t("asphalt.density_tooltip")}
        >
          <NumberInput
            value={density}
            onValueChange={(value) => {
                setDensity(String(value));
                if (error) setError('');
              }}
            placeholder={t("asphalt.placeholders.density")}
            min={0}
            step={1}
            unit={t("asphalt.lbs_cuft")}
          />
        </InputContainer>
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
              {t("asphalt.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("asphalt.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("asphalt.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("asphalt.use_case_1")}</li>
              <li>{t("asphalt.use_case_2")}</li>
              <li>{t("asphalt.use_case_3")}</li>
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
          {t("asphalt.result_weight")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.weightTons).toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("asphalt.tons")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({(result.weightTonnes).toFixed(2)} {t("asphalt.tonnes")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("asphalt.details")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Volume Cubic Feet */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("asphalt.volume_cuft")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.volumeCubicFeet.toFixed(2)}</div>
          </div>

          {/* Volume Cubic Meters */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("asphalt.volume_cum")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.volumeCubicMeters.toFixed(2)}</div>
          </div>

          {/* Area Square Feet */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Calculator className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("asphalt.area_sqft")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.areaSquareFeet.toFixed(2)} {t("asphalt.sqft")}
            </div>
          </div>

          {/* Area Square Meters */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Calculator className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("asphalt.area_sqm")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.areaSquareMeters.toFixed(2)} {t("asphalt.sqm")}
            </div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("asphalt.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("asphalt.formula")}
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
      title={t("asphalt.title")}
      description={t("asphalt.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.weightTons}
      results={result}
    />
  );
}
