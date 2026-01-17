'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, User, Ruler, Activity, Info, Trophy } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

export default function FlexibilityScoreCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common', 'calc/health']);

  const [sitReach, setSitReach] = useState<string>('');
  const [shoulderReach, setShoulderReach] = useState<string>('');
  const [hipFlexion, setHipFlexion] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('male');
  const [result, setResult] = useState<{
    overallScore: number;
    category: string;
    recommendations: string[];
  } | null>(null);

  const calculate = () => {
    const sitReachVal = parseFloat(sitReach);
    const shoulderReachVal = parseFloat(shoulderReach);
    const hipFlexionVal = parseFloat(hipFlexion);
    const ageVal = parseFloat(age);

    if (!sitReachVal || !shoulderReachVal || !hipFlexionVal || !ageVal) return;

    // Scoring (simplified)
    let sitReachScore = 0;
    if (gender === 'male') {
      sitReachScore = sitReachVal > 20 ? 100 : sitReachVal > 10 ? 75 : sitReachVal > 0 ? 50 : 25;
    } else {
      sitReachScore = sitReachVal > 25 ? 100 : sitReachVal > 15 ? 75 : sitReachVal > 5 ? 50 : 25;
    }

    const shoulderScore = shoulderReachVal < 5 ? 100 : shoulderReachVal < 10 ? 75 : shoulderReachVal < 15 ? 50 : 25;
    const hipScore = hipFlexionVal > 120 ? 100 : hipFlexionVal > 100 ? 75 : hipFlexionVal > 80 ? 50 : 25;

    const overallScore = Math.round((sitReachScore + shoulderScore + hipScore) / 3);

    let category = '';
    if (overallScore >= 90) category = t("athletic_performance.elite");
    else if (overallScore >= 75) category = t("athletic_performance.excellent");
    else if (overallScore >= 60) category = t("athletic_performance.good");
    else if (overallScore >= 40) category = t("athletic_performance.average");
    else category = t("common.needs_improvement");

    const recommendations = [];
    if (sitReachScore < 75) recommendations.push(t("flexibility_score.rec_hamstrings"));
    if (shoulderScore < 75) recommendations.push(t("flexibility_score.rec_shoulders"));
    if (hipScore < 75) recommendations.push(t("flexibility_score.rec_hips"));

    setResult({ overallScore, category, recommendations });
  };

  const reset = () => {
    setSitReach('');
    setShoulderReach('');
    setHipFlexion('');
    setAge('');
    setGender('male');
    setResult(null);
  };

  const genderOptions = [
    { value: 'male', label: t("calc/health:calorie.inputs.male") },
    { value: 'female', label: t("calc/health:calorie.inputs.female") },
  ];

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("flexibility_score.gender")}
          tooltip={t("flexibility_score.gender")}
        >
          <Combobox
            options={genderOptions}
            value={gender}
            onChange={(val) => setGender(val)}
            placeholder={t("calc/health:calorie.inputs.gender")}
          />
        </FormField>

        <FormField
          label={t("flexibility_score.age")}
          tooltip={t("body_fat.age")}
        >
          <NumberInput
            value={age}
            onValueChange={(val) => setAge(val.toString())}
            placeholder={t("flexibility_score.enter_age")}
            min={1}
            max={120}
            startIcon={<User className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("flexibility_score.sit_reach")}
          tooltip={t("flexibility_score.sit_reach_tooltip")}
        >
          <NumberInput
            value={sitReach}
            onValueChange={(val) => setSitReach(val.toString())}
            placeholder={t("flexibility_score.enter_cm")}
            min={-30}
            max={50}
            step={0.5}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("flexibility_score.shoulder_reach")}
          tooltip={t("flexibility_score.shoulder_reach_tooltip")}
        >
          <NumberInput
            value={shoulderReach}
            onValueChange={(val) => setShoulderReach(val.toString())}
            placeholder={t("flexibility_score.enter_cm")}
            min={0}
            max={50}
            step={0.5}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("flexibility_score.hip_flexion")}
          tooltip={t("flexibility_score.hip_flexion_tooltip")}
          className="md:col-span-2"
        >
          <NumberInput
            value={hipFlexion}
            onValueChange={(val) => setHipFlexion(val.toString())}
            placeholder={t("flexibility_score.enter_degrees")}
            min={0}
            max={180}
            startIcon={<Activity className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("flexibility_score.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("flexibility_score.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("flexibility_score.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("flexibility_score.overall_score")}
          </div>
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            {result.overallScore}/100
          </div>
          <div className="text-sm text-foreground-70 mt-1">
            {t("flexibility_score.category")} {result.category}
          </div>
        </div>

        {result.recommendations.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-2 font-medium">
              {t("flexibility_score.recommendations_title")}
            </div>
            <ul className="text-sm space-y-1 list-disc list-inside">
              {result.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("flexibility_score.benefits_title")}</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">
              <li>{t("flexibility_score.benefit_injury")}</li>
              <li>{t("flexibility_score.benefit_posture")}</li>
              <li>{t("flexibility_score.benefit_pain")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("body_fat.ranges_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">{t("flexibility_score.footer_note")}</ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Activity className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("flexibility_score.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("flexibility_score.title")}
      description={t("flexibility_score.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("flexibility_score.footer_note")}
     className="rtl" />
  );
}
