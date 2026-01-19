'use client';

/**
 * WALL AREA CALCULATOR
 *
 * Calculates wall area minus openings (windows and doors).
 *
 * Formulas:
 * - Gross Wall Area = Wall Length × Wall Height
 * - Window Area = Window Width × Window Height × Number of Windows
 * - Door Area = Door Width × Door Height × Number of Doors
 * - Net Wall Area = Gross Area - Window Areas - Door Areas
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Square, Minus, Plus, Info, DoorOpen } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface WallAreaResult {
  grossArea: number;
  windowArea: number;
  doorArea: number;
  netArea: number;
  openingsPercentage: number;
  perimeter: number;
}

interface Opening {
  id: number;
  width: string;
  height: string;
  quantity: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const STANDARD_WINDOW = { width: 1.2, height: 1.5 }; // meters
const STANDARD_DOOR = { width: 0.9, height: 2.1 }; // meters

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function WallAreaCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [wallLength, setWallLength] = useState<string>('');
  const [wallHeight, setWallHeight] = useState<string>('');
  const [unit, setUnit] = useState<string>('meters');

  // Windows state
  const [windows, setWindows] = useState<Opening[]>([
    { id: 1, width: '', height: '', quantity: '' }
  ]);

  // Doors state
  const [doors, setDoors] = useState<Opening[]>([
    { id: 1, width: '', height: '', quantity: '' }
  ]);

  // Result state
  const [result, setResult] = useState<WallAreaResult | null>(null);

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

    if (isNaN(length) || isNaN(height)) {
      setError(t("wallArea.errors.invalid_dimensions"));
      return false;
    }

    if (length <= 0 || height <= 0) {
      setError(t("wallArea.errors.positive_values"));
      return false;
    }

    return true;
  };

  // ---------------------------------------------------------------------------
  // OPENING MANAGEMENT
  // ---------------------------------------------------------------------------
  const addWindow = () => {
    const newId = windows.length > 0 ? Math.max(...windows.map(w => w.id)) + 1 : 1;
    setWindows([...windows, { id: newId, width: '', height: '', quantity: '' }]);
  };

  const removeWindow = (id: number) => {
    if (windows.length > 1) {
      setWindows(windows.filter(w => w.id !== id));
    }
  };

  const updateWindow = (id: number, field: keyof Opening, value: string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, [field]: value } : w));
    if (error) setError('');
  };

  const addDoor = () => {
    const newId = doors.length > 0 ? Math.max(...doors.map(d => d.id)) + 1 : 1;
    setDoors([...doors, { id: newId, width: '', height: '', quantity: '' }]);
  };

  const removeDoor = (id: number) => {
    if (doors.length > 1) {
      setDoors(doors.filter(d => d.id !== id));
    }
  };

  const updateDoor = (id: number, field: keyof Opening, value: string) => {
    setDoors(doors.map(d => d.id === id ? { ...d, [field]: value } : d));
    if (error) setError('');
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

        // Convert to meters if input is in feet
        const conversionFactor = unit === 'feet' ? 0.3048 : 1;
        length = length * conversionFactor;
        height = height * conversionFactor;

        // Calculate gross wall area
        const grossArea = length * height;

        // Calculate total window area
        let windowArea = 0;
        windows.forEach(window => {
          const w = parseFloat(window.width) * conversionFactor || 0;
          const h = parseFloat(window.height) * conversionFactor || 0;
          const qty = parseInt(window.quantity) || 0;
          windowArea += w * h * qty;
        });

        // Calculate total door area
        let doorArea = 0;
        doors.forEach(door => {
          const w = parseFloat(door.width) * conversionFactor || 0;
          const h = parseFloat(door.height) * conversionFactor || 0;
          const qty = parseInt(door.quantity) || 0;
          doorArea += w * h * qty;
        });

        // Calculate net wall area
        const netArea = Math.max(0, grossArea - windowArea - doorArea);

        // Calculate openings percentage
        const openingsPercentage = ((windowArea + doorArea) / grossArea) * 100;

        // Calculate perimeter (for trim/molding estimation)
        const perimeter = 2 * (length + height);

        setResult({
          grossArea,
          windowArea,
          doorArea,
          netArea,
          openingsPercentage,
          perimeter
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
      setUnit('meters');
      setWindows([{ id: 1, width: '', height: '', quantity: '' }]);
      setDoors([{ id: 1, width: '', height: '', quantity: '' }]);
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
          label={t("wallArea.unit")}
          tooltip={t("wallArea.unit_tooltip")}
        >
          <Combobox
            options={[
              { value: 'meters', label: t("wallArea.meters") },
              { value: 'feet', label: t("wallArea.feet") }
            ]}
            value={unit}
            onChange={setUnit}
          />
        </InputContainer>

        {/* Wall Length */}
        <InputContainer
          label={t("wallArea.wall_length")}
          tooltip={t("wallArea.wall_length_tooltip")}
        >
          <NumberInput
            value={wallLength}
            onValueChange={(val) => {
              setWallLength(val.toString());
              if (error) setError('');
            }}
            placeholder={t("wallArea.placeholders.wall_length")}
            step={0.1}
            min={0}
          />
        </InputContainer>

        {/* Wall Height */}
        <InputContainer
          label={t("wallArea.wall_height")}
          tooltip={t("wallArea.wall_height_tooltip")}
        >
          <NumberInput
            value={wallHeight}
            onValueChange={(val) => {
              setWallHeight(val.toString());
              if (error) setError('');
            }}
            placeholder={t("wallArea.placeholders.wall_height")}
            step={0.1}
            min={0}
          />
        </InputContainer>
      </div>

      {/* Windows Section */}
      <div className="max-w-md mx-auto mt-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-lg">{t("wallArea.windows")}</h3>
          <button
            type="button"
            onClick={addWindow}
            className="flex items-center text-sm text-primary hover:text-primary/80"
          >
            <Plus className="w-4 h-4 mr-1" />
            {t("wallArea.add_window")}
          </button>
        </div>

        {windows.map((window, index) => (
          <div key={window.id} className="bg-card p-4 rounded-lg border border-border mb-3">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-sm">{t("wallArea.window")} {index + 1}</span>
              {windows.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeWindow(window.id)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-foreground-70 block mb-1">{t("wallArea.width")}</label>
                <NumberInput
                  value={window.width}
                  onValueChange={(val) => updateWindow(window.id, 'width', val.toString())}
                  placeholder={STANDARD_WINDOW.width.toString()}
                  min={0}
                  step={0.1}
                />
              </div>
              <div>
                <label className="text-xs text-foreground-70 block mb-1">{t("wallArea.height")}</label>
                <NumberInput
                  value={window.height}
                  onValueChange={(val) => updateWindow(window.id, 'height', val.toString())}
                  placeholder={STANDARD_WINDOW.height.toString()}
                  min={0}
                  step={0.1}
                />
              </div>
              <div>
                <label className="text-xs text-foreground-70 block mb-1">{t("wallArea.quantity")}</label>
                <NumberInput
                  value={window.quantity}
                  onValueChange={(val) => updateWindow(window.id, 'quantity', val.toString())}
                  placeholder={t("placeholders.quantity")}
                  min={0}
                  step={1}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Doors Section */}
      <div className="max-w-md mx-auto mt-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-lg">{t("wallArea.doors")}</h3>
          <button
            type="button"
            onClick={addDoor}
            className="flex items-center text-sm text-primary hover:text-primary/80"
          >
            <Plus className="w-4 h-4 mr-1" />
            {t("wallArea.add_door")}
          </button>
        </div>

        {doors.map((door, index) => (
          <div key={door.id} className="bg-card p-4 rounded-lg border border-border mb-3">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-sm">{t("wallArea.door")} {index + 1}</span>
              {doors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDoor(door.id)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-foreground-70 block mb-1">{t("wallArea.width")}</label>
                <NumberInput
                  value={door.width}
                  onValueChange={(val) => updateDoor(door.id, 'width', val.toString())}
                  placeholder={STANDARD_DOOR.width.toString()}
                  min={0}
                  step={0.1}
                />
              </div>
              <div>
                <label className="text-xs text-foreground-70 block mb-1">{t("wallArea.height")}</label>
                <NumberInput
                  value={door.height}
                  onValueChange={(val) => updateDoor(door.id, 'height', val.toString())}
                  placeholder={STANDARD_DOOR.height.toString()}
                  min={0}
                  step={0.1}
                />
              </div>
              <div>
                <label className="text-xs text-foreground-70 block mb-1">{t("wallArea.quantity")}</label>
                <NumberInput
                  value={door.quantity}
                  onValueChange={(val) => updateDoor(door.id, 'quantity', val.toString())}
                  placeholder={t("placeholders.quantity")}
                  min={0}
                  step={1}
                />
              </div>
            </div>
          </div>
        ))}
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
              {t("wallArea.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("wallArea.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("wallArea.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("wallArea.use_case_1")}</li>
              <li>{t("wallArea.use_case_2")}</li>
              <li>{t("wallArea.use_case_3")}</li>
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
          {t("wallArea.result_net_area")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.netArea).toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("wallArea.square_meters")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({(result.netArea * 10.764).toFixed(2)} {t("wallArea.square_feet")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("wallArea.breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Gross Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Square className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("wallArea.gross_area")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{(result.grossArea).toFixed(2)} m²</div>
          </div>

          {/* Window Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Square className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("wallArea.window_area")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              -{(result.windowArea).toFixed(2)} m²
            </div>
          </div>

          {/* Door Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DoorOpen className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("wallArea.door_area")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              -{(result.doorArea).toFixed(2)} m²
            </div>
          </div>

          {/* Openings Percentage */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Minus className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("wallArea.openings_percentage")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.openingsPercentage).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Perimeter */}
      <div className="mt-4 p-4 bg-card rounded-lg border border-border">
        <div className="flex justify-between items-center">
          <span className="font-medium">{t("wallArea.perimeter")}</span>
          <span className="text-lg font-bold text-primary">{(result.perimeter).toFixed(2)} m</span>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("wallArea.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("wallArea.formula")}
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
      title={t("wallArea.title")}
      description={t("wallArea.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.netArea}
      results={result}
    />
  );
}
