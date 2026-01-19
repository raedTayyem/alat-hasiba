'use client';

import { Heir } from './types';
import { Button } from "@/components/ui/button";
import { Copy } from "@/utils/icons";
import { useTranslation } from 'react-i18next';

interface ResultsDisplayProps {
  heirs: Heir[];
  estateValue: number;
  onCopy: () => void;
}

export default function ResultsDisplay({ heirs, estateValue, onCopy }: ResultsDisplayProps) {
  const { t } = useTranslation('calc/finance');

  // Get selected heirs with shares
  const selectedHeirs = heirs.filter(heir => heir.selected && heir.share !== null);

  // Calculate total shares
  const totalShares = selectedHeirs.reduce((sum, heir) => sum + (heir.share || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">{t("inheritance-calculator.results_title")}</h3>
        <Button variant="outline" size="sm" onClick={onCopy}>
          <Copy className="h-4 w-4 ml-2" />
          {t("common:common.copy")}
        </Button>
      </div>

      <div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-foreground/5">
              <th className="p-2 text-right">{t("inheritance-calculator.table.heir")}</th>
              <th className="p-2 text-right">{t("inheritance-calculator.table.count")}</th>
              <th className="p-2 text-right">{t("inheritance-calculator.table.share")}</th>
              <th className="p-2 text-right">{t("common:common.percentage")}</th>
              <th className="p-2 text-right">{t("inheritance-calculator.table.amount")}</th>
            </tr>
          </thead>
          <tbody>
            {selectedHeirs.map((heir) => (
              <tr key={heir.id} className="border-b border-border">
                <td className="p-2">{t(heir.nameKey)}</td>
                <td className="p-2">{heir.count}</td>
                <td className="p-2">{t(heir.shareTextKey)}</td>
                <td className="p-2">{(heir.share! * 100).toFixed(2)}%</td>
                <td className="p-2">{(heir.share! * estateValue).toLocaleString()}</td>
              </tr>
            ))}
            <tr className="bg-foreground/5 font-bold">
              <td className="p-2">{t("common:common.total")}</td>
              <td className="p-2"></td>
              <td className="p-2"></td>
              <td className="p-2">{(totalShares * 100).toFixed(2)}%</td>
              <td className="p-2">{(totalShares * estateValue).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {totalShares < 1 && totalShares > 0 && (
        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-md mt-4">
          <p className="font-medium">{t("common:common.warning")}</p>
          <p className="text-sm">{t("inheritance-calculator.info.point5")}</p>
        </div>
      )}

      {totalShares > 1 && (
        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-md mt-4">
          <p className="font-medium">{t("common:common.warning")}</p>
          <p className="text-sm">{t("inheritance-calculator.info.point5")}</p>
        </div>
      )}
    </div>
  );
} 

