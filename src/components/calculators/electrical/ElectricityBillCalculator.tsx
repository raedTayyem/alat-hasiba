'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, DollarSign, Info, FileText } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function ElectricityBillCalculator() {
  const { t } = useTranslation(['calc/electrical', 'common']);
  const [consumptionKWh, setConsumptionKWh] = useState<string>('');
  const [pricePerKWh, setPricePerKWh] = useState<string>('0.5');
  const [fixedCharge, setFixedCharge] = useState<string>('20');
  const [taxRate, setTaxRate] = useState<string>('');
  const [result, setResult] = useState<{
    energyCost: number;
    taxAmount: number;
    totalCost: number;
    dailyCost: number;
    monthlyCost: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const kwh = parseFloat(consumptionKWh);
    const price = parseFloat(pricePerKWh);
    const fixed = parseFloat(fixedCharge);
    const tax = parseFloat(taxRate) / 100;

    if (!kwh || !price) {
        setError(t('common.error.invalid_input'));
        return;
    }

    // Energy cost
    const energyCost = kwh * price;

    // Subtotal with fixed charge
    const subtotal = energyCost + fixed;

    // Tax
    const taxAmount = subtotal * tax;

    // Total cost
    const totalCost = subtotal + taxAmount;

    // Daily and monthly estimates
    const dailyCost = totalCost / 30;
    const monthlyCost = totalCost;

    setResult({
      energyCost: parseFloat(energyCost.toFixed(2)),
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      totalCost: parseFloat(totalCost.toFixed(2)),
      dailyCost: parseFloat(dailyCost.toFixed(2)),
      monthlyCost: parseFloat(monthlyCost.toFixed(2))
    });
  };

  const reset = () => {
    setConsumptionKWh('');
    setPricePerKWh('0.5');
    setFixedCharge('20');
    setTaxRate('15');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("electricity_bill.consumption")} tooltip={t("electricity_bill.consumption_tooltip")}>
          <NumberInput
            value={consumptionKWh}
            onValueChange={(val) => setConsumptionKWh(val.toString())}
            placeholder={t("common.placeholders.enterValue")}
            min={0}
            step={1}
            startIcon={<Zap className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("electricity_bill.price_per_kwh")} tooltip={t("electricity_bill.price_per_kwh_tooltip")}>
          <NumberInput
            value={pricePerKWh}
            onValueChange={(val) => setPricePerKWh(val.toString())}
            placeholder="0.18-0.30"
            min={0}
            step={0.01}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("electricity_bill.fixed_charge")} tooltip={t("electricity_bill.fixed_charge_tooltip")}>
          <NumberInput
            value={fixedCharge}
            onValueChange={(val) => setFixedCharge(val.toString())}
            placeholder={t("electricity_bill.fixed_charge")}
            min={0}
            step={1}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("electricity_bill.tax_rate")} tooltip={t("electricity_bill.tax_rate_tooltip")}>
          <NumberInput
            value={taxRate}
            onValueChange={(val) => setTaxRate(val.toString())}
            placeholder={t("placeholders.taxRate")}
            min={0}
            max={100}
            step={1}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("electricity_bill.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("electricity_bill.total_bill")}</div>
          <div className="text-3xl font-bold text-primary">{result.totalCost.toFixed(2)} {t("common.currency")}</div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between p-3 bg-foreground/5 rounded-lg">
            <span className="text-foreground-70">{t("electricity_bill.energy_cost")}</span>
            <span className="font-bold">{result.energyCost.toFixed(2)} {t("common.currency")}</span>
          </div>
          <div className="flex justify-between p-3 bg-foreground/5 rounded-lg">
            <span className="text-foreground-70">{t("electricity_bill.tax_amount")}</span>
            <span className="font-bold">{result.taxAmount.toFixed(2)} {t("common.currency")}</span>
          </div>
          <div className="flex justify-between p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 rounded-lg">
            <span className="text-foreground-70">{t("electricity_bill.daily_cost")}</span>
            <span className="font-bold">{result.dailyCost.toFixed(2)} {t("common.currency")}</span>
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/20 rounded-lg">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            {t("electricity_bill.about_title")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">{t("electricity_bill.about_desc")}</ul>
        </div>
      </div>
    </div>
  ) : (
      <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <FileText className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("electricity_bill.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("electricity_bill.title")}
      description={t("electricity_bill.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("electricity_bill.footer_note")}
     className="rtl" />
  );
}
