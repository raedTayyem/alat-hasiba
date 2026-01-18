'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Scale, Flame, TrendingUp, Info, Utensils } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function WeightGainCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common']);

  const [tdee, setTdee] = useState<string>('');
  const [targetGain, setTargetGain] = useState<string>('0.5');
  const [weight, setWeight] = useState<string>('');
  const [result, setResult] = useState<{
    dailyCalories: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null>(null);

  const calculate = () => {
    const tdeeVal = parseFloat(tdee);
    const gainVal = parseFloat(targetGain);
    const weightVal = parseFloat(weight);
    if (!tdeeVal || !gainVal || !weightVal) return;

    const surplus = (gainVal * 7700) / 7; // Weekly gain to daily surplus
    const dailyCalories = tdeeVal + surplus;

    // Macros for bulking
    const protein = weightVal * 2.2;
    const fat = (dailyCalories * 0.25) / 9;
    const carbs = (dailyCalories - (protein * 4) - (fat * 9)) / 4;

    setResult({
      dailyCalories: Math.round(dailyCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat)
    });
  };

  const reset = () => {
    setTdee('');
    setTargetGain('0.5');
    setWeight('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("weight-gain-calculator.tdee")} tooltip={t("weight-gain-calculator.tdee_tooltip")}>
          <NumberInput
            value={tdee}
            onValueChange={(val) => setTdee(val.toString())}
            placeholder={t("weight-gain-calculator.enter_tdee")}
            min={1}
            startIcon={<Flame className="h-4 w-4" />}
          />
        </FormField>
        <FormField label={t("weight-gain-calculator.weight")} tooltip={t("weight-gain-calculator.weight_tooltip")}>
          <NumberInput
            value={weight}
            onValueChange={(val) => setWeight(val.toString())}
            placeholder={t("weight-gain-calculator.enter_weight")}
            min={1}
            step={0.1}
            startIcon={<Scale className="h-4 w-4" />}
          />
        </FormField>
        <FormField label={t("weight-gain-calculator.target_gain")} tooltip={t("weight-gain-calculator.target_gain_tooltip")} className="md:col-span-2">
          <NumberInput
            value={targetGain}
            onValueChange={(val) => setTargetGain(val.toString())}
            placeholder="0.5"
            min={0.1}
            max={1}
            step={0.1}
            startIcon={<TrendingUp className="h-4 w-4" />}
          />
        </FormField>
      </div>
      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("weight-gain-calculator.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("weight-gain-calculator.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("weight-gain-calculator.results_title")}</h3>
      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
            <Flame className="w-4 h-4" />
            {t("weight-gain-calculator.daily_calories")}
          </div>
          <div className="text-3xl font-bold text-primary">{result.dailyCalories} {t("weight-gain-calculator.calories_unit")}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Utensils className="w-4 h-4" />
              {t("weight-gain-calculator.macros")}
            </div>
            <div className="text-xl font-bold text-blue-600">{result.protein} {t("weight-gain-calculator.protein_unit")}</div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("weight-gain-calculator.carbs")}
            </div>
            <div className="text-xl font-bold text-green-600">{result.carbs} {t("weight-gain-calculator.carbs_unit")}</div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("weight-gain-calculator.fat")}
            </div>
            <div className="text-xl font-bold text-purple-600">{result.fat} {t("weight-gain-calculator.fat_unit")}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("weight-gain-calculator.tips_title")}</h4>
            <p className="text-sm text-foreground-70">{t("weight-gain-calculator.tips_list")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <TrendingUp className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("weight-gain-calculator.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("weight-gain-calculator.title")}
      description={t("weight-gain-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("weight-gain-calculator.footer_note")}
     className="rtl" />
  );
}
