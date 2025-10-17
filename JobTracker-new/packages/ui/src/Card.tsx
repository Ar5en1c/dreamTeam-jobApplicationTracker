import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils/cn';
import type { ComponentProps } from './types';

export const cardVariants = cva(
  'relative rounded-xl border border-borderMuted bg-surface-1 text-foreground shadow-sm transition-all duration-200',
  {
    variants: {
      variant: {
        default: '',
        surface: 'bg-surface-2 shadow-level-1',
        elevated: 'shadow-level-2 border-borderContrast',
        outline: 'bg-transparent border-dashed border-borderMuted',
        premium:
          'shadow-level-2 border-primary-200/50 ring-1 ring-primary-100/50 dark:border-primary-500/25 dark:ring-primary-500/15',
        neutral: 'bg-surface-3',
        glass: 'bg-surface-subtle backdrop-blur-md border-borderMuted/60',
      },
      size: {
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
        '2xl': 'p-12',
      },
      hover: {
        none: '',
        lift: 'transition-transform hover:-translate-y-1 hover:shadow-level-2',
        glow: 'hover:shadow-level-3',
        border: 'hover:border-primary-400',
        scale: 'transition-transform hover:scale-[1.02]',
        'lift-glow':
          'transition-transform hover:-translate-y-1 hover:shadow-level-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      hover: 'none',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants>,
    ComponentProps {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size, hover, className }))}
      {...props}
    />
  )
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ComponentProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-6', className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> &
    ComponentProps & { as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }
>(({ className, as: Component = 'h3', ...props }, ref) => (
  <Component
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & ComponentProps
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));

CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ComponentProps
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-0', className)} {...props} />
));

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ComponentProps
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center pt-6', className)} {...props} />
));

CardFooter.displayName = 'CardFooter';

export default Card;
