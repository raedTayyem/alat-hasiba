'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Coins, Scale, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function ZakatCalculator() {
    const { t } = useTranslation(['calc/finance', 'common']);
    const [cash, setCash] = useState<string>('');
    const [goldWeight, setGoldWeight] = useState<string>('');
    const [goldPrice, setGoldPrice] = useState<string>('75'); // Default example price
    const [result, setResult] = useState<{
        wealthZakat: number;
        goldZakat: number;
        totalZakat: number;
        isEligible: boolean;
    } | null>(null);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const calculate = () => {
        const cashVal = parseFloat(cash) || 0;
        const goldWeightVal = parseFloat(goldWeight) || 0;
        const goldPriceVal = parseFloat(goldPrice) || 0;

        if (cashVal === 0 && goldWeightVal === 0) {
            setError(t('common.errors.required'));
            return;
        }

        setError('');
        setShowResult(false);

        setTimeout(() => {
            // Nisab for gold is 85 grams of 24K gold
            const currentNisab = 85 * goldPriceVal;
            const totalWealth = cashVal + (goldWeightVal * goldPriceVal);

            const isEligible = totalWealth >= currentNisab;

            const wealthZakat = isEligible ? cashVal * 0.025 : 0;
            const goldZakat = isEligible ? (goldWeightVal * goldPriceVal) * 0.025 : 0;
            const totalZakat = wealthZakat + goldZakat;

            setResult({
                wealthZakat,
                goldZakat,
                totalZakat,
                isEligible
            });
            setShowResult(true);
        }, 300);
    };

    const resetCalculator = () => {
        setShowResult(false);
        setTimeout(() => {
            setCash('');
            setGoldWeight('');
            setGoldPrice('75');
            setResult(null);
            setError('');
        }, 300);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            calculate();
        }
    };

    const inputSection = (
        <div className="max-w-md mx-auto space-y-4">
            <div className="text-2xl font-bold mb-6 text-center">
                {t("zakat.title")}
            </div>

            <FormField
                label={t("zakat.inputs.wealth_label")}
                tooltip={t("zakat.inputs.wealth_tooltip")}
            >
                <NumberInput
                    value={cash}
                    onValueChange={(val) => setCash(val.toString())}
                    onKeyPress={handleKeyPress}
                    placeholder="0"
                    min={0}
                    startIcon={<Coins className="h-4 w-4" />}
                />
            </FormField>

            <FormField
                label={t("zakat.inputs.gold_label")}
                tooltip={t("zakat.inputs.gold_tooltip")}
            >
                <NumberInput
                    value={goldWeight}
                    onValueChange={(val) => setGoldWeight(val.toString())}
                    onKeyPress={handleKeyPress}
                    placeholder="0"
                    min={0}
                    startIcon={<Scale className="h-4 w-4" />}
                />
            </FormField>

            <FormField
                label={t("zakat.inputs.gold_price_label")}
                tooltip={t("zakat.inputs.gold_price_tooltip")}
            >
                <NumberInput
                    value={goldPrice}
                    onValueChange={(val) => setGoldPrice(val.toString())}
                    onKeyPress={handleKeyPress}
                    placeholder="75"
                    min={0}
                    startIcon={<DollarSign className="h-4 w-4" />}
                />
            </FormField>

            <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
            <ErrorDisplay error={error} />
        </div>
    );

    const resultSection = result && showResult ? (
        <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
            <h3 className="text-xl font-bold mb-6 text-center">{t("zakat.result_title")}</h3>

            {!result.isEligible ? (
                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 p-4 rounded-lg text-center flex flex-col items-center justify-center">
                    <AlertTriangle className="w-12 h-12 text-yellow-500 mb-2" />
                    <p className="text-lg font-medium">{t("zakat.results.not_eligible_nisab")}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-card rounded-lg border border-border">
                        <span className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-primary" />
                            {t("zakat.results.wealth_zakat")}
                        </span>
                        <span className="font-bold text-primary">{result.wealthZakat.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-card rounded-lg border border-border">
                        <span className="flex items-center gap-2">
                            <Scale className="w-4 h-4 text-primary" />
                            {t("zakat.results.gold_zakat")}
                        </span>
                        <span className="font-bold text-primary">{result.goldZakat.toFixed(2)}</span>
                    </div>
                    <div className="divider my-4"></div>
                    <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                        <span className="font-bold flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            {t("zakat.results.total_zakat")}
                        </span>
                        <span className="text-2xl font-bold text-primary">{result.totalZakat.toFixed(2)}</span>
                    </div>
                </div>
            )}
        </div>
    ) : null;

    return (
        <CalculatorLayout
            title={t("zakat.page_title")}
            description={t("zakat.page_description")}
            inputSection={inputSection}
            resultSection={resultSection}
        />
    );
}
