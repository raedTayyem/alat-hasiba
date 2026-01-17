'use client';

import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { Info, Calendar } from 'lucide-react';

export default function HolyWeekInfo() {
  const { t } = useTranslation('calc/date-time');

  const holyDays = [
    { key: 'lazarus_saturday', descKey: 'lazarus_description' },
    { key: 'palm_sunday', descKey: 'palm_description' },
    { key: 'holy_monday', descKey: 'monday_description' },
    { key: 'holy_tuesday', descKey: 'tuesday_description' },
    { key: 'holy_wednesday', descKey: 'wednesday_description' },
    { key: 'holy_thursday', descKey: 'thursday_description' },
    { key: 'good_friday', descKey: 'friday_description' },
    { key: 'holy_saturday', descKey: 'saturday_description' },
  ];

  const inputSection = (
    <div className="space-y-4">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          {t("holy-week-info.overview_title")}
        </h4>
        <p className="text-foreground/80 text-sm md:text-base">
          {t("holy-week-info.overview_description")}
        </p>
      </div>

      <div className="bg-foreground/5 rounded-lg p-4">
        <h4 className="font-semibold mb-2">{t("holy-week-info.week_title")}</h4>
        <p className="text-foreground/80 text-sm md:text-base">
          {t("holy-week-info.week_intro")}
        </p>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold">{t("holy-week-info.week_title")}</h3>
      </div>

      <div className="space-y-3">
        {holyDays.map((day) => (
          <div key={day.key} className="bg-foreground/5 rounded-lg p-4 border border-border">
            <h4 className="font-semibold mb-1 text-primary">
              {t(`holy-week-info.${day.key}`)}
            </h4>
            <p className="text-foreground/80 text-sm md:text-base">
              {t(`holy-week-info.${day.descKey}`)}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6">
        <h4 className="font-semibold mb-2">{t("holy-week-info.differences_title")}</h4>
        <p className="text-foreground/80 text-sm md:text-base">
          {t("holy-week-info.differences_description")}
        </p>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("holy-week-info.title")}
      description={t("holy-week-info.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
