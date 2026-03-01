import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Layers, ScanLine, TriangleAlert, FileEdit } from 'lucide-react';

const shortcuts = [
  {
    label: 'Template',
    icon: Layers,
    iconBg: 'bg-primary-blue/10 dark:bg-primary-blue/15',
    iconColor: 'text-primary-blue',
    route: '/app/inspections',
  },
  {
    label: 'Scan',
    icon: ScanLine,
    iconBg: 'bg-neutral-100 dark:bg-neutral-800',
    iconColor: 'text-foreground',
    route: '/app/inspections/1/media',
  },
  {
    label: 'Laporan',
    icon: TriangleAlert,
    iconBg: 'bg-danger-red/10 dark:bg-danger-red/15',
    iconColor: 'text-danger-red',
    route: '/app/inspections/1/issue',
  },
  {
    label: 'Draft',
    icon: FileEdit,
    iconBg: 'bg-neutral-100 dark:bg-neutral-800',
    iconColor: 'text-foreground',
    route: '/app/inspections/2/title',
  },
] as const;

export function QuickShortcutsRow() {
  const navigate = useNavigate();

  return (
    /* Bleed to edges so tiles can start flush with screen padding */
    <div className="relative -mx-4">
      {/* Right fade hint */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 pl-4 pr-6 min-w-max">
          {shortcuts.map((s) => {
            const Icon = s.icon;
            return (
              <motion.button
                key={s.route}
                whileTap={{ scale: 0.91, backgroundColor: 'rgba(0,0,0,0.03)' }}
                onClick={() => navigate(s.route)}
                className="flex flex-col items-center gap-2 px-2 pt-3.5 pb-3 rounded-[18px] bg-card border border-divider/50 min-w-[72px] transition-colors active:bg-neutral-100 dark:active:bg-neutral-800"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {/* Icon bubble */}
                <div
                  className={`w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0 ${s.iconBg}`}
                >
                  <Icon className={`w-[18px] h-[18px] ${s.iconColor}`} strokeWidth={1.8} />
                </div>
                {/* Label */}
                <span className="text-[11.5px] font-medium text-foreground leading-none whitespace-nowrap">
                  {s.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
