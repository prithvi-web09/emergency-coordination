import React from 'react';
import {
  AlertTriangle,
  Radio,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface LandingPageProps {
  onOpenCommandCenter: () => void;
  onOpenReportModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenCommandCenter,
  onOpenReportModal,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      {/* Subtle Background Tactical Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(#334155 1px, transparent 1px), radial-gradient(#1e293b 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px',
        }}
      />

      {/* Decorative Glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />

      {/* Hero Section */}
      <div className="relative mx-auto max-w-5xl text-center pt-6 sm:pt-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-950/40 px-3.5 py-1.5 text-xs font-semibold text-rose-300 shadow-sm backdrop-blur-sm mb-6">
          <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
          <span className="font-mono uppercase tracking-wider">Hackstreak 3.0 Prototype</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">Team Pixel Pirates</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl font-sans uppercase">
          <span className="block text-slate-100">ONE PLATFORM.</span>
          <span className="block text-rose-500">ONE LIVE MAP.</span>
          <span className="block bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
            ONE COORDINATED RESPONSE.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg sm:text-xl text-slate-300 leading-relaxed font-light">
          Connect communities, volunteers and agencies through real-time incident reporting,
          resource tracking and coordinated response.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenReportModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-rose-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-rose-950/70 border border-rose-400/40 hover:bg-rose-500 active:scale-95 transition-all"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>REPORT EMERGENCY</span>
          </button>

          <button
            onClick={onOpenCommandCenter}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-bold text-slate-100 shadow-lg shadow-black/40 hover:bg-slate-700/80 hover:border-slate-600 active:scale-95 transition-all"
          >
            <Radio className="h-4 w-4 text-cyan-400" />
            <span>OPEN COMMAND CENTER</span>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Narrative Problem-to-Solution Strip (Crucial for Judges) */}
      <div className="relative mx-auto mt-16 max-w-6xl w-full">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
              The Paradigm Shift: From Chaos to Unified Operations
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 items-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-950/60 border border-red-900/30">
              <div className="h-8 w-8 rounded-lg bg-red-950/80 text-red-400 flex items-center justify-center mb-2 font-mono text-xs font-bold border border-red-800/40">
                01
              </div>
              <span className="text-[11px] font-bold text-red-300 uppercase tracking-tight">
                Fragmented Info
              </span>
              <span className="text-[10px] text-slate-400 mt-1">Siloed calls & chaos</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="h-8 w-8 rounded-lg bg-slate-800 text-cyan-300 flex items-center justify-center mb-2 font-mono text-xs font-bold border border-cyan-800/40">
                02
              </div>
              <span className="text-[11px] font-bold text-slate-200 uppercase tracking-tight">
                Centralized Hub
              </span>
              <span className="text-[10px] text-slate-400 mt-1">Single operational picture</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="h-8 w-8 rounded-lg bg-slate-800 text-amber-300 flex items-center justify-center mb-2 font-mono text-xs font-bold border border-amber-800/40">
                03
              </div>
              <span className="text-[11px] font-bold text-slate-200 uppercase tracking-tight">
                Instant Report
              </span>
              <span className="text-[10px] text-slate-400 mt-1">Rapid geo-located intake</span>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="h-8 w-8 rounded-lg bg-slate-800 text-indigo-300 flex items-center justify-center mb-2 font-mono text-xs font-bold border border-indigo-800/40">
                04
              </div>
              <span className="text-[11px] font-bold text-slate-200 uppercase tracking-tight">
                Resource Tracking
              </span>
              <span className="text-[10px] text-slate-400 mt-1">Live fleet readiness</span>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="h-8 w-8 rounded-lg bg-slate-800 text-emerald-300 flex items-center justify-center mb-2 font-mono text-xs font-bold border border-emerald-800/40">
                05
              </div>
              <span className="text-[11px] font-bold text-slate-200 uppercase tracking-tight">
                Coordinated Match
              </span>
              <span className="text-[10px] text-slate-400 mt-1">Closest unit dispatch</span>
            </div>

            {/* Step 6 */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-950/60 border border-emerald-900/30">
              <div className="h-8 w-8 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center mb-2 font-mono text-xs font-bold border border-emerald-800/40">
                06
              </div>
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-tight">
                Rapid Resolution
              </span>
              <span className="text-[10px] text-slate-400 mt-1">Life & property saved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hackathon Judge Interactive Demo Instructions Bar */}
      <div className="relative mx-auto mt-8 max-w-4xl w-full text-center pb-6">
        <div className="inline-flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 bg-slate-900/40 border border-slate-800/60 px-5 py-2.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Judge Demo Walkthrough:</span>
          </div>
          <span>1. Open Command Center</span>
          <span className="text-slate-600">→</span>
          <span>2. Select Critical Incident (INC-1005)</span>
          <span className="text-slate-600">→</span>
          <span>3. Assign Recommended Ambulance A-12</span>
          <span className="text-slate-600">→</span>
          <span>4. Step to Responding & Resolved</span>
        </div>
      </div>
    </div>
  );
};
