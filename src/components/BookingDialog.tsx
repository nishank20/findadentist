import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Clock, Shield, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const userInfoSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  mobile: z.string().trim().max(20).optional(),
  email: z.string().trim().min(1, "Email is required").email("Invalid email address").max(255),
});

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dentistName: string;
}

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

const insuranceOptions = [
  "- no insurance -",
  "Delta Dental",
  "Aetna",
  "Cigna",
  "UnitedHealthcare",
  "MetLife",
  "Humana",
];

export function BookingDialog({ open, onOpenChange, dentistName }: BookingDialogProps) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedInsurance, setSelectedInsurance] = useState<string>("- no insurance -");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && selectedDate && selectedTime) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleBooking = () => {
    // Validate user info
    const result = userInfoSchema.safeParse({
      firstName,
      lastName,
      mobile,
      email,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    // Handle booking logic here
    toast({
      title: "Request Submitted Successfully",
      description: "Your request has been successfully submitted. The dental office will review your request and reach out to confirm your appointment details. If you do not hear from the office within a reasonable time, please contact them directly at [Office Phone Number] or [Office Email] for assistance.",
    });
    
    // Reset form
    setStep(1);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setFirstName("");
    setLastName("");
    setMobile("");
    setEmail("");
    setErrors({});
    onOpenChange(false);
  };

  const resetAndClose = () => {
    setStep(1);
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {step === 1 && "Select Insurance"}
            {step === 2 && `Choose your appointment time with ${dentistName}`}
            {step === 3 && "Enter Your Information"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Step 1: Insurance Selection */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-2 mb-4 text-lg font-medium">
                <Shield className="w-5 h-5 text-primary" />
                <span>Insurance</span>
              </div>
              <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {insuranceOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-2">
                Selected: {selectedInsurance}
              </p>
            </div>
          )}

          {/* Step 2: Date and Time Selection */}
          {step === 2 && (
            <>
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Insurance:</span> {selectedInsurance}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Date Selection */}
                <div>
                  <div className="flex items-center gap-2 mb-4 text-lg font-medium">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    <span>Select Date</span>
                  </div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-lg border bg-card pointer-events-auto"
                    disabled={(date) => date < new Date()}
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <div className="flex items-center gap-2 mb-4 text-lg font-medium">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>Select Time</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className="h-14 text-base"
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Personal Information */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="mb-4 p-3 bg-muted rounded-lg space-y-1">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Insurance:</span> {selectedInsurance}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Date & Time:</span>{" "}
                  {selectedDate && selectedTime ? `${selectedDate.toLocaleDateString()} at ${selectedTime}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-2 mb-4 text-lg font-medium">
                <User className="w-5 h-5 text-primary" />
                <span>Your Information</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setErrors((prev) => ({ ...prev, firstName: "" }));
                    }}
                    placeholder="Enter first name"
                    className={errors.firstName ? "border-destructive" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setErrors((prev) => ({ ...prev, lastName: "" }));
                    }}
                    placeholder="Enter last name"
                    className={errors.lastName ? "border-destructive" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">
                  Mobile Number
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value);
                    setErrors((prev) => ({ ...prev, mobile: "" }));
                  }}
                  placeholder="Enter mobile number"
                  className={errors.mobile ? "border-destructive" : ""}
                />
                {errors.mobile && (
                  <p className="text-sm text-destructive">{errors.mobile}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  placeholder="Enter email address"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={step === 1 ? resetAndClose : handleBack}
            className="px-8"
          >
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          
          {step < 3 ? (
            <Button
              onClick={handleNext}
              disabled={step === 2 && (!selectedDate || !selectedTime)}
              className="px-8"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleBooking}
              className="px-8"
            >
              Request Appointment
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
