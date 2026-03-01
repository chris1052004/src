import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center rounded-xl transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]',
          {
            'bg-gradient-to-r from-primary-blue to-primary-blue-dark text-white hover:shadow-lg hover:shadow-primary-blue/25 active:from-primary-blue-dark active:to-primary-blue-dark':
              variant === 'primary',
            'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 hover:bg-neutral-200 dark:hover:bg-neutral-700':
              variant === 'secondary',
            'bg-transparent border border-input text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800':
              variant === 'outline',
            'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-50':
              variant === 'ghost',
            'bg-danger-red text-white hover:bg-danger-red-light active:bg-danger-red':
              variant === 'danger',
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2.5': size === 'md',
            'px-6 py-3': size === 'lg',
          },
          {
            'w-full': fullWidth,
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
