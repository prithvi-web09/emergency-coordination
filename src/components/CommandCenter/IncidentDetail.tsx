import React, { useMemo } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { rankRecommendedResources } from '../../utils/distance';
import type { IncidentStatus } from '../../types/emergency';
import {
  Sparkles,
  MapPin,
  User,
  ArrowRight,
  Truck,
  AlertTriangle,
} from 'lucide-react';

export const IncidentDetail: React.FC = () => {
  const {
    selectedIncident,
    resources,
    advanceIncidentStatus,
    setIncidentStatus,
    assignResource,
  } = useEmergency();

  const recommendedResources = useMemo(() => {
    if (!selectedIncident) return [];
    return rankRecommendedResources(
      selectedIncident.location,
      selectedIncident.requiredResourceType,
      resources
    );
  }, [selectedIncident, resources]);

  if (!selectedIncident) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center rounded-2xl border border-slate-800 bg-slate-900/40">
        <AlertTriangle className="h-10 w-10 text-slate-600 mb-3" />
        <h3 className="text-sm font-semibold text-slate-300">No Incident Selected</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Select an incident from the map or queue to inspect priority details and dispatch units.
        </p>
      </div>
    );
  }

  const workflowStages: IncidentStatus[] = [
    'REPORTED',
    'VERIFIED',
    'RESOURCE ASSIGNED',
    'RESPONDING',
    'RESOLVED',
  ];

  const currentStageIndex = workflowStages.indexOf(selectedIncident.status);

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md overflow-hidden shadow-2xl p-5">
      {/* Top Bar: ID and Status */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-lg font-black text-rose-400">
              {selectedIncident.id}
            </span>
            <span className="rounded bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-xs font-bold text-white">
              {selectedIncident.type}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Reported: {selectedIncident.reportedAt}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <span className="text-slate-300 font-medium">{selectedIncident.location.address}</span>
            <span className="text-slate-600">•</span>
            <User className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <span>{selectedIncident.reporterName || 'Field Reporter'}</span>
          </div>
        </div>

        {/* Current Status Pill */}
        <div className="text-right">
          <span
            className={`inline-block text-xs font-mono font-black uppercase px-3 py-1 rounded-lg border ${
              selectedIncident.status === 'RESOLVED'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                : 'bg-rose-950/80 text-rose-300 border-rose-700/60'
            }`}
          >
            {selectedIncident.status}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="mt-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
          Dispatch Incident Log
        </span>
        <p className="text-xs text-slate-200 leading-relaxed">
          {selectedIncident.description}
        </p>
      </div>

      {/* AI Priority Simulation Box */}
      <div className="mt-4 rounded-xl border border-rose-500/30 bg-gradient-to-br from-rose-950/30 via-slate-950/50 to-slate-950/80 p-4 relative overflow-hidden">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                AI Priority Engine
              </span>
              <span className="text-sm font-black font-mono tracking-wider text-rose-400">
                {selectedIncident.priority} PRIORITY
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            Severity: {selectedIncident.severity}
          </span>
        </div>

        <div className="mt-2.5 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 font-sans">
          <span className="text-slate-400 font-semibold">Reason: </span>
          {selectedIncident.priorityReason}
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
          <span>* Prototype simulation of AI multi-factor triage prioritization</span>
          <span className="text-cyan-400 font-mono">
            Target Unit: {selectedIncident.requiredResourceType}
          </span>
        </div>
      </div>

      {/* Response Workflow Pipeline */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Response Workflow Pipeline
          </span>
          {currentStageIndex < workflowStages.length - 1 && (
            <button
              onClick={() => advanceIncidentStatus(selectedIncident.id)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-800/40 px-2.5 py-1 rounded-lg transition-colors"
            >
              <span>Advance to Next Stage</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* 5-Stage Stepper Buttons */}
        <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
          {workflowStages.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <button
                key={stage}
                onClick={() => setIncidentStatus(selectedIncident.id, stage)}
                title={`Click to set status to ${stage}`}
                className={`flex flex-col items-center py-2 px-1 rounded-lg text-center transition-all ${
                  isCurrent
                    ? 'bg-rose-600 text-white shadow-md border border-rose-400'
                    : isCompleted
                    ? 'bg-slate-800 text-emerald-300 hover:bg-slate-700'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                }`}
              >
                <span className="text-[9px] font-mono font-bold leading-tight">
                  0{idx + 1}
                </span>
                <span className="text-[10px] font-semibold truncate w-full uppercase mt-0.5">
                  {stage.replace('RESOURCE ASSIGNED', 'ASSIGNED')}
                </span>
                {isCompleted && (
                  <span className="text-[9px] text-emerald-400 font-bold">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommended Resources & Dispatch */}
      <div className="mt-5 border-t border-slate-800/80 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-cyan-400" />
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Recommended Agency Units
            </h4>
          </div>
          {selectedIncident.assignedResourceName && (
            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
              Assigned: {selectedIncident.assignedResourceName}
            </span>
          )}
        </div>

        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {recommendedResources.slice(0, 3).map(({ resource, distanceKm, isTypeMatch }) => {
            const isCurrentAssigned = selectedIncident.assignedResourceId === resource.id;
            const isAvailable = resource.status === 'AVAILABLE';

            return (
              <div
                key={resource.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                  isCurrentAssigned
                    ? 'bg-cyan-950/30 border-cyan-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{resource.name}</span>
                      {isTypeMatch && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                          Match
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="font-mono text-cyan-400">{distanceKm} km away</span>
                      <span>•</span>
                      <span>ETA ~{resource.etaMinutes || 5} min</span>
                      <span>•</span>
                      <span className="text-slate-500 truncate max-w-[140px]">
                        {resource.location.address}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status and Action */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      resource.status === 'AVAILABLE'
                        ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60'
                        : resource.status === 'DEPLOYED'
                        ? 'bg-blue-950/70 text-blue-400 border border-blue-800/60'
                        : 'bg-amber-950/70 text-amber-400 border border-amber-800/60'
                    }`}
                  >
                    {resource.status}
                  </span>

                  {isCurrentAssigned ? (
                    <span className="px-2.5 py-1 text-xs font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-700/60 rounded-lg">
                      Assigned
                    </span>
                  ) : (
                    <button
                      onClick={() => assignResource(selectedIncident.id, resource.id)}
                      disabled={!isAvailable && selectedIncident.status === 'RESOLVED'}
                      className="px-3 py-1 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-500 active:scale-95 text-white shadow-md border border-rose-400/40 transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Assign Resource
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
