import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";

const careTypes = [
  {
    id: "routine",
    title: "Routine Dental Care",
    description: "For cleanings, check-ups, x-rays, and preventive care. Ideal if you're looking to maintain healthy teeth and gums with a trusted general dentist.",
  },
  {
    id: "specialty",
    title: "Specialty Care",
    description: "For complex needs like oral surgery, orthodontics, periodontics, or pediatric dentistry. Choose this if you require a specialist for targeted treatment.",
  },
  {
    id: "cosmetic",
    title: "Cosmetic Dental Services",
    description: "For whitening, veneers, bonding, and smile makeovers. Perfect if you're focused on enhancing the appearance of your teeth.",
  },
  {
    id: "restorative",
    title: "Advanced Restorative Care",
    description: "For crowns, bridges, implants, and full-mouth rehabilitation. Select this if you're dealing with damaged or missing teeth and need comprehensive solutions.",
  },
  {
    id: "affordable",
    title: "Affordable Payment Options",
    description: "For dentists who offer flexible financing, payment plans, or accept your insurance. Choose this if cost is a key factor in your decision.",
  },
];

const specialistTypes = [
  {
    id: "pediatric",
    title: "Pediatric Dentist",
    description: "Specialized in caring for infants, children, and teens—offering gentle, age-appropriate treatment and guidance for growing smiles.",
  },
  {
    id: "orthodontist",
    title: "Orthodontist",
    description: "Focused on straightening teeth and aligning bites using braces, clear aligners, and other corrective tools for long-term oral health.",
  },
  {
    id: "oral-surgeon",
    title: "Oral Surgeon",
    description: "Handles surgical procedures like wisdom tooth removal, dental implants, and jaw corrections—ideal for more complex dental needs.",
  },
  {
    id: "periodontist",
    title: "Periodontist",
    description: "Expert in gum health and treating issues like gum disease, recession, and bone loss—essential for preserving your foundation for healthy teeth.",
  },
];

export default function Questionnaire() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState<"care" | "specialist">("care");
  const [selectedCare, setSelectedCare] = useState("");
  const [selectedSpecialist, setSelectedSpecialist] = useState("");

  const handleSkip = () => {
    const params = new URLSearchParams(searchParams);
    navigate(`/results?${params.toString()}`);
  };

  const handleCareSelection = (careId: string) => {
    setSelectedCare(careId);
    if (careId === "specialty") {
      setStep("specialist");
    } else {
      // Go directly to results for non-specialty care types
      const params = new URLSearchParams(searchParams);
      params.append("careType", careId);
      navigate(`/results?${params.toString()}`);
    }
  };

  const handleSpecialistSelection = (specialistId: string) => {
    const params = new URLSearchParams(searchParams);
    params.append("careType", "specialty");
    params.append("specialist", specialistId);
    navigate(`/results?${params.toString()}`);
  };

  const handleBack = () => {
    setStep("care");
    setSelectedSpecialist("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {step === "care" 
                ? "What Type of Care are You Looking For?"
                : "What Type of Specialist are You Looking For?"}
            </h1>
            <div className="flex gap-3">
              {step === "care" && (
                <Button 
                  variant="outline" 
                  onClick={handleSkip}
                  className="hidden sm:flex"
                >
                  Skip to search results
                </Button>
              )}
              <Button className="bg-primary hover:bg-primary/90">
                Immediate Online Emergency Visit
              </Button>
            </div>
          </div>

          {/* Mobile Skip Button */}
          {step === "care" && (
            <Button 
              variant="outline" 
              onClick={handleSkip}
              className="w-full sm:hidden mb-6"
            >
              Skip to search results
            </Button>
          )}

          {/* Care Type Cards */}
          {step === "care" && (
            <div className="space-y-4 animate-fade-in">
              {careTypes.map((care) => (
                <div
                  key={care.id}
                  onClick={() => handleCareSelection(care.id)}
                  className={cn(
                    "p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300",
                    "hover:shadow-lg hover:scale-[1.01] hover:border-primary/50",
                    "border-border bg-card"
                  )}
                >
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {care.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {care.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Specialist Type Cards */}
          {step === "specialist" && (
            <div className="space-y-4 animate-fade-in">
              {specialistTypes.map((specialist) => (
                <div
                  key={specialist.id}
                  onClick={() => handleSpecialistSelection(specialist.id)}
                  className={cn(
                    "p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300",
                    "hover:shadow-lg hover:scale-[1.01] hover:border-primary/50",
                    "border-border bg-card"
                  )}
                >
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {specialist.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {specialist.description}
                  </p>
                </div>
              ))}

              {/* Back Button */}
              <div className="mt-8">
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={handleBack}
                  className="px-8"
                >
                  ← Back to Care Types
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
