import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Car,
  Armchair,
  Wrench,
  Settings2,
  Flag,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

interface FlaggedItem {
  id: string;
  section: string;
  question: string;
  severity: 'Tinggi' | 'Sedang' | 'Rendah';
  note: string;
}

interface SectionResult {
  id: string;
  title: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  answered: number;
  total: number;
  flagged: number;
  passed: boolean;
}

const mockSections: SectionResult[] = [
  {
    id: '1',
    title: 'Data Kendaraan',
    icon: FileText,
    iconColor: 'text-neutral-500',
    iconBg: 'bg-neutral-100 dark:bg-neutral-800',
    answered: 1,
    total: 1,
    flagged: 0,
    passed: true,
  },
  {
    id: '2',
    title: 'Eksterior',
    icon: Car,
    iconColor: 'text-primary-blue',
    iconBg: 'bg-primary-blue/10',
    answered: 6,
    total: 6,
    flagged: 1,
    passed: false,
  },
  {
    id: '3',
    title: 'Interior',
    icon: Armchair,
    iconColor: 'text-success-green',
    iconBg: 'bg-success-green/10',
    answered: 6,
    total: 6,
    flagged: 0,
    passed: true,
  },
  {
    id: '4',
    title: 'Mesin',
    icon: Wrench,
    iconColor: 'text-warning-amber',
    iconBg: 'bg-warning-amber/10',
    answered: 5,
    total: 5,
    flagged: 1,
    passed: false,
  },
  {
    id: '5',
    title: 'Kaki-kaki',
    icon: Settings2,
    iconColor: 'text-danger-red',
    iconBg: 'bg-danger-red/10',
    answered: 5,
    total: 5,
    flagged: 1,
    passed: false,
  },
];

const mockFlaggedItems: FlaggedItem[] = [
  {
    id: '1',
    section: 'Eksterior',
    question: 'Kondisi kaca depan bebas dari retak atau goresan',
    severity: 'Tinggi',
    note: 'Retak kecil di sisi penumpang ±5 cm',
  },
  {
    id: '2',
    section: 'Mesin',
    question: 'Tidak ada kebocoran cairan (oli, air radiator, minyak rem)',
    severity: 'Sedang',
    note: 'Sedikit rembesan oli di area bawah mesin',
  },
  {
    id: '3',
    section: 'Kaki-kaki',
    question: 'Ban serep dalam kondisi baik dan terisi angin cukup',
    severity: 'Rendah',
    note: 'Tekanan ban serep kurang — 15 psi',
  },
];

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 12 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
    },
  },
};

const severityVariant = {
  Tinggi: 'danger',
  Sedang: 'warning',
  Rendah: 'info',
} as const;

function CircularScore({ score }: { score: number }) {
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - score / 100);
  const color =
    score >= 80 ? 'text-success-green' : score >= 60 ? 'text-warning-amber' : 'text-danger-red';

  return (
    <div className="relative w-28 h-28">
      <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} strokeWidth="8" fill="none" className="text-neutral-200 dark:text-neutral-800" stroke="currentColor" />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          className={color}
          stroke="currentColor"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-semibold leading-none"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {score}%
        </motion.span>
        <span className="text-[10px] text-muted-foreground mt-0.5">Skor</span>
      </div>
    </div>
  );
}

