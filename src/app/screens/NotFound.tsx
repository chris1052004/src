import { useNavigate } from 'react-router';
import { ArrowLeft, Home, MapPinOff } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-16 bg-background">
      <div className="w-16 h-16 rounded-2xl bg-danger-red/10 flex items-center justify-center mb-6">
        <MapPinOff className="w-8 h-8 text-danger-red" strokeWidth={1.6} />
      </div>

      <p className="text-[22px] font-semibold text-foreground text-center leading-tight">
        Halaman tidak ditemukan
      </p>
      <p className="text-[14px] text-muted-foreground text-center mt-2 max-w-[240px]">
        Halaman yang kamu cari mungkin sudah dipindah atau tidak tersedia.
      </p>

      <div className="flex flex-col gap-3 mt-8 w-full max-w-[280px]">
        <button
          onClick={() => navigate(-1)}
          className="h-12 rounded-xl text-white text-[14px] font-semibold flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>
        <button
          onClick={() => navigate('/app')}
          className="h-12 rounded-xl border border-divider/60 bg-card text-[14px] font-semibold text-foreground flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          Ke Beranda
        </button>
      </div>
    </div>
  );
}
