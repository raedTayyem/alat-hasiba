'use client';

/**
 * DECK CALCULATOR
 *
 * Calculates deck materials needed for outdoor projects.
 *
 * Formulas:
 * - Deck Area = Length × Width
 * - Decking Boards = Area / (Board Width × Board Length)
 * - Joists = (Length / Joist Spacing) + 1
 * - Posts = Based on beam span and load requirements
 * - Screws = ~350 per 100 sq ft of decking
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Ruler, Info, Layers, Square } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface DeckResult {
  deckArea: number;
  deckAreaSqFt: number;
  deckingBoards: number;
  deckingBoardFeet: number;
  joists: number;
  joistBoardFeet: number;
  beams: number;
  posts: number;
  screws: number;
  screwBoxes: number;
  concreteFootings: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const DECKING_BOARD_SIZES: { [key: string]: { width: number; thickness: number; name: string } } = {
  '5/4x6': { width: 5.5, thickness: 1.0, name: '5/4x6' },   // Most common
  '2x6': { width: 5.5, thickness: 1.5, name: '2x6' },
  '2x4': { width: 3.5, thickness: 1.5, name: '2x4' },
  'composite': { width: 5.5, thickness: 1.0, name: 'composite' }
};

const JOIST_SPACING_OPTIONS = [12, 16, 24]; // inches on center
const SCREWS_PER_100_SQFT = 350;
const SCREWS_PER_BOX = 1000;
const POST_SPACING = 8; // feet (typical max beam span for residential)

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function DeckCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [deckLength, setDeckLength] = useState<string>('');
  const [deckWidth, setDeckWidth] = useState<string>('');
  const [boardSize, setBoardSize] = useState<string>('5/4x6');
  const [boardLength, setBoardLength] = useState<string>('12'); // feet
  const [joistSpacing, setJoistSpacing] = useState<string>('16');
  const [deckHeight, setDeckHeight] = useState<string>('3'); // feet
  const [wasteFactor, setWasteFactor] = useState<string>('10');
  const [unit, setUnit] = useState<string>('feet');

  // Result state
  const [result, setResult] = useState<DeckResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const length = parseFloat(deckLength);
    const width = parseFloat(deckWidth);
    const bLength = parseFloat(boardLength);
    const waste = parseFloat(wasteFactor);

    if (isNaN(length) || isNaN(width)) {
      setError(t("deck.errors.invalid_dimensions"));
      return false;
    }

    if (length <= 0 || width <= 0) {
      setError(t("deck.errors.positive_values"));
      return false;
    }

    if (isNaN(bLength) || bLength <= 0) {
      setError(t("deck.errors.invalid_board_length"));
      return false;
    }

    if (isNaN(waste) || waste < 0 || waste > 50) {
      setError(t("deck.errors.invalid_waste"));
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
        let length = parseFloat(deckLength);
        let width = parseFloat(deckWidth);
        let bLength = parseFloat(boardLength);
        const height = parseFloat(deckHeight) || 3;
        const jSpacing = parseFloat(joistSpacing);
        const waste = parseFloat(wasteFactor) / 100;

        // Convert to feet if input is in meters
        if (unit === 'meters') {
          length = length * 3.28084;
          width = width * 3.28084;
          bLength = bLength * 3.28084;
        }

        // Calculate deck area
        const deckAreaSqFt = length * width;
        const deckArea = unit === 'meters' ? deckAreaSqFt * 0.0929 : deckAreaSqFt;

        // Get board dimensions
        const board = DECKING_BOARD_SIZES[boardSize];
        const boardWidthFt = board.width / 12; // Convert inches to feet

        // Calculate decking boards needed
        // Boards run perpendicular to joists, so we calculate based on width
        const boardsPerRow = Math.ceil(length / bLength);
        const numberOfRows = Math.ceil(width / boardWidthFt);
        const deckingBoards = Math.ceil((boardsPerRow * numberOfRows) * (1 + waste));

        // Calculate board feet for decking
        const deckingBoardFeet = (deckingBoards * bLength * board.width * board.thickness) / 144;

        // Calculate joists (run perpendicular to decking)
        // Joists span the width, spaced along the length
        const joistSpacingFt = jSpacing / 12;
        const joists = Math.ceil(length / joistSpacingFt) + 1;
        const joistLengthFt = width;
        const joistBoardFeet = (joists * joistLengthFt * 9.25 * 1.5) / 144; // Assuming 2x10 joists

        // Calculate beams and posts
        // Beams run perpendicular to joists, posts support beams
        const beams = Math.ceil(width / POST_SPACING) + 1;
        const postsPerBeam = Math.ceil(length / POST_SPACING) + 1;
        const posts = beams * postsPerBeam;

        // Calculate screws
        const screws = Math.ceil((deckAreaSqFt / 100) * SCREWS_PER_100_SQFT * (1 + waste));
        const screwBoxes = Math.ceil(screws / SCREWS_PER_BOX);

        // Calculate concrete footings (one per post)
        const concreteFootings = posts;

        setResult({
          deckArea,
          deckAreaSqFt,
          deckingBoards,
          deckingBoardFeet,
          joists,
          joistBoardFeet,
          beams,
          posts,
          screws,
          screwBoxes,
          concreteFootings
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
      setDeckLength('');
      setDeckWidth('');
      setBoardSize('5/4x6');
      setBoardLength('12');
      setJoistSpacing('16');
      setDeckHeight('3');
      setWasteFactor('10');
      setUnit('feet');
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
          label={t("deck.unit")}
          tooltip={t("deck.unit_tooltip")}
        >
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="feet">{t("deck.feet")}</option>
            <option value="meters">{t("deck.meters")}</option>
          </select>
        </InputContainer>

        {/* Deck Length */}
        <InputContainer
          label={t("deck.deck_length")}
          tooltip={t("deck.deck_length_tooltip")}
        >
          <NumericInput
            value={deckLength}
            onChange={(e) => {
              setDeckLength(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("deck.placeholders.length")}
            min={0}
            step={0.5}
            unit={unit === 'meters' ? 'm' : 'ft'}
          />
        </InputContainer>

        {/* Deck Width */}
        <InputContainer
          label={t("deck.deck_width")}
          tooltip={t("deck.deck_width_tooltip")}
        >
          <NumericInput
            value={deckWidth}
            onChange={(e) => {
              setDeckWidth(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("deck.placeholders.width")}
            min={0}
            step={0.5}
            unit={unit === 'meters' ? 'm' : 'ft'}
          />
        </InputContainer>

        {/* Board Size */}
        <InputContainer
          label={t("deck.board_size")}
          tooltip={t("deck.board_size_tooltip")}
        >
          <select
            value={boardSize}
            onChange={(e) => setBoardSize(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="5/4x6">{t("deck.board_sizes.5_4x6")}</option>
            <option value="2x6">{t("deck.board_sizes.2x6")}</option>
            <option value="2x4">{t("deck.board_sizes.2x4")}</option>
            <option value="composite">{t("deck.board_sizes.composite")}</option>
          </select>
        </InputContainer>

        {/* Board Length */}
        <InputContainer
          label={t("deck.board_length")}
          tooltip={t("deck.board_length_tooltip")}
        >
          <select
            value={boardLength}
            onChange={(e) => setBoardLength(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="8">{t("deck.board_lengths.8ft")}</option>
            <option value="10">{t("deck.board_lengths.10ft")}</option>
            <option value="12">{t("deck.board_lengths.12ft")}</option>
            <option value="14">{t("deck.board_lengths.14ft")}</option>
            <option value="16">{t("deck.board_lengths.16ft")}</option>
          </select>
        </InputContainer>

        {/* Joist Spacing */}
        <InputContainer
          label={t("deck.joist_spacing")}
          tooltip={t("deck.joist_spacing_tooltip")}
        >
          <select
            value={joistSpacing}
            onChange={(e) => setJoistSpacing(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="12">{t("deck.joist_options.12")}</option>
            <option value="16">{t("deck.joist_options.16")}</option>
            <option value="24">{t("deck.joist_options.24")}</option>
          </select>
        </InputContainer>

        {/* Waste Factor */}
        <InputContainer
          label={t("deck.waste_factor")}
          tooltip={t("deck.waste_factor_tooltip")}
        >
          <NumericInput
            value={wasteFactor}
            onChange={(e) => {
              setWasteFactor(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("deck.placeholders.waste")}
            min={0}
            max={50}
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
              {t("deck.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("deck.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("deck.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("deck.use_case_1")}</li>
              <li>{t("deck.use_case_2")}</li>
              <li>{t("deck.use_case_3")}</li>
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
          {t("deck.result_area")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.deckAreaSqFt.toFixed(0)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("deck.sqft")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({(result.deckAreaSqFt * 0.0929).toFixed(2)} m²)
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Decking Materials */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("deck.decking_materials")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Decking Boards */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("deck.decking_boards")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.deckingBoards}</div>
            <div className="text-xs text-foreground-70">
              {result.deckingBoardFeet.toFixed(0)} {t("deck.board_feet")}
            </div>
          </div>

          {/* Joists */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("deck.joists")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.joists}</div>
            <div className="text-xs text-foreground-70">
              2x10 - {result.joistBoardFeet.toFixed(0)} {t("deck.board_feet")}
            </div>
          </div>

          {/* Posts */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Square className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("deck.posts")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.posts}</div>
            <div className="text-xs text-foreground-70">
              4x4 {t("deck.posts_label")}
            </div>
          </div>

          {/* Concrete Footings */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Package className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("deck.footings")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.concreteFootings}</div>
          </div>
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Hardware */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("deck.hardware")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Screws */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Package className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("deck.screws")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.screwBoxes}</div>
            <div className="text-xs text-foreground-70">
              {t("deck.boxes")} ({result.screws} {t("deck.screws_total")})
            </div>
          </div>

          {/* Beams */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("deck.beams")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.beams}</div>
            <div className="text-xs text-foreground-70">
              2x10 {t("deck.doubled")}
            </div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("deck.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("deck.formula")}
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
      title={t("deck.title")}
      description={t("deck.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.deckAreaSqFt}
      results={result}
    />
  );
}
