import React from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import {
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  Truck,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { ActivityEvent } from '../../types/emergency';

export const ActivityFeed: React.FC = () => {
  const { activities, setSelectedIncidentId } = useEmergency();

  const getEventIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'report':
        return <AlertCircle className="h-3.5 w-3.5 text-rose-400" />;
      case 'priority':
        return <Sparkles className="h-3.5 w-3.5 text-amber-400" />;
      case 'verified':
        return <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />;
      case 'assignment':
        return <Truck className="h-3.5 w-3.5 text-cyan-400" />;
      case 'response':
        return <Activity className="h-3.5 w-3.5 text-blue-400" />;
      case 'resolved':
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />;
      default:
        return <Clock className="h-3.5 w-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-rose-500 animate-pulse" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Live Response Activity Feed
          </h3>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.2 rounded-full">
            REAL-TIME LOG
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Showing latest events ({activities.length})
        </span>
      </div>

      {/* Horizontal / Grid Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[160px] overflow-y-auto pr-1">
        {activities.map((event) => (
          <div
            key={event.id}
            onClick={() => setSelectedIncidentId(event.incidentId)}
            className="group flex items-start gap-3 p-2.5 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:bg-slate-950 hover:border-slate-700 cursor-pointer transition-all"
          >
            <div className="mt-0.5 rounded-lg bg-slate-900 p-1.5 border border-slate-800 group-hover:scale-105 transition-transform">
              {getEventIcon(event.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="font-mono text-xs font-bold text-white group-hover:text-rose-400 transition-colors truncate">
                  {event.title}
                </span>
                <span className="font-mono text-[10px] text-slate-400 shrink-0">
                  {event.timestamp}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-1 leading-snug">
                {event.description}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] font-mono text-rose-400/90 font-bold bg-rose-950/40 px-1 py-0.2 rounded border border-rose-900/40">
                  {event.incidentId}
                </span>
                {event.timeAgo && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    • {event.timeAgo}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
