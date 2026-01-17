'use client';

/**
 * LUNAR AGE CALCULATOR
 *
 * Calculates age based on the Islamic/Hijri lunar calendar.
 * The Islamic calendar is lunar-based with 12 months of 29-30 days each.
 * A lunar year is approximately 354.37 days (about 11 days shorter than solar year).
 *
 * Formula:
 * - Lunar Year ≈ 354.37 days
 * - Lunar Age = (Days since birth) / 354.37
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Calendar, Clock } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface LunarAgeResult {
  lunarYears: number;
  lunarMonths: number;
  lunarDays: number;
  solarYears: number;
  solarMonths: number;
  solarDays: number;
  totalLunarMonths: number;
  totalLunarDays: number;
  hijriDate: string;
  lunarBirthday: string;
}

// Average length of a lunar month in days
const LUNAR_MONTH_DAYS = 29.530588853;
// Average length of a lunar year in days (12 lunar months)
const LUNAR_YEAR_DAYS = LUNAR_MONTH_DAYS * 12; // ≈ 354.37 days

// Hijri month names in Arabic and English
const HIJRI_MONTHS = {
  ar: [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
    'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ],
  en: [
    'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban',
    'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah'
  ]
};

/**
 * Convert Gregorian date to Hijri date (approximation)
 * Using the Umm al-Qura algorithm approximation
 */
function gregorianToHijri(date: Date): { year: number; month: number; day: number } {
  // Reference point: 1 Muharram 1 AH = July 19, 622 CE (Julian)
  // In Gregorian: approximately July 16, 622 CE
  const hijriEpoch = new Date(622, 6, 16); // July 16, 622 CE

  const diffTime = date.getTime() - hijriEpoch.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  // Calculate Hijri year
  const hijriYear = Math.floor(diffDays / LUNAR_YEAR_DAYS) + 1;

  // Calculate remaining days
  const remainingDays = diffDays - ((hijriYear - 1) * LUNAR_YEAR_DAYS);

  // Calculate month (1-12)
  let hijriMonth = Math.floor(remainingDays / LUNAR_MONTH_DAYS) + 1;
  if (hijriMonth > 12) hijriMonth = 12;

  // Calculate day
  let hijriDay = Math.floor(remainingDays - ((hijriMonth - 1) * LUNAR_MONTH_DAYS)) + 1;
  if (hijriDay < 1) hijriDay = 1;
  if (hijriDay > 30) hijriDay = 30;

  return { year: hijriYear, month: hijriMonth, day: hijriDay };
}

export default function LunarAgeCalculator() {
  const { t, i18n } = useTranslation(['calc/date-time', 'common']);
  const isRTL = i18n.language === 'ar';
  const isArabic = i18n.language === 'ar';

  const [birthDate, setBirthDate] = useState<string>('');
  const [result, setResult] = useState<LunarAgeResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const calculate = () => {
    setError('');

    if (!birthDate) {
      setError(t('lunar-age.error_empty'));
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();

    if (isNaN(birth.getTime())) {
      setError(t('lunar-age.error_invalid'));
      return;
    }

    if (birth > today) {
      setError(t('lunar-age.error_future'));
      return;
    }

    setShowResult(false);
    setTimeout(() => {
      // Calculate solar age
      let solarYears = today.getFullYear() - birth.getFullYear();
      let solarMonths = today.getMonth() - birth.getMonth();
      let solarDays = today.getDate() - birth.getDate();

      if (solarDays < 0) {
        solarMonths--;
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        solarDays += prevMonth.getDate();
      }

      if (solarMonths < 0) {
        solarYears--;
        solarMonths += 12;
      }

      // Calculate days since birth
      const diffTime = today.getTime() - birth.getTime();
      const totalDays = diffTime / (1000 * 60 * 60 * 24);

      // Calculate lunar age
      const totalLunarYears = totalDays / LUNAR_YEAR_DAYS;
      const lunarYears = Math.floor(totalLunarYears);
      const remainingAfterYears = (totalLunarYears - lunarYears) * 12;
      const lunarMonths = Math.floor(remainingAfterYears);
      const lunarDays = Math.floor((remainingAfterYears - lunarMonths) * LUNAR_MONTH_DAYS);

      const totalLunarMonths = Math.floor(totalDays / LUNAR_MONTH_DAYS);
      const totalLunarDays = Math.floor(totalDays);

      // Get current Hijri date
      const hijriToday = gregorianToHijri(today);
      const monthNames = isArabic ? HIJRI_MONTHS.ar : HIJRI_MONTHS.en;
      const hijriDate = `${hijriToday.day} ${monthNames[hijriToday.month - 1]} ${hijriToday.year}`;

      // Calculate Hijri birthdate
      const hijriBirth = gregorianToHijri(birth);
      const lunarBirthday = `${hijriBirth.day} ${monthNames[hijriBirth.month - 1]}`;

      setResult({
        lunarYears,
        lunarMonths,
        lunarDays,
        solarYears,
        solarMonths,
        solarDays,
        totalLunarMonths,
        totalLunarDays,
        hijriDate,
        lunarBirthday
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
      <div className="max-w-md mx-auto space-y-4">
        <InputContainer
          label={t('lunar-age.birth_date')}
          tooltip={t('lunar-age.birth_date_tooltip')}
        >
          <input
            type="date"
            value={birthDate}
            onChange={(e) => {
              setBirthDate(e.target.value);
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

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t('lunar-age.info_title')}</h2>
            <p className="text-foreground-70">{t('lunar-age.info_description')}</p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t('lunar-age.about_lunar_calendar')}</h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t('lunar-age.fact_1')}</li>
              <li>{t('lunar-age.fact_2')}</li>
              <li>{t('lunar-age.fact_3')}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      {/* Main Lunar Age Result */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Moon className="w-5 h-5 text-primary" />
          <span className="text-foreground-70">{t('lunar-age.your_lunar_age')}</span>
        </div>
        <div className="text-3xl font-bold text-primary mb-2">
          {result.lunarYears} {t('lunar-age.lunar_years')}, {result.lunarMonths} {t('lunar-age.lunar_months')}, {result.lunarDays} {t('lunar-age.lunar_days')}
        </div>
        <div className="text-sm text-muted-foreground">
          {t('lunar-age.hijri_birthday')}: {result.lunarBirthday}
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Comparison with Solar Age */}
      <div className="mb-6">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          {t('lunar-age.comparison')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2 text-primary">{t('lunar-age.lunar_age_label')}</div>
            <div className="text-xl font-bold">
              {result.lunarYears} {t('lunar-age.years')}
            </div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t('lunar-age.solar_age_label')}</div>
            <div className="text-xl font-bold">
              {result.solarYears} {t('lunar-age.years')}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-6">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          {t('lunar-age.statistics')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t('lunar-age.total_lunar_months')}</div>
            <div className="text-2xl font-bold text-primary">{result.totalLunarMonths.toLocaleString()}</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t('lunar-age.total_days')}</div>
            <div className="text-2xl font-bold text-primary">{result.totalLunarDays.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Current Hijri Date */}
      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-primary" />
          <span className="font-medium">{t('lunar-age.today_hijri')}:</span>
          <span className="text-primary font-bold">{result.hijriDate}</span>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('lunar-age.title')}
      description={t('lunar-age.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      category="date-time"
      results={result}
    />
  );
}
