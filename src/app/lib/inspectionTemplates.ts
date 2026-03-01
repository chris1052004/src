import {
  AlertCircle,
  Camera,
  ClipboardList,
  Clock,
  FileCheck,
  FileText,
  Fuel,
  Gauge,
  Info,
  MapPin,
  PenSquare,
  ShieldAlert,
  Wifi,
  type LucideIcon,
} from 'lucide-react';

export type TemplateCategory = 'Quality' | 'Safety' | 'Compliance' | 'Operations';

export type TemplateMetric =
  | { kind: 'questions'; value: number; label?: string }
  | { kind: 'time'; value: string }
  | { kind: 'photo_min'; value: number }
  | { kind: 'odometer_required'; value: boolean }
  | { kind: 'fuel_level_required'; value: boolean }
  | { kind: 'gps_required'; value: boolean }
  | { kind: 'vin_required'; value: boolean }
  | { kind: 'signature_required'; value: boolean }
  | { kind: 'doc_upload'; value: boolean }
  | { kind: 'scoring'; value: 'Yes/No' | 'Score' | 'None' }
  | { kind: 'ppe_required'; value: boolean }
  | { kind: 'hazard_reporting'; value: boolean }
  | { kind: 'offline_ready'; value: boolean }
  | { kind: 'approval_required'; value: boolean }
  | { kind: 'plate_required'; value: boolean };

export type TemplateSectionPreview = { name: string; count: number };

export type InspectionTemplate = {
  id: string;
  title: string;
  category: TemplateCategory;
  description: string;
  summary?: string;
  metrics: TemplateMetric[];
  requirements?: string[];
  moreDetails?: string;
  sections?: TemplateSectionPreview[];
};

export type MetricTone = 'neutral' | 'info' | 'alert';

export type TemplateMetricDisplay = {
  kind: TemplateMetric['kind'];
  label: string;
  icon: LucideIcon;
  tone: MetricTone;
};

type MetricKind = TemplateMetric['kind'];

const DEFAULT_PRIORITY: MetricKind[] = [
  'questions',
  'time',
  'photo_min',
  'scoring',
  'odometer_required',
  'fuel_level_required',
  'plate_required',
  'gps_required',
  'vin_required',
  'doc_upload',
  'signature_required',
  'ppe_required',
  'hazard_reporting',
  'offline_ready',
  'approval_required',
];

const CATEGORY_PRIORITY: Record<TemplateCategory, MetricKind[]> = {
  Quality: [
    'questions',
    'time',
    'odometer_required',
    'fuel_level_required',
    'photo_min',
    'plate_required',
    'scoring',
    'offline_ready',
  ],
  Safety: [
    'questions',
    'time',
    'ppe_required',
    'hazard_reporting',
    'photo_min',
    'scoring',
    'offline_ready',
  ],
  Compliance: [
    'questions',
    'time',
    'vin_required',
    'gps_required',
    'doc_upload',
    'signature_required',
    'approval_required',
    'scoring',
  ],
  Operations: [
    'questions',
    'time',
    'scoring',
    'photo_min',
    'offline_ready',
    'plate_required',
    'odometer_required',
    'fuel_level_required',
  ],
};

function isRenderableMetric(metric: TemplateMetric): boolean {
  switch (metric.kind) {
    case 'questions':
      return metric.value > 0;
    case 'time':
      return Boolean(metric.value?.trim());
    case 'photo_min':
      return metric.value > 0;
    case 'scoring':
      return Boolean(metric.value);
    default:
      return metric.value === true;
  }
}

function resolveMetricDisplay(metric: TemplateMetric): TemplateMetricDisplay | null {
  if (!isRenderableMetric(metric)) {
    return null;
  }

  switch (metric.kind) {
    case 'questions':
      return {
        kind: metric.kind,
        label: metric.label ?? `${metric.value} pertanyaan`,
        icon: ClipboardList,
        tone: 'neutral',
      };
    case 'time':
      return { kind: metric.kind, label: metric.value, icon: Clock, tone: 'neutral' };
    case 'photo_min':
      return { kind: metric.kind, label: `Foto min ${metric.value}`, icon: Camera, tone: 'neutral' };
    case 'odometer_required':
      return { kind: metric.kind, label: 'Wajib odometer', icon: Gauge, tone: 'info' };
    case 'fuel_level_required':
      return { kind: metric.kind, label: 'Wajib fuel level', icon: Fuel, tone: 'info' };
    case 'gps_required':
      return { kind: metric.kind, label: 'Wajib GPS', icon: MapPin, tone: 'info' };
    case 'vin_required':
      return { kind: metric.kind, label: 'Wajib VIN', icon: FileText, tone: 'info' };
    case 'signature_required':
      return { kind: metric.kind, label: 'Wajib tanda tangan', icon: PenSquare, tone: 'info' };
    case 'doc_upload':
      return { kind: metric.kind, label: 'Wajib upload dokumen', icon: FileCheck, tone: 'info' };
    case 'scoring':
      return {
        kind: metric.kind,
        label:
          metric.value === 'None'
            ? 'Tanpa skor'
            : metric.value === 'Score'
              ? 'Skoring aktif'
              : 'Skoring Ya/Tidak',
        icon: Info,
        tone: 'neutral',
      };
    case 'ppe_required':
      return { kind: metric.kind, label: 'Wajib PPE', icon: ShieldAlert, tone: 'alert' };
    case 'hazard_reporting':
      return { kind: metric.kind, label: 'Hazard reporting aktif', icon: AlertCircle, tone: 'alert' };
    case 'offline_ready':
      return { kind: metric.kind, label: 'Bisa offline', icon: Wifi, tone: 'neutral' };
    case 'approval_required':
      return { kind: metric.kind, label: 'Perlu approval', icon: FileCheck, tone: 'alert' };
    case 'plate_required':
      return { kind: metric.kind, label: 'Wajib plat nomor', icon: FileText, tone: 'info' };
    default:
      return null;
  }
}

