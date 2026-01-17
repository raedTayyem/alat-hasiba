'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Dumbbell, Repeat, Info, Trophy, BarChart2 } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function OneRepMaxCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common']);
  const [weight, setWeight] = useState<string>('');
  const [reps, setReps] = useState<string>('');
  const [result, setResult] = useState<{
    epley: number;
    brzycki: number;
    lander: number;
    average: number;
    percentages: { percentage: number; weight: number }[];
  } | null>(null);
  const [error, setError] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);

  // Clear errors when inputs change
  useEffect(() => {
    if (error) setError('');
  }, [weight, reps]);

  const calculate = () => {
    const weightVal = parseFloat(weight);
    const repsVal = parseFloat(reps);

    // Validation
    if (!weight || !reps) {
      setError(t("one_rep_max.errors.all_fields"));
      return;
    }

    if (weightVal <= 0) {
      setError(t("one_rep_max.errors.invalid_weight"));
      return;
    }

    if (repsVal < 1 || repsVal > 12) {
      setError(t("one_rep_max.errors.invalid_reps"));
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      // Different 1RM formulas
      const epley = weightVal * (1 + repsVal / 30);
      const brzycki = weightVal * (36 / (37 - repsVal));
      const lander = (100 * weightVal) / (101.3 - 2.67123 * repsVal);
      const average = (epley + brzycki + lander) / 3;

      // Training percentages
      const percentages = [
        { percentage: 100, weight: average },
        { percentage: 95, weight: average * 0.95 },
        { percentage: 90, weight: average * 0.90 },
        { percentage: 85, weight: average * 0.85 },
        { percentage: 80, weight: average * 0.80 },
        { percentage: 75, weight: average * 0.75 },
        { percentage: 70, weight: average * 0.70 },
        { percentage: 65, weight: average * 0.65 },
        { percentage: 60, weight: average * 0.60 }
      ];

      setResult({
        epley: parseFloat(epley.toFixed(1)),
        brzycki: parseFloat(brzycki.toFixed(1)),
        lander: parseFloat(lander.toFixed(1)),
        average: parseFloat(average.toFixed(1)),
        percentages: percentages.map(p => ({ ...p, weight: parseFloat(p.weight.toFixed(1)) }))
      });

      setShowResult(true);
    }, 300);
  };

  const reset = () => {
    setShowResult(false);
    setTimeout(() => {
      setWeight('');
      setReps('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("one_rep_max.inputs.title")}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("one_rep_max.inputs.weight")} tooltip={t("one_rep_max.tooltips.weight")}>
          <NumberInput
            value={weight}
            onValueChange={(val) => setWeight(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("one_rep_max.placeholders.weight")}
            min={1}
            max={1000}
            step={0.5}
            startIcon={<Dumbbell className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("one_rep_max.inputs.reps")} tooltip={t("one_rep_max.tooltips.reps")}>
          <NumberInput
            value={reps}
            onValueChange={(val) => setReps(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("one_rep_max.placeholders.reps")}
            min={1}
            max={12}
            startIcon={<Repeat className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("common.calculate")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("common.reset")}
        </button>
      </div>

      {error && (
        <div className="text-error mt-3 p-3 bg-error/10 rounded-lg border border-error/20 flex items-center animate-fadeIn">
          <Info className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="mr-2">{error}</span>
        </div>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("one_rep_max.results.title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("one_rep_max.results.average_1rm")}
          </div>
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            {result.average} {t("one_rep_max.results.unit")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("one_rep_max.results.formulas.epley")}</div>
            <div className="text-xl font-bold text-blue-600">
              {result.epley} {t("one_rep_max.results.unit")}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("one_rep_max.results.formulas.brzycki")}</div>
            <div className="text-xl font-bold text-green-600">
              {result.brzycki} {t("one_rep_max.results.unit")}
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("one_rep_max.results.formulas.lander")}</div>
            <div className="text-xl font-bold text-purple-600">
              {result.lander} {t("one_rep_max.results.unit")}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <BarChart2 className="w-4 h-4" />
            {t("one_rep_max.results.percentages_title")}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {result.percentages.map((p) => (
              <div key={p.percentage} className="bg-card p-2 rounded-lg border border-border">
                <div className="text-xs text-foreground-70">{p.percentage}{t("common:common.units.percent")}</div>
                <div className="font-bold">
                  {p.weight} {t("one_rep_max.results.unit")}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("one_rep_max.results.note_title")}</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">
              <li>{t("one_rep_max.results.note_content")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Calculator className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("one_rep_max.errors.empty_state.text")}</p>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("one_rep_max.title")}
      description={t("one_rep_max.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("one_rep_max.description")}
      className="rtl"
    />
  );
}
