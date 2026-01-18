'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Ruler, Footprints, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface ShoeSizeResult {
  us: number;
  uk: number;
  eu: number;
  cm: number;
  gender: string;
}

export default function ShoeSizeConverter() {
  const { t } = useTranslation(['translation', 'calc/misc']);
  const [size, setSize] = useState<string>('');
  const [fromSystem, setFromSystem] = useState<string>('us');
  const [gender, setGender] = useState<string>('men');
  const [result, setResult] = useState<ShoeSizeResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Conversion formulas for men's shoes
  const convertMenShoe = (value: number, from: string): ShoeSizeResult => {
    let cm: number;

    // First convert to CM
    switch (from) {
      case 'us':
        cm = (value * 2.54) + 21.59;
        break;
      case 'uk':
        cm = ((value + 1) * 2.54) + 21.59;
        break;
      case 'eu':
        cm = (value * 0.667) - 2;
        break;
      case 'cm':
        cm = value;
        break;
      default:
        cm = value;
    }

    // Convert from CM to all systems
    const us = (cm - 21.59) / 2.54;
    const uk = us - 1;
    const eu = (cm + 2) / 0.667;

    return {
      us: Math.round(us * 2) / 2,
      uk: Math.round(uk * 2) / 2,
      eu: Math.round(eu),
      cm: Math.round(cm * 10) / 10,
      gender: 'men',
    };
  };

  // Conversion formulas for women's shoes
  const convertWomenShoe = (value: number, from: string): ShoeSizeResult => {
    let cm: number;

    // First convert to CM
    switch (from) {
      case 'us':
        cm = (value * 2.54) + 20.32;
        break;
      case 'uk':
        cm = ((value + 2) * 2.54) + 20.32;
        break;
      case 'eu':
        cm = (value * 0.667) - 2;
        break;
      case 'cm':
        cm = value;
        break;
      default:
        cm = value;
    }

    // Convert from CM to all systems
    const us = (cm - 20.32) / 2.54;
    const uk = us - 2;
    const eu = (cm + 2) / 0.667;

    return {
      us: Math.round(us * 2) / 2,
      uk: Math.round(uk * 2) / 2,
      eu: Math.round(eu),
      cm: Math.round(cm * 10) / 10,
      gender: 'women',
    };
  };

  const validateInputs = (): boolean => {
    setError('');

    const sizeNum = parseFloat(size);

    if (isNaN(sizeNum) || sizeNum <= 0) {
      setError(t("calc/misc:shoe_size_converter.shoe_invalid_size"));
      return false;
    }

    // Validate reasonable ranges
    if (fromSystem === 'us' && (sizeNum < 1 || sizeNum > 20)) {
      setError(t("calc/misc:shoe_size_converter.shoe_us_range_error"));
      return false;
    }

    if (fromSystem === 'uk' && (sizeNum < 1 || sizeNum > 18)) {
      setError(t("calc/misc:shoe_size_converter.shoe_uk_range_error"));
      return false;
    }

    if (fromSystem === 'eu' && (sizeNum < 25 || sizeNum > 55)) {
      setError(t("calc/misc:shoe_size_converter.shoe_eu_range_error"));
      return false;
    }

    if (fromSystem === 'cm' && (sizeNum < 15 || sizeNum > 35)) {
      setError(t("calc/misc:shoe_size_converter.shoe_cm_range_error"));
      return false;
    }

    return true;
  };

  const convert = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const sizeNum = parseFloat(size);
        const convertedSize = gender === 'men'
          ? convertMenShoe(sizeNum, fromSystem)
          : convertWomenShoe(sizeNum, fromSystem);

        setResult(convertedSize);
        setShowResult(true);
      } catch (err) {
        setError(t("calculators.calculation_error"));
        console.error('Conversion error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setSize('');
      setFromSystem('us');
      setGender('men');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      convert();
    }
  };

  const genderOptions = [
    { value: 'men', label: t("calc/misc:shoe_size_converter.men") },
    { value: 'women', label: t("calc/misc:shoe_size_converter.women") },
  ];

  const systemOptions = [
    { value: 'us', label: t("calc/misc:shoe_size_converter.us") },
    { value: 'uk', label: t("calc/misc:shoe_size_converter.uk") },
    { value: 'eu', label: t("calc/misc:shoe_size_converter.eu") },
    { value: 'cm', label: t("calc/misc:shoe_size_converter.cm") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("calc/misc:shoe_size_converter.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer
          label={t("calc/misc:shoe_size_converter.gender")}
          tooltip={t("calc/misc:shoe_size_converter.gender_tooltip")}
        >
          <Combobox
            options={genderOptions}
            value={gender}
            onChange={(val) => {
              setGender(val);
              if (error) setError('');
            }}
            placeholder={t("calc/misc:shoe_size_converter.gender")}
          />
        </InputContainer>

        <InputContainer
          label={t("calc/misc:shoe_size_converter.size_input")}
          tooltip={t("calc/misc:shoe_size_converter.size_tooltip")}
        >
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-muted-foreground">
              <Footprints className="h-4 w-4" />
            </div>
            <Input
              type="text"
              value={size}
              onChange={(e) => {
                setSize(e.target.value);
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              className="ps-10"
              placeholder={t("calc/misc:shoe_size_converter.size_placeholder")}
              dir="ltr"
            />
          </div>
        </InputContainer>

        <InputContainer
          label={t("calc/misc:shoe_size_converter.from_system")}
          tooltip={t("calc/misc:shoe_size_converter.from_system_tooltip")}
        >
          <Combobox
            options={systemOptions}
            value={fromSystem}
            onChange={(val) => {
              setFromSystem(val);
              if (error) setError('');
            }}
            placeholder={t("calc/misc:shoe_size_converter.from_system")}
          />
        </InputContainer>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons
          onCalculate={convert}
          onReset={resetCalculator}
          calculateText={t("common.convert")}
        />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("calc/misc:shoe_size_converter.shoe_info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("calc/misc:shoe_size_converter.shoe_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("calc/misc:shoe_size_converter.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("calc/misc:shoe_size_converter.shoe_use_case_1")}</li>
              <li>{t("calc/misc:shoe_size_converter.shoe_use_case_2")}</li>
              <li>{t("calc/misc:shoe_size_converter.shoe_use_case_3")}</li>
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
          {t("calc/misc:shoe_size_converter.converted_sizes")}
        </div>
        <div className="text-lg text-foreground-70 mb-4">
          {result.gender === 'men' ? t("calc/misc:shoe_size_converter.men") : t("calc/misc:shoe_size_converter.women")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("calc/misc:shoe_size_converter.size_chart")}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-primary/10 border-2 border-primary rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Globe className="w-6 h-6 text-primary ml-3" />
                <div className="font-bold text-lg">{t("calc/misc:shoe_size_converter.us")}</div>
              </div>
              <div className="text-2xl font-bold text-primary" dir="ltr">
                {result.us}
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Globe className="w-6 h-6 text-primary ml-3" />
                <div className="font-medium">{t("calc/misc:shoe_size_converter.uk")}</div>
              </div>
              <div className="text-xl font-bold text-foreground" dir="ltr">
                {result.uk}
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Globe className="w-6 h-6 text-primary ml-3" />
                <div className="font-medium">{t("calc/misc:shoe_size_converter.eu")}</div>
              </div>
              <div className="text-xl font-bold text-foreground" dir="ltr">
                {result.eu}
              </div>
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Ruler className="w-6 h-6 text-primary ml-3" />
                <div className="font-medium">{t("calc/misc:shoe_size_converter.cm")}</div>
              </div>
              <div className="text-xl font-bold text-foreground" dir="ltr">
                {result.cm} cm
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("calc/misc:shoe_size_converter.shoe_note_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("calc/misc:shoe_size_converter.shoe_note")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("calc/misc:shoe_size_converter.title")}
      description={t("calc/misc:shoe_size_converter.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
