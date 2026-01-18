'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function DogPregnancyCalculator() {
  const { t, i18n } = useTranslation('calc/pet');
  const isRTL = i18n.language === 'ar';
  const [matingDate, setMatingDate] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<{
    dueDate: string;
    daysRemaining: number;
    currentWeek: number;
    stage: string;
    stageEn: string;
  } | null>(null);

  const GESTATION_DAYS = 63; // Average dog gestation period

  const calculate = () => {
    setError('');
    if (!matingDate) {
      setError(t("dog-pregnancy-calculator.error_no_date"));
      return;
    }

    const mating = new Date(matingDate);
    const today = new Date();
    const dueDate = new Date(mating);
    dueDate.setDate(dueDate.getDate() + GESTATION_DAYS);

    const daysElapsed = Math.floor((today.getTime() - mating.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = GESTATION_DAYS - daysElapsed;
    const currentWeek = Math.floor(daysElapsed / 7) + 1;

    let stage = '';
    let stageEn = '';

    if (daysElapsed < 0) {
      stage = t("dog_pregnancy_calculator.before_mating");
      stageEn = 'Before Mating';
    } else if (daysElapsed <= 21) {
      stage = t("dog_pregnancy_calculator.early_stage");
      stageEn = 'Early Stage';
    } else if (daysElapsed <= 42) {
      stage = t("dog_pregnancy_calculator.middle_stage");
      stageEn = 'Middle Stage';
    } else if (daysElapsed <= 63) {
      stage = t("dog_pregnancy_calculator.late_stage");
      stageEn = 'Late Stage';
    } else {
      stage = t("dog_pregnancy_calculator.overdue");
      stageEn = 'Overdue';
    }

    setResult({
      dueDate: dueDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      daysRemaining: Math.max(0, daysRemaining),
      currentWeek: Math.max(1, currentWeek),
      stage,
      stageEn
    });
  };

  const reset = () => {
    setMatingDate('');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("dog-pregnancy-calculator.input_title")}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <InputContainer
          label={t("dog-pregnancy-calculator.mating_date")}
          tooltip={t("dog-pregnancy-calculator.mating_date_tooltip")}
        >
          <input
            type="date"
            value={matingDate}
            onChange={(e) => setMatingDate(e.target.value)}
            className="calculator-input w-full"
            max={new Date().toISOString().split('T')[0]}
          />
        </InputContainer>
      </div>

      <CalculatorButtons
        onCalculate={calculate}
        onReset={reset}
        calculateText={t("dog-pregnancy-calculator.calculate_btn")}
        resetText={t("dog-pregnancy-calculator.reset_btn")}
      />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("dog-pregnancy-calculator.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("dog-pregnancy-calculator.due_date")}
          </div>
          <div className="text-2xl font-bold text-primary">
            {result.dueDate}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("dog-pregnancy-calculator.days_remaining")}
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {result.daysRemaining} {t("dog-pregnancy-calculator.days_unit")}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("dog-pregnancy-calculator.current_week")}
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {result.currentWeek}
            </div>
          </div>
        </div>

        <div className="bg-foreground/5 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("dog-pregnancy-calculator.stage")}
          </div>
          <div className="text-xl font-bold">
            {isRTL ? result.stage : result.stageEn}
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/20 rounded-lg">
          <h4 className="font-bold mb-2">
            {t("dog-pregnancy-calculator.week_1_3")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            {(t("dog-pregnancy-calculator.tips", { returnObjects: true }) as string[]).map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/20 rounded-lg">
          <h4 className="font-bold mb-2">
            {t("dog-pregnancy-calculator.week_4_6")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            {(t("dog-pregnancy-calculator.tips", { returnObjects: true }) as string[]).map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <span className="text-6xl">&#129328;</span>
      </div>
      <p className="text-foreground-70">
        {t("dog-pregnancy-calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("dog-pregnancy-calculator.title")}
      description={t("dog-pregnancy-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("dog-pregnancy-calculator.footer_note")}
     className="rtl" />
  );
}
