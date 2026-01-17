'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';

interface LBMResult {
  lbm: number;
  fatMass: number;
  lbmPercentage: number;
  fatPercentage: number;
}

export default function LeanBodyMassCalculator() {
  const { t } = useTranslation(['calc/health', 'common']);
  const [weight, setWeight] = useState<string>('');
  const [bodyFat, setBodyFat] = useState<string>('');
  const [result, setResult] = useState<LBMResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (error) setError('');
  }, [weight, bodyFat]);

  const calculateLBM = () => {
    if (!weight || !bodyFat) {
      setError(t("common.errors.invalid"));
      return;
    }

    const weightNum = parseFloat(weight);
    const bodyFatNum = parseFloat(bodyFat);

    if (weightNum <= 0 || bodyFatNum < 0 || bodyFatNum > 100) {
      setError(t("lbm.errors.invalid_values"));
      return;
    }

    // LBM = Weight × (1 - Body Fat%)
    const bodyFatDecimal = bodyFatNum / 100;
    const lbm = weightNum * (1 - bodyFatDecimal);
    const fatMass = weightNum * bodyFatDecimal;

    setShowResult(false);
    setTimeout(() => {
      setResult({
        lbm: lbm,
        fatMass: fatMass,
        lbmPercentage: 100 - bodyFatNum,
        fatPercentage: bodyFatNum,
      });
      setShowResult(true);
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setWeight('');
      setBodyFat('');
      setResult(null);
      setError('');
    }, 300);
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("lbm.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer label={t("calorie.inputs.weight")} tooltip={t("lbm.tooltips.weight")}>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && calculateLBM()}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            placeholder={t("common.placeholders.enterValue")}
            dir="ltr"
          />
        </InputContainer>

        <InputContainer label={t("lbm.inputs.body_fat")} tooltip={t("lbm.tooltips.body_fat")}>
          <input
            type="number"
            value={bodyFat}
            onChange={(e) => setBodyFat(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && calculateLBM()}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            placeholder={t("common.placeholders.enterValue")}
            dir="ltr"
            step="0.1"
            min="0"
            max="100"
          />
        </InputContainer>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button onClick={calculateLBM} className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0">
          <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {t("common.calculate")}
        </button>
        <button onClick={resetCalculator} className="outline-button min-w-[120px]">
          <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t("common.reset")}
        </button>
      </div>

      {error && (
        <div className="text-error mt-4 p-3 bg-error/10 rounded-lg border border-error/20 flex items-center animate-fadeIn max-w-md mx-auto">
          <svg className="w-5 h-5 ml-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t("lbm.about.title")}</h2>
          <p className="text-foreground-70">{t("lbm.about.desc")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("lbm.results.lean_mass")}</div>
        <div className="text-4xl font-bold text-primary mb-2">{result.lbm.toFixed(1)}</div>
        <div className="text-lg text-foreground-70">{t("common:units.kg")}</div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t("body_fat.results.body_composition")}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div className="font-medium">{t("lbm.results.lean_mass")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.lbm.toFixed(1)} kg</div>
            <div className="text-sm text-foreground-70">{result.lbmPercentage.toFixed(1)}% {t("lbm.results.of_body_weight")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-warning ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium">{t("body_fat.results.fat_mass")}</div>
            </div>
            <div className="text-2xl font-bold text-warning">{result.fatMass.toFixed(1)} kg</div>
            <div className="text-sm text-foreground-70">{result.fatPercentage.toFixed(1)}% {t("lbm.results.of_body_weight")}</div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-3">{t("lbm.results.composition_breakdown")}</div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>{t("lbm.results.lean_mass")}</span>
                <span className="font-medium">{result.lbmPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-primary h-3 rounded-full" style={{ width: `${result.lbmPercentage}%` }}></div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>{t("body_fat.results.fat_mass")}</span>
                <span className="font-medium">{result.fatPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-warning h-3 rounded-full" style={{ width: `${result.fatPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("common.formula")}</h4>
            <p className="text-sm text-foreground-70">LBM = {t("calorie.inputs.weight")} × (1 - {t("lbm.inputs.body_fat")} / 100)</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("lbm.title")}
      description={t("lbm.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
