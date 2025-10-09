import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/types';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-transparent font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-1)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-primary-600)] text-white shadow-level-1 hover:bg-[var(--color-primary-500)] active:bg-[var(--color-primary-700)] focus-visible:ring-[var(--color-primary-400)]",
        primary:
          "bg-[var(--color-primary-600)] text-white shadow-level-1 hover:bg-[var(--color-primary-500)] active:bg-[var(--color-primary-700)] focus-visible:ring-[var(--color-primary-400)]",
        secondary:
          "bg-[var(--surface-2)] text-[var(--text-primary)] border-[var(--border-muted)] shadow-level-1 hover:bg-[var(--surface-3)] active:bg-[var(--surface-2)] focus-visible:ring-[var(--border-contrast)]",
        subtle:
          "bg-[var(--surface-subtle)] text-[var(--text-primary)] border-[var(--border-muted)] hover:border-[var(--border-contrast)] hover:bg-[var(--surface-2)] focus-visible:ring-[var(--border-contrast)]",
        outline:
          "bg-transparent text-[var(--text-primary)] border-[var(--border-muted)] hover:border-[var(--color-primary-400)] hover:text-[var(--color-primary-600)] hover:bg-[color-mix(in srgb,var(--color-primary-100)_12%,transparent)] focus-visible:ring-[var(--color-primary-400)]",
        ghost:
          "bg-transparent text-muted-foreground hover:text-foreground hover:bg-[color-mix(in srgb,var(--color-primary-100)_12%,transparent)] focus-visible:ring-[var(--color-primary-300)]",
        link:
          "bg-transparent border-transparent text-[var(--color-primary-600)] underline-offset-4 hover:text-[var(--color-primary-500)] hover:underline focus-visible:ring-offset-0 focus-visible:ring-[color-mix(in srgb,var(--color-primary-400)_60%,transparent)]",
        destructive:
          "bg-[var(--color-error-600)] text-white shadow-level-1 hover:bg-[var(--color-error-500)] active:bg-[var(--color-error-700)] focus-visible:ring-[var(--color-error-400)]",
        success:
          "bg-[var(--color-success-600)] text-white shadow-level-1 hover:bg-[var(--color-success-500)] active:bg-[var(--color-success-700)] focus-visible:ring-[var(--color-success-400)]",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        default: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-base",
        xl: "h-12 px-8 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-9 w-9",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants>,
    ComponentProps {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            data-testid="loading-spinner"
            className="h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && (
          <span className="flex items-center justify-center text-current shrink-0">
            {leftIcon}
          </span>
        )}
        <span className="inline-flex items-center gap-2 leading-tight text-inherit">
          {children}
        </span>
        {!loading && rightIcon && (
          <span className="flex items-center justify-center text-current shrink-0">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
