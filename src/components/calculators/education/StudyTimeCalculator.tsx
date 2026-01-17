'use client';

/**
 * Study Time Calculator - Education Category
 * 
 * Features:
 * - Calculate recommended study time based on credit hours and difficulty
 * - Plan study sessions per day
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Clock, Calendar, Info, Star, Timer } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function StudyTimeCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/education', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [credits, setCredits] = useState<string>('15');
  const [difficulty, setDifficulty] = useState<number>(2); // 1: Easy, 2: Moderate, 3: Hard
  const [daysAvailable, setDaysAvailable] = useState<string>('5');
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    initDateInputRTL();
  }, []);

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const creditHours = parseInt(credits);
    const days = parseInt(daysAvailable);

    if (isNaN(creditHours) || creditHours <= 0) {
      setError(t('study_time.errors.invalid_credits'));
      return false;
    }
    if (isNaN(days) || days <= 0 || days > 7) {
      setError(t('study_time.errors.invalid_days'));
      return false;
    }

    return true;
  };

  // ---------------------------------------------------------------------------
  // CALCULATION FUNCTIONS
  // ---------------------------------------------------------------------------
  // General rule: 2-3 hours of study per credit hour
  const calculate = () => {
    if (!validateInputs()) return;
    setShowResult(true);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setCredits('15');
    setDaysAvailable('5');
    setDifficulty(2);
    setError('');
  };

  const totalWeeklyHours = parseInt(credits) * (difficulty + 1);
  const dailyHours = totalWeeklyHours / (parseInt(daysAvailable) || 1);

  const getDifficultyLabel = (val: number) => {
    if (val === 1) return t('study_time.difficulty_easy');
    if (val === 2) return t('study_time.difficulty_moderate');
    return t('study_time.difficulty_hard');
  };

  // ---------------------------------------------------------------------------
  // JSX SECTIONS
  // ---------------------------------------------------------------------------
  const inputSection = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t('study_time.credit_hours')}>
          <NumberInput
            value={credits}
            onValueChange={(val) => setCredits(val.toString())}
            min={1}
            max={30}
            startIcon={<BookOpen className="w-4 h-4" />}
          />
        </FormField>
        <FormField label={t('study_time.days_per_week')}>
          <NumberInput
            value={daysAvailable}
            onValueChange={(val) => setDaysAvailable(val.toString())}
            min={1}
            max={7}
            startIcon={<Calendar className="w-4 h-4" />}
          />
        </FormField>
      </div>

      <FormField label={t('study_time.difficulty_level')}>
        <div className="flex gap-2">
          {[1, 2, 3].map((val) => (
            <button
              key={val}
              onClick={() => setDifficulty(val)}
              className={`flex-1 py-3 px-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                difficulty === val 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-border hover:border-border/80'
              }`}
            >
              <div className="flex">
                {[...Array(val)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${difficulty === val ? 'fill-primary' : 'fill-muted-foreground'}`} />
                ))}
              </div>
              <span className="text-xs font-semibold">{getDifficultyLabel(val)}</span>
            </button>
          ))}
        </div>
      </FormField>

      <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />

      <ErrorDisplay error={error} />
    </div>
  );

  const resultSection = showResult ? (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
          <Clock className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{t('study_time.result_title')}</h3>
        
        <div className="py-6 border-y border-border/50 space-y-2">
          <div className="text-6xl font-black tracking-tighter text-primary">
            {totalWeeklyHours}
          </div>
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            {t('study_time.total_weekly_hours')}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4">
          <div className="p-6 bg-muted/50 rounded-2xl flex items-center justify-between">
            <div className="text-left">
              <div className="text-sm text-muted-foreground">{t('study_time.daily_commitment')}</div>
              <div className="text-2xl font-bold text-foreground">
                {dailyHours.toFixed(1)} {t('study_time.hours')}
              </div>
            </div>
            <Timer className="w-10 h-10 text-primary/40" />
          </div>
        </div>
      </div>

      <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 mt-6">
        <h4 className="font-semibold mb-3 flex items-center gap-2 text-primary">
          <Info className="w-4 h-4" />
          {t('study_time.recommendation_title')}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t('study_time.recommendation_text', { 
            hours: totalWeeklyHours,
            difficulty: getDifficultyLabel(difficulty)
          })}
        </p>
      </div>
    </div>
  ) : (
    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-4">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
        <Clock className="w-10 h-10 text-muted-foreground/40" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground">{t('common.results_ready')}</h3>
        <p className="text-sm text-muted-foreground max-w-[250px]">
          {t('study_time.result_placeholder')}
        </p>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title={t('study_time.title')}
      description={t('study_time.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      category="education"
    />
  );
}
