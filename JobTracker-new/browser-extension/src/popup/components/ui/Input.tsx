import React from 'react';

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, description, icon, error, className, type = 'text', disabled, ...props }, ref) => {
    const baseClasses =
      'w-full rounded-xl border bg-card/90 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 focus-visible:border-primary-500 focus-visible:shadow-[0_12px_30px_-15px_rgba(99,102,241,0.8)] disabled:cursor-not-allowed disabled:opacity-50';

    return (
      <label className="block space-y-2 text-left">
        {label && (
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </span>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/70">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            className={cx(
              baseClasses,
              icon && 'pl-11',
              error
                ? 'border-error-500/70 bg-error-500/5 focus-visible:ring-error-500/30 focus-visible:border-error-500'
                : 'border-border/70',
              className
            )}
            disabled={disabled}
            {...props}
          />
          {error && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-error-500">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          )}
        </div>
        {description && !error && (
          <span className="block text-xs text-muted-foreground/80 leading-relaxed">{description}</span>
        )}
        {error && <span className="block text-xs font-medium text-error-500 leading-relaxed">{error}</span>}
      </label>
    );
  }
);

Input.displayName = 'Input';

export default Input;
