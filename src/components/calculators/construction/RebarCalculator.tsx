'use client';

/**
 * REBAR CALCULATOR
 *
 * Calculates reinforcement steel (rebar) quantities for concrete slabs,
 * foundations, and structural elements.
 *
 * Formulas:
 * - Number of Bars (Length) = (Width / Spacing) + 1
 * - Number of Bars (Width) = (Length / Spacing) + 1
 * - Total Length = (Bars_Length × Length) + (Bars_Width × Width)
 * - Weight = Total Length × kg/m (based on bar size)
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, Info, Ruler, Scale } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface RebarResult {
  barsLengthDirection: number;
  barsWidthDirection: number;
  totalBars: number;
  totalLengthMeters: number;
  totalLengthFeet: number;
  totalWeightKg: number;
  totalWeightLbs: number;
  weightPerMeter: number;
  slabArea: number;
  coverageArea: number;
}

// =============================================================================
// CONSTANTS - Rebar sizes with weight per meter
// Based on standard deformed steel bar specifications
// =============================================================================
const REBAR_SIZES: { [key: string]: { diameter: number; weightPerMeter: number; name: string } } = {
  '6': { diameter: 6, weightPerMeter: 0.222, name: '#6 (6mm)' },      // 6mm bar
  '8': { diameter: 8, weightPerMeter: 0.395, name: '#8 (8mm)' },      // 8mm bar
  '10': { diameter: 10, weightPerMeter: 0.617, name: '#10 (10mm)' },  // 10mm bar
  '12': { diameter: 12, weightPerMeter: 0.888, name: '#12 (12mm)' },  // 12mm bar
  '14': { diameter: 14, weightPerMeter: 1.208, name: '#14 (14mm)' },  // 14mm bar
  '16': { diameter: 16, weightPerMeter: 1.578, name: '#16 (16mm)' },  // 16mm bar
  '18': { diameter: 18, weightPerMeter: 1.998, name: '#18 (18mm)' },  // 18mm bar
  '20': { diameter: 20, weightPerMeter: 2.466, name: '#20 (20mm)' },  // 20mm bar
  '22': { diameter: 22, weightPerMeter: 2.984, name: '#22 (22mm)' },  // 22mm bar
  '25': { diameter: 25, weightPerMeter: 3.853, name: '#25 (25mm)' },  // 25mm bar
  '28': { diameter: 28, weightPerMeter: 4.834, name: '#28 (28mm)' },  // 28mm bar
  '32': { diameter: 32, weightPerMeter: 6.313, name: '#32 (32mm)' },  // 32mm bar
  '36': { diameter: 36, weightPerMeter: 7.990, name: '#36 (36mm)' },  // 36mm bar
  '40': { diameter: 40, weightPerMeter: 9.864, name: '#40 (40mm)' }   // 40mm bar
};

const METERS_TO_FEET = 3.28084;
const KG_TO_LBS = 2.20462;
const FEET_TO_METERS = 0.3048;

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function RebarCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [slabLength, setSlabLength] = useState<string>('');
  const [slabWidth, setSlabWidth] = useState<string>('');
  const [barSpacing, setBarSpacing] = useState<string>('200');
  const [barSize, setBarSize] = useState<string>('12');
  const [unit, setUnit] = useState<string>('meters');

  // Result state
  const [result, setResult] = useState<RebarResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const length = parseFloat(slabLength);
    const width = parseFloat(slabWidth);
    const spacing = parseFloat(barSpacing);

    if (isNaN(length) || isNaN(width)) {
      setError(t("rebar.errors.invalid_dimensions"));
      return false;
    }

    if (length <= 0 || width <= 0) {
      setError(t("rebar.errors.positive_values"));
      return false;
    }

    if (isNaN(spacing) || spacing <= 0) {
      setError(t("rebar.errors.invalid_spacing"));
      return false;
    }

    if (spacing > 500) {
      setError(t("rebar.errors.max_spacing"));
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
        let length = parseFloat(slabLength);
        let width = parseFloat(slabWidth);
        const spacing = parseFloat(barSpacing);

        // Convert to meters if input is in feet
        if (unit === 'feet') {
          length = length * FEET_TO_METERS;
          width = width * FEET_TO_METERS;
        }

        // Spacing is always in mm, convert to meters for calculation
        const spacingMeters = spacing / 1000;

        // Calculate number of bars in each direction
        // Formula: (Dimension / Spacing) + 1
        const barsLengthDirection = Math.ceil(width / spacingMeters) + 1;
        const barsWidthDirection = Math.ceil(length / spacingMeters) + 1;
        const totalBars = barsLengthDirection + barsWidthDirection;

        // Calculate total length of rebar needed
        // Bars running along length × slab length + Bars running along width × slab width
        const totalLengthMeters = (barsLengthDirection * length) + (barsWidthDirection * width);
        const totalLengthFeet = totalLengthMeters * METERS_TO_FEET;

        // Get weight per meter for selected bar size
        const barData = REBAR_SIZES[barSize];
        const weightPerMeter = barData.weightPerMeter;

        // Calculate total weight
        // Formula: Total Length × kg/m
        const totalWeightKg = totalLengthMeters * weightPerMeter;
        const totalWeightLbs = totalWeightKg * KG_TO_LBS;

        // Calculate slab area
        const slabArea = length * width;

        setResult({
          barsLengthDirection,
          barsWidthDirection,
          totalBars,
          totalLengthMeters,
          totalLengthFeet,
          totalWeightKg,
          totalWeightLbs,
          weightPerMeter,
          slabArea,
          coverageArea: slabArea
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
      setSlabLength('');
      setSlabWidth('');
      setBarSpacing('200');
      setBarSize('12');
      setUnit('meters');
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
          label={t("rebar.unit")}
          tooltip={t("rebar.unit_tooltip")}
        >
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="meters">{t("rebar.meters")}</option>
            <option value="feet">{t("rebar.feet")}</option>
          </select>
        </InputContainer>

        {/* Slab Length */}
        <InputContainer
          label={t("rebar.slab_length")}
          tooltip={t("rebar.slab_length_tooltip")}
        >
          <NumericInput
            value={slabLength}
            onChange={(e) => {
              setSlabLength(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("rebar.placeholders.slab_length")}
            min={0}
            step={0.1}
            unit={unit === 'meters' ? t("rebar.m") : t("rebar.ft")}
          />
        </InputContainer>

        {/* Slab Width */}
        <InputContainer
          label={t("rebar.slab_width")}
          tooltip={t("rebar.slab_width_tooltip")}
        >
          <NumericInput
            value={slabWidth}
            onChange={(e) => {
              setSlabWidth(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("rebar.placeholders.slab_width")}
            min={0}
            step={0.1}
            unit={unit === 'meters' ? t("rebar.m") : t("rebar.ft")}
          />
        </InputContainer>

        {/* Bar Spacing */}
        <InputContainer
          label={t("rebar.bar_spacing")}
          tooltip={t("rebar.bar_spacing_tooltip")}
        >
          <NumericInput
            value={barSpacing}
            onChange={(e) => {
              setBarSpacing(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("rebar.placeholders.bar_spacing")}
            min={50}
            max={500}
            step={10}
            unit={t("rebar.mm")}
          />
        </InputContainer>

        {/* Bar Size */}
        <InputContainer
          label={t("rebar.bar_size")}
          tooltip={t("rebar.bar_size_tooltip")}
        >
          <select
            value={barSize}
            onChange={(e) => setBarSize(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            {Object.entries(REBAR_SIZES).map(([key, data]) => (
              <option key={key} value={key}>
                {data.name} - {data.weightPerMeter} kg/m
              </option>
            ))}
          </select>
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
              {t("rebar.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("rebar.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("rebar.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("rebar.use_case_1")}</li>
              <li>{t("rebar.use_case_2")}</li>
              <li>{t("rebar.use_case_3")}</li>
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
          {t("rebar.result_weight")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.totalWeightKg.toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("rebar.kg")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({result.totalWeightLbs.toFixed(2)} {t("rebar.lbs")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("rebar.details")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Bars in Length Direction */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <LayoutGrid className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("rebar.bars_length_dir")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {result.barsLengthDirection}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              {t("rebar.bars")}
            </div>
          </div>

          {/* Bars in Width Direction */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <LayoutGrid className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("rebar.bars_width_dir")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {result.barsWidthDirection}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              {t("rebar.bars")}
            </div>
          </div>

          {/* Total Length */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("rebar.total_length")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {result.totalLengthMeters.toFixed(2)} {t("rebar.m")}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              ({result.totalLengthFeet.toFixed(2)} {t("rebar.ft")})
            </div>
          </div>

          {/* Slab Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Scale className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("rebar.slab_area")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {result.slabArea.toFixed(2)}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              {t("rebar.m2")}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 space-y-3">
        <h3 className="font-medium mb-3">
          {t("rebar.summary")}
        </h3>
        <div className="flex justify-between items-center p-3 bg-card rounded-lg">
          <span className="text-foreground-70">{t("rebar.total_bars")}</span>
          <span className="font-medium">{result.totalBars} {t("rebar.bars")}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-card rounded-lg">
          <span className="text-foreground-70">{t("rebar.weight_per_meter")}</span>
          <span className="font-medium">{result.weightPerMeter} {t("rebar.kg_m")}</span>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("rebar.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("rebar.formula")}
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
      title={t("rebar.title")}
      description={t("rebar.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.totalWeightKg}
      results={result}
    />
  );
}
