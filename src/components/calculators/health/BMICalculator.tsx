'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Ruler, Scale, Calendar, Calculator } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function BMICalculator() {
  const { t } = useTranslation(['calc/health', 'common']);
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('male');
  const [result, setResult] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);

  // Clear errors when inputs change
  useEffect(() => {
    if (error) setError('');
  }, [height, weight, age]);

  // Calculate BMI
  const calculateBMI = useCallback(() => {
    // Validate inputs
    if (!height || !weight) {
      setError(t("bmi.errors.all_fields"));
      return;
    }

    const heightInMeters = parseFloat(height) / 100; // Convert cm to m
    const weightInKg = parseFloat(weight);

    if (heightInMeters <= 0 || weightInKg <= 0) {
      setError(t("bmi.errors.positive"));
      return;
    }

    // BMI formula: weight (kg) / (height (m))^2
    const bmi = weightInKg / (heightInMeters * heightInMeters);

    // Hide previous result first for animation effect
    setShowResult(false);

    setTimeout(() => {
      setResult(bmi);

      // Determine BMI category
      if (bmi < 18.5) {
        setCategory(t("bmi.results.underweight"));
      } else if (bmi >= 18.5 && bmi < 25) {
        setCategory(t("bmi.results.normal"));
      } else if (bmi >= 25 && bmi < 30) {
        setCategory(t("bmi.results.overweight"));
      } else if (bmi >= 30 && bmi < 35) {
        setCategory(t("bmi.results.obese_1"));
      } else if (bmi >= 35 && bmi < 40) {
        setCategory(t("bmi.results.obese_2"));
      } else {
        setCategory(t("bmi.results.obese_3"));
      }

      setShowResult(true);
    }, 300);
  }, [height, weight, t]);

  // Reset form
  const resetForm = useCallback(() => {
    setShowResult(false);

    setTimeout(() => {
      setHeight('');
      setWeight('');
      setAge('');
      setGender('male');
      setResult(null);
      setCategory('');
      setError('');
    }, 300);
  }, []);

  // Get color for BMI category
  const getCategoryColor = () => {
    if (!result) return 'text-foreground';
    if (result < 18.5) return 'text-blue-500';
    if (result >= 18.5 && result < 25) return 'text-success';
    if (result >= 25 && result < 30) return 'text-yellow-500';
    return 'text-error';
  };

  // Calculate ideal weight range
  const getIdealWeightRange = () => {
    if (!height) return null;
    
    const heightInMeters = parseFloat(height) / 100;
    const lowerBMI = 18.5;
    const upperBMI = 24.9;
    
    const lowerWeight = (lowerBMI * heightInMeters * heightInMeters).toFixed(1);
    const upperWeight = (upperBMI * heightInMeters * heightInMeters).toFixed(1);
    
    return { lowerWeight, upperWeight };
  };

  const idealRange = getIdealWeightRange();

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculateBMI();
    }
  }, [calculateBMI]);

  const genderOptions = [
    { value: 'male', label: t("bmi.inputs.male") },
    { value: 'female', label: t("bmi.inputs.female") },
  ];
  
  // Input section content
  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">{t("bmi.inputs.enter_details")}</div>
      
      <div className="max-w-md mx-auto space-y-4">
        <FormField 
          label={t("bmi.inputs.height")} 
          tooltip={t("bmi.tooltips.height")}
        >
          <NumberInput
            value={height}
            onValueChange={(val) => setHeight(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t('bmi.placeholders.height')}
            min={100}
            max={250}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>
        
        <FormField 
          label={t("bmi.inputs.weight")}
          tooltip={t("bmi.tooltips.weight")}
        >
          <NumberInput
            value={weight}
            onValueChange={(val) => setWeight(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t('bmi.placeholders.weight')}
            min={30}
            max={300}
            step={0.1}
            startIcon={<Scale className="h-4 w-4" />}
          />
        </FormField>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField 
            label={t("bmi.inputs.age")}
            tooltip={t("bmi.tooltips.age")}
            className="sm:col-span-1"
          >
            <NumberInput
              value={age}
              onValueChange={(val) => setAge(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t('bmi.placeholders.age')}
              min={18}
              max={100}
              startIcon={<Calendar className="h-4 w-4" />}
            />
          </FormField>
          
          <FormField 
            label={t("bmi.inputs.gender")}
            tooltip={t("bmi.tooltips.gender")}
            className="sm:col-span-1"
          >
            <Combobox
              options={genderOptions}
              value={gender}
              onChange={(val) => setGender(val)}
              placeholder={t("bmi.inputs.gender")}
            />
          </FormField>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculateBMI} onReset={resetForm} />
        <ErrorDisplay error={error} />
      </div>
    </>
  );
  
  // Results section content
  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-5">
        <div className="text-foreground-70 mb-1">{t("bmi.results.your_bmi")}</div>
        <div className="text-4xl font-bold">{result.toFixed(1)}</div>
        <div className={`text-xl font-bold mt-2 ${getCategoryColor()}`}>
          {category}
        </div>
      </div>

      <div className="divider my-4"></div>

      <div className="mt-6 space-y-4">
        <h3 className="font-bold">{t("bmi.results.range_title")}</h3>
        <div className="p-4 bg-foreground/5 rounded-lg border border-foreground/10">
          <div className="text-sm font-medium mb-2">{t("bmi.results.category")}</div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span>{t("bmi.results.underweight")}</span>
              <span className="font-bold text-blue-500">{t("bmi.categories.underweight_range")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>{t("bmi.results.normal")}</span>
              <span className="font-bold text-green-500">{t("bmi.categories.normal_range")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>{t("bmi.results.overweight")}</span>
              <span className="font-bold text-yellow-500">{t("bmi.categories.overweight_range")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>{t("bmi.results.obese_1")}</span>
              <span className="font-bold text-orange-500">{t("bmi.categories.obese_1_range")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>{t("bmi.results.obese_2")}</span>
              <span className="font-bold text-red-500">{t("bmi.categories.obese_2_range")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>{t("bmi.results.obese_3")}</span>
              <span className="font-bold text-red-700">{t("bmi.categories.obese_3_range")}</span>
            </div>
          </div>
        </div>

        {idealRange && (
          <div className="mt-4 pt-4 border-t border-border">
            <h3 className="font-bold mb-2">{t("bmi.results.ideal_weight")}</h3>
            <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg text-center">
              <p>{t("bmi.results.ideal_range")}</p>
              <div className="flex justify-center items-center space-x-4 space-x-reverse mt-2 font-bold text-lg">
                <div className="bg-card px-3 py-1 rounded-md text-primary">{idealRange.lowerWeight} {t("common:common.units.kg")}</div>
                <div className="bg-card px-3 py-1 rounded-md text-primary">{idealRange.upperWeight} {t("common:common.units.kg")}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Calculator className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("bmi.errors.empty_state.title")}</p>
      <div className="mt-4 text-primary text-sm">{t("bmi.errors.empty_state.subtitle")}</div>
    </div>
  );

  return (
    <CalculatorLayout title={t("bmi.title")}
      titleTooltip={t("bmi.description")}
      description={t("bmi.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("bmi.description")}
     className="rtl" />
  );
} 

