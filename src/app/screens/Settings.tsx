import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Bell, ChevronRight, LogOut, Moon, Sun, User, Users } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { logout } from '../lib/auth';

type MenuItem = {
  label: string;
  description: string;
  onClick: () => void;
  value?: string;
  icon: typeof User;
};

function SettingsList({ title, items }: { title: string; items: MenuItem[] }) {
  return (
    <section>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-semibold mb-2 px-1">{title}</p>
      <div className="rounded-2xl border border-divider/60 bg-card divide-y divide-divider/50 overflow-hidden">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className="w-full text-left px-4 py-3 hover:bg-surface flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Icon className="w-4.5 h-4.5 text-muted-foreground" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-foreground">{item.label}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">{item.description}</p>
              </div>
              {item.value && <span className="text-[12px] text-muted-foreground">{item.value}</span>}
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" strokeWidth={2} />
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showLogout, setShowLogout] = useState(false);

  const accountItems: MenuItem[] = [
    {
      label: 'Profile',
      description: 'Data personal, role, dan kontak',
      icon: User,
      onClick: () => navigate('/app/settings/profile'),
    },
    {
      label: 'Team',
      description: 'Struktur tim inspeksi dealer',
      icon: Users,
      onClick: () => navigate('/app/settings/team'),
    },
    {
      label: 'Notifications',
      description: 'Atur reminder temuan, due date, dan approval',
      icon: Bell,
      onClick: () => navigate('/app/notifications'),
    },
  ];

  const preferenceItems: MenuItem[] = [
    {
      label: 'Theme',
      description: 'Gunakan tema sesuai preferensi',
      icon: theme === 'dark' ? Moon : Sun,
      value: theme === 'dark' ? 'Dark' : 'Light',
      onClick: toggleTheme,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="bg-background min-h-full">
      <div className="sticky top-0 z-20 status-bar-aware px-4 pb-3 border-b border-divider/50 bg-card">
        <h1 className="text-[17px] font-semibold tracking-tight">Settings</h1>
      </div>

      <div className="px-4 py-4 space-y-4 pb-[calc(80px+env(safe-area-inset-bottom,0px))]">
        <div className="rounded-2xl border border-divider/60 bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-blue text-white flex items-center justify-center text-[16px] font-semibold">
              JS
            </div>
            <div className="min-w-0">
              <p className="text-[17px] font-semibold text-foreground">John Smith</p>
              <p className="text-[12px] text-muted-foreground">Inspector • Dealer Sunter</p>
              <p className="text-[12px] text-muted-foreground">john.smith@company.com</p>
            </div>
          </div>
        </div>

        <SettingsList title="Account" items={accountItems} />
        <SettingsList title="Preferences" items={preferenceItems} />

        {/* Keluar */}
        <section>
          <div className="rounded-2xl border border-divider/60 bg-card overflow-hidden">
            <button
              onClick={() => setShowLogout(true)}
              className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-3 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <LogOut className="w-4.5 h-4.5 text-danger-red" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-danger-red">Keluar</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">Keluar dari akun ini</p>
              </div>
            </button>
          </div>
        </section>

        <div className="rounded-2xl border border-divider/60 bg-card p-4">
          <p className="text-[14px] font-semibold text-foreground">G Tech Auditor</p>
          <p className="text-[12px] text-muted-foreground mt-1">Version 1.0.0</p>
          <p className="text-[12px] text-muted-foreground mt-1">© 2026 G Tech Solutions</p>
        </div>
      </div>

      {/* Logout confirmation sheet */}
      {showLogout && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowLogout(false)} />
          <div
            className="relative bg-card rounded-t-3xl flex flex-col"
            style={{ maxHeight: '85svh' }}
          >
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mt-4" />

            <div className="sticky top-0 bg-card px-4 pt-4 pb-3 border-b border-divider/50">
              <p className="text-[15px] font-semibold text-foreground">Keluar dari akun?</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Sesi Anda akan berakhir dan Anda perlu masuk kembali.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <LogOut className="w-5 h-5 text-danger-red" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-foreground">Konfirmasi keluar</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">
                    Pastikan semua perubahan sudah tersimpan sebelum keluar.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="px-4 pt-3 flex flex-col gap-2 border-t border-divider/50"
              style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}
            >
              <button
                onClick={handleLogout}
                className="h-12 w-full rounded-2xl bg-danger-red text-white text-[14px] font-semibold"
              >
                Ya, Keluar
              </button>
              <button
                onClick={() => setShowLogout(false)}
                className="h-12 w-full rounded-2xl bg-secondary text-foreground text-[14px] font-semibold"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
