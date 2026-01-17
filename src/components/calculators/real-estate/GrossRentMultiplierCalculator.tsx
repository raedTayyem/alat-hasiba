'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, Info, TrendingUp, Building } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function GrossRentMultiplierCalculator() {
  const { t } = useTranslation('calc/real-estate');
  const [propertyPrice, setPropertyPrice] = useState<string>('');
  const [annualRent, setAnnualRent] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const price = parseFloat(propertyPrice) || 0;
    const rent = parseFloat(annualRent) || 0;

    if (!price || !rent) return;

    const grm = price / rent;
    setResult(parseFloat(grm.toFixed(2)));
  };

  const reset = () => {
    setPropertyPrice('');
    setAnnualRent('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("gross_rent_multiplier_calculator.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("gross_rent_multiplier_calculator.property_price")}
          tooltip={t("gross_rent_multiplier_calculator.property_price_tooltip")}
        >
          <NumberInput
            value={propertyPrice}
            onValueChange={(val) => setPropertyPrice(val.toString())}
            placeholder={t("calculators.enter_201")}
            min={0}
            startIcon={<Building className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("gross_rent_multiplier_calculator.annual_rent")}
          tooltip={t("gross_rent_multiplier_calculator.annual_rent_tooltip")}
        >
          <NumberInput
            value={annualRent}
            onValueChange={(val) => setAnnualRent(val.toString())}
            placeholder={t("calculators.calc_68c122c6")}
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("gross_rent_multiplier_calculator.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("gross_rent_multiplier_calculator.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result !== null ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("gross_rent_multiplier_calculator.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("gross_rent_multiplier_calculator.grm_label")}
          </div>
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            {result}
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">
              {t("gross_rent_multiplier_calculator.tips_title")}
            </h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">
              <li>{t("gross_rent_multiplier_calculator.tip_low")}</li>
              <li>{t("gross_rent_multiplier_calculator.tip_high")}</li>
              <li>{t("gross_rent_multiplier_calculator.tip_usage")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Calculator className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">
        {t("gross_rent_multiplier_calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("gross_rent_multiplier_calculator.title")}
      description={t("gross_rent_multiplier_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("gross_rent_multiplier_calculator.footer_note")}
     className="rtl" />
  );
}
