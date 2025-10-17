export const colorPalette = {
  primary: {
    '50': 'var(--color-primary-50)',
    '100': 'var(--color-primary-100)',
    '200': 'var(--color-primary-200)',
    '300': 'var(--color-primary-300)',
    '400': 'var(--color-primary-400)',
    '500': 'var(--color-primary-500)',
    '600': 'var(--color-primary-600)',
    '700': 'var(--color-primary-700)',
    '800': 'var(--color-primary-800)',
    '900': 'var(--color-primary-900)',
    '950': 'var(--color-primary-950)',
  },
  secondary: {
    '50': 'var(--color-secondary-50)',
    '100': 'var(--color-secondary-100)',
    '200': 'var(--color-secondary-200)',
    '300': 'var(--color-secondary-300)',
    '400': 'var(--color-secondary-400)',
    '500': 'var(--color-secondary-500)',
    '600': 'var(--color-secondary-600)',
    '700': 'var(--color-secondary-700)',
    '800': 'var(--color-secondary-800)',
    '900': 'var(--color-secondary-900)',
  },
  surface: {
    1: 'var(--surface-1)',
    2: 'var(--surface-2)',
    3: 'var(--surface-3)',
    4: 'var(--surface-4)',
    subtle: 'var(--surface-subtle)',
    inverse: 'var(--surface-inverse)',
  },
};

export const radii = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
  full: 'var(--radius-full)',
};

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'Monaco', 'Courier New', 'monospace'],
  },
  fontSize: {
    xs: ['var(--text-xs)', { lineHeight: 'var(--leading-normal)' }],
    sm: ['var(--text-sm)', { lineHeight: 'var(--leading-normal)' }],
    base: ['var(--text-base)', { lineHeight: 'var(--leading-normal)' }],
    lg: ['var(--text-lg)', { lineHeight: 'var(--leading-normal)' }],
    xl: ['var(--text-xl)', { lineHeight: 'var(--leading-tight)' }],
    '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-tight)' }],
    '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-tight)' }],
    '4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-tight)' }],
    '5xl': ['var(--text-5xl)', { lineHeight: 'var(--leading-none)' }],
    '6xl': ['var(--text-6xl)', { lineHeight: 'var(--leading-none)' }],
  },
};

export const shadows = {
  xs: 'var(--shadow-xs)',
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
  '2xl': 'var(--shadow-2xl)',
  glow: 'var(--shadow-glow)',
  'glow-lg': 'var(--shadow-glow-lg)',
  'level-1': 'var(--shadow-level-1)',
  'level-2': 'var(--shadow-level-2)',
  'level-3': 'var(--shadow-level-3)',
};

export const spacingScale = {
  1: 'var(--space-1)',
  2: 'var(--space-2)',
  3: 'var(--space-3)',
  4: 'var(--space-4)',
  5: 'var(--space-5)',
  6: 'var(--space-6)',
  8: 'var(--space-8)',
  10: 'var(--space-10)',
  12: 'var(--space-12)',
  16: 'var(--space-16)',
  20: 'var(--space-20)',
  24: 'var(--space-24)',
};

export const transitionCurves = {
  in: 'var(--ease-in)',
  out: 'var(--ease-out)',
  'in-out': 'var(--ease-in-out)',
  spring: 'var(--ease-spring)',
};

export const durations = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms',
};

export const tailwindPreset = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          ...colorPalette.primary,
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          ...colorPalette.secondary,
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        success: {
          50: 'var(--color-success-50)',
          100: 'var(--color-success-100)',
          500: 'var(--color-success-500)',
          600: 'var(--color-success-600)',
          700: 'var(--color-success-700)',
        },
        warning: {
          50: 'var(--color-warning-50)',
          100: 'var(--color-warning-100)',
          500: 'var(--color-warning-500)',
          600: 'var(--color-warning-600)',
          700: 'var(--color-warning-700)',
        },
        error: {
          50: 'var(--color-error-50)',
          100: 'var(--color-error-100)',
          500: 'var(--color-error-500)',
          600: 'var(--color-error-600)',
          700: 'var(--color-error-700)',
        },
        info: {
          50: 'var(--color-info-50)',
          100: 'var(--color-info-100)',
          500: 'var(--color-info-500)',
          600: 'var(--color-info-600)',
          700: 'var(--color-info-700)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        surface: colorPalette.surface,
        borderMuted: 'var(--border-muted)',
        borderContrast: 'var(--border-contrast)',
      },
      borderRadius: radii,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      boxShadow: shadows,
      spacing: spacingScale,
      transitionDuration: durations,
      transitionTimingFunction: transitionCurves,
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        gradient: 'gradient-shift 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backdropBlur: {
        xs: 'var(--blur-sm)',
        sm: 'var(--blur-sm)',
        md: 'var(--blur-md)',
        lg: 'var(--blur-lg)',
        xl: 'var(--blur-xl)',
        '2xl': 'var(--blur-2xl)',
        '3xl': 'var(--blur-3xl)',
      },
    },
  },
  plugins: [],
};

export type TailwindPreset = typeof tailwindPreset;

export default tailwindPreset;