export function getTemplateMetricDisplays(template: InspectionTemplate): TemplateMetricDisplay[] {
  const resolved = template.metrics
    .map(resolveMetricDisplay)
    .filter((metric): metric is TemplateMetricDisplay => Boolean(metric));

  const uniqueByKind = new Map<TemplateMetricDisplay['kind'], TemplateMetricDisplay>();
  for (const metric of resolved) {
    if (!uniqueByKind.has(metric.kind)) {
      uniqueByKind.set(metric.kind, metric);
    }
  }

  const orderedKinds = [...CATEGORY_PRIORITY[template.category], ...DEFAULT_PRIORITY];
  const ordered: TemplateMetricDisplay[] = [];
  const seen = new Set<TemplateMetricDisplay['kind']>();

  for (const kind of orderedKinds) {
    const metric = uniqueByKind.get(kind);
    if (!metric || seen.has(kind)) {
      continue;
    }
    ordered.push(metric);
    seen.add(kind);
  }

  for (const metric of resolved) {
    if (seen.has(metric.kind)) {
      continue;
    }
    ordered.push(metric);
    seen.add(metric.kind);
  }

  return ordered;
}

export function getPrimaryMetrics(template: InspectionTemplate): TemplateMetricDisplay[] {
  const allMetrics = getTemplateMetricDisplays(template);
  const primary: TemplateMetricDisplay[] = [];

  const questionsMetric = allMetrics.find((metric) => metric.kind === 'questions');
  if (questionsMetric) {
    primary.push(questionsMetric);
  }

  const timeMetric = allMetrics.find((metric) => metric.kind === 'time');
  if (timeMetric && !primary.some((metric) => metric.kind === timeMetric.kind)) {
    primary.push(timeMetric);
  }

  for (const metric of allMetrics) {
    if (primary.length >= 2) {
      break;
    }
    if (!primary.some((item) => item.kind === metric.kind)) {
      primary.push(metric);
    }
  }

  return primary.slice(0, 2);
}

export function getChipPreview(requirements?: string[]): {
  visible: string[];
  overflowCount: number;
} {
  const safeRequirements = requirements ?? [];
  return {
    visible: safeRequirements.slice(0, 2),
    overflowCount: Math.max(safeRequirements.length - 2, 0),
  };
}

export function getMetricByKind(
  template: InspectionTemplate,
  kind: TemplateMetric['kind']
): TemplateMetricDisplay | null {
  const metric = template.metrics.find((item) => item.kind === kind);
  if (!metric) {
    return null;
  }
  return resolveMetricDisplay(metric);
}

export const TEMPLATE_CATEGORY_BADGE_VARIANT: Record<
  TemplateCategory,
  'primary' | 'warning' | 'info' | 'default'
> = {
  Quality: 'primary',
  Safety: 'warning',
  Compliance: 'info',
  Operations: 'default',
};

