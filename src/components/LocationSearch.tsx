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
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by city, ZIP code, or use my location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-12 h-14 text-base rounded-full border-border bg-card shadow-sm"
          />
        </div>
        <Button 
          variant="outline" 
          size="lg" 
          onClick={handleUseLocation}
          className="gap-2 whitespace-nowrap h-14 rounded-full border-secondary text-secondary hover:bg-secondary/10 px-6"
        >
          <MapPin className="w-4 h-4" />
          Use My Location
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          className="gap-2 whitespace-nowrap h-14 rounded-full border-primary text-primary hover:bg-primary/10 px-6"
        >
          Filter by Insurance
        </Button>
      </div>
    </div>
  );
};
