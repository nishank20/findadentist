import { useState } from 'react';
import { Button } from './ui/button';
import { Maximize2, Minimize2, MapPin } from 'lucide-react';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDentist, setSelectedDentist] = useState<number | null>(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMarkerClick = (dentistId: number) => {
    setSelectedDentist(selectedDentist === dentistId ? null : dentistId);
    if (onDentistClick) {
      onDentistClick(dentistId);
    }
  };

  // Convert lat/lng to percentage positions for dummy map (normalized around NYC area)
  const getMarkerPosition = (lat: number, lng: number) => {
    // Normalize around NYC coordinates (40.7128° N, 74.0060° W)
    const centerLat = 40.7128;
    const centerLng = -74.0060;
    const scale = 1000; // Adjust for visual spacing
    
    const x = 50 + ((lng - centerLng) * scale);
    const y = 50 - ((lat - centerLat) * scale);
    
    return { x: `${Math.max(10, Math.min(90, x))}%`, y: `${Math.max(10, Math.min(90, y))}%` };
  };

  return (
    <div className={`relative ${isExpanded ? 'fixed inset-0 z-50 bg-background' : 'h-full'}`}>
      {/* Dummy Map Background */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border) / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Street-like lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-0 right-0 h-px bg-border" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-border" />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-border" />
          <div className="absolute left-1/4 top-0 bottom-0 w-px bg-border" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />
          <div className="absolute left-3/4 top-0 bottom-0 w-px bg-border" />
        </div>

        {/* Markers */}
        {dentists.map((dentist) => {
          const position = getMarkerPosition(dentist.latitude, dentist.longitude);
          const isSelected = selectedDentist === dentist.id;
          
          return (
            <div
              key={dentist.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: position.x, top: position.y }}
              onClick={() => handleMarkerClick(dentist.id)}
            >
              {/* Marker Pin */}
              <div className={`relative transition-all duration-200 ${isSelected ? 'scale-125' : 'group-hover:scale-110'}`}>
                <MapPin 
                  className={`w-8 h-8 transition-colors ${
                    isSelected 
                      ? 'fill-primary text-primary-foreground' 
                      : 'fill-primary/80 text-primary-foreground'
                  }`}
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                />
              </div>

              {/* Info Popup */}
              {isSelected && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 pointer-events-none">
                  <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                    <h4 className="font-semibold text-sm mb-1">{dentist.name}</h4>
                    <p className="text-xs text-muted-foreground">{dentist.address}</p>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-background border-r border-b border-border" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Controls */}
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
