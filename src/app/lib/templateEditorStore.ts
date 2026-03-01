/**
 * templateEditorStore — singleton in-memory store for template editor state.
 * Covers: custom response sets, action workflow statuses.
 * Survives navigation within the session.
 */

// ─── Types ─────────────────────────────────────────────────────────────────

export type ResponseColor = 'green' | 'amber' | 'red' | 'neutral' | 'blue' | 'purple';

export interface ResponseOption {
  id: string;
  label: string;
  color: ResponseColor;
}

export interface ResponseSet {
  id: string;
  options: ResponseOption[];
  isBuiltIn?: boolean;
}

export interface ActionWorkflowStatus {
  id: string;
  label: string;
  color: string; // hex color
}

// ─── Built-in default sets ─────────────────────────────────────────────────

const BUILT_IN_SETS: ResponseSet[] = [
  {
    id: 'good-fair-poor',
    isBuiltIn: true,
    options: [
      { id: 'g',  label: 'Good',           color: 'green'   },
      { id: 'f',  label: 'Fair',           color: 'amber'   },
      { id: 'p',  label: 'Poor',           color: 'red'     },
      { id: 'na', label: 'N/A',            color: 'neutral' },
    ],
  },
  {
    id: 'safe-at-risk',
    isBuiltIn: true,
    options: [
      { id: 's',  label: 'Safe',    color: 'green'   },
      { id: 'ar', label: 'At Risk', color: 'red'     },
      { id: 'na', label: 'N/A',     color: 'neutral' },
    ],
  },
  {
    id: 'pass-fail',
    isBuiltIn: true,
    options: [
      { id: 'p',  label: 'Pass', color: 'green'   },
      { id: 'f',  label: 'Fail', color: 'red'     },
      { id: 'na', label: 'N/A',  color: 'neutral' },
    ],
  },
  {
    id: 'yes-no',
    isBuiltIn: true,
    options: [
      { id: 'y',  label: 'Yes', color: 'green'   },
      { id: 'n',  label: 'No',  color: 'red'     },
      { id: 'na', label: 'N/A', color: 'neutral' },
    ],
  },
  {
    id: 'compliant',
    isBuiltIn: true,
    options: [
      { id: 'c',  label: 'Compliant',     color: 'green'   },
      { id: 'nc', label: 'Non-Compliant', color: 'red'     },
      { id: 'na', label: 'N/A',           color: 'neutral' },
    ],
  },
];

export const DEFAULT_WORKFLOW_STATUSES: ActionWorkflowStatus[] = [
  { id: 'todo',        label: 'To Do',       color: '#D97706' },
  { id: 'in-progress', label: 'In Progress', color: '#2563EB' },
  { id: 'blocked',     label: 'Blocked',     color: '#DC2626' },
  { id: 'done',        label: 'Done',        color: '#059669' },
];

// ─── Workflow localStorage helpers ─────────────────────────────────────────

const WORKFLOW_STORAGE_KEY = 'veh_workflow_v1';

function loadWorkflowStatuses(): ActionWorkflowStatus[] {
  try {
    const raw = localStorage.getItem(WORKFLOW_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ActionWorkflowStatus[];
  } catch {}
  return [...DEFAULT_WORKFLOW_STATUSES];
}

// ─── Module-level state ────────────────────────────────────────────────────

let _sets: ResponseSet[]              = [...BUILT_IN_SETS];
let _statuses: ActionWorkflowStatus[] = loadWorkflowStatuses();
let _nextSetCounter                   = 1;
let _nextStatusCounter                = 1;

// ─── Response Sets API ─────────────────────────────────────────────────────

export function getResponseSets(): ResponseSet[] {
  return _sets;
}

export function getResponseSetById(id: string): ResponseSet | undefined {
  return _sets.find(s => s.id === id);
}

export function saveResponseSet(set: ResponseSet): void {
  const idx = _sets.findIndex(s => s.id === set.id);
  if (idx >= 0) {
    _sets = _sets.map(s => (s.id === set.id ? set : s));
  } else {
    _sets = [..._sets, set];
  }
}

export function generateSetId(): string {
  return `custom-${Date.now()}-${_nextSetCounter++}`;
}

/** Derive a short display label for a response set (e.g. "Good/Fair") */
export function getSetShortLabel(set: ResponseSet): string {
  const nonNA = set.options.filter(o => o.id !== 'na' && o.label !== 'N/A');
  return nonNA.slice(0, 2).map(o => o.label).join('/') || 'Custom';
}

// ─── Workflow Statuses API ─────────────────────────────────────────────────

export function getWorkflowStatuses(): ActionWorkflowStatus[] {
  return _statuses;
}

export function setWorkflowStatuses(statuses: ActionWorkflowStatus[]): void {
  _statuses = [...statuses];
  try { localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(statuses)); } catch {}
}

export function generateStatusId(): string {
  return `status-${Date.now()}-${_nextStatusCounter++}`;
}
