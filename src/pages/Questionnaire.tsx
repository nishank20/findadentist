import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
    id: "general",
    title: "General Practitioner",
    description: "Provides comprehensive dental care including exams, cleanings, fillings, and preventive treatments for patients of all ages.",
  },
  {
    id: "pediatric",
    title: "Pediatric Dentist",
    description: "Specialized in caring for infants, children, and teens—offering gentle, age-appropriate treatment and guidance for growing smiles.",
  },
  {
    id: "endodontist",
    title: "Endodontist",
    description: "Specializes in root canal therapy and treating diseases of the dental pulp—essential for saving damaged or infected teeth.",
  },
  {
    id: "oral-surgeon",
    title: "Oral Surgeon",
    description: "Handles surgical procedures like wisdom tooth removal, dental implants, and jaw corrections—ideal for more complex dental needs.",
  },
  {
    id: "orthodontist",
    title: "Orthodontist",
    description: "Focused on straightening teeth and aligning bites using braces, clear aligners, and other corrective tools for long-term oral health.",
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
      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 md:mb-8 animate-fade-in">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 md:mb-6">
              {step === "care" 
                ? "What Type of Care are You Looking For?"
                : "What Type of Specialist are You Looking For?"}
            </h1>
          </div>

          {/* Care Type Cards */}
          {step === "care" && (
            <div className="space-y-2.5 md:space-y-3">
              {careTypes.map((care, index) => (
                <div
                  key={care.id}
                  onClick={() => handleCareSelection(care.id)}
                  className={cn(
                    "group relative p-3 md:p-4 rounded-xl md:rounded-2xl border-2 cursor-pointer transition-all duration-500",
                    "active:scale-[0.98] md:hover:shadow-2xl md:hover:scale-[1.02] md:hover:-translate-y-1",
                    "bg-gradient-to-br from-card via-card to-primary/5",
                    "border-border hover:border-primary",
                    "animate-fade-in overflow-hidden"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Animated background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-1.5 md:mb-2">
                      <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 pr-2">
                        {care.title}
                      </h3>
                      <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary group-hover:text-primary-foreground transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
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
            <div className="space-y-2.5 md:space-y-3">
              {specialistTypes.map((specialist, index) => (
                <div
                  key={specialist.id}
                  onClick={() => handleSpecialistSelection(specialist.id)}
                  className={cn(
                    "group relative p-3 md:p-4 rounded-xl md:rounded-2xl border-2 cursor-pointer transition-all duration-500",
                    "active:scale-[0.98] md:hover:shadow-2xl md:hover:scale-[1.02] md:hover:-translate-y-1",
                    "bg-gradient-to-br from-card via-card to-secondary/5",
                    "border-border hover:border-primary",
                    "animate-fade-in overflow-hidden"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Animated background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 via-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-1.5 md:mb-2">
                      <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 pr-2">
                        {specialist.title}
                      </h3>
                      <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary group-hover:text-primary-foreground transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                      {specialist.description}
                    </p>
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
              ))}

              {/* Back Button */}
              <div className="mt-6 md:mt-8">
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={handleBack}
                  className="px-6 md:px-8 w-full md:w-auto"
                >
                  ← Back to Care Types
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
