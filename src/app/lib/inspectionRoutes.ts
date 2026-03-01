import type { InspectionStatus } from './inspectionData';

type InspectionRouteInput = {
  id: string;
  status: InspectionStatus;
};

export function getInspectionEntryRoute(inspection: InspectionRouteInput): string {
  if (inspection.status === 'In Progress' || inspection.status === 'Draft') {
    return `/app/inspections/${inspection.id}/title`;
  }
  return `/app/inspections/${inspection.id}`;
}
