import * as React from "react"

import { cn } from "@/lib/utils"

export interface SliderProps {
  className?: string;
  value?: number[];
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number[]) => void;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps & Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'value' | 'onChange'>>(
  ({ className, value, defaultValue, min = 0, max = 100, step = 1, onValueChange, ...props }, ref) => {
    const [sliderValue, setSliderValue] = React.useState<number[]>(value || defaultValue || [0]);
    
    React.useEffect(() => {
      if (value !== undefined) {
        setSliderValue(value);
      }
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [parseFloat(event.target.value)];
      setSliderValue(newValue);
      if (onValueChange) {
        onValueChange(newValue);
      }
    };

    return (
      <div 
        ref={ref} 
        className={cn("relative flex w-full touch-none select-none items-center", className)}
        {...props}
      >
        <input
          type="range"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          min={min}
          max={max}
          step={step}
          value={sliderValue[0]}
          onChange={handleChange}
        />
        <div 
          className="absolute h-2 bg-primary rounded-lg" 
          style={{ 
            width: `${((sliderValue[0] - min) / (max - min)) * 100}%`,
            left: 0
          }}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider } 