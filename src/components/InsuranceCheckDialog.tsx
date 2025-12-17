import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Shield, CheckCircle2, XCircle, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";

const insuranceSchema = z.object({
  carrier: z.string().min(1, "Please select an insurance carrier"),
  relation: z.string().min(1, "Please select your relation to subscriber"),
  subscriberFirstName: z.string().min(1, "First name is required"),
  subscriberLastName: z.string().min(1, "Last name is required"),
  subscriberEmail: z.string().email("Please enter a valid email address"),
  subscriberGender: z.string().min(1, "Please select gender"),
  subscriberDob: z.string().min(1, "Date of birth is required"),
  subscriberId: z.string().min(1, "Subscriber ID is required"),
  groupNo: z.string().min(1, "Group number is required"),
  subscriberAddress: z.string().min(1, "Address is required"),
  subscriberCity: z.string().min(1, "City is required"),
  subscriberState: z.string().min(1, "State is required"),
  subscriberZip: z.string().regex(/^\d{5}$/, "Please enter a valid 5-digit zip code"),
});

interface InsuranceCheckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const insuranceCarriers = [
  "Aetna Dental",
  "Blue Cross Blue Shield",
  "Cigna Dental",
  "Humana Dental",
  "MetLife Dental",
  "United Concordia Dental",
  "Other",
];

const relations = ["Self", "Spouse", "Dependent", "Other"];

const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

