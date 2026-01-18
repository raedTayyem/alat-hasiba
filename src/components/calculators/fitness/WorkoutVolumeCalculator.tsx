'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Activity, Repeat, Dumbbell, Calendar, Info, Zap } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function WorkoutVolumeCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common']);
  const [sets, setSets] = useState<string>('');
  const [reps, setReps] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [sessions, setSessions] = useState<string>('');
  const [result, setResult] = useState<{
    volumePerSession: number;
    weeklyVolume: number;
    totalReps: number;
    averageIntensity: number;
  } | null>(null);

  const calculate = () => {
    const setsVal = parseFloat(sets);
    const repsVal = parseFloat(reps);
    const weightVal = parseFloat(weight);
    const sessionsVal = parseFloat(sessions);

    if (!setsVal || !repsVal || !weightVal || !sessionsVal) return;

    const volumePerSession = setsVal * repsVal * weightVal;
    const weeklyVolume = volumePerSession * sessionsVal;
    const totalReps = setsVal * repsVal * sessionsVal;

    setResult({
      volumePerSession: Math.round(volumePerSession),
      weeklyVolume: Math.round(weeklyVolume),
      totalReps: Math.round(totalReps),
      averageIntensity: Math.round((weightVal / 100) * 100) // Placeholder
    });
  };

  const reset = () => {
    setSets('');
    setReps('');
    setWeight('');
    setSessions('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("workout_volume.sets")}
          tooltip={t("workout_volume.sets_tooltip")}
        >
          <NumberInput
            value={sets}
            onValueChange={(val) => setSets(val.toString())}
            placeholder={t("workout_volume.enter_sets")}
            min={1}
            startIcon={<Activity className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("workout_volume.reps")}
          tooltip={t("workout_volume.reps_tooltip")}
        >
          <NumberInput
            value={reps}
            onValueChange={(val) => setReps(val.toString())}
            placeholder={t("workout_volume.enter_reps")}
            min={1}
            startIcon={<Repeat className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("workout_volume.weight")}
          tooltip={t("workout_volume.weight_tooltip")}
        >
          <NumberInput
            value={weight}
            onValueChange={(val) => setWeight(val.toString())}
            placeholder={t("workout_volume.enter_weight")}
            min={1}
            step={0.5}
            startIcon={<Dumbbell className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("workout_volume.sessions")}
          tooltip={t("workout_volume.sessions_tooltip")}
        >
          <NumberInput
            value={sessions}
            onValueChange={(val) => setSessions(val.toString())}
            placeholder={t("workout_volume.enter_sessions")}
            min={1}
            max={7}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("workout_volume.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("workout_volume.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("workout_volume.results_title")}</h3>
      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("workout_volume.weekly_volume")}
          </div>
          <div className="text-3xl font-bold text-primary">{result.weeklyVolume} {t("common:common.units.kg")}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-foreground/5 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Zap className="w-4 h-4" />
              {t("workout_volume.session_volume")}
            </div>
            <div className="text-xl font-bold">{result.volumePerSession} {t("common:common.units.kg")}</div>
          </div>

          <div className="bg-foreground/5 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Repeat className="w-4 h-4" />
              {t("workout_volume.total_reps")}
            </div>
            <div className="text-xl font-bold">{result.totalReps} {t("workout_volume.reps_week")}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("workout_volume.tips_title")}</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">{t("workout_volume.tip_progressive")}</ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Activity className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("workout_volume.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("workout_volume.title")}
      description={t("workout_volume.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("workout_volume.footer_note")}
     className="rtl" />
  );
}
