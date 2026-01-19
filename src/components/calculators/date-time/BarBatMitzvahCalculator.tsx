'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { ResultCard } from '@/components/ui/ResultVisualizer';
import { initDateInputRTL } from '../../../utils/dateInputRTL';
// Format Gregorian date for display - using Arabic numerals and numeric months
const formatDate = (date: Date): string => {
  const day = date.getDate().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
};

// Helper function to convert Gregorian date to Hebrew date (simplified)
// In a real implementation, you would use a proper Hebrew calendar library
const gregorianToHebrew = (date: Date): { day: number; month: number; year: number } => {
  // This is a simplified placeholder implementation
  // In a real implementation, you would use a proper Hebrew calendar library like hebcal
  
  // Get a simplified Hebrew year (just adding 3760 to Gregorian year)
  // This is very simplified and not accurate for real calculations
  const hebrewYear = date.getFullYear() + 3760;
  
  // Get a simplified Hebrew month (just mapping Gregorian month)
  // This is very simplified and not accurate for real calculations
  const hebrewMonth = date.getMonth() + 1; // Use month numbers instead of names
  
  // Get a simplified Hebrew day (same as Gregorian day)
  // This is very simplified and not accurate for real calculations
  const hebrewDay = date.getDate();
  
  return {
    day: hebrewDay,
    month: hebrewMonth,
    year: hebrewYear
  };
};

// Helper function to add years to Hebrew date (simplified)
const addHebrewYears = (
  hebrewDate: { day: number; month: number; year: number },
  years: number
): { day: number; month: number; year: number } => {
  // This is a simplified implementation
  // In a real implementation, you would use a proper Hebrew calendar library
  return {
    ...hebrewDate,
    year: hebrewDate.year + years
  };
};

// Helper function to convert Hebrew date to Gregorian date (simplified)
// In a real implementation, you would use a proper Hebrew calendar library
const hebrewToGregorian = (hebrewDate: { day: number; month: number; year: number }): Date => {
  // This is a simplified placeholder implementation
  // In a real implementation, you would use a proper Hebrew calendar library
  
  // Get Gregorian year (simplified by subtracting 3760 from Hebrew year)
  const gregorianYear = hebrewDate.year - 3760;
  
  // Get Gregorian month (simplified mapping)
  const gregorianMonth = hebrewDate.month - 1; // Adjust month for JavaScript Date (0-based)
  
  // Get Gregorian day (same as Hebrew day in this simplified implementation)
  const gregorianDay = hebrewDate.day;
  
  return new Date(gregorianYear, gregorianMonth, gregorianDay);
};

// Format Hebrew date for display with English numerals
const formatHebrewDate = (hebrewDate: { day: number; month: number; year: number }): string => {
  // List of Hebrew month names
  const hebrewMonthNames = [
    'Nisan', 'Iyar', 'Sivan', 'Tammuz', 'Av', 'Elul',
    'Tishrei', 'Cheshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar'
  ];
  
  // Format day as English numeral
  const day = hebrewDate.day.toString();
  
  // Format month as name instead of number
  const monthName = hebrewMonthNames[hebrewDate.month - 1] || `Month ${hebrewDate.month}`;
  
  // Ensure year is displayed in English numerals
  const year = hebrewDate.year.toString();
  
  // Return in format: DD Month YYYY
  return `${day} ${monthName} ${year}`;
};

// Get information about Bar/Bat Mitzvah
const getBarBatMitzvahInfo = (t: (key: string) => string) => {
  return (
    <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm">
      <h2 className="font-bold mb-2 text-lg">{t("bar_bat_mitzvah_calculator.celebration_info_title")}</h2>
      <p className="text-foreground-70 mb-3">{t("bar_bat_mitzvah_calculator.celebration_info_description")}</p>

      <div className="mt-4">
        <h2 className="font-bold mb-2 text-lg">{t("bar_bat_mitzvah_calculator.traditions_title")}</h2>
        <ul className="list-disc list-inside space-y-1 text-foreground-70">
          <li>{t("bar_bat_mitzvah_calculator.tradition_1")}</li>
          <li>{t("bar_bat_mitzvah_calculator.tradition_2")}</li>
          <li>{t("bar_bat_mitzvah_calculator.tradition_3")}</li>
          <li>{t("bar_bat_mitzvah_calculator.tradition_4")}</li>
        </ul>
      </div>
    </div>
  );
};

// Get celebration information
const getCelebrationInfo = (t: (key: string) => string) => {
  return (
    <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm">
      <h2 className="font-bold mb-2 text-lg">{t("bar_bat_mitzvah_calculator.planning_title")}</h2>
      <p className="text-foreground-70">{t("bar_bat_mitzvah_calculator.planning_description")}</p>
    </div>
  );
};

