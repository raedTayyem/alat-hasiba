import React, { useId } from 'react';
import { Label } from '@/components/ui/label';
import Tooltip from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';
import { Info } from '@/utils/icons';

export interface FormFieldProps {
  label?: string;
  children: React.ReactNode;
  tooltip?: string;
  error?: string;
  className?: string;
  id?: string;
  description?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  tooltip,
  error,
  className,
  id,
  description,
  required,
}) => {
  const generatedId = useId();
  const errorId = `${id || generatedId}-error`;
  const descriptionId = `${id || generatedId}-description`;

  // Clone children to add accessibility attributes
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const accessibilityProps: Record<string, unknown> = {};

      // Link input with error message
      if (error) {
        accessibilityProps['aria-describedby'] = errorId;
        accessibilityProps['aria-invalid'] = true;
      } else if (description) {
        accessibilityProps['aria-describedby'] = descriptionId;
      }

      // Add required attribute
      if (required) {
        accessibilityProps['aria-required'] = true;
      }

      return React.cloneElement(child, accessibilityProps);
    }
    return child;
  });

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor={id} className={cn(error && "text-error")}>
              {label}
              {required && <span className="text-error ms-1" aria-hidden="true">*</span>}
            </Label>
            {tooltip && (
              <Tooltip text={tooltip}>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </Tooltip>
            )}
          </div>
        </div>
      )}

      {enhancedChildren}

      {description && !error && (
        <p id={descriptionId} className="text-sm text-muted-foreground">{description}</p>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-sm font-medium text-error animate-in slide-in-from-top-1 fade-in-50">
          {error}
        </p>
      )}
    </div>
  );
};
