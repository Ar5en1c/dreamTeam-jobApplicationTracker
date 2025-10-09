import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/types';

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        xs: 'h-6 w-6',
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
        '2xl': 'h-20 w-20',
        '3xl': 'h-24 w-24',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants>,
    ComponentProps {
  src?: string;
  alt?: string;
  fallback?: string;
  loading?: boolean;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, loading, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);
    const [imageLoading, setImageLoading] = React.useState(!!src);

    React.useEffect(() => {
      if (src) {
        setImageError(false);
        setImageLoading(true);
      }
    }, [src]);

    const handleImageLoad = () => {
      setImageLoading(false);
    };

    const handleImageError = () => {
      setImageError(true);
      setImageLoading(false);
    };

    const showFallback = !src || imageError || loading;
    const showLoader = imageLoading && !imageError;

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, className }))}
        {...props}
      >
        {!showFallback && (
          <img
            src={src}
            alt={alt}
            className="aspect-square h-full w-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {showLoader && (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {showFallback && !showLoader && (
          <AvatarFallback fallback={fallback} alt={alt} />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

interface AvatarFallbackProps extends ComponentProps {
  fallback?: string;
  alt?: string;
}

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, fallback, alt, ...props }, ref) => {
    const getInitials = (name?: string) => {
      if (!name) return '?';
      
      const names = name.trim().split(' ');
      if (names.length === 1) {
        return names[0].charAt(0).toUpperCase();
      }
      
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    };

    const initials = fallback || getInitials(alt);
    const gradientPalette = [
      "linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)",
      "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)",
      "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
      "linear-gradient(135deg, #6b7280 0%, #4338ca 100%)",
    ];

    const hashString = (value: string) =>
      value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const gradient =
      gradientPalette[Math.abs(hashString(initials || '?')) % gradientPalette.length];

    return (
      <div
        ref={ref}
        className={cn(
          'flex h-full w-full items-center justify-center font-semibold uppercase tracking-wide text-white shadow-sm',
          className
        )}
        style={{ backgroundImage: gradient }}
        {...props}
      >
        {initials}
      </div>
    );
  }
);

AvatarFallback.displayName = 'AvatarFallback';

// Avatar Group component for displaying multiple avatars
export interface AvatarGroupProps extends ComponentProps {
  avatars: Array<{
    src?: string;
    alt?: string;
    fallback?: string;
  }>;
  max?: number;
  size?: VariantProps<typeof avatarVariants>['size'];
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, avatars, max = 5, size = 'default', spacing = 'sm', ...props }, ref) => {
    const displayAvatars = avatars.slice(0, max);
    const extraCount = avatars.length - max;

    const spacingClasses = {
      none: '',
      sm: '-space-x-1',
      md: '-space-x-2',
      lg: '-space-x-3',
    };

    return (
      <div
        ref={ref}
        className={cn('flex items-center', spacingClasses[spacing], className)}
        {...props}
      >
        {displayAvatars.map((avatar, index) => (
          <Avatar
            key={index}
            size={size}
            src={avatar.src}
            alt={avatar.alt}
            fallback={avatar.fallback}
            className="ring-2 ring-background"
          />
        ))}
        
        {extraCount > 0 && (
          <div
            className={cn(
              avatarVariants({ size }),
              'flex items-center justify-center bg-muted text-muted-foreground font-medium ring-2 ring-background'
            )}
          >
            +{extraCount}
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarFallback, AvatarGroup, avatarVariants };
