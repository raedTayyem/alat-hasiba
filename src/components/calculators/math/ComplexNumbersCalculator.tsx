'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Hash, Activity } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface ComplexNumber {
  real: number;
  imaginary: number;
}

interface ComplexResult {
  result: ComplexNumber;
  magnitude?: number;
  phase?: number;
  conjugate?: ComplexNumber;
}

export default function ComplexNumbersCalculator() {
  const { t } = useTranslation('calc/math');

  const [operation, setOperation] = useState<string>('add');
  const [real1, setReal1] = useState<string>('');
  const [imag1, setImag1] = useState<string>('');
  const [real2, setReal2] = useState<string>('');
  const [imag2, setImag2] = useState<string>('');
  const [result, setResult] = useState<ComplexResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const add = (c1: ComplexNumber, c2: ComplexNumber): ComplexNumber => ({
    real: c1.real + c2.real,
    imaginary: c1.imaginary + c2.imaginary
  });

  const subtract = (c1: ComplexNumber, c2: ComplexNumber): ComplexNumber => ({
    real: c1.real - c2.real,
    imaginary: c1.imaginary - c2.imaginary
  });

  const multiply = (c1: ComplexNumber, c2: ComplexNumber): ComplexNumber => ({
    real: c1.real * c2.real - c1.imaginary * c2.imaginary,
    imaginary: c1.real * c2.imaginary + c1.imaginary * c2.real
  });

  const divide = (c1: ComplexNumber, c2: ComplexNumber): ComplexNumber => {
    const denominator = c2.real * c2.real + c2.imaginary * c2.imaginary;
    return {
      real: (c1.real * c2.real + c1.imaginary * c2.imaginary) / denominator,
      imaginary: (c1.imaginary * c2.real - c1.real * c2.imaginary) / denominator
    };
  };

  const magnitude = (c: ComplexNumber): number =>
    Math.sqrt(c.real * c.real + c.imaginary * c.imaginary);

  const phase = (c: ComplexNumber): number =>
    Math.atan2(c.imaginary, c.real) * (180 / Math.PI);

  const conjugate = (c: ComplexNumber): ComplexNumber => ({
    real: c.real,
    imaginary: -c.imaginary
  });

  const validateInputs = (): boolean => {
    setError('');
    const r1 = parseFloat(real1);
    const i1 = parseFloat(imag1);

    if (isNaN(r1) || isNaN(i1)) {
      setError(t("complex_numbers.invalid_input"));
      return false;
    }

    if (operation !== 'magnitude' && operation !== 'phase' && operation !== 'conjugate') {
      const r2 = parseFloat(real2);
      const i2 = parseFloat(imag2);
      if (isNaN(r2) || isNaN(i2)) {
        setError(t("complex_numbers.invalid_input"));
        return false;
      }

      if (operation === 'divide' && r2 === 0 && i2 === 0) {
        setError(t("complex_numbers.division_by_zero"));
        return false;
      }
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    setShowResult(false);

    setTimeout(() => {
      try {
        const c1: ComplexNumber = {
          real: parseFloat(real1),
          imaginary: parseFloat(imag1)
        };

        const c2: ComplexNumber = {
          real: parseFloat(real2) || 0,
          imaginary: parseFloat(imag2) || 0
        };

        let resultComplex: ComplexNumber = { real: 0, imaginary: 0 };
        let mag: number | undefined;
        let ph: number | undefined;
        let conj: ComplexNumber | undefined;

        switch (operation) {
          case 'add':
            resultComplex = add(c1, c2);
            break;
          case 'subtract':
            resultComplex = subtract(c1, c2);
            break;
          case 'multiply':
            resultComplex = multiply(c1, c2);
            break;
          case 'divide':
            resultComplex = divide(c1, c2);
            break;
          case 'magnitude':
            mag = magnitude(c1);
            resultComplex = c1;
            break;
          case 'phase':
            ph = phase(c1);
            resultComplex = c1;
            break;
          case 'conjugate':
            conj = conjugate(c1);
            resultComplex = conj;
            break;
        }

        setResult({
          result: resultComplex,
          magnitude: mag,
          phase: ph,
          conjugate: conj
        });
        setShowResult(true);
      } catch (err) {
        setError(t("complex_numbers.calculation_error"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setReal1('');
      setImag1('');
      setReal2('');
      setImag2('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatComplex = (c: ComplexNumber): string => {
    if (c.imaginary === 0) return c.real.toFixed(4);
    if (c.real === 0) return `${c.imaginary.toFixed(4)}i`;
    const sign = c.imaginary >= 0 ? '+' : '';
    return `${c.real.toFixed(4)} ${sign} ${Math.abs(c.imaginary).toFixed(4)}i`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') calculate();
  };

  const operationOptions = [
    { value: 'add', label: t("complex_numbers.add") },
    { value: 'subtract', label: t("complex_numbers.subtract") },
    { value: 'multiply', label: t("complex_numbers.multiply") },
    { value: 'divide', label: t("complex_numbers.divide") },
    { value: 'magnitude', label: t("complex_numbers.magnitude") },
    { value: 'phase', label: t("complex_numbers.phase") },
    { value: 'conjugate', label: t("complex_numbers.conjugate") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("complex_numbers.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("complex_numbers.operation")} tooltip={t("complex_numbers.operation_tooltip")}>
          <Combobox
            options={operationOptions}
            value={operation}
            onChange={(val) => setOperation(val)}
            placeholder={t("complex_numbers.operation")}
          />
        </FormField>

        <div>
          <h3 className="font-medium mb-2">{t("complex_numbers.first_number")}</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField label={t("complex_numbers.real_part")} tooltip={t("complex_numbers.real_tooltip")}>
              <NumberInput
                value={real1}
                onValueChange={(val) => setReal1(val.toString())}
                onKeyPress={handleKeyPress}
                placeholder="0"
                startIcon={<Hash className="h-4 w-4" />}
              />
            </FormField>

            <FormField label={t("complex_numbers.imaginary_part")} tooltip={t("complex_numbers.imaginary_tooltip")}>
              <NumberInput
                value={imag1}
                onValueChange={(val) => setImag1(val.toString())}
                onKeyPress={handleKeyPress}
                placeholder="0"
                startIcon={<Activity className="h-4 w-4" />}
              />
            </FormField>
          </div>
        </div>

        {operation !== 'magnitude' && operation !== 'phase' && operation !== 'conjugate' && (
          <div>
            <h3 className="font-medium mb-2">{t("complex_numbers.second_number")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField label={t("complex_numbers.real_part")} tooltip={t("complex_numbers.real_tooltip")}>
                <NumberInput
                  value={real2}
                  onValueChange={(val) => setReal2(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder="0"
                  startIcon={<Hash className="h-4 w-4" />}
                />
              </FormField>

              <FormField label={t("complex_numbers.imaginary_part")} tooltip={t("complex_numbers.imaginary_tooltip")}>
                <NumberInput
                  value={imag2}
                  onValueChange={(val) => setImag2(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder="0"
                  startIcon={<Activity className="h-4 w-4" />}
                />
              </FormField>
            </div>
          </div>
        )}
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
      <h3 className="text-xl font-bold mb-4 text-center">{t("complex_numbers.result")}</h3>

      {result.magnitude !== undefined && (
        <div className="mb-4 text-center">
          <div className="text-foreground-70 mb-2">{t("complex_numbers.magnitude")}</div>
          <div className="text-3xl font-bold text-primary">{result.magnitude.toFixed(4)}</div>
        </div>
      )}

      {result.phase !== undefined && (
        <div className="mb-4 text-center">
          <div className="text-foreground-70 mb-2">{t("complex_numbers.phase")}</div>
          <div className="text-3xl font-bold text-primary">{result.phase.toFixed(4)}°</div>
        </div>
      )}

      <div className="text-center">
        <div className="text-foreground-70 mb-2">{t("complex_numbers.complex_number")}</div>
        <div className="text-2xl font-bold text-primary font-mono" dir="ltr">
          {formatComplex(result.result)}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("complex_numbers.title")}
      description={t("complex_numbers.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
