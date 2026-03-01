import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Mail, MapPin, Phone, ShieldCheck, User } from 'lucide-react';

const AVATAR_KEY = 'profile.avatarDataUrl';
const MAX_AVATAR_SIZE = 256;

function resizeToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, MAX_AVATAR_SIZE / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      img.onerror = () => reject(new Error('Invalid image'));
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProfileDetail() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(AVATAR_KEY);
    if (stored) setAvatarUrl(stored);
  }, []);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeToDataUrl(file);
      localStorage.setItem(AVATAR_KEY, dataUrl);
      setAvatarUrl(dataUrl);
    } catch {
      // Ignore for prototype
    } finally {
      event.target.value = '';
    }
  };

  const handleRemovePhoto = () => {
    localStorage.removeItem(AVATAR_KEY);
    setAvatarUrl(null);
  };

  return (
    <div className="bg-background min-h-full">
      <div className="status-bar-aware px-4 pb-3 border-b border-divider/50 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 -ml-1 rounded-xl flex items-center justify-center hover:bg-neutral-100"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-[16px] font-semibold text-foreground">Detail Profil</h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">Informasi akun inspector</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4 pb-8">
        <section className="rounded-2xl border border-divider/60 bg-white p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={openFilePicker}
              className="w-14 h-14 rounded-full bg-primary-blue text-white flex items-center justify-center text-[18px] font-semibold overflow-hidden"
              aria-label="Ubah foto profil"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Foto profil" className="w-full h-full object-cover" />
              ) : (
                'JS'
              )}
            </button>
            <div>
              <p className="text-[17px] font-semibold text-foreground">John Smith</p>
              <p className="text-[12px] text-muted-foreground">Senior Inspector • Fleet Operations</p>
              <span className="mt-1 inline-flex text-[10px] font-semibold px-2 py-[2px] rounded-full bg-success-green/10 text-success-green">
                Active
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={openFilePicker}
              className="h-9 px-3 rounded-xl bg-primary-blue/10 text-primary-blue text-[12px] font-semibold"
            >
              Ganti Foto
            </button>
            {avatarUrl && (
              <button
                onClick={handleRemovePhoto}
                className="h-9 px-3 rounded-xl bg-neutral-100 text-neutral-700 text-[12px] font-semibold"
              >
                Hapus Foto
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </section>

        <section className="rounded-2xl border border-divider/60 bg-white divide-y divide-divider/50 overflow-hidden">
          {[
            { label: 'Nama Lengkap', value: 'John Smith', icon: User },
            { label: 'Email', value: 'john.smith@company.com', icon: Mail },
            { label: 'No. HP', value: '+62 812-3456-7890', icon: Phone },
            { label: 'Lokasi Kerja', value: 'Dealer Sunter, Jakarta Utara', icon: MapPin },
            { label: 'Akses Role', value: 'Inspector', icon: ShieldCheck },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{item.label}</p>
                  <p className="text-[14px] text-foreground">{item.value}</p>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
