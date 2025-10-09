import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/types';

const textareaVariants = cva(
  'flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none',
  {
    variants: {
      variant: {
        default: '',
        error: 'border-red-500 focus-visible:ring-red-500',
        success: 'border-green-500 focus-visible:ring-green-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants>,
    ComponentProps {
  label?: string;
  description?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      label,
      description,
      error,
      disabled,
      ...props
    },
    ref
  ) => {
    const textareaVariant = error ? 'error' : variant;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          className={cn(textareaVariants({ variant: textareaVariant, className }))}
          ref={ref}
          disabled={disabled}
          {...props}
        />

        {description && !error && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}

        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
