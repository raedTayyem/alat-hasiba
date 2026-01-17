'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface RandomResult {
  number: number;
  min: number;
  max: number;
  count: number;
  numbers?: number[];
}

export default function RandomNumberGenerator() {
  const { t, i18n } = useTranslation(['translation', 'calc/misc']);
  const isRTL = i18n.language === 'ar';
  const [min, setMin] = useState<string>('1');
  const [max, setMax] = useState<string>('100');
  const [count, setCount] = useState<string>('1');
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(true);
  const [result, setResult] = useState<RandomResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const minNum = parseFloat(min);
    const maxNum = parseFloat(max);
    const countNum = parseInt(count);

    if (isNaN(minNum) || isNaN(maxNum) || isNaN(countNum)) {
      setError(t("calculators.invalid_input"));
      return false;
    }

    if (minNum >= maxNum) {
      setError(t("calc/misc:random_number_generator.min_max_error"));
      return false;
    }

    if (countNum < 1 || countNum > 10000) {
      setError(t("calc/misc:random_number_generator.count_error"));
      return false;
    }

    if (!allowDuplicates && countNum > (maxNum - minNum + 1)) {
      setError(t("calc/misc:random_number_generator.no_duplicates_error"));
      return false;
    }

    return true;
  };

  const generate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const minNum = parseFloat(min);
        const maxNum = parseFloat(max);
        const countNum = parseInt(count);

        if (countNum === 1) {
          // Generate single random number
          const randomNum = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
          setResult({
            number: randomNum,
            min: minNum,
            max: maxNum,
            count: 1,
          });
        } else {
          // Generate multiple random numbers
          const numbers: number[] = [];

          if (allowDuplicates) {
            for (let i = 0; i < countNum; i++) {
              const randomNum = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
              numbers.push(randomNum);
            }
          } else {
            // No duplicates allowed
            const available = Array.from(
              { length: maxNum - minNum + 1 },
              (_, i) => minNum + i
            );

            for (let i = 0; i < countNum; i++) {
              const randomIndex = Math.floor(Math.random() * available.length);
              numbers.push(available[randomIndex]);
              available.splice(randomIndex, 1);
            }
          }

          setResult({
            number: numbers[0],
            min: minNum,
            max: maxNum,
            count: countNum,
            numbers,
          });
        }

        setShowResult(true);
      } catch (err) {
        setError(t("calculators.calculation_error"));
        console.error('Generation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setMin('1');
      setMax('100');
      setCount('1');
      setAllowDuplicates(true);
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      generate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("calc/misc:random_number_generator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer
          label={t("calc/misc:random_number_generator.min")}
          tooltip={t("calc/misc:random_number_generator.min_tooltip")}
        >
          <input
            type="number"
            value={min}
            onChange={(e) => {
              setMin(e.target.value);
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            placeholder={t("calc/misc:random_number_generator.min_placeholder")}
            dir="ltr"
          />
        </InputContainer>

        <InputContainer
          label={t("calc/misc:random_number_generator.max")}
          tooltip={t("calc/misc:random_number_generator.max_tooltip")}
        >
          <input
            type="number"
            value={max}
            onChange={(e) => {
              setMax(e.target.value);
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            placeholder={t("calc/misc:random_number_generator.max_placeholder")}
            dir="ltr"
          />
        </InputContainer>

        <InputContainer
          label={t("calc/misc:random_number_generator.count")}
          tooltip={t("calc/misc:random_number_generator.count_tooltip")}
        >
          <input
            type="number"
            value={count}
            onChange={(e) => {
              setCount(e.target.value);
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            placeholder={t("calc/misc:random_number_generator.count_placeholder")}
            dir="ltr"
            min="1"
            max="10000"
          />
        </InputContainer>

        <InputContainer
          label={t("calc/misc:random_number_generator.allow_duplicates")}
          tooltip={t("calc/misc:random_number_generator.allow_duplicates_tooltip")}
        >
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={allowDuplicates}
              onChange={(e) => {
                setAllowDuplicates(e.target.checked);
                if (error) setError('');
              }}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className={`${isRTL ? 'mr-3' : 'ml-3'} text-foreground`}>
              {t("calc/misc:random_number_generator.allow_duplicates_label")}
            </span>
          </label>
        </InputContainer>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons
          onCalculate={generate}
          onReset={resetCalculator}
          calculateText={t("common.generate")}
        />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("calc/misc:random_number_generator.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("calc/misc:random_number_generator.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("calc/misc:random_number_generator.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("calc/misc:random_number_generator.use_case_1")}</li>
              <li>{t("calc/misc:random_number_generator.use_case_2")}</li>
              <li>{t("calc/misc:random_number_generator.use_case_3")}</li>
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
          {result.count === 1 ? t("calc/misc:random_number_generator.result_single") : t("calc/misc:random_number_generator.result_multiple")}
        </div>
        {result.count === 1 ? (
          <div className="text-5xl font-bold text-primary mb-2" dir="ltr">
            {result.number}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4">
            {result.numbers?.map((num, index) => (
              <div
                key={index}
                className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-center"
              >
                <div className="text-2xl font-bold text-primary" dir="ltr">
                  {num}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("calc/misc:random_number_generator.details")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div className="font-medium">{t("calc/misc:random_number_generator.range")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              {result.min} - {result.max}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              <div className="font-medium">{t("calc/misc:random_number_generator.count_generated")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              {result.count}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("calc/misc:random_number_generator.note_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("calc/misc:random_number_generator.note")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("calc/misc:random_number_generator.title")}
      description={t("calc/misc:random_number_generator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
