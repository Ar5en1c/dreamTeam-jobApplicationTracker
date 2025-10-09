import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/types';

const inputVariants = cva(
  'flex w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-base group',
  {
    variants: {
      variant: {
        default:
          'border-border bg-card hover:border-primary-300 focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/20 focus-visible:shadow-md dark:hover:border-primary-600 dark:focus-visible:border-primary-400 dark:focus-visible:ring-primary-400/20',
        error:
          'border-error-500 bg-error-50/50 focus-visible:border-error-600 focus-visible:ring-2 focus-visible:ring-error-500/20 dark:bg-error-950/20 dark:border-error-600',
        success:
          'border-success-500 bg-success-50/50 focus-visible:border-success-600 focus-visible:ring-2 focus-visible:ring-success-500/20 dark:bg-success-950/20 dark:border-success-600',
        ghost:
          'border-transparent bg-transparent hover:bg-primary-50 dark:hover:bg-primary-950/20',
        premium:
          'border-primary-200 bg-gradient-to-br from-white via-primary-50/30 to-white dark:from-slate-900 dark:via-primary-950/20 dark:to-slate-900 dark:border-primary-800/50 shadow-sm hover:shadow-md focus-visible:shadow-glow focus-visible:border-primary-400 dark:focus-visible:border-primary-500',
        glass:
          'glass-effect border-white/10 dark:border-white/5 backdrop-blur-xl shadow-md focus-visible:border-primary-400 focus-visible:shadow-glow',
      },
      inputSize: {
        sm: 'h-8 px-2 py-1 text-xs rounded-md',
        default: 'h-11 px-4 text-base',
        lg: 'h-12 px-4 py-3 text-base',
        xl: 'h-14 px-5 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants>,
    ComponentProps {
  label?: string;
  description?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  inputSize?: VariantProps<typeof inputVariants>['inputSize'];
  floatingLabel?: boolean;
  success?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant,
      inputSize,
      label,
      description,
      error,
      leftIcon,
      rightIcon,
      loading,
      disabled,
      floatingLabel = false,
      success = false,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue);

    const inputVariant = error ? 'error' : success ? 'success' : variant;
    const isDisabled = disabled || loading;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      props.onBlur?.(e);
    };

    return (
      <div className="space-y-2 w-full">
        <div className="relative">
          {/* Floating Label */}
          {label && floatingLabel && (
            <label
              htmlFor={props.id || props.name}
              className={cn(
                'absolute left-4 transition-all duration-base pointer-events-none',
                'text-muted-foreground font-medium',
                isFocused || hasValue
                  ? 'top-0 -translate-y-1/2 text-xs bg-card px-2 text-primary-600 dark:text-primary-400'
                  : 'top-1/2 -translate-y-1/2 text-sm',
                leftIcon && !isFocused && !hasValue && 'left-11',
                isDisabled && 'opacity-50'
              )}
            >
              {label}
              {props.required && <span className="text-error-500 ml-1">*</span>}
            </label>
          )}

          {/* Regular Label */}
          {label && !floatingLabel && (
            <label
              htmlFor={props.id || props.name}
              className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground block mb-2"
            >
              {label}
              {props.required && <span className="text-error-500 ml-1">*</span>}
            </label>
          )}

          <div className="relative group">
            {/* Left Icon */}
            {leftIcon && (
              <div className={cn(
                'absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-base',
                isFocused ? 'text-primary-500' : 'text-muted-foreground',
                isDisabled && 'opacity-50'
              )}>
                {leftIcon}
              </div>
            )}

            {/* Input Field */}
            <input
              type={type}
              className={cn(
                inputVariants({ variant: inputVariant, inputSize, className }),
                leftIcon && 'pl-10',
                (rightIcon || loading || success) && 'pr-10',
                floatingLabel && 'placeholder-transparent'
              )}
              ref={ref}
              disabled={isDisabled}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
            />

            {/* Loading Spinner */}
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
              </div>
            )}

            {/* Success Icon */}
            {!loading && success && !rightIcon && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-success-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            {/* Right Icon */}
            {!loading && !success && rightIcon && (
              <div className={cn(
                'absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-base',
                isFocused ? 'text-primary-500' : 'text-muted-foreground',
                isDisabled && 'opacity-50'
              )}>
                {rightIcon}
              </div>
            )}

            {/* Error Icon */}
            {error && !loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-error-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {description && !error && (
          <p className="text-xs text-muted-foreground pl-1">{description}</p>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-xs text-error-500 font-medium pl-1 flex items-center gap-1">
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };