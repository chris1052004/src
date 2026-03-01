import { clsx } from 'clsx';
import { motion } from 'motion/react';

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({ label, active = false, onClick, className }: ChipProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={clsx(
        'relative px-3.5 py-1.5 rounded-full text-[13px] transition-all duration-200 whitespace-nowrap',
        active
          ? 'bg-primary-blue text-white shadow-sm shadow-primary-blue/20'
          : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700',
        className
      )}
    >
      {label}
    </motion.button>
  );
}
