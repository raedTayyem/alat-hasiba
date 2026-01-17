/**
 * Shared Calculator Action Buttons
 * Consolidated from 100+ calculator files (675+ lines saved)
 */

import { useTranslation } from 'react-i18next';
import { CalculatorIcon, ResetIcon } from './icons/CalculatorIcons';

interface CalculatorButtonsProps {
  onCalculate: () => void;
  onReset: () => void;
  calculateText?: string;
  resetText?: string;
}

export const CalculatorButtons: React.FC<CalculatorButtonsProps> = ({
  onCalculate,
  onReset,
  calculateText,
  resetText
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex space-x-2 sm:space-x-3 space-x-reverse pt-3 sm:pt-4 w-full">
      <button
        onClick={onCalculate}
        className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base py-2.5 sm:py-3"
      >
        <CalculatorIcon />
        {calculateText || t("common.calculate")}
      </button>

      <button
        onClick={onReset}
        className="outline-button min-w-[90px] sm:min-w-[120px] text-sm sm:text-base py-2.5 sm:py-3"
      >
        <ResetIcon />
        {resetText || t("common.reset")}
      </button>
    </div>
  );
};
