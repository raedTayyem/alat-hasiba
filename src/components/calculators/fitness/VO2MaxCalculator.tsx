'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, User, Activity, Info, Heart } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

export default function VO2MaxCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common']);
  const [gender, setGender] = useState<string>('male');
  const [age, setAge] = useState<string>('');
  const [restingHR, setRestingHR] = useState<string>('');
  const [maxHR, setMaxHR] = useState<string>('');
  const [result, setResult] = useState<{ vo2max: number; category: string; } | null>(null);
  const [error, setError] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);

  // Clear errors when inputs change
  useEffect(() => {
    if (error) setError('');
  }, [age, restingHR, maxHR, gender]);

  const calculate = () => {
    const ageVal = parseFloat(age);
    const restingHRVal = parseFloat(restingHR);
    const maxHRVal = parseFloat(maxHR) || (220 - ageVal);

    // Validation
    if (!age || !restingHR) {
      setError(t("calorie.errors.all_fields"));
      return;
    }

    if (ageVal <= 0 || ageVal > 120) {
      setError(t("calorie.errors.age_range"));
      return;
    }

    if (restingHRVal < 30 || restingHRVal > 100) {
      setError(t("common.errors.invalid"));
      return;
    }

    if (maxHRVal < 100 || maxHRVal > 220) {
      setError(t("common.errors.invalid"));
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      // Using simple VO2max estimation
      const vo2max = 15.3 * (maxHRVal / restingHRVal);

      let category = '';
      if (gender === 'male') {
        if (vo2max < 35) category = t("vo2max.results.categories.poor");
        else if (vo2max < 45) category = t("vo2max.results.categories.average");
        else if (vo2max < 55) category = t("vo2max.results.categories.good");
        else if (vo2max < 65) category = t("vo2max.results.categories.excellent");
        else category = t("vo2max.results.categories.elite");
      } else {
        if (vo2max < 30) category = t("vo2max.results.categories.poor");
        else if (vo2max < 38) category = t("vo2max.results.categories.average");
        else if (vo2max < 46) category = t("vo2max.results.categories.good");
        else if (vo2max < 54) category = t("vo2max.results.categories.excellent");
        else category = t("vo2max.results.categories.elite");
      }

      setResult({ vo2max: parseFloat(vo2max.toFixed(1)), category });
      setShowResult(true);
    }, 300);
  };

  const reset = () => {
    setShowResult(false);
    setTimeout(() => {
      setGender('male');
      setAge('');
      setRestingHR('');
      setMaxHR('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const genderOptions = [
    { value: 'male', label: t("calorie.inputs.male") },
    { value: 'female', label: t("calorie.inputs.female") },
  ];

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("vo2max.title")}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("calorie.inputs.gender")}
          tooltip={t("calorie.tooltips.gender")}
        >
          <Combobox
            options={genderOptions}
            value={gender}
            onChange={(val) => setGender(val)}
            placeholder={t("calorie.inputs.gender")}
          />
        </FormField>

        <FormField
          label={t("calorie.inputs.age")}
          tooltip={t("calorie.tooltips.age")}
        >
          <NumberInput
            value={age}
            onValueChange={(val) => setAge(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("common.placeholders.enterValue")}
            min={1}
            max={120}
            startIcon={<User className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("heart_rate_zones.inputs.resting_hr")}
          tooltip={t("heart_rate_zones.inputs.resting_hr_tooltip")}
        >
          <NumberInput
            value={restingHR}
            onValueChange={(val) => setRestingHR(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("common.placeholders.enterValue")}
            min={30}
            max={100}
            startIcon={<Activity className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("vo2max.inputs.max_hr")}
          tooltip={t("vo2max.inputs.max_hr_tooltip")}
        >
          <NumberInput
            value={maxHR}
            onValueChange={(val) => setMaxHR(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("common.placeholders.enterValue")}
            min={100}
            max={220}
            startIcon={<Heart className="h-4 w-4" />}
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
      <h3 className="text-xl font-bold mb-4">{t("common.results")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("vo2max.results.vo2max_value")}</div>
          <div className="text-3xl font-bold text-primary">
            {result.vo2max} {t("vo2max.results.ml_kg_min")}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 p-4 rounded-lg">
          <h4 className="font-bold mb-2">{t("vo2max.results.category_title")}</h4>
          <div className="text-lg font-bold text-primary mb-2">{result.category}</div>
          <div className="text-sm space-y-1">
            {gender === 'male' ? (
              <>
                <p>• {t("vo2max.results.categories.poor")}: {t("vo2max.results.categories.poor_range_male")}</p>
                <p>• {t("vo2max.results.categories.average")}: {t("vo2max.results.categories.average_range_male")}</p>
                <p>• {t("vo2max.results.categories.good")}: {t("vo2max.results.categories.good_range_male")}</p>
                <p>• {t("vo2max.results.categories.excellent")}: {t("vo2max.results.categories.excellent_range_male")}</p>
                <p>• {t("vo2max.results.categories.elite")}: {t("vo2max.results.categories.elite_range_male")}</p>
              </>
            ) : (
              <>
                <p>• {t("vo2max.results.categories.poor")}: {t("vo2max.results.categories.poor_range_female")}</p>
                <p>• {t("vo2max.results.categories.average")}: {t("vo2max.results.categories.average_range_female")}</p>
                <p>• {t("vo2max.results.categories.good")}: {t("vo2max.results.categories.good_range_female")}</p>
                <p>• {t("vo2max.results.categories.excellent")}: {t("vo2max.results.categories.excellent_range_female")}</p>
                <p>• {t("vo2max.results.categories.elite")}: {t("vo2max.results.categories.elite_range_female")}</p>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("vo2max.about_title")}</h4>
            <p className="text-sm">{t("vo2max.about_desc")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Activity className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("vo2max.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("vo2max.title")}
      description={t("vo2max.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("vo2max.footer_note")}
      className="rtl"
    />
  );
}
