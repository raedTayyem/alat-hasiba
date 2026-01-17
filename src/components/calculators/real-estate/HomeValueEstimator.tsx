'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, Maximize, Calendar, Activity, MapPin, Info } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

export default function HomeValueEstimator() {
  const { t } = useTranslation('calc/real-estate');
  const [squareMeters, setSquareMeters] = useState<string>('');
  const [pricePerMeter, setPricePerMeter] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [condition, setCondition] = useState<string>('good');
  const [location, setLocation] = useState<string>('average');
  const [result, setResult] = useState<{
    baseValue: number;
    adjustedValue: number;
    conditionAdjustment: number;
    locationAdjustment: number;
    ageAdjustment: number;
  } | null>(null);

  const calculate = () => {
    const meters = parseFloat(squareMeters) || 0;
    const price = parseFloat(pricePerMeter) || 0;
    const homeAge = parseFloat(age) || 0;

    if (!meters || !price) return;

    const baseValue = meters * price;

    // Condition adjustment
    const conditionFactors: Record<string, number> = {
      excellent: 1.15,
      good: 1.0,
      fair: 0.85,
      poor: 0.70
    };

    // Location adjustment
    const locationFactors: Record<string, number> = {
      premium: 1.25,
      good: 1.10,
      average: 1.0,
      below: 0.85
    };

    // Age depreciation (1% per year, max 30%)
    const ageDepreciation = Math.min(homeAge * 0.01, 0.30);

    const conditionFactor = conditionFactors[condition] || 1.0;
    const locationFactor = locationFactors[location] || 1.0;
    const ageFactor = 1 - ageDepreciation;

    const adjustedValue = baseValue * conditionFactor * locationFactor * ageFactor;

    setResult({
      baseValue: parseFloat(baseValue.toFixed(2)),
      adjustedValue: parseFloat(adjustedValue.toFixed(2)),
      conditionAdjustment: parseFloat(((conditionFactor - 1) * 100).toFixed(2)),
      locationAdjustment: parseFloat(((locationFactor - 1) * 100).toFixed(2)),
      ageAdjustment: parseFloat((ageDepreciation * 100).toFixed(2))
    });
  };

  const reset = () => {
    setSquareMeters('');
    setPricePerMeter('');
    setAge('');
    setCondition('good');
    setLocation('average');
    setResult(null);
  };

  const conditionOptions = [
    { value: 'excellent', label: t("home_value_estimator.cond_excellent") },
    { value: 'good', label: t("home_value_estimator.cond_good") },
    { value: 'fair', label: t("home_value_estimator.cond_fair") },
    { value: 'poor', label: t("home_value_estimator.cond_poor") }
  ];

  const locationOptions = [
    { value: 'premium', label: t("home_value_estimator.loc_premium") },
    { value: 'good', label: t("home_value_estimator.loc_good") },
    { value: 'average', label: t("home_value_estimator.loc_average") },
    { value: 'below', label: t("home_value_estimator.loc_below") }
  ];

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("home_value_estimator.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("home_value_estimator.square_meters")}
          tooltip={t("home_value_estimator.square_meters_tooltip")}
        >
          <NumberInput
            value={squareMeters}
            onValueChange={(val) => setSquareMeters(val.toString())}
            placeholder={t("home_value_estimator.enter_square_meters")}
            min={0}
            startIcon={<Maximize className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("home_value_estimator.price_per_meter")}
          tooltip={t("home_value_estimator.price_per_meter_tooltip")}
        >
          <NumberInput
            value={pricePerMeter}
            onValueChange={(val) => setPricePerMeter(val.toString())}
            placeholder={t("home_value_estimator.enter_price_per_meter")}
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("home_value_estimator.age")}
          tooltip={t("home_value_estimator.age_tooltip")}
        >
          <NumberInput
            value={age}
            onValueChange={(val) => setAge(val.toString())}
            placeholder={t("home_value_estimator.enter_age")}
            min={0}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("home_value_estimator.condition")}
          tooltip={t("home_value_estimator.condition_tooltip")}
        >
          <Combobox
            value={condition}
            onChange={setCondition}
            options={conditionOptions}
          />
        </FormField>

        <FormField
          label={t("home_value_estimator.location")}
          tooltip={t("home_value_estimator.location_tooltip")}
        >
          <Combobox
            value={location}
            onChange={setLocation}
            options={locationOptions}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("home_value_estimator.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("home_value_estimator.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("home_value_estimator.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("home_value_estimator.adjusted_value")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {result.adjustedValue.toLocaleString()} {t("home_value_estimator.currency")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("home_value_estimator.base_value")}
            </div>
            <div className="text-xl font-bold">
              {result.baseValue.toLocaleString()} {t("home_value_estimator.currency")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("home_value_estimator.condition_adj")}
            </div>
            <div className={`text-xl font-bold ${result.conditionAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {result.conditionAdjustment > 0 ? '+' : ''}{result.conditionAdjustment}%
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("home_value_estimator.location_adj")}
            </div>
            <div className={`text-xl font-bold ${result.locationAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {result.locationAdjustment > 0 ? '+' : ''}{result.locationAdjustment}%
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("home_value_estimator.age_adj")}
            </div>
            <div className="text-xl font-bold text-red-600">
              -{result.ageAdjustment}%
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">
              {t("home_value_estimator.tips_title")}
            </h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">
              <li>{t("home_value_estimator.tip_1")}</li>
              <li>{t("home_value_estimator.tip_2")}</li>
              <li>{t("home_value_estimator.tip_3")}</li>
              <li>{t("home_value_estimator.tip_4")}</li>
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
        {t("home_value_estimator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("home_value_estimator.title")}
      description={t("home_value_estimator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("home_value_estimator.footer_note")}
     className="rtl" />
  );
}
