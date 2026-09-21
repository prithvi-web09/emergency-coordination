export type IncidentType =
  | 'Medical Emergency'
  | 'Fire'
  | 'Flood'
  | 'Accident'
  | 'Infrastructure Hazard'
  | 'Other';

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentStatus =
  | 'REPORTED'
  | 'VERIFIED'
  | 'RESOURCE ASSIGNED'
  | 'RESPONDING'
  | 'RESOLVED';

export type ResourceType =
  | 'Ambulance'
  | 'Fire Unit'
  | 'Medical Team'
  | 'Police Unit'
  | 'Volunteer Team';

export type ResourceStatus = 'AVAILABLE' | 'DEPLOYED' | 'BUSY';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  address: string;
}

export interface Incident {
  id: string; // e.g. INC-1042
  type: IncidentType;
  severity: SeverityLevel;
  priority: PriorityLevel;
  priorityReason: string;
  location: LocationCoordinates;
  description: string;
  status: IncidentStatus;
  reportedAt: string; // ISO string or time string
  assignedResourceId?: string;
  assignedResourceName?: string;
  reporterName?: string;
  requiredResourceType: ResourceType;
}

export interface Resource {
  id: string; // e.g. RES-01
  name: string; // e.g. Ambulance A-12
  type: ResourceType;
  location: LocationCoordinates;
  status: ResourceStatus;
  assignedIncidentId?: string;
  etaMinutes?: number;
  crewCount: number;
  contactCallsign: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string; // formatted e.g. "10:45 AM"
  timeAgo?: string;
  incidentId: string;
  title: string;
  description: string;
  type: 'report' | 'priority' | 'verified' | 'assignment' | 'response' | 'resolved' | 'system';
  severity?: SeverityLevel;
}

export interface DashboardStats {
  activeIncidents: number;
  criticalIncidents: number;
  availableResources: number;
  activeResponses: number;
}
