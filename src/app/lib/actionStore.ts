/**
 * actionStore — localStorage-persisted store for action items.
 */

const STORAGE_KEY = 'veh_actions_v2';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ActionPriority = 'High' | 'Medium' | 'Low';

export type ActionTimeline = {
  id: string;
  label: string;
  date: string;
};

export type ActionItem = {
  id: string;
  code: string;
  title: string;
  description?: string;
  contentItems: string[];
  source: string;
  inspectionId?: string;
  assignee: string;
  dueDate: string;
  workflowStatusId: string;
  priority: ActionPriority;
  site?: string;
  asset?: string;
  labels?: string[];
  sharedWith?: string[];
  linkedTemplateId?: string;
  timeline: ActionTimeline[];
  createdAt: string;
  updatedAt: string;
};

export type CreateActionPayload = {
  title: string;
  description?: string;
  workflowStatusId: string;
  priority: ActionPriority;
  dueDate?: string;
  source?: string;
  assignee?: string;
  site?: string;
  asset?: string;
};

// ─── Seed data ───────────────────────────────────────────────────────────────

const SEED: ActionItem[] = [
  {
    id: 'ACT-2026-0112',
    code: 'AC-0112',
    title: 'Perbaikan Temuan Fasilitas Area Dealer Sunter',
    contentItems: [
      'Tembok Area RVI Crack',
      'Tutup area drainase area parkir tidak proper',
      'Stopper kendaraan untuk parkir tidak ada',
      'Terdapat debu di area mesin coffee',
      'Bandwidth wifi di area customer tidak standard (minimal 10 Mbps)',
      'Hasil printer WO area penerimaan tidak sesuai template',
      'Area teknisi atap betonnya bocor',
    ],
    source: 'PDI Avanza 2024 - Dealer Sunter',
    assignee: 'Riko Pratama',
    dueDate: '28 Feb 2026',
    workflowStatusId: 'todo',
    priority: 'High',
    site: 'Dealer Sunter',
    labels: ['Fasilitas', 'Infrastruktur'],
    sharedWith: ['Riko Pratama', 'Sari Wulandari'],
    timeline: [
      { id: 't1', label: 'Dibuat oleh CRO', date: '24 Feb 2026, 09:20' },
      { id: 't2', label: 'Ditetapkan ke Tim Workshop', date: '24 Feb 2026, 10:05' },
      { id: 't3', label: 'Bukti awal diunggah', date: '25 Feb 2026, 16:40' },
    ],
    createdAt: '2026-02-24T09:20:00.000Z',
    updatedAt: '2026-02-25T16:40:00.000Z',
  },
  {
    id: 'ACT-2026-0118',
    code: 'AC-0118',
    title: 'Pembersihan dan Penataan Area Bengkel',
    contentItems: [
      'Lantai bengkel berminyak dan licin di area servis',
      'Peralatan bengkel tidak dikembalikan ke rak setelah digunakan',
      'Sampah oli dan kain lap berserakan di sudut ruangan',
      'Jadwal pembersihan harian belum terpasang di dinding',
    ],
    source: 'Audit 5R Showroom - Bengkel Kelapa Gading',
    assignee: 'Sari Wulandari',
    dueDate: '2 Mar 2026',
    workflowStatusId: 'in-progress',
    priority: 'Medium',
    site: 'Bengkel Kelapa Gading',
    sharedWith: ['Sari Wulandari'],
    timeline: [
      { id: 't1', label: 'Dibuat dari temuan inspeksi', date: '26 Feb 2026, 11:10' },
      { id: 't2', label: 'Ditetapkan ke kepala bengkel', date: '26 Feb 2026, 11:35' },
    ],
    createdAt: '2026-02-26T11:10:00.000Z',
    updatedAt: '2026-02-26T11:35:00.000Z',
  },
  {
    id: 'ACT-2026-0104',
    code: 'AC-0104',
    title: 'Penataan Dokumen Kerja dan Label Box File',
    contentItems: [
      'Dokumen WO tidak tersusun sesuai urutan tanggal',
      'Label box file tidak terpasang atau tidak terbaca',
      'Dokumen kadaluarsa belum diarsipkan ke gudang',
      'SOP pengarsipan belum dipahami seluruh staf admin',
    ],
    source: 'Monthly Safety Check - Service Center PIK',
    assignee: 'Andi Nugroho',
    dueDate: '5 Mar 2026',
    workflowStatusId: 'todo',
    priority: 'Low',
    site: 'Service Center PIK',
    labels: ['5R', 'Dokumentasi'],
    sharedWith: ['Andi Nugroho'],
    timeline: [{ id: 't1', label: 'Dibuat oleh CRO', date: '25 Feb 2026, 08:42' }],
    createdAt: '2026-02-25T08:42:00.000Z',
    updatedAt: '2026-02-25T08:42:00.000Z',
  },
  {
    id: 'ACT-2026-0091',
    code: 'AC-0091',
    title: 'Pengelolaan Sampah dan Kebersihan Area Kasir',
    contentItems: [
      'Terdapat kertas dan kardus tidak terpakai di area ruang kasir',
      'Tempat sampah penuh dan tidak dikosongkan tepat waktu',
      'Area tunggu konsumen tidak dibersihkan setelah jam sibuk',
    ],
    source: 'Fleet Compliance Audit - Dealer Puri',
    assignee: 'Riko Pratama',
    dueDate: '20 Feb 2026',
    workflowStatusId: 'done',
    priority: 'Medium',
    site: 'Dealer Puri',
    labels: ['5R', 'Kebersihan'],
    sharedWith: ['Riko Pratama', 'Andi Nugroho'],
    timeline: [
      { id: 't1', label: 'Dibuat oleh CRO', date: '18 Feb 2026, 13:20' },
      { id: 't2', label: 'Diselesaikan tim housekeeping', date: '20 Feb 2026, 14:10' },
      { id: 't3', label: 'Ditutup oleh HO', date: '20 Feb 2026, 17:02' },
    ],
    createdAt: '2026-02-18T13:20:00.000Z',
    updatedAt: '2026-02-20T17:02:00.000Z',
  },
  {
    id: 'ACT-2026-0085',
    code: 'AC-0085',
    title: 'Perbaikan Standar K3 Area Servis Cepat',
    contentItems: [
      'APAR belum dalam kondisi siap pakai (kadaluarsa)',
      'Rambu K3 tidak terpasang di area lift kendaraan',
      'Kotak P3K kosong dan tidak diisi ulang',
      'Teknisi tidak menggunakan APD saat bekerja di bawah kendaraan',
    ],
    source: 'Audit Keselamatan - Service Center Bekasi',
    assignee: 'Sari Wulandari',
    dueDate: '8 Mar 2026',
    workflowStatusId: 'todo',
    priority: 'High',
    site: 'Service Center Bekasi',
    labels: ['K3', 'Keselamatan'],
    sharedWith: ['Sari Wulandari', 'Riko Pratama'],
    timeline: [
      { id: 't1', label: 'Dibuat oleh CRO', date: '27 Feb 2026, 14:05' },
      { id: 't2', label: 'Eskalasi ke Supervisor K3', date: '27 Feb 2026, 15:30' },
    ],
    createdAt: '2026-02-27T14:05:00.000Z',
    updatedAt: '2026-02-27T15:30:00.000Z',
  },
];

