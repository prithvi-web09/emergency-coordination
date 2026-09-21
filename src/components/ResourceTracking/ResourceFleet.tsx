import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { ResourceStatus, ResourceType } from '../../types/emergency';
import {
  Truck,
  Shield,
  HeartPulse,
  Flame,
  MapPin,
  Users,
  Search,
} from 'lucide-react';

export const ResourceFleet: React.FC = () => {
  const { resources, updateResourceStatus, setSelectedIncidentId } = useEmergency();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = resources.filter((res) => {
    if (filterType !== 'ALL' && res.type !== filterType) return false;
    if (filterStatus !== 'ALL' && res.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        res.name.toLowerCase().includes(q) ||
        res.location.address.toLowerCase().includes(q) ||
        res.contactCallsign.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'Ambulance':
        return <HeartPulse className="h-5 w-5 text-rose-400" />;
      case 'Fire Unit':
        return <Flame className="h-5 w-5 text-orange-400" />;
      case 'Police Unit':
        return <Shield className="h-5 w-5 text-indigo-400" />;
      case 'Medical Team':
        return <HeartPulse className="h-5 w-5 text-teal-400" />;
      case 'Volunteer Team':
        return <Users className="h-5 w-5 text-emerald-400" />;
      default:
        return <Truck className="h-5 w-5 text-cyan-400" />;
    }
  };

  const getStatusBadgeClass = (status: ResourceStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 ring-1 ring-emerald-500/20';
      case 'DEPLOYED':
        return 'bg-blue-950/80 text-blue-300 border-blue-700/60 ring-1 ring-blue-500/20';
      case 'BUSY':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/60 ring-1 ring-amber-500/20';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Truck className="h-5 w-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-black tracking-wide text-white font-mono uppercase">
              Emergency Resource Fleet Tracking
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time status monitoring, staging positions, and crew deployment controls.
          </p>
        </div>

        {/* Fleet Quick Stats Summary */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
            <span className="text-slate-400 block text-[10px]">TOTAL UNITS</span>
            <span className="text-base font-bold text-white">{resources.length}</span>
          </div>
          <div className="bg-slate-900 border border-emerald-900/40 px-3 py-2 rounded-xl">
            <span className="text-emerald-400 block text-[10px]">AVAILABLE</span>
            <span className="text-base font-bold text-emerald-300">
              {resources.filter((r) => r.status === 'AVAILABLE').length}
            </span>
          </div>
          <div className="bg-slate-900 border border-blue-900/40 px-3 py-2 rounded-xl">
            <span className="text-blue-400 block text-[10px]">DEPLOYED</span>
            <span className="text-base font-bold text-blue-300">
              {resources.filter((r) => r.status === 'DEPLOYED').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="h-4 w-4 text-slate-500 ml-2" />
          <input
            type="text"
            placeholder="Search by resource name, callsign, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        {/* Type & Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 px-1.5">Type:</span>
            {(['ALL', 'Ambulance', 'Fire Unit', 'Police Unit', 'Medical Team', 'Volunteer Team'] as const).map((tp) => (
              <button
                key={tp}
                onClick={() => setFilterType(tp)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono transition-all ${
                  filterType === tp
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tp === 'ALL' ? 'ALL' : tp.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 px-1.5">Status:</span>
            {(['ALL', 'AVAILABLE', 'DEPLOYED', 'BUSY'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono transition-all ${
                  filterStatus === st
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource) => {
          return (
            <div
              key={resource.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md p-5 shadow-xl transition-all hover:border-slate-700 flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Name and Status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center shadow-inner">
                      {getResourceIcon(resource.type)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{resource.name}</h3>
                      <span className="text-xs font-mono text-cyan-400">
                        {resource.type}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-lg border ${getStatusBadgeClass(
                      resource.status
                    )}`}
                  >
                    {resource.status}
                  </span>
                </div>

                {/* Info Fields */}
                <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{resource.location.address}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Crew On-Duty:</span>
                    <span className="font-mono text-slate-200">{resource.crewCount} responders</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Radio Callsign:</span>
                    <span className="font-mono text-cyan-300 font-bold">{resource.contactCallsign}</span>
                  </div>
                  {resource.assignedIncidentId && (
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
                      <span className="text-rose-400 font-bold">Active Assignment:</span>
                      <button
                        onClick={() => setSelectedIncidentId(resource.assignedIncidentId!)}
                        className="font-mono text-rose-300 underline hover:text-rose-200"
                      >
                        {resource.assignedIncidentId}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Override / State Shift Actions */}
              <div className="pt-3 border-t border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1.5">
                  Manual Status Override:
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {(['AVAILABLE', 'DEPLOYED', 'BUSY'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => updateResourceStatus(resource.id, st)}
                      className={`py-1 rounded-lg text-[10px] font-bold font-mono transition-all ${
                        resource.status === st
                          ? 'bg-slate-700 text-white border border-slate-600'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
