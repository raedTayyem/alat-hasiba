'use client';

/**
 * Pregnancy Calculator
 * Calculates weeks and days of pregnancy, trimester, and weight gain recommendations
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Baby, Clock, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

interface PregnancyResult {
  weeks: number;
  days: number;
  trimester: number;
  trimesterName: string;
  dueDate: Date;
  conceptionDate: Date;
  weightGainMin: number;
  weightGainMax: number;
  currentRecommendation: string;
}

export default function PregnancyCalculator() {
  const { t, i18n } = useTranslation(['calc/health', 'common']);
  const isRTL = i18n.language === 'ar';
  const [lmp, setLmp] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [result, setResult] = useState<PregnancyResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');


  const validateInputs = (): boolean => {
    setError('');

    if (!lmp) {
      setError(t("pregnancy.errors.lmp_required"));
      return false;
    }

    const lmpDate = new Date(lmp);
    const current = new Date(currentDate);

    if (lmpDate > current) {
      setError(t("pregnancy.errors.lmp_future"));
      return false;
    }

    const daysDiff = Math.floor((current.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 294) { // 42 weeks
      setError(t("pregnancy.errors.too_long"));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const lmpDate = new Date(lmp);
        const current = new Date(currentDate);

        // Calculate days since LMP
        const daysSinceLMP = Math.floor((current.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));

        // Calculate weeks and days
        const weeks = Math.floor(daysSinceLMP / 7);
        const days = daysSinceLMP % 7;

        // Determine trimester
        let trimester: number;
        let trimesterName: string;
        if (weeks < 13) {
          trimester = 1;
          trimesterName = t("pregnancy.trimesters.first");
        } else if (weeks < 27) {
          trimester = 2;
          trimesterName = t("pregnancy.trimesters.second");
        } else {
          trimester = 3;
          trimesterName = t("pregnancy.trimesters.third");
        }

        // Calculate due date (280 days / 40 weeks from LMP)
        const dueDate = new Date(lmpDate);
        dueDate.setDate(dueDate.getDate() + 280);

        // Calculate estimated conception date (14 days after LMP)
        const conceptionDate = new Date(lmpDate);
        conceptionDate.setDate(conceptionDate.getDate() + 14);

        // Weight gain recommendations by trimester (kg)
        let weightGainMin: number, weightGainMax: number, currentRecommendation: string;

        if (trimester === 1) {
          weightGainMin = 0.5;
          weightGainMax = 2;
          currentRecommendation = t("pregnancy.recommendations.t1");
        } else if (trimester === 2) {
          weightGainMin = 5;
          weightGainMax = 7;
          currentRecommendation = t("pregnancy.recommendations.t2");
        } else {
          weightGainMin = 11;
          weightGainMax = 16;
          currentRecommendation = t("pregnancy.recommendations.t3");
        }

        setResult({
          weeks,
          days,
          trimester,
          trimesterName,
          dueDate,
          conceptionDate,
          weightGainMin,
          weightGainMax,
          currentRecommendation
        });

        setShowResult(true);
      } catch (err) {
        setError(t("common.errors.calculationError"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setLmp('');
      setCurrentDate(new Date().toISOString().split('T')[0]);
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
      <div className="text-2xl font-bold mb-6 text-center">
        {t("pregnancy.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("pregnancy.inputs.lmp_label")}
          tooltip={t("pregnancy.inputs.lmp_tooltip")}
        >
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-muted-foreground">
              <Calendar className="h-4 w-4" />
            </div>
            <input
              type="date"
              value={lmp}
              onChange={(e) => {
                setLmp(e.target.value);
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              className="date-input-rtl w-full h-10 rounded-md border border-input bg-background px-3 ps-9 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
        </FormField>

        <FormField
          label={t("pregnancy.inputs.current_date_label")}
          tooltip={t("pregnancy.inputs.current_date_tooltip")}
        >
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-muted-foreground">
              <Clock className="h-4 w-4" />
            </div>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => {
                setCurrentDate(e.target.value);
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              className="date-input-rtl w-full h-10 rounded-md border border-input bg-background px-3 ps-9 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
        </FormField>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("pregnancy.about.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("pregnancy.about.desc")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("pregnancy.about.info_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("pregnancy.about.info_1")}</li>
              <li>{t("pregnancy.about.info_2")}</li>
              <li>{t("pregnancy.about.info_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("pregnancy.results.duration")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.weeks} {t("pregnancy.results.weeks")} {result.days} {t("pregnancy.results.days")}
        </div>
        <div className="text-lg text-foreground-70">
          {result.trimesterName}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("pregnancy.results.details_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Baby className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("pregnancy.results.due_date")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              {result.dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("pregnancy.results.conception_date")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              {result.conceptionDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("pregnancy.results.trimester")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.trimesterName}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Info className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("pregnancy.results.weight_gain")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.weightGainMin} - {result.weightGainMax} {t("common:common.units.kg")}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("pregnancy.recommendations.title")}</h4>
            <p className="text-sm text-foreground-70">
              {result.currentRecommendation}
            </p>
            <p className="text-sm text-foreground-70 mt-2">
              {t("pregnancy.recommendations.disclaimer")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("pregnancy.title")}
      description={t("pregnancy.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
