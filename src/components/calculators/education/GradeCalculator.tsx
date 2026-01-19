'use client';

/**
 * Grade Calculator - Education Category
 *
 * Features:
 * - Calculate final grade from assignments
 * - Weighted categories (homework, tests, final exam)
 * - Calculate required score on final exam for desired grade
 * - Letter grade conversion
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, GraduationCap, CheckCircle, AlertTriangle, BookOpen, Percent, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface GradeCategory {
  id: string;
  name: string;
  weight: number;
  score: number;
}

interface GradeResult {
  currentGrade: number;
  letterGrade: string;
  requiredFinalExamScore: number | null;
  finalGradeIfPerfect: number;
  finalGradeIfZero: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const LETTER_GRADE_SCALE = [
  { min: 93, letter: 'A' },
  { min: 90, letter: 'A-' },
  { min: 87, letter: 'B+' },
  { min: 83, letter: 'B' },
  { min: 80, letter: 'B-' },
  { min: 77, letter: 'C+' },
  { min: 73, letter: 'C' },
  { min: 70, letter: 'C-' },
  { min: 67, letter: 'D+' },
  { min: 63, letter: 'D' },
  { min: 60, letter: 'D-' },
  { min: 0, letter: 'F' }
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function GradeCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t, i18n } = useTranslation(['calc/education', 'common']);
  const isRTL = i18n.language === 'ar';
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [categories, setCategories] = useState<GradeCategory[]>([
    { id: '1', name: '', weight: 20, score: 0 },
    { id: '2', name: '', weight: 50, score: 0 },
    { id: '3', name: '', weight: 30, score: 0 }
  ]);
  const [desiredGrade, setDesiredGrade] = useState<string>('90');
  const [result, setResult] = useState<GradeResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    initDateInputRTL();
  }, []);

  useEffect(() => {
    if (error) setError('');
  }, [categories, desiredGrade]);

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const totalWeight = categories.reduce((sum, cat) => sum + cat.weight, 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
      setError(t('grade.errors.weights_total_100'));
      return false;
    }

    for (const category of categories) {
      if (category.weight < 0 || category.weight > 100) {
        setError(t('grade.errors.invalid_weight'));
        return false;
      }
      if (category.score < 0 || category.score > 100) {
        setError(t('grade.errors.invalid_score'));
        return false;
      }
    }

    const desired = parseFloat(desiredGrade);
    if (isNaN(desired) || desired < 0 || desired > 100) {
      setError(t('grade.errors.invalid_desired'));
      return false;
    }

    return true;
  };

  // ---------------------------------------------------------------------------
  // CALCULATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        // Calculate current grade
        let currentGrade = 0;
        categories.forEach(cat => {
          currentGrade += (cat.score * cat.weight) / 100;
        });

        // Get letter grade
        const letterGrade = getLetterGrade(currentGrade);

        // Calculate required final exam score for desired grade
        const finalExamCategory = categories.find(c => c.name.toLowerCase().includes('final') || c.name.includes('نهائي'));
        let requiredFinalExamScore: number | null = null;

        if (finalExamCategory) {
          const desired = parseFloat(desiredGrade);
          const otherCategories = categories.filter(c => c.id !== finalExamCategory.id);
          let otherGradeSum = 0;
          otherCategories.forEach(cat => {
            otherGradeSum += (cat.score * cat.weight) / 100;
          });

          // desired = otherGradeSum + (finalExamScore * finalExamWeight / 100)
          // finalExamScore = (desired - otherGradeSum) * 100 / finalExamWeight
          requiredFinalExamScore = ((desired - otherGradeSum) * 100) / finalExamCategory.weight;
        }

        // Calculate grade if perfect on final
        let finalGradeIfPerfect = 0;
        categories.forEach(cat => {
          if (cat.name.toLowerCase().includes('final') || cat.name.includes('نهائي')) {
            finalGradeIfPerfect += (100 * cat.weight) / 100;
          } else {
            finalGradeIfPerfect += (cat.score * cat.weight) / 100;
          }
        });

        // Calculate grade if zero on final
        let finalGradeIfZero = 0;
        categories.forEach(cat => {
          if (!(cat.name.toLowerCase().includes('final') || cat.name.includes('نهائي'))) {
            finalGradeIfZero += (cat.score * cat.weight) / 100;
          }
        });

        setResult({
          currentGrade,
          letterGrade,
          requiredFinalExamScore,
          finalGradeIfPerfect,
          finalGradeIfZero
        });

        setShowResult(true);
      } catch (err) {
        setError(t("common.errors.calculationError"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setCategories([
        { id: '1', name: '', weight: 20, score: 0 },
        { id: '2', name: '', weight: 50, score: 0 },
        { id: '3', name: '', weight: 30, score: 0 }
      ]);
      setDesiredGrade('90');
      setResult(null);
      setError('');
    }, 300);
  };

  // ---------------------------------------------------------------------------
  // CATEGORY MANAGEMENT FUNCTIONS
  // ---------------------------------------------------------------------------
  const addCategory = () => {
    const newCategory: GradeCategory = {
      id: Date.now().toString(),
      name: '',
      weight: 0,
      score: 0
    };
    setCategories([...categories, newCategory]);
  };

  const removeCategory = (id: string) => {
    if (categories.length > 1) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const updateCategory = (id: string, field: keyof GradeCategory, value: string | number) => {
    setCategories(categories.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------
  const getLetterGrade = (score: number): string => {
    for (const grade of LETTER_GRADE_SCALE) {
      if (score >= grade.min) {
        return grade.letter;
      }
    }
    return 'F';
  };

  const getGradeColor = (score: number): string => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-info';
    if (score >= 70) return 'text-warning';
    if (score >= 60) return 'text-orange-500';
    return 'text-error';
  };

  const getTotalWeight = (): number => {
    return categories.reduce((sum, cat) => sum + cat.weight, 0);
  };

  // ---------------------------------------------------------------------------
  // JSX SECTIONS
  // ---------------------------------------------------------------------------
  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t('grade.title')}
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Categories List */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">{t('grade.categories')}</h3>
            <button
              onClick={addCategory}
              className="text-sm px-3 py-1 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 ml-1" />
              {t('grade.add_category')}
            </button>
          </div>

          {categories.map((category, index) => (
            <div key={category.id} className="bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm text-foreground-70">
                  {t('grade.category')} {index + 1}
                </span>
                {categories.length > 1 && (
                  <button
                    onClick={() => removeCategory(category.id)}
                    className="text-error hover:text-error-hover text-sm"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Category Name */}
                <div>
                  <label className="block text-sm text-foreground-70 mb-1">
                    {t('grade.category_name')}
                  </label>
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
                    placeholder={t('grade.category_placeholder')}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm text-foreground-70 mb-1">
                    {t('grade.weight')} (%)
                  </label>
                  <NumberInput
                    value={category.weight.toString()}
                    onValueChange={(val) => updateCategory(category.id, 'weight', parseFloat(val.toString()) || 0)}
                    min={0}
                    max={100}
                    step={1}
                    startIcon={<Percent className="h-4 w-4" />}
                  />
                </div>

                {/* Score */}
                <div>
                  <label className="block text-sm text-foreground-70 mb-1">
                    {t('grade.score')} (%)
                  </label>
                  <NumberInput
                    value={category.score.toString()}
                    onValueChange={(val) => updateCategory(category.id, 'score', parseFloat(val.toString()) || 0)}
                    min={0}
                    max={100}
                    step={0.1}
                    startIcon={<CheckCircle className="h-4 w-4" />}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Total Weight Display */}
          <div className={`p-3 rounded-lg border ${getTotalWeight() === 100 ? 'bg-success/10 border-success/20' : 'bg-warning/10 border-warning/20'}`}>
            <div className="flex justify-between items-center">
              <span className="font-medium">{t('grade.total_weight')}:</span>
              <span className={`font-bold text-lg ${getTotalWeight() === 100 ? 'text-success' : 'text-warning'}`}>
                {getTotalWeight().toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Desired Grade */}
        <FormField label={t('grade.desired')} tooltip={t('grade.desired_tooltip')}>
          <NumberInput
            value={desiredGrade}
            onValueChange={(val) => setDesiredGrade(val.toString())}
            placeholder={t('grade.desired_placeholder')}
            min={0}
            max={100}
            step={0.1}
            startIcon={<GraduationCap className="h-4 w-4" />}
          />
        </FormField>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      {/* Error Message */}
      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {/* Information Section */}
      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t('calculators.grade_what_is')}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t('calculators.grade_description')}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t('calculators.grade_features')}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t('calculators.grade_feature_1')}</li>
              <li>{t('calculators.grade_feature_2')}</li>
              <li>{t('calculators.grade_feature_3')}</li>
              <li>{t('calculators.grade_feature_4')}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      {/* Main Result Display */}
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t('grade.current')}
        </div>
        <div className={`text-4xl font-bold mb-2 ${getGradeColor(result.currentGrade)}`}>
          {result.currentGrade.toFixed(2)}%
        </div>
        <div className={`text-2xl font-bold ${getGradeColor(result.currentGrade)}`}>
          {result.letterGrade}
        </div>
      </div>

      {/* Divider */}
      <div className="divider my-6"></div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t('grade.details')}
        </h3>

        {/* Result Cards Grid */}
        <div className="grid grid-cols-1 gap-4">
          {/* Required Final Exam Score */}
          {result.requiredFinalExamScore !== null && (
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center mb-2">
                <BookOpen className="w-5 h-5 text-primary ml-2" />
                <div className="font-medium">{t('grade.required_final')}</div>
              </div>
              <div className="text-sm text-foreground-70 mb-1">
                {t('grade.required_final_desc')} {desiredGrade}%
              </div>
              <div className={`text-2xl font-bold ${result.requiredFinalExamScore >= 0 && result.requiredFinalExamScore <= 100 ? 'text-primary' : 'text-warning'}`}>
                {result.requiredFinalExamScore.toFixed(2)}%
              </div>
              {result.requiredFinalExamScore > 100 && (
                <div className="text-sm text-warning mt-1">
                  {t('grade.impossible')}
                </div>
              )}
              {result.requiredFinalExamScore < 0 && (
                <div className="text-sm text-success mt-1">
                  {t('grade.already_achieved')}
                </div>
              )}
            </div>
          )}

          {/* Grade if Perfect on Final */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t('grade.if_perfect')}</div>
            </div>
            <div className="text-2xl font-bold text-success">
              {result.finalGradeIfPerfect.toFixed(2)}% ({getLetterGrade(result.finalGradeIfPerfect)})
            </div>
          </div>

          {/* Grade if Zero on Final */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t('grade.if_zero')}</div>
            </div>
            <div className="text-2xl font-bold text-error">
              {result.finalGradeIfZero.toFixed(2)}% ({getLetterGrade(result.finalGradeIfZero)})
            </div>
          </div>
        </div>
      </div>

      {/* Formula Explanation */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t('grade.formula')}</h4>
            <p className="text-sm text-foreground-70">
              {t('grade.formula_explanation')}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('grade.title')}
      description={t('grade.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
