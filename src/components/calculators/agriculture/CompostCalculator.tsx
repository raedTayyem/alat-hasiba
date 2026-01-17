'use client';

/**
 * ALATHASIBA - COMPOST CALCULATOR
 * Calculate green and brown material ratios for composting
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, Scale, PieChart } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CompostResult {
  greenMaterial: number;
  brownMaterial: number;
  totalVolume: number;
  carbonNitrogenRatio: number;
}

export default function CompostCalculator() {
  const { t } = useTranslation('calc/agriculture');
  const [totalVolume, setTotalVolume] = useState<string>('');
  const [targetRatio, setTargetRatio] = useState<string>('30');
  const [result, setResult] = useState<CompostResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => { initDateInputRTL(); }, []);

  const calculate = () => {
    const volume = parseFloat(totalVolume);
    const ratio = parseFloat(targetRatio);

    if (isNaN(volume) || isNaN(ratio)) {
      setError(t("compost.error_invalid_input"));
      return;
    }

    if (volume <= 0 || ratio <= 0) {
      setError(t("compost.error_positive_required"));
      return;
    }

    setShowResult(false);
    setError('');

    setTimeout(() => {
      const brownMaterial = (volume * ratio) / (ratio + 1);
      const greenMaterial = volume - brownMaterial;

      setResult({
        greenMaterial,
        brownMaterial,
        totalVolume: volume,
        carbonNitrogenRatio: ratio,
      });
      setShowResult(true);
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setTotalVolume('');
      setTargetRatio('30');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">{t("compost.title")}</div>
      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("compost.total_volume_label")} tooltip={t("compost.total_volume_tooltip")}>
          <NumberInput
            value={totalVolume}
            onValueChange={(val) => setTotalVolume(val.toString())}
            onKeyPress={handleKeyPress}
            min={0}
            startIcon={<Scale className="h-4 w-4" />}
          />
        </FormField>
        <FormField label={t("compost.target_ratio_label")} tooltip={t("compost.target_ratio_tooltip")}>
          <NumberInput
            value={targetRatio}
            onValueChange={(val) => setTargetRatio(val.toString())}
            onKeyPress={handleKeyPress}
            min={0}
            startIcon={<PieChart className="h-4 w-4" />}
          />
        </FormField>
      </div>
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>
      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t("compost.info_title")}</h2>
          <p className="text-foreground-70">{t("compost.info_description")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("compost.result_label")}</div>
        <div className="text-4xl font-bold text-primary mb-2" dir="ltr">{result.carbonNitrogenRatio}:1</div>
        <div className="text-lg text-foreground-70">{t("compost.result_ratio")}</div>
      </div>
      <div className="divider my-6"></div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2 flex items-center gap-2">
            <Sprout className="h-4 w-4 text-green-600" />
            {t("compost.green_material")}
          </div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{result.greenMaterial.toFixed(1)} {t("compost.unit_cu_ft")}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2 flex items-center gap-2">
            <Sprout className="h-4 w-4 text-amber-700" />
            {t("compost.brown_material")}
          </div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{result.brownMaterial.toFixed(1)} {t("compost.unit_cu_ft")}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border col-span-2">
          <div className="font-medium mb-2">{t("compost.total_volume")}</div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{result.totalVolume.toFixed(1)} {t("compost.unit_cu_ft")}</div>
        </div>
      </div>
    </div>
  ) : null;

  return <CalculatorLayout title={t("compost.title")} description={t("compost.description")} inputSection={inputSection} resultSection={resultSection} className="rtl" />;
}
