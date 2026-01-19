'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface ClothingSizeResult {
  us: string;
  uk: string;
  eu: string;
  intl: string;
  chest?: string;
  waist?: string;
}

export default function ClothingSizeConverter() {
  const { t } = useTranslation(['translation', 'calc/misc']);
  const [size, setSize] = useState<string>('');
  const [fromSystem, setFromSystem] = useState<string>('us');
  const [gender, setGender] = useState<string>('men');
  const [garmentType, setGarmentType] = useState<string>('shirts');
  const [result, setResult] = useState<ClothingSizeResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Men's shirt conversion
  const convertMenShirt = (size: string, _from: string): ClothingSizeResult => {
    const sizeMap: { [key: string]: ClothingSizeResult } = {
      // US sizes
      'XS': { us: 'XS', uk: 'XS', eu: '44', intl: 'XS', chest: '34-36"', waist: '28-30"' },
      'S': { us: 'S', uk: 'S', eu: '46-48', intl: 'S', chest: '36-38"', waist: '30-32"' },
      'M': { us: 'M', uk: 'M', eu: '48-50', intl: 'M', chest: '38-40"', waist: '32-34"' },
      'L': { us: 'L', uk: 'L', eu: '50-52', intl: 'L', chest: '40-42"', waist: '34-36"' },
      'XL': { us: 'XL', uk: 'XL', eu: '52-54', intl: 'XL', chest: '42-44"', waist: '36-38"' },
      'XXL': { us: 'XXL', uk: 'XXL', eu: '54-56', intl: 'XXL', chest: '44-46"', waist: '38-40"' },
      // EU sizes
      'EU44': { us: 'XS', uk: 'XS', eu: '44', intl: 'XS', chest: '34-36"', waist: '28-30"' },
      'EU46': { us: 'S', uk: 'S', eu: '46-48', intl: 'S', chest: '36-38"', waist: '30-32"' },
      'EU48': { us: 'M', uk: 'M', eu: '48-50', intl: 'M', chest: '38-40"', waist: '32-34"' },
      'EU50': { us: 'L', uk: 'L', eu: '50-52', intl: 'L', chest: '40-42"', waist: '34-36"' },
      'EU52': { us: 'XL', uk: 'XL', eu: '52-54', intl: 'XL', chest: '42-44"', waist: '36-38"' },
      'EU54': { us: 'XXL', uk: 'XXL', eu: '54-56', intl: 'XXL', chest: '44-46"', waist: '38-40"' },
    };

    return sizeMap[size.toUpperCase()] || sizeMap['M'];
  };

  // Women's clothing conversion
  const convertWomenClothing = (size: string, _from: string): ClothingSizeResult => {
    const sizeMap: { [key: string]: ClothingSizeResult } = {
      // US sizes
      '0': { us: '0', uk: '4', eu: '32', intl: 'XXS' },
      '2': { us: '2', uk: '6', eu: '34', intl: 'XS' },
      '4': { us: '4', uk: '8', eu: '36', intl: 'S' },
      '6': { us: '6', uk: '10', eu: '38', intl: 'S' },
      '8': { us: '8', uk: '12', eu: '40', intl: 'M' },
      '10': { us: '10', uk: '14', eu: '42', intl: 'M' },
      '12': { us: '12', uk: '16', eu: '44', intl: 'L' },
      '14': { us: '14', uk: '18', eu: '46', intl: 'L' },
      '16': { us: '16', uk: '20', eu: '48', intl: 'XL' },
      'XXS': { us: '0', uk: '4', eu: '32', intl: 'XXS' },
      'XS': { us: '2', uk: '6', eu: '34', intl: 'XS' },
      'S': { us: '4-6', uk: '8-10', eu: '36-38', intl: 'S' },
      'M': { us: '8-10', uk: '12-14', eu: '40-42', intl: 'M' },
      'L': { us: '12-14', uk: '16-18', eu: '44-46', intl: 'L' },
      'XL': { us: '16', uk: '20', eu: '48', intl: 'XL' },
      // UK sizes
      'UK4': { us: '0', uk: '4', eu: '32', intl: 'XXS' },
      'UK6': { us: '2', uk: '6', eu: '34', intl: 'XS' },
      'UK8': { us: '4', uk: '8', eu: '36', intl: 'S' },
      'UK10': { us: '6', uk: '10', eu: '38', intl: 'S' },
      'UK12': { us: '8', uk: '12', eu: '40', intl: 'M' },
      'UK14': { us: '10', uk: '14', eu: '42', intl: 'M' },
      'UK16': { us: '12', uk: '16', eu: '44', intl: 'L' },
      'UK18': { us: '14', uk: '18', eu: '46', intl: 'L' },
      'UK20': { us: '16', uk: '20', eu: '48', intl: 'XL' },
      // EU sizes
      'EU32': { us: '0', uk: '4', eu: '32', intl: 'XXS' },
      'EU34': { us: '2', uk: '6', eu: '34', intl: 'XS' },
      'EU36': { us: '4', uk: '8', eu: '36', intl: 'S' },
      'EU38': { us: '6', uk: '10', eu: '38', intl: 'S' },
      'EU40': { us: '8', uk: '12', eu: '40', intl: 'M' },
      'EU42': { us: '10', uk: '14', eu: '42', intl: 'M' },
      'EU44': { us: '12', uk: '16', eu: '44', intl: 'L' },
      'EU46': { us: '14', uk: '18', eu: '46', intl: 'L' },
      'EU48': { us: '16', uk: '20', eu: '48', intl: 'XL' },
    };

    return sizeMap[size.toUpperCase()] || sizeMap['M'];
  };

  const validateInputs = (): boolean => {
    setError('');

    if (!size || size.trim().length === 0) {
      setError(t("calc/misc:clothing_size_converter.empty_error"));
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
        let convertedSize: ClothingSizeResult;

        if (gender === 'men') {
          convertedSize = convertMenShirt(size, fromSystem);
        } else {
          convertedSize = convertWomenClothing(size, fromSystem);
        }

        setResult(convertedSize);
        setShowResult(true);
      } catch (err) {
        setError(t("calc/misc:clothing_size_converter.calculation_error") || t("calculators.calculation_error"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setSize('');
      setFromSystem('us');
      setGender('men');
      setGarmentType('shirts');
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
    { value: 'men', label: t("calc/misc:clothing_size_converter.men") },
    { value: 'women', label: t("calc/misc:clothing_size_converter.women") },
  ];

  const garmentTypeOptions = [
    { value: 'shirts', label: t("calc/misc:clothing_size_converter.shirts") },
    { value: 'pants', label: t("calc/misc:clothing_size_converter.pants") },
    { value: 'dresses', label: t("calc/misc:clothing_size_converter.dresses") },
  ];

  const fromSystemOptions = [
    { value: 'us', label: t("calc/misc:clothing_size_converter.us") },
    { value: 'uk', label: t("calc/misc:clothing_size_converter.uk") },
    { value: 'eu', label: t("calc/misc:clothing_size_converter.eu") },
    { value: 'intl', label: t("calc/misc:clothing_size_converter.intl") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("calc/misc:clothing_size_converter.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer
          label={t("calc/misc:clothing_size_converter.gender")}
          tooltip={t("calc/misc:clothing_size_converter.gender_tooltip")}
        >
          <Combobox
            options={genderOptions}
            value={gender}
            onChange={(val) => {
              setGender(val);
              if (error) setError('');
            }}
            placeholder={t("calc/misc:clothing_size_converter.gender")}
          />
        </InputContainer>

        <InputContainer
          label={t("calc/misc:clothing_size_converter.clothing_type")}
          tooltip={t("calc/misc:clothing_size_converter.clothing_type_tooltip")}
        >
          <Combobox
            options={garmentTypeOptions}
            value={garmentType}
            onChange={(val) => {
              setGarmentType(val);
              if (error) setError('');
            }}
            placeholder={t("calc/misc:clothing_size_converter.clothing_type")}
          />
        </InputContainer>

        <InputContainer
          label={t("calc/misc:clothing_size_converter.size_input")}
          tooltip={t("calc/misc:clothing_size_converter.size_tooltip")}
        >
          <input
            type="text"
            value={size}
            onChange={(e) => {
              setSize(e.target.value);
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            placeholder={t("calc/misc:clothing_size_converter.size_placeholder")}
            dir="ltr"
          />
        </InputContainer>

        <InputContainer
          label={t("calc/misc:clothing_size_converter.from_system")}
          tooltip={t("calc/misc:clothing_size_converter.from_system_tooltip")}
        >
          <Combobox
            options={fromSystemOptions}
            value={fromSystem}
            onChange={(val) => {
              setFromSystem(val);
              if (error) setError('');
            }}
            placeholder={t("calc/misc:clothing_size_converter.from_system")}
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
              {t("calc/misc:clothing_size_converter.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("calc/misc:clothing_size_converter.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("calc/misc:clothing_size_converter.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("calc/misc:clothing_size_converter.use_case_1")}</li>
              <li>{t("calc/misc:clothing_size_converter.use_case_2")}</li>
              <li>{t("calc/misc:clothing_size_converter.use_case_3")}</li>
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
          {t("calc/misc:clothing_size_converter.converted_sizes")}
        </div>
        <div className="text-lg text-foreground-70 mb-4">
          {gender === 'men' ? t("calc/misc:clothing_size_converter.men") : t("calc/misc:clothing_size_converter.women")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("calc/misc:clothing_size_converter.size_chart")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-primary/10 border-2 border-primary rounded-lg p-5">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <div className="font-bold">{t("calc/misc:clothing_size_converter.us")}</div>
            </div>
            <div className="text-2xl font-bold text-primary" dir="ltr">
              {result.us}
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <div className="font-medium">{t("calc/misc:clothing_size_converter.uk")}</div>
            </div>
            <div className="text-xl font-bold text-foreground" dir="ltr">
              {result.uk}
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <div className="font-medium">{t("calc/misc:clothing_size_converter.eu")}</div>
            </div>
            <div className="text-xl font-bold text-foreground" dir="ltr">
              {result.eu}
            </div>
          </div>

          <div className="bg-card p-5 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium">{t("calc/misc:clothing_size_converter.intl")}</div>
            </div>
            <div className="text-xl font-bold text-foreground" dir="ltr">
              {result.intl}
            </div>
          </div>
        </div>

        {result.chest && result.waist && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">{t("calc/misc:clothing_size_converter.measurements")}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="text-sm text-foreground-70 mb-1">{t("calc/misc:clothing_size_converter.chest")}</div>
                <div className="text-lg font-medium" dir="ltr">{result.chest}</div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="text-sm text-foreground-70 mb-1">{t("calc/misc:clothing_size_converter.waist")}</div>
                <div className="text-lg font-medium" dir="ltr">{result.waist}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("calc/misc:clothing_size_converter.note_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("calc/misc:clothing_size_converter.note")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("calc/misc:clothing_size_converter.title")}
      description={t("calc/misc:clothing_size_converter.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
