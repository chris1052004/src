import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Camera,
  X,
  Check,
  Cloud,
  CloudOff,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

interface AreaPhoto {
  id: string;
  label: string;
  sublabel: string;
  required: boolean;
  photoUrl: string | null;
  syncStatus: 'synced' | 'syncing' | 'pending' | null;
}

const initialAreas: AreaPhoto[] = [
  { id: 'front',    label: 'Tampak Depan',    sublabel: 'Bumper, grill, lampu depan',     required: true,  photoUrl: 'https://via.placeholder.com/300x200/e2e8f0/94a3b8?text=Depan',    syncStatus: 'synced'  },
  { id: 'rear',     label: 'Tampak Belakang', sublabel: 'Bumper, lampu belakang, plat',   required: true,  photoUrl: 'https://via.placeholder.com/300x200/e2e8f0/94a3b8?text=Belakang', syncStatus: 'synced'  },
  { id: 'left',     label: 'Samping Kiri',    sublabel: 'Body, spion, pintu kiri',        required: true,  photoUrl: null,                                                              syncStatus: null      },
  { id: 'right',    label: 'Samping Kanan',   sublabel: 'Body, spion, pintu kanan',       required: true,  photoUrl: null,                                                              syncStatus: null      },
  { id: 'interior', label: 'Interior Kabin',  sublabel: 'Dashboard, jok, konsol tengah',  required: true,  photoUrl: 'https://via.placeholder.com/300x200/e2e8f0/94a3b8?text=Interior', syncStatus: 'pending' },
  { id: 'engine',   label: 'Ruang Mesin',     sublabel: 'Kondisi mesin, cairan, kabel',   required: true,  photoUrl: null,                                                              syncStatus: null      },
  { id: 'chassis',  label: 'Kaki-kaki',       sublabel: 'Ban, velg, kaliper rem',         required: false, photoUrl: null,                                                              syncStatus: null      },
  { id: 'damage',   label: 'Kerusakan/Temuan','sublabel': 'Foto tiap temuan / kerusakan', required: false, photoUrl: null,                                                              syncStatus: null      },
];

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 12 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
    },
  },
};

function SyncBadge({ status }: { status: 'synced' | 'syncing' | 'pending' }) {
  const map = {
    synced:  { variant: 'success' as const, icon: <Check className="w-3 h-3" />,            label: 'Tersimpan'  },
    syncing: { variant: 'primary' as const, icon: <Cloud className="w-3 h-3 animate-pulse" />, label: 'Menyimpan...' },
    pending: { variant: 'warning' as const, icon: <CloudOff className="w-3 h-3" />,         label: 'Menunggu'   },
  };
  const { variant, icon, label } = map[status];
  return (
    <Badge variant={variant} size="sm" className="flex items-center gap-1">
      {icon}
      <span>{label}</span>
    </Badge>
  );
}

export default function MediaCapture() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [areas, setAreas] = useState<AreaPhoto[]>(initialAreas);

  const takenCount  = areas.filter((a) => a.photoUrl !== null).length;
  const requiredCount = areas.filter((a) => a.required).length;
  const requiredDone  = areas.filter((a) => a.required && a.photoUrl !== null).length;
  const allRequiredDone = requiredDone === requiredCount;

  const handleDelete = (areaId: string) => {
    setAreas((prev) =>
      prev.map((a) => (a.id === areaId ? { ...a, photoUrl: null, syncStatus: null } : a))
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-divider/50 px-4 status-bar-aware"
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.8} />
          </motion.button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px]">Foto Inspeksi</h1>
            <p className="text-xs text-muted-foreground">
              {takenCount} dari {areas.length} area difoto
            </p>
          </div>
          {allRequiredDone ? (
            <div className="flex items-center gap-1 text-xs text-success-green bg-success-green/10 px-2.5 py-1.5 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Lengkap</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-warning-amber bg-warning-amber/10 px-2.5 py-1.5 rounded-xl">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{requiredCount - requiredDone} wajib</span>
            </div>
          )}
        </div>

        {/* Required progress bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-blue rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(requiredDone / requiredCount) * 100}%` }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
            />
          </div>
          <span className="text-[11px] text-muted-foreground">
            {requiredDone}/{requiredCount} wajib
          </span>
        </div>
      </motion.div>

      <motion.div
        className="px-4 py-4 space-y-3 pb-44"
        variants={stagger.container}
        initial="initial"
        animate="animate"
      >
        {/* Sync info banner */}
        <motion.div variants={stagger.item}>
          <div className="flex items-center gap-2.5 bg-info-blue/5 border border-info-blue/20 rounded-xl px-3.5 py-2.5">
            <Cloud className="w-4 h-4 text-info-blue flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Foto tersimpan otomatis saat online
            </p>
          </div>
        </motion.div>

        {/* Area cards */}
        {areas.map((area) => (
          <motion.div key={area.id} variants={stagger.item}>
            <Card className="overflow-hidden p-0">
              {area.photoUrl ? (
                /* Photo taken */
                <div className="relative">
                  <img
                    src={area.photoUrl}
                    alt={area.label}
                    className="w-full aspect-[16/9] object-cover"
                  />
                  {/* Overlay top */}
                  <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
                    <div>
                      <p className="text-white text-[13px] font-medium drop-shadow-sm">{area.label}</p>
                      {area.required && (
                        <Badge variant="danger" size="sm" className="mt-0.5">Wajib</Badge>
                      )}
                    </div>
                    {area.syncStatus && <SyncBadge status={area.syncStatus} />}
                  </div>
                  {/* Overlay bottom */}
                  <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                    <button
                      onClick={() => {}}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-xs py-2 rounded-xl"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Ambil Ulang
                    </button>
                    <button
                      onClick={() => handleDelete(area.id)}
                      className="px-3 bg-black/50 backdrop-blur-sm text-white py-2 rounded-xl"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty slot */
                <button
                  className="w-full"
                  onClick={() => {}}
                >
                  <div className="flex items-center gap-3 p-4">
                    <div className="w-16 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-dashed border-neutral-200 dark:border-neutral-700">
                      <Camera className="w-5 h-5 text-neutral-400" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[14px]">{area.label}</span>
                        {area.required && (
                          <span className="text-[10px] text-danger-red bg-danger-red/10 px-1.5 py-0.5 rounded-md">
                            Wajib
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{area.sublabel}</p>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-primary-blue/10 flex items-center justify-center flex-shrink-0">
                      <Plus className="w-4 h-4 text-primary-blue" strokeWidth={2} />
                    </div>
                  </div>
                </button>
              )}
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-divider/50 px-4 pt-3"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 88px)' }}
      >
        <div className="max-w-md mx-auto">
          <Button fullWidth size="lg" onClick={() => navigate(-1)}>
            Selesai
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
