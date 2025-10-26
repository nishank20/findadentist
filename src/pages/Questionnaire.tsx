import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { Progress } from "@/components/ui/progress";
import { 
  Stethoscope, 
  Sparkles, 
  Wrench, 
  MapPin, 
  DollarSign,
  Check,
  Baby,
  Scissors,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

const specialtyOptions = [
  { id: "pediatric", label: "Pediatric dentist", icon: Baby },
  { id: "orthodontist", label: "Orthodontist", icon: Scissors },
  { id: "oral-surgeon", label: "Oral Surgeon", icon: Wrench },
  { id: "periodontist", label: "Periodontist (gums and bone)", icon: Users },
];

export default function Questionnaire() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({
    routineCare: "",
    specialty: "",
    cosmetic: "",
    restorative: "",
    convenience: "",
    affordable: "",
  });

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const params = new URLSearchParams(searchParams);
    Object.entries(answers).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    navigate(`/results?${params.toString()}`);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return answers.routineCare !== "";
      case 2:
        return answers.specialty !== "";
      case 3:
        return answers.cosmetic !== "";
      case 4:
        return answers.restorative !== "";
      case 5:
        return answers.convenience !== "";
      case 6:
        return answers.affordable !== "";
      default:
        return false;
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case 1: return Stethoscope;
      case 2: return Users;
      case 3: return Sparkles;
      case 4: return Wrench;
      case 5: return MapPin;
      case 6: return DollarSign;
      default: return Stethoscope;
    }
  };

  const StepIcon = getStepIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-4 animate-scale-in">
                <StepIcon className="w-8 h-8 text-primary" />
              </div>
            </div>
            <Progress value={progress} className="h-2 mb-3" />
            <p className="text-sm font-medium text-muted-foreground text-center">
              Question {currentStep} of {totalSteps}
            </p>
          </div>

          <Card className="p-8 md:p-10 shadow-2xl border-2 animate-fade-in">
            {currentStep === 1 && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                  Are you looking for routine dental care?
                </h2>
                <RadioGroup
                  value={answers.routineCare}
                  onValueChange={(value) =>
                    setAnswers({ ...answers, routineCare: value })
                  }
                  className="space-y-4"
                >
                  <div 
                    className={cn(
                      "group relative flex items-center space-x-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                      "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
                      answers.routineCare === "yes" && "border-primary bg-primary/5 shadow-md"
                    )}
                  >
                    <RadioGroupItem value="yes" id="routine-yes" className="w-5 h-5" />
                    <Label htmlFor="routine-yes" className="flex-1 cursor-pointer text-lg font-medium">
                      Yes, I need regular check-ups
                    </Label>
                    {answers.routineCare === "yes" && (
                      <Check className="w-6 h-6 text-primary animate-scale-in" />
                    )}
                  </div>
                  <div 
                    className={cn(
                      "group relative flex items-center space-x-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                      "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
                      answers.routineCare === "no" && "border-primary bg-primary/5 shadow-md"
                    )}
                  >
                    <RadioGroupItem value="no" id="routine-no" className="w-5 h-5" />
                    <Label htmlFor="routine-no" className="flex-1 cursor-pointer text-lg font-medium">
                      No, not at this time
                    </Label>
                    {answers.routineCare === "no" && (
                      <Check className="w-6 h-6 text-primary animate-scale-in" />
                    )}
                  </div>
                </RadioGroup>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                  Are you looking for a specialty dentist?
                </h2>
                <RadioGroup
                  value={answers.specialty}
                  onValueChange={(value) =>
                    setAnswers({ ...answers, specialty: value })
                  }
                  className="space-y-3"
                >
                  {specialtyOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <div
                        key={option.id}
                        className={cn(
                          "group relative flex items-center space-x-4 p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                          "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
                          answers.specialty === option.id && "border-primary bg-primary/5 shadow-md"
                        )}
                      >
                        <RadioGroupItem value={option.id} id={option.id} className="w-5 h-5" />
                        <Icon className={cn(
                          "w-6 h-6 transition-colors",
                          answers.specialty === option.id ? "text-primary" : "text-muted-foreground"
                        )} />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer text-lg font-medium">
                          {option.label}
                        </Label>
                        {answers.specialty === option.id && (
                          <Check className="w-6 h-6 text-primary animate-scale-in" />
                        )}
                      </div>
                    );
                  })}
                  <div 
                    className={cn(
                      "group relative flex items-center space-x-4 p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                      "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
                      answers.specialty === "none" && "border-primary bg-primary/5 shadow-md"
                    )}
                  >
                    <RadioGroupItem value="none" id="specialty-none" className="w-5 h-5" />
                    <Label htmlFor="specialty-none" className="flex-1 cursor-pointer text-lg font-medium">
                      No specialty needed
                    </Label>
                    {answers.specialty === "none" && (
                      <Check className="w-6 h-6 text-primary animate-scale-in" />
                    )}
                  </div>
                </RadioGroup>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3">
                    Do you have a preference for cosmetic dental services?
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Such as whitening, veneers, or smile makeovers
                  </p>
                </div>
                <RadioGroup
                  value={answers.cosmetic}
                  onValueChange={(value) =>
                    setAnswers({ ...answers, cosmetic: value })
                  }
                  className="space-y-4"
                >
                  <div 
                    className={cn(
                      "group relative flex items-center space-x-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                      "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
                      answers.cosmetic === "yes" && "border-primary bg-primary/5 shadow-md"
                    )}
                  >
                    <RadioGroupItem value="yes" id="cosmetic-yes" className="w-5 h-5" />
                    <Sparkles className={cn(
                      "w-6 h-6 transition-colors",
                      answers.cosmetic === "yes" ? "text-primary" : "text-muted-foreground"
                    )} />
                    <Label htmlFor="cosmetic-yes" className="flex-1 cursor-pointer text-lg font-medium">
                      Yes, I'm interested in cosmetic services
                    </Label>
                    {answers.cosmetic === "yes" && (
                      <Check className="w-6 h-6 text-primary animate-scale-in" />
                    )}
                  </div>
                  <div 
                    className={cn(
                      "group relative flex items-center space-x-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                      "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
                      answers.cosmetic === "no" && "border-primary bg-primary/5 shadow-md"
                    )}
                  >
                    <RadioGroupItem value="no" id="cosmetic-no" className="w-5 h-5" />
                    <Label htmlFor="cosmetic-no" className="flex-1 cursor-pointer text-lg font-medium">
                      No, not interested
                    </Label>
                    {answers.cosmetic === "no" && (
                      <Check className="w-6 h-6 text-primary animate-scale-in" />
                    )}
                  </div>
                </RadioGroup>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3">
                    Are you seeking restorative or advanced treatments?
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Such as implants, crowns, bridges, or root canals
                  </p>
                </div>
                <RadioGroup
                  value={answers.restorative}
                  onValueChange={(value) =>
                    setAnswers({ ...answers, restorative: value })
                  }
                  className="space-y-4"
                >
                  <div 
                    className={cn(
                      "group relative flex items-center space-x-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                      "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
                      answers.restorative === "yes" && "border-primary bg-primary/5 shadow-md"
                    )}
                  >
                    <RadioGroupItem value="yes" id="restorative-yes" className="w-5 h-5" />
                    <Wrench className={cn(
                      "w-6 h-6 transition-colors",
                      answers.restorative === "yes" ? "text-primary" : "text-muted-foreground"
                    )} />
                    <Label htmlFor="restorative-yes" className="flex-1 cursor-pointer text-lg font-medium">
                      Yes, I need advanced treatments
                    </Label>
                    {answers.restorative === "yes" && (
                      <Check className="w-6 h-6 text-primary animate-scale-in" />
                    )}
                  </div>
                  <div 
                    className={cn(
                      "group relative flex items-center space-x-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                      "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
                      answers.restorative === "no" && "border-primary bg-primary/5 shadow-md"
                    )}
                  >
                    <RadioGroupItem value="no" id="restorative-no" className="w-5 h-5" />
                    <Label htmlFor="restorative-no" className="flex-1 cursor-pointer text-lg font-medium">
                      No, not needed
                    </Label>
                    {answers.restorative === "no" && (
                      <Check className="w-6 h-6 text-primary animate-scale-in" />
                    )}
                  </div>
                </RadioGroup>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                  Is convenient location or flexible scheduling a priority for you?
                </h2>
                <RadioGroup
                  value={answers.convenience}
                  onValueChange={(value) =>
                    setAnswers({ ...answers, convenience: value })
                  }
                  className="space-y-4"
                >
                  <div 
                    className={cn(
                      "group relative flex items-center space-x-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                      "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
                      answers.convenience === "yes" && "border-primary bg-primary/5 shadow-md"
                    )}
                  >
                    <RadioGroupItem value="yes" id="convenience-yes" className="w-5 h-5" />
                    <MapPin className={cn(
                      "w-6 h-6 transition-colors",
                      answers.convenience === "yes" ? "text-primary" : "text-muted-foreground"
                    )} />
                    <Label htmlFor="convenience-yes" className="flex-1 cursor-pointer text-lg font-medium">
                      Yes, convenience is important
                    </Label>
                    {answers.convenience === "yes" && (
                      <Check className="w-6 h-6 text-primary animate-scale-in" />
                    )}
                  </div>
                  <div 
                    className={cn(
                      "group relative flex items-center space-x-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                      "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
                      answers.convenience === "no" && "border-primary bg-primary/5 shadow-md"
                    )}
                  >
                    <RadioGroupItem value="no" id="convenience-no" className="w-5 h-5" />
                    <Label htmlFor="convenience-no" className="flex-1 cursor-pointer text-lg font-medium">
                      No, not a priority
                    </Label>
                    {answers.convenience === "no" && (
                      <Check className="w-6 h-6 text-primary animate-scale-in" />
                    )}
                  </div>
                </RadioGroup>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                  Are affordable payment options important?
                </h2>
                <RadioGroup
                  value={answers.affordable}
                  onValueChange={(value) =>
                    setAnswers({ ...answers, affordable: value })
                  }
                  className="space-y-4"
                >
                  <div 
                    className={cn(
                      "group relative flex items-center space-x-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                      "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
                      answers.affordable === "yes" && "border-primary bg-primary/5 shadow-md"
                    )}
                  >
                    <RadioGroupItem value="yes" id="affordable-yes" className="w-5 h-5" />
                    <DollarSign className={cn(
                      "w-6 h-6 transition-colors",
                      answers.affordable === "yes" ? "text-primary" : "text-muted-foreground"
                    )} />
                    <Label htmlFor="affordable-yes" className="flex-1 cursor-pointer text-lg font-medium">
                      Yes, affordability matters
                    </Label>
                    {answers.affordable === "yes" && (
                      <Check className="w-6 h-6 text-primary animate-scale-in" />
                    )}
                  </div>
                  <div 
                    className={cn(
                      "group relative flex items-center space-x-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                      "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50",
                      answers.affordable === "no" && "border-primary bg-primary/5 shadow-md"
                    )}
                  >
                    <RadioGroupItem value="no" id="affordable-no" className="w-5 h-5" />
                    <Label htmlFor="affordable-no" className="flex-1 cursor-pointer text-lg font-medium">
                      No, cost is not a concern
                    </Label>
                    {answers.affordable === "no" && (
                      <Check className="w-6 h-6 text-primary animate-scale-in" />
                    )}
                  </div>
                </RadioGroup>
              </div>
            )}

            <div className="flex justify-between mt-10 gap-4">
              {currentStep > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  size="lg"
                  className="px-8"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="ml-auto px-8"
                size="lg"
              >
                {currentStep === totalSteps ? "See My Results 🎉" : "Next Question →"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
