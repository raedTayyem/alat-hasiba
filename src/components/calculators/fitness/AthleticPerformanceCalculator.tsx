'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Timer, ArrowUp, Dumbbell, Scale, Calculator, RotateCcw, Info, Trophy, Activity } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function AthleticPerformanceCalculator() {
  const { t } = useTranslation('calc/fitness');

  const [sprint40m, setSprint40m] = useState<string>('');
  const [verticalJump, setVerticalJump] = useState<string>('');
  const [benchPress, setBenchPress] = useState<string>('');
  const [squat, setSquat] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [result, setResult] = useState<{
    overallScore: number;
    category: string;
    strengths: string[];
  } | null>(null);

  const calculate = () => {
    const sprintVal = parseFloat(sprint40m);
    const jumpVal = parseFloat(verticalJump);
    const benchVal = parseFloat(benchPress);
    const squatVal = parseFloat(squat);
    const weightVal = parseFloat(weight);

    if (!sprintVal || !jumpVal || !benchVal || !squatVal || !weightVal) return;

    // Scoring system (simple)
    const sprintScore = sprintVal < 5.0 ? 100 : sprintVal < 5.5 ? 80 : sprintVal < 6.0 ? 60 : 40;
    const jumpScore = jumpVal > 70 ? 100 : jumpVal > 60 ? 80 : jumpVal > 50 ? 60 : 40;
    const benchScore = (benchVal / weightVal) > 1.5 ? 100 : (benchVal / weightVal) > 1.2 ? 80 : 60;
    const squatScore = (squatVal / weightVal) > 2.0 ? 100 : (squatVal / weightVal) > 1.5 ? 80 : 60;

    const overallScore = Math.round((sprintScore + jumpScore + benchScore + squatScore) / 4);

    let category = '';
    if (overallScore >= 90) category = t("athletic_performance.elite");
    else if (overallScore >= 75) category = t("athletic_performance.excellent");
    else if (overallScore >= 60) category = t("athletic_performance.good");
    else category = t("athletic_performance.average");

    const strengths = [];
    if (sprintScore >= 80) strengths.push(t("athletic_performance.speed"));
    if (jumpScore >= 80) strengths.push(t("athletic_performance.power"));
    if (benchScore >= 80) strengths.push(t("athletic_performance.upper_strength"));
    if (squatScore >= 80) strengths.push(t("athletic_performance.lower_strength"));

    setResult({ overallScore, category, strengths });
  };

  const reset = () => {
    setSprint40m('');
    setVerticalJump('');
    setBenchPress('');
    setSquat('');
    setWeight('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("athletic_performance.sprint_label")}
          tooltip={t("athletic_performance.sprint_tooltip")}
        >
          <NumberInput
            value={sprint40m}
            onValueChange={(val) => setSprint40m(val.toString())}
            placeholder={t("athletic_performance.enter_time")}
            min={1}
            step={0.1}
            startIcon={<Timer className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("athletic_performance.jump_label")}
          tooltip={t("athletic_performance.jump_tooltip")}
        >
          <NumberInput
            value={verticalJump}
            onValueChange={(val) => setVerticalJump(val.toString())}
            placeholder={t("athletic_performance.enter_cm")}
            min={1}
            startIcon={<ArrowUp className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("athletic_performance.bench_label")}
          tooltip={t("athletic_performance.bench_tooltip")}
        >
          <NumberInput
            value={benchPress}
            onValueChange={(val) => setBenchPress(val.toString())}
            placeholder={t("athletic_performance.enter_kg")}
            min={1}
            step={0.5}
            startIcon={<Dumbbell className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("athletic_performance.squat_label")}
          tooltip={t("athletic_performance.squat_tooltip")}
        >
          <NumberInput
            value={squat}
            onValueChange={(val) => setSquat(val.toString())}
            placeholder={t("athletic_performance.enter_kg")}
            min={1}
            step={0.5}
            startIcon={<Dumbbell className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("athletic_performance.weight_label")}
          tooltip={t("athletic_performance.weight_tooltip")}
          className="md:col-span-2"
        >
          <NumberInput
            value={weight}
            onValueChange={(val) => setWeight(val.toString())}
            placeholder={t("athletic_performance.enter_kg")}
            min={1}
            step={0.1}
            startIcon={<Scale className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("athletic_performance.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("athletic_performance.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("athletic_performance.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("athletic_performance.overall_score")}
          </div>
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            {result.overallScore}/100
          </div>
          <div className="text-sm text-foreground-70 mt-1 flex items-center gap-1">
            <Activity className="w-4 h-4" />
            {t("athletic_performance.category")} {result.category}
          </div>
        </div>

        {result.strengths.length > 0 && (
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-2 font-medium">{t("athletic_performance.strengths_title")}</div>
            <div className="flex flex-wrap gap-2">
              {result.strengths.map((strength, index) => (
                <span key={index} className="bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
                  {strength}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Activity className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("athletic_performance.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("athletic_performance.title")}
      description={t("athletic_performance.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("athletic_performance.footer_note")}
     className="rtl" />
  );
}