export default function ReviewSummary() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [flaggedExpanded, setFlaggedExpanded] = useState(true);

  const totalAnswered = mockSections.reduce((s, x) => s + x.answered, 0);
  const totalQuestions = mockSections.reduce((s, x) => s + x.total, 0);
  const totalFlagged = mockFlaggedItems.length;
  const score = Math.round(((totalAnswered - totalFlagged) / totalAnswered) * 100);
  const passedSections = mockSections.filter((s) => s.passed).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-divider/50 px-4 status-bar-aware"
      >
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.8} />
          </motion.button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px]">Review & Submit</h1>
            <p className="text-xs text-muted-foreground">Periksa sebelum kirim</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="px-4 py-4 space-y-3 pb-44"
        variants={stagger.container}
        initial="initial"
        animate="animate"
      >
        {/* Score Card */}
        <motion.div variants={stagger.item}>
          <Card>
            <div className="flex items-center gap-5">
              <CircularScore score={score} />
              <div className="flex-1">
                <h2 className="text-[15px] mb-1">Skor Keseluruhan</h2>
                <p className="text-xs text-muted-foreground mb-3">
                  {totalAnswered} dari {totalQuestions} pertanyaan selesai
                </p>
                <div className="flex gap-2 flex-wrap">
                  <div className="flex items-center gap-1 text-xs text-success-green bg-success-green/10 px-2 py-1 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{passedSections} seksi lulus</span>
                  </div>
                  {totalFlagged > 0 && (
                    <div className="flex items-center gap-1 text-xs text-danger-red bg-danger-red/10 px-2 py-1 rounded-lg">
                      <Flag className="w-3.5 h-3.5" />
                      <span>{totalFlagged} temuan</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={stagger.item} className="grid grid-cols-3 gap-2">
          {[
            { label: 'Selesai', value: totalAnswered, icon: CheckCircle2, color: 'text-success-green', bg: 'bg-success-green/10' },
            { label: 'Temuan', value: totalFlagged, icon: XCircle, color: 'text-danger-red', bg: 'bg-danger-red/10' },
            { label: 'Seksi OK', value: passedSections, icon: AlertCircle, color: 'text-warning-amber', bg: 'bg-warning-amber/10' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="text-center py-3 px-2">
                <div className={`w-8 h-8 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} strokeWidth={2} />
                </div>
                <p className="text-xl leading-none mb-1">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
        </motion.div>

        {/* Section Breakdown */}
        <motion.div variants={stagger.item}>
          <h2 className="text-[13px] text-muted-foreground mb-2 uppercase tracking-wide">
            Per Seksi
          </h2>
          <div className="space-y-2">
            {mockSections.map((section) => {
              const SectionIcon = section.icon;
              return (
                <Card key={section.id} className="py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${section.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <SectionIcon className={`w-4.5 h-4.5 ${section.iconColor}`} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px]">{section.title}</span>
                        <div className="flex items-center gap-1.5">
                          {section.flagged > 0 && (
                            <Badge variant="danger" size="sm">
                              <Flag className="w-2.5 h-2.5 mr-0.5 inline" />
                              {section.flagged}
                            </Badge>
                          )}
                          <Badge variant={section.passed ? 'success' : 'danger'} size="sm">
                            {section.passed ? 'Lulus' : 'Perlu Tindak'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${section.passed ? 'bg-success-green' : 'bg-danger-red'}`}
                            style={{ width: `${(section.answered / section.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {section.answered}/{section.total}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.div>

        {/* Flagged Items */}
        {mockFlaggedItems.length > 0 && (
          <motion.div variants={stagger.item}>
            <button
              className="w-full flex items-center justify-between mb-2"
              onClick={() => setFlaggedExpanded((v) => !v)}
            >
              <h2 className="text-[13px] text-muted-foreground uppercase tracking-wide">
                Temuan ({mockFlaggedItems.length})
              </h2>
              {flaggedExpanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {flaggedExpanded && (
              <div className="space-y-2">
                {mockFlaggedItems.map((item) => (
                  <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <p className="text-[11px] text-muted-foreground mb-0.5">{item.section}</p>
                        <p className="text-[13px] leading-snug">{item.question}</p>
                      </div>
                      <Badge variant={severityVariant[item.severity]} size="sm">
                        {item.severity}
                      </Badge>
                    </div>
                    {item.note && (
                      <p className="text-xs text-muted-foreground bg-neutral-50 dark:bg-neutral-900 px-3 py-2 rounded-lg">
                        {item.note}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Bottom Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-divider/50 px-4 pt-3"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 88px)' }}
      >
        <div className="max-w-md mx-auto space-y-2">
          <Button
            fullWidth
            size="lg"
            onClick={() => navigate(`/app/inspections/${id}/report`)}
          >
            <FileText className="w-4 h-4 mr-2" strokeWidth={1.8} />
            Kirim Inspeksi
          </Button>
          <Button fullWidth size="lg" variant="ghost">
            Simpan sebagai Draft
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
