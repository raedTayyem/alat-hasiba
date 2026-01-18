'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Ruler, Scale, Zap, Info, ArrowUp } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function VerticalJumpCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common']);

  const [standingReach, setStandingReach] = useState<string>('');
  const [jumpReach, setJumpReach] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [result, setResult] = useState<{
    jumpHeight: number;
    power: number;
    category: string;
  } | null>(null);

  const calculate = () => {
    const standingVal = parseFloat(standingReach);
    const jumpVal = parseFloat(jumpReach);
    const weightVal = parseFloat(weight);

    if (!standingVal || !jumpVal || !weightVal) return;

    const jumpHeight = jumpVal - standingVal;

    // Lewis Formula for power (watts)
    const power = Math.sqrt(4.9) * weightVal * Math.sqrt(jumpHeight / 100);

    let category = '';
    if (jumpHeight < 40) category = t("athletic_performance.average");
    else if (jumpHeight < 50) category = t("athletic_performance.good");
    else if (jumpHeight < 60) category = t("athletic_performance.excellent");
    else if (jumpHeight < 70) category = t("athletic_performance.elite");
    else category = t("athletic_performance.elite");

    setResult({
      jumpHeight: parseFloat(jumpHeight.toFixed(1)),
      power: Math.round(power),
      category
    });
  };

  const reset = () => {
    setStandingReach('');
    setJumpReach('');
    setWeight('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("vertical_jump.standing_reach")}
          tooltip={t("vertical_jump.standing_reach_tooltip")}
        >
          <NumberInput
            value={standingReach}
            onValueChange={(val) => setStandingReach(val.toString())}
            placeholder={t("vertical_jump.enter_cm")}
            min={1}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("vertical_jump.jump_reach")}
          tooltip={t("vertical_jump.jump_reach_tooltip")}
        >
          <NumberInput
            value={jumpReach}
            onValueChange={(val) => setJumpReach(val.toString())}
            placeholder={t("vertical_jump.enter_cm")}
            min={1}
            startIcon={<ArrowUp className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("vertical_jump.weight")}
          tooltip={t("vertical_jump.weight_tooltip")}
          className="md:col-span-2"
        >
          <NumberInput
            value={weight}
            onValueChange={(val) => setWeight(val.toString())}
            placeholder={t("vertical_jump.enter_weight")}
            min={1}
            step={0.1}
            startIcon={<Scale className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("vertical_jump.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("vertical_jump.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("vertical_jump.results_title")}</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("vertical_jump.jump_height")}</div>
            <div className="text-3xl font-bold text-primary flex items-center gap-2">
              <ArrowUp className="w-6 h-6" />
              {result.jumpHeight} {t("common:common.units.cm")}
            </div>
            <div className="text-sm text-foreground-70 mt-1">{result.category}</div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Zap className="w-4 h-4" />
              {t("vertical_jump.power_output")}
            </div>
            <div className="text-2xl font-bold text-green-600">{result.power} {t("common:common.units.W")}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("vertical_jump.power_factors_title")}</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">{t("vertical_jump.power_factors_desc")}</ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("vertical_jump.tips_title")}</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">
              <li>{t("vertical_jump.tip_plyo")}</li>
              <li>{t("vertical_jump.tip_strength")}</li>
              <li>{t("vertical_jump.tip_technique")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <ArrowUp className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("vertical_jump.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("vertical_jump.title")}
      description={t("vertical_jump.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("vertical_jump.footer_note")}
     className="rtl" />
  );
}
