'use client';

/**
 * Attendance Calculator - Education Category
 * 
 * Features:
 * - Calculate current attendance percentage
 * - Determine classes needed to reach target percentage
 * - Determine how many more classes can be missed
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { UserCheck, CheckCircle, Info, Calendar, AlertTriangle } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface AttendanceResult {
  percentage: number;
  status: 'above' | 'below' | 'exact';
  classesNeeded?: number;
  canMiss?: number;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function AttendanceCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t, i18n } = useTranslation(['calc/education', 'common']);
  const isRTL = i18n.language === 'ar';

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [totalClasses, setTotalClasses] = useState<string>('40');
  const [attendedClasses, setAttendedClasses] = useState<string>('30');
  const [targetPercentage, setTargetPercentage] = useState<string>('75');
  const [result, setResult] = useState<AttendanceResult | null>(null);
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

    const total = parseInt(totalClasses);
    const attended = parseInt(attendedClasses);
    const target = parseFloat(targetPercentage);

    if (isNaN(total) || total <= 0) {
      setError(t('attendance.errors.invalid_total'));
      return false;
    }
    if (isNaN(attended) || attended < 0 || attended > total) {
      setError(t('attendance.errors.invalid_attended'));
      return false;
    }
    if (isNaN(target) || target <= 0 || target > 100) {
      setError(t('attendance.errors.invalid_target'));
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
        const total = parseInt(totalClasses);
        const attended = parseInt(attendedClasses);
        const target = parseFloat(targetPercentage) / 100;

        const percentage = (attended / total) * 100;
        let status: 'above' | 'below' | 'exact' = 'exact';
        let classesNeeded = 0;
        let canMiss = 0;

        if (percentage < target * 100) {
          status = 'below';
          // Formula: (attended + x) / (total + x) = target
          // attended + x = target * total + target * x
          // x - target * x = target * total - attended
          // x (1 - target) = target * total - attended
          // x = (target * total - attended) / (1 - target)
          classesNeeded = Math.ceil((target * total - attended) / (1 - target));
        } else if (percentage > target * 100) {
          status = 'above';
          // Formula: attended / (total + x) = target
          // attended = target * total + target * x
          // attended - target * total = target * x
          // x = (attended - target * total) / target
          canMiss = Math.floor((attended / target) - total);
        }

        setResult({
          percentage,
          status,
          classesNeeded,
          canMiss
        });
        setShowResult(true);
      } catch (err) {
        setError(t('common.errors.calculationError'));
        console.error('Attendance Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setTotalClasses('40');
      setAttendedClasses('30');
      setTargetPercentage('75');
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
        <FormField label={t('attendance.total_classes')}>
          <NumberInput
            value={totalClasses}
            onValueChange={(val) => setTotalClasses(val.toString())}
            placeholder="40"
            min={1}
            step={1}
            startIcon={<Calendar className="w-4 h-4" />}
          />
        </FormField>
        <FormField label={t('attendance.attended_classes')}>
          <NumberInput
            value={attendedClasses}
            onValueChange={(val) => setAttendedClasses(val.toString())}
            placeholder="30"
            min={0}
            step={1}
            startIcon={<UserCheck className="w-4 h-4" />}
          />
        </FormField>
      </div>

      <FormField label={t('attendance.target_percentage')}>
        <NumberInput
          value={targetPercentage}
          onValueChange={(val) => setTargetPercentage(val.toString())}
          placeholder="75"
          min={1}
          max={100}
          step={1}
          unit={t("common:units.percent")}
        />
      </FormField>

      <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />

      <ErrorDisplay error={error} />
    </div>
  );

  const resultSection = showResult && result ? (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-4">
        <div className={`inline-flex items-center justify-center p-3 rounded-full mb-2 ${result.status === 'below' ? 'bg-error/10' : 'bg-success/10'}`}>
          {result.status === 'below' ? (
            <AlertTriangle className="w-8 h-8 text-error" />
          ) : (
            <CheckCircle className="w-8 h-8 text-success" />
          )}
        </div>
        <h3 className="text-xl font-bold text-foreground">{t('attendance.result_title')}</h3>
        
        <div className="py-6 border-y border-border/50 space-y-2">
          <div className={`text-6xl font-black tracking-tighter ${result.status === 'below' ? 'text-error' : 'text-success'}`}>
            {result.percentage.toFixed(1)}%
          </div>
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            {t('attendance.current_attendance')}
          </div>
        </div>

        <div className={`p-4 rounded-xl text-sm font-medium ${result.status === 'below' ? 'bg-error/5 text-error' : 'bg-success/5 text-success'}`}>
          {result.status === 'below' ? (
            t('attendance.messages.below_target', { count: result.classesNeeded })
          ) : result.status === 'above' ? (
            t('attendance.messages.above_target', { count: result.canMiss })
          ) : (
            t('attendance.messages.exact_target')
          )}
        </div>
      </div>

      <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 mt-6">
        <h4 className="font-semibold mb-3 flex items-center gap-2 text-primary">
          <Info className="w-4 h-4" />
          {t('attendance.details')}
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('attendance.total_classes')}</span>
            <span className="font-medium">{totalClasses}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('attendance.attended_classes')}</span>
            <span className="font-medium">{attendedClasses}</span>
          </div>
          <div className="flex justify-between text-sm border-t pt-2 mt-2">
            <span className="text-muted-foreground">{t('attendance.target')}</span>
            <span className="font-medium">{targetPercentage}%</span>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-4">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
        <UserCheck className="w-10 h-10 text-muted-foreground/40" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground">{t('common.results_ready')}</h3>
        <p className="text-sm text-muted-foreground max-w-[250px]">
          {t('attendance.result_placeholder')}
        </p>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title={t('attendance.title')}
      description={t('attendance.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      category="education"
    />
  );
}
