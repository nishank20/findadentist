import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CostCalculatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ServiceCategory {
  title: string;
  services: string[];
}

const serviceCategories: ServiceCategory[] = [
  {
    title: "Preventive & Diagnostic Care",
    services: [
      "Routine dental exam and cleaning",
      "Dental exam with full-mouth x-rays",
      "Dental exam with bitewing x-rays",
      "New patient visit (exam, x-rays, cleaning)",
      "Emergency visit (exam and limited x-ray)",
    ],
  },
  {
    title: "Restorative Treatments",
    services: [
      "Tooth-colored filling (1 surface)",
      "Tooth-colored filling (multiple surfaces)",
      "Dental crown (porcelain or ceramic)",
      "Root canal (front tooth vs. molar)",
      "Tooth extraction (simple vs. surgical)",
    ],
  },
  {
    title: "Cosmetic Services",
    services: [
      "Teeth whitening (in-office or take-home kit)",
      "Porcelain veneers (per tooth)",
      "Cosmetic bonding (minor chip or gap)",
    ],
  },
  {
    title: "Advanced Procedures",
    services: [
      "Dental implant (single tooth, no bone graft)",
      "Implant crown (attached to existing implant)",
      "Full denture (upper or lower)",
      "Partial denture (with metal framework)",
    ],
  },
  {
    title: "Pediatric Care",
    services: [
      "Child's dental exam and cleaning",
      "Fluoride treatment",
      "Sealants (per tooth)",
    ],
  },
];

const mockPriceData: Record<string, { range: string; note: string }> = {
  "Dental exam with full-mouth x-rays": {
    range: "$120 – $250",
    note: "Many insurance plans cover preventive visits—many plans include exams and x-rays at no cost.",
  },
  "Routine dental exam and cleaning": {
    range: "$75 – $200",
    note: "Most insurance plans cover 100% of preventive cleanings twice per year.",
  },
  "Tooth-colored filling (1 surface)": {
    range: "$150 – $300",
    note: "Insurance typically covers 80% of restorative treatments after deductible.",
  },
  "Dental crown (porcelain or ceramic)": {
    range: "$800 – $1,500",
    note: "Insurance may cover 50% of major procedures after deductible.",
  },
};

export const CostCalculatorDialog = ({
  open,
  onOpenChange,
}: CostCalculatorDialogProps) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleServiceToggle = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = () => {
    if (selectedServices.length > 0) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setSelectedServices([]);
    setShowResults(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dental Fee Search Form
          </DialogTitle>
        </DialogHeader>

        {!showResults ? (
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Request (choose one or more)
            </p>

            {serviceCategories.map((category) => (
              <div key={category.title} className="space-y-3">
                <h3 className="font-semibold text-lg text-foreground">
                  {category.title}
                </h3>
                <div className="space-y-2 ml-2">
                  {category.services.map((service) => (
                    <div key={service} className="flex items-start space-x-3">
                      <Checkbox
                        id={service}
                        checked={selectedServices.includes(service)}
                        onCheckedChange={() => handleServiceToggle(service)}
                      />
                      <Label
                        htmlFor={service}
                        className="text-sm cursor-pointer leading-relaxed"
                      >
                        {service}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <Button
              onClick={handleSubmit}
              disabled={selectedServices.length === 0}
              className="w-full"
              size="lg"
            >
              Submit
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">Response</h3>
              <Button onClick={handleReset} variant="outline" size="sm">
                New Search
              </Button>
            </div>

            <Separator />

            {selectedServices.map((service) => {
              const priceInfo =
                mockPriceData[service] || {
                  range: "$100 – $500",
                  note: "Based on recent estimates. Actual fees may vary by provider and insurance.",
                };

              return (
                <Card key={service} className="p-6 space-y-3 border-primary/20">
                  <h4 className="font-semibold text-lg text-primary">
                    {service}
                  </h4>
                  <div className="space-y-2">
                    <p className="text-foreground">
                      <span className="font-medium">
                        Typical Fee Range in Your Area:
                      </span>{" "}
                      <span className="text-xl font-bold text-primary">
                        {priceInfo.range}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      {priceInfo.note}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
