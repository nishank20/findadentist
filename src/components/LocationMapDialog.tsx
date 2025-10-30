import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

interface LocationMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dentistName: string;
  address: string;
  distance: string;
  currentLocation: string;
  onLocationUpdate: (location: string) => void;
}

export function LocationMapDialog({
  open,
  onOpenChange,
  dentistName,
  address,
  distance,
  currentLocation,
  onLocationUpdate,
}: LocationMapDialogProps) {
  const [location, setLocation] = useState(currentLocation);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<typeof locationSuggestions>([]);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const locationSuggestions = [
    { city: "New York", state: "NY", zip: "10001" },
    { city: "Los Angeles", state: "CA", zip: "90001" },
    { city: "Chicago", state: "IL", zip: "60601" },
    { city: "Houston", state: "TX", zip: "77001" },
    { city: "Phoenix", state: "AZ", zip: "85001" },
    { city: "Philadelphia", state: "PA", zip: "19101" },
    { city: "San Antonio", state: "TX", zip: "78201" },
    { city: "San Diego", state: "CA", zip: "92101" },
    { city: "Dallas", state: "TX", zip: "75201" },
    { city: "San Jose", state: "CA", zip: "95101" },
  ];

  useEffect(() => {
    setLocation(currentLocation);
  }, [currentLocation]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationChange = (value: string) => {
    setLocation(value);
    if (value.trim()) {
      const filtered = locationSuggestions.filter(
        (loc) =>
          loc.city.toLowerCase().includes(value.toLowerCase()) ||
          loc.state.toLowerCase().includes(value.toLowerCase()) ||
          loc.zip.includes(value)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions(locationSuggestions);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: typeof locationSuggestions[0]) => {
    setLocation(`${suggestion.city}, ${suggestion.state} ${suggestion.zip}`);
    setShowSuggestions(false);
  };

  const handleUpdateLocation = () => {
    onLocationUpdate(location);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Location - {dentistName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {/* Edit My Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">My Current Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <Input
                ref={locationInputRef}
                type="text"
                placeholder="Enter city, state, or ZIP code"
                value={location}
                onChange={(e) => handleLocationChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="pl-10"
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-[200] max-h-48 overflow-y-auto"
                >
                  {filteredSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="w-full px-4 py-2 text-left hover:bg-accent transition-colors flex items-center gap-2 border-b border-border last:border-b-0"
                    >
                      <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1">
                        <span className="font-medium text-foreground">
                          {suggestion.city}, {suggestion.state}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          {suggestion.zip}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button onClick={handleUpdateLocation} className="w-full">
              Update Location & Search
            </Button>
          </div>

          {/* Dentist Location Info */}
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-1">Dentist Location</p>
            <p className="text-sm font-medium text-foreground mb-1">{address}</p>
            <p className="text-sm text-muted-foreground">{distance}</p>
          </div>

          {/* Map Placeholder - This is where the actual map component will go */}
          <div className="w-full h-[400px] bg-muted rounded-lg border border-border flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                Map integration placeholder
              </p>
              <p className="text-xs text-muted-foreground">
                Add your map component here (Google Maps, Mapbox, etc.)
              </p>
            </div>
          </div>
        </div>

        {/* Get Directions Button - Fixed at bottom */}
        <div className="pt-4 border-t border-border mt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank', 'noopener,noreferrer')}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Get Directions in Google Maps
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
