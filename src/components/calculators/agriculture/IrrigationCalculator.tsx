'use client';

/**
 * ALATHASIBA - IRRIGATION CALCULATOR
 * Calculate water needs for crops
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Droplets, Scale, Clock, DollarSign } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface IrrigationResult {
  waterNeededGallons: number;
  waterNeededLiters: number;
  waterNeededAcreFeet: number;
  irrigationTime: number;
  costEstimate: number;
}

export default function IrrigationCalculator() {
  const { t } = useTranslation(['calc/agriculture', 'common']);
  const [area, setArea] = useState<string>('');
  const [cropType, setCropType] = useState<string>('corn');
  const [climate, setClimate] = useState<string>('moderate');
  const [growthStage, setGrowthStage] = useState<string>('vegetative');
  const [result, setResult] = useState<IrrigationResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => { initDateInputRTL(); }, []);

  const validateInputs = (): boolean => {
    setError('');
    const areaValue = parseFloat(area);
    if (isNaN(areaValue)) {
      setError(t("irrigation.error_invalid_input"));
      return false;
    }
    if (areaValue <= 0) {
      setError(t("irrigation.error_positive_required"));
      return false;
    }
    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;
    setShowResult(false);

    setTimeout(() => {
      try {
        const areaValue = parseFloat(area);
        const cropWaterRate = cropType === 'corn' ? 1.5 : cropType === 'wheat' ? 1.2 : 1.0;
        const climateMultiplier = climate === 'hot' ? 1.3 : climate === 'moderate' ? 1.0 : 0.8;
        const stageMultiplier = growthStage === 'vegetative' ? 1.2 : growthStage === 'flowering' ? 1.5 : 1.0;

        const inchesNeeded = cropWaterRate * climateMultiplier * stageMultiplier;
        const waterNeededAcreFeet = (inchesNeeded / 12) * areaValue;
        const waterNeededGallons = waterNeededAcreFeet * 325851;
        const waterNeededLiters = waterNeededGallons * 3.78541;
        const flowRate = 500; // gallons per minute
        const irrigationTime = waterNeededGallons / flowRate;
        const costEstimate = waterNeededGallons * 0.002;

        setResult({
          waterNeededGallons,
          waterNeededLiters,
          waterNeededAcreFeet,
          irrigationTime,
          costEstimate,
        });
        setShowResult(true);
        setError('');
      } catch (err) {
        setError(t("irrigation.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setArea('');
      setCropType('corn');
      setClimate('moderate');
      setGrowthStage('vegetative');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 1 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const cropOptions = [
    { value: 'corn', label: t("irrigation.crop_corn") },
    { value: 'wheat', label: t("irrigation.crop_wheat") },
    { value: 'vegetables', label: t("irrigation.crop_vegetables") },
  ];

  const climateOptions = [
    { value: 'hot', label: t("irrigation.climate_hot") },
    { value: 'moderate', label: t("irrigation.climate_moderate") },
    { value: 'cool', label: t("irrigation.climate_cool") },
  ];

  const stageOptions = [
    { value: 'vegetative', label: t("irrigation.stage_vegetative") },
    { value: 'flowering', label: t("irrigation.stage_flowering") },
    { value: 'maturity', label: t("irrigation.stage_maturity") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("irrigation.title")}
      </div>
      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("irrigation.area_label")} tooltip={t("irrigation.area_tooltip")}>
          <NumberInput
            value={area}
            onValueChange={(val) => setArea(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("irrigation.area_placeholder")}
            min={0}
            startIcon={<Scale className="h-4 w-4" />}
          />
        </FormField>
        <FormField label={t("irrigation.crop_type_label")} tooltip={t("irrigation.crop_type_tooltip")}>
          <Combobox
            options={cropOptions}
            value={cropType}
            onChange={(val) => setCropType(val)}
            placeholder={t("irrigation.crop_type_label")}
          />
        </FormField>
        <FormField label={t("irrigation.climate_label")} tooltip={t("irrigation.climate_tooltip")}>
          <Combobox
            options={climateOptions}
            value={climate}
            onChange={(val) => setClimate(val)}
            placeholder={t("irrigation.climate_label")}
          />
        </FormField>
        <FormField label={t("irrigation.growth_stage_label")} tooltip={t("irrigation.growth_stage_tooltip")}>
          <Combobox
            options={stageOptions}
            value={growthStage}
            onChange={(val) => setGrowthStage(val)}
            placeholder={t("irrigation.growth_stage_label")}
          />
        </FormField>
      </div>
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>
      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t("irrigation.info_title")}</h2>
          <p className="text-foreground-70">{t("irrigation.info_description")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("irrigation.result_label")}</div>
        <div className="text-4xl font-bold text-primary mb-2" dir="ltr">{formatNumber(result.waterNeededGallons)}</div>
        <div className="text-lg text-foreground-70">{t("irrigation.result_gallons")}</div>
      </div>
      <div className="divider my-6"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2 flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            {t("irrigation.liters")}
          </div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{formatNumber(result.waterNeededLiters)}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2 flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            {t("irrigation.acre_feet")}
          </div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{result.waterNeededAcreFeet.toFixed(2)}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            {t("irrigation.irrigation_time")}
          </div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{formatNumber(result.irrigationTime)} {t("irrigation.unit_min")}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            {t("irrigation.cost_estimate")}
          </div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{t("common:units.currencySymbol")}{formatNumber(result.costEstimate)}</div>
        </div>
      </div>
    </div>
  ) : null;

  return <CalculatorLayout title={t("irrigation.title")} description={t("irrigation.description")} inputSection={inputSection} resultSection={resultSection} className="rtl" />;
}
