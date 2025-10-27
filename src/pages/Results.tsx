import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import { MapPin, Star, Search, SlidersHorizontal, ScanLine } from "lucide-react";
import { useState } from "react";
import { BookingDialog } from "@/components/BookingDialog";

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
  },
];

export default function Results() {
  const [searchParams] = useSearchParams();
  const location = searchParams.get("location") || "your area";
  const [expandedReviews, setExpandedReviews] = useState<number[]>([]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDentist, setSelectedDentist] = useState<string>("");

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
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Search Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Find Your Perfect Dentist
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with trusted dental professionals in your area. Book appointments
              easily and get the care you deserve.
            </p>
            
            <div className="flex flex-col gap-4 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search by city, ZIP code, or use my location"
                    className="pl-10 h-12"
                    defaultValue={location}
                  />
                </div>
                <Button variant="outline" className="h-12 px-6">
                  <MapPin className="w-4 h-4 mr-2" />
                  Use My Location
                </Button>
                <Button variant="outline" className="h-12 px-4">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Show All
                </Button>
              </div>
              
              {/* SmartScan Button */}
              <Button 
                variant="hero" 
                className="w-full sm:w-auto mx-auto h-14 px-10 text-base font-semibold shadow-lg hover:shadow-xl transition-all animate-fade-in rounded-full"
              >
                <ScanLine className="w-5 h-5 mr-2" />
                SmartScan - Find Best Match
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 text-foreground">
              Available Dentists Near You
            </h2>
            <p className="text-muted-foreground">
              Showing {mockDentists.length} results
            </p>
          </div>

          <div className="space-y-6">
            {mockDentists.map((dentist) => (
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
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        {dentist.name}
                      </h3>
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
                      Book Appointment
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
  );
}
