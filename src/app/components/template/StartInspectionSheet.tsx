import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CalendarDays, LayoutList, MapPin, User, X } from 'lucide-react';
import { startSync } from '../../lib/syncStore';

export interface StartInspectionMeta {
  id: string;
  name: string;
  questionCount: number;
}

interface Props {
  template: StartInspectionMeta | null;
  onClose: () => void;
  onStart: (templateId: string, site: string) => void;
}

export function StartInspectionSheet({ template, onClose, onStart }: Props) {
  const [site, setSite] = useState('Dealer Sunter');
  const inspector = 'Alex R.';

  // Reset site each time a new template is selected
  useEffect(() => {
    if (template?.id) setSite('Dealer Sunter');
  }, [template?.id]);

  const todayLabel = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  function handleStart() {
    if (!site.trim()) return;
    startSync(); // simulate autosave on inspection start
    onStart(template!.id, site);
  }

  return (
    <AnimatePresence>
      {template && (
        <>
          {/* Backdrop — z-[65] sits above primary sheets (z-[60]) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/60 z-[65]"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 360 }}
            className="fixed bottom-0 left-0 right-0 z-[65] bg-card rounded-t-[24px] shadow-2xl max-w-[480px] mx-auto max-h-[85svh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 flex-shrink-0">
              <div className="w-10 h-1 bg-foreground/[0.15] rounded-full" />
            </div>

            {/* Sticky header */}
            <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-divider/50 flex-shrink-0">
              <h3 className="text-[16px] font-semibold text-foreground">Mulai inspeksi</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-foreground/[0.08]"
                aria-label="Tutup"
              >
                <X className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
              </button>
            </div>

            {/* Scrollable form content */}
            <div
              className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-4 space-y-4"
              style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 24px)' }}
            >
              {/* Template row (read-only) */}
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                  Template
                </p>
                <div className="flex items-center gap-3 h-11 px-3 rounded-xl bg-foreground/[0.07]">
                  <LayoutList className="w-4 h-4 text-primary-blue flex-shrink-0" strokeWidth={1.8} />
                  <p className="flex-1 text-[13px] font-medium text-foreground truncate">{template.name}</p>
                  <span className="text-[11px] text-muted-foreground flex-shrink-0">
                    {template.questionCount} pertanyaan
                  </span>
                </div>
              </div>

              {/* Dealer / Site input */}
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                  Dealer / Lokasi
                </p>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                    strokeWidth={1.8}
                  />
                  <input
                    type="text"
                    value={site}
                    onChange={(e) => setSite(e.target.value)}
                    placeholder="Nama dealer atau lokasi"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-divider/50 bg-foreground/[0.05] text-[13px] placeholder:text-muted-foreground/45 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue/45"
                  />
                </div>
              </div>

              {/* Date (read-only) */}
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                  Tanggal
                </p>
                <div className="flex items-center gap-3 h-11 px-3 rounded-xl bg-foreground/[0.07]">
                  <CalendarDays className="w-4 h-4 text-muted-foreground flex-shrink-0" strokeWidth={1.8} />
                  <span className="text-[13px] text-foreground">{todayLabel}</span>
                </div>
              </div>

              {/* Inspector (read-only) */}
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                  Inspektor
                </p>
                <div className="flex items-center gap-3 h-11 px-3 rounded-xl bg-foreground/[0.07]">
                  <User className="w-4 h-4 text-muted-foreground flex-shrink-0" strokeWidth={1.8} />
                  <span className="text-[13px] text-foreground">{inspector}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleStart}
                disabled={!site.trim()}
                className="w-full h-12 rounded-xl text-white text-[14px] font-semibold disabled:opacity-40 mt-2"
                style={{
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  boxShadow: '0 2px 10px rgba(37,99,235,0.30)',
                }}
              >
                Mulai Inspeksi
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
