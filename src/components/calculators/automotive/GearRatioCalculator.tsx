'use client';

/**
 * GEAR RATIO CALCULATOR
 *
 * Calculates gear ratios, speed ratios, torque ratios for simple and compound gear trains.
 * Supports multiple gear stages and provides mechanical advantage analysis.
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, RotateCcw, Gauge, Zap, Info, Calculator, Activity, Hash, Percent } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface GearRatioResult {
  gearRatio: number;
  speedRatio: number;
  torqueRatio: number;
  outputSpeed: number; // RPM
  outputTorque: number; // N·m
  mechanicalAdvantage: number;
  gearType: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const DEFAULT_EFFICIENCY = 0.95; // 95% efficiency for gear transmission

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function GearRatioCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation('calc/automotive');
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [gearType, setGearType] = useState<string>('simple');
  const [drivingTeeth, setDrivingTeeth] = useState<string>('');
  const [drivenTeeth, setDrivenTeeth] = useState<string>('');
  const [inputSpeed, setInputSpeed] = useState<string>('');
  const [inputTorque, setInputTorque] = useState<string>('');

  // For compound gears
  const [stage2DrivingTeeth, setStage2DrivingTeeth] = useState<string>('');
  const [stage2DrivenTeeth, setStage2DrivenTeeth] = useState<string>('');
  const [stage3DrivingTeeth, setStage3DrivingTeeth] = useState<string>('');
  const [stage3DrivenTeeth, setStage3DrivenTeeth] = useState<string>('');
  const [numStages, setNumStages] = useState<string>('1');

  const [efficiency, setEfficiency] = useState<string>('95');

  // Result state
  const [result, setResult] = useState<GearRatioResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    initDateInputRTL();
  }, []);

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const drivingVal = parseInt(drivingTeeth);
    const drivenVal = parseInt(drivenTeeth);
    const speedVal = parseFloat(inputSpeed);
    const torqueVal = parseFloat(inputTorque);
    const effVal = parseFloat(efficiency);

    if (isNaN(drivingVal) || isNaN(drivenVal) || isNaN(speedVal) || isNaN(torqueVal) || isNaN(effVal)) {
      setError(t("common.errors.invalid"));
      return false;
    }

    if (drivingVal <= 0 || drivenVal <= 0 || speedVal <= 0 || torqueVal <= 0 || effVal <= 0 || effVal > 100) {
      setError(t("common.errors.positiveNumber"));
      return false;
    }

    const stages = parseInt(numStages);
    if (gearType === 'compound') {
      if (stages >= 2) {
        const s2DrivingVal = parseInt(stage2DrivingTeeth);
        const s2DrivenVal = parseInt(stage2DrivenTeeth);
        if (isNaN(s2DrivingVal) || isNaN(s2DrivenVal) || s2DrivingVal <= 0 || s2DrivenVal <= 0) {
          setError(t("gear.invalid_stage2"));
          return false;
        }
      }
      if (stages >= 3) {
        const s3DrivingVal = parseInt(stage3DrivingTeeth);
        const s3DrivenVal = parseInt(stage3DrivenTeeth);
        if (isNaN(s3DrivingVal) || isNaN(s3DrivenVal) || s3DrivingVal <= 0 || s3DrivenVal <= 0) {
          setError(t("gear.invalid_stage3"));
          return false;
        }
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
        const N_driving = parseInt(drivingTeeth);
        const N_driven = parseInt(drivenTeeth);
        const inputSpeedVal = parseFloat(inputSpeed); // RPM
        const inputTorqueVal = parseFloat(inputTorque); // N·m
        const eff = parseFloat(efficiency) / 100;

        let totalGearRatio = 1;
        let gearTypeStr = '';

        if (gearType === 'simple') {
          // Simple gear train: GR = Driven / Driving
          totalGearRatio = N_driven / N_driving;
          gearTypeStr = t("gear.simple_train");
        } else {
          // Compound gear train
          const gr1 = N_driven / N_driving;
          let gr2 = 1;
          let gr3 = 1;

          const stages = parseInt(numStages);
          if (stages >= 2) {
            gr2 = parseInt(stage2DrivenTeeth) / parseInt(stage2DrivingTeeth);
          }
          if (stages >= 3) {
            gr3 = parseInt(stage3DrivenTeeth) / parseInt(stage3DrivingTeeth);
          }

          totalGearRatio = gr1 * gr2 * gr3;
          gearTypeStr = t("gear.compound_train");
        }

        // Speed Ratio = 1 / Gear Ratio (Output Speed = Input Speed / Gear Ratio)
        const speedRatio = 1 / totalGearRatio;
        const outputSpeed = inputSpeedVal / totalGearRatio;

        // Torque Ratio = Gear Ratio * Efficiency (Output Torque = Input Torque * Gear Ratio * Efficiency)
        const torqueRatio = totalGearRatio * eff;
        const outputTorque = inputTorqueVal * torqueRatio;

        // Mechanical Advantage = Output Torque / Input Torque (approx. Gear Ratio if efficiency is high)
        const mechanicalAdvantage = outputTorque / inputTorqueVal;

        setResult({
          gearRatio: totalGearRatio,
          speedRatio,
          torqueRatio,
          outputSpeed,
          outputTorque,
          mechanicalAdvantage,
          gearType: gearTypeStr
        });

        setShowResult(true);
      } catch (err) {
        setError(t("gear.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setGearType('simple');
      setDrivingTeeth('');
      setDrivenTeeth('');
      setInputSpeed('');
      setInputTorque('');
      setStage2DrivingTeeth('');
      setStage2DrivenTeeth('');
      setStage3DrivingTeeth('');
      setStage3DrivenTeeth('');
      setNumStages('1');
      setEfficiency('95');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const gearTypeOptions = [
    { value: 'simple', label: t("gear.simple") },
    { value: 'compound', label: t("gear.compound") },
  ];

  const numStagesOptions = [
    { value: '1', label: "1" },
    { value: '2', label: "2" },
    { value: '3', label: "3" },
  ];

  // ---------------------------------------------------------------------------
  // JSX RENDER
  // ---------------------------------------------------------------------------
  const inputSection = (
    <div>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("gear.title")}
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Gear Type Selection */}
        <FormField
          label={t("gear.type_label")}
          tooltip={t("gear.type_tooltip")}
        >
          <Combobox
            options={gearTypeOptions}
            value={gearType}
            onChange={(val) => setGearType(val)}
            placeholder={t("gear.type_label")}
          />
        </FormField>

        {/* Input Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label={t("gear.input_speed")}
            tooltip={t("gear.input_speed_tooltip")}
          >
            <NumberInput
              value={inputSpeed}
              onValueChange={(val) => { setInputSpeed(val.toString()); if (error) setError(''); }}
              onKeyPress={handleKeyPress}
              placeholder={t("gear.placeholders.speed")}
              min={0}
              startIcon={<Gauge className="h-4 w-4" />}
            />
          </FormField>

          <FormField
            label={t("gear.input_torque")}
            tooltip={t("gear.input_torque_tooltip")}
          >
            <NumberInput
              value={inputTorque}
              onValueChange={(val) => { setInputTorque(val.toString()); if (error) setError(''); }}
              onKeyPress={handleKeyPress}
              placeholder={t("gear.placeholders.torque")}
              min={0}
              startIcon={<Zap className="h-4 w-4" />}
            />
          </FormField>
        </div>

        {/* Stage 1 Gears */}
        <div className="bg-card-bg border border-border rounded-lg p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            {t("gear.stage1_title")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label={t("gear.driving_teeth")}
              tooltip={t("gear.driving_teeth_tooltip")}
            >
              <NumberInput
                value={drivingTeeth}
                onValueChange={(val) => { setDrivingTeeth(val.toString()); if (error) setError(''); }}
                onKeyPress={handleKeyPress}
                placeholder={t("gear.placeholders.teeth")}
                min={1}
                step={1}
                startIcon={<Settings className="h-4 w-4" />}
              />
            </FormField>

            <FormField
              label={t("gear.driven_teeth")}
              tooltip={t("gear.driven_teeth_tooltip")}
            >
              <NumberInput
                value={drivenTeeth}
                onValueChange={(val) => { setDrivenTeeth(val.toString()); if (error) setError(''); }}
                onKeyPress={handleKeyPress}
                placeholder={t("gear.placeholders.teeth")}
                min={1}
                step={1}
                startIcon={<Settings className="h-4 w-4" />}
              />
            </FormField>
          </div>
        </div>

        {/* Compound Gear Stages */}
        {gearType === 'compound' && (
          <div>
            <FormField
              label={t("gear.num_stages")}
              tooltip={t("gear.num_stages_tooltip")}
            >
              <Combobox
                options={numStagesOptions}
                value={numStages}
                onChange={(val) => setNumStages(val)}
                placeholder={t("gear.num_stages")}
              />
            </FormField>

            {parseInt(numStages) >= 2 && (
              <div className="p-4 border border-border rounded-lg bg-card animate-fadeIn">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" />
                  {t("gear.stage2_title")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label={t("gear.stage2_driving")}
                    tooltip={t("gear.driving_teeth_tooltip")}
                  >
                    <NumberInput
                      value={stage2DrivingTeeth}
                      onValueChange={(val) => setStage2DrivingTeeth(val.toString())}
                      onKeyPress={handleKeyPress}
                      placeholder={t("gear.placeholders.teeth")}
                      min={1}
                      step={1}
                      startIcon={<Settings className="h-4 w-4" />}
                    />
                  </FormField>

                  <FormField
                    label={t("gear.stage2_driven")}
                    tooltip={t("gear.driven_teeth_tooltip")}
                  >
                    <NumberInput
                      value={stage2DrivenTeeth}
                      onValueChange={(val) => setStage2DrivenTeeth(val.toString())}
                      onKeyPress={handleKeyPress}
                      placeholder={t("gear.placeholders.teeth")}
                      min={1}
                      step={1}
                      startIcon={<Settings className="h-4 w-4" />}
                    />
                  </FormField>
                </div>
              </div>
            )}

            {parseInt(numStages) >= 3 && (
              <div className="p-4 border border-border rounded-lg bg-card animate-fadeIn">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" />
                  {t("gear.stage3_title")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label={t("gear.stage3_driving")}
                    tooltip={t("gear.driving_teeth_tooltip")}
                  >
                    <NumberInput
                      value={stage3DrivingTeeth}
                      onValueChange={(val) => setStage3DrivingTeeth(val.toString())}
                      onKeyPress={handleKeyPress}
                      placeholder={t("gear.placeholders.teeth")}
                      min={1}
                      step={1}
                      startIcon={<Settings className="h-4 w-4" />}
                    />
                  </FormField>

                  <FormField
                    label={t("gear.stage3_driven")}
                    tooltip={t("gear.driven_teeth_tooltip")}
                  >
                    <NumberInput
                      value={stage3DrivenTeeth}
                      onValueChange={(val) => setStage3DrivenTeeth(val.toString())}
                      onKeyPress={handleKeyPress}
                      placeholder={t("gear.placeholders.teeth")}
                      min={1}
                      step={1}
                      startIcon={<Settings className="h-4 w-4" />}
                    />
                  </FormField>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Efficiency */}
        <FormField
          label={t("gear.efficiency")}
          tooltip={t("gear.efficiency_tooltip")}
        >
          <NumberInput
            value={efficiency}
            onValueChange={(val) => setEfficiency(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder="95"
            min={0}
            max={100}
            step={1}
            startIcon={<Percent className="h-4 w-4" />}
          />
        </FormField>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button
          onClick={calculate}
          className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Calculator className="w-5 h-5 ml-1" />
          {t("common.calculate")}
        </button>

        <button
          onClick={resetCalculator}
          className="outline-button flex items-center justify-center"
        >
          <RotateCcw className="w-5 h-5 ml-1" />
          {t("common.reset")}
        </button>
      </div>

      {error && (
        <div className="text-error mt-4 p-3 bg-error/10 rounded-lg border border-error/20 flex items-center animate-fadeIn max-w-md mx-auto">
          <Info className="w-5 h-5 ml-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Information Section */}
      {!result && (
        <div>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("gear.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("gear.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("gear.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("gear.use_case_1")}</li>
              <li>{t("gear.use_case_2")}</li>
              <li>{t("gear.use_case_3")}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">

      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("gear.gear_ratio")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.gearRatio).toFixed(2)}:1
        </div>
        <div className="text-lg text-foreground-70">
          {result.gearType}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("gear.output_parameters")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Gauge className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("gear.output_speed")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{(result.outputSpeed).toFixed(2)}</div>
            <div className="text-sm text-foreground-70">{t("gear.rpm")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("gear.output_torque")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{(result.outputTorque).toFixed(2)}</div>
            <div className="text-sm text-foreground-70">{t("gear.nm")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Activity className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("gear.speed_ratio")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{(result.speedRatio).toFixed(2)}:1</div>
            <div className="text-sm text-foreground-70">{t("gear.dimensionless")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Hash className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("gear.mechanical_advantage")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{(result.mechanicalAdvantage).toFixed(2)}</div>
            <div className="text-sm text-foreground-70">{t("gear.dimensionless")}</div>
          </div>

        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("gear.formulas_used")}</h4>
            <p className="text-sm text-foreground-70 font-mono">
              GR = N_driven/N_driving, n_out = n_in/GR, T_out = T_in × GR × η
            </p>
          </div>
        </div>
      </div>

    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("gear.title")}
      description={t("gear.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
