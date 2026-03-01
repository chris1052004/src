import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronRight,
  Copy,
  LayoutList,
  Link2,
  Pencil,
  Share2,
  Trash2,
  Users,
  X,
} from 'lucide-react';

export interface TemplateActionsMeta {
  id: string;
  name: string;
  author: string;
  questionCount: number;
  lastModified: string;
}

interface Props {
  template: TemplateActionsMeta | null;
  isBookmarked?: boolean;
  onClose: () => void;
  onStartInspection: (templateId: string) => void;
  onEdit: (templateId: string) => void;
  onDuplicate: (templateId: string) => void;
  onToggleBookmark?: (templateId: string) => void;
  onManageAccess?: (templateId: string) => void;
  onArchive?: (templateId: string) => void;
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function ActionRow({
  icon,
  label,
  sublabel,
  onClick,
  danger = false,
  active = false,
}: {
  icon: ReactNode;
  label: string;
  sublabel?: string;
  onClick: () => void;
  danger?: boolean;
  active?: boolean;
}) {
  const iconColor = danger
    ? 'text-danger-red'
    : active
      ? 'text-primary-blue'
      : 'text-muted-foreground';
  const labelColor = danger
    ? 'text-danger-red'
    : active
      ? 'text-primary-blue'
      : 'text-foreground';

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3.5 text-left active:bg-black/[0.04] transition-colors"
    >
      <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${iconColor}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`block text-[14px] ${labelColor}`}>{label}</span>
        {sublabel && (
          <span className="block text-[11px] text-success-green mt-0.5">{sublabel}</span>
        )}
      </div>
      {!danger && (
        <ChevronRight className="w-4 h-4 text-muted-foreground/35 flex-shrink-0" strokeWidth={1.8} />
      )}
    </button>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <span className="text-[12px] text-foreground/70">{value}</span>
    </div>
  );
}

// ── Share Sub-Sheet ───────────────────────────────────────────────────────────

function ShareSubSheet({
  template,
  onClose,
}: {
  template: TemplateActionsMeta;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const shareLink = `https://gtechaudit.app/templates/${template.id}`;

  function handleCopy() {
    navigator.clipboard.writeText(shareLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-black/30 z-[70]"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 360 }}
        className="fixed bottom-0 left-0 right-0 z-[70] bg-card rounded-t-[24px] shadow-2xl max-w-[480px] mx-auto"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3">
          <div className="w-10 h-1 bg-neutral-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-2 px-5 pt-3 pb-3 border-b border-divider/50">
          <h3 className="flex-1 text-[16px] font-semibold text-foreground">Bagikan template</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-foreground/[0.08]"
            aria-label="Tutup"
          >
            <X className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-3 pb-[max(env(safe-area-inset-bottom),24px)]">
          <p className="text-[13px] text-muted-foreground">
            Bagikan link template{' '}
            <span className="font-semibold text-foreground">{template.name}</span>
          </p>

          {/* Link preview row */}
          <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-foreground/[0.06] border border-divider/40">
            <Link2 className="w-4 h-4 text-muted-foreground flex-shrink-0" strokeWidth={1.8} />
            <span className="flex-1 text-[12px] text-muted-foreground truncate">{shareLink}</span>
          </div>

          <button
            onClick={handleCopy}
            className="w-full h-12 rounded-xl text-white text-[14px] font-semibold flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              background: copied
                ? 'rgb(5, 150, 105)'
                : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              boxShadow: copied
                ? '0 2px 8px rgba(5,150,105,0.28)'
                : '0 2px 8px rgba(37,99,235,0.28)',
            }}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" strokeWidth={2.5} />
                Tersalin!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" strokeWidth={2} />
                Salin Link
              </>
            )}
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ── Archive Confirm Dialog ────────────────────────────────────────────────────

