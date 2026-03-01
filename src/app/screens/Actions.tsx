import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Flag,
  Link2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Tag,
  Trash2,
  User2,
  UserPlus,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';
import { BottomSheet } from '../components/BottomSheet';
import { ScrollChipsRow } from '../components/ScrollChipsRow';
import { appConfig, canUseActions } from '../lib/appConfig';
import { inspectionTemplates } from '../lib/inspectionTemplates';
import {
  type ActionWorkflowStatus,
  generateStatusId,
  getWorkflowStatuses,
  setWorkflowStatuses,
} from '../lib/templateEditorStore';
import {
  type ActionItem,
  type ActionPriority,
  type CreateActionPayload,
  getActions,
  createAction as storeCreateAction,
  updateAction as storeUpdateAction,
} from '../lib/actionStore';

/* ─── Types ──────────────────────────────────────────────────────────────── */
// ActionItem, ActionPriority imported from '../lib/actionStore'

type FilterStatus = string; // dynamic — matches workflow status labels

// Initial seed data lives in actionStore.ts

const PRIORITY_STYLE: Record<ActionPriority, string> = {
  High:   'text-danger-red   bg-danger-red/10   border-danger-red/25',
  Medium: 'text-warning-amber bg-warning-amber/10 border-warning-amber/25',
  Low:    'text-primary-blue  bg-primary-blue/10  border-primary-blue/20',
};

const PRIORITY_COLOR: Record<ActionPriority, string> = {
  High: '#DC2626',
  Medium: '#D97706',
  Low: '#2563EB',
};

/* ─── Helper: MiniSheet (z-80/90 — sits on top of ActionDetailSheet z-65) ── */

function MiniSheet({
  isOpen,
  onClose,
  title,
  children,
  height = '50%',
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  height?: string;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="ms-bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[80] bg-black/40"
            onClick={onClose}
          />
          <motion.div
            key="ms-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 340 }}
            className="fixed inset-x-0 bottom-0 z-[90] max-w-[480px] mx-auto rounded-t-[24px] bg-white"
            style={{
              maxHeight: height,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.20)',
            }}
          >
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-9 h-1 rounded-full bg-neutral-200" />
            </div>
            <div className="px-5 py-3 flex items-center justify-between border-b border-neutral-100 flex-shrink-0">
              <h2 className="text-[16px] font-semibold text-neutral-900">{title}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-neutral-500" strokeWidth={2} />
              </button>
            </div>
            <div
              className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4"
              style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 24px)' }}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── SelectTemplateSheet ────────────────────────────────────────────────── */