// ─── Storage helpers ─────────────────────────────────────────────────────────

function load(): ActionItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ActionItem[];
  } catch {}
  return SEED.map(a => ({ ...a }));
}

function persist(items: ActionItem[]): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
}

// ─── Module state ─────────────────────────────────────────────────────────────

let _items: ActionItem[] = load();
let _codeSeq = 9200;

// ─── API ──────────────────────────────────────────────────────────────────────

export function getActions(): ActionItem[] {
  return _items;
}

export function createAction(payload: CreateActionPayload): ActionItem {
  const now = new Date().toISOString();
  const displayNow = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  _codeSeq += 1;
  const action: ActionItem = {
    id: `ACT-${Date.now()}`,
    code: `AC-${_codeSeq}`,
    title: payload.title,
    description: payload.description,
    contentItems: [],
    source: payload.source ?? '',
    assignee: payload.assignee ?? '',
    dueDate: payload.dueDate ?? '',
    workflowStatusId: payload.workflowStatusId,
    priority: payload.priority,
    site: payload.site,
    labels: [],
    sharedWith: [],
    timeline: [{ id: 'tl-1', label: 'Dibuat', date: displayNow }],
    createdAt: now,
    updatedAt: now,
  };
  _items = [action, ..._items];
  persist(_items);
  return action;
}

export function updateAction(id: string, patch: Partial<ActionItem>): void {
  _items = _items.map(a =>
    a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a
  );
  persist(_items);
}

export function deleteAction(id: string): void {
  _items = _items.filter(a => a.id !== id);
  persist(_items);
}
