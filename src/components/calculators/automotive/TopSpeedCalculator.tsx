'use client';

/**
 * Top Speed Calculator
 * Calculate theoretical top speed based on physics
 * Formula: v = cube_root(2P / (rho * Cd * A))
 * Where P = power, rho = air density, Cd = drag coefficient, A = frontal area
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Gauge, Wind, Square, Scale, Info, Zap } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

interface TopSpeedResult {
  topSpeedMph: number;
  topSpeedKmh: number;
  dragForceAtTopSpeed: number;
  powerRequired: number;
  powerToWeight: number;
}

export default function TopSpeedCalculator() {
  const { t } = useTranslation(['calc/automotive', 'common']);

  const [horsepower, setHorsepower] = useState<string>('');
  const [dragCoefficient, setDragCoefficient] = useState<string>('');
  const [frontalArea, setFrontalArea] = useState<string>('');
  const [weight, setWeight] = useState<string>('');

  const [result, setResult] = useState<TopSpeedResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const hp = parseFloat(horsepower);
    const cd = parseFloat(dragCoefficient);
    const area = parseFloat(frontalArea);

    if (isNaN(hp) || isNaN(cd) || isNaN(area)) {
      setError(t('top_speed.error_missing_inputs'));
      return false;
    }

    if (hp <= 0 || cd <= 0 || area <= 0) {
      setError(t('top_speed.error_positive_values'));
      return false;
    }

    if (cd > 2) {
      setError(t('top_speed.error_invalid_cd'));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    setShowResult(false);

    setTimeout(() => {
      try {
        const hp = parseFloat(horsepower);
        const cd = parseFloat(dragCoefficient);
        const area = parseFloat(frontalArea);
        const vehicleWeight = parseFloat(weight) || 0;

        // Convert horsepower to watts (1 HP = 745.7 W)
        const powerWatts = hp * 745.7;

        // Air density at sea level (kg/m^3)
        const rho = 1.225;

        // Top speed formula: v = cube_root(2P / (rho * Cd * A))
        // This gives velocity in m/s
        const velocityMs = Math.pow((2 * powerWatts) / (rho * cd * area), 1/3);

        // Convert to mph and km/h
        const topSpeedMph = velocityMs * 2.237;
        const topSpeedKmh = velocityMs * 3.6;

        // Calculate drag force at top speed
        // Fd = 0.5 * rho * v^2 * Cd * A
        const dragForceAtTopSpeed = 0.5 * rho * Math.pow(velocityMs, 2) * cd * area;

        // Power to weight ratio (hp per 1000 lbs or kg)
        const powerToWeight = vehicleWeight > 0 ? (hp / vehicleWeight) * 1000 : 0;

        setResult({
          topSpeedMph,
          topSpeedKmh,
          dragForceAtTopSpeed,
          powerRequired: hp,
          powerToWeight,
        });

        setShowResult(true);
      } catch (err) {
        setError(t('top_speed.error_calculation'));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setHorsepower('');
      setDragCoefficient('');
      setFrontalArea('');
      setWeight('');
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
        {t('top_speed.title')}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t('top_speed.horsepower')}
          tooltip={t('top_speed.horsepower_tooltip')}
        >
          <NumberInput
            value={horsepower}
            onValueChange={(val) => { setHorsepower(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t('top_speed.placeholders.horsepower')}
            min={0}
            step={10}
            startIcon={<Zap className="h-4 w-4" />}
            unit={t("common:units.HP")}
          />
        </FormField>

        <FormField
          label={t('top_speed.drag_coefficient')}
          tooltip={t('top_speed.drag_coefficient_tooltip')}
        >
          <NumberInput
            value={dragCoefficient}
            onValueChange={(val) => { setDragCoefficient(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t('top_speed.placeholders.drag_coefficient')}
            min={0}
            max={2}
            step={0.01}
            startIcon={<Wind className="h-4 w-4" />}
            unit={t("common:units.Cd")}
          />
        </FormField>

        <FormField
          label={t('top_speed.frontal_area')}
          tooltip={t('top_speed.frontal_area_tooltip')}
        >
          <NumberInput
            value={frontalArea}
            onValueChange={(val) => { setFrontalArea(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t('top_speed.placeholders.frontal_area')}
            min={0}
            step={0.1}
            startIcon={<Square className="h-4 w-4" />}
            unit={t("common:units.square_meters")}
          />
        </FormField>

        <FormField
          label={t('top_speed.weight')}
          tooltip={t('top_speed.weight_tooltip')}
        >
          <NumberInput
            value={weight}
            onValueChange={(val) => { setWeight(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t('top_speed.placeholders.weight')}
            min={0}
            step={100}
            startIcon={<Scale className="h-4 w-4" />}
            unit={t("common:units.kg")}
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
            <h2 className="font-bold mb-2 text-lg">{t('top_speed.about_title')}</h2>
            <p className="text-foreground-70">{t('top_speed.about_description')}</p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t('top_speed.typical_values_title')}</h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t('top_speed.typical_cd_sedan')}</li>
              <li>{t('top_speed.typical_cd_suv')}</li>
              <li>{t('top_speed.typical_cd_sports')}</li>
              <li>{t('top_speed.typical_area')}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t('top_speed.theoretical_top_speed')}</div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.topSpeedMph.toFixed(0)} {t("common:units.mph")}
        </div>
        <div className="text-lg text-foreground-70">
          {result.topSpeedKmh.toFixed(0)} {t("common:units.kmh")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t('top_speed.detailed_results')}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Wind className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t('top_speed.drag_force')}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.dragForceAtTopSpeed.toFixed(0)} {t("common:units.N")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t('top_speed.power_used')}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.powerRequired.toFixed(0)} {t("common:units.HP")}
            </div>
          </div>

          {result.powerToWeight > 0 && (
            <div className="bg-card p-4 rounded-lg border border-border sm:col-span-2">
              <div className="flex items-center mb-2">
                <Gauge className="w-5 h-5 text-primary ml-2" />
                <div className="font-medium">{t('top_speed.power_to_weight')}</div>
              </div>
              <div className="text-sm text-foreground-70">
                {result.powerToWeight.toFixed(1)} {t("common:units.HP")} / 1000 {t("common:units.kg")}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t('top_speed.formula_title')}</h4>
            <p className="text-sm text-foreground-70">{t('top_speed.formula_explanation')}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('top_speed.title')}
      description={t('top_speed.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
