'use client';

/**
 * ALATHASIBA - FARM PROFIT CALCULATOR
 * Calculate farm profitability and return on investment
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, TrendingUp, TrendingDown, Target, Percent, BarChart3 } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface FarmProfitResult {
  totalRevenue: number;
  totalCosts: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  roi: number;
  breakEvenRevenue: number;
}

export default function FarmProfitCalculator() {
  const { t } = useTranslation(['calc/agriculture', 'common']);
  const [cropRevenue, setCropRevenue] = useState<string>('');
  const [livestockRevenue, setLivestockRevenue] = useState<string>('');
  const [otherRevenue, setOtherRevenue] = useState<string>('');
  const [seedCosts, setSeedCosts] = useState<string>('');
  const [fertilizerCosts, setFertilizerCosts] = useState<string>('');
  const [laborCosts, setLaborCosts] = useState<string>('');
  const [equipmentCosts, setEquipmentCosts] = useState<string>('');
  const [otherCosts, setOtherCosts] = useState<string>('');
  const [initialInvestment, setInitialInvestment] = useState<string>('');

  const [result, setResult] = useState<FarmProfitResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => { initDateInputRTL(); }, []);

  const validateInputs = (): boolean => {
    setError('');

    const revenues = [cropRevenue, livestockRevenue, otherRevenue].map(v => parseFloat(v) || 0);
    const costs = [seedCosts, fertilizerCosts, laborCosts, equipmentCosts, otherCosts].map(v => parseFloat(v) || 0);
    const investment = parseFloat(initialInvestment) || 0;

    const totalRevenue = revenues.reduce((a, b) => a + b, 0);
    const totalCosts = costs.reduce((a, b) => a + b, 0);

    if (totalRevenue === 0 && totalCosts === 0) {
      setError(t("farm_profit.error_no_input"));
      return false;
    }

    if (revenues.some(v => v < 0) || costs.some(v => v < 0) || investment < 0) {
      setError(t("farm_profit.error_negative_values"));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;
    setShowResult(false);

    setTimeout(() => {
      try {
        const totalRevenue =
          (parseFloat(cropRevenue) || 0) +
          (parseFloat(livestockRevenue) || 0) +
          (parseFloat(otherRevenue) || 0);

        const totalCosts =
          (parseFloat(seedCosts) || 0) +
          (parseFloat(fertilizerCosts) || 0) +
          (parseFloat(laborCosts) || 0) +
          (parseFloat(equipmentCosts) || 0) +
          (parseFloat(otherCosts) || 0);

        const investment = parseFloat(initialInvestment) || 0;

        const grossProfit = totalRevenue - totalCosts;
        const netProfit = grossProfit;
        const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
        const roi = investment > 0 ? (netProfit / investment) * 100 : 0;
        const breakEvenRevenue = totalCosts;

        setResult({
          totalRevenue,
          totalCosts,
          grossProfit,
          netProfit,
          profitMargin,
          roi,
          breakEvenRevenue,
        });
        setShowResult(true);
        setError('');
      } catch (err) {
        setError(t("farm_profit.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setCropRevenue('');
      setLivestockRevenue('');
      setOtherRevenue('');
      setSeedCosts('');
      setFertilizerCosts('');
      setLaborCosts('');
      setEquipmentCosts('');
      setOtherCosts('');
      setInitialInvestment('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">{t("farm_profit.title")}</div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Revenue Section */}
        <div className="bg-success/5 p-4 rounded-lg border border-success/20">
          <h3 className="font-semibold mb-3 text-success flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t("farm_profit.revenue_section")}
          </h3>
          <div className="space-y-3">
            <FormField label={t("farm_profit.crop_revenue_label")} tooltip={t("farm_profit.crop_revenue_tooltip")}>
              <NumberInput
                value={cropRevenue}
                onValueChange={(val) => setCropRevenue(val.toString())}
                onKeyPress={handleKeyPress}
                placeholder={t("farm_profit.crop_revenue_placeholder")}
                min={0}
                startIcon={<DollarSign className="h-4 w-4" />}
              />
            </FormField>
            <FormField label={t("farm_profit.livestock_revenue_label")} tooltip={t("farm_profit.livestock_revenue_tooltip")}>
              <NumberInput
                value={livestockRevenue}
                onValueChange={(val) => setLivestockRevenue(val.toString())}
                onKeyPress={handleKeyPress}
                placeholder={t("farm_profit.livestock_revenue_placeholder")}
                min={0}
                startIcon={<DollarSign className="h-4 w-4" />}
              />
            </FormField>
            <FormField label={t("farm_profit.other_revenue_label")} tooltip={t("farm_profit.other_revenue_tooltip")}>
              <NumberInput
                value={otherRevenue}
                onValueChange={(val) => setOtherRevenue(val.toString())}
                onKeyPress={handleKeyPress}
                placeholder={t("farm_profit.other_revenue_placeholder")}
                min={0}
                startIcon={<DollarSign className="h-4 w-4" />}
              />
            </FormField>
          </div>
        </div>

        {/* Costs Section */}
        <div className="bg-error/5 p-4 rounded-lg border border-error/20">
          <h3 className="font-semibold mb-3 text-error flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            {t("farm_profit.costs_section")}
          </h3>
          <div className="space-y-3">
            <FormField label={t("farm_profit.seed_costs_label")} tooltip={t("farm_profit.seed_costs_tooltip")}>
              <NumberInput
                value={seedCosts}
                onValueChange={(val) => setSeedCosts(val.toString())}
                onKeyPress={handleKeyPress}
                placeholder={t("farm_profit.seed_costs_placeholder")}
                min={0}
                startIcon={<DollarSign className="h-4 w-4" />}
              />
            </FormField>
            <FormField label={t("farm_profit.fertilizer_costs_label")} tooltip={t("farm_profit.fertilizer_costs_tooltip")}>
              <NumberInput
                value={fertilizerCosts}
                onValueChange={(val) => setFertilizerCosts(val.toString())}
                onKeyPress={handleKeyPress}
                placeholder={t("farm_profit.fertilizer_costs_placeholder")}
                min={0}
                startIcon={<DollarSign className="h-4 w-4" />}
              />
            </FormField>
            <FormField label={t("farm_profit.labor_costs_label")} tooltip={t("farm_profit.labor_costs_tooltip")}>
              <NumberInput
                value={laborCosts}
                onValueChange={(val) => setLaborCosts(val.toString())}
                onKeyPress={handleKeyPress}
                placeholder={t("farm_profit.labor_costs_placeholder")}
                min={0}
                startIcon={<DollarSign className="h-4 w-4" />}
              />
            </FormField>
            <FormField label={t("farm_profit.equipment_costs_label")} tooltip={t("farm_profit.equipment_costs_tooltip")}>
              <NumberInput
                value={equipmentCosts}
                onValueChange={(val) => setEquipmentCosts(val.toString())}
                onKeyPress={handleKeyPress}
                placeholder={t("farm_profit.equipment_costs_placeholder")}
                min={0}
                startIcon={<DollarSign className="h-4 w-4" />}
              />
            </FormField>
            <FormField label={t("farm_profit.other_costs_label")} tooltip={t("farm_profit.other_costs_tooltip")}>
              <NumberInput
                value={otherCosts}
                onValueChange={(val) => setOtherCosts(val.toString())}
                onKeyPress={handleKeyPress}
                placeholder={t("farm_profit.other_costs_placeholder")}
                min={0}
                startIcon={<DollarSign className="h-4 w-4" />}
              />
            </FormField>
          </div>
        </div>

        {/* Investment Section */}
        <div className="bg-info/5 p-4 rounded-lg border border-info/20">
          <FormField label={t("farm_profit.initial_investment_label")} tooltip={t("farm_profit.initial_investment_tooltip")}>
            <NumberInput
              value={initialInvestment}
              onValueChange={(val) => setInitialInvestment(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("farm_profit.initial_investment_placeholder")}
              min={0}
              startIcon={<Target className="h-4 w-4" />}
            />
          </FormField>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t("farm_profit.info_title")}</h2>
          <p className="text-foreground-70">{t("farm_profit.info_description")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("farm_profit.result_net_profit")}</div>
        <div className={`text-4xl font-bold mb-2 ${result.netProfit >= 0 ? 'text-success' : 'text-error'}`} dir="ltr">
          {t("common:units.currencySymbol")}{formatNumber(Math.abs(result.netProfit))}
        </div>
        <div className="text-lg text-foreground-70">
          {result.netProfit >= 0 ? t("farm_profit.profit") : t("farm_profit.loss")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success" />
            {t("farm_profit.total_revenue")}
          </div>
          <div className="text-2xl font-bold text-success" dir="ltr">
            {t("common:units.currencySymbol")}{formatNumber(result.totalRevenue)}
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-error" />
            {t("farm_profit.total_costs")}
          </div>
          <div className="text-2xl font-bold text-error" dir="ltr">
            {t("common:units.currencySymbol")}{formatNumber(result.totalCosts)}
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2 flex items-center gap-2">
            <Percent className="h-4 w-4 text-primary" />
            {t("farm_profit.profit_margin")}
          </div>
          <div className="text-2xl font-bold text-primary" dir="ltr">
            {formatNumber(result.profitMargin)}%
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-info" />
            {t("farm_profit.roi")}
          </div>
          <div className="text-2xl font-bold text-info" dir="ltr">
            {formatNumber(result.roi)}%
          </div>
        </div>
      </div>

      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="font-medium mb-2 flex items-center gap-2">
          <Target className="h-4 w-4 text-warning" />
          {t("farm_profit.break_even")}
        </div>
        <div className="text-sm text-foreground-70 mb-2">
          {t("farm_profit.break_even_description")}
        </div>
        <div className="text-xl font-bold text-warning" dir="ltr">
          {t("common:units.currencySymbol")}{formatNumber(result.breakEvenRevenue)}
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <h4 className="font-medium mb-2">{t("farm_profit.analysis_title")}</h4>
        <div className="text-sm text-foreground-70 space-y-1">
          {result.netProfit >= 0 ? (
            <>
              <p>{t("farm_profit.analysis_profitable")}</p>
              {result.profitMargin > 20 && <p>{t("farm_profit.analysis_excellent_margin")}</p>}
              {result.profitMargin > 10 && result.profitMargin <= 20 && <p>{t("farm_profit.analysis_good_margin")}</p>}
              {result.profitMargin <= 10 && <p>{t("farm_profit.analysis_low_margin")}</p>}
            </>
          ) : (
            <p>{t("farm_profit.analysis_loss")}</p>
          )}
          {result.roi > 0 && <p>{t("farm_profit.analysis_positive_roi", { roi: formatNumber(result.roi) })}</p>}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("farm_profit.title")}
      description={t("farm_profit.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
