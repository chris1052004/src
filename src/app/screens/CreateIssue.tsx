import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

const severityOptions = [
  {
    value: 'Low',
    label: 'Rendah',
    color: 'text-info-blue',
    bg: 'bg-info-blue/10',
    border: 'border-info-blue/40',
    hint: 'Dapat ditangani kemudian',
  },
  {
    value: 'Medium',
    label: 'Sedang',
    color: 'text-warning-amber',
    bg: 'bg-warning-amber/10',
    border: 'border-warning-amber/40',
    hint: 'Perlu ditangani dalam waktu dekat',
  },
  {
    value: 'High',
    label: 'Tinggi',
    color: 'text-danger-red',
    bg: 'bg-danger-red/10',
    border: 'border-danger-red/40',
    hint: 'Memerlukan penanganan segera',
  },
];

export default function CreateIssue() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<string[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [photos, setPhotos] = useState<string[]>([]);

  const canSubmit = title.trim().length > 0;
  const activeSeverity = severityOptions.find((option) => option.value === severity)!;

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const nextUrls = files.map((file) => URL.createObjectURL(file));
    objectUrlsRef.current.push(...nextUrls);
    setPhotos((prev) => [...prev, ...nextUrls]);
    event.target.value = '';
  };

  return (
    <div className="bg-background">
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-divider/50 px-4 status-bar-aware">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 -ml-1 flex items-center justify-center rounded-xl hover:bg-surface transition-colors"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" strokeWidth={2} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[16px] font-semibold text-foreground leading-tight">Laporkan Masalah</h1>
            <p className="text-[11px] text-muted-foreground leading-none mt-0.5">Catat temuan kendaraan</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4" style={{ paddingBottom: 'calc(152px + env(safe-area-inset-bottom))' }}>
        <div className="rounded-2xl border border-divider/60 bg-card p-4 space-y-3">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">Informasi</p>
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-2">
              Judul <span className="text-danger-red normal-case tracking-normal">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Contoh: Retakan pada kaca depan"
              className="w-full h-11 px-4 rounded-xl border border-divider/60 bg-card text-foreground text-[14px] placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-2">Deskripsi</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Jelaskan masalah secara detail..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-divider/60 bg-card text-foreground text-[14px] placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue/50 transition-all resize-none"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-divider/60 bg-card p-4">
          <label className="block text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-2">
            Tingkat Keparahan <span className="text-danger-red normal-case tracking-normal">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {severityOptions.map((option) => {
              const active = severity === option.value;
              return (
                <motion.button
                  key={option.value}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSeverity(option.value)}
                  className={`h-[76px] rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                    active
                      ? `${option.bg} ${option.border} shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]`
                      : 'bg-secondary border-transparent'
                  }`}
                >
                  <span className={`text-[12px] font-medium ${active ? option.color : 'text-muted-foreground'}`}>
                    {option.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
          <p className={`text-[11px] mt-2 px-0.5 ${activeSeverity.value === 'High' ? 'text-danger-red' : 'text-muted-foreground'}`}>
            {activeSeverity.hint}
          </p>
        </div>

        <div className="rounded-2xl border border-divider/60 bg-card p-4 space-y-3">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">Bukti</p>
          <div className="rounded-xl border border-divider/60 bg-card px-3 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-foreground leading-tight">Tambah foto bukti</p>
              <p className="text-[11px] text-muted-foreground">Galeri atau kamera</p>
            </div>
            <button
              type="button"
              onClick={openFilePicker}
              className="h-8 px-3 rounded-lg text-[12px] font-medium bg-primary-blue/10 text-primary-blue"
            >
              Upload
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handlePhotoChange}
          />

          {photos.length > 0 ? (
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex min-w-max gap-2 pr-4">
                {photos.map((photo, index) => (
                  <div key={photo} className="w-[72px] h-[72px] rounded-xl border border-divider/60 overflow-hidden bg-card flex-shrink-0">
                    <img src={photo} alt={`Bukti ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="w-[72px] h-[72px] rounded-xl border border-dashed border-divider/80 bg-card flex items-center justify-center text-muted-foreground text-[20px] leading-none flex-shrink-0"
                  aria-label="Tambah foto"
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground">Belum ada foto yang ditambahkan.</p>
          )}
        </div>
      </div>

      <div
        className="fixed left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-divider/40 px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))]"
        style={{ bottom: '56px' }}
      >
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="h-12 px-5 rounded-2xl border border-divider/70 bg-card text-foreground text-[14px] font-medium transition-colors flex-shrink-0"
          >
            Batal
          </button>
          <motion.button
            whileTap={{ scale: canSubmit ? 0.98 : 1 }}
            onClick={() => canSubmit && navigate(`/app/inspections/${id}`)}
            className={`flex-1 h-12 rounded-2xl text-[15px] font-semibold transition-all ${
              canSubmit
                ? 'bg-primary-blue text-white shadow-sm shadow-primary-blue/30'
                : 'bg-secondary text-muted-foreground cursor-not-allowed opacity-70'
            }`}
          >
            Simpan Temuan
          </motion.button>
        </div>
      </div>
    </div>
  );
}
