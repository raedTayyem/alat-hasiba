'use client';

/**
 * ALATHASIBA - FERTILIZER CALCULATOR
 * Calculate NPK fertilizer requirements for crops
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, Info, Scale, FlaskConical, DollarSign } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface FertilizerResult {
  nitrogenNeeded: number;
  phosphorusNeeded: number;
  potassiumNeeded: number;
  totalFertilizer: number;
  costEstimate: number;
}

// NPK requirements per bushel for different crops
const CROP_NPK_REQUIREMENTS: Record<string, { n: number; p: number; k: number }> = {
  corn: { n: 1.2, p: 0.4, k: 0.3 },
  wheat: { n: 1.0, p: 0.35, k: 0.25 },
  soybean: { n: 0.5, p: 0.4, k: 0.4 },
  cotton: { n: 0.06, p: 0.02, k: 0.03 }, // per lb lint
};

export default function FertilizerCalculator() {
  const { t } = useTranslation(['calc/agriculture', 'common']);
  const [area, setArea] = useState<string>('');
  const [cropType, setCropType] = useState<string>('corn');
  const [soilTestN, setSoilTestN] = useState<string>('');
  const [soilTestP, setSoilTestP] = useState<string>('');
  const [soilTestK, setSoilTestK] = useState<string>('');
  const [targetYield, setTargetYield] = useState<string>('');

  const [result, setResult] = useState<FertilizerResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');
    const areaValue = parseFloat(area);
    const nValue = parseFloat(soilTestN);
    const pValue = parseFloat(soilTestP);
    const kValue = parseFloat(soilTestK);
    const yieldValue = parseFloat(targetYield);

    if (isNaN(areaValue) || isNaN(nValue) || isNaN(pValue) || isNaN(kValue) || isNaN(yieldValue)) {
      setError(t("fertilizer.error_invalid_input"));
      return false;
    }

    if (areaValue <= 0 || yieldValue <= 0) {
      setError(t("fertilizer.error_positive_required"));
      return false;
    }

    if (nValue < 0 || pValue < 0 || kValue < 0) {
      setError(t("fertilizer.error_soil_negative"));
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
        const nValue = parseFloat(soilTestN);
        const pValue = parseFloat(soilTestP);
        const kValue = parseFloat(soilTestK);
        const yieldValue = parseFloat(targetYield);

        // Get NPK requirements for selected crop
        const cropReq = CROP_NPK_REQUIREMENTS[cropType] || CROP_NPK_REQUIREMENTS.corn;
        const nPerBushel = cropReq.n;
        const pPerBushel = cropReq.p;
        const kPerBushel = cropReq.k;

        const totalNRequired = yieldValue * nPerBushel;
        const totalPRequired = yieldValue * pPerBushel;
        const totalKRequired = yieldValue * kPerBushel;

        const nitrogenNeeded = Math.max(0, totalNRequired - nValue) * areaValue;
        const phosphorusNeeded = Math.max(0, totalPRequired - pValue) * areaValue;
        const potassiumNeeded = Math.max(0, totalKRequired - kValue) * areaValue;

        const totalFertilizer = nitrogenNeeded + phosphorusNeeded + potassiumNeeded;
        const costEstimate = totalFertilizer * 0.5; // $0.50 per lb estimate

        setResult({
          nitrogenNeeded,
          phosphorusNeeded,
          potassiumNeeded,
          totalFertilizer,
          costEstimate,
        });

        setShowResult(true);
        setError('');
      } catch (err) {
        setError(t("fertilizer.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setArea('');
      setCropType('corn');
      setSoilTestN('');
      setSoilTestP('');
      setSoilTestK('');
      setTargetYield('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    if (Math.abs(num) < 1) return num.toFixed(2);
    return num.toLocaleString('en-US', { maximumFractionDigits: 1 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') calculate();
  };

  const cropOptions = [
    { value: 'corn', label: t("fertilizer.crop_corn") },
    { value: 'wheat', label: t("fertilizer.crop_wheat") },
    { value: 'soybean', label: t("fertilizer.crop_soybean") },
    { value: 'cotton', label: t("fertilizer.crop_cotton") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("fertilizer.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("fertilizer.crop_type_label")} tooltip={t("fertilizer.crop_type_tooltip")}>
          <Combobox
            options={cropOptions}
            value={cropType}
            onChange={(val) => setCropType(val)}
            placeholder={t("fertilizer.crop_type_label")}
          />
        </FormField>

        <FormField label={t("fertilizer.area_label")} tooltip={t("fertilizer.area_tooltip")}>
          <NumberInput
            value={area}
            onValueChange={(val) => setArea(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("fertilizer.area_placeholder")}
            min={0}
            startIcon={<Scale className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("fertilizer.target_yield_label")} tooltip={t("fertilizer.target_yield_tooltip")}>
          <NumberInput
            value={targetYield}
            onValueChange={(val) => setTargetYield(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("fertilizer.target_yield_placeholder")}
            min={0}
            startIcon={<Sprout className="h-4 w-4" />}
          />
        </FormField>

        <div className="grid grid-cols-3 gap-2">
          <FormField label={t("fertilizer.soil_n_label")} tooltip={t("fertilizer.soil_n_tooltip")}>
            <NumberInput
              value={soilTestN}
              onValueChange={(val) => setSoilTestN(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("fertilizer.element_n")}
              startIcon={<FlaskConical className="h-4 w-4" />}
            />
          </FormField>

          <FormField label={t("fertilizer.soil_p_label")} tooltip={t("fertilizer.soil_p_tooltip")}>
            <NumberInput
              value={soilTestP}
              onValueChange={(val) => setSoilTestP(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("fertilizer.element_p")}
              startIcon={<FlaskConical className="h-4 w-4" />}
            />
          </FormField>

          <FormField label={t("fertilizer.soil_k_label")} tooltip={t("fertilizer.soil_k_tooltip")}>
            <NumberInput
              value={soilTestK}
              onValueChange={(val) => setSoilTestK(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("fertilizer.element_k")}
              startIcon={<FlaskConical className="h-4 w-4" />}
            />
          </FormField>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t("fertilizer.info_title")}</h2>
            <p className="text-foreground-70 mb-3">{t("fertilizer.info_description")}</p>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("fertilizer.result_label")}</div>
        <div className="text-4xl font-bold text-primary mb-2" dir="ltr">{formatNumber(result.totalFertilizer)}</div>
        <div className="text-lg text-foreground-70">{t("fertilizer.result_unit_val")}</div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t("fertilizer.npk_breakdown")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t("fertilizer.element_n")} - {t("fertilizer.nitrogen")}</div>
            <div className="text-2xl font-bold text-primary" dir="ltr">{formatNumber(result.nitrogenNeeded)}</div>
            <div className="text-sm text-foreground-70">{t("fertilizer.unit_lbs_acre")}</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t("fertilizer.element_p")} - {t("fertilizer.phosphorus")}</div>
            <div className="text-2xl font-bold text-primary" dir="ltr">{formatNumber(result.phosphorusNeeded)}</div>
            <div className="text-sm text-foreground-70">{t("fertilizer.unit_lbs_acre")}</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t("fertilizer.element_k")} - {t("fertilizer.potassium")}</div>
            <div className="text-2xl font-bold text-primary" dir="ltr">{formatNumber(result.potassiumNeeded)}</div>
            <div className="text-sm text-foreground-70">{t("fertilizer.unit_lbs_acre")}</div>
          </div>
        </div>

        <div className="mt-4 bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div className="font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {t("fertilizer.cost_estimate")}
            </div>
            <div className="text-2xl font-bold text-primary" dir="ltr">{t("common:units.currencySymbol")}{formatNumber(result.costEstimate)}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("fertilizer.note_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("fertilizer.note_description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("fertilizer.title")}
      description={t("fertilizer.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
