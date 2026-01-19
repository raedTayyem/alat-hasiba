'use client';

/**
 * LTV (Loan to Value) Calculator
 *
 * Calculates Loan to Value ratio for mortgages and loans
 * Formula: LTV = (Loan Amount / Property Value) × 100
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Home, Percent, Shield, AlertTriangle, CheckCircle } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

interface CalculatorResult {
  ltv: number;
  loanAmount: number;
  propertyValue: number;
  equity: number;
  equityPercent: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'very_high';
  pmiRequired: boolean;
  downPayment: number;
}

export default function LTVCalculator() {
  const { t } = useTranslation('calc/business');
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [propertyValue, setPropertyValue] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const loan = parseFloat(loanAmount);
    const property = parseFloat(propertyValue);

    if (isNaN(loan) || isNaN(property)) {
      setError(t('errors.invalid_input'));
      return false;
    }

    if (loan <= 0 || property <= 0) {
      setError(t('errors.positive_values_required'));
      return false;
    }

    if (loan > property) {
      setError(t('ltv.errors.loan_exceeds_property'));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const loan = parseFloat(loanAmount);
        const property = parseFloat(propertyValue);

        // Calculate LTV ratio
        const ltv = (loan / property) * 100;

        // Calculate equity
        const equity = property - loan;
        const equityPercent = ((property - loan) / property) * 100;

        // Determine risk level based on LTV
        let riskLevel: CalculatorResult['riskLevel'];
        if (ltv <= 80) {
          riskLevel = 'low';
        } else if (ltv <= 90) {
          riskLevel = 'moderate';
        } else if (ltv <= 95) {
          riskLevel = 'high';
        } else {
          riskLevel = 'very_high';
        }

        // PMI typically required when LTV > 80%
        const pmiRequired = ltv > 80;

        // Down payment is the difference
        const downPayment = property - loan;

        setResult({
          ltv,
          loanAmount: loan,
          propertyValue: property,
          equity,
          equityPercent,
          riskLevel,
          pmiRequired,
          downPayment,
        });

        setShowResult(true);
      } catch (err) {
        setError(t('errors.calculation_error'));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setLoanAmount('');
      setPropertyValue('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatCurrency = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const formatPercent = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const getRiskColor = (risk: CalculatorResult['riskLevel']): string => {
    switch (risk) {
      case 'low':
        return 'text-success';
      case 'moderate':
        return 'text-warning';
      case 'high':
        return 'text-orange-500';
      case 'very_high':
        return 'text-error';
      default:
        return 'text-foreground';
    }
  };

  const getRiskBgColor = (risk: CalculatorResult['riskLevel']): string => {
    switch (risk) {
      case 'low':
        return 'bg-success/10 border-success/20';
      case 'moderate':
        return 'bg-warning/10 border-warning/20';
      case 'high':
        return 'bg-orange-500/10 border-orange-500/20';
      case 'very_high':
        return 'bg-error/10 border-error/20';
      default:
        return 'bg-card border-border';
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t('ltv.title')}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t('ltv.inputs.loan_amount')}
          tooltip={t('ltv.inputs.loan_amount_tooltip')}
        >
          <NumberInput
            value={loanAmount}
            onValueChange={(val) => {
              setLoanAmount(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t('ltv.inputs.loan_amount_placeholder')}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t('ltv.inputs.property_value')}
          tooltip={t('ltv.inputs.property_value_tooltip')}
        >
          <NumberInput
            value={propertyValue}
            onValueChange={(val) => {
              setPropertyValue(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t('ltv.inputs.property_value_placeholder')}
            startIcon={<Home className="h-4 w-4" />}
            min={0}
          />
        </FormField>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t('ltv.info.title')}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t('ltv.description')}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t('ltv.info.use_cases')}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t('ltv.info.use_case_1')}</li>
              <li>{t('ltv.info.use_case_2')}</li>
              <li>{t('ltv.info.use_case_3')}</li>
            </ul>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t('ltv.info.ltv_ranges_title')}
            </h2>
            <ul className="space-y-2 text-foreground-70">
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 bg-success rounded-full"></span>
                <span>{t('ltv.info.ltv_range_low')}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 bg-warning rounded-full"></span>
                <span>{t('ltv.info.ltv_range_moderate')}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                <span>{t('ltv.info.ltv_range_high')}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 bg-error rounded-full"></span>
                <span>{t('ltv.info.ltv_range_very_high')}</span>
              </li>
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
          {t('ltv.results.ltv_ratio')}
        </div>
        <div className={`text-4xl font-bold mb-2 ${getRiskColor(result.riskLevel)}`}>
          {formatPercent(result.ltv)}%
        </div>
        <div className={`text-lg font-medium ${getRiskColor(result.riskLevel)}`}>
          {t(`ltv.results.risk_levels.${result.riskLevel}`)}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t('ltv.results.breakdown')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t('ltv.results.loan_amount')}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatCurrency(result.loanAmount)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Home className="w-5 h-5 text-info ml-2" />
              <div className="font-medium">{t('ltv.results.property_value')}</div>
            </div>
            <div className="text-2xl font-bold text-info">${formatCurrency(result.propertyValue)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Shield className="w-5 h-5 text-success ml-2" />
              <div className="font-medium">{t('ltv.results.equity')}</div>
            </div>
            <div className="text-2xl font-bold text-success">${formatCurrency(result.equity)}</div>
            <div className="text-sm text-foreground-70">{formatPercent(result.equityPercent)}%</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-warning ml-2" />
              <div className="font-medium">{t('ltv.results.down_payment')}</div>
            </div>
            <div className="text-2xl font-bold text-warning">${formatCurrency(result.downPayment)}</div>
            <div className="text-sm text-foreground-70">{formatPercent(100 - result.ltv)}%</div>
          </div>
        </div>

        {/* PMI Status */}
        <div className={`p-4 rounded-lg border ${result.pmiRequired ? 'bg-warning/10 border-warning/20' : 'bg-success/10 border-success/20'}`}>
          <div className="flex items-center gap-2">
            {result.pmiRequired ? (
              <AlertTriangle className="w-5 h-5 text-warning" />
            ) : (
              <CheckCircle className="w-5 h-5 text-success" />
            )}
            <span className="font-medium">
              {result.pmiRequired
                ? t('ltv.results.pmi_required')
                : t('ltv.results.pmi_not_required')
              }
            </span>
          </div>
          <p className="text-sm text-foreground-70 mt-1">
            {result.pmiRequired
              ? t('ltv.results.pmi_explanation')
              : t('ltv.results.no_pmi_explanation')
            }
          </p>
        </div>

        {/* Risk Assessment */}
        <div className={`p-4 rounded-lg border ${getRiskBgColor(result.riskLevel)}`}>
          <h4 className="font-medium mb-2">{t('ltv.results.risk_assessment')}</h4>
          <p className="text-sm text-foreground-70">
            {t(`ltv.results.risk_explanations.${result.riskLevel}`)}
          </p>
        </div>

        {/* LTV Visual Bar */}
        <div className="bg-card p-4 rounded-lg border border-border">
          <h4 className="font-medium mb-3">{t('ltv.results.ltv_visual')}</h4>
          <div className="relative h-6 bg-muted rounded-full overflow-hidden">
            <div
              className={`absolute h-full transition-all duration-500 ${
                result.ltv <= 80 ? 'bg-success' :
                result.ltv <= 90 ? 'bg-warning' :
                result.ltv <= 95 ? 'bg-orange-500' : 'bg-error'
              }`}
              style={{ width: `${Math.min(result.ltv, 100)}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-foreground">
              {formatPercent(result.ltv)}%
            </div>
          </div>
          <div className="flex justify-between text-xs text-foreground-70 mt-1">
            <span>0%</span>
            <span className="text-success">80%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Percent className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t('ltv.results.formula_title')}</h4>
            <p className="text-sm text-foreground-70">
              {t('ltv.results.formula')}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('ltv.title')}
      description={t('ltv.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
