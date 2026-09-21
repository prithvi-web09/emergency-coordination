import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Incident,
  Resource,
  ActivityEvent,
  IncidentStatus,
  IncidentType,
  SeverityLevel,
  ResourceStatus,
  DashboardStats,
  LocationCoordinates,
} from '../types/emergency';
import { INITIAL_INCIDENTS, INITIAL_RESOURCES, INITIAL_ACTIVITY_LOGS } from '../data/mockData';
import { assessIncidentPriority } from '../utils/priorityEngine';

interface EmergencyContextType {
  incidents: Incident[];
  resources: Resource[];
  activities: ActivityEvent[];
  selectedIncident: Incident | null;
  selectedIncidentId: string | null;
  setSelectedIncidentId: (id: string | null) => void;
  mapFilter: string;
  setMapFilter: (filter: string) => void;
  showResourcesOnMap: boolean;
  setShowResourcesOnMap: (show: boolean) => void;
  stats: DashboardStats;
  reportIncident: (data: {
    type: IncidentType;
    severity: SeverityLevel;
    location: LocationCoordinates;
    description: string;
    reporterName?: string;
  }) => Incident;
  advanceIncidentStatus: (incidentId: string) => void;
  setIncidentStatus: (incidentId: string, status: IncidentStatus) => void;
  assignResource: (incidentId: string, resourceId: string) => void;
  updateResourceStatus: (resourceId: string, status: ResourceStatus) => void;
  resetDemoData: () => void;
  toast: { message: string; type: 'success' | 'info' | 'alert' } | null;
  clearToast: () => void;
}

const STORAGE_KEYS = {
  INCIDENTS: 'aura_ops_incidents_v1',
  RESOURCES: 'aura_ops_resources_v1',
  ACTIVITIES: 'aura_ops_activities_v1',
};

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

