'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FunctionSquare, CheckCircle, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function CalculusCalculator() {
  const { t } = useTranslation(['calc/math', 'common']);

  const [input, setInput] = useState<string>('');
  const [operation, setOperation] = useState<string>('derivative');
  const [variable, setVariable] = useState<string>('x');
  const [result, setResult] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Function to handle calculation
  const calculate = () => {
    // Reset previous results
    setResult(null);
    setSteps([]);
    setError(null);

    if (!input.trim()) {
      setError(t("calculus.errors.empty_input"));
      return;
    }

    try {
      if (operation === 'derivative') {
        calculateDerivative();
      } else {
        calculateIntegral();
      }
    } catch (e) {
      setError(t("calculus.errors.calculation_error"));
    }
  };

  const calculateDerivative = () => {
    // Sanitize input
    const expression = input.trim().replace(/\s+/g, '');
    
    // Initialize steps
    const calculationSteps: string[] = [];
    let finalResult = '';
    
    // Simple rules for derivatives
    if (expression === 'x') {
      finalResult = '1';
      calculationSteps.push(t("calculus.steps.derivative_x"));
    } else if (expression === 'x^2') {
      finalResult = '2x';
      calculationSteps.push(t("calculus.steps.derivative_x2"));
      calculationSteps.push(t("calculus.steps.power_rule_2"));
    } else if (expression.match(/^x\^(\d+)$/)) {
      const power = parseInt(expression.match(/^x\^(\d+)$/)?.[1] || '0');
      finalResult = `${power}x^${power - 1}`;
      calculationSteps.push(t("calculus.steps.derivative_power"));
      calculationSteps.push(t("calculus.rules.derivative_power_rule_desc"));
    } else if (expression === 'sin(x)') {
      finalResult = 'cos(x)';
      calculationSteps.push(t("calculus.steps.derivative_sin"));
    } else if (expression === 'cos(x)') {
      finalResult = '-sin(x)';
      calculationSteps.push(t("calculus.steps.derivative_cos"));
    } else if (expression === 'e^x') {
      finalResult = 'e^x';
      calculationSteps.push(t("calculus.steps.derivative_exp"));
    } else if (expression === 'ln(x)') {
      finalResult = '1/x';
      calculationSteps.push(t("calculus.steps.derivative_ln"));
    } else {
      // For more complex expressions, we would need a symbolic math library
      // This is a simplified version for demonstration
      finalResult = t("calculus.results.complex");
      calculationSteps.push(t("calculus.steps.symbolic_needed"));
    }
    
    setResult(finalResult);
    setSteps(calculationSteps);
  };

  const calculateIntegral = () => {
    // Sanitize input
    const expression = input.trim().replace(/\s+/g, '');
    
    // Initialize steps
    const calculationSteps: string[] = [];
    let finalResult = '';
    
    // Simple rules for integrals
    if (expression === 'x') {
      finalResult = 'x^2/2 + C';
      calculationSteps.push(t("calculus.steps.integral_x"));
      calculationSteps.push(t("calculus.steps.power_rule_integral_1"));
    } else if (expression === '1') {
      finalResult = 'x + C';
      calculationSteps.push(t("calculus.steps.integral_constant"));
    } else if (expression.match(/^x\^(\d+)$/)) {
      const power = parseInt(expression.match(/^x\^(\d+)$/)?.[1] || '0');
      finalResult = `x^${power + 1}/${power + 1} + C`;
      calculationSteps.push(t("calculus.steps.integral_power"));
      calculationSteps.push(t("calculus.rules.integral_power_rule_desc"));
    } else if (expression === 'sin(x)') {
      finalResult = '-cos(x) + C';
      calculationSteps.push(t("calculus.steps.integral_sin"));
    } else if (expression === 'cos(x)') {
      finalResult = 'sin(x) + C';
      calculationSteps.push(t("calculus.steps.integral_cos"));
    } else if (expression === 'e^x') {
      finalResult = 'e^x + C';
      calculationSteps.push(t("calculus.steps.integral_exp"));
    } else if (expression === '1/x') {
      finalResult = 'ln|x| + C';
      calculationSteps.push(t("calculus.steps.integral_inv_x"));
    } else {
      // For more complex expressions, we would need a symbolic math library
      // This is a simplified version for demonstration
      finalResult = t("calculus.results.complex");
      calculationSteps.push(t("calculus.steps.symbolic_needed"));
    }
    
    setResult(finalResult);
    setSteps(calculationSteps);
  };

  const resetCalculator = () => {
    setInput('');
    setOperation('derivative');
    setVariable('x');
    setResult(null);
    setSteps([]);
    setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const operationOptions = [
    { value: 'derivative', label: t("calculus.derivative") },
    { value: 'integral', label: t("calculus.integral") },
  ];

  const variableOptions = [
    { value: 'x', label: 'x' },
    { value: 'y', label: 'y' },
    { value: 't', label: 't' },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("calculus.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("calculus.operation_type")}>
          <Combobox
            options={operationOptions}
            value={operation}
            onChange={(val) => setOperation(val)}
            placeholder={t("calculus.operation_type")}
          />
        </FormField>

        <FormField 
          label={operation === 'derivative' ? t("calculus.function_to_differentiate") : t("calculus.function_to_integrate")}
          description={t("calculus.supported_functions")}
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-muted-foreground">
                <FunctionSquare className="h-4 w-4" />
              </div>
              <Input
                id="function"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t("calculus.enter_function")}
                className="pl-9 font-mono"
                dir="ltr"
              />
            </div>
            <div className="w-24">
              <Combobox
                options={variableOptions}
                value={variable}
                onChange={(val) => setVariable(val)}
                placeholder="x"
              />
            </div>
          </div>
        </FormField>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error || ''} />
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("common.result")}</div>
        <div className="bg-primary/5 p-4 rounded-md text-center text-xl font-bold font-mono text-primary border border-primary/10" dir="ltr">
          {operation === 'derivative' ? `d/d${variable}(${input}) = ` : `∫(${input})d${variable} = `}{result}
        </div>
      </div>

      <div className="divider my-6"></div>
        
      {steps.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium mb-3 flex items-center">
            <CheckCircle className="w-4 h-4 ml-2 text-success" />
            {t("calculus.steps_title")}
          </h4>
          <div className="bg-card p-4 rounded-lg border border-border">
            <ol className="space-y-2 list-decimal list-inside text-sm">
              {steps.map((step, index) => (
                <li key={index} className="pl-2">{step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}

      <div>
        <h4 className="font-medium mb-3 flex items-center">
          <Info className="w-4 h-4 ml-2 text-info" />
          {t("calculus.rules_title")}
        </h4>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="mb-2 font-medium text-sm text-foreground-70">
            {operation === 'derivative' ? t("calculus.derivative_rules") : t("calculus.integral_rules")}
          </div>
          <ul className="space-y-1 list-disc list-inside text-sm text-foreground-70 pl-2">
            {operation === 'derivative' ? (
              <>
                <li>{t("calculus.rules.derivative_rule_1")}</li>
                <li>{t("calculus.rules.derivative_rule_2")}</li>
                <li>{t("calculus.rules.derivative_rule_3")}</li>
                <li>{t("calculus.rules.derivative_rule_4")}</li>
                <li>{t("calculus.rules.derivative_rule_5")}</li>
              </>
            ) : (
              <>
                <li>{t("calculus.rules.integral_rule_1")}</li>
                <li>{t("calculus.rules.integral_rule_2")}</li>
                <li>{t("calculus.rules.integral_rule_3")}</li>
                <li>{t("calculus.rules.integral_rule_4")}</li>
                <li>{t("calculus.rules.integral_rule_5")}</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("calculators.calc_494")}
      description={t("calculus.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
} 

