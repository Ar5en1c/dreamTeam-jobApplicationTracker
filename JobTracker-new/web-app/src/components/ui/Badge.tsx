import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/types';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground border-border',
        success: 'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        warning: 'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        info: 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        purple: 'border-transparent bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        pink: 'border-transparent bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
        indigo: 'border-transparent bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
        gray: 'border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        glass: 'glass text-white border-white/30',
        gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        default: 'text-xs px-2.5 py-0.5',
        lg: 'text-sm px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
        {icon && <span className="mr-1">{icon}</span>}
        {children}
        {removable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
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
  draft: 'gray',
  applied: 'info',
  under_review: 'warning',
  phone_screen: 'purple',
  interview: 'indigo',
  final_interview: 'purple',
  offer: 'success',
  rejected: 'destructive',
  withdrawn: 'gray',
  expired: 'gray',
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