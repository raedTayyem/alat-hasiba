'use client';

/**
 * Final Grade Calculator - Education Category
 * 
 * Features:
 * - Calculate required score on final exam to achieve a desired overall grade
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Target, CheckCircle, Info, Award } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface FinalGradeResult {
  requiredScore: number;
  isPossible: boolean;
  message: string;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function FinalGradeCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t, i18n } = useTranslation(['calc/education', 'common']);
  const isRTL = i18n.language === 'ar';

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [currentGrade, setCurrentGrade] = useState<string>('85');
  const [desiredGrade, setDesiredGrade] = useState<string>('90');
  const [finalWeight, setFinalWeight] = useState<string>('20');
  const [result, setResult] = useState<FinalGradeResult | null>(null);
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

    const current = parseFloat(currentGrade);
    const desired = parseFloat(desiredGrade);
    const weight = parseFloat(finalWeight);

    if (isNaN(current) || current < 0) {
      setError(t('final_grade.errors.invalid_current'));
      return false;
    }
    if (isNaN(desired) || desired < 0) {
      setError(t('final_grade.errors.invalid_desired'));
      return false;
    }
    if (isNaN(weight) || weight <= 0 || weight >= 100) {
      setError(t('final_grade.errors.invalid_weight'));
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
        const current = parseFloat(currentGrade);
        const desired = parseFloat(desiredGrade);
        const weight = parseFloat(finalWeight) / 100;

        // Formula: Desired = Current * (1 - Weight) + Final * Weight
        // Final = (Desired - Current * (1 - Weight)) / Weight
        const requiredScore = (desired - current * (1 - weight)) / weight;
        
        let isPossible = true;
        let message = '';

        if (requiredScore > 100) {
          isPossible = false;
          message = t('final_grade.messages.not_possible_high', { score: requiredScore.toFixed(1) });
        } else if (requiredScore <= 0) {
          message = t('final_grade.messages.already_achieved');
        } else {
          message = t('final_grade.messages.possible', { score: requiredScore.toFixed(1) });
        }

        setResult({
          requiredScore,
          isPossible,
          message
        });
        setShowResult(true);
      } catch (err) {
        setError(t('common.errors.calculationError'));
        console.error('Final Grade Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setCurrentGrade('85');
      setDesiredGrade('90');
      setFinalWeight('20');
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
        <FormField label={t('final_grade.current_grade')}>
          <NumberInput
            value={currentGrade}
            onValueChange={(val) => setCurrentGrade(val.toString())}
            placeholder="85"
            min={0}
            max={200}
            step={0.1}
            unit={t("common:units.percent")}
          />
        </FormField>
        <FormField label={t('final_grade.desired_grade')}>
          <NumberInput
            value={desiredGrade}
            onValueChange={(val) => setDesiredGrade(val.toString())}
            placeholder="90"
            min={0}
            max={200}
            step={0.1}
            unit={t("common:units.percent")}
          />
        </FormField>
      </div>

      <FormField label={t('final_grade.final_exam_weight')}>
        <NumberInput
          value={finalWeight}
          onValueChange={(val) => setFinalWeight(val.toString())}
          placeholder="20"
          min={0.1}
          max={99.9}
          step={0.1}
          unit={t("common:units.percent")}
        />
      </FormField>

      <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />

      <ErrorDisplay error={error} />

      <div className="p-4 bg-muted/50 rounded-xl space-y-2">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          {t('final_grade.how_it_works')}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t('final_grade.explanation')}
        </p>
      </div>
    </div>
  );

  const resultSection = showResult && result ? (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-4">
        <div className={`inline-flex items-center justify-center p-3 rounded-full mb-2 ${result.isPossible ? 'bg-success/10' : 'bg-error/10'}`}>
          {result.isPossible ? (
            <CheckCircle className="w-8 h-8 text-success" />
          ) : (
            <Award className="w-8 h-8 text-error" />
          )}
        </div>
        <h3 className="text-xl font-bold text-foreground">{t('final_grade.result_title')}</h3>
        
        <div className="py-6 border-y border-border/50 space-y-2">
          <div className={`text-6xl font-black tracking-tighter ${result.requiredScore > 100 ? 'text-error' : result.requiredScore > 90 ? 'text-orange-500' : 'text-success'}`}>
            {result.requiredScore.toFixed(1)}%
          </div>
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            {t('final_grade.required_score')}
          </div>
        </div>

        <div className={`p-4 rounded-xl text-sm font-medium ${result.isPossible ? 'bg-success/5 text-success' : 'bg-error/5 text-error'}`}>
          {result.message}
        </div>
      </div>

      <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 mt-6">
        <h4 className="font-semibold mb-3 flex items-center gap-2 text-primary">
          <Target className="w-4 h-4" />
          {t('final_grade.details')}
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('final_grade.current_contribution')}</span>
            <span className="font-medium">{(parseFloat(currentGrade) * (1 - parseFloat(finalWeight)/100)).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('final_grade.final_contribution_needed')}</span>
            <span className="font-medium">{(parseFloat(desiredGrade) - (parseFloat(currentGrade) * (1 - parseFloat(finalWeight)/100))).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-4">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
        <Target className="w-10 h-10 text-muted-foreground/40" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground">{t('common.results_ready')}</h3>
        <p className="text-sm text-muted-foreground max-w-[250px]">
          {t('final_grade.result_placeholder')}
        </p>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title={t('final_grade.title')}
      description={t('final_grade.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      category="education"
    />
  );
}
