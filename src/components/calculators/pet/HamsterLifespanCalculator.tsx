'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function HamsterLifespanCalculator() {
  const { t, i18n } = useTranslation('calc/pet');
  const isRTL = i18n.language === 'ar';
  const [hamsterType, setHamsterType] = useState<string>('syrian');
  const [currentAge, setCurrentAge] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<{
    averageLifespan: number;
    humanAge: number;
    remainingMonths: number;
    lifeStage: string;
    lifeStageEn: string;
  } | null>(null);

  const calculate = () => {
    setError('');
    const age = parseFloat(currentAge);
    if (!age || age <= 0) {
      setError(t("hamster_lifespan_calculator.error_invalid_age"));
      return;
    }

    // Average lifespan in months
    const lifespans: Record<string, number> = {
      syrian: 24,       // 2 years
      dwarf: 18,        // 1.5 years
      roborovski: 36,   // 3 years
      chinese: 24       // 2 years
    };

    const averageLifespan = lifespans[hamsterType];

    // Convert to human age (approximate: 1 hamster month = 2.5 human years)
    const humanAge = Math.round(age * 2.5);

    const remainingMonths = Math.max(0, averageLifespan - age);

    // Life stage
    let lifeStage = '';
    let lifeStageEn = '';

    if (age < 2) {
      lifeStage = t("hamster_lifespan_calculator.stage_juvenile");
      lifeStageEn = 'Juvenile';
    } else if (age < 12) {
      lifeStage = t("hamster_lifespan_calculator.stage_adult");
      lifeStageEn = 'Adult';
    } else if (age < 18) {
      lifeStage = t("hamster_lifespan_calculator.stage_senior");
      lifeStageEn = 'Senior';
    } else {
      lifeStage = t("hamster_lifespan_calculator.stage_elderly");
      lifeStageEn = 'Elderly';
    }

    setResult({
      averageLifespan,
      humanAge,
      remainingMonths,
      lifeStage,
      lifeStageEn
    });
  };

  const reset = () => {
    setHamsterType('syrian');
    setCurrentAge('');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("hamster_lifespan_calculator.title")}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("hamster_lifespan_calculator.label_type")}>
          <select value={hamsterType} onChange={(e: any) => setHamsterType(e.target.value)} className="calculator-input w-full">
            <option value="syrian">{t("hamster_lifespan_calculator.type_syrian")}</option>
            <option value="dwarf">{t("hamster_lifespan_calculator.type_dwarf")}</option>
            <option value="roborovski">{t("hamster_lifespan_calculator.type_roborovski")}</option>
            <option value="chinese">{t("hamster_lifespan_calculator.type_chinese")}</option>
          </select>
        </InputContainer>

        <InputContainer label={t("hamster_lifespan_calculator.label_age")}>
          <NumericInput value={currentAge} onChange={(e: any) => setCurrentAge(e.target.value)} unit={t("hamster_lifespan_calculator.unit_months")} placeholder={t("hamster_lifespan_calculator.placeholder_age")} min={0} max={48} step={1} />
        </InputContainer>
      </div>

      <CalculatorButtons
        onCalculate={calculate}
        onReset={reset}
        calculateText={t("hamster_lifespan_calculator.calculate_btn")}
        resetText={t("hamster_lifespan_calculator.reset_btn")}
      />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("hamster_lifespan_calculator.title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("hamster_lifespan_calculator.result_human_age")}</div>
          <div className="text-3xl font-bold text-primary">{result.humanAge} {t("hamster_lifespan_calculator.unit_years")}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("hamster_lifespan_calculator.result_avg_lifespan")}</div>
            <div className="text-2xl font-bold text-blue-600">{result.averageLifespan} {t("hamster_lifespan_calculator.unit_months")}</div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("hamster_lifespan_calculator.result_remaining")}</div>
            <div className="text-2xl font-bold text-blue-600">{result.remainingMonths} {t("hamster_lifespan_calculator.unit_months")}</div>
          </div>
        </div>

        <div className="bg-foreground/5 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("hamster_lifespan_calculator.result_life_stage")}</div>
          <div className="text-xl font-bold">{isRTL ? result.lifeStage : result.lifeStageEn}</div>
        </div>

        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 rounded-lg">
          <h4 className="font-bold mb-2">{t("hamster_lifespan_calculator.tips_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            {(t("hamster-lifespan-calculator.tips", { returnObjects: true }) as string[]).map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4"><span className="text-6xl">🐹</span></div>
      <p className="text-foreground-70">{t("hamster_lifespan_calculator.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("hamster_lifespan_calculator.title")}
      description={t("hamster_lifespan_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("hamster-lifespan-calculator.tips.0")}
     className="rtl" />
  );
}