function ArchiveConfirm({
  template,
  onConfirm,
  onCancel,
}: {
  template: TemplateActionsMeta;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-black/50 z-[70]"
        onClick={onCancel}
      />
      <div className="fixed inset-0 flex items-center justify-center px-6 z-[70] pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          className="w-full max-w-[320px] bg-card rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
        >
          <div className="px-5 pt-5 pb-4">
            <div className="w-11 h-11 rounded-xl bg-danger-red/10 flex items-center justify-center mb-4">
              <Trash2 className="w-5 h-5 text-danger-red" strokeWidth={1.8} />
            </div>
            <p className="text-[16px] font-semibold text-foreground">Arsipkan template?</p>
            <p className="text-[13px] text-muted-foreground mt-1.5 leading-snug">
              <span className="font-medium text-foreground">{template.name}</span> akan diarsipkan
              dan tidak muncul di daftar template.
            </p>
          </div>
          <div className="px-5 pb-5 flex gap-2.5">
            <button
              onClick={onCancel}
              className="flex-1 h-11 rounded-xl border border-divider/60 text-[14px] font-semibold text-foreground"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 h-11 rounded-xl bg-danger-red text-white text-[14px] font-semibold"
            >
              Arsipkan
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

// ── Main Sheet ────────────────────────────────────────────────────────────────

export function TemplateActionsSheet({
  template,
  isBookmarked = false,
  onClose,
  onStartInspection,
  onEdit,
  onDuplicate,
  onToggleBookmark,
  onManageAccess,
  onArchive,
}: Props) {
  const [showShare, setShowShare] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [duplicateToast, setDuplicateToast] = useState(false);

  function handleClose() {
    setShowShare(false);
    setShowArchiveConfirm(false);
    onClose();
  }

  function handleDuplicate() {
    if (!template) return;
    onDuplicate(template.id);
    setDuplicateToast(true);
    setTimeout(() => setDuplicateToast(false), 2500);
  }

  function handleArchiveConfirm() {
    if (!template) return;
    onArchive?.(template.id);
    setShowArchiveConfirm(false);
    onClose();
  }

  return (
    <AnimatePresence>
      {template && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/55 z-[60]"
            onClick={handleClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 360 }}
            className="fixed bottom-0 left-0 right-0 z-[60] bg-card rounded-t-[24px] shadow-2xl max-w-[480px] mx-auto max-h-[85svh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-0 flex-shrink-0">
              <div className="w-10 h-1 bg-foreground/[0.15] rounded-full" />
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">

              {/* Template identity header */}
              <div className="px-5 pt-4 pb-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-blue/10 flex items-center justify-center flex-shrink-0">
                  <LayoutList className="w-[18px] h-[18px] text-primary-blue" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-foreground leading-snug">
                    {template.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-primary-blue/10 text-primary-blue">
                      {template.questionCount} pertanyaan
                    </span>
                    <span className="text-[11px] text-muted-foreground/70">
                      {template.author}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-foreground/[0.08] flex-shrink-0 mt-0.5"
                  aria-label="Tutup"
                >
                  <X className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                </button>
              </div>

              {/* Primary CTA */}
              <div className="px-5 pb-4">
                <button
                  onClick={() => {
                    onStartInspection(template.id);
                    onClose();
                  }}
                  className="w-full h-12 rounded-xl text-white text-[14px] font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    boxShadow: '0 2px 8px rgba(37,99,235,0.28)',
                  }}
                >
                  Mulai Inspeksi
                </button>
              </div>

              {/* Secondary actions — SafetyCulture order */}
              <div className="px-5 border-t border-divider/50">
                <ActionRow
                  icon={<Share2 className="w-4 h-4" strokeWidth={1.8} />}
                  label="Bagikan template"
                  onClick={() => setShowShare(true)}
                />
                <div className="border-t border-divider/40" />
                <ActionRow
                  icon={
                    isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4" strokeWidth={1.8} />
                    ) : (
                      <Bookmark className="w-4 h-4" strokeWidth={1.8} />
                    )
                  }
                  label={isBookmarked ? 'Hapus bookmark' : 'Bookmark'}
                  active={isBookmarked}
                  onClick={() => onToggleBookmark?.(template.id)}
                />
                <div className="border-t border-divider/40" />
                <ActionRow
                  icon={<Pencil className="w-4 h-4" strokeWidth={1.8} />}
                  label="Edit template"
                  onClick={() => {
                    onEdit(template.id);
                    onClose();
                  }}
                />
                <div className="border-t border-divider/40" />
                <ActionRow
                  icon={<Users className="w-4 h-4" strokeWidth={1.8} />}
                  label="Kelola akses"
                  onClick={() => {
                    onManageAccess?.(template.id);
                    onClose();
                  }}
                />
                <div className="border-t border-divider/40" />
                <ActionRow
                  icon={<Copy className="w-4 h-4" strokeWidth={1.8} />}
                  label="Duplikat"
                  sublabel={duplicateToast ? '✓ Template diduplikat' : undefined}
                  onClick={handleDuplicate}
                />
              </div>

              {/* Archive — danger */}
              <div className="px-5 border-t border-divider/50">
                <ActionRow
                  icon={<Trash2 className="w-4 h-4" strokeWidth={1.8} />}
                  label="Arsipkan"
                  onClick={() => setShowArchiveConfirm(true)}
                  danger
                />
              </div>

              {/* Metadata */}
              <div className="px-5 border-t border-divider/50 pt-3 pb-[max(env(safe-area-inset-bottom),20px)] space-y-0.5">
                <MetaRow label="Terakhir diubah" value={template.lastModified} />
                <MetaRow label="Terakhir dipublikasikan" value="—" />
                <MetaRow label="Terakhir dipakai" value="Belum pernah" />
              </div>
            </div>
          </motion.div>

          {/* Share sub-sheet */}
          <AnimatePresence>
            {showShare && (
              <ShareSubSheet template={template} onClose={() => setShowShare(false)} />
            )}
          </AnimatePresence>

          {/* Archive confirm dialog */}
          <AnimatePresence>
            {showArchiveConfirm && (
              <ArchiveConfirm
                template={template}
                onConfirm={handleArchiveConfirm}
                onCancel={() => setShowArchiveConfirm(false)}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
