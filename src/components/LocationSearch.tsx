import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const insuranceOptions = [
  "- no insurance -",
  "Delta Dental",
  "Aetna",
  "Cigna",
  "UnitedHealthcare",
  "MetLife",
  "Humana",
];

export const LocationSearch = () => {
  const [location, setLocation] = useState("");
  const [insurance, setInsurance] = useState<string>("- no insurance -");
  const navigate = useNavigate();

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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex-1 w-full relative flex gap-2">
          <div className="relative flex-1">
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
            onClick={handleSearch}
            className="h-14 px-8 rounded-full"
            disabled={!location.trim()}
          >
            Search
          </Button>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Select value={insurance} onValueChange={setInsurance}>
            <SelectTrigger className="h-10 w-[180px] rounded-full border-primary text-primary text-sm bg-background">
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
