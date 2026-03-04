import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  Ellipsis,
  ChevronRight,
  NotebookPen,
  Image,
  SquareCheckBig,
  PenLine,
} from 'lucide-react';
import {
  ensureInspection,
  getInspection,
  updateInspectionTitleField,
  updateInspectionPageTitle,
  type TitleField,
} from '../lib/inspectionStore';
import { INSPECTION_SUMMARIES } from '../lib/inspectionData';

// ─── Field Actions Sheet ───────────────────────────────────────────────────

const ACTIONS = [
  { icon: PenLine,        label: 'Edit nilai',      desc: 'Ubah isi field ini'        },
  { icon: NotebookPen,    label: 'Tambah catatan',  desc: 'Catat observasi tambahan'  },
  { icon: Image,          label: 'Tambah media',    desc: 'Foto atau rekaman video'   },
  { icon: SquareCheckBig, label: 'Buat tindakan',   desc: 'Tetapkan action item'      },
] as const;

function FieldActionsSheet({
  field,
  onClose,
  onEditValue,
}: {
  field: TitleField;
  onClose: () => void;
  onEditValue: () => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-[60]"
        style={{ background: 'rgba(0,0,0,0.36)' }}
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 360 }}
        className="fixed bottom-0 left-0 right-0 z-[60] max-w-[480px] mx-auto rounded-t-[24px] bg-white"
        style={{ boxShadow: '0 -4px 32px rgba(0,0,0,0.12)' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(0,0,0,0.10)' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-3 border-b border-gray-100">
          <p className="text-[14px] font-semibold text-gray-800">{field.label}</p>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100"
            aria-label="Tutup"
          >
            <X className="w-4 h-4 text-gray-500" strokeWidth={2} />
          </button>
        </div>

        {/* Action rows */}
        <div style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 24px)' }}>
          {ACTIONS.map(({ icon: Icon, label: actionLabel, desc }, idx) => {
            const isEditNilai = actionLabel === 'Edit nilai';
            const disabled = isEditNilai && field.readonly;
            return (
              <button
                key={actionLabel}
                onClick={isEditNilai && !disabled ? onEditValue : onClose}
                disabled={disabled}
                className="w-full flex items-center gap-3.5 px-5 py-3.5 active:bg-gray-50 transition-colors disabled:opacity-35"
                style={{ borderBottom: idx < ACTIONS.length - 1 ? '1px solid #F3F4F6' : 'none' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#EFF6FF' }}
                >
                  <Icon className="w-4 h-4" style={{ color: '#2563EB' }} strokeWidth={1.8} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-[14px] font-medium text-gray-800">{actionLabel}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {disabled ? 'Field ini tidak dapat diubah' : desc}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" strokeWidth={1.8} />
              </button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}

// ─── EditableFieldRow ──────────────────────────────────────────────────────

function EditableFieldRow({
  field,
  isEditing,
  onActionsOpen,
  onChange,
  onBlur,
}: {
  field: TitleField;
  isEditing: boolean;
  onActionsOpen: () => void;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const isEmpty = !field.value;
  const displayValue = isEmpty ? 'Ketuk untuk edit' : field.value;

  // Auto-focus when entering edit mode
  if (isEditing && inputRef.current) {
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <div className="flex items-start gap-3 px-4 py-3.5">
      {/* Label + value / input */}
      <div className="flex-1 min-w-0">
        {/* Label row */}
        <div className="flex items-center gap-1 mb-0.5">
          {field.required && (
            <span className="text-red-500 text-[12px] leading-none font-medium">*</span>
          )}
          <span className="text-[12px] font-medium text-gray-500">{field.label}</span>
          {field.readonly && (
            <span
              className="ml-1 text-[10px] px-1.5 py-px rounded-md font-medium"
              style={{ background: '#F3F4F6', color: '#9CA3AF' }}
            >
              otomatis
            </span>
          )}
        </div>

        {/* Edit mode */}
        {isEditing ? (
          field.multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={field.value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              rows={3}
              autoFocus
              className="w-full text-[14px] text-gray-800 leading-snug bg-blue-50 border border-blue-200 rounded-lg px-2 py-1.5 resize-none outline-none focus:border-blue-400"
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={field.value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              autoFocus
              className="w-full text-[14px] text-gray-800 bg-blue-50 border border-blue-200 rounded-lg px-2 py-1 outline-none focus:border-blue-400"
            />
          )
        ) : (
          <p
            className={`text-[14px] leading-snug ${isEmpty ? 'text-gray-300' : 'text-gray-800'} ${field.multiline ? 'whitespace-pre-line' : 'truncate'}`}
          >
            {displayValue}
          </p>
        )}
      </div>

      {/* ⋯ action trigger — hidden while editing */}
      {!isEditing && (
        <button
          onClick={onActionsOpen}
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 active:bg-gray-200 transition-colors"
          style={{ background: '#F3F4F6' }}
          aria-label={`Aksi untuk ${field.label}`}
        >
          <Ellipsis className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

// ─── Page progress bar ─────────────────────────────────────────────────────

function PageProgress({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="h-[3px] rounded-full bg-gray-100 overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${pct}%`, background: '#2563EB' }}
      />
    </div>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────

export default function InspectionTitlePage() {
  const navigate = useNavigate();
  const { id: inspectionId } = useParams();

  const summary = inspectionId
    ? INSPECTION_SUMMARIES.find((item) => item.id === inspectionId)
    : undefined;
  const inspection = inspectionId
    ? getInspection(inspectionId) ??
      (summary
        ? ensureInspection(
            summary.id,
            summary.templateId,
            summary.templateName,
            summary.site
          )
        : null)
    : null;

  // Local field state — synced from store on mount
  const [fields, setFields] = useState<TitleField[]>(
    () => inspection?.titleFields ?? [],
  );

  // Which field's actions sheet is open (fieldId)
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  // Which field is currently in inline-edit mode (fieldId)
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  // Editable page title (shown in header + bottom bar)
  const [pageTitle, setPageTitle] = useState(inspection?.pageTitle ?? 'Title Page');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inspection) {
      setFields(inspection.titleFields);
    }
  }, [inspection?.id]);

  if (!inspection) {
    return (
      <div
        style={{ minHeight: '100%', background: '#F7F7F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <p className="text-[14px] text-gray-400">Inspeksi tidak ditemukan.</p>
      </div>
    );
  }

  const activeField = fields.find((f) => f.id === activeFieldId) ?? null;
  const PAGE = 1;

  function handleFieldChange(fieldId: string, value: string) {
    setFields((prev) => prev.map((f) => f.id === fieldId ? { ...f, value } : f));
  }

  function handleFieldBlur(fieldId: string) {
    const field = fields.find((f) => f.id === fieldId);
    if (field && inspectionId) {
      updateInspectionTitleField(inspectionId, fieldId, field.value);
    }
    setEditingFieldId(null);
  }

  function handleEditValue() {
    setActiveFieldId(null);
    setEditingFieldId(activeFieldId);
  }

  return (
    <div style={{ minHeight: '100%', background: '#F7F7F8', fontFamily: 'inherit' }}>

      {/* ══ Sticky App Bar ════════════════════════════════════════════════════ */}
      <div
        className="sticky top-0 z-40 status-bar-aware bg-white"
        style={{ borderBottom: '1px solid #EDEFF2', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      >
        <div className="flex items-center px-4 h-12 gap-2">
          {/* Close */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#F3F4F6' }}
            aria-label="Tutup"
          >
            <X className="w-4 h-4 text-gray-600" strokeWidth={2.2} />
          </motion.button>

          {/* Centered title + page */}
          <div className="flex-1 text-center">
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                type="text"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                onBlur={() => {
                  const trimmed = pageTitle.trim() || 'Title Page';
                  setPageTitle(trimmed);
                  setIsEditingTitle(false);
                  if (inspectionId) updateInspectionPageTitle(inspectionId, trimmed);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                }}
                autoFocus
                className="w-full text-center text-[15px] font-semibold text-gray-900 leading-tight bg-blue-50 border border-blue-300 rounded-lg px-2 py-0.5 outline-none focus:border-blue-500"
              />
            ) : (
              <button
                onClick={() => {
                  setIsEditingTitle(true);
                  setTimeout(() => titleInputRef.current?.focus(), 0);
                }}
                className="text-[15px] font-semibold text-gray-900 leading-tight underline decoration-dashed decoration-gray-300 underline-offset-2 active:opacity-60 transition-opacity"
              >
                {pageTitle}
              </button>
            )}
            <p className="text-[11px] text-gray-400 mt-[-1px]">
              Page {PAGE}/{inspection.totalPages}
            </p>
          </div>

          {/* Overflow */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#F3F4F6' }}
            aria-label="Menu lainnya"
          >
            <Ellipsis className="w-4 h-4 text-gray-600" strokeWidth={2} />
          </motion.button>
        </div>
      </div>

      {/* ══ Scrollable Content ═════════════════════════════════════════════════ */}
      <div
        className="px-4 pt-4"
        style={{ paddingBottom: 'calc(136px + env(safe-area-inset-bottom))' }}
      >
        {/* Section label */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400 mb-2 px-1">
          Informasi Inspeksi
        </p>

        {/* Grouped field list */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.26 }}
          className="rounded-2xl bg-white overflow-hidden divide-y divide-gray-100"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)' }}
        >
          {fields.map((field) => (
            <EditableFieldRow
              key={field.id}
              field={field}
              isEditing={editingFieldId === field.id}
              onActionsOpen={() => setActiveFieldId(field.id)}
              onChange={(value) => handleFieldChange(field.id, value)}
              onBlur={() => handleFieldBlur(field.id)}
            />
          ))}
        </motion.div>
      </div>

      {/* ══ Sticky Bottom Bar — sits above BottomNav (56px) ══════════════════ */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="fixed left-0 right-0 z-40 max-w-[480px] mx-auto bg-white px-4 pt-3"
        style={{
          bottom: '56px',
          borderTop: '1px solid #EDEFF2',
          boxShadow: '0 -2px 16px rgba(0,0,0,0.06)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
        }}
      >
        {/* Progress meta + bar */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[12px] text-gray-400">
            Page {PAGE} dari {inspection.totalPages}
          </span>
          <span className="text-[12px] font-medium text-gray-500">{pageTitle}</span>
        </div>
        <PageProgress current={PAGE} total={inspection.totalPages} />

        {/* CTA */}
        <div className="flex gap-3 mt-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(-1)}
            className="h-12 px-5 rounded-2xl text-[14px] font-semibold flex-shrink-0"
            style={{ background: '#F3F4F6', color: '#4B5563' }}
          >
            Kembali
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/app/inspections/${inspectionId}`)}
            className="relative flex-1 h-12 rounded-2xl text-[15px] font-bold text-white overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              boxShadow: '0 2px 10px rgba(37,99,235,0.28)',
            }}
          >
            <span className="flex items-center justify-center gap-2">
              Next
              <span className="text-[12px] font-medium text-white/80">
                Page {PAGE + 1}/{inspection.totalPages}
              </span>
            </span>
            <span className="absolute inset-0 pointer-events-none shimmer-slide" aria-hidden="true" />
          </motion.button>
        </div>
      </motion.div>

      {/* ══ Field Actions Sheet ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeField && (
          <FieldActionsSheet
            field={activeField}
            onClose={() => setActiveFieldId(null)}
            onEditValue={handleEditValue}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
