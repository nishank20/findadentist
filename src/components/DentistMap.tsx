import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface Dentist {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  address: string;
  networkProvider: boolean;
}

interface DentistMapProps {
  dentists: Dentist[];
  onMarkerClick?: (dentistId: number) => void;
}

const DentistMap = ({ dentists, onMarkerClick }: DentistMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  // Mock coordinates for dentists (in a real app, you'd geocode the addresses)
  const dentistLocations = [
    { id: 1, lat: 40.7580, lng: -73.9855 },
    { id: 2, lat: 40.7614, lng: -73.9776 },
    { id: 3, lat: 40.7489, lng: -73.9680 },
    { id: 4, lat: 40.7767, lng: -73.9821 },
    { id: 5, lat: 40.7359, lng: -73.9911 },
    { id: 6, lat: 40.7614, lng: -73.9598 },
  ];

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-73.9855, 40.7580], // NYC center
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for each dentist
    dentistLocations.forEach((location) => {
      const dentist = dentists.find(d => d.id === location.id);
      if (!dentist) return;

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.cursor = 'pointer';
      
      // Create marker icon with network provider styling
      const markerColor = dentist.networkProvider ? '#0EA5E9' : '#94A3B8';
      el.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="${markerColor}" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      `;

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-sm mb-1">${dentist.name}</h3>
          <p class="text-xs text-gray-600 mb-1">${dentist.specialty}</p>
          <div class="flex items-center gap-1 text-xs">
            <span class="text-yellow-500">★</span>
            <span class="font-medium">${dentist.rating}</span>
          </div>
          ${dentist.networkProvider ? '<p class="text-xs text-blue-600 mt-1">✓ Network Provider</p>' : ''}
        </div>
      `);

      // Add marker to map
      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.lng, location.lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Handle marker click
      el.addEventListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(dentist.id);
        }
      });
    });

    setIsMapInitialized(true);
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (!isMapInitialized) {
    return (
      <div className="w-full h-[400px] rounded-lg border border-border bg-muted/10 flex flex-col items-center justify-center p-6 gap-4">
        <MapPin className="w-12 h-12 text-muted-foreground" />
        <div className="text-center max-w-md">
          <h3 className="font-semibold text-lg mb-2">Enter Mapbox Token</h3>
          <p className="text-sm text-muted-foreground mb-4">
            To display the map, please enter your Mapbox public token. 
            Get one at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="pk.eyJ1..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="flex-1"
            />
            <Button onClick={initializeMap} disabled={!mapboxToken}>
              Load Map
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-border shadow-lg">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default DentistMap;