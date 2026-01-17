'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Info } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

interface StarDistanceResult {
  parsecs: number;
  lightYears: number;
  au: number;
  km: number;
}

// Conversion constants
const PARSEC_TO_LY = 3.26156; // 1 parsec = 3.26156 light years
const PARSEC_TO_AU = 206265; // 1 parsec = 206,265 AU
const PARSEC_TO_KM = 3.0857e13; // 1 parsec in km

export default function StarDistanceCalculator() {
  const { t } = useTranslation(['calc/astronomy', 'common']);
  const [parallaxAngle, setParallaxAngle] = useState<string>('');
  const [result, setResult] = useState<StarDistanceResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (error) setError('');
  }, [parallaxAngle]);

  const calculate = () => {
    setError('');
    const angle = parseFloat(parallaxAngle);

    if (!parallaxAngle || isNaN(angle)) {
      setError(t('star-distance.errors.enter_parallax'));
      return;
    }

    if (angle <= 0) {
      setError(t('star-distance.errors.positive_parallax'));
      return;
    }

    if (angle > 1) {
      setError(t('star-distance.errors.max_parallax'));
      return;
    }

    setShowResult(false);
    setTimeout(() => {
      // Stellar parallax formula: Distance (parsecs) = 1 / parallax (arcseconds)
      const distanceParsecs = 1 / angle;

      setResult({
        parsecs: distanceParsecs,
        lightYears: distanceParsecs * PARSEC_TO_LY,
        au: distanceParsecs * PARSEC_TO_AU,
        km: distanceParsecs * PARSEC_TO_KM,
      });

      setShowResult(true);
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setParallaxAngle('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    if (Math.abs(num) >= 1e15 || Math.abs(num) < 0.001) {
      return num.toExponential(4);
    }
    if (Math.abs(num) >= 1000000) {
      return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
    }
    if (Math.abs(num) < 1) {
      return num.toFixed(4);
    }
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  // Example stars with known parallax
  const exampleStars = [
    { name: 'star-distance.examples.proxima_centauri', parallax: 0.7687, distance: 1.30 },
    { name: 'star-distance.examples.alpha_centauri', parallax: 0.7472, distance: 1.34 },
    { name: 'star-distance.examples.barnards_star', parallax: 0.5449, distance: 1.84 },
    { name: 'star-distance.examples.sirius', parallax: 0.3792, distance: 2.64 },
    { name: 'star-distance.examples.vega', parallax: 0.1289, distance: 7.76 },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t('star-distance.title')}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t('star-distance.inputs.parallax_angle')}
          tooltip={t('star-distance.tooltips.parallax_angle')}
        >
          <NumberInput
            value={parallaxAngle}
            onValueChange={(val) => setParallaxAngle(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t('common.placeholders.enterValue')}
            min={0}
            max={1}
            step={0.0001}
            startIcon={<Star className="h-4 w-4" />}
            unit={t('star-distance.units.arcseconds')}
          />
        </FormField>

        <div className="text-sm text-foreground-70 p-3 bg-muted/30 rounded-lg">
          <strong>{t('star-distance.info.common_values')}:</strong>
          <ul className="mt-2 space-y-1">
            {exampleStars.map((star, index) => (
              <li key={index} className="flex justify-between">
                <span>{t(star.name)}</span>
                <span dir="ltr">{star.parallax} arcsec ({star.distance} pc)</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t('star-distance.info.title')}</h2>
          <p className="text-foreground-70 mb-4">
            {t('star-distance.info.description')}
          </p>
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="font-mono text-center" dir="ltr">
              d (parsecs) = 1 / p (arcseconds)
            </p>
          </div>
        </div>
      )}
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t('star-distance.results.parallax_input')}</div>
        <div className="text-3xl font-bold text-primary mb-2" dir="ltr">
          {parseFloat(parallaxAngle).toFixed(4)} {t('star-distance.units.arcseconds')}
        </div>
      </div>

      <div className="divider my-6"></div>

      <h3 className="font-bold mb-4 text-lg">{t('star-distance.results.distance')}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-border bg-primary/5">
          <div className="text-sm text-foreground-70 mb-1">{t('star-distance.units.parsecs')}</div>
          <div className="text-xl font-bold text-primary" dir="ltr">
            {formatNumber(result.parsecs)}
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border bg-blue-50 dark:bg-blue-900/20">
          <div className="text-sm text-foreground-70 mb-1">{t('star-distance.units.light_years')}</div>
          <div className="text-xl font-bold text-blue-600" dir="ltr">
            {formatNumber(result.lightYears)}
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border bg-green-50 dark:bg-green-900/20">
          <div className="text-sm text-foreground-70 mb-1">{t('star-distance.units.au')}</div>
          <div className="text-xl font-bold text-green-600" dir="ltr">
            {formatNumber(result.au)}
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border bg-orange-50 dark:bg-orange-900/20">
          <div className="text-sm text-foreground-70 mb-1">{t('star-distance.units.km')}</div>
          <div className="text-xl font-bold text-orange-600" dir="ltr">
            {formatNumber(result.km)}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t('star-distance.info.formula_title')}</h4>
            <p className="text-sm text-foreground-70">
              {t('star-distance.info.formula_desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('star-distance.title')}
      description={t('star-distance.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
