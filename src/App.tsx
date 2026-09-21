import React, { useState } from 'react';
import { EmergencyProvider, useEmergency } from './context/EmergencyContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { CommandCenterView } from './components/CommandCenter/CommandCenterView';
import { ResourceFleet } from './components/ResourceTracking/ResourceFleet';
import { ReportIncidentModal } from './components/ReportIncidentModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'landing' | 'command' | 'resources'>('command');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { toast, clearToast } = useEmergency();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/95 px-4 py-3 shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-2 max-w-md">
          {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
          {toast.type === 'alert' && <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 animate-pulse" />}
          {toast.type === 'info' && <Info className="h-5 w-5 text-cyan-400 shrink-0" />}
          <span className="text-xs text-slate-200 font-medium">{toast.message}</span>
          <button
            onClick={clearToast}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-10">
        {currentTab === 'landing' && (
          <LandingPage
            onOpenCommandCenter={() => setCurrentTab('command')}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}

        {currentTab === 'command' && <CommandCenterView />}

        {currentTab === 'resources' && <ResourceFleet />}
      </main>

      {/* Incident Reporting Modal */}
      <ReportIncidentModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSuccessNavigateToOps={() => setCurrentTab('command')}
      />

      {/* Operations Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-4 px-4 sm:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">Hackstreak 3.0</span>
            <span className="text-slate-600">•</span>
            <span>Team Pixel Pirates</span>
            <span className="text-slate-600">•</span>
            <span className="text-rose-400">Emergency Response Coordination Platform</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Self-contained prototype with Leaflet + OpenStreetMap & Simulated Priority Engine
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <EmergencyProvider>
      <MainLayout />
    </EmergencyProvider>
  );
}
