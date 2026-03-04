/**
 * inspectionStore — in-memory store for active inspections.
 * Created when "Mulai Inspeksi" is confirmed. Survives navigation
 * within the session. Can be replaced with persistent storage later.
 */

export interface TitleField {
  id: string;
  label: string;
  value: string;
  required?: boolean;
  multiline?: boolean;
  readonly?: boolean;
}

export interface Inspection {
  id: string;
  templateId: string;
  templateName: string;
  site: string;
  status: 'draft' | 'in_progress';
  createdAt: Date;
  titleFields: TitleField[];
  totalPages: number;
  pageTitle: string;
}

// ─── Blueprint ─────────────────────────────────────────────────────────────
// Builds the initial title-page fields for each known template.

function buildTitleFields(
  templateId: string,
  site: string,
): { fields: TitleField[]; totalPages: number } {
  const now = new Date();
  const todayLabel = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timeLabel = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const dateValue = `${todayLabel} at ${timeLabel}`;

  const fields: TitleField[] = [
    { id: 'workshop-name', label: 'Nama Bengkel', value: site, required: true },
    { id: 'inspection-no', label: 'Nomor Inspeksi', value: '' },
    { id: 'prepared-by', label: 'Prepared by', value: 'Alex R.', required: true, readonly: true },
    { id: 'date', label: 'Tanggal', value: dateValue, required: true, readonly: true },
    { id: 'location', label: 'Location', value: site, required: true },
  ];

  if (templateId === 'tpl-002') return { totalPages: 18, fields };
  if (templateId === 'tpl-003') return { totalPages: 20, fields };
  return { totalPages: 21, fields };
}

// ─── Store ─────────────────────────────────────────────────────────────────

let _nextId = 1;
const _store = new Map<string, Inspection>();

export function createInspection(
  templateId: string,
  templateName: string,
  site: string,
): Inspection {
  const id = `insp-${Date.now()}-${_nextId++}`;
  const { fields, totalPages } = buildTitleFields(templateId, site);
  const insp: Inspection = {
    id,
    templateId,
    templateName,
    site,
    status: 'draft',
    createdAt: new Date(),
    titleFields: fields,
    totalPages,
    pageTitle: 'Title Page',
  };
  _store.set(id, insp);
  return insp;
}

export function ensureInspection(
  id: string,
  templateId: string,
  templateName: string,
  site: string,
): Inspection {
  const existing = _store.get(id);
  if (existing) return existing;
  const { fields, totalPages } = buildTitleFields(templateId, site);
  const insp: Inspection = {
    id,
    templateId,
    templateName,
    site,
    status: 'draft',
    createdAt: new Date(),
    titleFields: fields,
    totalPages,
    pageTitle: 'Title Page',
  };
  _store.set(id, insp);
  return insp;
}

export function getInspection(id: string): Inspection | undefined {
  return _store.get(id);
}

export function updateInspectionTitleField(
  inspectionId: string,
  fieldId: string,
  value: string,
): void {
  const insp = _store.get(inspectionId);
  if (!insp) return;
  _store.set(inspectionId, {
    ...insp,
    titleFields: insp.titleFields.map((f) =>
      f.id === fieldId ? { ...f, value } : f,
    ),
  });
}

export function updateInspectionPageTitle(
  inspectionId: string,
  pageTitle: string,
): void {
  const insp = _store.get(inspectionId);
  if (!insp) return;
  _store.set(inspectionId, { ...insp, pageTitle });
}
