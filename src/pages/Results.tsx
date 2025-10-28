import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import { MapPin, Star, Search, SlidersHorizontal, ScanLine, BadgeCheck } from "lucide-react";
import { useState } from "react";
import { BookingDialog } from "@/components/BookingDialog";
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
    distance: "2.5 miles away",
    address: "123 Main Street, Suite 200, Downtown Medical Center, Cityville, CA 90210",
    insurance: ["Delta Dental", "Aetna", "Cigna"],
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    networkProvider: true,
  },
  {
    id: 2,
    name: "Dr. Michael Rodriguez, DDS",
    specialty: "Orthodontist",
    rating: 4.6,
    reviews: 89,
    distance: "3.1 miles away",
    address: "456 Oak Avenue, Plaza Building, Floor 3, Westside, CA 90211",
    insurance: ["UnitedHealthcare", "Delta Dental", "Humana"],
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
    networkProvider: false,
  },
  {
    id: 3,
    name: "Dr. Sarah Kim, DDS",
    specialty: "Cosmetic Dentist",
    rating: 4.9,
    reviews: 156,
    distance: "1.8 miles away",
    address: "789 Elm Street, Heritage Medical Complex, Suite 150, Eastside, CA 90212",
    insurance: ["Aetna", "MetLife", "Cigna"],
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
    networkProvider: true,
  },
  {
    id: 4,
    name: "Dr. James Wilson, DDS",
    specialty: "Pediatric Dentist",
    rating: 4.7,
    reviews: 98,
    distance: "2.9 miles away",
    address: "321 Pine Street, Medical Plaza, Suite 400, Northside, CA 90213",
    insurance: ["Delta Dental", "UnitedHealthcare", "Cigna"],
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
    networkProvider: false,
  },
  {
    id: 5,
    name: "Dr. Lisa Chen, DMD",
    specialty: "Periodontist",
    rating: 4.9,
    reviews: 142,
    distance: "3.5 miles away",
    address: "567 Maple Drive, Healthcare Center, Floor 2, Southside, CA 90214",
    insurance: ["Aetna", "MetLife", "Humana"],
    image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop",
    networkProvider: true,
  },
  {
    id: 6,
    name: "Dr. Robert Martinez, DDS",
    specialty: "Oral Surgeon",
    rating: 4.8,
    reviews: 134,
    distance: "4.2 miles away",
    address: "890 Cedar Lane, Surgical Center, Suite 100, Westside, CA 90215",
    insurance: ["Delta Dental", "UnitedHealthcare", "Aetna"],
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop",
    networkProvider: false,
  },
];

export default function Results() {
  const [searchParams] = useSearchParams();
  const location = searchParams.get("location") || "your area";
  const [expandedReviews, setExpandedReviews] = useState<number[]>([]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDentist, setSelectedDentist] = useState<string>("");

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

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-foreground">
                Available Dentists Near You
              </h2>
              <p className="text-muted-foreground">
                Showing {mockDentists.length} results
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/dentist-enrollment'}
              className="whitespace-nowrap"
            >
              I am a dentist - Sign me in
            </Button>
          </div>

          <div className="space-y-6">
            {sortedDentists.map((dentist) => (
              <Card key={dentist.id} className="p-6 border-border/50 hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={dentist.image}
                      alt={dentist.name}
                      className="w-24 h-24 rounded-full object-cover ring-2 ring-border"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-foreground">
                          {dentist.name}
                        </h3>
                        {dentist.networkProvider && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <BadgeCheck className="w-6 h-6 text-primary fill-primary/20" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="text-sm">
                                This provider participates in the Dental.com Network for enhanced scheduling, communication, and care coordination.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <p className="text-muted-foreground">{dentist.specialty}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                        <span className="font-semibold ml-1">{dentist.rating}</span>
                        <span className="text-muted-foreground">
                          ({dentist.reviews} Reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{dentist.distance}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{dentist.address}</p>

                    <div>
                      <p className="text-sm font-medium mb-2 text-foreground">
                        Accepted Insurance:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {dentist.insurance.map((ins) => (
                          <Badge key={ins} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                            {ins}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        variant="link"
                        onClick={() => toggleReviews(dentist.id)}
                        className="h-auto p-0 text-primary"
                      >
                        {expandedReviews.includes(dentist.id)
                          ? "Hide Reviews"
                          : `Show Reviews (${dentist.reviews})`}
                      </Button>
                    </div>
                  </div>

                  {/* Book Button */}
                  <div className="flex-shrink-0 md:self-start">
                    <Button 
                      variant="hero" 
                      className="w-full md:w-auto px-8"
                      onClick={() => handleBookAppointment(dentist.name)}
                    >
                      Request Appointment
                    </Button>
                  </div>
                </div>

                {expandedReviews.includes(dentist.id) && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Reviews section would appear here with detailed patient feedback.
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </main>

      <BookingDialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        dentistName={selectedDentist}
      />
    </div>
    </TooltipProvider>
  );
}
