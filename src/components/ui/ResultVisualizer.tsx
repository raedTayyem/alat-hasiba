import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Gauge component for visualizing numeric values with a scale
 */
export const Gauge: React.FC<{
  value: number;
  minValue: number;
  maxValue: number;
  labels?: string[];
  colorRanges?: {min: number; max: number; color: string}[];
  title?: string;
  unit?: string;
}> = ({ 
  value, 
  minValue, 
  maxValue, 
  labels = [], 
  colorRanges = [],
  title,
  unit
}) => {
  // Calculate percentage for the gauge
  const percentage = Math.min(100, Math.max(0, ((value - minValue) / (maxValue - minValue)) * 100));
  
  // Determine the color based on the ranges
  const getColor = () => {
    if (colorRanges.length === 0) return 'bg-primary';
    
    const matchingRange = colorRanges.find(range => 
      value >= range.min && value <= range.max
    );
    
    return matchingRange ? matchingRange.color : 'bg-primary';
  };

  return (
    <div className="w-full">
      {title && <div className="text-sm font-medium mb-2 text-center">{title}</div>}
      <div className="relative h-8 bg-foreground/10 rounded-full overflow-hidden">
        <div 
          className={`absolute top-0 left-0 h-full ${getColor()} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-sm font-bold">
          {value.toFixed(1)}{unit && ` ${unit}`}
        </div>
      </div>
      
      {labels.length > 0 && (
        <div className="flex justify-between mt-1 text-xs text-foreground/70">
          {labels.map((label, index) => (
            <div key={index}>{label}</div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Comparison component to visualize before/after or target/current values
 */
export const Comparison: React.FC<{
  current: number;
  target: number | {min: number; max: number};
  title?: string;
  unit?: string;
  type?: 'single' | 'range';
}> = ({
  current,
  target,
  title,
  unit,
  type = 'single'
}) => {
  const { t } = useTranslation('calculators');

  // Determine if the current value is within target range
  const isWithinTarget = () => {
    if (type === 'single') {
      return current === (target as number);
    } else {
      const { min, max } = target as {min: number; max: number};
      return current >= min && current <= max;
    }
  };

  return (
    <div className="p-4 bg-foreground/5 rounded-lg border border-foreground/10">
      {title && <div className="text-sm font-medium mb-2">{title}</div>}
      
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-foreground/70">{t('shared.results.currentValue')}</div>
          <div className="text-lg font-bold">{current}{unit && ` ${unit}`}</div>
        </div>
        
        {type === 'single' ? (
          <div className="text-left">
            <div className="text-xs text-foreground/70">{t('shared.results.targetValue')}</div>
            <div className="text-lg font-bold">{target as number}{unit && ` ${unit}`}</div>
          </div>
        ) : (
          <div className="text-left">
            <div className="text-xs text-foreground/70">{t('shared.results.targetRange')}</div>
            <div className="text-lg font-bold">
              {(target as {min: number; max: number}).min}{unit && ` ${unit}`} - {(target as {min: number; max: number}).max}{unit && ` ${unit}`}
            </div>
          </div>
        )}
      </div>
      
      <div className={`mt-2 text-sm ${isWithinTarget() ? 'text-success' : 'text-warning'}`}>
        {isWithinTarget() 
          ? t('shared.results.withinRange')
          : type === 'single' 
            ? t('shared.results.outsideTarget')
            : t('shared.results.outsideRange')
        }
      </div>
    </div>
  );
};

/**
 * ResultCard component for displaying calculation results with description
 */
export const ResultCard: React.FC<{
  title: string;
  value: string | number;
  description?: string;
  color?: string;
  borderColor?: string;
  icon?: React.ReactNode;
}> = ({
  title,
  value,
  description,
  color = 'bg-foreground/5',
  borderColor = 'border-foreground/10',
  icon
}) => {
  return (
    <div className={`p-4 rounded-lg border ${color} ${borderColor}`}>
      <div className="flex items-center mb-2">
        {icon && <div className="mr-2">{icon}</div>}
        <div className="text-sm font-medium">{title}</div>
      </div>
      
      <div className="text-xl font-bold mb-1">{value}</div>
      
      {description && (
        <div className="text-sm text-foreground/70">{description}</div>
      )}
    </div>
  );
};

/**
 * ComparisonList component to show a list of comparison options
 */
export const ComparisonList: React.FC<{
  title?: string;
  items: { 
    label: string; 
    value: string; 
    color: string;
  }[];
}> = ({
  title,
  items
}) => {
  return (
    <div className="p-4 bg-foreground/5 rounded-lg border border-foreground/10">
      {title && <div className="text-sm font-medium mb-2">{title}</div>}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className={`p-3 rounded-lg ${item.color}`}>
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">{item.label}</div>
              <div className="text-base font-bold">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * BodyShape component for visualizing body measurements
 */
export const BodyShape: React.FC<{
  gender: 'male' | 'female';
  highlights?: {
    part: 'waist' | 'chest' | 'hips' | 'neck' | 'arms' | 'thighs';
    color: string;
  }[];
  width?: number;
  height?: number;
}> = ({
  gender,
  highlights = [],
  width = 150,
  height = 300
}) => {
  return (
    <div className="flex justify-center">
      <svg width={width} height={height} viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Base body shape */}
        <path 
          d={gender === 'male' 
            ? "M50,30 C60,30 65,25 65,15 C65,5 57.5,0 50,0 C42.5,0 35,5 35,15 C35,25 40,30 50,30 Z M35,35 C25,40 20,50 20,60 C20,70 25,90 30,100 C35,110 35,130 35,150 C35,170 30,200 30,200 L40,200 C40,200 40,180 42.5,160 C45,140 45,140 50,140 C55,140 55,140 57.5,160 C60,180 60,200 60,200 L70,200 C70,200 65,170 65,150 C65,130 65,110 70,100 C75,90 80,70 80,60 C80,50 75,40 65,35 L65,50 C65,55 55,60 50,60 C45,60 35,55 35,50 Z"
            : "M50,30 C60,30 65,25 65,15 C65,5 57.5,0 50,0 C42.5,0 35,5 35,15 C35,25 40,30 50,30 Z M35,35 C25,40 20,50 20,60 C20,70 25,90 25,95 C25,100 30,110 30,115 C30,120 25,130 25,150 C25,170 25,200 25,200 L35,200 C35,200 35,180 37.5,160 C40,140 42.5,140 50,140 C57.5,140 60,140 62.5,160 C65,180 65,200 65,200 L75,200 C75,200 75,170 75,150 C75,130 70,120 70,115 C70,110 75,100 75,95 C75,90 80,70 80,60 C80,50 75,40 65,35 L65,50 C65,55 60,65 50,65 C40,65 35,55 35,50 Z"
          } 
          fill="#DEE4EA"
        />
        
        {/* Highlight specific parts based on the highlights prop */}
        {highlights.map((highlight, index) => {
          let path = "";
          
          switch(highlight.part) {
            case 'neck':
              path = gender === 'male'
                ? "M50,30 C60,30 65,25 65,15 C65,12 64,10 62,7 C58,3 54,0 50,0 C46,0 42,3 38,7 C36,10 35,12 35,15 C35,25 40,30 50,30 Z"
                : "M50,30 C60,30 65,25 65,15 C65,12 64,10 62,7 C58,3 54,0 50,0 C46,0 42,3 38,7 C36,10 35,12 35,15 C35,25 40,30 50,30 Z";
              break;
            case 'chest':
              path = gender === 'male'
                ? "M35,35 C25,40 20,50 20,60 C20,65 22,75 25,83 L75,83 C78,75 80,65 80,60 C80,50 75,40 65,35 L65,50 C65,55 55,60 50,60 C45,60 35,55 35,50 Z"
                : "M35,35 C25,40 20,50 20,60 C20,65 22,75 25,85 L75,85 C78,75 80,65 80,60 C80,50 75,40 65,35 L65,50 C65,55 60,65 50,65 C40,65 35,55 35,50 Z";
              break;
            case 'waist':
              path = gender === 'male'
                ? "M30,100 L70,100 C75,90 80,70 80,60 C75,83 25,83 20,60 C20,70 25,90 30,100 Z"
                : "M25,95 L75,95 C75,90 80,70 80,60 C75,87 25,87 20,60 C20,70 25,90 25,95 Z";
              break;
            case 'hips':
              path = gender === 'male'
                ? "M30,100 C35,110 35,120 35,130 L65,130 C65,120 65,110 70,100 L30,100 Z"
                : "M25,95 C25,100 30,110 30,115 C30,120 27,130 27,135 L73,135 C73,130 70,120 70,115 C70,110 75,100 75,95 L25,95 Z";
              break;
            case 'arms':
              path = gender === 'male'
                ? "M20,60 C15,65 10,90 15,110 L25,110 C25,90 28,83 30,83 L30,70 C25,65 23,62 20,60 Z M80,60 C85,65 90,90 85,110 L75,110 C75,90 72,83 70,83 L70,70 C75,65 77,62 80,60 Z"
                : "M20,60 C15,65 10,90 15,110 L25,110 C25,90 28,87 30,87 L30,70 C25,65 23,62 20,60 Z M80,60 C85,65 90,90 85,110 L75,110 C75,90 72,87 70,87 L70,70 C75,65 77,62 80,60 Z";
              break;
            case 'thighs':
              path = gender === 'male'
                ? "M35,150 C35,170 30,200 30,200 L40,200 C40,200 40,180 42.5,160 C45,140 45,140 50,140 C55,140 55,140 57.5,160 C60,180 60,200 60,200 L70,200 C70,200 65,170 65,150 L35,150 Z"
                : "M25,150 C25,170 25,200 25,200 L35,200 C35,200 35,180 37.5,160 C40,140 42.5,140 50,140 C57.5,140 60,140 62.5,160 C65,180 65,200 65,200 L75,200 C75,200 75,170 75,150 L25,150 Z";
              break;
            default:
              break;
          }
          
          return path ? (
            <path 
              key={index}
              d={path}
              fill={highlight.color}
            />
          ) : null;
        })}
      </svg>
    </div>
  );
};

/**
 * Progress component for showing progress over time
 */
export const Progress: React.FC<{
  data: {date: string; value: number}[];
  title?: string;
  unit?: string;
  targetValue?: number;
  minValue?: number;
  maxValue?: number;
}> = ({
  data,
  title,
  unit,
  targetValue,
  minValue = 0,
  maxValue = 100
}) => {
  // Find min/max for scaling
  const dataMin = Math.min(...data.map(d => d.value), minValue);
  const dataMax = Math.max(...data.map(d => d.value), maxValue);
  const range = dataMax - dataMin;
  
  // Calculate positions for the chart
  const getYPosition = (value: number) => {
    return 80 - ((value - dataMin) / (range || 1)) * 60;
  };
  
  // Format a value with its unit if provided
  const formatValue = (value: number) => {
    return unit ? `${value} ${unit}` : `${value}`;
  };
  
  return (
    <div>
      {title && <div className="text-sm font-medium mb-2">{title}</div>}
      
      <div className="w-full h-32 bg-foreground/5 rounded-lg border border-foreground/10 p-4">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="20" x2="100" y2="20" stroke="#E5E7EB" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#E5E7EB" strokeWidth="0.5" />
          <line x1="0" y1="80" x2="100" y2="80" stroke="#E5E7EB" strokeWidth="0.5" />
          
          {/* Target line if provided */}
          {targetValue !== undefined && (
            <line 
              x1="0" 
              y1={getYPosition(targetValue)} 
              x2="100" 
              y2={getYPosition(targetValue)} 
              stroke="#34D399" 
              strokeWidth="1" 
              strokeDasharray="2,2" 
            />
          )}
          
          {/* Data line */}
          {data.length > 1 && (
            <polyline
              points={data.map((d, i) => `${(i / (data.length - 1)) * 100},${getYPosition(d.value)}`).join(' ')}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
            />
          )}
          
          {/* Data points */}
          {data.map((d, i) => (
            <circle
              key={i}
              cx={(i / (data.length - 1 || 1)) * 100}
              cy={getYPosition(d.value)}
              r="2"
              fill="#3B82F6"
              // Add tooltip with value and unit
              data-tooltip={formatValue(d.value)}
            />
          ))}
        </svg>
      </div>
      
      {data.length > 0 && (
        <div className="flex justify-between mt-1 text-xs text-foreground/70">
          {data.map((d, i) => (
            <div key={i}>{d.date}</div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * UnitSelector component for switching between different measurement units
 */
export const UnitSelector: React.FC<{
  units: {value: string; label: string}[];
  selectedUnit: string;
  onChange: (unit: string) => void;
}> = ({
  units,
  selectedUnit,
  onChange
}) => {
  return (
    <div className="flex space-x-1 rounded-md p-1 bg-foreground/5 text-sm">
      {units.map(unit => (
        <button
          key={unit.value}
          className={`px-3 py-1 rounded-md transition-colors ${
            selectedUnit === unit.value
              ? 'bg-primary text-white'
              : 'hover:bg-foreground/10'
          }`}
          onClick={() => onChange(unit.value)}
        >
          {unit.label}
        </button>
      ))}
    </div>
  );
}; 