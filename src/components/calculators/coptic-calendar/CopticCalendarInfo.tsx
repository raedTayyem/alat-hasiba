'use client';

import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { useTranslation } from 'react-i18next';
import { Info, Calendar } from '@/utils/icons';

export default function CopticCalendarInfo() {
  const { t } = useTranslation('calc/date-time');

  const inputSection = (
    <div className="space-y-4">
      <div className="calculator-section-title">{t("coptic_calendar_info.title")}</div>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            {t("coptic_calendar_info.overview_title")}
          </h4>
          <p className="text-foreground/80 text-sm md:text-base">
            {t("coptic_calendar_info.overview_point")}
          </p>
        </div>

        <div className="bg-foreground/5 rounded-lg p-4">
          <h4 className="font-semibold mb-2">{t("coptic_calendar_info.leap_title")}</h4>
          <p className="text-foreground/80 text-sm md:text-base">
            {t("coptic_calendar_info.leap_note")}
          </p>
        </div>

        <div className="bg-foreground/5 rounded-lg p-4">
          <h4 className="font-semibold mb-2">{t("coptic_calendar_info.accuracy_title")}</h4>
          <p className="text-foreground/80 text-sm md:text-base">
            {t("coptic_calendar_info.accuracy_desc")}
          </p>
        </div>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold">{t("coptic_calendar_info.months_title")}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-border px-4 py-2 bg-foreground/5 text-sm font-semibold">
                {t("coptic_calendar_info.table.month")}
              </th>
              <th className="border border-border px-4 py-2 bg-foreground/5 text-sm font-semibold">
                {t("coptic_calendar_info.table.name")}
              </th>
              <th className="border border-border px-4 py-2 bg-foreground/5 text-sm font-semibold">
                {t("coptic_calendar_info.table.start")}
              </th>
              <th className="border border-border px-4 py-2 bg-foreground/5 text-sm font-semibold">
                {t("coptic_calendar_info.table.end")}
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((monthNum) => (
              <tr key={monthNum} className={monthNum % 2 === 0 ? 'bg-foreground/5' : ''}>
                <td className="border border-border px-4 py-2 text-center font-medium">
                  {monthNum}
                </td>
                <td className="border border-border px-4 py-2">
                  {t(`coptic_calendar_info.months.${monthNum}.name`)}
                </td>
                <td className="border border-border px-4 py-2 text-center">
                  {t(`coptic_calendar_info.months.${monthNum}.start`)}
                </td>
                <td className="border border-border px-4 py-2 text-center">
                  {t(`coptic_calendar_info.months.${monthNum}.end`)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("coptic_calendar_info.title")}
      description={t("coptic_calendar_info.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
