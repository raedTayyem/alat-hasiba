'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, TrendingUp, Info, Coins, Banknote } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function RealEstateROICalculator() {
  const { t } = useTranslation('calc/real-estate');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [sellingPrice, setSellingPrice] = useState<string>('');
  const [totalInvestment, setTotalInvestment] = useState<string>('');
  const [rentalIncome, setRentalIncome] = useState<string>('');
  const [result, setResult] = useState<{
    totalGain: number;
    roi: number;
    annualizedROI: number;
  } | null>(null);

  const calculate = () => {
    const purchase = parseFloat(purchasePrice) || 0;
    const selling = parseFloat(sellingPrice) || 0;
    const investment = parseFloat(totalInvestment) || purchase;
    const rental = parseFloat(rentalIncome) || 0;

    if (!purchase || !selling) return;

    const totalGain = (selling - purchase) + rental;
    const roi = (totalGain / investment) * 100;
    const annualizedROI = roi / 5; // Assuming 5 years

    setResult({
      totalGain: parseFloat(totalGain.toFixed(2)),
      roi: parseFloat(roi.toFixed(2)),
      annualizedROI: parseFloat(annualizedROI.toFixed(2))
    });
  };

  const reset = () => {
    setPurchasePrice('');
    setSellingPrice('');
    setTotalInvestment('');
    setRentalIncome('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("real_estate_roi_calculator.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("real_estate_roi_calculator.purchase_price")}
          tooltip={t("real_estate_roi_calculator.purchase_price_tooltip")}
        >
          <NumberInput
            value={purchasePrice}
            onValueChange={(val) => setPurchasePrice(val.toString())}
            placeholder={t("real_estate_roi_calculator.enter_purchase_price")}
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("real_estate_roi_calculator.selling_price")}
          tooltip={t("real_estate_roi_calculator.selling_price_tooltip")}
        >
          <NumberInput
            value={sellingPrice}
            onValueChange={(val) => setSellingPrice(val.toString())}
            placeholder={t("real_estate_roi_calculator.enter_purchase_price")}
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("real_estate_roi_calculator.total_investment")}
          tooltip={t("real_estate_roi_calculator.total_investment_tooltip")}
        >
          <NumberInput
            value={totalInvestment}
            onValueChange={(val) => setTotalInvestment(val.toString())}
            placeholder={t("real_estate_roi_calculator.enter_total_investment")}
            min={0}
            startIcon={<Coins className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("real_estate_roi_calculator.rental_income")}
          tooltip={t("real_estate_roi_calculator.rental_income_tooltip")}
        >
          <NumberInput
            value={rentalIncome}
            onValueChange={(val) => setRentalIncome(val.toString())}
            placeholder={t("real_estate_roi_calculator.enter_total_investment")}
            min={0}
            startIcon={<Banknote className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("real_estate_roi_calculator.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("real_estate_roi_calculator.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("real_estate_roi_calculator.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("real_estate_roi_calculator.roi")}
          </div>
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            {result.roi}%
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("real_estate_roi_calculator.total_gain")}
            </div>
            <div className={`text-xl font-bold ${result.totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {result.totalGain.toLocaleString()} {t("real_estate_roi_calculator.currency")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("real_estate_roi_calculator.annualized_roi")}
            </div>
            <div className={`text-xl font-bold ${result.annualizedROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {result.annualizedROI}%
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">
              {t("real_estate_roi_calculator.tips_title")}
            </h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">
              <li>{t("real_estate_roi_calculator.tip_positive")}</li>
              <li>{t("real_estate_roi_calculator.tip_compare")}</li>
              <li>{t("real_estate_roi_calculator.tip_risk")}</li>
            </ul>
            <p className="text-sm text-foreground-70 mt-2">
              {t("real_estate_roi_calculator.footer_note")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <TrendingUp className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">
        {t("real_estate_roi_calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("real_estate_roi_calculator.title")}
      description={t("real_estate_roi_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("real_estate_roi_calculator.footer_note")}
     className="rtl" />
  );
}
