import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useEmergency } from '../../context/EmergencyContext';
import { LocateFixed, Eye, Filter } from 'lucide-react';

// Fix Leaflet's default marker icon paths if ever used fallback
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export const IncidentMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const {
    incidents,
    resources,
    selectedIncidentId,
    setSelectedIncidentId,
    mapFilter,
    setMapFilter,
    showResourcesOnMap,
    setShowResourcesOnMap,
  } = useEmergency();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default center: Metro Area (SF coordinate grid)
    const map = L.map(mapContainerRef.current, {
      center: [37.778, -122.415],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark Matter CartoDB tiles for dark command center feel
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Zoom control on bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers on data or filter changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    // 1. Filter and plot Incidents
    const filteredIncidents = incidents.filter((incident) => {
      if (mapFilter === 'All') return true;
      if (mapFilter === 'Critical') return incident.priority === 'CRITICAL' && incident.status !== 'RESOLVED';
      if (mapFilter === 'High') return incident.priority === 'HIGH' && incident.status !== 'RESOLVED';
      if (mapFilter === 'Medium') return incident.priority === 'MEDIUM' && incident.status !== 'RESOLVED';
      if (mapFilter === 'Resolved') return incident.status === 'RESOLVED';
      return true;
    });

    filteredIncidents.forEach((incident) => {
      const isSelected = incident.id === selectedIncidentId;
      const isResolved = incident.status === 'RESOLVED';
      const isCritical = incident.priority === 'CRITICAL' && !isResolved;
      const isHigh = incident.priority === 'HIGH' && !isResolved;

      let pinColorClass = 'bg-amber-500 border-amber-300';
      let haloColor = 'bg-amber-500/30';
      let iconSymbol = '!';

      if (isResolved) {
        pinColorClass = 'bg-emerald-600 border-emerald-300';
        haloColor = 'bg-emerald-500/20';
        iconSymbol = '✓';
      } else if (isCritical) {
        pinColorClass = 'bg-rose-600 border-rose-300 animate-pulse';
        haloColor = 'bg-rose-500/40 animate-ping';
        iconSymbol = '⚠';
      } else if (isHigh) {
        pinColorClass = 'bg-orange-500 border-orange-300';
        haloColor = 'bg-orange-500/30';
        iconSymbol = '!';
      }

      const html = `
        <div class="relative flex items-center justify-center cursor-pointer group" style="width: 36px; height: 36px;">
          ${
            isCritical
              ? `<div class="absolute inset-0 rounded-full ${haloColor}"></div>`
              : ''
          }
          <div class="relative flex items-center justify-center w-7 h-7 rounded-full text-white font-black text-xs shadow-lg shadow-black/80 border-2 ${pinColorClass} ${
            isSelected ? 'ring-4 ring-cyan-400 scale-110' : ''
          }">
            ${iconSymbol}
          </div>
          <div class="absolute -bottom-4 whitespace-nowrap bg-slate-900/95 border border-slate-700 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold text-slate-200 pointer-events-none shadow">
            ${incident.id}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html,
        className: 'custom-incident-icon',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([incident.location.lat, incident.location.lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : isCritical ? 500 : 100,
      });

      // Custom popup content
      const popupHtml = `
        <div class="p-2 min-w-[220px] font-sans text-slate-100 bg-slate-900 border border-slate-700 rounded-lg shadow-xl">
          <div class="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
            <span class="font-mono text-xs font-bold text-rose-400">${incident.id}</span>
            <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
              incident.status === 'RESOLVED'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-rose-950 text-rose-300 border border-rose-800'
            }">${incident.status}</span>
          </div>
          <div class="font-bold text-sm text-white mb-1">${incident.type}</div>
          <div class="text-xs text-slate-400 mb-2">📍 ${incident.location.address}</div>
          <div class="grid grid-cols-2 gap-1 text-[11px] mb-3 bg-slate-950/70 p-2 rounded border border-slate-800">
            <div><span class="text-slate-500">Severity:</span> <span class="font-semibold text-slate-200">${incident.severity}</span></div>
            <div><span class="text-slate-500">Priority:</span> <span class="font-semibold text-rose-400">${incident.priority}</span></div>
            <div class="col-span-2"><span class="text-slate-500">Required:</span> <span class="font-semibold text-cyan-300">${incident.requiredResourceType}</span></div>
          </div>
          <button id="btn-select-${incident.id}" class="w-full py-1.5 text-center bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold shadow transition-colors">
            Inspect & Assign in Ops
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'dark-popup',
        closeButton: false,
      });

      marker.on('click', () => {
        setSelectedIncidentId(incident.id);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-${incident.id}`);
        if (btn) {
          btn.onclick = () => {
            setSelectedIncidentId(incident.id);
            map.closePopup();
          };
        }
      });

      marker.addTo(layer);
    });

    // 2. Plot Resources if toggle is on
    if (showResourcesOnMap) {
      resources.forEach((resource) => {
        let statusBadgeColor = 'bg-emerald-500 border-emerald-300';
        if (resource.status === 'DEPLOYED') statusBadgeColor = 'bg-blue-500 border-blue-300';
        if (resource.status === 'BUSY') statusBadgeColor = 'bg-amber-500 border-amber-300';

        let iconLetter = '🚑';
        if (resource.type === 'Fire Unit') iconLetter = '🚒';
        if (resource.type === 'Police Unit') iconLetter = '🚓';
        if (resource.type === 'Medical Team') iconLetter = '🩺';
        if (resource.type === 'Volunteer Team') iconLetter = '🤝';

        const resourceHtml = `
          <div class="relative flex items-center justify-center cursor-pointer" style="width: 32px; height: 32px;">
            <div class="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-900 border ${statusBadgeColor} text-xs shadow-md">
              ${iconLetter}
            </div>
            <span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${statusBadgeColor}"></span>
            <div class="absolute -bottom-3.5 whitespace-nowrap bg-slate-950/90 border border-slate-800 px-1 py-0.2 rounded text-[8px] font-mono text-slate-300 pointer-events-none">
              ${resource.name.split(' ')[1] || resource.name}
            </div>
          </div>
        `;

        const resIcon = L.divIcon({
          html: resourceHtml,
          className: 'custom-resource-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const resMarker = L.marker([resource.location.lat, resource.location.lng], {
          icon: resIcon,
          zIndexOffset: 80,
        });

        const resPopupHtml = `
          <div class="p-2 min-w-[200px] font-sans text-slate-100 bg-slate-900 border border-slate-700 rounded-lg shadow-xl">
            <div class="flex items-center justify-between border-b border-slate-800 pb-1 mb-1.5">
              <span class="font-bold text-xs text-white">${resource.name}</span>
              <span class="text-[9px] uppercase font-bold px-1 py-0.5 rounded ${
                resource.status === 'AVAILABLE'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : resource.status === 'DEPLOYED'
                  ? 'bg-blue-950 text-blue-300 border border-blue-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }">${resource.status}</span>
            </div>
            <div class="text-[11px] text-slate-300 mb-1">Role: ${resource.type}</div>
            <div class="text-[11px] text-slate-400">📍 ${resource.location.address}</div>
            <div class="text-[10px] text-cyan-400 mt-1 font-mono">Callsign: ${resource.contactCallsign}</div>
          </div>
        `;

        resMarker.bindPopup(resPopupHtml, {
          className: 'dark-popup',
          closeButton: false,
        });

        resMarker.addTo(layer);
      });
    }
  }, [incidents, resources, mapFilter, showResourcesOnMap, selectedIncidentId, setSelectedIncidentId]);

  // Center on selected incident smoothly
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedIncidentId) return;

    const target = incidents.find((i) => i.id === selectedIncidentId);
    if (target) {
      map.flyTo([target.location.lat, target.location.lng], 14, {
        duration: 0.8,
      });
    }
  }, [selectedIncidentId, incidents]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([37.778, -122.415], 13, { duration: 0.6 });
    }
  };

  return (
    <div className="relative h-[480px] lg:h-[560px] w-full rounded-2xl border border-slate-800/80 bg-slate-950 overflow-hidden shadow-2xl">
      {/* Map Header Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 pointer-events-auto shadow-lg">
          <div className="flex items-center gap-1 px-2 py-1 text-slate-400 text-xs font-mono">
            <Filter className="h-3 w-3" />
            <span className="hidden sm:inline">Filter:</span>
          </div>
          {(['All', 'Critical', 'High', 'Medium', 'Resolved'] as const).map((filterName) => (
            <button
              key={filterName}
              onClick={() => setMapFilter(filterName)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                mapFilter === filterName
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {filterName}
            </button>
          ))}
        </div>

        {/* Action Toggles: Fleet Units & Recenter */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setShowResourcesOnMap(!showResourcesOnMap)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium backdrop-blur-md shadow-lg transition-all ${
              showResourcesOnMap
                ? 'bg-slate-900/95 border-blue-500/40 text-blue-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-400'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Fleet Units</span>
            <span
              className={`w-2 h-2 rounded-full ${
                showResourcesOnMap ? 'bg-blue-400' : 'bg-slate-600'
              }`}
            />
          </button>

          <button
            onClick={handleRecenter}
            title="Reset to Metro Center View"
            className="flex items-center justify-center h-8 w-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white backdrop-blur-md shadow-lg transition-colors"
          >
            <LocateFixed className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[400] bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-2 rounded-xl text-[10px] font-mono text-slate-300 shadow-xl hidden sm:flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 border border-white/50 animate-pulse" />
          <span>Critical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <span>High</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <span>Resolved</span>
        </div>
        <div className="h-3 w-px bg-slate-700" />
        <div className="flex items-center gap-1 text-slate-400">
          <span>🚑 Fleet Units Active</span>
        </div>
      </div>

      {/* Actual Leaflet Container */}
      <div ref={mapContainerRef} className="h-full w-full bg-slate-950" />
    </div>
  );
};
