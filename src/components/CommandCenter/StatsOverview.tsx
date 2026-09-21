import React from 'react';
import { AlertCircle, Flame, Truck, Activity } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

export const StatsOverview: React.FC = () => {
  const { stats } = useEmergency();

  const statItems = [
    {
      label: 'ACTIVE INCIDENTS',
      value: stats.activeIncidents,
      icon: AlertCircle,
      textColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      subtext: 'Unresolved emergencies requiring coordination',
    },
    {
      label: 'CRITICAL INCIDENTS',
      value: stats.criticalIncidents,
      icon: Flame,
      textColor: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      subtext: 'Life-safety priority requiring immediate dispatch',
      badge: stats.criticalIncidents > 0 ? 'ALERT' : 'NORMAL',
    },
    {
      label: 'AVAILABLE RESOURCES',
      value: stats.availableResources,
      icon: Truck,
      textColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      subtext: 'Units staged and ready for immediate deployment',
    },
    {
      label: 'ACTIVE RESPONSES',
      value: stats.activeResponses,
      icon: Activity,
      textColor: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      subtext: 'Vehicles & teams engaged on active scenes',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={`relative overflow-hidden rounded-xl border ${item.borderColor} bg-slate-900/80 p-4 backdrop-blur-md shadow-md transition-all hover:border-slate-700`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                  {item.label}
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${item.textColor}`}>
                    {item.value}
                  </span>
                  {item.badge && (
                    <span className="rounded bg-rose-500/20 border border-rose-500/40 px-1.5 py-0.5 text-[9px] font-bold text-rose-300 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
              <div className={`rounded-lg ${item.bgColor} p-2.5 border ${item.borderColor}`}>
                <Icon className={`h-5 w-5 ${item.textColor}`} />
              </div>
            </div>
            <p className="mt-2 text-[11px] text-slate-400 truncate">{item.subtext}</p>
          </div>
        );
      })}
    </div>
  );
};
