import React, { useState } from 'react';
import { StatsOverview } from './StatsOverview';
import { IncidentMap } from './IncidentMap';
import { IncidentList } from './IncidentList';
import { IncidentDetail } from './IncidentDetail';
import { ActivityFeed } from './ActivityFeed';
import { useEmergency } from '../../context/EmergencyContext';
import { ListOrdered, FileText } from 'lucide-react';

export const CommandCenterView: React.FC = () => {
  const { selectedIncident } = useEmergency();
  const [rightPanelTab, setRightPanelTab] = useState<'detail' | 'queue'>('detail');

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 space-y-4">
      {/* Interactive Hackathon Guide Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-900/40 bg-rose-950/20 px-4 py-2.5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider">
            Live Ops Flow:
          </span>
          <span className="text-xs text-slate-300">
            Citizen Report → AI Priority Assessment → Closest Unit Assigned → Active Response → Incident Resolved
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="text-emerald-400">Ready for Live Demo</span>
        </div>
      </div>

      {/* Top 4 Metrics Row */}
      <StatsOverview />

      {/* Main Command Grid: Left Map, Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left: Live Leaflet Map (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <IncidentMap />
        </div>

        {/* Right: Incident Detail & Queue Switcher (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Panel Tab Switcher */}
          <div className="flex items-center justify-between bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1 w-full">
              <button
                onClick={() => setRightPanelTab('detail')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-bold font-mono transition-all ${
                  rightPanelTab === 'detail'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>
                  {selectedIncident ? `Inspector: ${selectedIncident.id}` : 'Incident Inspector'}
                </span>
              </button>

              <button
                onClick={() => setRightPanelTab('queue')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-bold font-mono transition-all ${
                  rightPanelTab === 'queue'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ListOrdered className="h-3.5 w-3.5" />
                <span>Priority Queue</span>
              </button>
            </div>
          </div>

          {/* Active Right Panel Content */}
          <div className="min-h-[500px]">
            {rightPanelTab === 'detail' ? <IncidentDetail /> : <IncidentList />}
          </div>
        </div>
      </div>

      {/* Bottom Area: Recent Response Activity */}
      <ActivityFeed />
    </div>
  );
};
