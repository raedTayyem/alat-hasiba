'use client';

/**
 * GPA Calculator - Education Category
 * 
 * Features:
 * - Calculate Semester GPA
 * - Calculate Cumulative GPA
 * - Multiple grading scales (4.0, 5.0)
 * - Weighted courses by credits
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, Plus, Trash2, CheckCircle, BookOpen, Info, Save } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

interface GPAResult {
  gpa: number;
  totalCredits: number;
  totalPoints: number;
  letterGrade: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const GRADE_POINTS_4: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0
};

const GRADE_POINTS_5: Record<string, number> = {
  'A+': 5.0, 'A': 5.0, 'A-': 4.7,
  'B+': 4.3, 'B': 4.0, 'B-': 3.7,
  'C+': 3.3, 'C': 3.0, 'C-': 2.7,
  'D+': 2.3, 'D': 2.0, 'D-': 1.7,
  'F': 0.0
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function GPACalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t, i18n } = useTranslation(['calc/education', 'common']);
  const isRTL = i18n.language === 'ar';

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: '', grade: 'A', credits: 3 },
    { id: '2', name: '', grade: 'B', credits: 3 },
    { id: '3', name: '', grade: 'A', credits: 4 }
  ]);
  const [scale, setScale] = useState<number>(4);
  const [currentGPA, setCurrentGPA] = useState<string>('');
  const [currentCredits, setCurrentCredits] = useState<string>('');
  const [result, setResult] = useState<GPAResult | null>(null);
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

    if (courses.length === 0) {
      setError(t('gpa.errors.no_courses'));
      return false;
    }

    for (const course of courses) {
      if (course.credits < 0) {
        setError(t('gpa.errors.invalid_credits'));
        return false;
      }
    }

    const curGPA = parseFloat(currentGPA);
    if (currentGPA && (isNaN(curGPA) || curGPA < 0 || curGPA > scale)) {
      setError(t('gpa.errors.invalid_current_gpa', { scale }));
      return false;
    }

    const curCredits = parseFloat(currentCredits);
    if (currentCredits && (isNaN(curCredits) || curCredits < 0)) {
      setError(t('gpa.errors.invalid_current_credits'));
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
        const gradePoints = scale === 4 ? GRADE_POINTS_4 : GRADE_POINTS_5;
        let totalPoints = 0;
        let totalCredits = 0;

        // Add current courses
        courses.forEach(course => {
          const points = gradePoints[course.grade] || 0;
          totalPoints += points * course.credits;
          totalCredits += course.credits;
        });

        // Add prior cumulative data if provided
        const priorGPA = parseFloat(currentGPA);
        const priorCredits = parseFloat(currentCredits);

        if (!isNaN(priorGPA) && !isNaN(priorCredits)) {
          totalPoints += priorGPA * priorCredits;
          totalCredits += priorCredits;
        }

        const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
        
        // Determine letter grade based on GPA
        let letterGrade = 'F';
        const pointsArray = Object.entries(gradePoints).sort((a, b) => b[1] - a[1]);
        for (const [letter, points] of pointsArray) {
          if (gpa >= points) {
            letterGrade = letter;
            break;
          }
        }

        setResult({
          gpa,
          totalCredits,
          totalPoints,
          letterGrade
        });
        setShowResult(true);
      } catch (err) {
        setError(t('common.errors.calculationError'));
        console.error('GPA Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setCourses([
        { id: '1', name: '', grade: 'A', credits: 3 },
        { id: '2', name: '', grade: 'B', credits: 3 },
        { id: '3', name: '', grade: 'A', credits: 4 }
      ]);
      setScale(4);
      setCurrentGPA('');
      setCurrentCredits('');
      setResult(null);
      setError('');
    }, 300);
  };

  // ---------------------------------------------------------------------------
  // COURSE MANAGEMENT FUNCTIONS
  // ---------------------------------------------------------------------------
  const addCourse = () => {
    setCourses([...courses, { id: Date.now().toString(), name: '', grade: 'A', credits: 3 }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // ---------------------------------------------------------------------------
  // RENDER HELPERS
  // ---------------------------------------------------------------------------
  const getGPAColor = (gpa: number) => {
    const ratio = gpa / scale;
    if (ratio >= 0.9) return 'text-success';
    if (ratio >= 0.8) return 'text-info';
    if (ratio >= 0.7) return 'text-warning';
    if (ratio >= 0.6) return 'text-orange-500';
    return 'text-error';
  };

  // ---------------------------------------------------------------------------
  // JSX SECTIONS
  // ---------------------------------------------------------------------------
  const inputSection = (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-2">{t('gpa.grading_scale')}</label>
          <div className="flex p-1 bg-muted rounded-lg">
            {[4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setScale(s)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  scale === s ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s}.0
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            {t('gpa.courses')}
          </h3>
          <button
            onClick={addCourse}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <Plus className="w-4 h-4" />
            {t('gpa.add_course')}
          </button>
        </div>

        <div className="space-y-3">
          {courses.map((course, index) => (
            <div key={course.id} className="flex gap-3 items-end bg-muted/30 p-3 rounded-lg border border-transparent hover:border-border transition-colors">
              <div className="flex-1 min-w-0">
                {index === 0 && <label className="block text-xs font-medium mb-1 px-1">{t('gpa.course_name')}</label>}
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                  placeholder={`${t('gpa.course')} ${index + 1}`}
                  className="w-full h-14 bg-background border-2 border-border rounded-2xl px-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                />
              </div>
              <div className="w-28">
                {index === 0 && <label className="block text-xs font-medium mb-1 px-1">{t('gpa.grade')}</label>}
                <select
                  value={course.grade}
                  onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                  className="w-full h-14 bg-background border-2 border-border rounded-2xl px-2 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                >
                  {Object.keys(scale === 4 ? GRADE_POINTS_4 : GRADE_POINTS_5).map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                {index === 0 && <label className="block text-xs font-medium mb-1 px-1">{t('gpa.credits')}</label>}
                <NumberInput
                  value={course.credits}
                  onValueChange={(val) => updateCourse(course.id, 'credits', parseFloat(val.toString()) || 0)}
                  min={0}
                  step={0.5}
                />
              </div>
              <button
                onClick={() => removeCourse(course.id)}
                disabled={courses.length <= 1}
                className="p-4 text-muted-foreground hover:text-error transition-colors disabled:opacity-30 h-14 flex items-center"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t space-y-4">
        <h3 className="text-md font-semibold flex items-center gap-2">
          <Save className="w-4 h-4 text-primary" />
          {t('gpa.cumulative_optional')}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField label={t('gpa.prior_gpa')}>
            <NumberInput
              value={currentGPA}
              onValueChange={(val) => setCurrentGPA(val.toString())}
              placeholder={`0.00 - ${scale}.00`}
              min={0}
              max={scale}
              step={0.01}
            />
          </FormField>
          <FormField label={t('gpa.prior_credits')}>
            <NumberInput
              value={currentCredits}
              onValueChange={(val) => setCurrentCredits(val.toString())}
              placeholder="0"
              min={0}
            />
          </FormField>
        </div>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />

      <ErrorDisplay error={error} />
    </div>
  );

  const resultSection = showResult && result ? (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{t('gpa.result_title')}</h3>
        
        <div className="py-6 border-y border-border/50 space-y-2">
          <div className={`text-6xl font-black tracking-tighter ${getGPAColor(result.gpa)}`}>
            {result.gpa.toFixed(2)}
          </div>
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            GPA / {scale}.0
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="p-4 bg-muted/50 rounded-xl">
            <div className="text-2xl font-bold text-foreground">{result.letterGrade}</div>
            <div className="text-xs text-muted-foreground">{t('gpa.equivalent_letter')}</div>
          </div>
          <div className="p-4 bg-muted/50 rounded-xl">
            <div className="text-2xl font-bold text-foreground">{result.totalCredits}</div>
            <div className="text-xs text-muted-foreground">{t('gpa.total_credits')}</div>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 mt-6">
        <h4 className="font-semibold mb-3 flex items-center gap-2 text-primary">
          <Info className="w-4 h-4" />
          {t('gpa.breakdown')}
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('gpa.total_grade_points')}</span>
            <span className="font-medium">{result.totalPoints.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('gpa.total_credits')}</span>
            <span className="font-medium">{result.totalCredits}</span>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-4">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
        <Calculator className="w-10 h-10 text-muted-foreground/40" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground">{t('common.results_ready')}</h3>
        <p className="text-sm text-muted-foreground max-w-[250px]">
          {t('gpa.result_placeholder')}
        </p>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title={t('gpa.title')}
      description={t('gpa.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      category="education"
    />
  );
}
