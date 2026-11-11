import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Destination } from '../types/travel';
import { MapPin, Navigation, Layers, Compass, ZoomIn, ZoomOut, Eye } from 'lucide-react';

interface InteractiveMapProps {
  destinations: Destination[];
  selectedDestination: Destination | null;
  onSelectDestination: (dest: Destination) => void;
  onOpenDetails: (dest: Destination) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  destinations,
  selectedDestination,
  onSelectDestination,
  onOpenDetails
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const polylineRef = useRef<L.Polyline | null>(null);

  const [mapTileLayer, setMapTileLayer] = useState<'streets' | 'satellite' | 'topo'>('streets');
  const [showTourRoute, setShowTourRoute] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  // Tile layer URLs
  const tileLayers = {
    streets: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri, Maxar, Earthstar Geographics'
    },
    topo: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenTopoMap contributors'
    }
  };

  const currentTileLayerRef = useRef<L.TileLayer | null>(null);

  // Helper to build custom category pin HTML
  const createCustomMarkerIcon = (dest: Destination, isSelected: boolean) => {
    let pinColor = '#3b82f6'; // default blue
    let iconSvg = '📍';

    if (dest.category === 'Heritage') {
      pinColor = '#f59e0b'; // amber
      iconSvg = '🏛️';
    } else if (dest.category === 'Coastal') {
      pinColor = '#06b6d4'; // cyan
      iconSvg = '🌊';
    } else if (dest.category === 'Mountain') {
      pinColor = '#10b981'; // emerald
      iconSvg = '⛰️';
    } else if (dest.category === 'Nature') {
      pinColor = '#14b8a6'; // teal
      iconSvg = '🌲';
    }

    const size = isSelected ? 44 : 36;
    const ringClass = isSelected ? 'ring-4 ring-amber-400 ring-offset-2 scale-110' : 'hover:scale-110';

    const html = `
      <div class="relative flex items-center justify-center transition-transform duration-200 cursor-pointer ${ringClass}" style="width: ${size}px; height: ${size}px;">
        <div class="absolute inset-0 rounded-full shadow-lg opacity-90" style="background-color: ${pinColor};"></div>
        <div class="relative text-white font-bold text-sm select-none flex items-center justify-center">
          ${iconSvg}
        </div>
        ${isSelected ? '<div class="absolute -bottom-1 w-2 h-2 bg-amber-400 rotate-45"></div>' : ''}
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-div-pin',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2]
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center around central Europe / Mediterranean view to encompass worldwide spots nicely
      const map = L.map(mapContainerRef.current, {
        center: [30.0, 15.0],
        zoom: 3,
        zoomControl: false,
        minZoom: 2,
        maxBounds: [[-85, -180], [85, 180]]
      });

      const initialLayer = L.tileLayer(tileLayers.streets.url, {
        attribution: tileLayers.streets.attribution,
        maxZoom: 18
      }).addTo(map);

      currentTileLayerRef.current = initialLayer;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Tile Layer switch
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const config = tileLayers[mapTileLayer];
    const newLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: 18
    }).addTo(map);

    currentTileLayerRef.current = newLayer;
  }, [mapTileLayer]);

  // Update Markers based on destinations and selectedDestination
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    const filtered = destinations.filter(d => 
      activeCategoryFilter === 'All' || d.category.toLowerCase() === activeCategoryFilter.toLowerCase()
    );

    filtered.forEach(dest => {
      const isSelected = selectedDestination?.id === dest.id;
      const markerIcon = createCustomMarkerIcon(dest, isSelected);

      const marker = L.marker([dest.coordinates.lat, dest.coordinates.lng], {
        icon: markerIcon,
        title: dest.name
      }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div class="w-64 text-slate-800 bg-white rounded-xl overflow-hidden font-sans">
          <div class="h-28 w-full overflow-hidden relative bg-slate-100">
            <img src="${dest.image}" alt="${dest.name}" class="w-full h-full object-cover" />
            <div class="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold rounded">
              ★ ${dest.rating} (${dest.reviewCount} reviews)
            </div>
          </div>
          <div class="p-3">
            <div class="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">${dest.country} · ${dest.category}</div>
            <h4 class="font-bold text-sm text-slate-900 leading-snug mb-1">${dest.name}</h4>
            <p class="text-xs text-slate-600 line-clamp-2 mb-2">${dest.summary}</p>
            <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span class="font-semibold text-slate-900">~$${dest.approxDailyBudget}/day</span>
              <button id="btn-popup-${dest.id}" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[11px] font-medium cursor-pointer">
                View Guide
              </button>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'custom-map-popup',
        maxWidth: 280,
        closeButton: true
      });

      marker.on('click', () => {
        onSelectDestination(dest);
      });

      marker.on('popupopen', () => {
        setTimeout(() => {
          const btn = document.getElementById(`btn-popup-${dest.id}`);
          if (btn) {
            btn.onclick = () => {
              onOpenDetails(dest);
            };
          }
        }, 50);
      });

      markersRef.current[dest.id] = marker;
    });

    // Update Polyline for Tour Route
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (showTourRoute && filtered.length > 1) {
      const latlngs: [number, number][] = filtered.map(d => [d.coordinates.lat, d.coordinates.lng]);
      const poly = L.polyline(latlngs, {
        color: '#f59e0b',
        weight: 3,
        opacity: 0.8,
        dashArray: '8, 8'
      }).addTo(map);
      polylineRef.current = poly;
    }
  }, [destinations, selectedDestination, activeCategoryFilter, showTourRoute]);

  // Center on selectedDestination when changed
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedDestination) return;

    map.flyTo([selectedDestination.coordinates.lat, selectedDestination.coordinates.lng], 6, {
      duration: 1.5
    });

    const marker = markersRef.current[selectedDestination.id];
    if (marker) {
      marker.openPopup();
    }
  }, [selectedDestination]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => {
    mapInstanceRef.current?.flyTo([30.0, 15.0], 3, { duration: 1.2 });
  };

  const handleSimulateLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        mapInstanceRef.current?.flyTo([latitude, longitude], 8, { duration: 1.5 });
        if (mapInstanceRef.current) {
          L.marker([latitude, longitude], {
            icon: L.divIcon({
              html: `<div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-ping"></div>`,
              className: 'current-user-pos'
            })
          }).addTo(mapInstanceRef.current).bindPopup('Your Current Location').openPopup();
        }
      },
      () => {
        // Fallback to central landmark (e.g. Kyoto) if blocked in sandbox
        if (destinations[0]) {
          onSelectDestination(destinations[0]);
        }
      }
    );
  };

  return (
    <div className="relative w-full h-[540px] md:h-[620px] rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-900 shadow-sm">
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Category Filter Pills (Functional Buttons) */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-neutral-200/80">
          {['All', 'Heritage', 'Coastal', 'Mountain', 'Nature'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeCategoryFilter === cat
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Layer Selector & Route Toggle */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Tour Route Path Toggle */}
          <button
            onClick={() => setShowTourRoute(!showTourRoute)}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl shadow-md border transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              showTourRoute
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-white/95 backdrop-blur-md text-neutral-700 border-neutral-200/80 hover:bg-neutral-100'
            }`}
            title="Connect destinations with tourist route path"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{showTourRoute ? 'Hide Route' : 'Show Route'}</span>
          </button>

          {/* Map Tile Layer Selector */}
          <div className="flex items-center p-1 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-neutral-200/80">
            <button
              onClick={() => setMapTileLayer('streets')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                mapTileLayer === 'streets' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Street
            </button>
            <button
              onClick={() => setMapTileLayer('satellite')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                mapTileLayer === 'satellite' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapTileLayer('topo')}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                mapTileLayer === 'topo' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Topography
            </button>
          </div>
        </div>
      </div>

      {/* Right Map Action Controls */}
      <div className="absolute right-4 bottom-6 z-20 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={handleSimulateLocation}
          className="p-2.5 bg-white/95 backdrop-blur-md hover:bg-white text-neutral-800 rounded-xl shadow-md border border-neutral-200/80 transition-transform active:scale-95 cursor-pointer"
          title="Center on my location"
        >
          <Compass className="w-4 h-4 text-amber-600" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2.5 bg-white/95 backdrop-blur-md hover:bg-white text-neutral-800 rounded-xl shadow-md border border-neutral-200/80 transition-transform active:scale-95 cursor-pointer"
          title="Reset world view"
        >
          <Layers className="w-4 h-4 text-neutral-700" />
        </button>
        <div className="flex flex-col rounded-xl overflow-hidden shadow-md border border-neutral-200/80 bg-white/95 backdrop-blur-md">
          <button
            onClick={handleZoomIn}
            className="p-2.5 hover:bg-neutral-100 text-neutral-800 transition-colors border-b border-neutral-200/80 cursor-pointer"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2.5 hover:bg-neutral-100 text-neutral-800 transition-colors cursor-pointer"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Selected Destination Quick Drawer */}
      {selectedDestination && (
        <div className="absolute left-4 bottom-4 z-20 max-w-sm pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-neutral-200/90 flex items-center gap-3.5">
            <img
              src={selectedDestination.image}
              alt={selectedDestination.name}
              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-neutral-100"
              onError={e => {
                // styled fallback
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[11px] text-neutral-500 mb-0.5">
                <span>{selectedDestination.country}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedDestination.category}</span>
              </div>
              <h4 className="font-bold text-sm text-neutral-900 truncate">
                {selectedDestination.name}
              </h4>
              <div className="flex items-center gap-3 text-xs text-neutral-600 mt-1">
                <span className="font-semibold text-amber-600">★ {selectedDestination.rating}</span>
                <span aria-hidden="true">·</span>
                <span>~${selectedDestination.approxDailyBudget}/day</span>
              </div>
            </div>
            <button
              onClick={() => onOpenDetails(selectedDestination)}
              className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Explore</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
