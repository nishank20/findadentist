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
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {step === "care" 
                  ? "What Type of Care are You Looking For?"
                  : "What Type of Specialist are You Looking For?"}
              </h1>
              
              {/* Emergency Button */}
              <Button 
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg px-6 py-3 text-sm font-semibold rounded-full transition-all duration-300"
              >
                Immediate Online Emergency Visit
              </Button>
            </div>

            {/* Skip Button */}
            {step === "care" && (
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={handleSkip}
                  className="text-sm"
                >
                  Skip to search results
                </Button>
              </div>
            )}
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
            <div className="space-y-5">
              {careTypes.map((care, index) => (
                <div
                  key={care.id}
                  onClick={() => handleCareSelection(care.id)}
                  className={cn(
                    "group relative p-8 rounded-3xl border-2 cursor-pointer transition-all duration-500",
                    "hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1",
                    "bg-gradient-to-br from-card via-card to-primary/5",
                    "border-border hover:border-primary",
                    "animate-fade-in overflow-hidden"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Animated background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {care.title}
                      </h3>
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                      {care.description}
                    </p>
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
              ))}
            </div>
          )}

          {/* Specialist Type Cards */}
          {step === "specialist" && (
            <div className="space-y-5">
              {specialistTypes.map((specialist, index) => (
                <div
                  key={specialist.id}
                  onClick={() => handleSpecialistSelection(specialist.id)}
                  className={cn(
                    "group relative p-8 rounded-3xl border-2 cursor-pointer transition-all duration-500",
                    "hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1",
                    "bg-gradient-to-br from-card via-card to-secondary/5",
                    "border-border hover:border-primary",
                    "animate-fade-in overflow-hidden"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Animated background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 via-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {specialist.title}
                      </h3>
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                      {specialist.description}
                    </p>
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
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
