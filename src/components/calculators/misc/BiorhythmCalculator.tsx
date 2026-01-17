'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Activity, Heart, Brain, Zap, Info } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Input } from '@/components/ui/input';
import { differenceInDays, format, isValid, addDays, subDays } from 'date-fns';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// Biorhythm Cycles (in days)
const PHYSICAL_CYCLE = 23;
const EMOTIONAL_CYCLE = 28;
const INTELLECTUAL_CYCLE = 33;
const INTUITIVE_CYCLE = 38;

/**
 * Calculate biorhythm value for a given day offset and cycle length
 * Returns a value between -100 and 100
 */
const calculateBiorhythmValue = (days: number, cycle: number): number => {
  return Math.sin((2 * Math.PI * days) / cycle) * 100;
};

export default function BiorhythmCalculator() {
  const { t } = useTranslation(['translation', 'calc/misc']);

  const [birthDate, setBirthDate] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [chartData, setChartData] = useState<any[]>([]);
  const [daysSinceBirth, setDaysSinceBirth] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);

  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Calculate biorhythm data
  const calculateBiorhythmData = () => {
    setError('');
    setShowResult(false);

    if (!birthDate) {
      setError(t("calc/misc:biorhythm.enter_birth_date"));
      return;
    }

    try {
      const birthDateObj = new Date(birthDate);
      const targetDateObj = new Date(targetDate);

      if (!isValid(birthDateObj) || !isValid(targetDateObj)) {
        setError(t("calc/misc:biorhythm.invalid_date"));
        return;
      }

      if (birthDateObj > targetDateObj) {
        setError(t("calc/misc:biorhythm.future_birth"));
        return;
      }

      setTimeout(() => {
        const days = differenceInDays(targetDateObj, birthDateObj);
        setDaysSinceBirth(days);

        // Generate data for a range around the target date (for visualization later)
        const data = [];
        const startDate = subDays(targetDateObj, 15);

        for (let i = 0; i < 31; i++) {
          const currentDate = addDays(startDate, i);
          const dayDiff = differenceInDays(currentDate, birthDateObj);

          data.push({
            date: format(currentDate, 'yyyy-MM-dd'),
            formattedDate: format(currentDate, 'dd MMM'),
            physical: calculateBiorhythmValue(dayDiff, PHYSICAL_CYCLE),
            emotional: calculateBiorhythmValue(dayDiff, EMOTIONAL_CYCLE),
            intellectual: calculateBiorhythmValue(dayDiff, INTELLECTUAL_CYCLE),
            intuitive: calculateBiorhythmValue(dayDiff, INTUITIVE_CYCLE),
            isTargetDate: format(currentDate, 'yyyy-MM-dd') === targetDate,
          });
        }

        setChartData(data);
        setShowResult(true);
      }, 300);
    } catch (err) {
      console.error(err);
      setError(t("calc/misc:biorhythm.calc_error"));
    }
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setBirthDate('');
      setTargetDate(format(new Date(), 'yyyy-MM-dd'));
      setChartData([]);
      setDaysSinceBirth(null);
      setError('');
    }, 300);
  };

  const currentValues = useMemo(() => {
    const targetDayData = chartData.find(item => item.date === targetDate);
    if (!targetDayData) return null;

    return {
      physical: targetDayData.physical.toFixed(1),
      emotional: targetDayData.emotional.toFixed(1),
      intellectual: targetDayData.intellectual.toFixed(1),
      intuitive: targetDayData.intuitive.toFixed(1),
    };
  }, [chartData, targetDate]);

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("calc/misc:biorhythm.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer
          label={t("calc/misc:biorhythm.birth_date")}
          tooltip={t("calc/misc:biorhythm.birth_date_tooltip")}
        >
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-muted-foreground">
              <Calendar className="h-4 w-4" />
            </div>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => {
                setBirthDate(e.target.value);
                if (error) setError('');
              }}
              className="ps-10 py-3 text-base"
            />
          </div>
        </InputContainer>

        <InputContainer
          label={t("calc/misc:biorhythm.target_date")}
          tooltip={t("calc/misc:biorhythm.target_date_tooltip")}
        >
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-muted-foreground">
              <Calendar className="h-4 w-4" />
            </div>
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => {
                setTargetDate(e.target.value);
                if (error) setError('');
              }}
              className="ps-10 py-3 text-base"
            />
          </div>
        </InputContainer>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons
          onCalculate={calculateBiorhythmData}
          onReset={resetCalculator}
        />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {!showResult && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("calc/misc:biorhythm.intro_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("calc/misc:biorhythm.intro_desc")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("calc/misc:biorhythm.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("calc/misc:biorhythm.use_case_1")}</li>
              <li>{t("calc/misc:biorhythm.use_case_2")}</li>
              <li>{t("calc/misc:biorhythm.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = daysSinceBirth !== null && currentValues && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("calc/misc:biorhythm.days_since")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {daysSinceBirth}
        </div>
        <div className="text-lg text-foreground-70">
          {t("calc/misc:biorhythm.days")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("calc/misc:biorhythm.current_values")}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg text-center">
            <div className="flex justify-center mb-2">
              <Activity className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h4 className="font-medium text-red-700 dark:text-red-300 text-lg">{t("calc/misc:biorhythm.physical")}</h4>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{currentValues.physical}%</p>
            <p className="text-xs mt-1 text-red-500 dark:text-red-400">
              {parseFloat(currentValues.physical) > 0 ? t("calc/misc:biorhythm.high") : t("calc/misc:biorhythm.low")}
            </p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg text-center">
            <div className="flex justify-center mb-2">
              <Heart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-medium text-blue-700 dark:text-blue-300 text-lg">{t("calc/misc:biorhythm.emotional")}</h4>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{currentValues.emotional}%</p>
            <p className="text-xs mt-1 text-blue-500 dark:text-blue-400">
              {parseFloat(currentValues.emotional) > 0 ? t("calc/misc:biorhythm.high") : t("calc/misc:biorhythm.low")}
            </p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg text-center">
            <div className="flex justify-center mb-2">
              <Brain className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-medium text-green-700 dark:text-green-300 text-lg">{t("calc/misc:biorhythm.intellectual")}</h4>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{currentValues.intellectual}%</p>
            <p className="text-xs mt-1 text-green-500 dark:text-green-400">
              {parseFloat(currentValues.intellectual) > 0 ? t("calc/misc:biorhythm.high") : t("calc/misc:biorhythm.low")}
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg text-center">
            <div className="flex justify-center mb-2">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-medium text-purple-700 dark:text-purple-300 text-lg">{t("calc/misc:biorhythm.intuitive")}</h4>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{currentValues.intuitive}%</p>
            <p className="text-xs mt-1 text-purple-500 dark:text-purple-400">
              {parseFloat(currentValues.intuitive) > 0 ? t("calc/misc:biorhythm.high") : t("calc/misc:biorhythm.low")}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("calc/misc:biorhythm.note_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("calc/misc:biorhythm.note")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("calc/misc:biorhythm.title")}
      description={t("calc/misc:biorhythm.desc")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
