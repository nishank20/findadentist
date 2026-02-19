import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, LocateFixed, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const insuranceOptions = [
  "- no insurance -",
  "Delta Dental",
  "Aetna",
  "Cigna",
  "UnitedHealthcare",
  "MetLife",
  "Humana",
];

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
  { city: "Austin", state: "TX", zip: "78701" },
  { city: "Jacksonville", state: "FL", zip: "32099" },
  { city: "Fort Worth", state: "TX", zip: "76101" },
  { city: "Columbus", state: "OH", zip: "43201" },
  { city: "Charlotte", state: "NC", zip: "28201" },
  { city: "San Francisco", state: "CA", zip: "94101" },
  { city: "Indianapolis", state: "IN", zip: "46201" },
  { city: "Seattle", state: "WA", zip: "98101" },
  { city: "Denver", state: "CO", zip: "80201" },
  { city: "Boston", state: "MA", zip: "02101" },
];

export const LocationSearch = () => {
  const [location, setLocation] = useState("");
  const [insurance, setInsurance] = useState<string>("- no insurance -");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(locationSuggestions);
  const [locating, setLocating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (location.trim()) {
      const params = new URLSearchParams({
        location: location,
      });
      if (insurance !== "- no insurance -") {
        params.append("insurance", insurance);
      }
      navigate(`/questionnaire?${params.toString()}`);
    }
  };

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

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation not supported", description: "Your browser doesn't support location services.", variant: "destructive" });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || "";
          const state = data.address?.state || "";
          const zip = data.address?.postcode || "";
          setLocation(`${city}, ${state} ${zip}`.trim());
          setShowSuggestions(false);
        } catch {
          toast({ title: "Location error", description: "Could not determine your address.", variant: "destructive" });
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        toast({ title: "Location denied", description: "Please allow location access or search manually.", variant: "destructive" });
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex-1 w-full relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search by city, ZIP code"
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onFocus={() => setShowSuggestions(true)}
              className="pl-12 pr-12 h-14 text-base rounded-full border-border bg-card shadow-sm"
            />
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={locating}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-primary disabled:opacity-50"
              title="Use my current location"
            >
              {locating ? <Loader2 className="w-5 h-5 animate-spin" /> : <LocateFixed className="w-5 h-5" />}
            </button>
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-[100] max-h-64 overflow-y-auto"
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-2 border-b border-border last:border-b-0"
                  >
                    <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate">
                        {suggestion.city}, {suggestion.state}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {suggestion.zip}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button 
            onClick={handleSearch}
            size="icon"
            className="h-14 w-14 rounded-full flex-shrink-0"
            disabled={!location.trim()}
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Select value={insurance} onValueChange={setInsurance}>
            <SelectTrigger className="h-14 w-[180px] rounded-full border-primary text-primary text-base bg-background">
              <SelectValue placeholder="Insurance Carrier" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border shadow-lg z-[100]">
              {insuranceOptions.map((option) => (
                <SelectItem key={option} value={option} className="cursor-pointer">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">Optional</span>
        </div>
      </div>
    </div>
  );
};
