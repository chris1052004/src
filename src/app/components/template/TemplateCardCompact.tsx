import { Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import {
  type InspectionTemplate,
  getPrimaryMetrics,
  getChipPreview,
} from '../../lib/inspectionTemplates';

interface TemplateCardCompactProps {
  template: InspectionTemplate;
  bookmarked: boolean;
  onToggleBookmark: (templateId: string) => void;
  onStartInspection: (templateId: string) => void;
  onOpenPreview: (template: InspectionTemplate) => void;
}

const CATEGORY_META: Record<string, { stripe: string; badge: string; badgeText: string }> = {
  Quality: { stripe: '#10B981', badge: 'rgba(16,185,129,0.10)', badgeText: '#0F766E' },
  Safety: { stripe: '#EF4444', badge: 'rgba(239,68,68,0.10)', badgeText: '#B91C1C' },
  Compliance: { stripe: '#6366F1', badge: 'rgba(99,102,241,0.10)', badgeText: '#4338CA' },
  Operations: { stripe: '#F59E0B', badge: 'rgba(245,158,11,0.12)', badgeText: '#B45309' },
};

const DEFAULT_META = { stripe: '#94A3B8', badge: 'rgba(148,163,184,0.14)', badgeText: '#475569' };

export function TemplateCardCompact({
  template,
  bookmarked,
  onToggleBookmark,
  onStartInspection,
  onOpenPreview,
}: TemplateCardCompactProps) {
  const meta = CATEGORY_META[template.category] ?? DEFAULT_META;
  const primaryMetrics = getPrimaryMetrics(template);
  const { visible: visibleRequirements, overflowCount } = getChipPreview(template.requirements);

  const timeMetric = primaryMetrics.find((metric) => metric.kind === 'time');
  const questionsMetric = primaryMetrics.find((metric) => metric.kind === 'questions');

  return (
    <motion.div
      onClick={() => onOpenPreview(template)}
      className="cursor-pointer rounded-[18px] overflow-hidden bg-white border border-divider/60 shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
    >
      <div className="flex">
        <div className="w-[3px] flex-shrink-0" style={{ background: meta.stripe }} />

        <div className="flex-1 min-w-0 p-4">
          <div className="flex items-start gap-2 mb-1.5">
            <h3 className="text-[15px] font-semibold text-foreground leading-snug flex-1 min-w-0">
              {template.title}
            </h3>
            <span
              className="flex-shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: meta.badge, color: meta.badgeText }}
            >
              {template.category}
            </span>
          </div>

          <p className="text-[12px] text-muted-foreground leading-snug mb-3 truncate">{template.description}</p>

          <div className="flex items-center gap-2.5 flex-wrap mb-3 text-[12px] text-muted-foreground">
            {questionsMetric && <span>{questionsMetric.label}</span>}
            {timeMetric && (
              <>
                <span aria-hidden>&bull;</span>
                <span>{timeMetric.label}</span>
              </>
            )}
          </div>

          {visibleRequirements.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {visibleRequirements.map((requirement) => (
                <span
                  key={requirement}
                  className="text-[11px] text-muted-foreground px-2.5 py-1 rounded-full border border-divider/60"
                >
                  {requirement}
                </span>
              ))}
              {overflowCount > 0 && (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpenPreview(template);
                  }}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-divider/60 text-primary-blue"
                >
                  +{overflowCount}
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={(event) => {
                event.stopPropagation();
                onStartInspection(template.id);
              }}
              className="flex-1 h-11 rounded-xl text-[14px] font-semibold text-white bg-primary-blue"
              aria-label={`Mulai inspeksi: ${template.title}`}
            >
              Mulai Inspeksi
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(event) => {
                event.stopPropagation();
                onToggleBookmark(template.id);
              }}
              className="w-11 h-11 rounded-xl flex items-center justify-center border border-divider/60 bg-white"
              aria-label={`${bookmarked ? 'Hapus bookmark' : 'Bookmark'}: ${template.title}`}
            >
              <Bookmark
                className="w-5 h-5"
                strokeWidth={1.8}
                style={{ color: bookmarked ? '#2563EB' : '#64748B', fill: bookmarked ? '#2563EB' : 'none' }}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
