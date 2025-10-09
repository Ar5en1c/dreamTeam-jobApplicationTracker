import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/types';

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "border-borderMuted bg-surface-2 text-foreground",
        secondary:
          "border-borderMuted bg-surface-subtle text-muted-foreground",
        outline:
          "border-border text-foreground bg-transparent",
        success:
          "border-success-200 bg-success-50 text-success-700 dark:border-success-500/40 dark:bg-success-600/10 dark:text-success-300",
        warning:
          "border-warning-200 bg-warning-50 text-warning-700 dark:border-warning-500/40 dark:bg-warning-600/10 dark:text-warning-300",
        info:
          "border-info-200 bg-info-50 text-info-700 dark:border-info-500/40 dark:bg-info-600/10 dark:text-info-300",
        destructive:
          "border-error-200 bg-error-50 text-error-700 dark:border-error-500/40 dark:bg-error-600/10 dark:text-error-300",
        neutral:
          "border-borderMuted bg-surface-3 text-foreground",
      },
      size: {
        sm: "px-2 py-0.5 text-[11px]",
        default: "px-2.5 py-0.5",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants>,
    ComponentProps {
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, icon, removable, onRemove, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {icon && <span className="flex items-center">{icon}</span>}
        {children}
        {removable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1 rounded-full p-0.5 transition-colors hover:bg-foreground/10"
            aria-label="Remove"
          >
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

// Status Badge component with predefined colors for application statuses
export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'draft' | 'applied' | 'under_review' | 'phone_screen' | 'interview' | 'final_interview' | 'offer' | 'rejected' | 'withdrawn' | 'expired';
}

const statusVariantMap = {
  draft: 'secondary',
  applied: 'info',
  under_review: 'warning',
  phone_screen: 'info',
  interview: 'warning',
  final_interview: 'info',
  offer: 'success',
  rejected: 'destructive',
  withdrawn: 'secondary',
  expired: 'secondary',
} as const;

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status, ...props }, ref) => {
    const variant = statusVariantMap[status] || 'default';
    
    return (
      <Badge
        ref={ref}
        variant={variant as any}
        {...props}
      >
        {status.replace('_', ' ')}
      </Badge>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

export { Badge, StatusBadge, badgeVariants };
