import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '../Badge';
import { BottomSheet } from '../BottomSheet';
import { Button } from '../Button';
import {
  type InspectionTemplate,
  TEMPLATE_CATEGORY_BADGE_VARIANT,
  getTemplateMetricDisplays,
} from '../../lib/inspectionTemplates';

interface TemplatePreviewSheetProps {
  template: InspectionTemplate | null;
  onClose: () => void;
  onStartInspection: (templateId: string) => void;
}

export function TemplatePreviewSheet({
  template,
  onClose,
  onStartInspection,
}: TemplatePreviewSheetProps) {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [metricsExpanded, setMetricsExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [requirementsExpanded, setRequirementsExpanded] = useState(false);

  useEffect(() => {
    setDescriptionExpanded(false);
    setMetricsExpanded(false);
    setDetailsExpanded(false);
    setRequirementsExpanded(false);
  }, [template?.id]);

  const allMetrics = useMemo(
    () => (template ? getTemplateMetricDisplays(template) : []),
    [template]
  );
  const metricsVisible = metricsExpanded ? allMetrics : allMetrics.slice(0, 6);
  const requirements = template?.requirements ?? [];
  const sections = template?.sections ?? [];
  const subtitle = template?.summary ?? template?.description ?? '';

  const canToggleDescription = (template?.description?.length ?? 0) > 120;
  const canToggleMetrics = allMetrics.length > 6;
  const canToggleRequirements = requirements.length > 4;

  const metricToneClass = {
    neutral: 'text-muted-foreground',
    info: 'text-primary-blue',
    alert: 'text-danger-red',
  } as const;

  return (
    <BottomSheet
      isOpen={Boolean(template)}
      onClose={onClose}
      title="Preview Template"
      contentClassName="pb-6"
      footer={
        template ? (
          <Button
            fullWidth
            className="h-11 text-sm font-medium"
            onClick={() => onStartInspection(template.id)}
          >
            Mulai Inspeksi
          </Button>
        ) : undefined
      }
    >
      {template && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-divider/60 bg-neutral-50 p-3 space-y-1.5">
            <div className="flex items-start gap-2">
              <h3 className="text-base leading-5 flex-1">{template.title}</h3>
              <Badge
                variant={TEMPLATE_CATEGORY_BADGE_VARIANT[template.category]}
                size="sm"
                className="shrink-0"
              >
                {template.category}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
          </section>

          <section className="space-y-2">
            <p className="text-[13px] text-muted-foreground">Deskripsi</p>
            <p
              className={`text-sm text-muted-foreground leading-5 ${
                descriptionExpanded
                  ? ''
                  : '[display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] overflow-hidden'
              }`}
            >
              {template.description}
            </p>
            {canToggleDescription && (
              <button
                type="button"
                className="inline-flex items-center gap-1 text-[12px] font-medium text-primary-blue"
                onClick={() => setDescriptionExpanded((current) => !current)}
              >
                {descriptionExpanded ? 'Ringkas' : 'Baca lengkap'}
                {descriptionExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </section>

          {allMetrics.length > 0 && (
            <section className="space-y-2.5">
              <p className="text-[13px] text-muted-foreground">Metrik</p>
              <div className="grid grid-cols-2 gap-2">
                {metricsVisible.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div
                      key={`${template.id}-metric-${metric.kind}`}
                      className="rounded-xl border border-divider/60 bg-neutral-50 px-2.5 py-2"
                    >
                      <div className={`flex items-center gap-2 min-w-0 ${metricToneClass[metric.tone]}`}>
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="text-[12px] leading-4 truncate">{metric.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {canToggleMetrics && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-primary-blue"
                  onClick={() => setMetricsExpanded((current) => !current)}
                >
                  {metricsExpanded ? 'Tampilkan lebih sedikit' : 'Tampilkan semua metrik'}
                  {metricsExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </section>
          )}

          {template.moreDetails && (
            <section className="space-y-2">
              <button
                type="button"
                className="w-full flex items-center justify-between text-left"
                onClick={() => setDetailsExpanded((current) => !current)}
              >
                <span className="text-[13px] text-muted-foreground">Detail tambahan</span>
                {detailsExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              {detailsExpanded && (
                <p className="text-sm text-muted-foreground leading-5">{template.moreDetails}</p>
              )}
            </section>
          )}

          {requirements.length > 0 && (
            <section className="space-y-2">
              <p className="text-[13px] text-muted-foreground">Kebutuhan</p>
              <div
                className={`flex flex-wrap gap-2 ${
                  requirementsExpanded ? '' : 'max-h-[52px] overflow-hidden'
                }`}
              >
                {requirements.map((requirement) => (
                  <Badge
                    key={`${template.id}-preview-${requirement}`}
                    size="sm"
                    variant="default"
                    className="text-[11px]"
                  >
                    {requirement}
                  </Badge>
                ))}
              </div>
              {canToggleRequirements && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-primary-blue"
                  onClick={() => setRequirementsExpanded((current) => !current)}
                >
                  {requirementsExpanded ? 'Tampilkan lebih sedikit' : 'Tampilkan semua kebutuhan'}
                  {requirementsExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </section>
          )}

          {sections.length > 0 && (
            <section className="space-y-2">
              <p className="text-[13px] text-muted-foreground">Preview Section</p>
              <div className="rounded-xl border border-divider/60 divide-y divide-divider/60 overflow-hidden">
                {sections.map((section) => (
                  <div
                    key={`${template.id}-section-${section.name}`}
                    className="flex items-center justify-between px-3 py-2.5 bg-neutral-50"
                  >
                    <span className="text-sm">{section.name}</span>
                    <span className="text-[12px] text-muted-foreground tabular-nums">{section.count}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </BottomSheet>
  );
}
