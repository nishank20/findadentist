import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Maximize2, Minimize2, MapPin, Navigation, Star, BadgeCheck, ExternalLink } from 'lucide-react';
import { Card } from './ui/card';
import { DentistCard } from './DentistCard';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface Dentist {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  specialty?: string;
  rating?: number;
  reviews?: number;
  distance?: string;
  image?: string;
  networkProvider?: boolean;
}

interface DentistMapProps {
  dentists: Dentist[];
  onDentistClick?: (dentistId: number) => void;
  onBookAppointment?: (dentistId: number) => void;
  zipCode?: string;
  userLocation?: { latitude: number; longitude: number };
  highlightedDentistId?: number | null;
}

export const DentistMap = ({ dentists, onDentistClick, onBookAppointment, zipCode, userLocation, highlightedDentistId }: DentistMapProps) => {
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
    setSelectedDentist(null); // Clear selection when starting to drag
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
    setSelectedDentist(null); // Clear selection when starting to drag
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

  const handleMarkerClick = (e: React.MouseEvent, dentistId: number) => {
    e.stopPropagation();
    if (isDragging) return; // Don't select if dragging
    setSelectedDentist(selectedDentist === dentistId ? null : dentistId);
    if (onDentistClick && !isExpanded) {
      onDentistClick(dentistId);
    }
  };

  const selectedDentistData = dentists.find(d => d.id === selectedDentist);


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
    <TooltipProvider>
      <div className={`${
        isExpanded 
          ? 'fixed top-20 left-0 right-0 bottom-0 z-[100] bg-background animate-slide-in-right' 
          : 'relative h-full'
      } transition-all duration-300`}>
      {/* Dummy Map Background */}
      <div 
        ref={mapRef}
        className={`absolute inset-0 ${isExpanded ? 'rounded-none' : 'rounded-lg'} bg-gradient-to-br from-muted/30 to-muted/10 overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} transition-all duration-300`}
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

        {/* User Location Marker */}
        {userLocation && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ 
              left: getMarkerPosition(userLocation.latitude, userLocation.longitude).x,
              top: getMarkerPosition(userLocation.latitude, userLocation.longitude).y,
              transform: `translate(calc(-50% + ${mapOffset.x}px), calc(-50% + ${mapOffset.y}px))`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 animate-ping">
                <div className="w-10 h-10 rounded-full bg-blue-500/30" />
              </div>
              <Navigation 
                className="w-8 h-8 fill-blue-500 text-white relative z-10"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}
              />
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg font-medium">
                  Your Location
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dentist Markers */}
        {dentists.map((dentist) => {
          const position = getMarkerPosition(dentist.latitude, dentist.longitude);
          const isSelected = selectedDentist === dentist.id;
          const isHighlighted = highlightedDentistId === dentist.id;
          
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
              onClick={(e) => handleMarkerClick(e, dentist.id)}
            >
              {/* Pulsing ring for highlighted marker */}
              {isHighlighted && (
                <div className="absolute inset-0 -m-2 animate-ping">
                  <div className="w-12 h-12 rounded-full bg-primary/30" />
                </div>
              )}
              
              {/* Marker Pin */}
              <div className={`relative transition-all duration-200 cursor-pointer group ${isSelected ? 'scale-125' : isHighlighted ? 'scale-125 animate-bounce' : 'group-hover:scale-110'}`}>
                <MapPin 
                  className={`w-8 h-8 transition-colors ${
                    isSelected || isHighlighted
                      ? 'fill-primary text-primary-foreground' 
                      : 'fill-primary/80 text-primary-foreground'
                  }`}
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                />
              </div>

              {/* Dentist Card Popup at Marker Location */}
              {isSelected && isExpanded && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-[600px] max-w-[90vw] shadow-2xl pointer-events-auto">
                  <DentistCard
                    dentist={dentist}
                    onBookAppointment={(e) => {
                      e?.stopPropagation?.();
                      if (onBookAppointment) {
                        onBookAppointment(dentist.id);
                      }
                    }}
                    onHighlight={() => {}}
                    showReviews={false}
                  />
                  {/* Arrow pointer */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-3 h-3 bg-background border-r border-b border-border" />
                </div>
              )}

              {/* Simple Info Popup for non-expanded mode */}
              {isSelected && !isExpanded && (
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
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="shadow-lg"
          onClick={toggleExpand}
        >
          {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="shadow-lg"
          onClick={() => {
            const mapUrl = `https://www.google.com/maps/search/dentist/@${userLocation?.latitude || 40.7178},${userLocation?.longitude || -74.0431},14z`;
            window.open(mapUrl, '_blank');
          }}
          title="Open in Google Maps"
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>

      {zipCode && (
        <div className="absolute top-4 right-4 z-10 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-border">
          <p className="text-sm font-medium">Near: {zipCode}</p>
        </div>
      )}
      </div>
    </TooltipProvider>
  );
};
