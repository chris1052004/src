/**
 * TemplateEditor — full-featured template editor for both new and existing templates.
 * Route: /app/templates/:id/edit  (and reused from /app/templates/new)
 *
 * Renders the complete Build/Report editor with Title Page fields,
 * per-question Type of Response picker, and functional Response Set editor.
 */

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Cloud,
  Ellipsis,
  FileText,
  GripVertical,
  Hash,
  Layers,
  AlignLeft,
  Building2,
  Package,
  ClipboardList,
  MapPin,
  Pencil,
  Plus,
  Redo2,
  Search,
  Table2,
  Undo2,
  User,
  X,
  type LucideIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { inspectionTemplates } from '../lib/inspectionTemplates';
import {
  type ResponseColor,
  type ResponseOption,
  type ResponseSet,
  generateSetId,
  getResponseSets,
  getResponseSetById,
  getSetShortLabel,
  saveResponseSet,
} from '../lib/templateEditorStore';

/* ─── Types ──────────────────────────────────────────────────────────────── */

type BuilderTab = 'build' | 'report';
type ResponseTypeId = string;

type GlobalResponseDef = {
  id: string;
  label: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

type OtherResponseDef = {
  id: string;
  label: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

type Question = {
  id: string;
  label: string;
  responseTypeId: ResponseTypeId;
  required: boolean;
};

type Section = {
  id: string;
  title: string;
  description?: string;
  expanded: boolean;
  questions: Question[];
};

/* ─── Static data ────────────────────────────────────────────────────────── */

const GLOBAL_RESPONSES: GlobalResponseDef[] = [
  { id: 'site',            label: 'Site',            icon: MapPin,    iconBg: 'rgba(37,99,235,0.10)',   iconColor: '#2563EB' },
  { id: 'inspection-date', label: 'Inspection date', icon: Calendar,  iconBg: 'rgba(16,185,129,0.10)',  iconColor: '#059669' },
  { id: 'person',          label: 'Person',          icon: User,      iconBg: 'rgba(139,92,246,0.10)',  iconColor: '#7C3AED' },
  { id: 'doc-number',      label: 'Document number', icon: Hash,      iconBg: 'rgba(245,158,11,0.10)',  iconColor: '#D97706' },
  { id: 'asset',           label: 'Asset',           icon: Package,   iconBg: 'rgba(245,158,11,0.10)',  iconColor: '#D97706' },
  { id: 'company',         label: 'Company',         icon: Building2, iconBg: 'rgba(16,185,129,0.10)',  iconColor: '#059669' },
];

const OTHER_RESPONSES: OtherResponseDef[] = [
  { id: 'text',   label: 'Text answer', icon: AlignLeft, iconBg: 'rgba(245,158,11,0.10)', iconColor: '#D97706' },
  { id: 'number', label: 'Number',      icon: Hash,      iconBg: 'rgba(139,92,246,0.10)', iconColor: '#7C3AED' },
];

function buildInitialSections(): Section[] {
  return [
    {
      id: 'title-page',
      title: 'Title Page',
      description: 'Halaman pertama laporan inspeksi. Atur pertanyaan utama sebelum menambah section lain.',
      expanded: true,
      questions: [
        { id: 'q1', label: 'Site conducted',  responseTypeId: 'site',            required: true  },
        { id: 'q2', label: 'Conducted on',    responseTypeId: 'inspection-date', required: true  },
        { id: 'q3', label: 'Prepared by',     responseTypeId: 'person',          required: true  },
        { id: 'q4', label: 'Location',        responseTypeId: 'text',            required: false },
      ],
    },
    {
      id: 'untitled-page',
      title: 'Untitled Page',
      description: 'This is where you add your inspection questions and how you want them answered. E.g. "Is the floor clean?"',
      expanded: true,
      questions: [],
    },
  ];
}

/* ─── Chip colour map ────────────────────────────────────────────────────── */

const CHIP_COLORS: Record<ResponseColor, { bg: string; text: string }> = {
  green:   { bg: 'rgba(16,185,129,0.13)',  text: '#059669' },
  amber:   { bg: 'rgba(245,158,11,0.13)',  text: '#B45309' },
  red:     { bg: 'rgba(239,68,68,0.13)',   text: '#DC2626' },
  neutral: { bg: 'rgba(148,163,184,0.12)', text: '#64748B' },
  blue:    { bg: 'rgba(37,99,235,0.12)',   text: '#2563EB' },
  purple:  { bg: 'rgba(139,92,246,0.12)',  text: '#7C3AED' },
};

const COLOR_PALETTE: ResponseColor[] = ['green', 'amber', 'red', 'neutral', 'blue', 'purple'];

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function getResponseShortLabel(id: ResponseTypeId): string {
  const set = getResponseSetById(id);
  if (set) return getSetShortLabel(set);
  const g = GLOBAL_RESPONSES.find(r => r.id === id);
  if (g) return g.label;
  const o = OTHER_RESPONSES.find(r => r.id === id);
  if (o) return o.label;
  return 'Choose';
}

function getResponseChipStyle(id: ResponseTypeId): { bg: string; text: string } {
  const set = getResponseSetById(id);
  if (set) return { bg: 'rgba(100,116,139,0.10)', text: '#475569' };
  const g = GLOBAL_RESPONSES.find(r => r.id === id);
  if (g) return { bg: g.iconBg, text: g.iconColor };
  const o = OTHER_RESPONSES.find(r => r.id === id);
  if (o) return { bg: o.iconBg, text: o.iconColor };
  return { bg: 'rgba(100,116,139,0.10)', text: '#475569' };
}

const ease = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

/* ─── OptionPreviewChip ──────────────────────────────────────────────────── */

function OptionPreviewChip({ label, color }: { label: string; color: ResponseColor }) {
  const { bg, text } = CHIP_COLORS[color] ?? CHIP_COLORS.neutral;
  return (
    <span
      className="px-2 py-[2px] rounded-full text-[11px] font-semibold whitespace-nowrap flex-shrink-0"
      style={{ background: bg, color: text }}
    >
      {label}
    </span>
  );
}

/* ─── ResponseSetEditorSheet ─────────────────────────────────────────────── */

function ResponseSetEditorSheet({
  set,
  onSave,
  onClose,
}: {
  set: ResponseSet | null;
  onSave: (saved: ResponseSet) => void;
  onClose: () => void;
}) {
  const isOpen = set !== null;

  const [editableOptions, setEditableOptions] = useState<ResponseOption[]>(() =>
    (set?.options ?? []).filter(o => o.id !== 'na' && o.label !== 'N/A')
  );
  const [hasNA, setHasNA] = useState<boolean>(() =>
    (set?.options ?? []).some(o => o.id === 'na' || o.label === 'N/A')
  );

  const [prevSet, setPrevSet] = useState<ResponseSet | null>(set);
  if (set !== prevSet) {
    setPrevSet(set);
    setEditableOptions((set?.options ?? []).filter(o => o.id !== 'na' && o.label !== 'N/A'));
    setHasNA((set?.options ?? []).some(o => o.id === 'na' || o.label === 'N/A'));
  }

  const handleSave = () => {
    const valid = editableOptions.filter(o => o.label.trim());
    const naOpt: ResponseOption = { id: 'na', label: 'N/A', color: 'neutral' };
    const finalOptions = hasNA ? [...valid, naOpt] : valid;
    const savedSet: ResponseSet = {
      id: set?.id ?? generateSetId(),
      options: finalOptions,
      isBuiltIn: set?.isBuiltIn,
    };
    saveResponseSet(savedSet);
    onSave(savedSet);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="rse-bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[80] bg-black/30"
            onClick={onClose}
          />
          <motion.div
            key="rse-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 340 }}
            className="fixed inset-x-0 bottom-0 z-[90] max-w-[480px] mx-auto rounded-t-[28px] bg-white"
            style={{
              maxHeight: '84vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
            }}
          >
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-9 h-1 rounded-full bg-neutral-200" />
            </div>
            <div className="px-5 py-3 flex items-center gap-3 border-b border-neutral-100 flex-shrink-0">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 text-neutral-600" strokeWidth={2.2} />
              </motion.button>
              <h2 className="text-[17px] font-semibold flex-1 text-neutral-900">
                {(set?.options ?? []).length === 0 ? 'New response set' : 'Edit response set'}
              </h2>
              <button
                onClick={handleSave}
                disabled={editableOptions.filter(o => o.label.trim()).length === 0 && !hasNA}
                className="text-[14px] font-semibold disabled:opacity-40"
                style={{ color: '#2563EB' }}
              >
                Save
              </button>
            </div>
            <div
              className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4 space-y-2.5"
              style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 24px)' }}
            >
              {editableOptions.map((opt, idx) => (
                <div
                  key={opt.id}
                  className="rounded-xl overflow-hidden"
                  style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                >
                  <div className="flex items-center h-12 px-3 gap-2 bg-white">
                    <GripVertical className="w-4 h-4 text-neutral-300 flex-shrink-0" strokeWidth={1.5} />
                    <input
                      value={opt.label}
                      onChange={e =>
                        setEditableOptions(prev =>
                          prev.map((o, i) => (i === idx ? { ...o, label: e.target.value } : o))
                        )
                      }
                      placeholder="Option label…"
                      className="flex-1 text-[14px] font-semibold outline-none bg-transparent"
                      style={{ color: (CHIP_COLORS[opt.color] ?? CHIP_COLORS.neutral).text }}
                    />
                    <button
                      onClick={() => setEditableOptions(prev => prev.filter((_, i) => i !== idx))}
                      className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5 text-neutral-400" strokeWidth={2} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 pb-3 pt-2 flex-wrap bg-neutral-50">
                    {COLOR_PALETTE.map(c => {
                      const cs = CHIP_COLORS[c];
                      const selected = opt.color === c;
                      return (
                        <button
                          key={c}
                          onClick={() =>
                            setEditableOptions(prev =>
                              prev.map((o, i) => (i === idx ? { ...o, color: c } : o))
                            )
                          }
                          className="h-7 px-2.5 rounded-full text-[11px] font-semibold flex items-center gap-1"
                          style={{
                            background: cs.bg,
                            color: cs.text,
                            outline: selected ? `2px solid ${cs.text}` : 'none',
                            outlineOffset: '1px',
                          }}
                        >
                          {selected && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  setEditableOptions(prev => [
                    ...prev,
                    { id: `opt-${Date.now()}`, label: '', color: 'neutral' as ResponseColor },
                  ])
                }
                className="w-full h-11 rounded-xl flex items-center justify-center gap-2 text-[14px] font-medium"
                style={{
                  border: '1.5px dashed rgba(37,99,235,0.30)',
                  color: '#2563EB',
                  background: 'rgba(37,99,235,0.03)',
                }}
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                Add option
              </motion.button>

              <div
                className="flex items-center justify-between h-12 px-4 rounded-xl bg-white"
                style={{ border: '1px solid rgba(0,0,0,0.08)' }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="px-2 py-[2px] rounded-full text-[11px] font-semibold"
                    style={{ background: CHIP_COLORS.neutral.bg, color: CHIP_COLORS.neutral.text }}
                  >
                    N/A
                  </span>
                  <span className="text-[14px] text-neutral-700">Include N/A</span>
                </div>
                <button
                  onClick={() => setHasNA(v => !v)}
                  className="w-11 h-6 rounded-full transition-colors flex items-center flex-shrink-0"
                  style={{ background: hasNA ? '#2563EB' : '#E5E7EB' }}
                >
                  <span
                    className="w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5"
                    style={{ transform: hasNA ? 'translateX(20px)' : 'translateX(0)' }}
                  />
                </button>
              </div>

              {editableOptions.filter(o => o.label.trim()).length > 0 && (
                <div className="pt-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-neutral-400 mb-2">Preview</p>
                  <div className="flex flex-wrap gap-1.5">
                    {editableOptions.filter(o => o.label.trim()).map(opt => (
                      <OptionPreviewChip key={opt.id} label={opt.label} color={opt.color} />
                    ))}
                    {hasNA && <OptionPreviewChip label="N/A" color="neutral" />}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── TypeOfResponseSheet ────────────────────────────────────────────────── */

function TypeOfResponseSheet({
  isOpen,
  current,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  current: ResponseTypeId;
  onClose: () => void;
  onSelect: (id: ResponseTypeId) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [localSets, setLocalSets] = useState<ResponseSet[]>(() => getResponseSets());
  const [editingSet, setEditingSet] = useState<ResponseSet | null>(null);

  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen && !wasOpen) {
    setWasOpen(true);
    setLocalSets(getResponseSets());
    setSearchQuery('');
  }
  if (!isOpen && wasOpen) setWasOpen(false);

  const q = searchQuery.toLowerCase();
  const filteredSets   = localSets.filter(s => !q || s.options.some(o => o.label.toLowerCase().includes(q)));
  const filteredGlobal = GLOBAL_RESPONSES.filter(g => !q || g.label.toLowerCase().includes(q));
  const filteredOther  = OTHER_RESPONSES.filter(o => !q || o.label.toLowerCase().includes(q));
  const hasResults     = filteredSets.length + filteredGlobal.length + filteredOther.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="ts-bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/40"
            onClick={onClose}
          />
          <motion.div
            key="ts-sheet"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-[70] max-w-[480px] mx-auto rounded-t-[28px] bg-white"
            style={{ maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 -8px 48px rgba(0,0,0,0.16)' }}
          >
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-9 h-1 rounded-full bg-neutral-200" />
            </div>
            <div className="px-5 pb-3 flex items-center gap-3 flex-shrink-0">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,0,0,0.07)' }}
              >
                <X className="w-4 h-4 text-neutral-600" strokeWidth={2.2} />
              </motion.button>
              <h2 className="text-[18px] font-semibold text-neutral-900 flex-1">Type of response</h2>
            </div>

            <div className="px-4 pb-3 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" strokeWidth={1.8} />
                <input
                  type="text"
                  placeholder="Search…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-10 rounded-xl text-[14px] outline-none text-neutral-900 placeholder:text-neutral-400"
                  style={{ background: 'rgba(0,0,0,0.06)', border: searchQuery ? '1.5px solid rgba(37,99,235,0.45)' : '1.5px solid transparent' }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-3.5 h-3.5 text-neutral-400" strokeWidth={2} />
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-y-auto flex-1 scrollbar-hide" style={{ paddingBottom: 'max(env(safe-area-inset-bottom),28px)' }}>

              {/* Multiple choice sets */}
              {filteredSets.length > 0 && (
                <section className="mb-2">
                  <div className="flex items-center justify-between px-5 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-neutral-400">Multiple choice responses</p>
                    <button
                      onClick={() => setEditingSet({ id: generateSetId(), options: [] })}
                      className="flex items-center gap-0.5 text-[13px] font-semibold"
                      style={{ color: '#2563EB' }}
                    >
                      <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                      Responses
                    </button>
                  </div>
                  <div className="mx-4 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                    {filteredSets.map((set, i) => {
                      const isSelected = current === set.id;
                      return (
                        <motion.div
                          key={set.id}
                          whileTap={{ scale: 0.995 }}
                          className="flex items-center gap-2.5 px-4 py-3.5 cursor-pointer"
                          style={{
                            background: isSelected ? 'rgba(37,99,235,0.05)' : 'white',
                            borderBottom: i < filteredSets.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                          }}
                          onClick={() => onSelect(set.id)}
                        >
                          <div className="flex items-center gap-1.5 flex-1 flex-wrap">
                            {set.options.map(opt => (
                              <OptionPreviewChip key={opt.id} label={opt.label} color={opt.color} />
                            ))}
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#2563EB' }}>
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            </div>
                          )}
                          <motion.button
                            whileTap={{ scale: 0.88 }}
                            onClick={e => { e.stopPropagation(); setEditingSet(set); }}
                            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(0,0,0,0.06)' }}
                          >
                            <Pencil className="w-3.5 h-3.5 text-neutral-500" strokeWidth={2} />
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Global Response Sets */}
              {filteredGlobal.length > 0 && (
                <section className="mt-4 mb-2">
                  <div className="flex items-center justify-between px-5 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-neutral-400">Global Response Sets</p>
                    <button className="flex items-center gap-0.5 text-[13px] font-semibold" style={{ color: '#2563EB' }}>
                      <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                      Create
                    </button>
                  </div>
                  <div className="mx-4 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                    {filteredGlobal.map((g, i) => {
                      const Icon = g.icon;
                      const isSelected = current === g.id;
                      return (
                        <motion.div
                          key={g.id}
                          whileTap={{ scale: 0.995 }}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                          style={{
                            background: isSelected ? 'rgba(37,99,235,0.05)' : 'white',
                            borderBottom: i < filteredGlobal.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                          }}
                          onClick={() => onSelect(g.id)}
                        >
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: g.iconBg }}>
                            <Icon className="w-[18px] h-[18px]" style={{ color: g.iconColor }} strokeWidth={1.8} />
                          </div>
                          <span className="flex-1 text-[15px] font-medium text-neutral-800">{g.label}</span>
                          {isSelected ? (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#2563EB' }}>
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            </div>
                          ) : (
                            <ChevronRight className="w-4 h-4 text-neutral-300 flex-shrink-0" strokeWidth={2} />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Other responses */}
              {filteredOther.length > 0 && (
                <section className="mt-4 mb-2">
                  <div className="flex items-center px-5 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-neutral-400">Other responses</p>
                  </div>
                  <div className="mx-4 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                    {filteredOther.map((o, i) => {
                      const Icon = o.icon;
                      const isSelected = current === o.id;
                      return (
                        <motion.div
                          key={o.id}
                          whileTap={{ scale: 0.995 }}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                          style={{
                            background: isSelected ? 'rgba(37,99,235,0.05)' : 'white',
                            borderBottom: i < filteredOther.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                          }}
                          onClick={() => onSelect(o.id)}
                        >
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: o.iconBg }}>
                            <Icon className="w-[18px] h-[18px]" style={{ color: o.iconColor }} strokeWidth={1.8} />
                          </div>
                          <span className="flex-1 text-[15px] font-medium text-neutral-800">{o.label}</span>
                          {isSelected ? (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#2563EB' }}>
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            </div>
                          ) : (
                            <ChevronRight className="w-4 h-4 text-neutral-300 flex-shrink-0" strokeWidth={2} />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              )}

              {!hasResults && (
                <div className="py-14 text-center">
                  <p className="text-[14px] text-neutral-400">No results for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </motion.div>

          <ResponseSetEditorSheet
            set={editingSet}
            onSave={saved => {
              setLocalSets([...getResponseSets()]);
              setEditingSet(null);
            }}
            onClose={() => setEditingSet(null)}
          />
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── SectionCard ────────────────────────────────────────────────────────── */

function SectionCard({
  section,
  onToggle,
  onOpenTypeSheet,
  onAddQuestion,
  onDeleteQuestion,
  onUpdateQuestion,
  onUpdateTitle,
}: {
  section: Section;
  onToggle: () => void;
  onOpenTypeSheet: (q: Question) => void;
  onAddQuestion: () => void;
  onDeleteQuestion: (qId: string) => void;
  onUpdateQuestion: (qId: string, label: string) => void;
  onUpdateTitle: (title: string) => void;
}) {
  const isTitlePage = section.id === 'title-page';

  return (
    <div className="rounded-2xl bg-white overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}>
      {/* Section header — tap to expand/collapse */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        <motion.button whileTap={{ scale: 0.97 }} onClick={onToggle} className="flex-shrink-0">
          <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center"
            style={{ background: isTitlePage ? 'rgba(37,99,235,0.10)' : 'rgba(100,116,139,0.10)' }}
          >
            <ClipboardList className="w-4 h-4" style={{ color: isTitlePage ? '#2563EB' : '#64748B' }} strokeWidth={1.8} />
          </div>
        </motion.button>

        {/* Editable section title */}
        {isTitlePage ? (
          <h3 className="flex-1 min-w-0 text-[15px] font-semibold text-neutral-900 leading-tight">{section.title}</h3>
        ) : (
          <input
            value={section.title}
            onChange={e => onUpdateTitle(e.target.value)}
            placeholder="Section title…"
            className="flex-1 min-w-0 text-[15px] font-semibold text-neutral-900 leading-tight outline-none bg-transparent placeholder:text-neutral-300"
            onClick={e => e.stopPropagation()}
          />
        )}

        <motion.button whileTap={{ scale: 0.94 }} onClick={onToggle} className="flex items-center gap-1 flex-shrink-0">
          <span className="text-[12px] text-neutral-400">
            {section.questions.length} {section.questions.length === 1 ? 'q' : 'q'}
          </span>
          <motion.div animate={{ rotate: section.expanded ? 0 : -90 }} transition={{ duration: 0.2, ease }}>
            <ChevronDown className="w-4 h-4 text-neutral-400" strokeWidth={2} />
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {section.expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease }} style={{ overflow: 'hidden' }}
          >
            {section.description && (
              <p className="px-4 pt-3 pb-2 text-[13px] text-neutral-500 leading-relaxed" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                {section.description}
              </p>
            )}

            {section.questions.length > 0 && (
              <div className="mx-4 mb-3 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                {/* Header */}
                <div className="flex items-center h-8 px-4 bg-neutral-50" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <span className="flex-1 text-[10px] font-semibold uppercase tracking-[0.10em] text-neutral-400">Question</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.10em] text-neutral-400 mr-3">Response type</span>
                </div>

                {section.questions.map((question, i) => {
                  const chipStyle = getResponseChipStyle(question.responseTypeId);
                  const chipLabel = getResponseShortLabel(question.responseTypeId);
                  return (
                    <div
                      key={question.id}
                      className="flex items-center min-h-[56px] bg-white"
                      style={{ borderBottom: i < section.questions.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}
                    >
                      <div className="px-2.5 h-full flex items-center text-neutral-300 cursor-grab active:cursor-grabbing flex-shrink-0 py-4">
                        <GripVertical className="w-4 h-4" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0 py-3 pr-2">
                        {question.required ? (
                          <div className="flex items-center gap-0.5">
                            <span className="text-[#DC2626] text-[14px]">*</span>
                            <input
                              value={question.label}
                              onChange={e => onUpdateQuestion(question.id, e.target.value)}
                              placeholder="Type question…"
                              className="flex-1 min-w-0 text-[14px] font-medium text-neutral-800 leading-tight outline-none bg-transparent placeholder:text-neutral-300"
                            />
                          </div>
                        ) : (
                          <input
                            value={question.label}
                            onChange={e => onUpdateQuestion(question.id, e.target.value)}
                            placeholder="Type question…"
                            className="w-full text-[14px] font-medium text-neutral-800 leading-tight outline-none bg-transparent placeholder:text-neutral-300"
                          />
                        )}
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => onOpenTypeSheet(question)}
                        className="flex items-center gap-1 px-2.5 py-[5px] rounded-lg flex-shrink-0"
                        style={{ background: chipStyle.bg, color: chipStyle.text }}
                      >
                        <span className="text-[12px] font-semibold whitespace-nowrap">{chipLabel}</span>
                        <ChevronRight className="w-3 h-3" strokeWidth={2.5} />
                      </motion.button>
                      {!question.required && (
                        <button
                          onClick={() => onDeleteQuestion(question.id)}
                          className="w-8 h-8 flex items-center justify-center flex-shrink-0 ml-1 mr-1"
                          style={{ color: '#CBD5E1' }}
                        >
                          <X className="w-3.5 h-3.5" strokeWidth={2} />
                        </button>
                      )}
                      {question.required && <div className="w-2 flex-shrink-0 mr-2" />}
                    </div>
                  );
                })}
              </div>
            )}

            {section.questions.length === 0 && !isTitlePage && (
              <div className="mx-4 mb-3">
                <div className="rounded-xl flex items-center justify-center py-5" style={{ border: '1.5px dashed rgba(0,0,0,0.10)' }}>
                  <p className="text-[13px] text-neutral-400">No questions yet — tap below to add</p>
                </div>
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onAddQuestion}
              className="mx-4 mb-4 w-[calc(100%-2rem)] h-10 flex items-center justify-center gap-2 rounded-xl text-[13px] font-medium"
              style={{ border: '1.5px dashed rgba(37,99,235,0.28)', color: '#2563EB', background: 'rgba(37,99,235,0.02)' }}
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
              Add question
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main screen ────────────────────────────────────────────────────────── */

export default function TemplateEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Pre-populate title from existing template if id matches
  const existingTemplate = inspectionTemplates.find(t => t.id === id);

  const [activeTab, setActiveTab] = useState<BuilderTab>('build');
  const [templateTitle, setTemplateTitle] = useState(existingTemplate?.title ?? 'Template Inspeksi Baru');
  const [description, setDescription] = useState(existingTemplate?.description ?? '');
  const [sections, setSections] = useState<Section[]>(() => buildInitialSections());
  const [typeSheet, setTypeSheet] = useState<{
    open: boolean;
    sectionId: string;
    questionId: string;
    current: ResponseTypeId;
  } | null>(null);

  const openTypeSheet = (sectionId: string, question: Question) =>
    setTypeSheet({ open: true, sectionId, questionId: question.id, current: question.responseTypeId });

  const handleSelectResponseType = (id: ResponseTypeId) => {
    if (!typeSheet) return;
    setSections(prev =>
      prev.map(s =>
        s.id !== typeSheet.sectionId ? s : {
          ...s,
          questions: s.questions.map(q =>
            q.id !== typeSheet.questionId ? q : { ...q, responseTypeId: id }
          ),
        }
      )
    );
    setTypeSheet(null);
  };

  const toggleSection = (sectionId: string) =>
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, expanded: !s.expanded } : s));

  const addQuestion = (sectionId: string) =>
    setSections(prev => prev.map(s =>
      s.id !== sectionId ? s : {
        ...s,
        expanded: true,
        questions: [...s.questions, {
          id: `q-${Date.now()}`,
          label: '',
          responseTypeId: 'text',
          required: false,
        }],
      }
    ));

  const deleteQuestion = (sectionId: string, qId: string) =>
    setSections(prev => prev.map(s =>
      s.id !== sectionId ? s : { ...s, questions: s.questions.filter(q => q.id !== qId) }
    ));

  const updateQuestion = (sectionId: string, qId: string, label: string) =>
    setSections(prev => prev.map(s =>
      s.id !== sectionId ? s : {
        ...s,
        questions: s.questions.map(q => q.id === qId ? { ...q, label } : q),
      }
    ));

  const updateSectionTitle = (sectionId: string, title: string) =>
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, title } : s));

  const addSection = () =>
    setSections(prev => [
      ...prev,
      {
        id: `section-${Date.now()}`,
        title: 'Untitled Section',
        expanded: true,
        questions: [],
      },
    ]);

  const ADD_ITEMS = [
    { label: 'Question', icon: Plus,     primary: true  },
    { label: 'Section',  icon: Layers,   primary: false },
    { label: 'Page',     icon: FileText, primary: false },
    { label: 'Table',    icon: Table2,   primary: false },
  ] as const;

  return (
    <div className="bg-[#F4F6FA]" style={{ minHeight: '100%' }}>

      {/* ══ STICKY HEADER ══════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-40 bg-white" style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>

        {/* Row 1 — App bar */}
        <div className="px-4 status-bar-aware">
          <div className="flex items-center gap-2 h-12">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(0,0,0,0.07)' }}
              aria-label="Close"
            >
              <X className="w-4 h-4 text-neutral-700" strokeWidth={2.2} />
            </motion.button>

            <p className="flex-1 min-w-0 text-[15px] font-semibold text-neutral-900 truncate px-1">
              Template Editor
            </p>

            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(0,0,0,0.07)' }}
            >
              <Ellipsis className="w-4 h-4 text-neutral-600" strokeWidth={2} />
            </motion.button>
          </div>
        </div>

        {/* Row 2 — Tabs + sync + Undo/Redo + Publish */}
        <div className="px-4 pb-3 flex items-center gap-2">
          {/* Segmented tabs */}
          <div className="flex rounded-[10px] p-[3px] gap-[3px] flex-shrink-0" style={{ background: 'rgba(0,0,0,0.07)' }}>
            {(['build', 'report'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="h-8 px-4 rounded-[8px] text-[13px] font-semibold transition-all"
                style={{
                  background: activeTab === tab ? 'white' : 'transparent',
                  color: activeTab === tab ? '#2563EB' : '#64748B',
                  boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                }}
              >
                {tab === 'build' ? 'Build' : 'Report'}
              </button>
            ))}
          </div>

          {/* Unpublished changes indicator */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <Cloud className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" strokeWidth={1.8} />
            <span className="text-[11px] text-neutral-400 truncate">Unpublished changes</span>
          </div>

          {/* Undo / Redo */}
          <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ color: '#94A3B8' }} aria-label="Undo">
            <Undo2 className="w-4 h-4" strokeWidth={1.8} />
          </button>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ color: '#94A3B8' }} aria-label="Redo">
            <Redo2 className="w-4 h-4" strokeWidth={1.8} />
          </button>

          {/* Publish */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="h-9 px-4 rounded-xl text-white text-[14px] font-semibold"
            style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
          >
            Publish
          </motion.button>
        </div>
      </div>

      {/* ══ SCROLLABLE CONTENT ════════════════════════════════════════════ */}
      <div className="px-4 pt-4 space-y-3" style={{ paddingBottom: 'calc(132px + env(safe-area-inset-bottom))' }}>

        {/* Template name + description card */}
        <div className="rounded-2xl bg-white overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}>
          <div className="px-4 pt-4 pb-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.10em] text-neutral-400 mb-2">Template name</p>
            <input
              type="text"
              value={templateTitle}
              onChange={e => setTemplateTitle(e.target.value)}
              placeholder="Inspection template name…"
              className="w-full text-[22px] font-semibold text-neutral-900 leading-snug outline-none bg-transparent placeholder:text-neutral-300 tracking-tight"
            />
          </div>
          <div className="h-px mx-4 bg-neutral-100" />
          <div className="px-4 py-3">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add a summary…"
              rows={2}
              className="w-full text-[14px] text-neutral-600 leading-relaxed outline-none bg-transparent resize-none placeholder:text-neutral-300"
            />
          </div>
        </div>

        {/* Section cards */}
        {sections.map(section => (
          <SectionCard
            key={section.id}
            section={section}
            onToggle={() => toggleSection(section.id)}
            onOpenTypeSheet={q => openTypeSheet(section.id, q)}
            onAddQuestion={() => addQuestion(section.id)}
            onDeleteQuestion={qId => deleteQuestion(section.id, qId)}
            onUpdateQuestion={(qId, label) => updateQuestion(section.id, qId, label)}
            onUpdateTitle={title => updateSectionTitle(section.id, title)}
          />
        ))}

        {/* Add section */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={addSection}
          className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-semibold"
          style={{ border: '1.5px dashed rgba(37,99,235,0.28)', color: '#2563EB', background: 'rgba(37,99,235,0.03)' }}
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Add Section
        </motion.button>
      </div>

      {/* ══ BOTTOM ADD BAR ═════════════════════════════════════════════════ */}
      <div
        className="fixed left-0 right-0 z-40 bg-white"
        style={{ bottom: '56px', borderTop: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 -2px 16px rgba(0,0,0,0.06)' }}
      >
        <div className="max-w-[480px] mx-auto grid grid-cols-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {ADD_ITEMS.map(({ label, icon: Icon, primary }) => (
            <motion.button
              key={label}
              whileTap={{ scale: 0.91 }}
              className="flex flex-col items-center justify-center gap-1.5 py-3"
              style={{ color: primary ? '#2563EB' : '#94A3B8', borderRight: '1px solid rgba(0,0,0,0.07)' }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: primary ? 'rgba(37,99,235,0.12)' : 'rgba(0,0,0,0.06)' }}>
                <Icon className="w-4 h-4" strokeWidth={primary ? 2.5 : 1.8} style={{ color: primary ? '#2563EB' : '#94A3B8' }} />
              </div>
              <span className="text-[11px] font-medium leading-none">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ══ TYPE OF RESPONSE SHEET ════════════════════════════════════════ */}
      <TypeOfResponseSheet
        isOpen={!!typeSheet?.open}
        current={typeSheet?.current ?? 'text'}
        onClose={() => setTypeSheet(null)}
        onSelect={handleSelectResponseType}
      />
    </div>
  );
}
