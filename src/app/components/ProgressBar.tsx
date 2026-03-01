import { clsx } from 'clsx';

interface ProgressBarProps {
  current?: number;
  total?: number;
  value?: number;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function ProgressBar({ current, total, value, variant = 'primary', className }: ProgressBarProps) {
  const percentage = value !== undefined ? value : current && total ? (current / total) * 100 : 0;

  const colorClasses = {
    primary: 'bg-primary-blue',
    success: 'bg-success-green',
    warning: 'bg-warning-amber',
    danger: 'bg-danger-red',
  };

  return (
    <div className={clsx('w-full', className)}>
      {current !== undefined && total !== undefined && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            {current} of {total} completed
          </span>
          <span className="text-sm text-muted-foreground">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div
          className={clsx('h-full transition-all duration-300', colorClasses[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}