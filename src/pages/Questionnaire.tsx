import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { Progress } from "@/components/ui/progress";

const specialtyOptions = [
  { id: "pediatric", label: "Pediatric dentist" },
  { id: "orthodontist", label: "Orthodontist" },
  { id: "oral-surgeon", label: "Oral Surgeon" },
  { id: "periodontist", label: "Periodontist (gums and bone)" },
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Progress value={progress} className="h-2 mb-2" />
            <p className="text-sm text-muted-foreground text-center">
              Question {currentStep} of {totalSteps}
            </p>
          </div>

          <Card className="p-8 shadow-lg">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Are you looking for routine dental care?
                </h2>
                <RadioGroup
                  value={answers.routineCare}
                  onValueChange={(value) =>
                    setAnswers({ ...answers, routineCare: value })
                  }
                >
                  <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="yes" id="routine-yes" />
                    <Label htmlFor="routine-yes" className="flex-1 cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="no" id="routine-no" />
                    <Label htmlFor="routine-no" className="flex-1 cursor-pointer">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Are you looking for a specialty dentist?
                </h2>
                <RadioGroup
                  value={answers.specialty}
                  onValueChange={(value) =>
                    setAnswers({ ...answers, specialty: value })
                  }
                >
                  {specialtyOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="none" id="specialty-none" />
                    <Label htmlFor="specialty-none" className="flex-1 cursor-pointer">
                      No specialty needed
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Do you have a preference for cosmetic dental services?
                </h2>
                <p className="text-muted-foreground">
                  (e.g., whitening, veneers)
                </p>
                <RadioGroup
                  value={answers.cosmetic}
                  onValueChange={(value) =>
                    setAnswers({ ...answers, cosmetic: value })
                  }
                >
                  <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="yes" id="cosmetic-yes" />
                    <Label htmlFor="cosmetic-yes" className="flex-1 cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="no" id="cosmetic-no" />
                    <Label htmlFor="cosmetic-no" className="flex-1 cursor-pointer">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Are you seeking restorative or advanced treatments?
                </h2>
                <p className="text-muted-foreground">
                  (e.g., implants, crowns, bridges)
                </p>
                <RadioGroup
                  value={answers.restorative}
                  onValueChange={(value) =>
                    setAnswers({ ...answers, restorative: value })
                  }
                >
                  <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="yes" id="restorative-yes" />
                    <Label htmlFor="restorative-yes" className="flex-1 cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="no" id="restorative-no" />
                    <Label htmlFor="restorative-no" className="flex-1 cursor-pointer">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Is convenient location or flexible scheduling a priority for you?
                </h2>
                <RadioGroup
                  value={answers.convenience}
                  onValueChange={(value) =>
                    setAnswers({ ...answers, convenience: value })
                  }
                >
                  <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="yes" id="convenience-yes" />
                    <Label htmlFor="convenience-yes" className="flex-1 cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="no" id="convenience-no" />
                    <Label htmlFor="convenience-no" className="flex-1 cursor-pointer">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Are affordable payment options important?
                </h2>
                <RadioGroup
                  value={answers.affordable}
                  onValueChange={(value) =>
                    setAnswers({ ...answers, affordable: value })
                  }
                >
                  <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="yes" id="affordable-yes" />
                    <Label htmlFor="affordable-yes" className="flex-1 cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="no" id="affordable-no" />
                    <Label htmlFor="affordable-no" className="flex-1 cursor-pointer">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <div className="flex justify-between mt-8 gap-4">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="ml-auto"
              >
                {currentStep === totalSteps ? "See Results" : "Next"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