export const inspectionTemplates: InspectionTemplate[] = [
  {
    id: 'pdi-vehicle-check',
    title: 'Pre-Delivery Vehicle Check',
    category: 'Quality',
    description:
      'Validasi final sebelum serah terima unit untuk memastikan kondisi kendaraan layak kirim.',
    summary:
      'Gunakan sebelum serah terima pelanggan untuk cek kualitas unit dan identitas kendaraan.',
    metrics: [
      { kind: 'questions', value: 21 },
      { kind: 'time', value: '15-20 menit' },
      { kind: 'odometer_required', value: true },
      { kind: 'fuel_level_required', value: true },
      { kind: 'photo_min', value: 6 },
      { kind: 'plate_required', value: true },
      { kind: 'scoring', value: 'Score' },
    ],
    requirements: ['Wajib plat nomor', 'Odometer', 'Fuel level', 'Foto wajib'],
    moreDetails: 'Temuan high severity wajib approval supervisor sebelum unit release.',
    sections: [
      { name: 'Data Kendaraan', count: 4 },
      { name: 'Eksterior', count: 6 },
      { name: 'Interior', count: 8 },
      { name: 'Mesin', count: 3 },
    ],
  },
  {
    id: 'monthly-safety',
    title: 'Monthly Safety Inspection',
    category: 'Safety',
    description:
      'Pemeriksaan keselamatan bulanan armada: PPE, hazard reporting, dan perlengkapan darurat.',
    summary:
      'Dirancang untuk deteksi dini risiko keselamatan dan kepatuhan PPE di seluruh unit armada.',
    metrics: [
      { kind: 'questions', value: 15 },
      { kind: 'time', value: '10-15 menit' },
      { kind: 'ppe_required', value: true },
      { kind: 'hazard_reporting', value: true },
      { kind: 'photo_min', value: 3 },
      { kind: 'offline_ready', value: true },
    ],
    requirements: ['PPE check', 'Hazard reporting', 'Foto wajib'],
    moreDetails: 'Emergency kit dan kondisi ban wajib diverifikasi sebelum dispatch.',
    sections: [
      { name: 'PPE', count: 4 },
      { name: 'Peralatan Darurat', count: 3 },
      { name: 'Ban & Rem', count: 4 },
      { name: 'Lampu', count: 4 },
    ],
  },
  {
    id: 'fleet-compliance-audit',
    title: 'Fleet Vehicle Audit',
    category: 'Compliance',
    description:
      'Audit kepatuhan legal untuk VIN, GPS, kelengkapan dokumen, dan jejak persetujuan.',
    summary:
      'Dipakai untuk audit kepatuhan ketika dokumen legal dan evidence bertanda tangan wajib tersedia.',
    metrics: [
      { kind: 'questions', value: 18 },
      { kind: 'time', value: '20-25 menit' },
      { kind: 'vin_required', value: true },
      { kind: 'gps_required', value: true },
      { kind: 'doc_upload', value: true },
      { kind: 'signature_required', value: true },
      { kind: 'approval_required', value: true },
    ],
    requirements: ['VIN wajib', 'GPS', 'Upload dokumen', 'Tanda tangan'],
    moreDetails:
      'Eskalasi wajib untuk pajak kedaluwarsa, mismatch dokumen, atau policy tidak lengkap.',
    sections: [
      { name: 'Dokumen Legal', count: 5 },
      { name: 'Audit Kondisi', count: 6 },
      { name: 'Bukti Foto', count: 4 },
      { name: 'Persetujuan', count: 3 },
    ],
  },
  {
    id: 'quick-visual-check',
    title: 'Quick Visual Check',
    category: 'Operations',
    description:
      'Cek visual cepat sebelum dispatch harian dengan kebutuhan minimal dan tanpa skoring.',
    summary:
      'Cocok untuk pengecekan frekuensi tinggi yang butuh konfirmasi cepat layak jalan.',
    metrics: [
      { kind: 'questions', value: 8 },
      { kind: 'time', value: '5-7 menit' },
      { kind: 'scoring', value: 'None' },
      { kind: 'offline_ready', value: true },
    ],
    requirements: ['Foto opsional'],
    sections: [
      { name: 'Eksterior Cepat', count: 3 },
      { name: 'Kebersihan Kabin', count: 2 },
      { name: 'Catatan', count: 3 },
    ],
  },
  {
    id: 'shift-start-ops-check',
    title: 'Shift Start Ops Check',
    category: 'Operations',
    description:
      'Pemeriksaan operasional singkat sebelum pembagian rute, fokus ke poin esensial.',
    metrics: [
      { kind: 'questions', value: 10 },
      { kind: 'time', value: '6-9 menit' },
      { kind: 'plate_required', value: true },
      { kind: 'photo_min', value: 2 },
      { kind: 'scoring', value: 'Yes/No' },
    ],
    requirements: ['Wajib plat nomor', 'Foto wajib'],
    sections: [
      { name: 'Exterior', count: 4 },
      { name: 'Cabin', count: 3 },
      { name: 'Catatan Dispatch', count: 3 },
    ],
  },
  {
    id: 'annual-regulatory-renewal',
    title: 'Annual Regulatory Renewal Audit',
    category: 'Compliance',
    description:
      'Audit tahunan untuk validitas izin, upload dokumen pendukung, dan tanda tangan otorisasi.',
    metrics: [
      { kind: 'questions', value: 24 },
      { kind: 'time', value: '25-30 menit' },
      { kind: 'vin_required', value: true },
      { kind: 'doc_upload', value: true },
      { kind: 'signature_required', value: true },
      { kind: 'approval_required', value: true },
    ],
    requirements: ['VIN wajib', 'Upload dokumen', 'Tanda tangan', 'Perlu approval'],
    moreDetails: 'Lampirkan izin aktif dan bukti asuransi sebelum final submit.',
    sections: [
      { name: 'Status Izin', count: 6 },
      { name: 'Dokumen Asuransi', count: 5 },
      { name: 'Identitas Kendaraan', count: 6 },
      { name: 'Approval', count: 7 },
    ],
  },
];
