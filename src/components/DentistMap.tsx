import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from './ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Input } from './ui/input';

interface Dentist {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface DentistMapProps {
  dentists: Dentist[];
  onDentistClick?: (dentistId: number) => void;
  zipCode?: string;
}

export const DentistMap = ({ dentists, onDentistClick, zipCode }: DentistMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: dentists.length > 0 ? [dentists[0].longitude, dentists[0].latitude] : [-122.4194, 37.7749],
        zoom: 12,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Clear existing markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];

      // Add markers for each dentist
      dentists.forEach((dentist) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundColor = 'hsl(var(--primary))';
        el.style.width = '24px';
        el.style.height = '24px';
        el.style.borderRadius = '50%';
        el.style.cursor = 'pointer';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

        const marker = new mapboxgl.Marker(el)
          .setLngLat([dentist.longitude, dentist.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div style="padding: 8px;">
                  <h3 style="font-weight: bold; margin-bottom: 4px;">${dentist.name}</h3>
                  <p style="font-size: 12px; color: #666;">${dentist.address}</p>
                </div>
              `)
          )
          .addTo(map.current!);

        el.addEventListener('click', () => {
          if (onDentistClick) {
            onDentistClick(dentist.id);
          }
        });

        markers.current.push(marker);
      });

      // Fit bounds to show all markers
      if (dentists.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        dentists.forEach(dentist => {
          bounds.extend([dentist.longitude, dentist.latitude]);
        });
        map.current.fitBounds(bounds, { padding: 50 });
      }

      setShowTokenInput(false);
    } catch (error) {
      console.error('Error initializing map:', error);
      setShowTokenInput(true);
    }

    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [dentists, onDentistClick, mapboxToken]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (showTokenInput) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg p-8">
        <div className="max-w-md w-full space-y-4">
          <h3 className="text-lg font-semibold text-center">Enter Mapbox Token</h3>
          <p className="text-sm text-muted-foreground text-center">
            Get your free token at{' '}
            <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              mapbox.com
            </a>
          </p>
          <Input
            type="text"
            placeholder="pk.eyJ1..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="w-full"
          />
          <Button onClick={() => setMapboxToken(mapboxToken)} className="w-full">
            Load Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${isExpanded ? 'fixed inset-0 z-50 bg-background' : 'h-full'}`}>
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-4 left-4 z-10 shadow-lg"
        onClick={toggleExpand}
      >
        {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </Button>

      {zipCode && (
        <div className="absolute top-4 right-4 z-10 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-border">
          <p className="text-sm font-medium">Near: {zipCode}</p>
        </div>
      )}
    </div>
  );
};
