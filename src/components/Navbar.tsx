import React from 'react';
import {
  ShieldAlert,
  PlusCircle,
  Truck,
  RotateCcw,
  LayoutDashboard,
  Compass,
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

interface NavbarProps {
  currentTab: 'landing' | 'command' | 'resources';
  setCurrentTab: (tab: 'landing' | 'command' | 'resources') => void;
  openReportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openReportModal,
}) => {
  const { resetDemoData, stats } = useEmergency();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Team Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-2.5 text-left group transition-transform focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-700 shadow-md shadow-rose-950/50 border border-rose-400/30 group-hover:scale-105 transition-transform">
              <ShieldAlert className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-wider text-white">
                  AURA<span className="text-rose-500 font-black">OPS</span>
                </span>
                <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-rose-400 border border-rose-500/30 uppercase tracking-wider">
                  Hackstreak 3.0
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 leading-tight">
                Pixel Pirates · Emergency Coordination
              </p>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-slate-800 text-xs text-slate-400 font-mono">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>GRID: SF-METRO-01</span>
            <span className="text-slate-600">|</span>
            <span className="text-rose-400 font-semibold">{stats.criticalIncidents} CRITICAL</span>
          </div>
        </div>

        {/* Navigation Switcher */}
        <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setCurrentTab('landing')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'landing'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Overview</span>
          </button>

          <button
            onClick={() => setCurrentTab('command')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
              currentTab === 'command'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-rose-400" />
            <span>Command Center</span>
            {stats.activeIncidents > 0 && (
              <span className="ml-1 rounded-full bg-rose-500/20 px-1.5 py-0.2 text-[10px] font-bold text-rose-300 border border-rose-500/40">
                {stats.activeIncidents}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('resources')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'resources'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Truck className="h-3.5 w-3.5 text-blue-400" />
            <span>Resources</span>
            <span className="hidden md:inline text-[11px] text-slate-400 font-mono">
              ({stats.availableResources} avail)
            </span>
          </button>
        </nav>

        {/* Action Controls & Demo Helpers */}
        <div className="flex items-center gap-2.5">
          {/* Reset Demo Button */}
          <button
            onClick={resetDemoData}
            title="Reset Mock State to Initial Prototype Setup"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-xs font-medium text-slate-400 hover:text-amber-300 hover:border-amber-500/40 hover:bg-amber-950/20 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>

          {/* Report Emergency Button */}
          <button
            onClick={openReportModal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-950/60 border border-rose-400/40 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Report Emergency</span>
          </button>
        </div>
      </div>
    </header>
  );
};
