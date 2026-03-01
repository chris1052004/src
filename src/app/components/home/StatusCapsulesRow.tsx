import type { ElementType } from 'react';
import { CheckCircle2, Layers, FileText, TriangleAlert, Clock } from 'lucide-react';

interface StatusCapsulesRowProps {
  selesai: number;
  aktif: number;
  draft: number;
  temuan: number;
  terlambat: number;
}

interface CapsuleProps {
  icon: ElementType;
  count: number;
  label: string;
  variant: 'neutral' | 'blue' | 'red';
}

function Capsule({ icon: Icon, count, label, variant }: CapsuleProps) {
  const styles = {
    neutral: {
      wrap: 'bg-neutral-100 dark:bg-neutral-800 border-transparent',
      icon: 'text-muted-foreground',
      count: 'text-foreground',
      label: 'text-muted-foreground',
    },
    blue: {
      wrap: 'bg-primary-blue/10 dark:bg-primary-blue/15 border-primary-blue/20',
      icon: 'text-primary-blue',
      count: 'text-primary-blue',
      label: 'text-primary-blue/75',
    },
    red: {
      wrap: 'bg-danger-red/10 dark:bg-danger-red/15 border-danger-red/20',
      icon: 'text-danger-red',
      count: 'text-danger-red',
      label: 'text-danger-red/75',
    },
  }[variant];

  return (
    <div
      className={`flex-shrink-0 flex items-center gap-1.5 h-8 rounded-full px-3.5 border ${styles.wrap}`}
    >
      <Icon className={`w-3.5 h-3.5 ${styles.icon}`} strokeWidth={2} />
      <span className={`text-[12px] font-semibold tabular-nums ${styles.count}`}>{count}</span>
      <span className={`text-[12px] ${styles.label}`}>{label}</span>
    </div>
  );
}

export function StatusCapsulesRow({
  selesai,
  aktif,
  draft,
  temuan,
  terlambat,
}: StatusCapsulesRowProps) {
  return (
    <div className="relative -mx-4">
      {/* Left edge fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-background to-transparent z-10" />
      {/* Right edge fade */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pl-4 pr-6 pb-0.5 min-w-max">
          <Capsule icon={CheckCircle2} count={selesai} label="Selesai" variant="neutral" />
          <Capsule icon={Layers}       count={aktif}   label="Aktif"   variant="blue"    />
          <Capsule icon={FileText}     count={draft}   label="Draft"   variant="neutral" />
          <Capsule icon={TriangleAlert} count={temuan}  label="Temuan"  variant="red"     />
          {terlambat > 0 && (
            <Capsule icon={Clock} count={terlambat} label="Terlambat" variant="red" />
          )}
        </div>
      </div>
    </div>
  );
}
