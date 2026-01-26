import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MapPin, ExternalLink, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { DentistMapOpenLayers } from "./DentistMapOpenLayers";

interface DentistData {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
}

interface LocationMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dentistName: string;
  address: string;
  distance: string;
  currentLocation: string;
  onLocationUpdate: (location: string) => void;
  dentists: DentistData[];
  userLocation: { lat: number; lng: number };
  selectedDentistId?: number;
}

export function LocationMapDialog({
  open,
  onOpenChange,
  dentistName,
  address,
  distance,
  currentLocation,
  onLocationUpdate,
  dentists,
  userLocation,
  selectedDentistId,
}: LocationMapDialogProps) {
  const [location, setLocation] = useState(currentLocation);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<typeof locationSuggestions>([]);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const copyInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [showCopyHint, setShowCopyHint] = useState(false);

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

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}${location?.trim() ? `&origin=${encodeURIComponent(location)}` : ""}`;

  const handleOpenDirections = async () => {
    const w = window.open(mapsUrl, "_blank", "noopener,noreferrer");
    if (!w) {
      try {
        await navigator.clipboard.writeText(mapsUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {}
      setShowCopyHint(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(mapsUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] w-[95vw] sm:w-full overflow-hidden flex flex-col p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="truncate">Location - {dentistName}</span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Edit your starting point and view the dentist location. Use the button below to open directions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 sm:space-y-4 overflow-y-auto flex-1 pr-1 sm:pr-2">
          {/* Edit My Location */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium text-foreground">My Current Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <Input
                ref={locationInputRef}
                type="text"
                placeholder="Enter city, state, or ZIP code"
                value={location}
                onChange={(e) => handleLocationChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="pl-10 text-sm"
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
                      className="w-full px-3 sm:px-4 py-2 text-left hover:bg-accent transition-colors flex items-center gap-2 border-b border-border last:border-b-0"
                    >
                      <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-foreground text-sm">
                          {suggestion.city}, {suggestion.state}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {suggestion.zip}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button onClick={handleUpdateLocation} className="w-full text-sm sm:text-base">
              Update Location & Search
            </Button>
          </div>

          {/* Dentist Location Info */}
          <div className="p-3 sm:p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-1">Dentist Location</p>
            <p className="text-xs sm:text-sm font-medium text-foreground mb-1 break-words">{address}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">{distance}</p>
          </div>

          {/* Interactive OpenStreetMap with OpenLayers */}
          <div className="w-full h-[250px] sm:h-[400px] rounded-lg border border-border overflow-hidden">
            <DentistMapOpenLayers
              userLocation={userLocation}
              dentists={dentists.map(d => ({
                id: String(d.id),
                name: d.name,
                lat: d.latitude,
                lng: d.longitude,
                address: d.address,
              }))}
              selectedDentist={selectedDentistId ? String(selectedDentistId) : undefined}
            />
          </div>
        </div>

        {/* Actions - Fixed at bottom */}
        <div className="pt-3 sm:pt-4 border-t border-border mt-3 sm:mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="w-full text-xs sm:text-sm"
              onClick={handleOpenDirections}
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Open in Google Maps
            </Button>
            <Button
              variant="secondary"
              className="w-full text-xs sm:text-sm"
              onClick={handleCopyLink}
            >
              <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              {copied ? "Copied!" : "Copy Directions Link"}
            </Button>
          </div>
          {showCopyHint && (
            <p className="text-xs text-muted-foreground mt-2 sm:mt-3 text-center">
              Preview blocks external sites. Paste the link in a new browser tab.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
