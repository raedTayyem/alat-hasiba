'use client';

/**
 * Car Trade-In Calculator
 * Estimate trade-in value based on age, mileage, and condition
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Car, Calendar, Gauge, ClipboardCheck, DollarSign, Info, TrendingDown } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

interface TradeInResult {
  estimatedValue: number;
  depreciation: number;
  depreciationPercent: number;
  conditionAdjustment: number;
  mileageAdjustment: number;
}

export default function CarTradeInCalculator() {
  const { t } = useTranslation('calc/automotive');

  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [vehicleAge, setVehicleAge] = useState<string>('');
  const [currentMileage, setCurrentMileage] = useState<string>('');
  const [condition, setCondition] = useState<string>('good');

  const [result, setResult] = useState<TradeInResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const conditionOptions = [
    { value: 'excellent', label: t('car_trade_in.condition_excellent') },
    { value: 'good', label: t('car_trade_in.condition_good') },
    { value: 'fair', label: t('car_trade_in.condition_fair') },
    { value: 'poor', label: t('car_trade_in.condition_poor') },
  ];

  const validateInputs = (): boolean => {
    setError('');

    const price = parseFloat(originalPrice);
    const age = parseFloat(vehicleAge);
    const mileage = parseFloat(currentMileage);

    if (isNaN(price) || isNaN(age)) {
      setError(t('car_trade_in.error_missing_inputs'));
      return false;
    }

    if (price <= 0 || age < 0) {
      setError(t('car_trade_in.error_positive_values'));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    setShowResult(false);

    setTimeout(() => {
      try {
        const price = parseFloat(originalPrice);
        const age = parseFloat(vehicleAge);
        const mileage = parseFloat(currentMileage) || 0;

        // Base depreciation formula:
        // Year 1: 20%, Year 2: 15%, Year 3: 12%, Year 4+: 10% per year
        let depreciationPercent = 0;
        for (let year = 1; year <= age; year++) {
          if (year === 1) depreciationPercent += 20;
          else if (year === 2) depreciationPercent += 15;
          else if (year === 3) depreciationPercent += 12;
          else depreciationPercent += 10;
        }
        // Cap at 90% depreciation
        depreciationPercent = Math.min(depreciationPercent, 90);

        // Condition adjustment factors
        const conditionFactors: { [key: string]: number } = {
          excellent: 1.10,  // +10%
          good: 1.00,       // No adjustment
          fair: 0.85,       // -15%
          poor: 0.70,       // -30%
        };

        // Mileage adjustment: Average 12,000 miles/year
        // Each 10,000 miles over average reduces value by 2%
        const expectedMileage = age * 12000;
        const mileageDifference = mileage - expectedMileage;
        let mileageAdjustment = 0;
        if (mileageDifference > 0) {
          mileageAdjustment = -Math.floor(mileageDifference / 10000) * 2;
        } else if (mileageDifference < 0) {
          mileageAdjustment = Math.min(Math.floor(Math.abs(mileageDifference) / 10000) * 1, 10);
        }

        // Calculate base value after depreciation
        const baseValue = price * (1 - depreciationPercent / 100);

        // Apply condition factor
        const conditionFactor = conditionFactors[condition] || 1;
        const afterCondition = baseValue * conditionFactor;

        // Apply mileage adjustment
        const finalValue = afterCondition * (1 + mileageAdjustment / 100);

        const depreciation = price - finalValue;
        const conditionAdjustmentAmount = baseValue * (conditionFactor - 1);
        const mileageAdjustmentAmount = afterCondition * (mileageAdjustment / 100);

        setResult({
          estimatedValue: Math.max(finalValue, 0),
          depreciation,
          depreciationPercent,
          conditionAdjustment: conditionAdjustmentAmount,
          mileageAdjustment: mileageAdjustmentAmount,
        });

        setShowResult(true);
      } catch (err) {
        setError(t('car_trade_in.error_calculation'));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setOriginalPrice('');
      setVehicleAge('');
      setCurrentMileage('');
      setCondition('good');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') calculate();
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t('car_trade_in.title')}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t('car_trade_in.original_price')}
          tooltip={t('car_trade_in.original_price_tooltip')}
        >
          <NumberInput
            value={originalPrice}
            onValueChange={(val) => { setOriginalPrice(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t('car_trade_in.placeholders.original_price')}
            min={0}
            step={1000}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t('car_trade_in.vehicle_age')}
          tooltip={t('car_trade_in.vehicle_age_tooltip')}
        >
          <NumberInput
            value={vehicleAge}
            onValueChange={(val) => { setVehicleAge(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t('car_trade_in.placeholders.vehicle_age')}
            min={0}
            step={1}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t('car_trade_in.current_mileage')}
          tooltip={t('car_trade_in.current_mileage_tooltip')}
        >
          <NumberInput
            value={currentMileage}
            onValueChange={(val) => { setCurrentMileage(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t('car_trade_in.placeholders.current_mileage')}
            min={0}
            step={1000}
            startIcon={<Gauge className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t('car_trade_in.condition')}
          tooltip={t('car_trade_in.condition_tooltip')}
        >
          <Combobox
            options={conditionOptions}
            value={condition}
            onChange={(val) => setCondition(val)}
            placeholder={t('car_trade_in.condition')}
          />
        </FormField>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <ErrorDisplay error={error} />

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t('car_trade_in.about_title')}</h2>
            <p className="text-foreground-70">{t('car_trade_in.about_description')}</p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t('car_trade_in.factors_title')}</h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t('car_trade_in.factor_1')}</li>
              <li>{t('car_trade_in.factor_2')}</li>
              <li>{t('car_trade_in.factor_3')}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t('car_trade_in.estimated_value')}</div>
        <div className="text-4xl font-bold text-primary mb-2">
          ${result.estimatedValue.toLocaleString(undefined, {maximumFractionDigits: 0})}
        </div>
        <div className="text-lg text-foreground-70">
          {result.depreciationPercent.toFixed(0)}% {t('car_trade_in.depreciation')}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t('car_trade_in.detailed_breakdown')}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingDown className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t('car_trade_in.total_depreciation')}</div>
            </div>
            <div className="text-sm text-foreground-70">
              ${result.depreciation.toLocaleString(undefined, {maximumFractionDigits: 0})}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <ClipboardCheck className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t('car_trade_in.condition_adjustment')}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.conditionAdjustment >= 0 ? '+' : ''}${result.conditionAdjustment.toLocaleString(undefined, {maximumFractionDigits: 0})}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border sm:col-span-2">
            <div className="flex items-center mb-2">
              <Gauge className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t('car_trade_in.mileage_adjustment')}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.mileageAdjustment >= 0 ? '+' : ''}${result.mileageAdjustment.toLocaleString(undefined, {maximumFractionDigits: 0})}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t('car_trade_in.formula_title')}</h4>
            <p className="text-sm text-foreground-70">{t('car_trade_in.formula_explanation')}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('car_trade_in.title')}
      description={t('car_trade_in.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