export const InsuranceCheckDialog = ({
  open,
  onOpenChange,
}: InsuranceCheckDialogProps) => {
  const [showForm, setShowForm] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [eligibility, setEligibility] = useState<"eligible" | "not-eligible" | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    carrier: "",
    relation: "",
    subscriberFirstName: "",
    subscriberLastName: "",
    subscriberEmail: "",
    subscriberGender: "",
    subscriberDob: "",
    subscriberId: "",
    employer: "",
    groupNo: "",
    subscriberAddress: "",
    subscriberCity: "",
    subscriberState: "",
    subscriberZip: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleContinue = () => {
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = insuranceSchema.safeParse(formData);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    // Simulate insurance check - randomly determine eligibility
    const isEligible = Math.random() > 0.3;
    setEligibility(isEligible ? "eligible" : "not-eligible");
    setShowResults(true);
  };

  const handleReset = () => {
    setShowForm(false);
    setShowResults(false);
    setEligibility(null);
    setErrors({});
    setFormData({
      carrier: "",
      relation: "",
      subscriberFirstName: "",
      subscriberLastName: "",
      subscriberEmail: "",
      subscriberGender: "",
      subscriberDob: "",
      subscriberId: "",
      employer: "",
      groupNo: "",
      subscriberAddress: "",
      subscriberCity: "",
      subscriberState: "",
      subscriberZip: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) {
        setTimeout(handleReset, 200);
      }
    }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Dental Insurance Information
          </DialogTitle>
        </DialogHeader>

        {!showForm && !showResults ? (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>

            <Card className="p-6 bg-secondary/20 border-secondary">
              <div className="space-y-4">
                <p className="font-medium">
                  Good news! Most dental insurance plans now include coverage for dental.com services. Our exclusive arrangements encompass popular providers like:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="list-disc">Aetna</li>
                  <li className="list-disc">Blue Cross Blue Shield</li>
                  <li className="list-disc">Cigna</li>
                  <li className="list-disc">MetLife</li>
                  <li className="list-disc">United Concordia</li>
                  <li className="list-disc">Humana</li>
                </ul>
              </div>
            </Card>

            <Button onClick={handleContinue} className="w-full" size="lg">
              Continue
            </Button>
          </div>
        ) : showResults ? (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                eligibility === "eligible" 
                  ? "bg-green-500/10" 
                  : "bg-destructive/10"
              }`}>
                {eligibility === "eligible" ? (
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                ) : (
                  <XCircle className="w-8 h-8 text-destructive" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  {eligibility === "eligible" 
                    ? "You're Eligible!" 
                    : "Coverage Not Confirmed"}
                </h3>
              </div>
            </div>

            {eligibility === "eligible" ? (
              <>
                <p className="text-sm text-muted-foreground">
                  As of {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, our electronic eligibility check indicates that {formData.subscriberFirstName} {formData.subscriberLastName} is eligible for dental benefits under your plan listed below. Please note that this information is based on the most recent data provided by your insurer and does not guarantee coverage for specific services. Final determination of benefits will be made by your insurance carrier at the time of claim processing.
                </p>

                <Card className="p-4 bg-muted/30">
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">NAME:</span> {formData.subscriberFirstName} {formData.subscriberLastName}</p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">INSURANCE CARRIER:</span>
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-medium">
                        {formData.carrier.toUpperCase().replace(' DENTAL', '')}
                      </span>
                    </p>
                    <p><span className="font-medium">SUBSCRIBER ID:</span> {formData.subscriberId}</p>
                    <p><span className="font-medium">GROUP #:</span> {formData.groupNo}</p>
                  </div>
                </Card>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  As of {new Date().toLocaleDateString()}, our electronic eligibility check did not return a match for your information. The response was 'subscriber not found.' Please note that this does not necessarily mean you are ineligible - it may simply reflect how your information is entered with your insurer.
                </p>

                <Card className="p-4 bg-muted/30">
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">NAME:</span> {formData.subscriberFirstName} {formData.subscriberLastName}</p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">INSURANCE CARRIER:</span>
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-medium">
                        {formData.carrier.toUpperCase().replace(' DENTAL', '')}
                      </span>
                    </p>
                    <p><span className="font-medium">SUBSCRIBER ID:</span> {formData.subscriberId}</p>
                    <p><span className="font-medium">GROUP #:</span> {formData.groupNo}</p>
                  </div>
                </Card>

                <div className="space-y-3">
                  <h4 className="font-semibold">What do I do next:</h4>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal ml-5">
                    <li>Make sure that the information above is correct. If not, simply submit the form once again.</li>
                    <li>If the information is correct, we recommend contacting your insurance carrier directly.</li>
                  </ol>
                </div>
              </>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Check Another Insurance
              </Button>
              <Button className="flex-1">
                Continue
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="carrier">
                  Dental Insurance Carrier <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.carrier} 
                  onValueChange={(value) => handleInputChange("carrier", value)}
                >
                  <SelectTrigger className={errors.carrier ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select Insurance Carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    {insuranceCarriers.map((carrier) => (
                      <SelectItem key={carrier} value={carrier}>
                        {carrier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.carrier && (
                  <p className="text-sm text-destructive">{errors.carrier}</p>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="relation" className="flex items-center gap-2">
                  Patient Relation to Insurance Subscriber <span className="text-destructive">*</span>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </Label>
                <Select 
                  value={formData.relation} 
                  onValueChange={(value) => handleInputChange("relation", value)}
                >
                  <SelectTrigger className={errors.relation ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select Relation" />
                  </SelectTrigger>
                  <SelectContent>
                    {relations.map((relation) => (
                      <SelectItem key={relation} value={relation}>
                        {relation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.relation && (
                  <p className="text-sm text-destructive">{errors.relation}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subscriberFirstName">
                  Subscriber First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subscriberFirstName"
                  placeholder="Subscriber First Name"
                  value={formData.subscriberFirstName}
                  onChange={(e) => handleInputChange("subscriberFirstName", e.target.value)}
                  className={errors.subscriberFirstName ? "border-destructive" : ""}
                />
                {errors.subscriberFirstName && (
                  <p className="text-sm text-destructive">{errors.subscriberFirstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subscriberLastName">
                  Subscriber Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subscriberLastName"
                  placeholder="Subscriber Last Name"
                  value={formData.subscriberLastName}
                  onChange={(e) => handleInputChange("subscriberLastName", e.target.value)}
                  className={errors.subscriberLastName ? "border-destructive" : ""}
                />
                {errors.subscriberLastName && (
                  <p className="text-sm text-destructive">{errors.subscriberLastName}</p>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="subscriberEmail">
                  Subscriber Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subscriberEmail"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.subscriberEmail}
                  onChange={(e) => handleInputChange("subscriberEmail", e.target.value)}
                  className={errors.subscriberEmail ? "border-destructive" : ""}
                />
                {errors.subscriberEmail && (
                  <p className="text-sm text-destructive">{errors.subscriberEmail}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  Subscriber Gender <span className="text-destructive">*</span>
                </Label>
                <RadioGroup 
                  value={formData.subscriberGender}
                  onValueChange={(value) => handleInputChange("subscriberGender", value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="font-normal cursor-pointer">Other</Label>
                  </div>
                </RadioGroup>
                {errors.subscriberGender && (
                  <p className="text-sm text-destructive">{errors.subscriberGender}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subscriberDob">
                  Subscriber Date of Birth <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subscriberDob"
                  type="date"
                  value={formData.subscriberDob}
                  onChange={(e) => handleInputChange("subscriberDob", e.target.value)}
                  className={errors.subscriberDob ? "border-destructive" : ""}
                />
                {errors.subscriberDob && (
                  <p className="text-sm text-destructive">{errors.subscriberDob}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subscriberId">
                  Subscriber ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subscriberId"
                  placeholder="Subscriber ID"
                  value={formData.subscriberId}
                  onChange={(e) => handleInputChange("subscriberId", e.target.value)}
                  className={errors.subscriberId ? "border-destructive" : ""}
                />
                {errors.subscriberId && (
                  <p className="text-sm text-destructive">{errors.subscriberId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="employer">Building/Employer</Label>
                <Input
                  id="employer"
                  placeholder="Employer"
                  value={formData.employer}
                  onChange={(e) => handleInputChange("employer", e.target.value)}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="groupNo">
                  Group No <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="groupNo"
                  placeholder="Group no"
                  value={formData.groupNo}
                  onChange={(e) => handleInputChange("groupNo", e.target.value)}
                  className={errors.groupNo ? "border-destructive" : ""}
                />
                {errors.groupNo && (
                  <p className="text-sm text-destructive">{errors.groupNo}</p>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="subscriberAddress">
                  Subscriber Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subscriberAddress"
                  placeholder="Address"
                  value={formData.subscriberAddress}
                  onChange={(e) => handleInputChange("subscriberAddress", e.target.value)}
                  className={errors.subscriberAddress ? "border-destructive" : ""}
                />
                {errors.subscriberAddress && (
                  <p className="text-sm text-destructive">{errors.subscriberAddress}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subscriberCity">
                  Subscriber City <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subscriberCity"
                  placeholder="City"
                  value={formData.subscriberCity}
                  onChange={(e) => handleInputChange("subscriberCity", e.target.value)}
                  className={errors.subscriberCity ? "border-destructive" : ""}
                />
                {errors.subscriberCity && (
                  <p className="text-sm text-destructive">{errors.subscriberCity}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subscriberState">
                  Subscriber State <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.subscriberState} 
                  onValueChange={(value) => handleInputChange("subscriberState", value)}
                >
                  <SelectTrigger className={errors.subscriberState ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subscriberState && (
                  <p className="text-sm text-destructive">{errors.subscriberState}</p>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="subscriberZip">
                  Subscriber Zip <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subscriberZip"
                  placeholder="Zip Code"
                  maxLength={5}
                  value={formData.subscriberZip}
                  onChange={(e) => handleInputChange("subscriberZip", e.target.value)}
                  className={errors.subscriberZip ? "border-destructive" : ""}
                />
                {errors.subscriberZip && (
                  <p className="text-sm text-destructive">{errors.subscriberZip}</p>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex gap-3 justify-center">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} size="lg">
                Back
              </Button>
              <Button type="submit" size="lg">
                Save
              </Button>
            </div>

            <div className="text-right">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground"
              >
                Skip
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
