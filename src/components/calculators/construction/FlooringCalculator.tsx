'use client';

/**
 * FLOORING CALCULATOR
 *
 * Calculates flooring materials needed for a room.
 *
 * Formulas:
 * - Area = Length × Width
 * - Materials = Area × (1 + Waste Factor) / Material Coverage
 * - Boxes/Packs = Materials / Coverage per Box
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, Layers, Package, Square } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface FlooringResult {
  roomAreaSqFt: number;
  roomAreaSqM: number;
  areaWithWaste: number;
  boxesNeeded: number;
  planksNeeded: number;
  adhesive: number;
  underlayment: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const FLOORING_TYPES: { [key: string]: { coveragePerBox: number; planksPerBox: number; name: string } } = {
  laminate: { coveragePerBox: 20, planksPerBox: 8, name: 'laminate' },
  hardwood: { coveragePerBox: 20, planksPerBox: 6, name: 'hardwood' },
  vinyl_plank: { coveragePerBox: 24, planksPerBox: 10, name: 'vinyl_plank' },
  engineered: { coveragePerBox: 20, planksPerBox: 7, name: 'engineered' }
};

const ADHESIVE_COVERAGE = 50; // sq ft per gallon
const UNDERLAYMENT_ROLL_COVERAGE = 100; // sq ft per roll

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function FlooringCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [roomLength, setRoomLength] = useState<string>('');
  const [roomWidth, setRoomWidth] = useState<string>('');
  const [flooringType, setFlooringType] = useState<string>('laminate');
  const [wasteFactor, setWasteFactor] = useState<string>('10');
  const [unit, setUnit] = useState<string>('feet');
  const [coveragePerBox, setCoveragePerBox] = useState<string>('20');

  // Result state
  const [result, setResult] = useState<FlooringResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Combobox options
  const unitOptions: ComboboxOption[] = [
    { value: 'feet', label: t("flooring.feet") },
    { value: 'meters', label: t("flooring.meters") }
  ];

  const flooringTypeOptions: ComboboxOption[] = [
    { value: 'laminate', label: t("flooring.types.laminate") },
    { value: 'hardwood', label: t("flooring.types.hardwood") },
    { value: 'vinyl_plank', label: t("flooring.types.vinyl_plank") },
    { value: 'engineered', label: t("flooring.types.engineered") }
  ];

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const length = parseFloat(roomLength);
    const width = parseFloat(roomWidth);
    const waste = parseFloat(wasteFactor);
    const coverage = parseFloat(coveragePerBox);

    if (isNaN(length) || isNaN(width)) {
      setError(t("flooring.errors.invalid_dimensions"));
      return false;
    }

    if (length <= 0 || width <= 0) {
      setError(t("flooring.errors.positive_values"));
      return false;
    }

    if (isNaN(coverage) || coverage <= 0) {
      setError(t("flooring.errors.invalid_coverage"));
      return false;
    }

    if (isNaN(waste) || waste < 0 || waste > 100) {
      setError(t("flooring.errors.invalid_waste"));
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
        let length = parseFloat(roomLength);
        let width = parseFloat(roomWidth);
        const waste = parseFloat(wasteFactor) / 100;
        const coverage = parseFloat(coveragePerBox);

        // Convert to feet if input is in meters
        if (unit === 'meters') {
          length = length * 3.28084;
          width = width * 3.28084;
        }

        // Calculate room area in sq ft
        const roomAreaSqFt = length * width;
        const roomAreaSqM = roomAreaSqFt / 10.7639;

        // Calculate area with waste
        const areaWithWaste = roomAreaSqFt * (1 + waste);

        // Get flooring type details
        const floorType = FLOORING_TYPES[flooringType];

        // Calculate boxes needed
        const boxesNeeded = Math.ceil(areaWithWaste / coverage);

        // Calculate planks needed
        const planksNeeded = boxesNeeded * floorType.planksPerBox;

        // Calculate adhesive (gallons)
        const adhesive = Math.ceil(areaWithWaste / ADHESIVE_COVERAGE);

        // Calculate underlayment rolls
        const underlayment = Math.ceil(areaWithWaste / UNDERLAYMENT_ROLL_COVERAGE);

        setResult({
          roomAreaSqFt,
          roomAreaSqM,
          areaWithWaste,
          boxesNeeded,
          planksNeeded,
          adhesive,
          underlayment
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
      setRoomLength('');
      setRoomWidth('');
      setFlooringType('laminate');
      setWasteFactor('10');
      setUnit('feet');
      setCoveragePerBox('20');
      setResult(null);
      setError('');
    }, 300);
  };

  // Handle flooring type change
  const handleFlooringTypeChange = (type: string) => {
    setFlooringType(type);
    setCoveragePerBox(FLOORING_TYPES[type].coveragePerBox.toString());
  };

  // ---------------------------------------------------------------------------
  // INPUT SECTION
  // ---------------------------------------------------------------------------
  const inputSection = (
    <>
      <div className="max-w-md mx-auto space-y-4">

        {/* Unit Selection */}
        <InputContainer
          label={t("flooring.unit")}
          tooltip={t("flooring.unit_tooltip")}
        >
          <Combobox options={unitOptions} value={unit} onChange={setUnit} />
        </InputContainer>

        {/* Room Length */}
        <InputContainer
          label={t("flooring.room_length")}
          tooltip={t("flooring.room_length_tooltip")}
        >
          <NumericInput
            value={roomLength}
            onChange={(e) => {
              setRoomLength(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("flooring.placeholders.length")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        {/* Room Width */}
        <InputContainer
          label={t("flooring.room_width")}
          tooltip={t("flooring.room_width_tooltip")}
        >
          <NumericInput
            value={roomWidth}
            onChange={(e) => {
              setRoomWidth(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("flooring.placeholders.width")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        {/* Flooring Type */}
        <InputContainer
          label={t("flooring.flooring_type")}
          tooltip={t("flooring.flooring_type_tooltip")}
        >
          <Combobox options={flooringTypeOptions} value={flooringType} onChange={handleFlooringTypeChange} />
        </InputContainer>

        {/* Coverage per Box */}
        <InputContainer
          label={t("flooring.coverage_per_box")}
          tooltip={t("flooring.coverage_per_box_tooltip")}
        >
          <NumericInput
            value={coveragePerBox}
            onChange={(e) => {
              setCoveragePerBox(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("flooring.placeholders.coverage")}
            min={1}
            step={1}
            unit={t("flooring.sqft_short")}
          />
        </InputContainer>

        {/* Waste Factor */}
        <InputContainer
          label={t("flooring.waste_factor")}
          tooltip={t("flooring.waste_factor_tooltip")}
        >
          <NumericInput
            value={wasteFactor}
            onChange={(e) => {
              setWasteFactor(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("flooring.placeholders.waste")}
            min={0}
            max={100}
            step={1}
            unit={t("common:units.percent")}
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
              {t("flooring.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("flooring.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("flooring.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("flooring.use_case_1")}</li>
              <li>{t("flooring.use_case_2")}</li>
              <li>{t("flooring.use_case_3")}</li>
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
          {t("flooring.result_boxes")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.boxesNeeded}
        </div>
        <div className="text-lg text-foreground-70">
          {t("flooring.boxes")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({result.planksNeeded} {t("flooring.planks")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("flooring.details")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Room Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Square className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("flooring.room_area")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.roomAreaSqFt.toFixed(1)} {t("flooring.sqft_short")} ({result.roomAreaSqM.toFixed(1)} {t("flooring.sqm_short")})
            </div>
          </div>

          {/* Area with Waste */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("flooring.area_with_waste")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.areaWithWaste.toFixed(1)} {t("flooring.sqft_short")}
            </div>
          </div>

          {/* Underlayment */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("flooring.underlayment")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.underlayment} {t("flooring.rolls")}
            </div>
          </div>

          {/* Adhesive */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Package className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("flooring.adhesive")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.adhesive} {t("flooring.gallons")}
            </div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("flooring.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("flooring.formula")}
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
      title={t("flooring.title")}
      description={t("flooring.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.boxesNeeded}
      results={result}
    />
  );
}
