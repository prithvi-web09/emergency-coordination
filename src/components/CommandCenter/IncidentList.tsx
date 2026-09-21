import React, { useState, useMemo } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import {
  AlertCircle,
  Flame,
  MapPin,
  ChevronRight,
  Shield,
  HeartPulse,
  Droplets,
  Zap,
} from 'lucide-react';
import type { IncidentType, PriorityLevel } from '../../types/emergency';

export const IncidentList: React.FC = () => {
  const { incidents, selectedIncidentId, setSelectedIncidentId } = useEmergency();
  const [filterTab, setFilterTab] = useState<'ALL' | 'ACTIVE' | 'CRITICAL' | 'RESOLVED'>('ACTIVE');

  // Sort incidents by priority weight: CRITICAL (4) > HIGH (3) > MEDIUM (2) > LOW (1)
  // And push RESOLVED to bottom
  const sortedAndFiltered = useMemo(() => {
    const priorityWeight: Record<PriorityLevel, number> = {
      CRITICAL: 4,
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1,
    };

    return incidents
      .filter((inc) => {
        if (filterTab === 'ALL') return true;
        if (filterTab === 'ACTIVE') return inc.status !== 'RESOLVED';
        if (filterTab === 'CRITICAL') return inc.priority === 'CRITICAL' && inc.status !== 'RESOLVED';
        if (filterTab === 'RESOLVED') return inc.status === 'RESOLVED';
        return true;
      })
      .sort((a, b) => {
        // Resolved goes to the bottom
        if (a.status === 'RESOLVED' && b.status !== 'RESOLVED') return 1;
        if (a.status !== 'RESOLVED' && b.status === 'RESOLVED') return -1;
        // Compare priority
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      });
  }, [incidents, filterTab]);

  const getTypeIcon = (type: IncidentType) => {
    switch (type) {
      case 'Medical Emergency':
        return <HeartPulse className="h-4 w-4 text-rose-400" />;
      case 'Fire':
        return <Flame className="h-4 w-4 text-orange-400" />;
      case 'Flood':
        return <Droplets className="h-4 w-4 text-blue-400" />;
      case 'Accident':
        return <AlertCircle className="h-4 w-4 text-amber-400" />;
      case 'Infrastructure Hazard':
        return <Zap className="h-4 w-4 text-yellow-400" />;
      default:
        return <Shield className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-xl">
      {/* Header & Tabs */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Priority Incident Queue
            </h2>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-300 border border-slate-700">
              {sortedAndFiltered.length}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Sorted by Severity</span>
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950/70 rounded-xl border border-slate-800">
          {(['ACTIVE', 'CRITICAL', 'ALL', 'RESOLVED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`py-1 rounded-lg text-[11px] font-bold tracking-tight transition-all text-center ${
                filterTab === tab
                  ? 'bg-slate-800 text-white shadow border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Incident List Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[480px] lg:max-h-[500px]">
        {sortedAndFiltered.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No incidents found in this category.
          </div>
        ) : (
          sortedAndFiltered.map((inc) => {
            const isSelected = inc.id === selectedIncidentId;
            const isCritical = inc.priority === 'CRITICAL' && inc.status !== 'RESOLVED';
            const isResolved = inc.status === 'RESOLVED';

            return (
              <div
                key={inc.id}
                onClick={() => setSelectedIncidentId(inc.id)}
                className={`group relative cursor-pointer rounded-xl p-3.5 border transition-all ${
                  isSelected
                    ? 'border-rose-500/80 bg-rose-950/20 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/50'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950/90'
                }`}
              >
                {/* Top Row: ID, Badges */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white group-hover:text-rose-400 transition-colors">
                      {inc.id}
                    </span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300">
                      {getTypeIcon(inc.type)}
                      <span className="font-medium text-[11px]">{inc.type}</span>
                    </div>
                  </div>

                  {/* Priority Badge */}
                  <span
                    className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded border ${
                      isResolved
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                        : isCritical
                        ? 'bg-rose-950/80 text-rose-300 border-rose-700/60 animate-pulse'
                        : inc.priority === 'HIGH'
                        ? 'bg-orange-950/60 text-orange-300 border-orange-800/60'
                        : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                    }`}
                  >
                    {isResolved ? 'RESOLVED' : `${inc.priority} PRIORITY`}
                  </span>
                </div>

                {/* Description Excerpt */}
                <p className="text-xs text-slate-300 line-clamp-2 mb-2 leading-relaxed">
                  {inc.description}
                </p>

                {/* Bottom Metadata: Location & Workflow Status */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1 truncate max-w-[200px]">
                    <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                    <span className="truncate">{inc.location.address}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        inc.status === 'RESOLVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : inc.status === 'RESPONDING'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : inc.status === 'RESOURCE ASSIGNED'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : inc.status === 'VERIFIED'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {inc.status}
                    </span>
                    <ChevronRight
                      className={`h-3.5 w-3.5 text-slate-500 transition-transform ${
                        isSelected ? 'translate-x-0.5 text-rose-400' : 'group-hover:translate-x-0.5'
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
