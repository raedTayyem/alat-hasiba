'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  totalHours: number;
  nextBirthdayDays: number;
}

export default function AgeCalculator() {
  const { t, i18n } = useTranslation(['calc/date_time', 'common']);
  const isRTL = i18n.language === 'ar';
  const [birthDate, setBirthDate] = useState<string>('');
  const [result, setResult] = useState<AgeResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const calculate = () => {
    setError('');
    if (!birthDate) {
      setError(t('age.error_empty'));
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();

    if (isNaN(birth.getTime())) {
      setError(t('age.error_invalid'));
      return;
    }

    if (birth > today) {
      setError(t('age.error_future'));
      return;
    }

    setShowResult(false);
    setTimeout(() => {
      let years = today.getFullYear() - birth.getFullYear();
      let months = today.getMonth() - birth.getMonth();
      let days = today.getDate() - birth.getDate();

      if (days < 0) {
        months--;
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      const diffTime = today.getTime() - birth.getTime();
      const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const totalMonths = years * 12 + months;
      const totalHours = totalDays * 24;

      // Next birthday
      let nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
      if (nextBirthday < today) {
        nextBirthday = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
      }
      const nextBirthdayDays = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      setResult({
        years,
        months,
        days,
        totalDays,
        totalMonths,
        totalHours,
        nextBirthdayDays
      });
      setShowResult(true);
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setBirthDate('');
      setResult(null);
      setError('');
    }, 300);
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t('age.title')}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer label={t('age.birth_date')}>
          <input type="date" value={birthDate} onChange={(e) => {
            setBirthDate(e.target.value);
            if (error) setError('');
          }} className="date-input-rtl w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            dir={isRTL ? "rtl" : "ltr"} />
        </InputContainer>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t('age.info')}</h2>
          <p className="text-foreground-70">
            {t('age.description')}
          </p>
        </div>
      )}
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t('age.your_age')}</div>
        <div className="text-3xl font-bold text-primary mb-2">
          {result.years} {t('age.years')}, {result.months} {t('age.months')}, {result.days} {t('age.days')}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2">{t('age.total_days')}</div>
          <div className="text-2xl font-bold text-primary">{result.totalDays.toLocaleString()}</div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2">{t('age.total_months')}</div>
          <div className="text-2xl font-bold text-primary">{result.totalMonths.toLocaleString()}</div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2">{t('age.total_hours')}</div>
          <div className="text-2xl font-bold text-primary">{result.totalHours.toLocaleString()}</div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2">{t('age.next_birthday')}</div>
          <div className="text-2xl font-bold text-primary">{result.nextBirthdayDays} {t('age.days')}</div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('age.title')}
      description={t('age.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
