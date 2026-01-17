'use client';

/**
 * ALATHASIBA - PESTICIDE CALCULATOR
 * Calculate pesticide application rates
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Droplets, FlaskConical, Target, Scale } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface PesticideResult {
  pesticideNeeded: number;
  waterNeeded: number;
  sprayVolume: number;
  costEstimate: number;
  applicationRate: number;
}

export default function PesticideCalculator() {
  const { t } = useTranslation(['calc/agriculture', 'common']);
  const [area, setArea] = useState<string>('');
  const [pesticideType, setPesticideType] = useState<string>('herbicide');
  const [concentration, setConcentration] = useState<string>('');
  const [targetRate, setTargetRate] = useState<string>('');
  const [result, setResult] = useState<PesticideResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => { initDateInputRTL(); }, []);

  const validateInputs = (): boolean => {
    setError('');
    const areaValue = parseFloat(area);
    const concentrationValue = parseFloat(concentration);
    const targetValue = parseFloat(targetRate);
    if (isNaN(areaValue) || isNaN(concentrationValue) || isNaN(targetValue)) {
      setError(t("pesticide.error_invalid_input"));
      return false;
    }
    if (areaValue <= 0 || concentrationValue <= 0 || targetValue <= 0) {
      setError(t("pesticide.error_positive_required"));
      return false;
    }
    if (concentrationValue > 100) {
      setError(t("pesticide.error_concentration_range"));
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
        const concentrationValue = parseFloat(concentration);
        const targetValue = parseFloat(targetRate);

        const applicationRate = targetValue / (concentrationValue / 100);
        const pesticideNeeded = applicationRate * areaValue;
        const sprayVolume = 20 * areaValue; // 20 gallons per acre
        const waterNeeded = Math.max(0, sprayVolume - pesticideNeeded);
        const costEstimate = pesticideNeeded * 25; // $25 per gallon

        setResult({
          pesticideNeeded,
          waterNeeded,
          sprayVolume,
          costEstimate,
          applicationRate,
        });
        setShowResult(true);
        setError('');
      } catch (err) {
        setError(t("pesticide.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setArea('');
      setPesticideType('herbicide');
      setConcentration('');
      setTargetRate('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const pesticideOptions = [
    { value: 'herbicide', label: t("pesticide.type_herbicide") },
    { value: 'insecticide', label: t("pesticide.type_insecticide") },
    { value: 'fungicide', label: t("pesticide.type_fungicide") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">{t("pesticide.title")}</div>
      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("pesticide.pesticide_type_label")} tooltip={t("pesticide.pesticide_type_tooltip")}>
          <Combobox
            options={pesticideOptions}
            value={pesticideType}
            onChange={(val) => setPesticideType(val)}
            placeholder={t("pesticide.pesticide_type_label")}
          />
        </FormField>
        <FormField label={t("pesticide.area_label")} tooltip={t("pesticide.area_tooltip")}>
          <NumberInput
            value={area}
            onValueChange={(val) => setArea(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("pesticide.area_placeholder")}
            min={0}
            startIcon={<Scale className="h-4 w-4" />}
          />
        </FormField>
        <FormField label={t("pesticide.concentration_label")} tooltip={t("pesticide.concentration_tooltip")}>
          <NumberInput
            value={concentration}
            onValueChange={(val) => setConcentration(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("pesticide.concentration_placeholder")}
            min={0}
            max={100}
            startIcon={<FlaskConical className="h-4 w-4" />}
          />
        </FormField>
        <FormField label={t("pesticide.target_rate_label")} tooltip={t("pesticide.target_rate_tooltip")}>
          <NumberInput
            value={targetRate}
            onValueChange={(val) => setTargetRate(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("pesticide.target_rate_placeholder")}
            min={0}
            startIcon={<Target className="h-4 w-4" />}
          />
        </FormField>
      </div>
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>
      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t("pesticide.info_title")}</h2>
          <p className="text-foreground-70">{t("pesticide.info_description")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("pesticide.result_label")}</div>
        <div className="text-4xl font-bold text-primary mb-2" dir="ltr">{formatNumber(result.pesticideNeeded)}</div>
        <div className="text-lg text-foreground-70">{t("pesticide.result_gallons")}</div>
      </div>
      <div className="divider my-6"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2 flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            {t("pesticide.water_needed")}
          </div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{formatNumber(result.waterNeeded)} {t("pesticide.unit_gal")}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2">{t("pesticide.spray_volume")}</div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{formatNumber(result.sprayVolume)} {t("pesticide.unit_gal")}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2">{t("pesticide.application_rate")}</div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{formatNumber(result.applicationRate)} {t("pesticide.unit_gal_acre")}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2">{t("pesticide.cost_estimate")}</div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{t("common:units.currencySymbol")}{formatNumber(result.costEstimate)}</div>
        </div>
      </div>
    </div>
  ) : null;

  return <CalculatorLayout title={t("pesticide.title")} description={t("pesticide.description")} inputSection={inputSection} resultSection={resultSection} className="rtl" />;
}
