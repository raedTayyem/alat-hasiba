'use client';

/**
 * ALATHASIBA - SEED RATE CALCULATOR
 * Calculate seeds needed per acre based on crop type and spacing
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, Ruler, Scale, Percent, Info, Map } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface SeedRateResult {
  seedsNeeded: number;
  poundsNeeded: number;
  kilogramsNeeded: number;
  seedsPerSquareMeter: number;
  seedsPerSquareFoot: number;
}

const CROP_SEED_WEIGHTS: Record<string, number> = {
  corn: 0.35, // grams per seed
  wheat: 0.04,
  soybean: 0.18,
  rice: 0.025,
  cotton: 0.12,
  sunflower: 0.06,
  custom: 0.1,
};

export default function SeedRateCalculator() {
  const { t, i18n } = useTranslation('calc/agriculture');
  const [area, setArea] = useState<string>('');
  const [areaUnit, setAreaUnit] = useState<string>('acres');
  const [cropType, setCropType] = useState<string>('corn');
  const [rowSpacing, setRowSpacing] = useState<string>('');
  const [plantSpacing, setPlantSpacing] = useState<string>('');
  const [germinationRate, setGerminationRate] = useState<string>('90');

  const [result, setResult] = useState<SeedRateResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const areaValue = parseFloat(area);
    const rowSpacingValue = parseFloat(rowSpacing);
    const plantSpacingValue = parseFloat(plantSpacing);
    const germinationValue = parseFloat(germinationRate);

    if (isNaN(areaValue) || isNaN(rowSpacingValue) || isNaN(plantSpacingValue) || isNaN(germinationValue)) {
      setError(t("seed_rate.error_invalid_input"));
      return false;
    }

    if (areaValue <= 0 || rowSpacingValue <= 0 || plantSpacingValue <= 0) {
      setError(t("seed_rate.error_positive_required"));
      return false;
    }

    if (germinationValue <= 0 || germinationValue > 100) {
      setError(t("seed_rate.error_germination_range"));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        let areaValue = parseFloat(area);
        const rowSpacingValue = parseFloat(rowSpacing);
        const plantSpacingValue = parseFloat(plantSpacing);
        const germinationValue = parseFloat(germinationRate);

        // Convert area to acres
        if (areaUnit === 'hectares') {
          areaValue = areaValue * 2.47105;
        } else if (areaUnit === 'squareMeters') {
          areaValue = areaValue * 0.000247105;
        }

        // Convert spacing to inches
        const rowSpacingInches = rowSpacingValue;
        const plantSpacingInches = plantSpacingValue;

        // Calculate plants per acre (43560 sq ft per acre, 144 sq in per sq ft)
        const squareInchesPerAcre = 43560 * 144;
        const plantsPerAcre = squareInchesPerAcre / (rowSpacingInches * plantSpacingInches);

        // Adjust for germination rate
        const seedsNeeded = (plantsPerAcre * areaValue) / (germinationValue / 100);

        // Calculate weight
        const seedWeight = CROP_SEED_WEIGHTS[cropType] || CROP_SEED_WEIGHTS.custom;
        const totalWeightGrams = seedsNeeded * seedWeight;
        const poundsNeeded = totalWeightGrams / 453.592;
        const kilogramsNeeded = totalWeightGrams / 1000;

        // Calculate per unit area
        const seedsPerSquareMeter = plantsPerAcre / 4046.86;
        const seedsPerSquareFoot = plantsPerAcre / 43560;

        setResult({
          seedsNeeded: Math.ceil(seedsNeeded),
          poundsNeeded,
          kilogramsNeeded,
          seedsPerSquareMeter,
          seedsPerSquareFoot,
        });

        setShowResult(true);
        setError('');
      } catch (err) {
        setError(t("seed_rate.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setArea('');
      setAreaUnit('acres');
      setCropType('corn');
      setRowSpacing('');
      setPlantSpacing('');
      setGerminationRate('90');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    if (Math.abs(num) < 0.01) return num.toFixed(4);
    if (Math.abs(num) < 1) return num.toFixed(3);
    if (Math.abs(num) < 100) return num.toFixed(2);
    return num.toLocaleString('en-US', { maximumFractionDigits: 1 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const cropOptions = [
    { value: 'corn', label: t("seed_rate.crop_corn") },
    { value: 'wheat', label: t("seed_rate.crop_wheat") },
    { value: 'soybean', label: t("seed_rate.crop_soybean") },
    { value: 'rice', label: t("seed_rate.crop_rice") },
    { value: 'cotton', label: t("seed_rate.crop_cotton") },
    { value: 'sunflower', label: t("seed_rate.crop_sunflower") },
    { value: 'custom', label: t("seed_rate.crop_custom") },
  ];

  const unitOptions = [
    { value: 'acres', label: t("seed_rate.unit_acres") },
    { value: 'hectares', label: t("seed_rate.unit_hectares") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("seed_rate.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("seed_rate.crop_type_label")} tooltip={t("seed_rate.crop_type_tooltip")}>
          <Combobox
            options={cropOptions}
            value={cropType}
            onChange={(val) => setCropType(val)}
            placeholder={t("seed_rate.crop_type_label")}
          />
        </FormField>

        <FormField label={t("seed_rate.area_label")} tooltip={t("seed_rate.area_tooltip")}>
          <div className="flex gap-2">
            <div className="flex-1">
              <NumberInput
                value={area}
                onValueChange={(val) => setArea(val.toString())}
                onKeyPress={handleKeyPress}
                placeholder={t("seed_rate.area_placeholder")}
                min={0}
                startIcon={<Map className="h-4 w-4" />}
              />
            </div>
            <div className="w-32">
              <Combobox
                options={unitOptions}
                value={areaUnit}
                onChange={(val) => setAreaUnit(val)}
                placeholder={t("seed_rate.unit_acres")}
              />
            </div>
          </div>
        </FormField>

        <FormField label={t("seed_rate.row_spacing_label")} tooltip={t("seed_rate.row_spacing_tooltip")}>
          <NumberInput
            value={rowSpacing}
            onValueChange={(val) => setRowSpacing(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("seed_rate.row_spacing_placeholder")}
            min={0}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("seed_rate.plant_spacing_label")} tooltip={t("seed_rate.plant_spacing_tooltip")}>
          <NumberInput
            value={plantSpacing}
            onValueChange={(val) => setPlantSpacing(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("seed_rate.plant_spacing_placeholder")}
            min={0}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("seed_rate.germination_label")} tooltip={t("seed_rate.germination_tooltip")}>
          <NumberInput
            value={germinationRate}
            onValueChange={(val) => setGerminationRate(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("seed_rate.germination_placeholder")}
            min={0}
            max={100}
            startIcon={<Percent className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("seed_rate.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("seed_rate.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("seed_rate.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("seed_rate.use_case_1")}</li>
              <li>{t("seed_rate.use_case_2")}</li>
              <li>{t("seed_rate.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("seed_rate.result_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2" dir="ltr">
          {formatNumber(result.seedsNeeded)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("seed_rate.result_seeds")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("seed_rate.details_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Scale className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("seed_rate.weight_pounds")}</div>
            </div>
            <div className="text-sm text-foreground-70 font-mono" dir="ltr">
              {formatNumber(result.poundsNeeded)} {t("seed_rate.unit_lbs")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Scale className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("seed_rate.weight_kilograms")}</div>
            </div>
            <div className="text-sm text-foreground-70 font-mono" dir="ltr">
              {formatNumber(result.kilogramsNeeded)} {t("seed_rate.unit_kg")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Sprout className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("seed_rate.per_square_meter")}</div>
            </div>
            <div className="text-sm text-foreground-70 font-mono" dir="ltr">
              {formatNumber(result.seedsPerSquareMeter)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Sprout className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("seed_rate.per_square_foot")}</div>
            </div>
            <div className="text-sm text-foreground-70 font-mono" dir="ltr">
              {formatNumber(result.seedsPerSquareFoot)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("seed_rate.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("seed_rate.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("seed_rate.title")}
      description={t("seed_rate.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
