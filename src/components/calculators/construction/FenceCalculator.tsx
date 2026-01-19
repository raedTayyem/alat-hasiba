'use client';

/**
 * FENCE CALCULATOR
 *
 * Calculates fence materials including posts, panels, and rails needed
 * for fence installation projects.
 *
 * Formulas:
 * - Posts = (Fence Length / Post Spacing) + 1
 * - Panels = Fence Length / Panel Width
 * - Rails per Section = 2-3 (depending on height)
 * - Total Rails = (Posts - 1) × Rails per Section
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Columns, Info, Ruler, LayoutGrid } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface FenceResult {
  totalPosts: number;
  totalPanels: number;
  totalRails: number;
  railsPerSection: number;
  fenceAreaSqM: number;
  fenceAreaSqFt: number;
  postHoleDepth: number;
  concretePerPost: number;
  totalConcrete: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const CONCRETE_PER_POST_CUBIC_FT = 0.5; // cubic feet of concrete per post hole
const METERS_TO_FEET = 3.28084;

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function FenceCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [fenceLength, setFenceLength] = useState<string>('');
  const [fenceHeight, setFenceHeight] = useState<string>('');
  const [postSpacing, setPostSpacing] = useState<string>('2.4');
  const [panelWidth, setPanelWidth] = useState<string>('1.8');
  const [unit, setUnit] = useState<string>('meters');

  // Result state
  const [result, setResult] = useState<FenceResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const length = parseFloat(fenceLength);
    const height = parseFloat(fenceHeight);
    const spacing = parseFloat(postSpacing);
    const panel = parseFloat(panelWidth);

    if (isNaN(length) || isNaN(height)) {
      setError(t("fence.errors.invalid_dimensions"));
      return false;
    }

    if (length <= 0 || height <= 0) {
      setError(t("fence.errors.positive_values"));
      return false;
    }

    if (isNaN(spacing) || spacing <= 0) {
      setError(t("fence.errors.invalid_spacing"));
      return false;
    }

    if (isNaN(panel) || panel <= 0) {
      setError(t("fence.errors.invalid_panel_width"));
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
        let length = parseFloat(fenceLength);
        let height = parseFloat(fenceHeight);
        let spacing = parseFloat(postSpacing);
        let panel = parseFloat(panelWidth);

        // Convert to meters if input is in feet
        if (unit === 'feet') {
          length = length / METERS_TO_FEET;
          height = height / METERS_TO_FEET;
          spacing = spacing / METERS_TO_FEET;
          panel = panel / METERS_TO_FEET;
        }

        // Calculate number of posts (fence length / spacing + 1 for end post)
        const totalPosts = Math.ceil(length / spacing) + 1;

        // Calculate number of panels
        const totalPanels = Math.ceil(length / panel);

        // Determine rails per section based on fence height
        // Standard: 2 rails for heights < 1.2m, 3 rails for taller fences
        const railsPerSection = height < 1.2 ? 2 : 3;

        // Total rails = number of sections × rails per section
        const totalRails = (totalPosts - 1) * railsPerSection;

        // Calculate fence area
        const fenceAreaSqM = length * height;
        const fenceAreaSqFt = fenceAreaSqM * (METERS_TO_FEET * METERS_TO_FEET);

        // Post hole depth recommendation (1/3 of total post length above + below ground)
        // Typically post in ground = fence height / 3 or minimum 0.6m
        const postHoleDepth = Math.max(height / 3, 0.6);

        // Concrete per post in cubic meters (converted from cubic feet)
        const concretePerPost = CONCRETE_PER_POST_CUBIC_FT * 0.0283168;

        // Total concrete needed
        const totalConcrete = totalPosts * concretePerPost;

        setResult({
          totalPosts,
          totalPanels,
          totalRails,
          railsPerSection,
          fenceAreaSqM,
          fenceAreaSqFt,
          postHoleDepth,
          concretePerPost,
          totalConcrete
        });

        setShowResult(true);
      } catch (err) {
        setError(t("common:common.errors.calculationError"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setFenceLength('');
      setFenceHeight('');
      setPostSpacing('2.4');
      setPanelWidth('1.8');
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
          label={t("fence.unit")}
          tooltip={t("fence.unit_tooltip")}
        >
          <Combobox
            options={[
              { value: 'meters', label: t("fence.meters") },
              { value: 'feet', label: t("fence.feet") }
            ]}
            value={unit}
            onChange={setUnit}
          />
        </InputContainer>

        {/* Fence Length */}
        <InputContainer
          label={t("fence.fence_length")}
          tooltip={t("fence.fence_length_tooltip")}
        >
          <NumberInput
            value={fenceLength}
            onValueChange={(value) => {
                setFenceLength(String(value));
                if (error) setError('');
              }}
            placeholder={t("fence.placeholders.fence_length")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        {/* Fence Height */}
        <InputContainer
          label={t("fence.fence_height")}
          tooltip={t("fence.fence_height_tooltip")}
        >
          <NumberInput
            value={fenceHeight}
            onValueChange={(value) => {
                setFenceHeight(String(value));
                if (error) setError('');
              }}
            placeholder={t("fence.placeholders.fence_height")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        {/* Post Spacing */}
        <InputContainer
          label={t("fence.post_spacing")}
          tooltip={t("fence.post_spacing_tooltip")}
        >
          <NumberInput
            value={postSpacing}
            onValueChange={(value) => {
                setPostSpacing(String(value));
                if (error) setError('');
              }}
            placeholder={t("fence.placeholders.post_spacing")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        {/* Panel Width */}
        <InputContainer
          label={t("fence.panel_width")}
          tooltip={t("fence.panel_width_tooltip")}
        >
          <NumberInput
            value={panelWidth}
            onValueChange={(value) => {
                setPanelWidth(String(value));
                if (error) setError('');
              }}
            placeholder={t("fence.placeholders.panel_width")}
            min={0}
            step={0.1}
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
              {t("fence.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("fence.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("fence.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("fence.use_case_1")}</li>
              <li>{t("fence.use_case_2")}</li>
              <li>{t("fence.use_case_3")}</li>
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
          {t("fence.result_posts")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.totalPosts}
        </div>
        <div className="text-lg text-foreground-70">
          {t("fence.posts_unit")}
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Materials Breakdown */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("fence.materials_breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Total Panels */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <LayoutGrid className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("fence.total_panels")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.totalPanels}</div>
          </div>

          {/* Total Rails */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("fence.total_rails")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.totalRails}</div>
            <div className="text-sm text-foreground-70">
              ({result.railsPerSection} {t("fence.rails_per_section")})
            </div>
          </div>

          {/* Fence Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Columns className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("fence.fence_area")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.fenceAreaSqM.toFixed(2)} {t("fence.sq_meters")}
            </div>
            <div className="text-sm text-foreground-70">
              ({result.fenceAreaSqFt.toFixed(2)} {t("fence.sq_feet")})
            </div>
          </div>

          {/* Concrete Needed */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Columns className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("fence.concrete_needed")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.totalConcrete.toFixed(3)} {t("fence.cubic_meters")}
            </div>
          </div>
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Installation Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("fence.installation_details")}
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <span className="text-foreground-70">{t("fence.post_hole_depth")}</span>
            <span className="font-medium">{result.postHoleDepth.toFixed(2)} {t("fence.meters_short")}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <span className="text-foreground-70">{t("fence.concrete_per_post")}</span>
            <span className="font-medium">{result.concretePerPost.toFixed(4)} {t("fence.cubic_meters")}</span>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("fence.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("fence.formula")}
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
      title={t("fence.title")}
      description={t("fence.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.totalPosts}
      results={result}
    />
  );
}
