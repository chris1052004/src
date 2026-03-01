import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { TemplateCardCompact } from '../components/template/TemplateCardCompact';
import { TemplatePreviewSheet } from '../components/template/TemplatePreviewSheet';
import { inspectionTemplates, type InspectionTemplate } from '../lib/inspectionTemplates';

export default function CreateTemplate() {
  const navigate = useNavigate();
  const [bookmarkedTemplateIds, setBookmarkedTemplateIds] = useState<string[]>([]);
  const [previewTemplate, setPreviewTemplate] = useState<InspectionTemplate | null>(null);

  const handleStartInspection = (templateId: string) => {
    setPreviewTemplate(null);
    navigate(`/app/inspections/${templateId}/form`);
  };

  const handleToggleBookmark = (templateId: string) => {
    setBookmarkedTemplateIds((current) =>
      current.includes(templateId)
        ? current.filter((id) => id !== templateId)
        : [...current, templateId]
    );
  };

  return (
    <div className="bg-white min-h-full">
      <div className="sticky top-0 z-40 px-4 status-bar-aware bg-white border-b border-divider/50">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl flex items-center justify-center border border-divider/60 hover:bg-neutral-50 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" strokeWidth={2} />
          </motion.button>

          <div className="flex-1">
            <h1 className="text-[16px] font-semibold text-foreground">Pilih Template</h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">Pilih template inspeksi kendaraan</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-8 space-y-3">
        {inspectionTemplates.map((template, idx) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.24 }}
          >
            <TemplateCardCompact
              template={template}
              bookmarked={bookmarkedTemplateIds.includes(template.id)}
              onToggleBookmark={handleToggleBookmark}
              onStartInspection={handleStartInspection}
              onOpenPreview={setPreviewTemplate}
            />
          </motion.div>
        ))}
      </div>

      <TemplatePreviewSheet
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onStartInspection={handleStartInspection}
      />
    </div>
  );
}
