'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Scale, Target, TrendingDown, Info, Calendar } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function WeightLossTimeCalculator() {
  const { t, i18n } = useTranslation(['calc/fitness', 'common']);

  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [targetWeight, setTargetWeight] = useState<string>('');
  const [weeklyLoss, setWeeklyLoss] = useState<string>('0.5');
  const [result, setResult] = useState<{
    weeks: number;
    months: number;
    targetDate: string;
  } | null>(null);

  const calculate = () => {
    const currentVal = parseFloat(currentWeight);
    const targetVal = parseFloat(targetWeight);
    const lossVal = parseFloat(weeklyLoss);
    if (!currentVal || !targetVal || !lossVal) return;

    const totalLoss = currentVal - targetVal;
    const weeks = Math.ceil(totalLoss / lossVal);
    const months = parseFloat((weeks / 4.33).toFixed(1));

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + weeks * 7);

    setResult({
      weeks,
      months,
      targetDate: targetDate.toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' })
    });
  };

  const reset = () => {
    setCurrentWeight('');
    setTargetWeight('');
    setWeeklyLoss('0.5');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("weight-loss-time-calculator.current_weight")}
          tooltip={t("weight-loss-time-calculator.current_weight_tooltip")}
        >
          <NumberInput
            value={currentWeight}
            onValueChange={(val) => setCurrentWeight(val.toString())}
            placeholder={t("weight-loss-time-calculator.enter_weight")}
            min={1}
            step={0.1}
            startIcon={<Scale className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("weight-loss-time-calculator.target_weight")}
          tooltip={t("weight-loss-time-calculator.target_weight_tooltip")}
        >
          <NumberInput
            value={targetWeight}
            onValueChange={(val) => setTargetWeight(val.toString())}
            placeholder={t("weight-loss-time-calculator.enter_weight")}
            min={1}
            step={0.1}
            startIcon={<Target className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("weight-loss-time-calculator.weekly_loss")}
          tooltip={t("weight-loss-time-calculator.weekly_loss_tooltip")}
          className="md:col-span-2"
        >
          <NumberInput
            value={weeklyLoss}
            onValueChange={(val) => setWeeklyLoss(val.toString())}
            placeholder="0.5"
            min={0.1}
            max={2}
            step={0.1}
            startIcon={<TrendingDown className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("weight-loss-time-calculator.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("weight-loss-time-calculator.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("weight-loss-time-calculator.results_title")}</h3>
      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("weight-loss-time-calculator.time_to_goal")}
          </div>
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            {result.weeks} {t("weight-loss-time-calculator.weeks")} ({result.months} {t("weight-loss-time-calculator.months")})
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("weight-loss-time-calculator.target_date")}
          </div>
          <div className="text-xl font-bold text-green-600">{result.targetDate}</div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("weight-loss-time-calculator.tips_title")}</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">{t("weight-loss-time-calculator.tips_list")}</ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Scale className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("weight-loss-time-calculator.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("weight-loss-time-calculator.title")}
      description={t("weight-loss-time-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("weight-loss-time-calculator.footer_note")}
     className="rtl" />
  );
}
