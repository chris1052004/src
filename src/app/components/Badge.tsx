import { clsx } from 'clsx';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-lg whitespace-nowrap',
        {
          'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400':
            variant === 'default',
          'bg-success-green/10 text-success-green': variant === 'success',
          'bg-warning-amber/10 text-warning-amber': variant === 'warning',
          'bg-danger-red/10 text-danger-red': variant === 'danger',
          'bg-info-blue/10 text-info-blue': variant === 'info',
          'bg-primary-blue/10 text-primary-blue': variant === 'primary',
        },
        {
          'px-2 py-0.5 text-[11px]': size === 'sm',
          'px-2.5 py-1 text-xs': size === 'md',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
