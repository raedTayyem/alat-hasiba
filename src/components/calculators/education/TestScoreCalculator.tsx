'use client';

/**
 * Test Score Calculator - Education Category
 * 
 * Features:
 * - Calculate percentage score and letter grade based on total questions and wrong answers
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardCheck, CheckCircle, Info, FileText, XCircle } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface TestResult {
  score: number;
  correct: number;
  letterGrade: string;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function TestScoreCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/education', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [totalQuestions, setTotalQuestions] = useState<string>('50');
  const [wrongAnswers, setWrongAnswers] = useState<string>('5');
  const [result, setResult] = useState<TestResult | null>(null);
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

    const total = parseInt(totalQuestions);
    const wrong = parseInt(wrongAnswers);

    if (isNaN(total) || total <= 0) {
      setError(t('test_score.errors.invalid_total'));
      return false;
    }
    if (isNaN(wrong) || wrong < 0 || wrong > total) {
      setError(t('test_score.errors.invalid_wrong'));
      return false;
    }

    return true;
  };

  // ---------------------------------------------------------------------------
  // CALCULATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const calculate = () => {
    if (!validateInputs()) return;

    setShowResult(false);

    setTimeout(() => {
      try {
        const total = parseInt(totalQuestions);
        const wrong = parseInt(wrongAnswers);
        const correct = total - wrong;
        const score = (correct / total) * 100;
        
        let letterGrade = 'F';
        if (score >= 90) letterGrade = 'A';
        else if (score >= 80) letterGrade = 'B';
        else if (score >= 70) letterGrade = 'C';
        else if (score >= 60) letterGrade = 'D';

        setResult({
          score,
          correct,
          letterGrade
        });
        setShowResult(true);
      } catch (err) {
        setError(t('common.errors.calculationError'));
        console.error('Test Score Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setTotalQuestions('50');
      setWrongAnswers('5');
      setResult(null);
      setError('');
    }, 300);
  };

  // ---------------------------------------------------------------------------
  // JSX SECTIONS
  // ---------------------------------------------------------------------------
  const inputSection = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t('test_score.total_questions')}>
          <NumberInput
            value={totalQuestions}
            onValueChange={(val) => setTotalQuestions(val.toString())}
            placeholder={t("placeholders.totalQuestions")}
            min={1}
            step={1}
            startIcon={<FileText className="w-4 h-4" />}
          />
        </FormField>
        <FormField label={t('test_score.wrong_answers')}>
          <NumberInput
            value={wrongAnswers}
            onValueChange={(val) => setWrongAnswers(val.toString())}
            placeholder={t("placeholders.wrongAnswers")}
            min={0}
            step={1}
            startIcon={<XCircle className="w-4 h-4 text-error" />}
          />
        </FormField>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />

      <ErrorDisplay error={error} />
    </div>
  );

  const resultSection = showResult && result ? (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-success/10 rounded-full mb-2">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{t('test_score.result_title')}</h3>
        
        <div className="py-6 border-y border-border/50 space-y-2">
          <div className="text-6xl font-black tracking-tighter text-primary">
            {result.score.toFixed(1)}%
          </div>
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            {t('test_score.final_score')}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="p-4 bg-muted/50 rounded-xl">
            <div className="text-2xl font-bold text-foreground">{result.letterGrade}</div>
            <div className="text-xs text-muted-foreground">{t('test_score.letter_grade')}</div>
          </div>
          <div className="p-4 bg-muted/50 rounded-xl">
            <div className="text-2xl font-bold text-foreground">{result.correct} / {totalQuestions}</div>
            <div className="text-xs text-muted-foreground">{t('test_score.correct_answers')}</div>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 mt-6">
        <h4 className="font-semibold mb-3 flex items-center gap-2 text-primary">
          <Info className="w-4 h-4" />
          {t('test_score.grading_scale')}
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{t('test_score.scale_a')}</span>
            <span className="font-medium text-success">A</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{t('test_score.scale_b')}</span>
            <span className="font-medium text-info">B</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{t('test_score.scale_c')}</span>
            <span className="font-medium text-warning">C</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{t('test_score.scale_d')}</span>
            <span className="font-medium text-orange-500">D</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{t('test_score.scale_f')}</span>
            <span className="font-medium text-error">F</span>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-4">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
        <ClipboardCheck className="w-10 h-10 text-muted-foreground/40" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground">{t('common.results_ready')}</h3>
        <p className="text-sm text-muted-foreground max-w-[250px]">
          {t('test_score.result_placeholder')}
        </p>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title={t('test_score.title')}
      description={t('test_score.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      category="education"
    />
  );
}
