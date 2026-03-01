import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search, Users } from 'lucide-react';

type TeamMember = {
  id: string;
  name: string;
  role: string;
  site: string;
  status: 'Active' | 'On Leave' | 'Offline';
};

const members: TeamMember[] = [
  { id: 'm1', name: 'Riko Pratama', role: 'Lead Inspector', site: 'Dealer Sunter', status: 'Active' },
  { id: 'm2', name: 'Sari Wulandari', role: 'Inspector', site: 'Bengkel Kelapa Gading', status: 'Active' },
  { id: 'm3', name: 'Andi Nugroho', role: 'Inspector', site: 'Service Center Puri', status: 'On Leave' },
  { id: 'm4', name: 'Nadia Putri', role: 'Junior Inspector', site: 'Dealer PIK', status: 'Offline' },
];

function statusTone(status: TeamMember['status']) {
  if (status === 'Active') return 'bg-success-green/10 text-success-green';
  if (status === 'On Leave') return 'bg-warning-amber/10 text-warning-amber';
  return 'bg-neutral-100 text-muted-foreground';
}

export default function TeamDetail() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const keyword = query.toLowerCase();
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(keyword) ||
        member.role.toLowerCase().includes(keyword) ||
        member.site.toLowerCase().includes(keyword)
    );
  }, [query]);

  return (
    <div className="bg-background min-h-full">
      <div className="status-bar-aware px-4 pb-3 border-b border-divider/50 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 -ml-1 rounded-xl flex items-center justify-center hover:bg-neutral-100"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-[16px] font-semibold text-foreground">Detail Tim</h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">{members.length} anggota tim inspeksi</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3 pb-8">
        <section className="rounded-2xl border border-divider/60 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-blue/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-blue" strokeWidth={1.9} />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-foreground">Fleet Operations Team</p>
              <p className="text-[12px] text-muted-foreground">Monitoring inspeksi showroom, bengkel, service center</p>
            </div>
          </div>
        </section>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.8} />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari anggota tim..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-divider/60 bg-white text-[13px] placeholder:text-muted-foreground/45 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue/45"
          />
        </div>

        <div className="rounded-2xl border border-divider/60 bg-white divide-y divide-divider/50 overflow-hidden">
          {filtered.map((member) => (
            <div key={member.id} className="px-4 py-3">
              <div className="flex items-start gap-2">
                <p className="flex-1 text-[14px] font-semibold text-foreground">{member.name}</p>
                <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${statusTone(member.status)}`}>
                  {member.status}
                </span>
              </div>
              <p className="text-[12px] text-muted-foreground mt-0.5">{member.role}</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">{member.site}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
