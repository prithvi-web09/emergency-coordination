import React, { useState } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import type { IncidentType, SeverityLevel, Incident } from '../types/emergency';
import { PRESET_METRO_LOCATIONS } from '../data/mockData';
import {
  AlertTriangle,
  X,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessNavigateToOps: () => void;
}

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  isOpen,
  onClose,
  onSuccessNavigateToOps,
}) => {
  const { reportIncident } = useEmergency();

  const [type, setType] = useState<IncidentType>('Medical Emergency');
  const [severity, setSeverity] = useState<SeverityLevel>('Critical');
  const [selectedLocationIndex, setSelectedLocationIndex] = useState<number>(0);
  const [customAddress, setCustomAddress] = useState<string>('');
  const [description, setDescription] = useState<string>(
    'Elderly victim experienced acute chest pain and shortness of breath. Responsive but deteriorating rapidly.'
  );
  const [reporterName, setReporterName] = useState<string>('Citizen Responder');
  const [submittedIncident, setSubmittedIncident] = useState<Incident | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedPreset = PRESET_METRO_LOCATIONS[selectedLocationIndex];
    // Slightly jitter lat/lng if custom address is entered so it has unique pin
    const lat = customAddress ? selectedPreset.lat + (Math.random() - 0.5) * 0.005 : selectedPreset.lat;
    const lng = customAddress ? selectedPreset.lng + (Math.random() - 0.5) * 0.005 : selectedPreset.lng;
    const address = customAddress.trim() || selectedPreset.address;

    const created = reportIncident({
      type,
      severity,
      location: { lat, lng, address },
      description,
      reporterName: reporterName || 'Anonymous Citizen',
    });

    setSubmittedIncident(created);
  };

  const handleFinishAndOpenOps = () => {
    setSubmittedIncident(null);
    onClose();
    onSuccessNavigateToOps();
  };

  const setDemoQuickFill = (demoType: IncidentType, demoSev: SeverityLevel, desc: string) => {
    setType(demoType);
    setSeverity(demoSev);
    setDescription(desc);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600/20 border border-rose-500/30 text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase font-mono tracking-wider">
                Emergency Incident Report
              </h2>
              <p className="text-xs text-slate-400">
                Direct Dispatch Intake & Automated Priority Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {submittedIncident ? (
            /* Success Screen */
            <div className="text-center py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 mb-4 animate-bounce">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest block">
                Incident Successfully Registered
              </span>
              <h3 className="text-2xl font-black text-white font-mono mt-1">
                {submittedIncident.id}
              </h3>

              {/* Confirmation Details Card */}
              <div className="mx-auto mt-6 max-w-md rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-left font-sans space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">Incident Type:</span>
                  <span className="text-xs font-bold text-white">{submittedIncident.type}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">Severity:</span>
                  <span className="text-xs font-bold text-rose-400 uppercase">
                    {submittedIncident.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">AI Priority Engine:</span>
                  <span className="text-xs font-mono font-black text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                    {submittedIncident.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">Target Resource:</span>
                  <span className="text-xs font-mono text-cyan-300">
                    {submittedIncident.requiredResourceType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Initial Status:</span>
                  <span className="text-xs font-mono text-slate-300">
                    {submittedIncident.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-4 max-w-sm mx-auto">
                Incident marker placed on live map. Nearby resources calculated and staged for assignment.
              </p>

              <button
                onClick={handleFinishAndOpenOps}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-950/80 border border-rose-400/40 hover:bg-rose-500 transition-all w-full"
              >
                <span>OPEN IN COMMAND CENTER</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* Report Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Quick Fill Preset Pills for Fast Hackathon Demoing */}
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                  Demo Fast-Fill Scenarios:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setDemoQuickFill(
                        'Medical Emergency',
                        'Critical',
                        'Severe respiratory failure in transit concourse. Requires immediate oxygen & ALS.'
                      )
                    }
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 transition-colors"
                  >
                    + Critical Medical
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDemoQuickFill(
                        'Fire',
                        'High',
                        'Commercial kitchen exhaust duct on fire with active flame spread.'
                      )
                    }
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-300 border border-slate-700 transition-colors"
                  >
                    + Kitchen Fire
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDemoQuickFill(
                        'Flood',
                        'High',
                        'Main water pipe burst flooding road and trapping vehicles in standing water.'
                      )
                    }
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 transition-colors"
                  >
                    + Flash Flood
                  </button>
                </div>
              </div>

              {/* Incident Type */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                  Incident Type *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    [
                      'Medical Emergency',
                      'Fire',
                      'Flood',
                      'Accident',
                      'Infrastructure Hazard',
                      'Other',
                    ] as const
                  ).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all border ${
                        type === t
                          ? 'bg-rose-950/60 border-rose-500 text-white shadow'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                  Severity Level *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Critical', 'High', 'Medium', 'Low'] as const).map((s) => {
                    const isSelected = severity === s;
                    let color = 'text-rose-400 border-rose-500 bg-rose-950/40';
                    if (s === 'High') color = 'text-orange-400 border-orange-500 bg-orange-950/40';
                    if (s === 'Medium') color = 'text-amber-400 border-amber-500 bg-amber-950/40';
                    if (s === 'Low') color = 'text-slate-300 border-slate-500 bg-slate-800';

                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSeverity(s)}
                        className={`py-2 rounded-xl text-xs font-mono font-black uppercase text-center transition-all border ${
                          isSelected
                            ? `${color} ring-1 ring-white/20 shadow`
                            : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                  Location (Metropolitan Area) *
                </label>
                <select
                  value={selectedLocationIndex}
                  onChange={(e) => {
                    setSelectedLocationIndex(Number(e.target.value));
                    setCustomAddress('');
                  }}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                >
                  {PRESET_METRO_LOCATIONS.map((loc, idx) => (
                    <option key={loc.name} value={idx}>
                      {loc.name} — {loc.address}
                    </option>
                  ))}
                </select>

                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Or specify exact street / building..."
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                  Description of Emergency *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide essential details: casualties, hazards, access barriers..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-rose-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Reporter Name */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                  Reporter Name / Source
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Citizen / Transit Officer / Patrol Unit"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-98 py-3 text-sm font-bold text-white shadow-xl shadow-rose-950/80 border border-rose-400/40 transition-all"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>REPORT INCIDENT</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
