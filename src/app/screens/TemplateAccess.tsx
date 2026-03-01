import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, ChevronDown, Plus, UserX } from 'lucide-react';
import { motion } from 'motion/react';

type Role = 'Editor' | 'Viewer';

interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

const SEED_MEMBERS: Member[] = [
  { id: '1', name: 'Budi Santoso', email: 'budi@gtech.id', role: 'Editor', avatar: 'BS' },
  { id: '2', name: 'Rina Wijaya', email: 'rina@gtech.id', role: 'Viewer', avatar: 'RW' },
  { id: '3', name: 'Agus Pratama', email: 'agus@gtech.id', role: 'Viewer', avatar: 'AP' },
];

export default function TemplateAccess() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [members, setMembers] = useState<Member[]>(SEED_MEMBERS);
  const [inviteEmail, setInviteEmail] = useState('');

  function handleRoleToggle(memberId: string) {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId ? { ...m, role: m.role === 'Editor' ? 'Viewer' : 'Editor' } : m
      )
    );
  }

  function handleRemove(memberId: string) {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  }

  function handleInvite() {
    const email = inviteEmail.trim();
    if (!email) return;
    const newMember: Member = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      role: 'Viewer',
      avatar: email.slice(0, 2).toUpperCase(),
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteEmail('');
  }

  return (
    <div className="bg-background min-h-full">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-divider/50 px-4 status-bar-aware">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl flex items-center justify-center border border-divider/60 bg-white"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" strokeWidth={2} />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-[16px] font-semibold text-foreground">Kelola Akses</h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">Template · {id}</p>
          </div>
        </div>
      </header>

      <div className="px-4 pt-4 pb-[calc(40px+env(safe-area-inset-bottom))] space-y-4">
        {/* Invite input */}
        <div className="rounded-xl border border-divider/60 bg-white p-4">
          <p className="text-[13px] font-semibold text-foreground mb-3">Undang Anggota</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Masukkan email..."
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
              className="flex-1 h-10 rounded-lg border border-divider/60 bg-background px-3 text-[13px] text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary-blue"
            />
            <button
              onClick={handleInvite}
              className="h-10 w-10 rounded-lg bg-primary-blue flex items-center justify-center flex-shrink-0"
            >
              <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Member list */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
            Anggota ({members.length})
          </p>
          <div className="rounded-xl border border-divider/60 bg-white overflow-hidden divide-y divide-divider/50">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-primary-blue/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[12px] font-semibold text-primary-blue">{m.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-foreground truncate">{m.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{m.email}</p>
                </div>
                <button
                  onClick={() => handleRoleToggle(m.id)}
                  className="h-7 px-2.5 rounded-lg border border-divider/60 text-[11px] font-semibold text-foreground flex items-center gap-1 flex-shrink-0"
                >
                  {m.role}
                  <ChevronDown className="w-3 h-3" strokeWidth={2} />
                </button>
                <button onClick={() => handleRemove(m.id)} aria-label="Hapus anggota">
                  <UserX className="w-4 h-4 text-danger-red" strokeWidth={1.8} />
                </button>
              </div>
            ))}
            {members.length === 0 && (
              <div className="py-8 text-center text-[13px] text-muted-foreground">
                Belum ada anggota.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
