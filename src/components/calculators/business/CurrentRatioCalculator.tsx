'use client';

/** Current Ratio Calculator - Formula: Current Assets / Current Liabilities */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Activity } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

export default function CurrentRatioCalculator() {
  const { t, i18n } = useTranslation(['calc/business', 'common']);
  const [currentAssets, setCurrentAssets] = useState<string>('');
  const [currentLiabilities, setCurrentLiabilities] = useState<string>('');
  const [result, setResult] = useState<{ratio: number; liquidity: string} | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { initDateInputRTL(); }, []);

  const calculate = () => {
    const assets = parseFloat(currentAssets);
    const liabilities = parseFloat(currentLiabilities);
    if (isNaN(assets) || isNaN(liabilities) || liabilities === 0) { setError(t("errors.invalid_input")); return; }
    setShowResult(false);
    setTimeout(() => {
      const ratio = assets / liabilities;
      const liquidity = ratio > 2 ? t("current_ratio.results.strong") : ratio > 1 ? t("current_ratio.results.adequate") : t("current_ratio.results.weak");
      setResult({ ratio, liquidity });
      setShowResult(true);
    }, 300);
  };

  const reset = () => { setShowResult(false); setTimeout(() => { setCurrentAssets(''); setCurrentLiabilities(''); setResult(null); setError(''); }, 300); };
  const formatNumber = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">{t("current_ratio.title")}</div>
      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("current_ratio.inputs.current_assets")} tooltip={t("current_ratio.inputs.current_assets_tooltip")}>
          <NumberInput 
            value={currentAssets} 
            onValueChange={(val) => {setCurrentAssets(val.toString()); if(error) setError('');}}
            onKeyPress={handleKeyPress}
            placeholder={t("current_ratio.inputs.current_assets")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>
        <FormField label={t("current_ratio.inputs.current_liabilities")} tooltip={t("current_ratio.inputs.current_liabilities_tooltip")}>
          <NumberInput 
            value={currentLiabilities} 
            onValueChange={(val) => {setCurrentLiabilities(val.toString()); if(error) setError('');}}
            onKeyPress={handleKeyPress}
            placeholder={t("current_ratio.inputs.current_liabilities")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>
      </div>
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={reset} />
        <ErrorDisplay error={error} />
      </div>
      {!result && <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 max-w-2xl mx-auto">
        <p className="text-foreground-70">{t("current_ratio.info.description")}</p>
      </div>}
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("current_ratio.results.ratio")}</div>
        <div className="text-4xl font-bold text-primary">{formatNumber(result.ratio)}</div>
        <div className="flex items-center justify-center mt-2 text-lg text-foreground-70">
          <Activity className="w-5 h-5 ml-2 text-primary" />
          {result.liquidity}
        </div>
      </div>
    </div>
  ) : null;

  return <CalculatorLayout title={t("current_ratio.title")} description={t("current_ratio.description")}
    inputSection={inputSection} resultSection={resultSection} className="rtl" />;
}
