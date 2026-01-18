'use client';

/**
 * MATERIAL CONVERSION CALCULATOR
 *
 * Converts units and quantities for engineering materials including
 * steel, concrete, wood, and other construction materials.
 *
 * Features:
 * - Weight to volume conversion
 * - Length unit conversions
 * - Area and volume conversions
 * - Material density calculations
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, Box, Ruler, Info, ArrowRightLeft } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
type ConversionMode = 'weight' | 'length' | 'area' | 'volume';

interface MaterialDensity {
  name: string;
  density: number; // kg/m³
}

interface ConversionResult {
  fromValue: number;
  fromUnit: string;
  toValue: number;
  toUnit: string;
  materialName?: string;
  materialDensity?: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const MATERIALS: Record<string, MaterialDensity> = {
  steel: { name: 'steel', density: 7850 },
  aluminum: { name: 'aluminum', density: 2700 },
  copper: { name: 'copper', density: 8960 },
  concrete: { name: 'concrete', density: 2400 },
  wood_oak: { name: 'wood_oak', density: 750 },
  wood_pine: { name: 'wood_pine', density: 550 },
  brick: { name: 'brick', density: 1920 },
  glass: { name: 'glass', density: 2500 },
  plastic_pvc: { name: 'plastic_pvc', density: 1400 },
  water: { name: 'water', density: 1000 },
};

const WEIGHT_UNITS: Record<string, number> = {
  kg: 1,
  g: 0.001,
  mg: 0.000001,
  ton: 1000,
  lb: 0.453592,
  oz: 0.0283495,
};

const LENGTH_UNITS: Record<string, number> = {
  m: 1,
  cm: 0.01,
  mm: 0.001,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
};

const AREA_UNITS: Record<string, number> = {
  'm²': 1,
  'cm²': 0.0001,
  'mm²': 0.000001,
  'km²': 1000000,
  'in²': 0.00064516,
  'ft²': 0.092903,
  'yd²': 0.836127,
  acre: 4046.86,
  hectare: 10000,
};

const VOLUME_UNITS: Record<string, number> = {
  'm³': 1,
  'cm³': 0.000001,
  'mm³': 0.000000001,
  L: 0.001,
  mL: 0.000001,
  'in³': 0.0000163871,
  'ft³': 0.0283168,
  'yd³': 0.764555,
  gal: 0.00378541,
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function MaterialConversionCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/engineering', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [mode, setMode] = useState<ConversionMode>('weight');
  const [inputValue, setInputValue] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<string>('kg');
  const [toUnit, setToUnit] = useState<string>('lb');
  const [material, setMaterial] = useState<string>('steel');

  // Result state
  const [result, setResult] = useState<ConversionResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------
  const getUnits = () => {
    switch (mode) {
      case 'weight': return WEIGHT_UNITS;
      case 'length': return LENGTH_UNITS;
      case 'area': return AREA_UNITS;
      case 'volume': return VOLUME_UNITS;
      default: return WEIGHT_UNITS;
    }
  };

  const getDefaultUnits = () => {
    switch (mode) {
      case 'weight': return { from: 'kg', to: 'lb' };
      case 'length': return { from: 'm', to: 'ft' };
      case 'area': return { from: 'm²', to: 'ft²' };
      case 'volume': return { from: 'm³', to: 'ft³' };
      default: return { from: 'kg', to: 'lb' };
    }
  };

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setError(t("material-conversion.errors.invalid_input"));
      return false;
    }

    if (value < 0) {
      setError(t("material-conversion.errors.positive_value"));
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
        const value = parseFloat(inputValue);
        const units = getUnits();

        // Convert to base unit first, then to target unit
        const baseValue = value * units[fromUnit];
        const convertedValue = baseValue / units[toUnit];

        setResult({
          fromValue: value,
          fromUnit,
          toValue: convertedValue,
          toUnit,
          materialName: mode === 'weight' ? MATERIALS[material]?.name : undefined,
          materialDensity: mode === 'weight' ? MATERIALS[material]?.density : undefined,
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
      setInputValue('');
      const defaults = getDefaultUnits();
      setFromUnit(defaults.from);
      setToUnit(defaults.to);
      setResult(null);
      setError('');
    }, 300);
  };

  const handleModeChange = (newMode: ConversionMode) => {
    setMode(newMode);
    setResult(null);
    setError('');
    const defaults = getDefaultUnits();
    setFromUnit(defaults.from);
    setToUnit(defaults.to);
  };

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------
  const formatNumber = (num: number): string => {
    if (Math.abs(num) < 0.001 && num !== 0) {
      return num.toExponential(4);
    }
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  };

  // ---------------------------------------------------------------------------
  // INPUT SECTION
  // ---------------------------------------------------------------------------
  const units = getUnits();

  const inputSection = (
    <>
      <div className="max-w-md mx-auto space-y-4">

        {/* Mode Selection */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            onClick={() => handleModeChange('weight')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'weight' ? 'bg-primary text-white' : 'bg-muted dark:bg-muted'
            }`}
          >
            {t("material-conversion.modes.weight")}
          </button>
          <button
            onClick={() => handleModeChange('length')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'length' ? 'bg-primary text-white' : 'bg-muted dark:bg-muted'
            }`}
          >
            {t("material-conversion.modes.length")}
          </button>
          <button
            onClick={() => handleModeChange('area')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'area' ? 'bg-primary text-white' : 'bg-muted dark:bg-muted'
            }`}
          >
            {t("material-conversion.modes.area")}
          </button>
          <button
            onClick={() => handleModeChange('volume')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'volume' ? 'bg-primary text-white' : 'bg-muted dark:bg-muted'
            }`}
          >
            {t("material-conversion.modes.volume")}
          </button>
        </div>

        {/* Input Value */}
        <InputContainer
          label={t("material-conversion.value")}
          tooltip={t("material-conversion.value_tooltip")}
        >
          <NumericInput
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("material-conversion.placeholders.value")}
            min={0}
            step={0.01}
          />
        </InputContainer>

        {/* From Unit */}
        <InputContainer
          label={t("material-conversion.from_unit")}
          tooltip={t("material-conversion.from_unit_tooltip")}
        >
          <Combobox
            options={Object.keys(units).map((unit) => ({ value: unit, label: unit }))}
            value={fromUnit}
            onChange={setFromUnit}
          />
        </InputContainer>

        {/* To Unit */}
        <InputContainer
          label={t("material-conversion.to_unit")}
          tooltip={t("material-conversion.to_unit_tooltip")}
        >
          <Combobox
            options={Object.keys(units).map((unit) => ({ value: unit, label: unit }))}
            value={toUnit}
            onChange={setToUnit}
          />
        </InputContainer>

        {/* Material Selection (for weight mode) */}
        {mode === 'weight' && (
          <InputContainer
            label={t("material-conversion.material")}
            tooltip={t("material-conversion.material_tooltip")}
          >
            <Combobox
              options={Object.entries(MATERIALS).map(([key, mat]) => ({
                value: key,
                label: `${t(`material-conversion.materials.${mat.name}`)} (${mat.density} kg/m³)`
              }))}
              value={material}
              onChange={setMaterial}
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
              {t("material-conversion.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("material-conversion.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("material-conversion.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("material-conversion.use_case_1")}</li>
              <li>{t("material-conversion.use_case_2")}</li>
              <li>{t("material-conversion.use_case_3")}</li>
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
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-2xl font-bold">
            {formatNumber(result.fromValue)} {result.fromUnit}
          </div>
          <ArrowRightLeft className="w-6 h-6 text-primary" />
          <div className="text-2xl font-bold text-primary">
            {formatNumber(result.toValue)} {result.toUnit}
          </div>
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Conversion Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("material-conversion.conversion_details")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* From Value */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Scale className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("material-conversion.original_value")}</div>
            </div>
            <div className="text-2xl font-bold">{formatNumber(result.fromValue)} {result.fromUnit}</div>
          </div>

          {/* To Value */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Box className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("material-conversion.converted_value")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.toValue)} {result.toUnit}</div>
          </div>

          {/* Material Info (if applicable) */}
          {result.materialName && result.materialDensity && (
            <>
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center mb-2">
                  <Ruler className="w-5 h-5 text-primary ml-2" />
                  <div className="font-medium">{t("material-conversion.material")}</div>
                </div>
                <div className="text-xl font-bold">{t(`material-conversion.materials.${result.materialName}`)}</div>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center mb-2">
                  <Scale className="w-5 h-5 text-primary ml-2" />
                  <div className="font-medium">{t("material-conversion.density")}</div>
                </div>
                <div className="text-xl font-bold">{result.materialDensity} kg/m³</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("material-conversion.conversion_formula")}</h4>
            <p className="text-sm text-foreground-70">
              {t("material-conversion.conversion_explanation")}
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
      title={t("material-conversion.title")}
      description={t("material-conversion.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="engineering"
      resultValue={result?.toValue}
      results={result}
    />
  );
}
