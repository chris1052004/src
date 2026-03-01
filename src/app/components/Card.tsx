import { ReactNode } from 'react';
import { clsx } from 'clsx';

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-card border border-border/60 rounded-2xl p-4 shadow-sm',
        onClick && 'cursor-pointer active:scale-[0.98] hover:border-primary/40 hover:shadow-md transition-all duration-200',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
