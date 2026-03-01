import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { AutoPatternBg } from '../decorations/AutoPatternBg';
import { CarHeroIllustration } from '../decorations/CarHeroIllustration';

interface HeroBannerProps {
  taskCount: number;
  overdueCount: number;
  onStartInspection: () => void;
}

export function HeroBanner({ taskCount, overdueCount, onStartInspection }: HeroBannerProps) {
  return (
    <div
      className="relative overflow-hidden rounded-[24px] border border-primary-blue/[0.16] dark:border-primary-blue/[0.22]"
      style={{
        background: 'linear-gradient(140deg, rgba(37,99,235,0.07) 0%, rgba(59,130,246,0.11) 55%, rgba(147,197,253,0.08) 100%)',
        boxShadow: '0 2px 18px rgba(37,99,235,0.09), inset 0 1px 0 rgba(255,255,255,0.06)',
        minHeight: 176,
      }}
    >
      {/* Grid texture — absolute fill, very subtle */}
      <AutoPatternBg
        className="absolute inset-0 w-full h-full text-primary-blue opacity-[0.065]"
      />

      {/* Car illustration — right side, bleeds to bottom-right corner */}
      <div className="absolute right-0 bottom-0 w-[55%] pointer-events-none select-none flex items-end">
        <CarHeroIllustration className="w-full text-primary-blue opacity-[0.10]" />
      </div>

      {/* Content — left column; pr-[46%] keeps text clear of the illustration */}
      <div className="relative z-10 px-5 pt-5 pb-5 pr-[46%] flex flex-col" style={{ minHeight: 176 }}>

        {/* Section label */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-primary-blue mb-2.5">
          Inspeksi Hari Ini
        </p>

        {/* Headline */}
        <p className="text-[26px] font-bold text-foreground leading-none tabular-nums mb-0.5">
          {taskCount}
        </p>
        <p className="text-[13px] font-medium text-foreground/80 leading-snug">
          tugas due hari ini
        </p>

        {/* Overdue red-dot indicator */}
        {overdueCount > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-[7px] h-[7px] rounded-full bg-danger-red flex-shrink-0" />
            <span className="text-[12px] font-medium text-danger-red">
              {overdueCount} terlambat
            </span>
          </div>
        )}

        {/* Spacer pushes button to the bottom of the card */}
        <div className="flex-1" />

        {/* Primary CTA */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onStartInspection}
          className="mt-4 self-start h-9 px-4 bg-primary-blue text-white rounded-[16px] text-[13px] font-semibold flex items-center gap-1.5 shadow-sm"
          style={{ boxShadow: '0 2px 8px rgba(37,99,235,0.30)' }}
        >
          <Plus className="w-[14px] h-[14px]" strokeWidth={2.5} />
          Mulai Inspeksi
        </motion.button>
      </div>
    </div>
  );
}
