import { useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleApiKey,
  });

  const center = dentists.length > 0 
    ? { lat: dentists[0].latitude, lng: dentists[0].longitude }
    : { lat: 37.7749, lng: -122.4194 };

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!googleApiKey) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg p-8">
        <div className="max-w-md w-full space-y-4">
          <h3 className="text-lg font-semibold text-center">Enter Google Maps API Key</h3>
          <p className="text-sm text-muted-foreground text-center">
            Get your API key at{' '}
            <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              Google Cloud Console
            </a>
          </p>
          <Input
            type="text"
            placeholder="AIza..."
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            className="w-full"
          />
          <Button onClick={() => setGoogleApiKey(apiKeyInput)} className="w-full">
            Load Map
          </Button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <div className={`relative ${isExpanded ? 'fixed inset-0 z-50 bg-background' : 'h-full'}`}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        options={mapOptions}
      >
        {dentists.map((dentist) => (
          <Marker
            key={dentist.id}
            position={{ lat: dentist.latitude, lng: dentist.longitude }}
            onClick={() => {
              setSelectedMarker(dentist.id);
              if (onDentistClick) {
                onDentistClick(dentist.id);
              }
            }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: 'hsl(var(--primary))',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: 12,
            }}
          >
            {selectedMarker === dentist.id && (
              <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                <div style={{ padding: '8px' }}>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '4px' }}>{dentist.name}</h3>
                  <p style={{ fontSize: '12px', color: '#666' }}>{dentist.address}</p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
      
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
