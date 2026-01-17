import React, { useState, useId, useCallback } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  width?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  text,
  position = 'top',
  width = 'w-64'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();

  // Show tooltip (for both mouse and keyboard)
  const showTooltip = useCallback(() => setIsVisible(true), []);

  // Hide tooltip (for both mouse and keyboard)
  const hideTooltip = useCallback(() => setIsVisible(false), []);

  // Handle keyboard events for Escape key dismissal
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isVisible) {
      setIsVisible(false);
    }
  }, [isVisible]);

  // Position classes for the tooltip
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full mb-2';
      case 'right':
        return 'left-full ml-2';
      case 'bottom':
        return 'top-full mt-2';
      case 'left':
        return 'right-full mr-2';
      default:
        return 'bottom-full mb-2';
    }
  };

  // Arrow position classes
  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full right-1/2 transform translate-x-1/2 -mt-2 border-t-gray-900 dark:border-t-gray-700';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 -mr-2 border-r-gray-900 dark:border-r-gray-700';
      case 'bottom':
        return 'bottom-full right-1/2 transform translate-x-1/2 -mb-2 border-b-gray-900 dark:border-b-gray-700';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 -ml-2 border-l-gray-900 dark:border-l-gray-700';
      default:
        return 'top-full right-1/2 transform translate-x-1/2 -mt-2 border-t-gray-900 dark:border-t-gray-700';
    }
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        onKeyDown={handleKeyDown}
        aria-describedby={isVisible ? tooltipId : undefined}
        tabIndex={0}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`absolute z-50 ${getPositionClasses()} px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm ${width} dark:bg-gray-700`}
        >
          {text}
          <div className={`tooltip-arrow absolute ${getArrowClasses()} border-4 border-transparent`} />
        </div>
      )}
    </div>
  );
};

export default Tooltip; 