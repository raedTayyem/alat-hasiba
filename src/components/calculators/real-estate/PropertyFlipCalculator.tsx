'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, Hammer, Clock, TrendingUp, Info, Briefcase } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function PropertyFlipCalculator() {
  const { t } = useTranslation('calc/real-estate');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [renovationCost, setRenovationCost] = useState<string>('');
  const [sellingPrice, setSellingPrice] = useState<string>('');
  const [holdingCosts, setHoldingCosts] = useState<string>('');
  const [result, setResult] = useState<{
    totalCost: number;
    profit: number;
    roi: number;
  } | null>(null);

  const calculate = () => {
    const purchase = parseFloat(purchasePrice) || 0;
    const renovation = parseFloat(renovationCost) || 0;
    const selling = parseFloat(sellingPrice) || 0;
    const holding = parseFloat(holdingCosts) || 0;

    if (!purchase || !selling) return;

    const totalCost = purchase + renovation + holding;
    const profit = selling - totalCost;
    const roi = (profit / totalCost) * 100;

    setResult({
      totalCost: parseFloat(totalCost.toFixed(2)),
      profit: parseFloat(profit.toFixed(2)),
      roi: parseFloat(roi.toFixed(2))
    });
  };

  const reset = () => {
    setPurchasePrice('');
    setRenovationCost('');
    setSellingPrice('');
    setHoldingCosts('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("property_flip_calculator.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("property_flip_calculator.purchase_price")}
          tooltip={t("property_flip_calculator.purchase_price_tooltip")}
        >
          <NumberInput
            value={purchasePrice}
            onValueChange={(val) => setPurchasePrice(val.toString())}
            placeholder={t("property_flip_calculator.enter_purchase_price")}
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("property_flip_calculator.renovation_cost")}
          tooltip={t("property_flip_calculator.renovation_cost_tooltip")}
        >
          <NumberInput
            value={renovationCost}
            onValueChange={(val) => setRenovationCost(val.toString())}
            placeholder={t("property_flip_calculator.enter_renovation_cost")}
            min={0}
            startIcon={<Hammer className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("property_flip_calculator.selling_price")}
          tooltip={t("property_flip_calculator.selling_price_tooltip")}
        >
          <NumberInput
            value={sellingPrice}
            onValueChange={(val) => setSellingPrice(val.toString())}
            placeholder={t("property_flip_calculator.enter_purchase_price")}
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("property_flip_calculator.holding_costs")}
          tooltip={t("property_flip_calculator.holding_costs_tooltip")}
        >
          <NumberInput
            value={holdingCosts}
            onValueChange={(val) => setHoldingCosts(val.toString())}
            placeholder={t("property_flip_calculator.enter_holding_costs")}
            min={0}
            startIcon={<Clock className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("property_flip_calculator.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("property_flip_calculator.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("property_flip_calculator.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("property_flip_calculator.profit")}
          </div>
          <div className={`text-3xl font-bold ${result.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {result.profit.toLocaleString()} {t("property_flip_calculator.currency")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("property_flip_calculator.total_cost")}
            </div>
            <div className="text-xl font-bold">
              {result.totalCost.toLocaleString()} {t("property_flip_calculator.currency")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("property_flip_calculator.roi")}
            </div>
            <div className={`text-xl font-bold flex items-center gap-1 ${result.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`w-5 h-5 ${result.roi <= 0 ? 'transform rotate-180' : ''}`} />
              {result.roi}%
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">
              {t("property_flip_calculator.tips_title")}
            </h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">
              <li>{t("property_flip_calculator.tip_roi")}</li>
              <li>{t("property_flip_calculator.tip_hidden")}</li>
              <li>{t("property_flip_calculator.tip_over")}</li>
              <li>{t("property_flip_calculator.tip_loc")}</li>
            </ul>
            <p className="text-sm text-foreground-70 mt-2">
              {t("property_flip_calculator.footer_note")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Briefcase className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">
        {t("property_flip_calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("property_flip_calculator.title")}
      description={t("property_flip_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("property_flip_calculator.footer_note")}
     className="rtl" />
  );
}
