import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const LocationSearch = () => {
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (location.trim()) {
      navigate(`/care-type?location=${encodeURIComponent(location)}`);
    }
  };

  const handleUseLocation = () => {
    // In a real app, this would use geolocation API
    setLocation("Current Location");
    navigate("/care-type?location=current");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card rounded-2xl shadow-lg p-6 border border-border/50">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by city, ZIP code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 h-12 text-base border-border/50"
            />
          </div>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleUseLocation}
            className="gap-2 whitespace-nowrap"
          >
            <MapPin className="w-4 h-4" />
            Use My Location
          </Button>
          <Button 
            variant="hero" 
            size="lg"
            onClick={handleSearch}
            className="whitespace-nowrap"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};
