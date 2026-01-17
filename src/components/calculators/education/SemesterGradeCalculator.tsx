'use client';

/**
 * Semester Grade Calculator - Education Category
 * 
 * Features:
 * - Calculate weighted average for multiple courses in a semester
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, GraduationCap, CheckCircle, Info, BookOpen } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface CourseGrade {
  id: string;
  name: string;
  grade: number;
  weight: number;
}

interface SemesterResult {
  average: number;
  letterGrade: string;
  totalWeight: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const LETTER_GRADES = [
  { min: 90, letter: 'A' },
  { min: 80, letter: 'B' },
  { min: 70, letter: 'C' },
  { min: 60, letter: 'D' },
  { min: 0, letter: 'F' }
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function SemesterGradeCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/education', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [courses, setCourses] = useState<CourseGrade[]>([
    { id: '1', name: '', grade: 85, weight: 1 },
    { id: '2', name: '', grade: 90, weight: 1 },
    { id: '3', name: '', grade: 78, weight: 1 }
  ]);
  const [result, setResult] = useState<SemesterResult | null>(null);
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
      setError(t('semester.errors.no_courses'));
      return false;
    }

    for (const course of courses) {
      if (course.grade < 0 || course.grade > 200) {
        setError(t('semester.errors.invalid_grade'));
        return false;
      }
      if (course.weight <= 0) {
        setError(t('semester.errors.invalid_weight'));
        return false;
      }
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
        let totalWeightedPoints = 0;
        let totalWeight = 0;

        courses.forEach(course => {
          totalWeightedPoints += course.grade * course.weight;
          totalWeight += course.weight;
        });

        const average = totalWeight > 0 ? totalWeightedPoints / totalWeight : 0;
        
        let letterGrade = 'F';
        for (const g of LETTER_GRADES) {
          if (average >= g.min) {
            letterGrade = g.letter;
            break;
          }
        }

        setResult({
          average,
          letterGrade,
          totalWeight
        });
        setShowResult(true);
      } catch (err) {
        setError(t('common.errors.calculationError'));
        console.error('Semester Grade Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setCourses([
        { id: '1', name: '', grade: 85, weight: 1 },
        { id: '2', name: '', grade: 90, weight: 1 },
        { id: '3', name: '', grade: 78, weight: 1 }
      ]);
      setResult(null);
      setError('');
    }, 300);
  };

  // ---------------------------------------------------------------------------
  // COURSE MANAGEMENT FUNCTIONS
  // ---------------------------------------------------------------------------
  const addCourse = () => {
    setCourses([...courses, { id: Date.now().toString(), name: '', grade: 0, weight: 1 }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof CourseGrade, value: string | number) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // ---------------------------------------------------------------------------
  // JSX SECTIONS
  // ---------------------------------------------------------------------------
  const inputSection = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          {t('semester.courses')}
        </h3>
        <button
          onClick={addCourse}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <Plus className="w-4 h-4" />
          {t('semester.add_course')}
        </button>
      </div>

      <div className="space-y-3">
        {courses.map((course, index) => (
          <div key={course.id} className="flex gap-3 items-end bg-muted/30 p-3 rounded-lg border border-transparent hover:border-border transition-colors">
            <div className="flex-1 min-w-0">
              {index === 0 && <label className="block text-xs font-medium mb-1 px-1">{t('semester.course_name')}</label>}
              <input
                type="text"
                value={course.name}
                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                placeholder={`${t('semester.course')} ${index + 1}`}
                className="w-full h-14 bg-background border-2 border-border rounded-2xl px-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              />
            </div>
            <div className="w-28">
              {index === 0 && <label className="block text-xs font-medium mb-1 px-1">{t('semester.grade')}</label>}
              <NumberInput
                value={course.grade}
                onValueChange={(val) => updateCourse(course.id, 'grade', parseFloat(val.toString()) || 0)}
                min={0}
                max={200}
                step={0.1}
              />
            </div>
            <div className="w-24">
              {index === 0 && <label className="block text-xs font-medium mb-1 px-1">{t('semester.weight')}</label>}
              <NumberInput
                value={course.weight}
                onValueChange={(val) => updateCourse(course.id, 'weight', parseFloat(val.toString()) || 0)}
                min={0.1}
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
        <h3 className="text-xl font-bold text-foreground">{t('semester.result_title')}</h3>
        
        <div className="py-6 border-y border-border/50 space-y-2">
          <div className="text-6xl font-black tracking-tighter text-primary">
            {result.average.toFixed(1)}%
          </div>
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            {t('semester.semester_average')}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="p-4 bg-muted/50 rounded-xl">
            <div className="text-2xl font-bold text-foreground">{result.letterGrade}</div>
            <div className="text-xs text-muted-foreground">{t('semester.equivalent_letter')}</div>
          </div>
          <div className="p-4 bg-muted/50 rounded-xl">
            <div className="text-2xl font-bold text-foreground">{result.totalWeight}</div>
            <div className="text-xs text-muted-foreground">{t('semester.total_credits_weight')}</div>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 mt-6">
        <h4 className="font-semibold mb-3 flex items-center gap-2 text-primary">
          <Info className="w-4 h-4" />
          {t('semester.breakdown')}
        </h4>
        <div className="space-y-3">
          {courses.map((course, i) => (
            <div key={course.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{course.name || `${t('semester.course')} ${i+1}`}</span>
              <span className="font-medium">{course.grade}% (x{course.weight})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-4">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
        <GraduationCap className="w-10 h-10 text-muted-foreground/40" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground">{t('common.results_ready')}</h3>
        <p className="text-sm text-muted-foreground max-w-[250px]">
          {t('semester.result_placeholder')}
        </p>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title={t('semester.title')}
      description={t('semester.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      category="education"
    />
  );
}
