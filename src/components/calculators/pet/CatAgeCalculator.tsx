'use client';

/**
 * Cat Age Calculator
 * Converts cat years to human years
 * Formula: First year = 15, Second year = 9, Each additional year = 4
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  humanYears: number;
  lifeStage: string;
  healthTips: string[];
}

export default function CatAgeCalculator() {
  const { t } = useTranslation('calc/pet');
  const [catAge, setCatAge] = useState<string>('');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');
    const age = parseFloat(catAge);

    if (isNaN(age)) {
      setError(t("cat_age_calculator.error_invalid"));
      return false;
    }

    if (age <= 0) {
      setError(t("cat_age_calculator.error_positive"));
      return false;
    }

    if (age > 30) {
      setError(t("cat_age_calculator.error_max_age"));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    setShowResult(false);

    setTimeout(() => {
      try {
        const age = parseFloat(catAge);
        let humanYears = 0;

        // Standard cat age formula
        if (age <= 1) {
          humanYears = 15 * age;
        } else if (age <= 2) {
          humanYears = 15 + 9 * (age - 1);
        } else {
          humanYears = 15 + 9 + 4 * (age - 2);
        }

        // Determine life stage
        let lifeStage = '';
        if (age < 1) {
          lifeStage = t("cat_age_calculator.stage_kitten");
        } else if (age < 3) {
          lifeStage = t("cat_age_calculator.stage_young");
        } else if (age < 7) {
          lifeStage = t("cat_age_calculator.stage_adult");
        } else if (age < 11) {
          lifeStage = t("cat_age_calculator.stage_mature");
        } else if (age < 15) {
          lifeStage = t("cat_age_calculator.stage_senior");
        } else {
          lifeStage = t("cat_age_calculator.stage_geriatric");
        }

        // Health tips based on life stage
        const healthTips: string[] = [];
        if (age < 1) {
          healthTips.push(t("cat_age_calculator.tip_kitten_1"));
          healthTips.push(t("cat_age_calculator.tip_kitten_2"));
          healthTips.push(t("cat_age_calculator.tip_kitten_3"));
        } else if (age < 7) {
          healthTips.push(t("cat_age_calculator.tip_adult_1"));
          healthTips.push(t("cat_age_calculator.tip_adult_2"));
          healthTips.push(t("cat_age_calculator.tip_adult_3"));
        } else {
          healthTips.push(t("cat_age_calculator.tip_senior_1"));
          healthTips.push(t("cat_age_calculator.tip_senior_2"));
          healthTips.push(t("cat_age_calculator.tip_senior_3"));
        }

        setResult({
          humanYears: Math.round(humanYears),
          lifeStage,
          healthTips
        });

        setShowResult(true);
      } catch (err) {
        setError(t("cat_age_calculator.error_calculation")); // Fallback or reuse generic error
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setCatAge('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') calculate();
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("cat_age_calculator.title")}</div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer
          label={t("cat_age_calculator.label_age")}
          tooltip={t("cat_age_calculator.tooltip_age")}
        >
          <input
            type="number"
            value={catAge}
            onChange={(e) => {
              setCatAge(e.target.value);
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            placeholder={t("cat_age_calculator.placeholder_age")}
            dir="ltr"
            step="0.1"
            min="0"
            max="30"
          />
        </InputContainer>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons
          onCalculate={calculate}
          onReset={resetCalculator}
          calculateText={t("cat_age_calculator.calculate_btn")}
          resetText={t("cat_age_calculator.reset_btn")}
        />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t("cat_age_calculator.info_title")}</h2>
            <p className="text-foreground-70 mb-3">{t("cat_age_calculator.info_description")}</p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t("cat_age_calculator.use_cases_title")}</h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("cat_age_calculator.use_case_1")}</li>
              <li>{t("cat_age_calculator.use_case_2")}</li>
              <li>{t("cat_age_calculator.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("cat_age_calculator.result_label")}</div>
        <div className="text-4xl font-bold text-primary mb-2" dir="ltr">{result.humanYears}</div>
        <div className="text-lg text-foreground-70">{t("cat_age_calculator.result_unit")}</div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="font-medium">{t("cat_age_calculator.life_stage")}</div>
          </div>
          <div className="text-lg font-semibold text-primary">{result.lifeStage}</div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-3">
            <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="font-medium">{t("cat_age_calculator.health_tips")}</div>
          </div>
          <ul className="list-disc list-inside space-y-2 text-foreground-70">
            {result.healthTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout title={t("cat_age_calculator.title")}
      description={t("cat_age_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
