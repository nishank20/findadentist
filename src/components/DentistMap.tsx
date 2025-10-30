import { useState, useRef } from 'react';
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
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.marker-pin')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapOffset.x, y: e.clientY - mapOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setMapOffset({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.marker-pin')) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - mapOffset.x, y: touch.clientY - mapOffset.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    setMapOffset({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMarkerClick = (dentistId: number) => {
    setSelectedDentist(selectedDentist === dentistId ? null : dentistId);
    if (onDentistClick) {
      onDentistClick(dentistId);
    }
  };

  // Convert lat/lng to percentage positions for dummy map (normalized around Jersey City area)
  const getMarkerPosition = (lat: number, lng: number) => {
    // Normalize around Jersey City coordinates (40.7178° N, 74.0431° W)
    const centerLat = 40.7178;
    const centerLng = -74.0431;
    const scale = 1000; // Adjust for visual spacing
    
    const x = 50 + ((lng - centerLng) * scale);
    const y = 50 - ((lat - centerLat) * scale);
    
    return { x: `${Math.max(10, Math.min(90, x))}%`, y: `${Math.max(10, Math.min(90, y))}%` };
  };

  return (
    <div className={`relative ${isExpanded ? 'fixed inset-0 z-50 bg-background' : 'h-full'}`}>
      {/* Dummy Map Background */}
      <div 
        ref={mapRef}
        className={`absolute inset-0 rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border) / 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: `translate(${mapOffset.x}px, ${mapOffset.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }} 
        />
        
        {/* Street-like lines */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            transform: `translate(${mapOffset.x}px, ${mapOffset.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            width: '200%',
            height: '200%',
            left: '-50%',
            top: '-50%'
          }}
        >
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
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 marker-pin"
              style={{ 
                left: position.x, 
                top: position.y,
                transform: `translate(calc(-50% + ${mapOffset.x}px), calc(-50% + ${mapOffset.y}px))`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
              onClick={() => handleMarkerClick(dentist.id)}
            >
              {/* Marker Pin */}
              <div className={`relative transition-all duration-200 cursor-pointer group ${isSelected ? 'scale-125' : 'group-hover:scale-110'}`}>
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
