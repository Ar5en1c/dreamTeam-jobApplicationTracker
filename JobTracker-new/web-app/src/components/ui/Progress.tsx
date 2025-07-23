import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/types';

const progressVariants = cva(
  'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
  {
    variants: {
      size: {
        sm: 'h-2',
        default: 'h-4',
        lg: 'h-6',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const progressIndicatorVariants = cva(
  'h-full w-full flex-1 bg-primary transition-all duration-500 ease-in-out',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500',
        gradient: 'bg-gradient-to-r from-blue-500 to-purple-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants>,
    ComponentProps {
  value?: number;
  max?: number;
  variant?: VariantProps<typeof progressIndicatorVariants>['variant'];
  showValue?: boolean;
  label?: string;
  animated?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      variant = 'default',
      size,
      showValue = false,
      label,
      animated = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div className="space-y-2">
        {(label || showValue) && (
          <div className="flex justify-between text-sm">
            {label && <span className="font-medium">{label}</span>}
            {showValue && (
              <span className="text-muted-foreground">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        
        <div
          ref={ref}
          className={cn(progressVariants({ size, className }))}
          {...props}
        >
          <div
            className={cn(
              progressIndicatorVariants({ variant }),
              animated && 'animate-pulse'
            )}
            style={{
              transform: `translateX(-${100 - percentage}%)`,
            }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

// Circular Progress component
export interface CircularProgressProps extends ComponentProps {
  value?: number;
  max?: number;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showValue?: boolean;
  label?: string;
  strokeWidth?: number;
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      size = 'default',
      variant = 'default',
      showValue = false,
      label,
      strokeWidth,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const sizeClasses = {
      sm: 'w-12 h-12',
      default: 'w-16 h-16',
      lg: 'w-20 h-20',
      xl: 'w-24 h-24',
    };

    const strokeWidthMap = {
      sm: 2,
      default: 3,
      lg: 4,
      xl: 5,
    };

    const actualStrokeWidth = strokeWidth || strokeWidthMap[size];
    const radius = (48 - actualStrokeWidth) / 2; // 48 is half of the default viewBox
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const colorClasses = {
      default: 'text-primary',
      success: 'text-green-500',
      warning: 'text-yellow-500',
      error: 'text-red-500',
    };

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex items-center justify-center', className)}
        {...props}
      >
        <svg
          className={cn(sizeClasses[size], 'transform -rotate-90')}
          viewBox="0 0 96 96"
        >
          {/* Background circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth={actualStrokeWidth}
            fill="none"
            className="text-muted/20"
          />
          
          {/* Progress circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth={actualStrokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn(colorClasses[variant], 'transition-all duration-500 ease-in-out')}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showValue && (
            <span className="text-sm font-medium">{Math.round(percentage)}%</span>
          )}
          {label && (
            <span className="text-xs text-muted-foreground text-center">{label}</span>
          )}
        </div>
      </div>
    );
  }
);

CircularProgress.displayName = 'CircularProgress';

// Stacked Progress component for multiple values
export interface StackedProgressProps extends ComponentProps {
  segments: Array<{
    value: number;
    color?: string;
    label?: string;
  }>;
  max?: number;
  size?: VariantProps<typeof progressVariants>['size'];
  showLabels?: boolean;
}

const StackedProgress = React.forwardRef<HTMLDivElement, StackedProgressProps>(
  ({ className, segments, max = 100, size, showLabels = false, ...props }, ref) => {
    const normalizedSegments = segments.map(segment => ({
      ...segment,
      percentage: (segment.value / max) * 100,
    }));

    return (
      <div className="space-y-2">
        {showLabels && (
          <div className="flex flex-wrap gap-2 text-xs">
            {segments.map((segment, index) => (
              <div key={index} className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: segment.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)` }}
                />
                <span>{segment.label || `Segment ${index + 1}`}</span>
                <span className="text-muted-foreground">({segment.value})</span>
              </div>
            ))}
          </div>
        )}
        
        <div
          ref={ref}
          className={cn(progressVariants({ size, className }))}
          {...props}
        >
          <div className="flex h-full">
            {normalizedSegments.map((segment, index) => (
              <div
                key={index}
                className="h-full transition-all duration-500 ease-in-out first:rounded-l-full last:rounded-r-full"
                style={{
                  width: `${segment.percentage}%`,
                  backgroundColor: segment.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

StackedProgress.displayName = 'StackedProgress';

export { Progress, CircularProgress, StackedProgress, progressVariants };