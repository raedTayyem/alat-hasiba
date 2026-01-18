'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

interface WHRResult {
  whr: number;
  category: string;
  healthRisk: string;
}

export default function WaistToHipRatioCalculator() {
  const { t } = useTranslation(['calc/health', 'common']);
  const [waist, setWaist] = useState<string>('');
  const [hip, setHip] = useState<string>('');
  const [gender, setGender] = useState<string>('male');
  const [result, setResult] = useState<WHRResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (error) setError('');
  }, [waist, hip]);

  const calculateWHR = () => {
    if (!waist || !hip) {
      setError(t("common.errors.invalid"));
      return;
    }

    const waistNum = parseFloat(waist);
    const hipNum = parseFloat(hip);

    if (waistNum <= 0 || hipNum <= 0) {
      setError(t("common.errors.positiveNumber"));
      return;
    }

    const whr = waistNum / hipNum;

    let category: string;
    let healthRisk: string;

    if (gender === 'male') {
      if (whr < 0.90) {
        category = t("whr.results.low_risk");
        healthRisk = t("whr.results.low");
      } else if (whr >= 0.90 && whr < 1.0) {
        category = t("whr.results.moderate_risk");
        healthRisk = t("whr.results.moderate");
      } else {
        category = t("whr.results.high_risk");
        healthRisk = t("whr.results.high");
      }
    } else {
      if (whr < 0.85) {
        category = t("whr.results.low_risk");
        healthRisk = t("whr.results.low");
      } else if (whr >= 0.85 && whr < 0.90) {
        category = t("whr.results.moderate_risk");
        healthRisk = t("whr.results.moderate");
      } else {
        category = t("whr.results.high_risk");
        healthRisk = t("whr.results.high");
      }
    }

    setShowResult(false);
    setTimeout(() => {
      setResult({ whr, category, healthRisk });
      setShowResult(true);
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setWaist('');
      setHip('');
      setGender('male');
      setResult(null);
      setError('');
    }, 300);
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("whr.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer label={t("whr.inputs.waist")} tooltip={t("whr.tooltips.waist")}>
          <NumberInput
            value={waist}
            onValueChange={(val) => setWaist(String(val))}
            onKeyPress={(e) => e.key === 'Enter' && calculateWHR()}
            placeholder="80"
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("whr.inputs.hip")} tooltip={t("whr.tooltips.hip")}>
          <NumberInput
            value={hip}
            onValueChange={(val) => setHip(String(val))}
            onKeyPress={(e) => e.key === 'Enter' && calculateWHR()}
            placeholder="100"
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("whr.inputs.gender")} tooltip={t("macro.tooltips.gender")}>
          <Combobox
            options={[
              { value: "male", label: t("body_fat.inputs.male") },
              { value: "female", label: t("body_fat.inputs.female") }
            ]}
            value={gender}
            onChange={setGender}
          />
        </InputContainer>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button onClick={calculateWHR} className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0">
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
          <h2 className="font-bold mb-2 text-lg">{t("whr.about.title")}</h2>
          <p className="text-foreground-70">{t("whr.about.desc")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("whr.results.ratio")}</div>
        <div className="text-4xl font-bold text-primary mb-2">{result.whr.toFixed(2)}</div>
        <div className="text-lg text-foreground-70">{result.category}</div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t("whr.results.health_assessment")}</h3>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t("whr.results.health_risk")}</div>
            <div className="text-2xl font-bold text-warning">{result.healthRisk}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-3">{t("whr.results.risk_guidelines")}</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t("common.male")}: &lt;0.90</span>
                <span className="text-success">{t("whr.results.low_risk")}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("common.male")}: &gt;0.90</span>
                <span className="text-error">{t("whr.results.high_risk")}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("common.female")}: &lt;0.85</span>
                <span className="text-success">{t("whr.results.low_risk")}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("common.female")}: &gt;0.85</span>
                <span className="text-error">{t("whr.results.high_risk")}</span>
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
            <p className="text-sm text-foreground-70">WHR = {t("whr.inputs.waist")} / {t("whr.inputs.hip")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("whr.title")}
      description={t("whr.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