function SelectTemplateSheet({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (templateId: string) => void;
}) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      inspectionTemplates.filter(
        t =>
          !search.trim() ||
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="st-bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-black/40"
            onClick={onClose}
          />
          <motion.div
            key="st-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-[90] max-w-[480px] mx-auto rounded-t-[28px] bg-white"
            style={{
              maxHeight: '88vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -8px 48px rgba(0,0,0,0.16)',
            }}
          >
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-9 h-1 rounded-full bg-neutral-200" />
            </div>
            <div className="px-5 py-3 flex items-center justify-between flex-shrink-0">
              <h2 className="text-[17px] font-semibold text-neutral-900">Select a template</h2>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-neutral-500" strokeWidth={2} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {filtered.map(t => (
                <motion.button
                  key={t.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { onSelect(t.id); onClose(); }}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-neutral-50 transition-colors"
                  style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,99,235,0.08)' }}>
                    <ClipboardList className="w-5 h-5" style={{ color: '#2563EB' }} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-neutral-900 truncate">{t.title}</p>
                    <p className="text-[12px] text-neutral-500 truncate mt-0.5">{t.description}</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Author Alex R.</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-300 flex-shrink-0" strokeWidth={2} />
                </motion.button>
              ))}
              {filtered.length === 0 && (
                <div className="py-14 text-center">
                  <p className="text-[14px] text-neutral-400">No templates found for "{search}"</p>
                </div>
              )}
            </div>

            <div className="px-4 pt-3 flex-shrink-0 bg-white" style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}>
              <div className="flex items-center gap-2.5 h-11 px-3.5 rounded-xl" style={{ background: 'rgba(0,0,0,0.06)' }}>
                <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" strokeWidth={1.8} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search templates"
                  className="flex-1 bg-transparent text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none"
                />
                {search && (
                  <button onClick={() => setSearch('')}>
                    <X className="w-3.5 h-3.5 text-neutral-400" strokeWidth={2} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── WorkflowSettingsSheet ──────────────────────────────────────────────── */

function WorkflowSettingsSheet({
  isOpen,
  statuses,
  onClose,
  onChange,
}: {
  isOpen: boolean;
  statuses: ActionWorkflowStatus[];
  onClose: () => void;
  onChange: (updated: ActionWorkflowStatus[]) => void;
}) {
  const [local, setLocal] = useState<ActionWorkflowStatus[]>(statuses);
  const [newLabel, setNewLabel] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');

  const syncLocal = (updated: ActionWorkflowStatus[]) => {
    setLocal(updated);
    setWorkflowStatuses(updated);
    onChange(updated);
  };

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    syncLocal([...local, { id: generateStatusId(), label: newLabel.trim(), color: '#64748B' }]);
    setNewLabel('');
  };

  const handleDelete = (id: string) => syncLocal(local.filter(s => s.id !== id));

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    const copy = [...local];
    [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
    syncLocal(copy);
  };

  const handleMoveDown = (idx: number) => {
    if (idx === local.length - 1) return;
    const copy = [...local];
    [copy[idx], copy[idx + 1]] = [copy[idx + 1], copy[idx]];
    syncLocal(copy);
  };

  const handleRenameSave = () => {
    if (!editingId || !editingLabel.trim()) { setEditingId(null); return; }
    syncLocal(local.map(s => (s.id === editingId ? { ...s, label: editingLabel.trim() } : s)));
    setEditingId(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="ws-bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[80] bg-black/40" onClick={onClose} />
          <motion.div
            key="ws-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-[90] max-w-[480px] mx-auto rounded-t-[28px] bg-white"
            style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 -8px 48px rgba(0,0,0,0.16)' }}
          >
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0"><div className="w-9 h-1 rounded-full bg-neutral-200" /></div>
            <div className="px-5 py-3 flex items-center justify-between border-b border-neutral-100 flex-shrink-0">
              <h2 className="text-[17px] font-semibold text-neutral-900">Manage Workflow</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center"><X className="w-4 h-4 text-neutral-500" strokeWidth={2} /></button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4 space-y-2" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 24px)' }}>
              {local.map((s, idx) => (
                <div key={s.id} className="flex items-center gap-2 h-12 rounded-xl px-3 bg-white" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  {editingId === s.id ? (
                    <input autoFocus value={editingLabel} onChange={e => setEditingLabel(e.target.value)} onBlur={handleRenameSave} onKeyDown={e => { if (e.key === 'Enter') handleRenameSave(); }} className="flex-1 text-[14px] font-medium text-neutral-900 outline-none bg-transparent" />
                  ) : (
                    <span className="flex-1 text-[14px] font-medium text-neutral-800 cursor-text" onClick={() => { setEditingId(s.id); setEditingLabel(s.label); }}>{s.label}</span>
                  )}
                  <button onClick={() => handleMoveUp(idx)} disabled={idx === 0} className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30" style={{ color: '#94A3B8' }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 9V3M3 6l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <button onClick={() => handleMoveDown(idx)} disabled={idx === local.length - 1} className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30" style={{ color: '#94A3B8' }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 3v6M9 6l-3 3-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ color: '#DC2626' }}><Trash2 className="w-3.5 h-3.5" strokeWidth={2} /></button>
                </div>
              ))}
              <div className="flex items-center gap-2 h-12 rounded-xl px-3" style={{ border: '1.5px dashed rgba(37,99,235,0.30)', background: 'rgba(37,99,235,0.02)' }}>
                <Plus className="w-4 h-4 flex-shrink-0" style={{ color: '#2563EB' }} strokeWidth={2.5} />
                <input value={newLabel} onChange={e => setNewLabel(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }} placeholder="Add status…" className="flex-1 text-[14px] text-neutral-700 placeholder:text-neutral-400 outline-none bg-transparent" />
                {newLabel.trim() && <button onClick={handleAdd} className="text-[13px] font-semibold" style={{ color: '#2563EB' }}>Add</button>}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── ActionDetailSheet ──────────────────────────────────────────────────── */

function ActionDetailSheet({
  action,
  workflowStatuses,
  onClose,
  onStatusChange,
  onLinkTemplate,
  onUnlinkTemplate,
  onWorkflowSettingsOpen,
  onActionUpdate,
}: {
  action: ActionItem | null;
  workflowStatuses: ActionWorkflowStatus[];
  onClose: () => void;
  onStatusChange: (actionId: string, statusId: string) => void;
  onLinkTemplate: (actionId: string, templateId: string) => void;
  onUnlinkTemplate: (actionId: string) => void;
  onWorkflowSettingsOpen: () => void;
  onActionUpdate: (actionId: string, updates: Partial<ActionItem>) => void;
}) {
  const [detailTab, setDetailTab] = useState<'details' | 'activity'>('details');
  const [showStatusSheet, setShowStatusSheet] = useState(false);
  const [showSelectTemplate, setShowSelectTemplate] = useState(false);
  const [inspectionsExpanded, setInspectionsExpanded] = useState(true);
  const [sharedWithExpanded, setSharedWithExpanded] = useState(false);

  // Editable content items
  const [editingItems, setEditingItems] = useState(false);
  const [draftItems, setDraftItems] = useState<string[]>([]);

  // Field picker sheets
  const [showPrioritySheet, setShowPrioritySheet] = useState(false);
  const [showDueDateSheet, setShowDueDateSheet] = useState(false);
  const [showAssigneeSheet, setShowAssigneeSheet] = useState(false);
  const [showSiteSheet, setShowSiteSheet] = useState(false);
  const [showAssetSheet, setShowAssetSheet] = useState(false);
  const [showLabelsSheet, setShowLabelsSheet] = useState(false);
  const [showAddPersonSheet, setShowAddPersonSheet] = useState(false);

  // Temp inputs for sheets
  const [tempDueDate, setTempDueDate] = useState('');
  const [tempAssignee, setTempAssignee] = useState('');
  const [tempSite, setTempSite] = useState('');
  const [tempAsset, setTempAsset] = useState('');
  const [tempLabel, setTempLabel] = useState('');
  const [tempPerson, setTempPerson] = useState('');

  if (!action) return null;

  const currentStatus = workflowStatuses.find(s => s.id === action.workflowStatusId);
  const linkedTemplate = action.linkedTemplateId
    ? inspectionTemplates.find(t => t.id === action.linkedTemplateId)
    : null;

  const labels = action.labels ?? [];
  const sharedWith = action.sharedWith ?? [];

  const startEditItems = () => {
    setDraftItems([...action.contentItems]);
    setEditingItems(true);
  };

  const saveEditItems = () => {
    const cleaned = draftItems.filter(i => i.trim());
    onActionUpdate(action.id, { contentItems: cleaned });
    setEditingItems(false);
  };

  const addItem = () => setDraftItems(prev => [...prev, '']);

  const updateItem = (idx: number, val: string) =>
    setDraftItems(prev => prev.map((item, i) => (i === idx ? val : item)));

  const deleteItem = (idx: number) =>
    setDraftItems(prev => prev.filter((_, i) => i !== idx));

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const avatarColors = ['#2563EB', '#059669', '#D97706', '#7C3AED', '#DC2626'];
  const getAvatarColor = (name: string) => avatarColors[name.charCodeAt(0) % avatarColors.length];

  return (
    <>
      <AnimatePresence>
        {action && (
          <>
            {/* Backdrop */}
            <motion.div
              key="ad-bd"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/40"
              onClick={onClose}
            />

            {/* Sheet — max-height: calc(100% - 50px) keeps it below the status bar */}
            <motion.div
              key="ad-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-[65] max-w-[480px] mx-auto rounded-t-[28px] bg-white"
              style={{
                maxHeight: 'calc(100% - 50px)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 -8px 48px rgba(0,0,0,0.18)',
              }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-0 flex-shrink-0">
                <div className="w-9 h-1 rounded-full bg-neutral-200" />
              </div>

              {/* Header: X | Tabs | ... */}
              <div className="px-4 py-2.5 flex items-center gap-3 flex-shrink-0">
                <button onClick={onClose} className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0" aria-label="Close">
                  <X className="w-4 h-4 text-neutral-500" strokeWidth={2} />
                </button>

                <div className="flex-1 flex rounded-xl p-[3px] gap-[3px]" style={{ background: 'rgba(0,0,0,0.06)' }}>
                  {(['details', 'activity'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setDetailTab(tab)}
                      className="flex-1 h-8 rounded-[9px] text-[13px] font-semibold transition-all capitalize"
                      style={{
                        background: detailTab === tab ? 'white' : 'transparent',
                        color: detailTab === tab ? '#111827' : '#6B7280',
                        boxShadow: detailTab === tab ? '0 1px 3px rgba(0,0,0,0.10)' : 'none',
                      }}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <button className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0" aria-label="More">
                  <MoreHorizontal className="w-4 h-4 text-neutral-500" strokeWidth={2} />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto scrollbar-hide px-4" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 32px)' }}>

                {detailTab === 'details' && (
                  <div className="space-y-4 py-2">

                    {/* Action code + title */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-lg" style={{ background: 'rgba(37,99,235,0.10)', color: '#2563EB' }}>
                          ACTION
                        </span>
                        <span className="text-[13px] font-semibold text-neutral-500">{action.code}</span>
                      </div>
                      <h2 className="text-[17px] font-semibold text-neutral-900 leading-snug">{action.title}</h2>
                      <p className="text-[12px] text-neutral-500 mt-1">{action.source}</p>
                    </div>

                    {/* Status dropdown button */}
                    <div>
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setShowStatusSheet(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                        style={{ background: `${currentStatus?.color ?? '#D97706'}18`, border: `1.5px solid ${currentStatus?.color ?? '#D97706'}30` }}
                      >
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: currentStatus?.color ?? '#D97706' }} />
                        <span className="text-[14px] font-semibold" style={{ color: currentStatus?.color ?? '#D97706' }}>{currentStatus?.label ?? 'To Do'}</span>
                        <ChevronDown className="w-4 h-4" style={{ color: currentStatus?.color ?? '#D97706' }} strokeWidth={2.5} />
                      </motion.button>
                    </div>

                    {/* Content items — editable */}
                    {(action.contentItems.length > 0 || editingItems) && (
                      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#FAFAFA' }}>
                        {/* Header with Edit/Done button */}
                        <div className="flex items-center justify-between px-4 pt-3 pb-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-neutral-400">Details</p>
                          {editingItems ? (
                            <button onClick={saveEditItems} className="flex items-center gap-1 text-[12px] font-semibold" style={{ color: '#2563EB' }}>
                              <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                              Done
                            </button>
                          ) : (
                            <button onClick={startEditItems} className="flex items-center gap-1 text-[12px] font-medium text-neutral-400">
                              <Pencil className="w-3 h-3" strokeWidth={2} />
                              Edit
                            </button>
                          )}
                        </div>

                        {editingItems ? (
                          <div className="px-4 pb-3 space-y-2">
                            {draftItems.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className="text-[12px] text-neutral-400 font-medium w-5 flex-shrink-0">{idx + 1}.</span>
                                <input
                                  autoFocus={idx === draftItems.length - 1 && !item}
                                  value={item}
                                  onChange={e => updateItem(idx, e.target.value)}
                                  placeholder="Type detail…"
                                  className="flex-1 text-[13px] text-neutral-700 bg-white rounded-lg px-3 py-2 outline-none placeholder:text-neutral-300"
                                  style={{ border: '1px solid rgba(0,0,0,0.10)' }}
                                />
                                <button onClick={() => deleteItem(idx)} className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ color: '#DC2626' }}>
                                  <X className="w-3.5 h-3.5" strokeWidth={2} />
                                </button>
                              </div>
                            ))}
                            <button onClick={addItem} className="flex items-center gap-2 h-9 w-full px-3 rounded-lg text-[13px] font-medium" style={{ color: '#2563EB', border: '1.5px dashed rgba(37,99,235,0.25)', background: 'rgba(37,99,235,0.02)' }}>
                              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                              Add detail
                            </button>
                          </div>
                        ) : (
                          <ol className="px-4 pb-3 space-y-1.5">
                            {action.contentItems.map((item, idx) => (
                              <li key={idx} className="flex gap-2 text-[13px] text-neutral-700 leading-relaxed">
                                <span className="text-neutral-400 font-medium flex-shrink-0">{idx + 1}.</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ol>
                        )}
                      </div>
                    )}

                    {/* Empty content items — show add button */}
                    {action.contentItems.length === 0 && !editingItems && (
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={startEditItems}
                        className="w-full h-11 rounded-xl flex items-center justify-center gap-2 text-[13px] font-medium"
                        style={{ border: '1.5px dashed rgba(0,0,0,0.14)', color: '#94A3B8' }}
                      >
                        <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                        Add details
                      </motion.button>
                    )}

                    {/* Divider */}
                    <div className="h-px bg-neutral-100" />

                    {/* Metadata rows */}
                    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>

                      {/* Priority */}
                      <motion.button
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setShowPrioritySheet(true)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
                      >
                        <Flag className="w-4 h-4 text-neutral-400 flex-shrink-0" strokeWidth={1.8} />
                        <span className="text-[13px] text-neutral-500 w-24 flex-shrink-0">Priority</span>
                        <span className={clsx('text-[12px] font-semibold px-2.5 py-[3px] rounded-full border flex items-center gap-1', PRIORITY_STYLE[action.priority])}>
                          <ChevronDown className="w-3 h-3" strokeWidth={2.5} />
                          {action.priority}
                        </span>
                      </motion.button>

                      {/* Due date */}
                      <motion.button
                        whileTap={{ scale: 0.99 }}
                        onClick={() => { setTempDueDate(action.dueDate); setShowDueDateSheet(true); }}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
                      >
                        <Calendar className="w-4 h-4 text-neutral-400 flex-shrink-0" strokeWidth={1.8} />
                        <span className="text-[13px] text-neutral-500 w-24 flex-shrink-0">Due date</span>
                        <span className="text-[13px] font-medium text-neutral-800">{action.dueDate}</span>
                      </motion.button>

                      {/* Assignees */}
                      <motion.button
                        whileTap={{ scale: 0.99 }}
                        onClick={() => { setTempAssignee(action.assignee); setShowAssigneeSheet(true); }}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
                      >
                        <User2 className="w-4 h-4 text-neutral-400 flex-shrink-0" strokeWidth={1.8} />
                        <span className="text-[13px] text-neutral-500 w-24 flex-shrink-0">Assignees</span>
                        <span className="text-[13px] font-medium text-neutral-800">{action.assignee}</span>
                      </motion.button>

                      {/* Site */}
                      <motion.button
                        whileTap={{ scale: 0.99 }}
                        onClick={() => { setTempSite(action.site ?? ''); setShowSiteSheet(true); }}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
                      >
                        <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 16 16" strokeWidth="1.8" stroke="currentColor">
                          <rect x="2" y="2" width="12" height="12" rx="2" />
                          <path d="M2 6h12" />
                          <path d="M6 6v8" />
                        </svg>
                        <span className="text-[13px] text-neutral-500 w-24 flex-shrink-0">Site</span>
                        {action.site ? (
                          <span className="text-[13px] font-medium text-neutral-800">{action.site}</span>
                        ) : (
                          <span className="text-[13px] text-neutral-400">Add site</span>
                        )}
                      </motion.button>

                      {/* Asset */}
                      <motion.button
                        whileTap={{ scale: 0.99 }}
                        onClick={() => { setTempAsset(action.asset ?? ''); setShowAssetSheet(true); }}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
                      >
                        <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 16 16" strokeWidth="1.8" stroke="currentColor">
                          <path d="M8 2l5 3v5l-5 3-5-3V5l5-3z" />
                        </svg>
                        <span className="text-[13px] text-neutral-500 w-24 flex-shrink-0">Asset</span>
                        {action.asset ? (
                          <span className="text-[13px] font-medium text-neutral-800">{action.asset}</span>
                        ) : (
                          <span className="text-[13px] text-neutral-400">Add asset</span>
                        )}
                      </motion.button>

                      {/* Labels */}
                      <motion.button
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setShowLabelsSheet(true)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                      >
                        <Tag className="w-4 h-4 text-neutral-400 flex-shrink-0" strokeWidth={1.8} />
                        <span className="text-[13px] text-neutral-500 w-24 flex-shrink-0">Labels</span>
                        {labels.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {labels.map(lbl => (
                              <span key={lbl} className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(37,99,235,0.10)', color: '#2563EB' }}>
                                {lbl}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[13px] text-neutral-400">Add labels</span>
                        )}
                      </motion.button>
                    </div>

                    {/* INSPECTIONS section */}
                    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                      <button onClick={() => setInspectionsExpanded(!inspectionsExpanded)} className="w-full flex items-center justify-between px-4 py-3 bg-white">
                        <div className="flex items-center gap-2">
                          <ClipboardList className="w-4 h-4 text-neutral-500" strokeWidth={1.8} />
                          <span className="text-[12px] font-semibold uppercase tracking-[0.09em] text-neutral-500">Inspections</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-neutral-400 transition-transform" strokeWidth={2} style={{ transform: inspectionsExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
                      </button>

                      <AnimatePresence initial={false}>
                        {inspectionsExpanded && (
                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                            <div className="px-4 pb-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                              <div className="pt-3">
                                {linkedTemplate ? (
                                  <div className="flex items-center gap-3 rounded-xl px-3 py-3" style={{ border: '1px solid rgba(37,99,235,0.18)', background: 'rgba(37,99,235,0.03)' }}>
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,99,235,0.10)' }}>
                                      <ClipboardList className="w-4 h-4" style={{ color: '#2563EB' }} strokeWidth={1.8} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[13px] font-semibold text-neutral-900 truncate">{linkedTemplate.title}</p>
                                      <p className="text-[11px] text-neutral-500 mt-0.5">{linkedTemplate.category}</p>
                                    </div>
                                    <button onClick={() => onUnlinkTemplate(action.id)} className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                                      <X className="w-3.5 h-3.5 text-neutral-400" strokeWidth={2} />
                                    </button>
                                  </div>
                                ) : (
                                  <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setShowSelectTemplate(true)}
                                    className="w-full rounded-xl flex items-center justify-center gap-2 py-4"
                                    style={{ border: '1.5px dashed rgba(0,0,0,0.15)', background: 'rgba(0,0,0,0.01)' }}
                                  >
                                    <ClipboardList className="w-4 h-4" style={{ color: '#2563EB' }} strokeWidth={1.8} />
                                    <span className="text-[13px] font-medium" style={{ color: '#2563EB' }}>Add a template to start an inspection</span>
                                  </motion.button>
                                )}
                                {linkedTemplate && (
                                  <button onClick={() => setShowSelectTemplate(true)} className="mt-2 w-full text-center text-[12px] font-medium" style={{ color: '#2563EB' }}>
                                    Change template
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Shared With (Links) section */}
                    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                      <button
                        onClick={() => setSharedWithExpanded(!sharedWithExpanded)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-white"
                      >
                        <div className="flex items-center gap-2">
                          <Link2 className="w-4 h-4 text-neutral-500" strokeWidth={1.8} />
                          <span className="text-[12px] font-semibold uppercase tracking-[0.09em] text-neutral-500">Shared With</span>
                          {sharedWith.length > 0 && (
                            <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(37,99,235,0.10)', color: '#2563EB' }}>
                              {sharedWith.length}
                            </span>
                          )}
                        </div>
                        <ChevronDown className="w-4 h-4 text-neutral-400 transition-transform" strokeWidth={2} style={{ transform: sharedWithExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
                      </button>

                      <AnimatePresence initial={false}>
                        {sharedWithExpanded && (
                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                            <div className="px-4 pb-4 space-y-2" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                              <p className="text-[11px] text-neutral-400 pt-3 leading-relaxed">
                                People below can access this action. The creator always has access.
                              </p>

                              {sharedWith.map((person) => (
                                <div key={person} className="flex items-center gap-3 h-11">
                                  <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-bold text-white"
                                    style={{ background: getAvatarColor(person) }}
                                  >
                                    {getInitials(person)}
                                  </div>
                                  <span className="flex-1 text-[13px] font-medium text-neutral-800">{person}</span>
                                  <button
                                    onClick={() => onActionUpdate(action.id, { sharedWith: sharedWith.filter(p => p !== person) })}
                                    className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center"
                                  >
                                    <X className="w-3.5 h-3.5 text-neutral-400" strokeWidth={2} />
                                  </button>
                                </div>
                              ))}

                              <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => { setTempPerson(''); setShowAddPersonSheet(true); }}
                                className="flex items-center gap-2 h-9 px-3 rounded-xl text-[13px] font-medium"
                                style={{ border: '1.5px dashed rgba(37,99,235,0.25)', color: '#2563EB', background: 'rgba(37,99,235,0.02)' }}
                              >
                                <UserPlus className="w-3.5 h-3.5" strokeWidth={2} />
                                Add person
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="pt-2">
                      <p className="text-[12px] text-neutral-400">Created by {action.assignee} · {action.dueDate}</p>
                    </div>
                  </div>
                )}

                {detailTab === 'activity' && (
                  <div className="space-y-3 py-2">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.09em] text-neutral-400">Activity Timeline</p>
                    {action.timeline.length > 0 ? (
                      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
                        {action.timeline.map((entry, i) => (
                          <div key={entry.id} className="flex items-start gap-3 px-4 py-3 bg-white" style={{ borderBottom: i < action.timeline.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                            <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#2563EB' }} />
                            <div>
                              <p className="text-[13px] font-medium text-neutral-800">{entry.label}</p>
                              <p className="text-[11px] text-neutral-400 mt-0.5">{entry.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[13px] text-neutral-400 text-center py-8">No activity yet.</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Status sheet ─── */}
      <BottomSheet isOpen={showStatusSheet} onClose={() => setShowStatusSheet(false)} title="Update Status">
        <div className="space-y-2">
          {workflowStatuses.map(s => (
            <button
              key={s.id}
              onClick={() => { if (action) onStatusChange(action.id, s.id); setShowStatusSheet(false); }}
              className="w-full h-12 rounded-xl border text-[13px] font-semibold flex items-center gap-3 px-4"
              style={{
                background: action?.workflowStatusId === s.id ? `${s.color}12` : 'white',
                borderColor: action?.workflowStatusId === s.id ? `${s.color}50` : 'rgba(0,0,0,0.08)',
                color: action?.workflowStatusId === s.id ? s.color : '#374151',
              }}
            >
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
              {s.label}
              {action?.workflowStatusId === s.id && (
                <span className="ml-auto text-[11px] font-medium" style={{ color: s.color }}>Current</span>
              )}
            </button>
          ))}
          <div className="pt-2 border-t border-neutral-100">
            <button onClick={() => { setShowStatusSheet(false); onWorkflowSettingsOpen(); }} className="w-full h-11 rounded-xl text-[13px] font-medium text-neutral-500 hover:bg-neutral-50">
              Manage workflow statuses…
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* ─── Priority picker ─── */}
      <MiniSheet isOpen={showPrioritySheet} onClose={() => setShowPrioritySheet(false)} title="Set Priority" height="45%">
        <div className="space-y-2">
          {(['High', 'Medium', 'Low'] as ActionPriority[]).map(p => (
            <motion.button
              key={p}
              whileTap={{ scale: 0.97 }}
              onClick={() => { if (action) onActionUpdate(action.id, { priority: p }); setShowPrioritySheet(false); }}
              className="w-full h-13 flex items-center gap-3 px-4 py-3.5 rounded-xl"
              style={{
                background: action?.priority === p ? `${PRIORITY_COLOR[p]}10` : 'white',
                border: `1px solid ${action?.priority === p ? `${PRIORITY_COLOR[p]}40` : 'rgba(0,0,0,0.08)'}`,
              }}
            >
              <Flag className="w-4 h-4 flex-shrink-0" style={{ color: PRIORITY_COLOR[p] }} strokeWidth={1.8} />
              <span className="flex-1 text-[14px] font-semibold" style={{ color: PRIORITY_COLOR[p] }}>{p}</span>
              {action?.priority === p && <Check className="w-4 h-4 flex-shrink-0" style={{ color: PRIORITY_COLOR[p] }} strokeWidth={2.5} />}
            </motion.button>
          ))}
        </div>
      </MiniSheet>

      {/* ─── Due date picker ─── */}
      <MiniSheet isOpen={showDueDateSheet} onClose={() => setShowDueDateSheet(false)} title="Due Date" height="40%">
        <div className="space-y-4">
          <p className="text-[13px] text-neutral-500">Enter the due date for this action:</p>
          <input
            type="text"
            value={tempDueDate}
            onChange={e => setTempDueDate(e.target.value)}
            placeholder="e.g. 5 Mar 2026"
            className="w-full h-12 px-4 rounded-xl text-[15px] text-neutral-900 outline-none"
            style={{ border: '1.5px solid rgba(37,99,235,0.30)', background: 'rgba(37,99,235,0.02)' }}
            autoFocus
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (action && tempDueDate.trim()) onActionUpdate(action.id, { dueDate: tempDueDate.trim() });
              setShowDueDateSheet(false);
            }}
            className="w-full h-12 rounded-xl text-white text-[14px] font-semibold"
            style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
          >
            Save
          </motion.button>
        </div>
      </MiniSheet>

      {/* ─── Assignee picker ─── */}
      <MiniSheet isOpen={showAssigneeSheet} onClose={() => setShowAssigneeSheet(false)} title="Assignee" height="40%">
        <div className="space-y-4">
          <input
            type="text"
            value={tempAssignee}
            onChange={e => setTempAssignee(e.target.value)}
            placeholder="e.g. Andi Nugroho"
            className="w-full h-12 px-4 rounded-xl text-[15px] text-neutral-900 outline-none"
            style={{ border: '1.5px solid rgba(37,99,235,0.30)', background: 'rgba(37,99,235,0.02)' }}
            autoFocus
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (action && tempAssignee.trim()) onActionUpdate(action.id, { assignee: tempAssignee.trim() });
              setShowAssigneeSheet(false);
            }}
            className="w-full h-12 rounded-xl text-white text-[14px] font-semibold"
            style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
          >
            Save
          </motion.button>
        </div>
      </MiniSheet>

      {/* ─── Site picker ─── */}
      <MiniSheet isOpen={showSiteSheet} onClose={() => setShowSiteSheet(false)} title="Site" height="40%">
        <div className="space-y-4">
          <input
            type="text"
            value={tempSite}
            onChange={e => setTempSite(e.target.value)}
            placeholder="e.g. Service Center PIK"
            className="w-full h-12 px-4 rounded-xl text-[15px] text-neutral-900 outline-none"
            style={{ border: '1.5px solid rgba(37,99,235,0.30)', background: 'rgba(37,99,235,0.02)' }}
            autoFocus
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (action) onActionUpdate(action.id, { site: tempSite.trim() || undefined });
              setShowSiteSheet(false);
            }}
            className="w-full h-12 rounded-xl text-white text-[14px] font-semibold"
            style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
          >
            Save
          </motion.button>
        </div>
      </MiniSheet>

      {/* ─── Asset picker ─── */}
      <MiniSheet isOpen={showAssetSheet} onClose={() => setShowAssetSheet(false)} title="Asset" height="40%">
        <div className="space-y-4">
          <input
            type="text"
            value={tempAsset}
            onChange={e => setTempAsset(e.target.value)}
            placeholder="e.g. HRV-08, AV-214"
            className="w-full h-12 px-4 rounded-xl text-[15px] text-neutral-900 outline-none"
            style={{ border: '1.5px solid rgba(37,99,235,0.30)', background: 'rgba(37,99,235,0.02)' }}
            autoFocus
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (action) onActionUpdate(action.id, { asset: tempAsset.trim() || undefined });
              setShowAssetSheet(false);
            }}
            className="w-full h-12 rounded-xl text-white text-[14px] font-semibold"
            style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
          >
            Save
          </motion.button>
        </div>
      </MiniSheet>

      {/* ─── Labels sheet ─── */}
      <MiniSheet isOpen={showLabelsSheet} onClose={() => setShowLabelsSheet(false)} title="Labels" height="55%">
        <div className="space-y-4">
          {/* Existing labels */}
          {labels.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {labels.map(lbl => (
                <div key={lbl} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(37,99,235,0.10)', border: '1px solid rgba(37,99,235,0.20)' }}>
                  <span className="text-[13px] font-semibold" style={{ color: '#2563EB' }}>{lbl}</span>
                  <button onClick={() => onActionUpdate(action.id, { labels: labels.filter(l => l !== lbl) })}>
                    <X className="w-3 h-3" style={{ color: '#2563EB' }} strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new label */}
          <div className="flex gap-2">
            <input
              type="text"
              value={tempLabel}
              onChange={e => setTempLabel(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && tempLabel.trim()) {
                  if (action && !labels.includes(tempLabel.trim())) {
                    onActionUpdate(action.id, { labels: [...labels, tempLabel.trim()] });
                  }
                  setTempLabel('');
                }
              }}
              placeholder="Add a label…"
              className="flex-1 h-11 px-4 rounded-xl text-[14px] text-neutral-900 outline-none"
              style={{ border: '1.5px solid rgba(37,99,235,0.30)', background: 'rgba(37,99,235,0.02)' }}
              autoFocus
            />
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => {
                if (action && tempLabel.trim() && !labels.includes(tempLabel.trim())) {
                  onActionUpdate(action.id, { labels: [...labels, tempLabel.trim()] });
                }
                setTempLabel('');
              }}
              className="h-11 px-4 rounded-xl text-white text-[14px] font-semibold flex-shrink-0"
              style={{ background: '#2563EB' }}
            >
              Add
            </motion.button>
          </div>
          <p className="text-[12px] text-neutral-400">Press Enter or tap Add to add a label.</p>
        </div>
      </MiniSheet>

      {/* ─── Add person to Shared With ─── */}
      <MiniSheet isOpen={showAddPersonSheet} onClose={() => setShowAddPersonSheet(false)} title="Add Person" height="40%">
        <div className="space-y-4">
          <input
            type="text"
            value={tempPerson}
            onChange={e => setTempPerson(e.target.value)}
            placeholder="e.g. Budi Santoso"
            className="w-full h-12 px-4 rounded-xl text-[15px] text-neutral-900 outline-none"
            style={{ border: '1.5px solid rgba(37,99,235,0.30)', background: 'rgba(37,99,235,0.02)' }}
            autoFocus
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (action && tempPerson.trim() && !sharedWith.includes(tempPerson.trim())) {
                onActionUpdate(action.id, { sharedWith: [...sharedWith, tempPerson.trim()] });
              }
              setShowAddPersonSheet(false);
            }}
            className="w-full h-12 rounded-xl text-white text-[14px] font-semibold"
            style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
          >
            Add
          </motion.button>
        </div>
      </MiniSheet>

      {/* ─── Select Template ─── */}
      <SelectTemplateSheet
        isOpen={showSelectTemplate}
        onClose={() => setShowSelectTemplate(false)}
        onSelect={templateId => {
          if (action) onLinkTemplate(action.id, templateId);
          setShowSelectTemplate(false);
        }}
      />
    </>
  );
}

/* ─── CreateActionSheet ──────────────────────────────────────────────────── */

function CreateActionSheet({
  isOpen,
  onClose,
  workflowStatuses,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  workflowStatuses: ActionWorkflowStatus[];
  onSubmit: (payload: CreateActionPayload) => void;
}) {
  const [title, setTitle] = useState('');
  const [statusId, setStatusId] = useState('');
  const [priority, setPriority] = useState<ActionPriority>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState('');
  const [source, setSource] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setStatusId(workflowStatuses[0]?.id ?? '');
      setPriority('Medium');
      setDueDate('');
      setAssignee('');
      setSource('');
    }
  }, [isOpen, workflowStatuses]);

  const canSubmit = title.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      title: title.trim(),
      workflowStatusId: statusId || (workflowStatuses[0]?.id ?? ''),
      priority,
      dueDate: dueDate.trim() || undefined,
      assignee: assignee.trim() || undefined,
      source: source.trim() || undefined,
    });
  };

  const activeStatusId = statusId || workflowStatuses[0]?.id;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="ca-bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-black/40"
            onClick={onClose}
          />
          <motion.div
            key="ca-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-[75] max-w-[480px] mx-auto rounded-t-[28px] bg-white"
            style={{
              maxHeight: '92svh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -8px 48px rgba(0,0,0,0.18)',
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-9 h-1 rounded-full bg-neutral-200" />
            </div>

            {/* Header */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-neutral-100 flex-shrink-0">
              <h2 className="text-[17px] font-semibold text-neutral-900">Tindakan Baru</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-neutral-500" strokeWidth={2} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4 space-y-5">
              {/* Title */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.09em] text-neutral-400 block mb-2">
                  Judul <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  autoFocus
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && canSubmit) handleSubmit(); }}
                  placeholder="Apa yang perlu dilakukan?"
                  className="w-full h-12 px-4 rounded-xl text-[15px] text-neutral-900 outline-none"
                  style={{ border: '1.5px solid rgba(37,99,235,0.25)', background: 'rgba(37,99,235,0.02)' }}
                />
              </div>

              {/* Status */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.09em] text-neutral-400 block mb-2">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {workflowStatuses.map(s => {
                    const sel = activeStatusId === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setStatusId(s.id)}
                        className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-[13px] font-semibold transition-all"
                        style={{
                          background: sel ? `${s.color}15` : 'rgba(0,0,0,0.04)',
                          border: sel ? `1.5px solid ${s.color}40` : '1.5px solid transparent',
                          color: sel ? s.color : '#6B7280',
                        }}
                      >
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: sel ? s.color : '#9CA3AF' }}
                        />
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.09em] text-neutral-400 block mb-2">
                  Prioritas
                </label>
                <div className="flex gap-2">
                  {(['High', 'Medium', 'Low'] as ActionPriority[]).map(p => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={clsx(
                        'flex-1 h-9 rounded-xl text-[13px] font-semibold border transition-colors',
                        priority === p
                          ? PRIORITY_STYLE[p]
                          : 'bg-neutral-50 text-neutral-400 border-transparent'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due date */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.09em] text-neutral-400 block mb-2">
                  Tenggat{' '}
                  <span className="font-normal normal-case tracking-normal text-neutral-300">(opsional)</span>
                </label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  placeholder="e.g. 5 Mar 2026"
                  className="w-full h-12 px-4 rounded-xl text-[15px] text-neutral-900 outline-none"
                  style={{ border: '1.5px solid rgba(0,0,0,0.10)', background: 'rgba(0,0,0,0.02)' }}
                />
              </div>

              {/* Assignee */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.09em] text-neutral-400 block mb-2">
                  Penanggung Jawab{' '}
                  <span className="font-normal normal-case tracking-normal text-neutral-300">(opsional)</span>
                </label>
                <input
                  type="text"
                  value={assignee}
                  onChange={e => setAssignee(e.target.value)}
                  placeholder="e.g. Riko Pratama"
                  className="w-full h-12 px-4 rounded-xl text-[15px] text-neutral-900 outline-none"
                  style={{ border: '1.5px solid rgba(0,0,0,0.10)', background: 'rgba(0,0,0,0.02)' }}
                />
              </div>

              {/* Source */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.09em] text-neutral-400 block mb-2">
                  Sumber Inspeksi{' '}
                  <span className="font-normal normal-case tracking-normal text-neutral-300">(opsional)</span>
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={e => setSource(e.target.value)}
                  placeholder="e.g. PDI Avanza 2024 - Dealer Sunter"
                  className="w-full h-12 px-4 rounded-xl text-[15px] text-neutral-900 outline-none"
                  style={{ border: '1.5px solid rgba(0,0,0,0.10)', background: 'rgba(0,0,0,0.02)' }}
                />
              </div>
            </div>

            {/* Footer */}
            <div
              className="px-5 flex-shrink-0 bg-white"
              style={{
                borderTop: '1px solid rgba(0,0,0,0.08)',
                paddingTop: '12px',
                paddingBottom: 'max(env(safe-area-inset-bottom), 24px)',
              }}
            >
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full h-12 rounded-xl text-white text-[15px] font-semibold disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
              >
                Buat Tindakan
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Main screen ────────────────────────────────────────────────────────── */

export default function Actions() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('All');
  const [actions, setActions] = useState<ActionItem[]>(() => getActions());
  const [workflowStatuses, setWorkflowStatusesState] = useState<ActionWorkflowStatus[]>(
    () => getWorkflowStatuses()
  );
  const [activeAction, setActiveAction] = useState<ActionItem | null>(null);
  const [showWorkflowSettings, setShowWorkflowSettings] = useState(false);
  const [showCreateAction, setShowCreateAction] = useState(false);

  const FILTERS: FilterStatus[] = ['All', ...workflowStatuses.map(s => s.label)];

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();
    return actions.filter(item => {
      const matchSearch =
        item.title.toLowerCase().includes(keyword) ||
        item.source.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword);
      const currentStatus = workflowStatuses.find(s => s.id === item.workflowStatusId);
      const matchFilter = activeFilter === 'All' || currentStatus?.label === activeFilter;
      return matchSearch && matchFilter;
    });
  }, [actions, search, activeFilter, workflowStatuses]);

  const handleStatusChange = (actionId: string, statusId: string) => {
    storeUpdateAction(actionId, { workflowStatusId: statusId });
    setActions(prev => prev.map(a => (a.id === actionId ? { ...a, workflowStatusId: statusId } : a)));
    setActiveAction(prev => (prev?.id === actionId ? { ...prev, workflowStatusId: statusId } : prev));
  };

  const handleLinkTemplate = (actionId: string, templateId: string) => {
    storeUpdateAction(actionId, { linkedTemplateId: templateId });
    setActions(prev => prev.map(a => (a.id === actionId ? { ...a, linkedTemplateId: templateId } : a)));
    setActiveAction(prev => prev?.id === actionId ? { ...prev, linkedTemplateId: templateId } : prev);
  };

  const handleUnlinkTemplate = (actionId: string) => {
    storeUpdateAction(actionId, { linkedTemplateId: undefined });
    setActions(prev => prev.map(a => (a.id === actionId ? { ...a, linkedTemplateId: undefined } : a)));
    setActiveAction(prev => prev?.id === actionId ? { ...prev, linkedTemplateId: undefined } : prev);
  };

  const handleActionUpdate = (actionId: string, updates: Partial<ActionItem>) => {
    storeUpdateAction(actionId, updates);
    setActions(prev => prev.map(a => (a.id === actionId ? { ...a, ...updates } : a)));
    setActiveAction(prev => (prev?.id === actionId ? { ...prev, ...updates } : prev));
  };

  const handleWorkflowChange = (updated: ActionWorkflowStatus[]) => {
    setWorkflowStatusesState(updated);
    if (activeFilter !== 'All' && !updated.find(s => s.label === activeFilter)) {
      setActiveFilter('All');
    }
  };

  const handleCreateAction = (payload: CreateActionPayload) => {
    const newAction = storeCreateAction(payload);
    setActions(prev => [newAction, ...prev]);
    setShowCreateAction(false);
  };

  if (!canUseActions) {
    return (
      <div className="bg-background min-h-full">
        <div className="sticky top-0 z-20 status-bar-aware px-4 pb-3 border-b border-divider/50 bg-white">
          <h1 className="text-[17px] font-semibold tracking-tight">Tindakan</h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">Fitur enterprise dealer 100+ cabang</p>
        </div>
        <div className="px-4 py-8">
          <div className="rounded-2xl border border-divider/60 bg-white p-4">
            <p className="text-[15px] font-semibold text-foreground">Fitur belum aktif untuk akun ini</p>
            <p className="text-[13px] text-muted-foreground mt-1.5 leading-6">
              Tindakan digunakan untuk monitoring temuan CRO oleh tim HO. Saat ini akun{' '}
              <span className="font-medium text-foreground">{appConfig.orgName}</span> memiliki{' '}
              <span className="font-medium text-foreground">{appConfig.orgSize}</span> personel terdaftar.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-full">
      {/* ── Sticky header: title + summary + filters + search ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-neutral-200">
        <div className="status-bar-aware px-4 pb-2">
          <h1 className="text-[17px] font-semibold tracking-tight text-neutral-900">Tindakan</h1>
        </div>

      {/* Summary pill */}
      <div className="px-4 pt-3 pb-2">
        <div className="h-8 rounded-lg border border-neutral-200 bg-white px-3 inline-flex items-center gap-2 text-[12px]">
          <span className="font-medium text-neutral-800">{filtered.length} tindakan</span>
          {workflowStatuses.map(s => {
            const count = actions.filter(a => a.workflowStatusId === s.id).length;
            if (!count) return null;
            return (
              <span key={s.id} className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                <span className="text-neutral-500">{count} {s.label}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Filter chips */}
      <ScrollChipsRow
        items={FILTERS}
        activeItem={activeFilter}
        onSelect={setActiveFilter}
        className="px-4 pb-2"
      />

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2.5 h-10 px-3.5 rounded-xl" style={{ background: 'rgba(0,0,0,0.05)' }}>
          <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" strokeWidth={1.8} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search actions…"
            className="flex-1 bg-transparent text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <X className="w-3.5 h-3.5 text-neutral-400" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      </div>{/* /sticky header */}

      {/* Actions list */}
      <div className="px-4 space-y-3 pb-[calc(80px+env(safe-area-inset-bottom,0px))]">
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-[14px] text-neutral-400">Belum ada tindakan</p>
          </div>
        )}
        {filtered.map(item => {
          const status = workflowStatuses.find(s => s.id === item.workflowStatusId);
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveAction(item)}
              className="w-full text-left rounded-2xl bg-white overflow-hidden flex"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)' }}
            >
              {/* Status color strip */}
              <div className="w-1 flex-shrink-0" style={{ background: status?.color ?? '#D97706' }} />

              <div className="flex-1 px-4 py-3.5 min-w-0">
                {/* Top row: code + priority */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-neutral-400 tracking-wide">{item.code}</span>
                  <span
                    className={clsx('text-[11px] font-semibold px-2 py-0.5 rounded-full border', PRIORITY_STYLE[item.priority])}
                  >
                    {item.priority}
                  </span>
                </div>

                {/* Title */}
                <p className="text-[14px] font-semibold text-neutral-900 leading-snug line-clamp-2">{item.title}</p>

                {/* Source */}
                <p className="text-[12px] text-neutral-500 mt-1 truncate">{item.source}</p>

                {/* Bottom row: status + due date + assignee */}
                <div className="flex items-center gap-3 mt-2.5">
                  <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: status?.color ?? '#D97706' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: status?.color ?? '#D97706' }} />
                    {status?.label ?? 'To Do'}
                  </span>
                  <span className="text-[11px] text-neutral-400">·</span>
                  <span className="text-[11px] text-neutral-500">{item.dueDate}</span>
                  <span className="text-[11px] text-neutral-400">·</span>
                  <span className="text-[11px] text-neutral-500 truncate">{item.assignee}</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Action detail sheet */}
      <ActionDetailSheet
        action={activeAction}
        workflowStatuses={workflowStatuses}
        onClose={() => setActiveAction(null)}
        onStatusChange={handleStatusChange}
        onLinkTemplate={handleLinkTemplate}
        onUnlinkTemplate={handleUnlinkTemplate}
        onWorkflowSettingsOpen={() => setShowWorkflowSettings(true)}
        onActionUpdate={handleActionUpdate}
      />

      {/* FAB: Tambah Tindakan */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => setShowCreateAction(true)}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-primary-blue flex items-center justify-center"
        style={{ boxShadow: '0 4px 20px rgba(37,99,235,0.40)' }}
        aria-label="Tambah tindakan"
      >
        <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
      </motion.button>

      {/* Workflow settings */}
      <WorkflowSettingsSheet
        isOpen={showWorkflowSettings}
        statuses={workflowStatuses}
        onClose={() => setShowWorkflowSettings(false)}
        onChange={handleWorkflowChange}
      />

      {/* Create action */}
      <CreateActionSheet
        isOpen={showCreateAction}
        onClose={() => setShowCreateAction(false)}
        workflowStatuses={workflowStatuses}
        onSubmit={handleCreateAction}
      />
    </div>
  );
}
