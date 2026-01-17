'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardList, CheckSquare, Clock, Timer, Activity } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface ProductivityResult {
  tasksCompleted: number;
  tasksPlanned: number;
  timeSpent: number;
  timeAllocated: number;
  completionRate: number;
  timeEfficiency: number;
  productivityScore: number;
  rating: string;
  suggestions: string[];
}

export default function ProductivityCalculator() {
  const { t } = useTranslation('calc/business');
  const [tasksPlanned, setTasksPlanned] = useState<string>('');
  const [tasksCompleted, setTasksCompleted] = useState<string>('');
  const [timeAllocated, setTimeAllocated] = useState<string>('');
  const [timeSpent, setTimeSpent] = useState<string>('');
  const [result, setResult] = useState<ProductivityResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const getProductivityRating = (score: number): string => {
    if (score >= 90) return t("productivity.ratings.excellent");
    if (score >= 75) return t("productivity.ratings.good");
    if (score >= 60) return t("productivity.ratings.average");
    if (score >= 40) return t("productivity.ratings.below_average");
    return t("productivity.ratings.poor");
  };

  const getSuggestions = (completionRate: number, timeEfficiency: number): string[] => {
    const suggestions: string[] = [];

    if (completionRate < 70) {
      suggestions.push(t("productivity.suggestions.completion"));
    }

    if (timeEfficiency < 80) {
      suggestions.push(t("productivity.suggestions.time"));
    }

    if (completionRate < 50) {
      suggestions.push(t("productivity.suggestions.planning"));
    }

    if (timeEfficiency > 120) {
      suggestions.push(t("productivity.suggestions.rushing"));
    }

    if (completionRate > 90 && timeEfficiency > 90 && timeEfficiency < 110) {
      suggestions.push(t("productivity.suggestions.excellent"));
    }

    if (suggestions.length === 0) {
      suggestions.push(t("productivity.suggestions.maintain"));
    }

    return suggestions;
  };

  const validateInputs = (): boolean => {
    setError('');

    const planned = parseInt(tasksPlanned);
    const completed = parseInt(tasksCompleted);
    const allocated = parseFloat(timeAllocated);
    const spent = parseFloat(timeSpent);

    if (isNaN(planned) || planned < 1) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (isNaN(completed) || completed < 0) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (completed > planned) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (isNaN(allocated) || allocated <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (isNaN(spent) || spent < 0) {
      setError(t("errors.positive_values_required"));
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
        const planned = parseInt(tasksPlanned);
        const completed = parseInt(tasksCompleted);
        const allocated = parseFloat(timeAllocated);
        const spent = parseFloat(timeSpent);

        // Calculate completion rate (0-100%)
        const completionRate = (completed / planned) * 100;

        // Calculate time efficiency (0-200%, 100% = perfect)
        const timeEfficiency = (allocated / spent) * 100;

        // Calculate overall productivity score (weighted average)
        // 60% weight on completion, 40% on time efficiency
        const productivityScore = (completionRate * 0.6) + (Math.min(timeEfficiency, 100) * 0.4);

        const rating = getProductivityRating(productivityScore);
        const suggestions = getSuggestions(completionRate, timeEfficiency);

        setResult({
          tasksCompleted: completed,
          tasksPlanned: planned,
          timeSpent: spent,
          timeAllocated: allocated,
          completionRate,
          timeEfficiency,
          productivityScore,
          rating,
          suggestions,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("errors.calculation_error"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setTasksPlanned('');
      setTasksCompleted('');
      setTimeAllocated('');
      setTimeSpent('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("productivity.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("productivity.inputs.tasks_planned")}
          tooltip={t("productivity.inputs.tasks_planned_tooltip")}
        >
          <NumberInput
            value={tasksPlanned}
            onValueChange={(val) => {
              setTasksPlanned(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("productivity.inputs.tasks_planned_placeholder")}
            startIcon={<ClipboardList className="h-4 w-4" />}
            min={1}
          />
        </FormField>

        <FormField
          label={t("productivity.inputs.tasks_completed")}
          tooltip={t("productivity.inputs.tasks_completed_tooltip")}
        >
          <NumberInput
            value={tasksCompleted}
            onValueChange={(val) => {
              setTasksCompleted(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("productivity.inputs.tasks_completed_placeholder")}
            startIcon={<CheckSquare className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("productivity.inputs.time_allocated")}
          tooltip={t("productivity.inputs.time_allocated_tooltip")}
        >
          <NumberInput
            value={timeAllocated}
            onValueChange={(val) => {
              setTimeAllocated(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("productivity.inputs.time_allocated_placeholder")}
            startIcon={<Clock className="h-4 w-4" />}
            step={0.5}
            min={0}
          />
        </FormField>

        <FormField
          label={t("productivity.inputs.time_spent")}
          tooltip={t("productivity.inputs.time_spent_tooltip")}
        >
          <NumberInput
            value={timeSpent}
            onValueChange={(val) => {
              setTimeSpent(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("productivity.inputs.time_spent_placeholder")}
            startIcon={<Timer className="h-4 w-4" />}
            step={0.5}
            min={0}
          />
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
              {t("productivity.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("productivity.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("common.useCases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("productivity.description")}</li>
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
          {t("productivity.results.score")}
        </div>
        <div className={`text-5xl font-bold mb-2 ${getScoreColor(result.productivityScore)}`} dir="ltr">
          {result.productivityScore.toFixed(1)}%
        </div>
        <div className="text-2xl font-medium text-foreground-70">
          {result.rating}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("productivity.results.score")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Activity className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("productivity.results.completion_rate")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              {result.completionRate.toFixed(1)}%
            </div>
            <div className="text-xs text-foreground-70 mt-1">
              {result.tasksCompleted} / {result.tasksPlanned} {t("productivity.results.tasks")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("productivity.results.time_efficiency")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              {result.timeEfficiency.toFixed(1)}%
            </div>
            <div className="text-xs text-foreground-70 mt-1">
              {result.timeSpent}h / {result.timeAllocated}h
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <ClipboardList className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("productivity.results.tasks_remaining")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              {result.tasksPlanned - result.tasksCompleted}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Timer className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("productivity.results.time_variance")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              {result.timeSpent > result.timeAllocated ? '+' : ''}
              {(result.timeSpent - result.timeAllocated).toFixed(1)}h
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium mb-3">{t("productivity.info.note_title")}</h4>
          <div className="space-y-2">
            {result.suggestions.map((suggestion, index) => (
              <div key={index} className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-start">
                  <Activity className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground-70">{suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium mb-3">{t("productivity.info.title")}</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span>{t("productivity.results.completion_rate")}</span>
                <span dir="ltr">{result.completionRate.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all"
                  style={{ width: `${Math.min(result.completionRate, 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span>{t("productivity.results.time_efficiency")}</span>
                <span dir="ltr">{result.timeEfficiency.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    result.timeEfficiency > 100 ? 'bg-warning' : 'bg-success'
                  }`}
                  style={{ width: `${Math.min(result.timeEfficiency, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Activity className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("productivity.info.note_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("productivity.info.note")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("productivity.title")}
      description={t("productivity.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
