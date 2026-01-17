'use client';

/**
 * Battery Life Calculator
 * Calculates battery age, CCA requirements by engine size, replacement recommendations
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Battery, Calendar, Activity, Info, AlertTriangle, Calculator, RotateCcw } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface BatteryLifeResult {
  batteryAge: number;
  recommendedCCA: number;
  currentCondition: string;
  replacementRecommendation: string;
  estimatedLifeRemaining: number;
}

export default function BatteryLifeCalculator() {
  const { t, i18n } = useTranslation('calc/automotive');
  const isRTL = i18n.language === 'ar';
  const [installDate, setInstallDate] = useState<string>('');
  const [engineSize, setEngineSize] = useState<string>('');
  const [currentCCA, setCurrentCCA] = useState<string>('');
  const [climate, setClimate] = useState<string>('moderate');
  const [result, setResult] = useState<BatteryLifeResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');
    const es = parseFloat(engineSize);

    if (!installDate) {
      setError(t("battery_life.error_missing_date"));
      return false;
    }

    if (isNaN(es) || es <= 0) {
      setError(t("battery_life.error_invalid_engine_size"));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    setShowResult(false);

    setTimeout(() => {
      try {
        const es = parseFloat(engineSize);
        const cca = parseFloat(currentCCA) || 0;

        const installDateObj = new Date(installDate);
        const today = new Date();
        const ageInMs = today.getTime() - installDateObj.getTime();
        const batteryAge = ageInMs / (1000 * 60 * 60 * 24 * 365.25);

        let recommendedCCA: number;
        if (es < 2.0) recommendedCCA = 400;
        else if (es < 3.0) recommendedCCA = 500;
        else if (es < 4.0) recommendedCCA = 600;
        else if (es < 5.0) recommendedCCA = 700;
        else if (es < 6.0) recommendedCCA = 800;
        else recommendedCCA = 900;

        if (climate === 'cold') recommendedCCA += 100;
        else if (climate === 'hot') recommendedCCA -= 50;

        let currentCondition: string;
        let replacementRecommendation: string;
        let estimatedLifeRemaining: number;

        if (batteryAge < 3) {
          currentCondition = t("battery_life.condition_good");
          replacementRecommendation = t("battery_life.recommendation_monitor");
          estimatedLifeRemaining = 5 - batteryAge;
        } else if (batteryAge < 4) {
          currentCondition = t("battery_life.condition_fair");
          replacementRecommendation = t("battery_life.recommendation_test_annually");
          estimatedLifeRemaining = 5 - batteryAge;
        } else if (batteryAge < 5) {
          currentCondition = t("battery_life.condition_aging");
          replacementRecommendation = t("battery_life.recommendation_replace_soon");
          estimatedLifeRemaining = 5 - batteryAge;
        } else {
          currentCondition = t("battery_life.condition_old");
          replacementRecommendation = t("battery_life.recommendation_replace_now");
          estimatedLifeRemaining = 0;
        }

        if (cca > 0 && cca < recommendedCCA * 0.8) {
          replacementRecommendation = t("battery_life.recommendation_replace_insufficient_cca");
        }

        setResult({
          batteryAge,
          recommendedCCA,
          currentCondition,
          replacementRecommendation,
          estimatedLifeRemaining: Math.max(0, estimatedLifeRemaining),
        });

        setShowResult(true);
      } catch (err) {
        setError(t("battery_life.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setInstallDate('');
      setEngineSize('');
      setCurrentCCA('');
      setClimate('moderate');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const climateOptions = [
    { value: 'cold', label: t("battery_life.climate_cold") },
    { value: 'moderate', label: t("battery_life.climate_moderate") },
    { value: 'hot', label: t("battery_life.climate_hot") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">{t("battery_life.title")}</div>
      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("battery_life.install_date")}
          tooltip={t("battery_life.install_date_tooltip")}
        >
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-muted-foreground">
              <Calendar className="h-4 w-4" />
            </div>
            <input
              type="date"
              value={installDate}
              onChange={(e) => { setInstallDate(e.target.value); if (error) setError(''); }}
              onKeyPress={handleKeyPress}
              className="date-input-rtl w-full h-10 rounded-md border border-input bg-background px-3 ps-9 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
        </FormField>

        <FormField
          label={t("battery_life.engine_size")}
          tooltip={t("battery_life.engine_size_tooltip")}
        >
          <NumberInput
            value={engineSize}
            onValueChange={(val) => { setEngineSize(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("battery_life.placeholders.engine_size")}
            min={0}
            step={0.1}
            startIcon={<Activity className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("battery_life.current_cca")}
          tooltip={t("battery_life.current_cca_tooltip")}
        >
          <NumberInput
            value={currentCCA}
            onValueChange={(val) => { setCurrentCCA(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("battery_life.placeholders.current_cca")}
            min={0}
            step={50}
            startIcon={<Battery className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("battery_life.climate")}
          tooltip={t("battery_life.climate_tooltip")}
        >
          <Combobox
            options={climateOptions}
            value={climate}
            onChange={(val) => setClimate(val)}
            placeholder={t("battery_life.climate")}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button
          onClick={calculate}
          className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Calculator className="w-5 h-5 ml-1" />
          {t("common.calculate")}
        </button>
        <button
          onClick={resetCalculator}
          className="outline-button min-w-[120px] flex items-center justify-center"
        >
          <RotateCcw className="w-5 h-5 ml-1" />
          {t("common.reset")}
        </button>
      </div>

      {error && (
        <div className="text-error mt-4 p-3 bg-error/10 rounded-lg border border-error/20 flex items-center animate-fadeIn max-w-md mx-auto">
          <Info className="w-5 h-5 ml-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t("battery_life.about_title")}</h2>
          <p className="text-foreground-70">{t("battery_life.about_description")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("battery_life.battery_age_label")}</div>
        <div className="text-4xl font-bold text-primary mb-2">{(result.batteryAge).toFixed(2)} {t("battery_life.years")}</div>
        <div className="text-lg text-foreground-70">{result.currentCondition}</div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t("battery_life.battery_details")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Activity className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("battery_life.recommended_cca_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">{result.recommendedCCA} CCA</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Battery className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("battery_life.life_remaining_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.estimatedLifeRemaining).toFixed(2)} {t("battery_life.years")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-warning/10 rounded-lg border border-warning/20">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-warning ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("battery_life.recommendation_title")}</h4>
            <p className="text-sm text-foreground-70">{result.replacementRecommendation}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("battery_life.title")}
      description={t("battery_life.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
