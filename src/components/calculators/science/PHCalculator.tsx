'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Droplet, FlaskConical, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

type CalculationMode = 'pH_from_H' | 'H_from_pH' | 'pOH_from_OH' | 'OH_from_pOH';

interface PHResult {
  pH: number;
  pOH: number;
  hConcentration: number;
  ohConcentration: number;
  solutionType: 'acidic' | 'neutral' | 'basic';
}

export default function PHCalculator() {
  const { t } = useTranslation(['calc/science', 'common']);

  const [mode, setMode] = useState<CalculationMode>('pH_from_H');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<PHResult | null>(null);
  const [error, setError] = useState<string>('');

  const formatScientific = (value: number): string => {
    if (value === 0) return '0';
    if (Math.abs(value) >= 0.01 && Math.abs(value) < 10000) {
      return value.toPrecision(4);
    }
    return value.toExponential(4);
  };

  const calculate = () => {
    setError('');
    setResult(null);

    const value = parseFloat(inputValue);

    if (!inputValue || isNaN(value)) {
      setError(t('ph_calculator.errors.enter_value'));
      return;
    }

    try {
      let pH: number;
      let pOH: number;
      let hConcentration: number;
      let ohConcentration: number;

      // Kw = [H+][OH-] = 1e-14 at 25C
      const Kw = 1e-14;

      switch (mode) {
        case 'pH_from_H':
          // pH = -log[H+]
          if (value <= 0) {
            setError(t('ph_calculator.errors.concentration_positive'));
            return;
          }
          hConcentration = value;
          pH = -Math.log10(hConcentration);
          pOH = 14 - pH;
          ohConcentration = Kw / hConcentration;
          break;

        case 'H_from_pH':
          // [H+] = 10^(-pH)
          if (value < 0 || value > 14) {
            setError(t('ph_calculator.errors.ph_range'));
            return;
          }
          pH = value;
          hConcentration = Math.pow(10, -pH);
          pOH = 14 - pH;
          ohConcentration = Kw / hConcentration;
          break;

        case 'pOH_from_OH':
          // pOH = -log[OH-]
          if (value <= 0) {
            setError(t('ph_calculator.errors.concentration_positive'));
            return;
          }
          ohConcentration = value;
          pOH = -Math.log10(ohConcentration);
          pH = 14 - pOH;
          hConcentration = Kw / ohConcentration;
          break;

        case 'OH_from_pOH':
          // [OH-] = 10^(-pOH)
          if (value < 0 || value > 14) {
            setError(t('ph_calculator.errors.poh_range'));
            return;
          }
          pOH = value;
          ohConcentration = Math.pow(10, -pOH);
          pH = 14 - pOH;
          hConcentration = Kw / ohConcentration;
          break;

        default:
          return;
      }

      // Determine solution type
      let solutionType: 'acidic' | 'neutral' | 'basic';
      if (Math.abs(pH - 7) < 0.01) {
        solutionType = 'neutral';
      } else if (pH < 7) {
        solutionType = 'acidic';
      } else {
        solutionType = 'basic';
      }

      setResult({
        pH,
        pOH,
        hConcentration,
        ohConcentration,
        solutionType,
      });
    } catch {
      setError(t('ph_calculator.errors.calculation_error'));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const resetCalculator = () => {
    setInputValue('');
    setResult(null);
    setError('');
  };

  const modeOptions = [
    { value: 'pH_from_H', label: t('ph_calculator.modes.pH_from_H') },
    { value: 'H_from_pH', label: t('ph_calculator.modes.H_from_pH') },
    { value: 'pOH_from_OH', label: t('ph_calculator.modes.pOH_from_OH') },
    { value: 'OH_from_pOH', label: t('ph_calculator.modes.OH_from_pOH') },
  ];

  const getInputLabel = (): string => {
    switch (mode) {
      case 'pH_from_H':
        return t('ph_calculator.inputs.h_concentration');
      case 'H_from_pH':
        return t('ph_calculator.inputs.pH');
      case 'pOH_from_OH':
        return t('ph_calculator.inputs.oh_concentration');
      case 'OH_from_pOH':
        return t('ph_calculator.inputs.pOH');
      default:
        return '';
    }
  };

  const getInputTooltip = (): string => {
    switch (mode) {
      case 'pH_from_H':
        return t('ph_calculator.tooltips.h_concentration');
      case 'H_from_pH':
        return t('ph_calculator.tooltips.pH');
      case 'pOH_from_OH':
        return t('ph_calculator.tooltips.oh_concentration');
      case 'OH_from_pOH':
        return t('ph_calculator.tooltips.pOH');
      default:
        return '';
    }
  };

  const getPlaceholder = (): string => {
    switch (mode) {
      case 'pH_from_H':
        return '1e-7';
      case 'H_from_pH':
        return '7';
      case 'pOH_from_OH':
        return '1e-7';
      case 'OH_from_pOH':
        return '7';
      default:
        return '';
    }
  };

  const inputSection = (
    <>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-4">{t('ph_calculator.title')}</h2>

        <div className="flex flex-col items-center gap-4 mb-4">
          <div className="w-full max-w-xs">
            <Combobox
              options={modeOptions}
              value={mode}
              onChange={(val) => {
                setMode(val as CalculationMode);
                setResult(null);
                setError('');
                setInputValue('');
              }}
              placeholder={t('ph_calculator.modes.pH_from_H')}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <FormField label={getInputLabel()} tooltip={getInputTooltip()}>
          <NumberInput
            value={inputValue}
            onValueChange={(val) => setInputValue(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={getPlaceholder()}
            startIcon={<FlaskConical className="h-4 w-4" />}
          />
        </FormField>

        <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <strong>{t('common.info')}:</strong> {t('ph_calculator.formulas.ph')}<br />
            {t('ph_calculator.formulas.ph_desc')}
          </div>
        </div>

        <ErrorDisplay error={error} />
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
    </>
  );

  const getSolutionColor = (type: 'acidic' | 'neutral' | 'basic'): string => {
    switch (type) {
      case 'acidic':
        return 'text-red-500';
      case 'neutral':
        return 'text-green-500';
      case 'basic':
        return 'text-blue-500';
    }
  };

  const resultSection = result !== null ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t('ph_calculator.results.solution_type')}
        </div>
        <div className={`text-2xl font-bold ${getSolutionColor(result.solutionType)}`}>
          {t(`ph_calculator.results.${result.solutionType}`)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted dark:bg-muted p-4 rounded-lg text-center">
          <div className="text-foreground-70 text-sm mb-1">{t('ph_calculator.results.pH')}</div>
          <div className="text-2xl font-bold text-primary">{result.pH.toFixed(4)}</div>
        </div>

        <div className="bg-muted dark:bg-muted p-4 rounded-lg text-center">
          <div className="text-foreground-70 text-sm mb-1">{t('ph_calculator.results.pOH')}</div>
          <div className="text-2xl font-bold text-primary">{result.pOH.toFixed(4)}</div>
        </div>

        <div className="bg-muted dark:bg-muted p-4 rounded-lg text-center">
          <div className="text-foreground-70 text-sm mb-1">{t('ph_calculator.results.h_concentration')}</div>
          <div className="text-xl font-bold text-primary" dir="ltr">{formatScientific(result.hConcentration)} M</div>
        </div>

        <div className="bg-muted dark:bg-muted p-4 rounded-lg text-center">
          <div className="text-foreground-70 text-sm mb-1">{t('ph_calculator.results.oh_concentration')}</div>
          <div className="text-xl font-bold text-primary" dir="ltr">{formatScientific(result.ohConcentration)} M</div>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Droplet className={`w-12 h-12 ${getSolutionColor(result.solutionType)}`} />
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('ph_calculator.title')}
      description={t('ph_calculator.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
