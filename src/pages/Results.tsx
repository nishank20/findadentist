import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import { useState } from "react";

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
  },
];

export default function Results() {
  const [searchParams] = useSearchParams();
  const location = searchParams.get("location") || "your area";
  const [expandedReviews, setExpandedReviews] = useState<number[]>([]);

  const toggleReviews = (dentistId: number) => {
    setExpandedReviews((prev) =>
      prev.includes(dentistId)
        ? prev.filter((id) => id !== dentistId)
        : [...prev, dentistId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
              Available Dentists Near You
            </h1>
            <p className="text-muted-foreground">
              Showing {mockDentists.length} results {location && `in ${location}`}
            </p>
          </div>

          <div className="space-y-6">
            {mockDentists.map((dentist) => (
              <Card key={dentist.id} className="p-6 border-border/50 hover:shadow-lg transition-all">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-1">
                        {dentist.name}
                      </h2>
                      <p className="text-muted-foreground">{dentist.specialty}</p>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="font-semibold">{dentist.rating}</span>
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
                          <Badge key={ins} variant="secondary">
                            {ins}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:w-48">
                    <Button variant="hero" className="w-full">
                      Book Appointment
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => toggleReviews(dentist.id)}
                      className="w-full"
                    >
                      {expandedReviews.includes(dentist.id)
                        ? "Hide Reviews"
                        : "Show Reviews"}
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
    </div>
  );
}
