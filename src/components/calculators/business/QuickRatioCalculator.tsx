'use client';

/** Quick Ratio Calculator - Formula: (Current Assets - Inventory) / Current Liabilities */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Package, Activity } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

export default function QuickRatioCalculator() {
  const { t, i18n } = useTranslation(['calc/business', 'common']);
  const [currentAssets, setCurrentAssets] = useState<string>('');
  const [inventory, setInventory] = useState<string>('');
  const [currentLiabilities, setCurrentLiabilities] = useState<string>('');
  const [result, setResult] = useState<{ratio: number; liquidAssets: number} | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { initDateInputRTL(); }, []);

  const calculate = () => {
    const assets = parseFloat(currentAssets);
    const inv = parseFloat(inventory) || 0;
    const liabilities = parseFloat(currentLiabilities);
    if (isNaN(assets) || isNaN(liabilities) || liabilities === 0) { setError(t("errors.invalid_input", { ns: 'common' })); return; }
    setShowResult(false);
    setTimeout(() => {
      const liquidAssets = assets - inv;
      const ratio = liquidAssets / liabilities;
      setResult({ ratio, liquidAssets });
      setShowResult(true);
    }, 300);
  };

  const reset = () => { setShowResult(false); setTimeout(() => { setCurrentAssets(''); setInventory(''); setCurrentLiabilities(''); setResult(null); setError(''); }, 300); };
  const formatNumber = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">{t("quick_ratio.title")}</div>
      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("quick_ratio.inputs.current_assets")} tooltip={t("quick_ratio.inputs.current_assets_tooltip")}>
          <NumberInput 
            value={currentAssets} 
            onValueChange={(val) => {setCurrentAssets(val.toString()); if(error) setError('');}}
            onKeyPress={handleKeyPress}
            placeholder={t("quick_ratio.inputs.current_assets")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>
        <FormField label={t("quick_ratio.inputs.inventory")} tooltip={t("quick_ratio.inputs.inventory_tooltip")}>
          <NumberInput 
            value={inventory} 
            onValueChange={(val) => {setInventory(val.toString()); if(error) setError('');}}
            onKeyPress={handleKeyPress}
            placeholder={t("quick_ratio.inputs.inventory")}
            startIcon={<Package className="h-4 w-4" />}
            min={0}
          />
        </FormField>
        <FormField label={t("quick_ratio.inputs.current_liabilities")} tooltip={t("quick_ratio.inputs.current_liabilities_tooltip")}>
          <NumberInput 
            value={currentLiabilities} 
            onValueChange={(val) => {setCurrentLiabilities(val.toString()); if(error) setError('');}}
            onKeyPress={handleKeyPress}
            placeholder={t("quick_ratio.inputs.current_liabilities")}
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
        <p className="text-foreground-70">{t("quick_ratio.description")}</p>
      </div>}
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("quick_ratio.results.ratio")}</div>
        <div className="text-4xl font-bold text-primary">{formatNumber(result.ratio)}</div>
        <div className="flex items-center justify-center mt-2 text-lg text-foreground-70">
          <Activity className="w-5 h-5 ml-2 text-primary" />
          {t("quick_ratio.results.liquid_assets")}: ${formatNumber(result.liquidAssets)}
        </div>
      </div>
    </div>
  ) : null;

  return <CalculatorLayout title={t("quick_ratio.title")} description={t("quick_ratio.description")}
    inputSection={inputSection} resultSection={resultSection} className="rtl" />;
}
