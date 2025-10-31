import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MapPin, Star, Search, SlidersHorizontal, ScanLine, BadgeCheck, X, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { BookingDialog } from "@/components/BookingDialog";
import { LocationMapDialog } from "@/components/LocationMapDialog";
import { DentistMap } from "@/components/DentistMap";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const mockDentists = [
  {
    id: 1,
    name: "Dr. Emily Carter, DDS",
    specialty: "General Dentist",
    rating: 4.8,
    reviews: 120,
    distance: "0.5 miles away",
    address: "123 Newark Ave, Jersey City, NJ 07302",
    insurance: ["Delta Dental", "Aetna", "Cigna"],
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    networkProvider: true,
    latitude: 40.7282,
    longitude: -74.0431,
  },
  {
    id: 2,
    name: "Dr. Michael Rodriguez, DDS",
    specialty: "Orthodontist",
    rating: 4.6,
    reviews: 89,
    distance: "1.2 miles away",
    address: "456 Summit Ave, Jersey City, NJ 07306",
    insurance: ["UnitedHealthcare", "Delta Dental", "Humana"],
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    networkProvider: false,
    latitude: 40.7380,
    longitude: -74.0650,
  },
  {
    id: 3,
    name: "Dr. Sarah Kim, DDS",
    specialty: "Cosmetic Dentist",
    rating: 4.9,
    reviews: 156,
    distance: "0.8 miles away",
    address: "789 Grand St, Jersey City, NJ 07302",
    insurance: ["Aetna", "MetLife", "Cigna"],
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
    networkProvider: true,
    latitude: 40.7178,
    longitude: -74.0490,
  },
  {
    id: 4,
    name: "Dr. James Wilson, DDS",
    specialty: "Pediatric Dentist",
    rating: 4.7,
    reviews: 98,
    distance: "1.5 miles away",
    address: "321 Central Ave, Jersey City, NJ 07307",
    insurance: ["Delta Dental", "UnitedHealthcare", "Cigna"],
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
    networkProvider: false,
    latitude: 40.7485,
    longitude: -74.0545,
  },
  {
    id: 5,
    name: "Dr. Lisa Chen, DMD",
    specialty: "Periodontist",
    rating: 4.9,
    reviews: 142,
    distance: "1.8 miles away",
    address: "567 Bergen Ave, Jersey City, NJ 07304",
    insurance: ["Aetna", "MetLife", "Humana"],
    image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop",
    networkProvider: true,
    latitude: 40.7089,
    longitude: -74.0620,
  },
  {
    id: 6,
    name: "Dr. Robert Martinez, DDS",
    specialty: "Oral Surgeon",
    rating: 4.8,
    reviews: 134,
    distance: "2.1 miles away",
    address: "890 Kennedy Blvd, Jersey City, NJ 07305",
    insurance: ["Delta Dental", "UnitedHealthcare", "Aetna"],
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop",
    networkProvider: false,
    latitude: 40.7020,
    longitude: -74.0750,
  },
];

