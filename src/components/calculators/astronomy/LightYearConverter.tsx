'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRightLeft, Star, Info } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

// Conversion constants (based on IAU definitions)
// 1 light year = 9.4607304725808e12 km (exact)
// 1 parsec = 3.26156 light years (based on 1 AU definition)
// 1 AU = 149,597,870.7 km (exact IAU definition)
const LIGHT_YEAR_KM = 9.4607304725808e12;
const PARSEC_LY = 3.26156;
const AU_KM = 149597870.7;

interface ConversionResult {
  lightYears: number;
  parsecs: number;
  au: number;
  km: number;
}

export default function LightYearConverter() {
  const { t } = useTranslation(['calc/astronomy', 'common']);
  const [inputValue, setInputValue] = useState<string>('1');
  const [inputUnit, setInputUnit] = useState<string>('light_year');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(true);

  const unitOptions = [
    { value: 'light_year', label: t('light-year-converter.units.light_year') },
    { value: 'parsec', label: t('light-year-converter.units.parsec') },
    { value: 'au', label: t('light-year-converter.units.au') },
    { value: 'km', label: t('light-year-converter.units.km') },
  ];

  // Auto-calculate on input change
  useEffect(() => {
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value > 0) {
      calculateConversions(value, inputUnit);
    } else {
      setResult(null);
    }
  }, [inputValue, inputUnit]);

  const calculateConversions = (value: number, unit: string) => {
    let lightYears: number;

    // First convert to light years
    switch (unit) {
      case 'light_year':
        lightYears = value;
        break;
      case 'parsec':
        lightYears = value * PARSEC_LY;
        break;
      case 'au':
        lightYears = (value * AU_KM) / LIGHT_YEAR_KM;
        break;
      case 'km':
        lightYears = value / LIGHT_YEAR_KM;
        break;
      default:
        lightYears = value;
    }

    // Then convert to all units
    setResult({
      lightYears,
      parsecs: lightYears / PARSEC_LY,
      au: (lightYears * LIGHT_YEAR_KM) / AU_KM,
      km: lightYears * LIGHT_YEAR_KM,
    });
  };

  const handleSwapUnits = () => {
    setShowResult(false);
    setTimeout(() => {
      // Cycle through units
      const units = ['light_year', 'parsec', 'au', 'km'];
      const currentIndex = units.indexOf(inputUnit);
      const nextIndex = (currentIndex + 1) % units.length;
      setInputUnit(units[nextIndex]);
      setShowResult(true);
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const value = parseFloat(inputValue);
      if (!isNaN(value) && value > 0) {
        calculateConversions(value, inputUnit);
      }
    }
  };

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    if (Math.abs(num) >= 1e15 || Math.abs(num) < 0.0001) {
      return num.toExponential(6);
    }
    if (Math.abs(num) >= 1000000) {
      return num.toExponential(4);
    }
    if (Math.abs(num) < 0.01) {
      return num.toFixed(8);
    }
    if (Math.abs(num) < 1) {
      return num.toFixed(6);
    }
    return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t('light-year-converter.title')}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-w-3xl mx-auto">
        {/* Input Value */}
        <div className="p-4 border border-border rounded-lg bg-card">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            {t('common.value')}
          </h3>
          <FormField
            label={t('light-year-converter.inputs.distance')}
            tooltip={t('light-year-converter.tooltips.distance')}
          >
            <NumberInput
              value={inputValue}
              onValueChange={(val) => setInputValue(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t('common.placeholders.enterValue')}
              min={0}
              step={0.1}
            />
          </FormField>
        </div>

        {/* Unit Selection */}
        <div className="p-4 border border-border rounded-lg bg-card">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            {t('common.unit')}
          </h3>
          <FormField
            label={t('light-year-converter.inputs.unit')}
            tooltip={t('light-year-converter.tooltips.unit')}
          >
            <Combobox
              options={unitOptions}
              value={inputUnit}
              onChange={(val) => setInputUnit(val)}
              placeholder={t('common.selectOption')}
            />
          </FormField>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={handleSwapUnits}
          className="outline-button flex items-center justify-center"
        >
          <ArrowRightLeft className="w-5 h-5 ml-2" />
          {t('light-year-converter.buttons.cycle_unit')}
        </button>
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t('light-year-converter.info.title')}</h2>
            <p className="text-foreground-70">
              {t('light-year-converter.info.description')}
            </p>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result && showResult ? (
    <div className={`bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn`}>
      <h3 className="font-bold mb-4 text-lg">{t('light-year-converter.results.conversions')}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-border bg-primary/5">
          <div className="text-sm text-foreground-70 mb-1">{t('light-year-converter.units.light_year')}</div>
          <div className="text-xl font-bold text-primary" dir="ltr">
            {formatNumber(result.lightYears)}
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border bg-purple-50 dark:bg-purple-900/20">
          <div className="text-sm text-foreground-70 mb-1">{t('light-year-converter.units.parsec')}</div>
          <div className="text-xl font-bold text-purple-600" dir="ltr">
            {formatNumber(result.parsecs)}
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border bg-green-50 dark:bg-green-900/20">
          <div className="text-sm text-foreground-70 mb-1">{t('light-year-converter.units.au')}</div>
          <div className="text-xl font-bold text-green-600" dir="ltr">
            {formatNumber(result.au)}
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border bg-orange-50 dark:bg-orange-900/20">
          <div className="text-sm text-foreground-70 mb-1">{t('light-year-converter.units.km')}</div>
          <div className="text-xl font-bold text-orange-600" dir="ltr">
            {formatNumber(result.km)}
          </div>
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h4 className="font-medium">{t('light-year-converter.info.conversion_factors')}</h4>
        <div className="text-sm text-foreground-70 space-y-1" dir="ltr">
          <p>1 {t('light-year-converter.units.light_year')} = 9.461 x 10^12 {t('light-year-converter.units.km')}</p>
          <p>1 {t('light-year-converter.units.parsec')} = 3.26156 {t('light-year-converter.units.light_year')}</p>
          <p>1 {t('light-year-converter.units.au')} = 149,597,870.7 {t('light-year-converter.units.km')}</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t('light-year-converter.info.note_title')}</h4>
            <p className="text-sm text-foreground-70">
              {t('light-year-converter.info.note_desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Star className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t('light-year-converter.results.empty_state')}</p>
    </div>
  );

  return (
    <CalculatorLayout
      title={t('light-year-converter.title')}
      description={t('light-year-converter.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
