'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Calendar } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface PlanetAge {
  planet: string;
  orbitalPeriod: number;
  age: number;
  nextBirthday: number;
}

// Orbital periods in Earth years (accurate astronomical data)
const ORBITAL_PERIODS: Record<string, number> = {
  mercury: 0.2408467,
  venus: 0.61519726,
  earth: 1.0,
  mars: 1.8808158,
  jupiter: 11.862615,
  saturn: 29.447498,
  uranus: 84.016846,
  neptune: 164.79132,
};

export default function AgeOnPlanetsCalculator() {
  const { t, i18n } = useTranslation(['calc/astronomy', 'common']);
  const isRTL = i18n.language === 'ar';
  const [birthDate, setBirthDate] = useState<string>('');
  const [result, setResult] = useState<PlanetAge[] | null>(null);
  const [earthAge, setEarthAge] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const calculate = () => {
    setError('');
    if (!birthDate) {
      setError(t('age-on-planets.errors.enter_birth_date'));
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();

    if (isNaN(birth.getTime())) {
      setError(t('age-on-planets.errors.invalid_date'));
      return;
    }

    if (birth > today) {
      setError(t('age-on-planets.errors.future_date'));
      return;
    }

    setShowResult(false);
    setTimeout(() => {
      // Calculate Earth age in years (decimal)
      const diffTime = today.getTime() - birth.getTime();
      const ageInDays = diffTime / (1000 * 60 * 60 * 24);
      const ageInYears = ageInDays / 365.25;
      setEarthAge(ageInYears);

      // Calculate age on each planet
      const planetAges: PlanetAge[] = Object.entries(ORBITAL_PERIODS).map(([planet, period]) => {
        const planetAge = ageInYears / period;
        const completedOrbits = Math.floor(planetAge);
        const fractionOfOrbit = planetAge - completedOrbits;
        const daysUntilNextBirthday = Math.round((1 - fractionOfOrbit) * period * 365.25);

        return {
          planet,
          orbitalPeriod: period,
          age: planetAge,
          nextBirthday: daysUntilNextBirthday,
        };
      });

      setResult(planetAges);
      setShowResult(true);
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setBirthDate('');
      setResult(null);
      setEarthAge(0);
      setError('');
    }, 300);
  };

  const getPlanetColor = (planet: string): string => {
    const colors: Record<string, string> = {
      mercury: 'bg-muted dark:bg-muted',
      venus: 'bg-yellow-200 dark:bg-yellow-900/50',
      earth: 'bg-blue-200 dark:bg-blue-900/50',
      mars: 'bg-red-200 dark:bg-red-900/50',
      jupiter: 'bg-orange-200 dark:bg-orange-900/50',
      saturn: 'bg-amber-200 dark:bg-amber-900/50',
      uranus: 'bg-cyan-200 dark:bg-cyan-900/50',
      neptune: 'bg-indigo-200 dark:bg-indigo-900/50',
    };
    return colors[planet] || 'bg-muted';
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t('age-on-planets.title')}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer
          label={t('age-on-planets.inputs.birth_date')}
          tooltip={t('age-on-planets.tooltips.birth_date')}
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
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t('age-on-planets.info.title')}</h2>
          <p className="text-foreground-70">
            {t('age-on-planets.info.description')}
          </p>
        </div>
      )}
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t('age-on-planets.results.earth_age')}</div>
        <div className="text-3xl font-bold text-primary mb-2">
          {earthAge.toFixed(2)} {t('age-on-planets.results.years')}
        </div>
      </div>

      <div className="divider my-6"></div>

      <h3 className="font-bold mb-4 text-lg">{t('age-on-planets.results.your_ages')}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {result.map((planetData) => (
          <div
            key={planetData.planet}
            className={`p-4 rounded-lg border border-border ${getPlanetColor(planetData.planet)}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5" />
              <span className="font-bold">{t(`age-on-planets.planets.${planetData.planet}`)}</span>
            </div>
            <div className="text-2xl font-bold text-primary mb-1">
              {planetData.age.toFixed(2)}
            </div>
            <div className="text-sm text-foreground-70">
              {t('age-on-planets.results.planetary_years')}
            </div>
            <div className="text-xs text-foreground-50 mt-2">
              {t('age-on-planets.results.next_birthday')}: {planetData.nextBirthday} {t('age-on-planets.results.days')}
            </div>
            <div className="text-xs text-foreground-50">
              {t('age-on-planets.results.orbital_period')}: {planetData.orbitalPeriod.toFixed(2)} {t('age-on-planets.results.earth_years')}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Calendar className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t('age-on-planets.info.formula_title')}</h4>
            <p className="text-sm text-foreground-70">
              {t('age-on-planets.info.formula_desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('age-on-planets.title')}
      description={t('age-on-planets.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