export default function Results() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const careType = searchParams.get("careType") || "";
  const specialist = searchParams.get("specialist") || "";
  const issueType = searchParams.get("issueType") || "";
  const [expandedReviews, setExpandedReviews] = useState<number[]>([]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDentist, setSelectedDentist] = useState<string>("");
  const [highlightedDentistId, setHighlightedDentistId] = useState<number | null>(null);
  const dentistRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    address: string;
    distance: string;
  } | null>(null);

  // Sort dentists to show network providers first
  const sortedDentists = [...mockDentists].sort((a, b) => {
    if (a.networkProvider && !b.networkProvider) return -1;
    if (!a.networkProvider && b.networkProvider) return 1;
    return 0;
  });

  const toggleReviews = (dentistId: number) => {
    setExpandedReviews((prev) =>
      prev.includes(dentistId)
        ? prev.filter((id) => id !== dentistId)
        : [...prev, dentistId]
    );
  };

  const handleBookAppointment = (dentistName: string) => {
    setSelectedDentist(dentistName);
    setBookingOpen(true);
  };

  const handleShowLocation = (dentist: typeof mockDentists[0]) => {
    setSelectedLocation({
      name: dentist.name,
      address: dentist.address,
      distance: dentist.distance,
    });
    setMapOpen(true);
  };

  const handleUpdateSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (location) params.set("location", location);
    navigate(`/results?${params.toString()}`);
    setShowFilters(false);
  };

  const handleStartNewSearch = () => {
    navigate("/");
  };

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

  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [filteredLocationSuggestions, setFilteredLocationSuggestions] = useState(locationSuggestions);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node) &&
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationInputChange = (value: string) => {
    setLocation(value);
    if (value.trim()) {
      const filtered = locationSuggestions.filter(
        (loc) =>
          loc.city.toLowerCase().includes(value.toLowerCase()) ||
          loc.state.toLowerCase().includes(value.toLowerCase()) ||
          loc.zip.includes(value)
      );
      setFilteredLocationSuggestions(filtered);
      setShowLocationSuggestions(true);
    } else {
      setFilteredLocationSuggestions(locationSuggestions);
      setShowLocationSuggestions(false);
    }
  };

  const handleSelectLocationSuggestion = (suggestion: typeof locationSuggestions[0]) => {
    setLocation(`${suggestion.city}, ${suggestion.state} ${suggestion.zip}`);
    setShowLocationSuggestions(false);
  };

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-background">
        <Header />

      <main className="flex-1 overflow-hidden">
        <div className="h-full">
          {/* Search Criteria Summary */}
          <Card className="mb-4 p-4 mx-4 mt-4 border-border/50">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Your Search</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  {showFilters ? "Hide Filters" : "Refine Search"}
                </Button>
              </div>

              {/* Current Search Parameters */}
              <div className="flex flex-wrap gap-3">
                {location && (
                  <Badge variant="secondary" className="text-sm py-2 px-3">
                    <MapPin className="w-3 h-3 mr-1" />
                    {location}
                  </Badge>
                )}
                {careType && (
                  <Badge variant="secondary" className="text-sm py-2 px-3">
                    Care: {careType.charAt(0).toUpperCase() + careType.slice(1)}
                  </Badge>
                )}
                {specialist && (
                  <Badge variant="secondary" className="text-sm py-2 px-3">
                    Specialist: {specialist.charAt(0).toUpperCase() + specialist.slice(1)}
                  </Badge>
                )}
                {issueType && (
                  <Badge variant="secondary" className="text-sm py-2 px-3">
                    Issue: {issueType.charAt(0).toUpperCase() + issueType.slice(1)}
                  </Badge>
                )}
              </div>

              {/* Filter Section */}
              {showFilters && (
                <div className="pt-4 border-t border-border space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                      <Input
                        ref={locationInputRef}
                        type="text"
                        placeholder="Enter city, state, or ZIP code"
                        value={location}
                        onChange={(e) => handleLocationInputChange(e.target.value)}
                        onFocus={() => setShowLocationSuggestions(true)}
                        className="pl-10"
                      />
                      {showLocationSuggestions && filteredLocationSuggestions.length > 0 && (
                        <div
                          ref={locationDropdownRef}
                          className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-[100] max-h-48 overflow-y-auto"
                        >
                          {filteredLocationSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSelectLocationSuggestion(suggestion)}
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
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleUpdateSearch} className="flex-1">
                      <Search className="w-4 h-4 mr-2" />
                      Update Search
                    </Button>
                    <Button variant="outline" onClick={handleStartNewSearch}>
                      Start New Search
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Split Layout: List and Map */}
          <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-220px)] px-4">
            {/* Left Side - Dentist List */}
            <div className="lg:w-1/2 space-y-4 overflow-y-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {sortedDentists.length} In-network providers
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Near {location || "your location"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
              {sortedDentists.map((dentist) => (
                <Card 
                  key={dentist.id} 
                  ref={(el) => dentistRefs.current[dentist.id] = el}
                  className={`p-6 border-border/50 hover:shadow-md transition-all ${
                    highlightedDentistId === dentist.id 
                      ? 'ring-2 ring-primary shadow-lg bg-primary/5' 
                      : ''
                  }`}
                >
                  <div className="flex gap-6">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={dentist.image}
                        alt={dentist.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-foreground">
                              {dentist.name}
                            </h3>
                            {dentist.networkProvider && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <BadgeCheck className="w-5 h-5 text-primary fill-primary/20 flex-shrink-0 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="text-sm">This provider participates in the Dental.com Network for enhanced scheduling, communication, and care coordination.</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <p className="text-base text-muted-foreground mb-3">{dentist.specialty}</p>

                          <div className="flex items-center gap-4 text-sm mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-blue-500 text-blue-500" />
                              <Star className="w-4 h-4 fill-blue-500 text-blue-500" />
                              <Star className="w-4 h-4 fill-blue-500 text-blue-500" />
                              <Star className="w-4 h-4 fill-blue-500 text-blue-500" />
                              <Star className="w-4 h-4 fill-gray-300 text-gray-300" />
                              <span className="font-semibold text-foreground ml-1">{dentist.rating}</span>
                              <span className="text-muted-foreground">({dentist.reviews} Reviews)</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{dentist.distance}</span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 mb-4">
                            <button 
                              onClick={() => {
                                setHighlightedDentistId(dentist.id);
                                setTimeout(() => setHighlightedDentistId(null), 3000);
                              }}
                              className="flex items-start gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer group flex-1 text-left"
                            >
                              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 group-hover:text-primary" />
                              <span className="group-hover:underline">{dentist.address}</span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-foreground">Accepted Insurance:</p>
                            <div className="flex flex-wrap gap-2">
                              {dentist.insurance.map((ins, idx) => (
                                <Badge 
                                  key={idx} 
                                  variant="secondary"
                                  className="text-xs px-3 py-1"
                                >
                                  {ins}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button 
                            size="lg"
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 whitespace-nowrap"
                            onClick={() => handleBookAppointment(dentist.name)}
                          >
                            <User className="w-4 h-4 mr-2" />
                            Request Appointment
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            className="whitespace-nowrap"
                            onClick={() => {
                              const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dentist.address)}`;
                              window.open(mapsUrl, '_blank');
                            }}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            Get Directions
                          </Button>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleReviews(dentist.id)}
                          className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 -ml-2"
                        >
                          Show Reviews ({dentist.reviews})
                          {expandedReviews.includes(dentist.id) ? (
                            <span className="ml-1">▲</span>
                          ) : (
                            <span className="ml-1">▼</span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                </Card>
              ))}
              </div>
            </div>

            {/* Right Side - Map */}
            <div className="lg:w-1/2 h-[500px] lg:h-full">
              <DentistMap 
                dentists={sortedDentists.map(d => ({
                  id: d.id,
                  name: d.name,
                  address: d.address,
                  latitude: d.latitude,
                  longitude: d.longitude,
                  specialty: d.specialty,
                  rating: d.rating,
                  reviews: d.reviews,
                  distance: d.distance,
                  image: d.image,
                  networkProvider: d.networkProvider,
                }))}
                onDentistClick={(dentistId) => {
                  setHighlightedDentistId(dentistId);
                  // Scroll to the dentist card
                  const cardElement = dentistRefs.current[dentistId];
                  if (cardElement) {
                    cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                  // Clear highlight after 3 seconds
                  setTimeout(() => setHighlightedDentistId(null), 3000);
                }}
                onBookAppointment={(dentistId) => {
                  const dentist = sortedDentists.find(d => d.id === dentistId);
                  if (dentist) {
                    handleBookAppointment(dentist.name);
                  }
                }}
                zipCode={location}
                userLocation={{ latitude: 40.7178, longitude: -74.0431 }}
                highlightedDentistId={highlightedDentistId}
              />
            </div>
          </div>
        </div>
      </main>

      <BookingDialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        dentistName={selectedDentist}
      />

          <LocationMapDialog
            open={mapOpen}
            onOpenChange={setMapOpen}
            dentistName={selectedLocation?.name || ""}
            address={selectedLocation?.address || ""}
            distance={selectedLocation?.distance || ""}
            currentLocation={location}
            onLocationUpdate={(newLocation) => {
              setLocation(newLocation);
              const params = new URLSearchParams(searchParams);
              params.set("location", newLocation);
              navigate(`/results?${params.toString()}`);
            }}
          />
      
      <Footer />
    </div>
    </TooltipProvider>
  );
}
