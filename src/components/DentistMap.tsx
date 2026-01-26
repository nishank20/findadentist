import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Maximize2, Minimize2, Star, BadgeCheck } from 'lucide-react';
import { Card } from './ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color: string, isHighlighted: boolean = false) => {
  const size = isHighlighted ? 35 : 25;
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        ${isHighlighted ? 'animation: pulse 1s infinite;' : ''}
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="position: relative;">
      <div style="
        width: 20px;
        height: 20px;
        background: #3b82f6;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      "></div>
      <div style="
        position: absolute;
        top: -5px;
        left: -5px;
        width: 30px;
        height: 30px;
        background: rgba(59, 130, 246, 0.3);
        border-radius: 50%;
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

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

// Component to handle map center updates
const MapController = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

export const DentistMap = ({ 
  dentists, 
  onDentistClick, 
  onBookAppointment, 
  zipCode, 
  userLocation, 
  highlightedDentistId 
}: DentistMapProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Calculate center based on dentists or user location (default to New York)
  const getMapCenter = (): [number, number] => {
    if (userLocation) {
      return [userLocation.latitude, userLocation.longitude];
    }
    if (dentists.length > 0) {
      const avgLat = dentists.reduce((sum, d) => sum + d.latitude, 0) / dentists.length;
      const avgLng = dentists.reduce((sum, d) => sum + d.longitude, 0) / dentists.length;
      return [avgLat, avgLng];
    }
    // Default to New York City
    return [40.7128, -74.0060];
  };

  const mapCenter = getMapCenter();

  return (
    <TooltipProvider>
      <div className={`${
        isExpanded 
          ? 'fixed top-20 left-0 right-0 bottom-0 z-[100] bg-background animate-slide-in-right' 
          : 'relative h-full'
      } transition-all duration-300`}>
        
        {/* Add custom styles for animations */}
        <style>{`
          @keyframes ping {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          @keyframes pulse {
            0%, 100% {
              transform: rotate(-45deg) scale(1);
            }
            50% {
              transform: rotate(-45deg) scale(1.1);
            }
          }
          .leaflet-container {
            height: 100%;
            width: 100%;
            border-radius: ${isExpanded ? '0' : '0.5rem'};
          }
        `}</style>

        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={true}
          className={`absolute inset-0 ${isExpanded ? 'rounded-none' : 'rounded-lg'} z-0`}
          style={{ height: '100%', width: '100%' }}
        >
          <MapController center={mapCenter} zoom={13} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User Location Marker */}
          {userLocation && (
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={userLocationIcon}
            >
              <Popup>
                <div className="text-center">
                  <strong>Your Location</strong>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Dentist Markers */}
          {dentists.map((dentist) => {
            const isHighlighted = highlightedDentistId === dentist.id;
            const markerIcon = createCustomIcon(
              'hsl(var(--primary))',
              isHighlighted
            );

            return (
              <Marker
                key={dentist.id}
                position={[dentist.latitude, dentist.longitude]}
                icon={markerIcon}
                eventHandlers={{
                  click: () => {
                    if (onDentistClick) {
                      onDentistClick(dentist.id);
                    }
                  },
                }}
              >
                <Popup>
                  <Card className="border-0 shadow-none p-0 min-w-[280px]">
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        {/* Profile Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={dentist.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop"}
                            alt={dentist.name}
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-border"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-bold text-foreground truncate">
                              {dentist.name}
                            </h3>
                            {dentist.networkProvider && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <BadgeCheck className="w-4 h-4 text-primary fill-primary/20 flex-shrink-0 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="text-sm">This provider participates in the Dental.com Network.</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          {dentist.specialty && (
                            <p className="text-sm text-muted-foreground">{dentist.specialty}</p>
                          )}

                          <div className="flex items-center gap-3 text-xs mt-1">
                            {dentist.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-primary text-primary" />
                                <span className="font-semibold">{dentist.rating}</span>
                                {dentist.reviews && (
                                  <span className="text-muted-foreground">({dentist.reviews})</span>
                                )}
                              </div>
                            )}
                            {dentist.distance && (
                              <span className="text-muted-foreground">{dentist.distance}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground">{dentist.address}</p>

                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onBookAppointment) {
                            onBookAppointment(dentist.id);
                          }
                        }}
                      >
                        Request Appointment
                      </Button>
                    </div>
                  </Card>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Controls */}
        <div className="absolute top-4 left-4 z-[1000] flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="shadow-lg"
            onClick={toggleExpand}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>

        {zipCode && (
          <div className="absolute top-4 right-4 z-[1000] bg-background/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-border">
            <p className="text-sm font-medium">Near: {zipCode}</p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