function getCurrentTimeString(): string {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const minStr = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minStr} ${ampm}`;
}

export const EmergencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from localStorage or fallback to mock data
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
      return stored ? JSON.parse(stored) : INITIAL_INCIDENTS;
    } catch {
      return INITIAL_INCIDENTS;
    }
  });

  const [resources, setResources] = useState<Resource[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RESOURCES);
      return stored ? JSON.parse(stored) : INITIAL_RESOURCES;
    } catch {
      return INITIAL_RESOURCES;
    }
  });

  const [activities, setActivities] = useState<ActivityEvent[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return stored ? JSON.parse(stored) : INITIAL_ACTIVITY_LOGS;
    } catch {
      return INITIAL_ACTIVITY_LOGS;
    }
  });

  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(() => {
    return 'INC-1005'; // Default to critical cardiac arrest incident for immediate demo impact
  });

  const [mapFilter, setMapFilter] = useState<string>('All');
  const [showResourcesOnMap, setShowResourcesOnMap] = useState<boolean>(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'alert' } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Persist changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
    } catch (e) {
      console.warn('Failed to save incidents to localStorage', e);
    }
  }, [incidents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
    } catch (e) {
      console.warn('Failed to save resources to localStorage', e);
    }
  }, [resources]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch (e) {
      console.warn('Failed to save activities to localStorage', e);
    }
  }, [activities]);

  const selectedIncident = useMemo(() => {
    return incidents.find((inc) => inc.id === selectedIncidentId) || null;
  }, [incidents, selectedIncidentId]);

  // Computed dashboard statistics
  const stats: DashboardStats = useMemo(() => {
    const activeIncidents = incidents.filter((i) => i.status !== 'RESOLVED').length;
    const criticalIncidents = incidents.filter(
      (i) => i.priority === 'CRITICAL' && i.status !== 'RESOLVED'
    ).length;
    const availableResources = resources.filter((r) => r.status === 'AVAILABLE').length;
    const activeResponses = resources.filter((r) => r.status === 'DEPLOYED').length;

    return {
      activeIncidents,
      criticalIncidents,
      availableResources,
      activeResponses,
    };
  }, [incidents, resources]);

  // Activity logging helper
  const logActivity = (
    incidentId: string,
    title: string,
    description: string,
    type: ActivityEvent['type'],
    severity?: SeverityLevel
  ) => {
    const newEvent: ActivityEvent = {
      id: 'ACT-' + Date.now().toString().slice(-4),
      timestamp: getCurrentTimeString(),
      timeAgo: 'Just now',
      incidentId,
      title,
      description,
      type,
      severity,
    };
    setActivities((prev) => [newEvent, ...prev.slice(0, 49)]); // Keep last 50 events
  };

  // Report new incident
  const reportIncident = (data: {
    type: IncidentType;
    severity: SeverityLevel;
    location: LocationCoordinates;
    description: string;
    reporterName?: string;
  }): Incident => {
    // Generate next sequential Incident ID
    const nextNum =
      1000 +
      Math.max(
        ...incidents.map((i) => {
          const match = i.id.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        }),
        1006
      ) +
      1;
    const newId = `INC-${nextNum}`;

    const assessment = assessIncidentPriority(data.type, data.severity, data.description);

    const newIncident: Incident = {
      id: newId,
      type: data.type,
      severity: data.severity,
      priority: assessment.priority,
      priorityReason: assessment.reason,
      location: data.location,
      description: data.description,
      status: 'REPORTED',
      reportedAt: getCurrentTimeString(),
      reporterName: data.reporterName || 'Citizen Report',
      requiredResourceType: assessment.recommendedResourceType,
    };

    setIncidents((prev) => [newIncident, ...prev]);
    setSelectedIncidentId(newId);

    logActivity(
      newId,
      `Incident Reported: ${newIncident.id}`,
      `${data.reporterName || 'Citizen'} reported ${data.type} (${data.severity}) at ${data.location.address}`,
      'report',
      data.severity
    );

    logActivity(
      newId,
      `AI Priority: ${assessment.priority}`,
      assessment.reason,
      'priority',
      data.severity
    );

    setToast({
      message: `Emergency reported: ${newIncident.id} assigned Priority ${assessment.priority}`,
      type: 'alert',
    });

    return newIncident;
  };

  // Response Workflow: Set exact status
  const setIncidentStatus = (incidentId: string, nextStatus: IncidentStatus) => {
    const targetIncident = incidents.find((i) => i.id === incidentId);
    if (!targetIncident) return;

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return { ...inc, status: nextStatus };
        }
        return inc;
      })
    );

    // If resolving, free any assigned resource
    if (nextStatus === 'RESOLVED' && targetIncident.assignedResourceId) {
      setResources((prev) =>
        prev.map((res) => {
          if (res.id === targetIncident.assignedResourceId) {
            return { ...res, status: 'AVAILABLE', assignedIncidentId: undefined };
          }
          return res;
        })
      );
    }

    // Log corresponding activity
    const actionMap: Record<IncidentStatus, { title: string; desc: string; type: ActivityEvent['type'] }> = {
      REPORTED: {
        title: 'Status Reset: REPORTED',
        desc: `${incidentId} re-opened to initial reported state.`,
        type: 'report',
      },
      VERIFIED: {
        title: 'Incident Verified',
        desc: `Command dispatcher confirmed priority conditions for ${incidentId}.`,
        type: 'verified',
      },
      'RESOURCE ASSIGNED': {
        title: 'Resource Dispatched',
        desc: `Emergency unit tasked to ${incidentId}.`,
        type: 'assignment',
      },
      RESPONDING: {
        title: 'Response In Progress',
        desc: `Units actively on scene mitigating ${incidentId}.`,
        type: 'response',
      },
      RESOLVED: {
        title: 'Incident Resolved',
        desc: `Operation concluded for ${incidentId}. Perimeter cleared.`,
        type: 'resolved',
      },
    };

    const action = actionMap[nextStatus];
    logActivity(incidentId, action.title, action.desc, action.type, targetIncident.severity);

    setToast({
      message: `${incidentId} transitioned to ${nextStatus}`,
      type: nextStatus === 'RESOLVED' ? 'success' : 'info',
    });
  };

  // Response Workflow: Advance to next step in workflow
  const advanceIncidentStatus = (incidentId: string) => {
    const target = incidents.find((i) => i.id === incidentId);
    if (!target) return;

    const workflowOrder: IncidentStatus[] = [
      'REPORTED',
      'VERIFIED',
      'RESOURCE ASSIGNED',
      'RESPONDING',
      'RESOLVED',
    ];

    const currentIndex = workflowOrder.indexOf(target.status);
    if (currentIndex < workflowOrder.length - 1) {
      const next = workflowOrder[currentIndex + 1];
      setIncidentStatus(incidentId, next);
    }
  };

  // Assign resource to incident
  const assignResource = (incidentId: string, resourceId: string) => {
    const res = resources.find((r) => r.id === resourceId);
    const inc = incidents.find((i) => i.id === incidentId);
    if (!res || !inc) return;

    // Update resource state to DEPLOYED
    setResources((prev) =>
      prev.map((r) => {
        if (r.id === resourceId) {
          return {
            ...r,
            status: 'DEPLOYED',
            assignedIncidentId: incidentId,
          };
        }
        return r;
      })
    );

    // Update incident state to RESOURCE ASSIGNED
    setIncidents((prev) =>
      prev.map((i) => {
        if (i.id === incidentId) {
          return {
            ...i,
            status: 'RESOURCE ASSIGNED',
            assignedResourceId: resourceId,
            assignedResourceName: res.name,
          };
        }
        return i;
      })
    );

    logActivity(
      incidentId,
      `Resource Assigned: ${res.name}`,
      `${res.name} (${res.type}) dispatched to ${inc.location.address}. Estimated ETA: ${res.etaMinutes || 4} mins.`,
      'assignment',
      inc.severity
    );

    setToast({
      message: `Assigned ${res.name} to ${incidentId}. Unit status: DEPLOYED`,
      type: 'success',
    });
  };

  // Update resource status directly (e.g. from resource tracking tab)
  const updateResourceStatus = (resourceId: string, newStatus: ResourceStatus) => {
    setResources((prev) =>
      prev.map((res) => {
        if (res.id === resourceId) {
          return {
            ...res,
            status: newStatus,
            assignedIncidentId: newStatus === 'AVAILABLE' ? undefined : res.assignedIncidentId,
          };
        }
        return res;
      })
    );

    setToast({
      message: `Resource updated to ${newStatus}`,
      type: 'info',
    });
  };

  // Reset demo data
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.INCIDENTS);
    localStorage.removeItem(STORAGE_KEYS.RESOURCES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    setIncidents(INITIAL_INCIDENTS);
    setResources(INITIAL_RESOURCES);
    setActivities(INITIAL_ACTIVITY_LOGS);
    setSelectedIncidentId('INC-1005');
    setMapFilter('All');
    setToast({
      message: 'Demo dataset restored to clean baseline',
      type: 'success',
    });
  };

  return (
    <EmergencyContext.Provider
      value={{
        incidents,
        resources,
        activities,
        selectedIncident,
        selectedIncidentId,
        setSelectedIncidentId,
        mapFilter,
        setMapFilter,
        showResourcesOnMap,
        setShowResourcesOnMap,
        stats,
        reportIncident,
        advanceIncidentStatus,
        setIncidentStatus,
        assignResource,
        updateResourceStatus,
        resetDemoData,
        toast,
        clearToast: () => setToast(null),
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};
