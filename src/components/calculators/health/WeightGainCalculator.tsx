'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

export default function WeightGainCalculator() {
  const { t, i18n } = useTranslation(['calc/health', 'common']);
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [targetWeight, setTargetWeight] = useState<string>('');
  const [dailySurplus, setDailySurplus] = useState<string>('300');
  const [daysToGoal, setDaysToGoal] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (error) setError('');
  }, [currentWeight, targetWeight, dailySurplus]);

  const calculateWeightGain = () => {
    if (!currentWeight || !targetWeight || !dailySurplus) {
      setError(t("common.errors.invalid"));
      return;
    }

    const currentWeightNum = parseFloat(currentWeight);
    const targetWeightNum = parseFloat(targetWeight);
    const dailySurplusNum = parseFloat(dailySurplus);

    if (currentWeightNum <= 0 || targetWeightNum <= 0 || dailySurplusNum <= 0) {
      setError(t("common.errors.positiveNumber"));
      return;
    }

    if (targetWeightNum <= currentWeightNum) {
      setError(t("weight_gain.errors.target_must_be_more"));
      return;
    }

    // 1 kg gain = 7700 calories surplus
    const weightToGain = targetWeightNum - currentWeightNum;
    const totalCalorieSurplus = weightToGain * 7700;
    const days = Math.ceil(totalCalorieSurplus / dailySurplusNum);

    setShowResult(false);
    setTimeout(() => {
      setDaysToGoal(days);
      setShowResult(true);
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setCurrentWeight('');
      setTargetWeight('');
      setDailySurplus('300');
      setDaysToGoal(null);
      setError('');
    }, 300);
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("weight_gain.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer label={t("body_fat.inputs.weight")} tooltip={t("weight_gain.tooltips.current_weight")}>
          <NumberInput
            value={currentWeight}
            onValueChange={(val) => setCurrentWeight(String(val))}
            onKeyPress={(e) => e.key === 'Enter' && calculateWeightGain()}
            placeholder="60"
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("weight_gain.inputs.target_weight_kg")} tooltip={t("weight_gain.tooltips.target_weight")}>
          <NumberInput
            value={targetWeight}
            onValueChange={(val) => setTargetWeight(String(val))}
            onKeyPress={(e) => e.key === 'Enter' && calculateWeightGain()}
            placeholder="70"
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("weight_gain.inputs.daily_calorie_surplus")} tooltip={t("weight_gain.tooltips.calorie_surplus")}>
          <Combobox
            options={[
              { value: "200", label: `200 ${t("calorie.results.calories")} (${t("weight_gain.inputs.slow")})` },
              { value: "300", label: `300 ${t("calorie.results.calories")} (${t("weight_gain.inputs.moderate")})` },
              { value: "500", label: `500 ${t("calorie.results.calories")} (${t("weight_gain.inputs.fast")})` }
            ]}
            value={dailySurplus}
            onChange={setDailySurplus}
          />
        </InputContainer>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button onClick={calculateWeightGain} className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0">
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

      {daysToGoal === null && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t("weight_gain.about.title")}</h2>
          <p className="text-foreground-70">{t("weight_gain.about.desc")}</p>
        </div>
      )}
    </>
  );

  const resultSection = daysToGoal !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("weight_gain.results.time_to_goal")}</div>
        <div className="text-4xl font-bold text-primary mb-2">{Math.ceil(daysToGoal / 7)}</div>
        <div className="text-lg text-foreground-70">{t("pregnancy.results.weeks")}</div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t("weight_gain.results.weight_gain_plan")}</h3>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t("weight_gain.results.days_to_goal")}</div>
            <div className="text-2xl font-bold text-primary">{daysToGoal} {t("pregnancy.results.days")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t("weight_gain.inputs.daily_calorie_surplus")}</div>
            <div className="text-2xl font-bold text-success">{dailySurplus} {t("calorie.results.calories")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t("weight_gain.results.weekly_weight_gain")}</div>
            <div className="text-2xl font-bold text-info">{((parseFloat(dailySurplus) * 7) / 7700).toFixed(2)} kg</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t("weight_gain.results.estimated_completion")}</div>
            <div className="text-lg font-bold">
              {new Date(Date.now() + daysToGoal * 24 * 60 * 60 * 1000).toLocaleDateString(i18n.language)}
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
            <h4 className="font-medium mb-1">{t("common.info")}</h4>
            <p className="text-sm text-foreground-70">{t("weight_gain.about.note")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("weight_gain.title")}
      description={t("weight_gain.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
