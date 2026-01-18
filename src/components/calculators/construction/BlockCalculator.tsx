'use client';

/**
 * BLOCK CALCULATOR (CMU - Concrete Masonry Units)
 *
 * Calculates concrete blocks needed for wall construction.
 *
 * Formulas:
 * - Wall Area = Length × Height
 * - Block Face Area = Block Length × Block Height (with mortar joints)
 * - Blocks Needed = Wall Area / Block Face Area × (1 + Waste Factor)
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Square, Box, Layers, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface BlockResult {
  blocksNeeded: number;
  blocksWithWaste: number;
  wallArea: number;
  mortarVolume: number;
  mortarBags: number;
  extraBlocks: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
// Standard CMU block sizes (in meters) - dimensions without mortar
const BLOCK_SIZES: { [key: string]: { length: number; height: number; width: number } } = {
  '8x8x16': { length: 0.406, height: 0.203, width: 0.203 },   // 8" × 8" × 16" (most common)
  '6x8x16': { length: 0.406, height: 0.203, width: 0.152 },   // 6" × 8" × 16"
  '4x8x16': { length: 0.406, height: 0.203, width: 0.102 },   // 4" × 8" × 16"
  '12x8x16': { length: 0.406, height: 0.203, width: 0.305 },  // 12" × 8" × 16"
  '20x20x40': { length: 0.40, height: 0.20, width: 0.20 },    // Metric 20 × 20 × 40 cm
};

const MORTAR_JOINT = 0.010; // 10mm standard mortar joint
const MORTAR_BAG_COVERAGE = 0.028; // cubic meters per 25kg bag

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function BlockCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [wallLength, setWallLength] = useState<string>('');
  const [wallHeight, setWallHeight] = useState<string>('');
  const [blockSize, setBlockSize] = useState<string>('8x8x16');
  const [wasteFactor, setWasteFactor] = useState<string>('5');
  const [unit, setUnit] = useState<string>('meters');

  // Result state
  const [result, setResult] = useState<BlockResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const length = parseFloat(wallLength);
    const height = parseFloat(wallHeight);
    const waste = parseFloat(wasteFactor);

    if (isNaN(length) || isNaN(height)) {
      setError(t("block.errors.invalid_dimensions"));
      return false;
    }

    if (length <= 0 || height <= 0) {
      setError(t("block.errors.positive_values"));
      return false;
    }

    if (isNaN(waste) || waste < 0 || waste > 100) {
      setError(t("block.errors.invalid_waste"));
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
        let length = parseFloat(wallLength);
        let height = parseFloat(wallHeight);
        const waste = parseFloat(wasteFactor) / 100;

        // Convert to meters if input is in feet
        if (unit === 'feet') {
          length = length * 0.3048;
          height = height * 0.3048;
        }

        // Get block dimensions
        const block = BLOCK_SIZES[blockSize];

        // Calculate wall area
        const wallArea = length * height;

        // Calculate block face area (including mortar joint)
        const blockFaceArea = (block.length + MORTAR_JOINT) * (block.height + MORTAR_JOINT);

        // Calculate number of blocks
        const blocksNeeded = Math.ceil(wallArea / blockFaceArea);
        const blocksWithWaste = Math.ceil(blocksNeeded * (1 + waste));
        const extraBlocks = blocksWithWaste - blocksNeeded;

        // Calculate mortar volume
        // Mortar joints: horizontal + vertical + bed joint
        const horizontalJoint = block.length * MORTAR_JOINT * block.width;
        const verticalJoint = block.height * MORTAR_JOINT * block.width;
        const mortarPerBlock = horizontalJoint + verticalJoint;
        const mortarVolume = blocksWithWaste * mortarPerBlock;
        const mortarBags = Math.ceil(mortarVolume / MORTAR_BAG_COVERAGE);

        setResult({
          blocksNeeded,
          blocksWithWaste,
          wallArea,
          mortarVolume,
          mortarBags,
          extraBlocks
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
      setWallLength('');
      setWallHeight('');
      setBlockSize('8x8x16');
      setWasteFactor('5');
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
          label={t("block.unit")}
          tooltip={t("block.unit_tooltip")}
        >
          <Combobox
            value={unit}
            onChange={setUnit}
            options={[
              { value: 'meters', label: t("block.meters") },
              { value: 'feet', label: t("block.feet") }
            ]}
          />
        </InputContainer>

        {/* Block Size */}
        <InputContainer
          label={t("block.block_size")}
          tooltip={t("block.block_size_tooltip")}
        >
          <Combobox
            value={blockSize}
            onChange={setBlockSize}
            options={[
              { value: '8x8x16', label: t("block.sizes.8x8x16") },
              { value: '6x8x16', label: t("block.sizes.6x8x16") },
              { value: '4x8x16', label: t("block.sizes.4x8x16") },
              { value: '12x8x16', label: t("block.sizes.12x8x16") },
              { value: '20x20x40', label: t("block.sizes.20x20x40") }
            ]}
          />
        </InputContainer>

        {/* Wall Length */}
        <InputContainer
          label={t("block.wall_length")}
          tooltip={t("block.wall_length_tooltip")}
        >
          <NumberInput
            value={wallLength}
            onValueChange={(value) => {
                setWallLength(String(value));
                if (error) setError('');
              }}
            placeholder={t("block.placeholders.wall_length")}
            step={0.1}
            min={0}
          />
        </InputContainer>

        {/* Wall Height */}
        <InputContainer
          label={t("block.wall_height")}
          tooltip={t("block.wall_height_tooltip")}
        >
          <NumberInput
            value={wallHeight}
            onValueChange={(value) => {
                setWallHeight(String(value));
                if (error) setError('');
              }}
            placeholder={t("block.placeholders.wall_height")}
            step={0.1}
            min={0}
          />
        </InputContainer>

        {/* Waste Factor */}
        <InputContainer
          label={t("block.waste_factor")}
          tooltip={t("block.waste_factor_tooltip")}
        >
          <NumberInput
            value={wasteFactor}
            onValueChange={(value) => {
                setWasteFactor(String(value));
                if (error) setError('');
              }}
            placeholder={t("block.placeholders.waste")}
            step={1}
            min={0}
            max={100}
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
              {t("block.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("block.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("block.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("block.use_case_1")}</li>
              <li>{t("block.use_case_2")}</li>
              <li>{t("block.use_case_3")}</li>
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
          {t("block.result_blocks")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.blocksWithWaste}
        </div>
        <div className="text-lg text-foreground-70">
          {t("block.blocks")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({result.blocksNeeded} {t("block.without_waste")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("block.details")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Wall Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Square className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("block.wall_area")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.wallArea).toFixed(2)} m²
            </div>
          </div>

          {/* Mortar Volume */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("block.mortar_volume")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.mortarVolume).toFixed(3)} m³
            </div>
          </div>

          {/* Mortar Bags */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Box className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("block.mortar_bags")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.mortarBags}</div>
          </div>

          {/* Extra Blocks */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Box className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("block.extra_blocks")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.extraBlocks} {t("block.blocks")}
            </div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("block.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("block.formula")}
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
      title={t("block.title")}
      description={t("block.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.blocksWithWaste}
      results={result}
    />
  );
}