export default function BarBatMitzvahCalculator() {
  const { t, i18n } = useTranslation(['calc/date-time', 'common']);
  const isRTL = i18n.language === 'ar';
  // State for inputs
  const [birthDate, setBirthDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [gender, setGender] = useState<string>('male');
  
  // State for results
  const [result, setResult] = useState<{
    hebrewBirthDate: { day: number; month: number; year: number };
    barBatMitzvahHebrewDate: { day: number; month: number; year: number };
    barBatMitzvahGregorianDate: Date;
  } | null>(null);
  
  // State for errors and UI
  const [error, setError] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);

  // Initialize RTL support for date inputs
  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Clear errors when inputs change
  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthDate(e.target.value);
    if (error) setError('');
  };
  
  // Calculate Bar/Bat Mitzvah date
  const calculateBarBatMitzvahDate = () => {
    try {
      setError('');

      // Parse birth date
      const birthDateObj = new Date(birthDate);
      if (isNaN(birthDateObj.getTime())) {
        setError(t("bar_bat_mitzvah_calculator.error_invalid_date"));
        return;
      }
      
      // Hide previous result first for animation effect
      setShowResult(false);
      
      setTimeout(() => {
        // Convert birth date to Hebrew date
        const hebrewBirthDate = gregorianToHebrew(birthDateObj);
        
        // Calculate Bar/Bat Mitzvah date in Hebrew calendar
        // Bar Mitzvah: 13 years after birth date
        // Bat Mitzvah: 12 years after birth date
        const yearsToAdd = gender === 'male' ? 13 : 12;
        const barBatMitzvahHebrewDate = addHebrewYears(hebrewBirthDate, yearsToAdd);
        
        // Convert Bar/Bat Mitzvah Hebrew date to Gregorian date
        const barBatMitzvahGregorianDate = hebrewToGregorian(barBatMitzvahHebrewDate);
        
        // Set result
        setResult({
          hebrewBirthDate,
          barBatMitzvahHebrewDate,
          barBatMitzvahGregorianDate
        });
        
        setShowResult(true);
      }, 300);
    } catch (err) {
      setError(t("bar_bat_mitzvah_calculator.error_calculation"));
    }
  };
  
  // Reset form
  const resetForm = () => {
    setShowResult(false);
    
    setTimeout(() => {
      setBirthDate(new Date().toISOString().split('T')[0]);
      setGender('male');
      setResult(null);
      setError('');
    }, 300);
  };
  
  // Input section content
  const inputSection = (
    <>
      <h1 className="text-2xl font-bold mb-6 text-center">{t("bar_bat_mitzvah_calculator.input_title")}</h1>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer
          label={t("bar_bat_mitzvah_calculator.birth_date")}
          tooltip={t("bar_bat_mitzvah_calculator.birth_date_tooltip")}
        >
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={birthDate}
            onChange={handleBirthDateChange}
            required
            className="date-input-rtl w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            dir={isRTL ? "rtl" : "ltr"}
          />
        </InputContainer>

        <InputContainer
          label={t("bar_bat_mitzvah_calculator.gender")}
          tooltip={t("bar_bat_mitzvah_calculator.gender_tooltip")}
        >
          <div className="flex flex-wrap justify-start gap-4 mt-2">
            <label className="flex items-center p-3 border border-input rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === 'male'}
                onChange={() => setGender('male')}
                className="h-5 w-5 rounded-full border border-primary text-primary"
              />
              <span className="mr-2 text-base">{t("bar_bat_mitzvah_calculator.male")}</span>
            </label>
            <label className="flex items-center p-3 border border-input rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === 'female'}
                onChange={() => setGender('female')}
                className="h-5 w-5 rounded-full border border-primary text-primary"
              />
              <span className="mr-2 text-base">{t("bar_bat_mitzvah_calculator.female")}</span>
            </label>
          </div>
        </InputContainer>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons
          onCalculate={calculateBarBatMitzvahDate}
          onReset={resetForm}
          calculateText={`${t("bar_bat_mitzvah_calculator.calculate_btn")} ${gender === 'male' ? t("bar_bat_mitzvah_calculator.bar_mitzvah") : t("bar_bat_mitzvah_calculator.bat_mitzvah")}`}
        />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          {getBarBatMitzvahInfo(t)}
          {getCelebrationInfo(t)}
        </>
      )}
    </>
  );
  
  // Results section content
  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-1 text-lg">{t("bar_bat_mitzvah_calculator.hebrew_date")}</div>
        <div className="text-3xl font-bold text-primary mb-2">
          {formatDate(result.barBatMitzvahGregorianDate)}
        </div>
        <div className="text-lg text-foreground-80">
          {formatHebrewDate(result.barBatMitzvahHebrewDate)}
        </div>
      </div>

      <div className="divider my-5"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResultCard
          title={t("bar_bat_mitzvah_calculator.gregorian_date")}
          value={formatDate(new Date(birthDate))}
          description={t("bar_bat_mitzvah_calculator.gregorian_calendar_label")}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          }
        />

        <ResultCard
          title={t("bar_bat_mitzvah_calculator.hebrew_date")}
          value={formatHebrewDate(result.hebrewBirthDate)}
          description={t("bar_bat_mitzvah_calculator.hebrew_calendar_label")}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
        />
      </div>

      <div className="mt-6 p-5 bg-info/10 rounded-lg border border-info/20">
        <h3 className="text-lg font-medium mb-2 text-info">{t("bar_bat_mitzvah_calculator.ceremony_age")}</h3>
        <div className="space-y-3 text-base text-foreground-80">
          <p>
            {gender === 'male' ? t("bar_bat_mitzvah_calculator.ceremony_age_male") : t("bar_bat_mitzvah_calculator.ceremony_age_female")}
          </p>
          <p>
            {t("bar_bat_mitzvah_calculator.celebration_saturday")}
          </p>
          <p>
            {t("bar_bat_mitzvah_calculator.celebration_traditions")}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-3 text-lg">{t("bar_bat_mitzvah_calculator.traditions_title")}</h3>
        <ul className="list-disc list-inside space-y-2 text-foreground-70 text-base">
          <li>{t("bar_bat_mitzvah_calculator.tradition_1")}</li>
          <li>{t("bar_bat_mitzvah_calculator.tradition_2")}</li>
          <li>{t("bar_bat_mitzvah_calculator.tradition_3")}</li>
        </ul>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("bar_bat_mitzvah_calculator.title")}
      description={t("bar_bat_mitzvah_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
} 

