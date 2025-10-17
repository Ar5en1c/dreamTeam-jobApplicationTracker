import type { Config } from 'tailwindcss';
import preset from '../packages/design-system/tailwind-preset.js';

export default {
  darkMode: 'class',
  content: [
    'src/**/*.{ts,tsx}',
    'index.html',
    '../packages/ui/src/**/*.{ts,tsx}',
    '../packages/design-system/src/**/*.{ts,tsx}'
  ],
  safelist: [
    'bg-[var(--color-primary-600)]',
    'hover:bg-[var(--color-primary-500)]',
    'active:bg-[var(--color-primary-700)]',
    'focus-visible:ring-[var(--color-primary-400)]',
    'bg-[var(--color-error-600)]',
    'hover:bg-[var(--color-error-500)]',
    'active:bg-[var(--color-error-700)]',
    'focus-visible:ring-[var(--color-error-400)]',
    'bg-[var(--color-success-600)]',
    'hover:bg-[var(--color-success-500)]',
    'active:bg-[var(--color-success-700)]',
    'focus-visible:ring-[var(--color-success-400)]',
    'bg-[var(--surface-2)]',
    'bg-[var(--surface-subtle)]',
    'border-[var(--border-muted)]',
    'hover:border-[var(--border-contrast)]',
    'focus-visible:ring-[var(--border-contrast)]',
    'hover:bg-[color-mix(in srgb,var(--color-primary-100)_12%,transparent)]'
  ],
  presets: [preset]
} satisfies Config;
