'use client';

import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { Calendar, Info, BookOpen } from '@/utils/icons';

// Hebrew month data for the table
const hebrewMonths = [
  { num: 1, hebrew: 'תִּשְׁרִי', days: '30' },
  { num: 2, hebrew: 'חֶשְׁוָן', days: '29/30' },
  { num: 3, hebrew: 'כִּסְלֵו', days: '29/30' },
  { num: 4, hebrew: 'טֵבֵת', days: '29' },
  { num: 5, hebrew: 'שְׁבָט', days: '30' },
  { num: 6, hebrew: 'אֲדָר', days: '29/30' },
  { num: 7, hebrew: 'אֲדָר ב׳', days: '29', isLeapMonth: true },
  { num: 8, hebrew: 'נִיסָן', days: '30' },
  { num: 9, hebrew: 'אִיָּר', days: '29' },
  { num: 10, hebrew: 'סִיוָן', days: '30' },
  { num: 11, hebrew: 'תַּמּוּז', days: '29' },
  { num: 12, hebrew: 'אָב', days: '30' },
  { num: 13, hebrew: 'אֱלוּל', days: '29' },
];

export default function HebrewCalendarInfo() {
  const { t } = useTranslation('calc/date-time');

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("hebrew_calendar_info.title")}
      </div>

      <div className="space-y-6">
        {/* Overview Section */}
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-3">
            <Calendar className="w-5 h-5 text-primary ml-2" />
            <h4 className="font-semibold">{t("hebrew_calendar_info.overview_title")}</h4>
          </div>
          <p className="text-foreground/80 text-sm md:text-base">
            {t("hebrew_calendar_info.overview_point")}
          </p>
        </div>

        {/* Months Table */}
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-3">
            <BookOpen className="w-5 h-5 text-primary ml-2" />
            <h4 className="font-semibold">{t("hebrew_calendar_info.months_title")}</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-border px-4 py-2 bg-muted/50 text-sm">{t("hebrew_calendar_info.table.month")}</th>
                  <th className="border border-border px-4 py-2 bg-muted/50 text-sm">{t("hebrew_calendar_info.table.name")}</th>
                  <th className="border border-border px-4 py-2 bg-muted/50 text-sm">{t("hebrew_calendar_info.table.hebrew")}</th>
                  <th className="border border-border px-4 py-2 bg-muted/50 text-sm">{t("hebrew_calendar_info.table.days")}</th>
                </tr>
              </thead>
              <tbody>
                {hebrewMonths.map((month) => (
                  <tr key={month.num} className="hover:bg-muted/30 transition-colors">
                    <td className="border border-border px-4 py-2 text-center">
                      {month.isLeapMonth ? `${month.num}*` : month.num}
                    </td>
                    <td className="border border-border px-4 py-2">
                      {t(`hebrew_calendar_info.months.${month.num}.name`)}
                    </td>
                    <td className="border border-border px-4 py-2 text-center" dir="rtl">
                      {month.hebrew}
                    </td>
                    <td className="border border-border px-4 py-2 text-center">{month.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-muted-foreground mt-3 flex items-center">
            <Info className="w-4 h-4 ml-1" />
            {t("hebrew_calendar_info.leap_note")}
          </div>
        </div>
      </div>
    </>
  );

  const resultSection = (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm">
      <div className="space-y-6">
        {/* Year/Month/Day Info */}
        <div>
          <div className="flex items-center mb-3">
            <Calendar className="w-5 h-5 text-primary ml-2" />
            <h4 className="font-semibold">{t("hebrew_calendar_info.year_month_day")}</h4>
          </div>
          <p className="text-foreground/80 text-sm md:text-base">
            {t("hebrew_calendar_info.year_month_day_desc")}
          </p>
        </div>

        <div className="divider"></div>

        {/* Religious Significance */}
        <div>
          <div className="flex items-center mb-3">
            <BookOpen className="w-5 h-5 text-primary ml-2" />
            <h4 className="font-semibold">{t("hebrew_calendar_info.religious_title")}</h4>
          </div>
          <p className="text-foreground/80 text-sm md:text-base">
            {t("hebrew_calendar_info.religious_desc")}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("hebrew_calendar_info.title")}
      description={t("hebrew_calendar_info.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
