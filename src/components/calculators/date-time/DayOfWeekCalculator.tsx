'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Hash } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface DayOfWeekResult {
  dayName: string;
  dayNumber: number;
  weekOfYear: number;
  dayOfYear: number;
}

export default function DayOfWeekCalculator() {
  const { t, i18n } = useTranslation(['calc/date-time', 'common']);
  const isRTL = i18n.language === 'ar';
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [result, setResult] = useState<DayOfWeekResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const getDayOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getWeekNumber = (date: Date): number => {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  };

  const calculate = () => {
    setError('');
    if (!selectedDate) {
      setError(t('day_of_week_calculator.error_empty'));
      return;
    }

    const date = new Date(selectedDate);
    if (isNaN(date.getTime())) {
      setError(t('day_of_week_calculator.error_invalid'));
      return;
    }

    setShowResult(false);
    setTimeout(() => {
      const days = [
        t('day_of_week_calculator.sunday'),
        t('day_of_week_calculator.monday'),
        t('day_of_week_calculator.tuesday'),
        t('day_of_week_calculator.wednesday'),
        t('day_of_week_calculator.thursday'),
        t('day_of_week_calculator.friday'),
        t('day_of_week_calculator.saturday')
      ];

      setResult({
        dayName: days[date.getDay()],
        dayNumber: date.getDay(),
        weekOfYear: getWeekNumber(date),
        dayOfYear: getDayOfYear(date)
      });
      setShowResult(true);
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setSelectedDate('');
      setResult(null);
      setError('');
    }, 300);
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t('day_of_week_calculator.title')}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer label={t('day_of_week_calculator.date')}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              if (error) setError('');
            }}
            className="date-input-rtl w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            dir={isRTL ? "rtl" : "ltr"}
          />
        </InputContainer>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t('day_of_week_calculator.day_of_week')}</div>
        <div className="text-5xl font-bold text-primary">{result.dayName}</div>
      </div>

      <div className="divider my-6"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <Calendar className="w-5 h-5 text-primary ml-2" />
            <div className="font-medium">{t('day_of_week_calculator.week_of_year')}</div>
          </div>
          <div className="text-3xl font-bold text-primary">{result.weekOfYear}</div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <Hash className="w-5 h-5 text-primary ml-2" />
            <div className="font-medium">{t('day_of_week_calculator.day_of_year')}</div>
          </div>
          <div className="text-3xl font-bold text-primary">{result.dayOfYear}</div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('day_of_week_calculator.title')}
      description={t('day_of_week_calculator.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
