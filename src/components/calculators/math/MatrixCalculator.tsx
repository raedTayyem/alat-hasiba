'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, X, Info } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

interface MatrixResult {
  result: number[][];
  determinant?: number;
  trace?: number;
  transpose?: number[][];
}

export default function MatrixCalculator() {
  const { t } = useTranslation('calc/math');
  const [operation, setOperation] = useState<string>('add');
  const [rows, setRows] = useState<string>('2');
  const [cols, setCols] = useState<string>('2');
  const [matrix1, setMatrix1] = useState<number[][]>([[0, 0], [0, 0]]);
  const [matrix2, setMatrix2] = useState<number[][]>([[0, 0], [0, 0]]);
  const [scalar, setScalar] = useState<string>('1');
  const [result, setResult] = useState<MatrixResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const r = Math.max(1, Math.min(5, parseInt(rows) || 2));
    const c = Math.max(1, Math.min(5, parseInt(cols) || 2));
    const newMatrix1: number[][] = Array(r).fill(0).map(() => Array(c).fill(0));
    const newMatrix2: number[][] = Array(r).fill(0).map(() => Array(c).fill(0));
    setMatrix1(newMatrix1);
    setMatrix2(newMatrix2);
  }, [rows, cols]);

  const handleMatrixChange = (matrixNum: number, row: number, col: number, value: string | number) => {
    const val = parseFloat(value.toString()) || 0;
    if (matrixNum === 1) {
      const newMatrix = [...matrix1];
      newMatrix[row][col] = val;
      setMatrix1(newMatrix);
    } else {
      const newMatrix = [...matrix2];
      newMatrix[row][col] = val;
      setMatrix2(newMatrix);
    }
    if (error) setError('');
  };

  const addMatrices = (m1: number[][], m2: number[][]): number[][] => {
    return m1.map((row, i) => row.map((val, j) => val + m2[i][j]));
  };

  const subtractMatrices = (m1: number[][], m2: number[][]): number[][] => {
    return m1.map((row, i) => row.map((val, j) => val - m2[i][j]));
  };

  const multiplyMatrices = (m1: number[][], m2: number[][]): number[][] => {
    const result: number[][] = Array(m1.length).fill(0).map(() => Array(m2[0].length).fill(0));
    for (let i = 0; i < m1.length; i++) {
      for (let j = 0; j < m2[0].length; j++) {
        for (let k = 0; k < m1[0].length; k++) {
          result[i][j] += m1[i][k] * m2[k][j];
        }
      }
    }
    return result;
  };

  const scalarMultiply = (m: number[][], scalar: number): number[][] => {
    return m.map(row => row.map(val => val * scalar));
  };

  const transpose = (m: number[][]): number[][] => {
    return m[0].map((_, i) => m.map(row => row[i]));
  };

  const determinant = (m: number[][]): number => {
    const n = m.length;
    if (n !== m[0].length) return NaN;
    if (n === 1) return m[0][0];
    if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];

    let det = 0;
    for (let j = 0; j < n; j++) {
      const minor = m.slice(1).map(row => row.filter((_, i) => i !== j));
      det += Math.pow(-1, j) * m[0][j] * determinant(minor);
    }
    return det;
  };

  const trace = (m: number[][]): number => {
    if (m.length !== m[0].length) return NaN;
    return m.reduce((sum, row, i) => sum + row[i], 0);
  };

  const calculate = () => {
    setShowResult(false);
    setError('');

    setTimeout(() => {
      try {
        let resultMatrix: number[][] = [];
        let det: number | undefined;
        let tr: number | undefined;
        let trans: number[][] | undefined;

        switch (operation) {
          case 'add':
            if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
              setError(t("matrix_calculator.dimension_error"));
              return;
            }
            resultMatrix = addMatrices(matrix1, matrix2);
            break;
          case 'subtract':
            if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
              setError(t("matrix_calculator.dimension_error"));
              return;
            }
            resultMatrix = subtractMatrices(matrix1, matrix2);
            break;
          case 'multiply':
            if (matrix1[0].length !== matrix2.length) {
              setError(t("matrix_calculator.multiplication_error"));
              return;
            }
            resultMatrix = multiplyMatrices(matrix1, matrix2);
            break;
          case 'scalar':
            resultMatrix = scalarMultiply(matrix1, parseFloat(scalar) || 1);
            break;
          case 'transpose':
            resultMatrix = transpose(matrix1);
            trans = resultMatrix;
            break;
          case 'determinant':
            if (matrix1.length !== matrix1[0].length) {
              setError(t("matrix_calculator.square_matrix_error"));
              return;
            }
            det = determinant(matrix1);
            resultMatrix = matrix1;
            break;
          case 'trace':
            if (matrix1.length !== matrix1[0].length) {
              setError(t("matrix_calculator.square_matrix_error"));
              return;
            }
            tr = trace(matrix1);
            resultMatrix = matrix1;
            break;
        }

        setResult({
          result: resultMatrix,
          determinant: det,
          trace: tr,
          transpose: trans
        });
        setShowResult(true);
      } catch (err) {
        setError(t("matrix_calculator.calculation_error"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      const r = parseInt(rows) || 2;
      const c = parseInt(cols) || 2;
      setMatrix1(Array(r).fill(0).map(() => Array(c).fill(0)));
      setMatrix2(Array(r).fill(0).map(() => Array(c).fill(0)));
      setResult(null);
      setError('');
    }, 300);
  };

  const renderMatrix = (matrix: number[][], label: string, matrixNum?: number) => (
    <div className="mb-4">
      <h3 className="font-medium mb-2">{label}</h3>
      <div className="bg-muted dark:bg-muted p-3 rounded-lg overflow-x-auto flex flex-col gap-2">
        {matrix.map((row, i) => (
          <div key={i} className="flex gap-2">
            {row.map((val, j) => (
              <div key={j} className="w-16">
                <NumberInput
                  value={val.toString()}
                  onValueChange={(value) => matrixNum && handleMatrixChange(matrixNum, i, j, value)}
                  className="text-center"
                  placeholder="0"
                  readOnly={!matrixNum}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const operationOptions = [
    { value: 'add', label: t("matrix_calculator.add") },
    { value: 'subtract', label: t("matrix_calculator.subtract") },
    { value: 'multiply', label: t("matrix_calculator.multiply") },
    { value: 'scalar', label: t("matrix_calculator.scalar_multiply") },
    { value: 'transpose', label: t("matrix_calculator.transpose") },
    { value: 'determinant', label: t("matrix_calculator.determinant") },
    { value: 'trace', label: t("matrix_calculator.trace") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("matrix_calculator.title")}
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <FormField label={t("matrix_calculator.operation")} tooltip={t("matrix_calculator.operation_tooltip")}>
          <Combobox
            options={operationOptions}
            value={operation}
            onChange={(val) => setOperation(val)}
            placeholder={t("matrix_calculator.operation")}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label={t("matrix_calculator.rows")} tooltip={t("matrix_calculator.rows_tooltip")}>
            <NumberInput
              value={rows}
              onValueChange={(val) => setRows(val.toString())}
              min={1}
              max={5}
              placeholder="2"
              startIcon={<Grid className="h-4 w-4" />}
            />
          </FormField>

          <FormField label={t("matrix_calculator.columns")} tooltip={t("matrix_calculator.columns_tooltip")}>
            <NumberInput
              value={cols}
              onValueChange={(val) => setCols(val.toString())}
              min={1}
              max={5}
              placeholder="2"
              startIcon={<Grid className="h-4 w-4" />}
            />
          </FormField>
        </div>

        {operation === 'scalar' && (
          <FormField label={t("matrix_calculator.scalar_value")} tooltip={t("matrix_calculator.scalar_tooltip")}>
            <NumberInput
              value={scalar}
              onValueChange={(val) => setScalar(val.toString())}
              placeholder="1"
              startIcon={<X className="h-4 w-4" />}
            />
          </FormField>
        )}

        {renderMatrix(matrix1, t("matrix_calculator.matrix1"), 1)}

        {operation !== 'transpose' && operation !== 'determinant' && operation !== 'trace' && operation !== 'scalar' && (
          renderMatrix(matrix2, t("matrix_calculator.matrix2"), 2)
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
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-4">{t("matrix_calculator.result")}</h3>

        {result.determinant !== undefined && (
          <div className="mb-4">
            <div className="text-foreground-70 mb-2">{t("matrix_calculator.determinant_label")}</div>
            <div className="text-4xl font-bold text-primary">
              {result.determinant.toFixed(4)}
            </div>
          </div>
        )}

        {result.trace !== undefined && (
          <div className="mb-4">
            <div className="text-foreground-70 mb-2">{t("matrix_calculator.trace_label")}</div>
            <div className="text-4xl font-bold text-primary">
              {result.trace.toFixed(4)}
            </div>
          </div>
        )}

        {renderMatrix(result.result, t("matrix_calculator.result_matrix"))}
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("matrix_calculator.info_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("matrix_calculator.info_description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("matrix_calculator.title")}
      description={t("matrix_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
