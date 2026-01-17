/**
 * Shared Error Display Component
 * Consolidated from 100+ calculator files (285+ lines saved)
 */

import { WarningIcon } from './icons/CalculatorIcons';

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="text-error mt-4 p-3 bg-error/10 rounded-lg border border-error/20 flex items-center animate-fadeIn w-full">
      <WarningIcon />
      {error}
    </div>
  );
};
