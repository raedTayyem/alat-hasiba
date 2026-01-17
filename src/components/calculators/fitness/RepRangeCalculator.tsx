'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Target, Dumbbell, Repeat, Info, Clock, Activity } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

export default function RepRangeCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common']);

  const [goal, setGoal] = useState<string>('hypertrophy');
  const [oneRM, setOneRM] = useState<string>('');
  const [result, setResult] = useState<{
    reps: string;
    sets: string;
    weight: string;
    restTime: string;
  } | null>(null);

  const calculate = () => {
    const oneRMVal = parseFloat(oneRM);
    if (!oneRMVal) return;

    const goals: Record<string, any> = {
      strength: { reps: '1-5', sets: '3-6', percentage: 85, rest: t("rep_range_calculator.rest_times.strength") },
      power: { reps: '1-5', sets: '3-5', percentage: 80, rest: t("rep_range_calculator.rest_times.power") },
      hypertrophy: { reps: '6-12', sets: '3-5', percentage: 70, rest: t("rep_range_calculator.rest_times.hypertrophy") },
      endurance: { reps: '12-20', sets: '2-4', percentage: 60, rest: t("rep_range_calculator.rest_times.endurance") }
    };

    const targetGoal = goals[goal];
    const weight = Math.round(oneRMVal * (targetGoal.percentage / 100));

    setResult({
      reps: targetGoal.reps,
      sets: targetGoal.sets,
      weight: `${weight}`,
      restTime: targetGoal.rest
    });
  };

  const reset = () => {
    setGoal('hypertrophy');
    setOneRM('');
    setResult(null);
  };

  const goalOptions = [
    { value: 'strength', label: t("rep_range_calculator.goals.strength") },
    { value: 'power', label: t("rep_range_calculator.goals.power") },
    { value: 'hypertrophy', label: t("rep_range_calculator.goals.hypertrophy") },
    { value: 'endurance', label: t("rep_range_calculator.goals.endurance") },
  ];

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("rep_range_calculator.goal")}
          tooltip={t("rep_range_calculator.goal_tooltip")}
        >
          <Combobox
            options={goalOptions}
            value={goal}
            onChange={(val) => setGoal(val)}
            placeholder={t("rep_range_calculator.goal")}
          />
        </FormField>

        <FormField
          label={t("rep_range_calculator.one_rm")}
          tooltip={t("rep_range_calculator.one_rm_tooltip")}
        >
          <NumberInput
            value={oneRM}
            onValueChange={(val) => setOneRM(val.toString())}
            placeholder={t("rep_range_calculator.enter_weight")}
            min={1}
            step={0.5}
            startIcon={<Dumbbell className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("rep_range_calculator.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("rep_range_calculator.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("rep_range_calculator.results_title")}</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Repeat className="w-4 h-4" />
              {t("rep_range_calculator.reps")}
            </div>
            <div className="text-3xl font-bold text-primary">{result.reps}</div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Activity className="w-4 h-4" />
              {t("rep_range_calculator.sets")}
            </div>
            <div className="text-3xl font-bold text-blue-600">{result.sets}</div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Dumbbell className="w-4 h-4" />
              {t("rep_range_calculator.weight")}
            </div>
            <div className="text-2xl font-bold text-green-600">{result.weight} {t("common:common.units.kg")}</div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {t("rep_range_calculator.rest_times.label")}
            </div>
            <div className="text-2xl font-bold text-purple-600">{result.restTime}</div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Target className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("rep_range_calculator.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("rep_range_calculator.title")}
      description={t("rep_range_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("rep_range_calculator.footer_note")}
     className="rtl" />
  );
}
