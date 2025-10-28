import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { z } from "zod";

const enrollmentSchema = z.object({
  practiceName: z.string().trim().min(1, "Practice name is required").max(200),
  dentistName: z.string().trim().min(1, "Dentist name is required").max(200),
  street: z.string().trim().min(1, "Street address is required").max(300),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(1, "State is required").max(50),
  zip: z.string().trim().min(1, "ZIP code is required").max(20),
  phone: z.string().trim().min(1, "Phone number is required").max(30),
  email: z.string().trim().min(1, "Email is required").email("Invalid email address").max(255),
  website: z.string().trim().max(500).optional(),
  npi: z.string().trim().min(1, "NPI number is required").max(50),
  acceptingNewPatients: z.enum(["yes", "no"], { required_error: "Please select an option" }),
});

export default function DentistEnrollment() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Required fields
  const [practiceName, setPracticeName] = useState("");
  const [dentistName, setDentistName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [npi, setNpi] = useState("");
  
  // Practice type
  const [practiceTypes, setPracticeTypes] = useState({
    gp: false,
    fullFamily: false,
    cosmetic: false,
    anxiousPatients: false,
    afterHours: false,
    pediatric: false,
    orthodontist: false,
    periodontist: false,
    oralSurgeon: false,
    other: false,
  });
  const [otherPracticeType, setOtherPracticeType] = useState("");
  
  // Payment options
  const [paymentOptions, setPaymentOptions] = useState({
    inHouse: false,
    careCredit: false,
    membershipPlans: false,
  });
  
  // Accepting new patients
  const [acceptingNewPatients, setAcceptingNewPatients] = useState<"yes" | "no">("yes");
  
  // Insurance
  const [insuranceType, setInsuranceType] = useState<"none" | "contracted">("contracted");
  const [insurancePlans, setInsurancePlans] = useState("");
  
  // Optional enhancements
  const [languages, setLanguages] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [contactName, setContactName] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [contactTime, setContactTime] = useState("");
  const [doNotContact, setDoNotContact] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handlePracticeTypeChange = (key: string, checked: boolean) => {
    setPracticeTypes((prev) => ({ ...prev, [key]: checked }));
  };

  const handlePaymentOptionChange = (key: string, checked: boolean) => {
    setPaymentOptions((prev) => ({ ...prev, [key]: checked }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files).slice(0, 3 - photos.length);
      setPhotos((prev) => [...prev, ...fileArray]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const result = enrollmentSchema.safeParse({
      practiceName,
      dentistName,
      street,
      city,
      state,
      zip,
      phone,
      email,
      website,
      npi,
      acceptingNewPatients,
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

    // Check if at least one practice type is selected
    const hasPracticeType = Object.values(practiceTypes).some((v) => v);
    if (!hasPracticeType) {
      toast({
        title: "Practice Type Required",
        description: "Please select at least one practice type",
        variant: "destructive",
      });
      return;
    }

    setSubmitted(true);
    toast({
      title: "Enrollment Submitted Successfully",
      description: "We'll review your submission and notify you once your listing is live.",
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-3xl mx-auto px-4 py-12">
          <Card className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We'll review your submission and notify you once your listing is live.
              </p>
              <p>
                Practices using Dental.com Office may receive priority placement, but use of
                Dental.com Office is not a requirement for listing.
              </p>
              <Button
                onClick={() => navigate("/")}
                className="mt-6"
              >
                Return to Home
              </Button>
              <div className="mt-4">
                <a href="#" className="text-primary hover:underline">
                  Click here to learn more about Dental.com Office
                </a>
              </div>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dental.com Dentist Match – Enrollment Form</h1>
          <p className="text-muted-foreground">
            Complete this form to list your practice and connect with patients
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Required Information Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Required Information</h2>
            <p className="text-sm text-muted-foreground mb-6">
              These fields ensure the office can be accurately listed and contacted.
            </p>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="practiceName">
                  Practice Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="practiceName"
                  value={practiceName}
                  onChange={(e) => {
                    setPracticeName(e.target.value);
                    setErrors((prev) => ({ ...prev, practiceName: "" }));
                  }}
                  placeholder="Enter practice name"
                  className={errors.practiceName ? "border-destructive" : ""}
                />
                {errors.practiceName && (
                  <p className="text-sm text-destructive">{errors.practiceName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dentistName">
                  Primary Dentist Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dentistName"
                  value={dentistName}
                  onChange={(e) => {
                    setDentistName(e.target.value);
                    setErrors((prev) => ({ ...prev, dentistName: "" }));
                  }}
                  placeholder="Enter dentist name"
                  className={errors.dentistName ? "border-destructive" : ""}
                />
                {errors.dentistName && (
                  <p className="text-sm text-destructive">{errors.dentistName}</p>
                )}
              </div>

              <div className="space-y-4">
                <Label>
                  Practice Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Street Address"
                  value={street}
                  onChange={(e) => {
                    setStreet(e.target.value);
                    setErrors((prev) => ({ ...prev, street: "" }));
                  }}
                  className={errors.street ? "border-destructive" : ""}
                />
                {errors.street && (
                  <p className="text-sm text-destructive">{errors.street}</p>
                )}
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Input
                      placeholder="City"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setErrors((prev) => ({ ...prev, city: "" }));
                      }}
                      className={errors.city ? "border-destructive" : ""}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="State"
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        setErrors((prev) => ({ ...prev, state: "" }));
                      }}
                      className={errors.state ? "border-destructive" : ""}
                    />
                    {errors.state && (
                      <p className="text-sm text-destructive">{errors.state}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="ZIP Code"
                      value={zip}
                      onChange={(e) => {
                        setZip(e.target.value);
                        setErrors((prev) => ({ ...prev, zip: "" }));
                      }}
                      className={errors.zip ? "border-destructive" : ""}
                    />
                    {errors.zip && (
                      <p className="text-sm text-destructive">{errors.zip}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    placeholder="Enter phone number"
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-destructive">*</span>
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

              <div className="space-y-2">
                <Label htmlFor="website">Website or Booking Link</Label>
                <Input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourpractice.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="npi">
                  NPI Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="npi"
                  value={npi}
                  onChange={(e) => {
                    setNpi(e.target.value);
                    setErrors((prev) => ({ ...prev, npi: "" }));
                  }}
                  placeholder="Enter NPI number"
                  className={errors.npi ? "border-destructive" : ""}
                />
                {errors.npi && (
                  <p className="text-sm text-destructive">{errors.npi}</p>
                )}
              </div>

              <div className="space-y-4">
                <Label>
                  Practice Type <span className="text-destructive">*</span>
                  <span className="text-muted-foreground text-sm font-normal ml-2">
                    (check all that apply)
                  </span>
                </Label>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="gp"
                      checked={practiceTypes.gp}
                      onCheckedChange={(checked) =>
                        handlePracticeTypeChange("gp", checked as boolean)
                      }
                    />
                    <Label htmlFor="gp" className="font-normal cursor-pointer">
                      GP
                    </Label>
                  </div>

                  <div className="ml-6 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fullFamily"
                        checked={practiceTypes.fullFamily}
                        onCheckedChange={(checked) =>
                          handlePracticeTypeChange("fullFamily", checked as boolean)
                        }
                      />
                      <Label htmlFor="fullFamily" className="font-normal cursor-pointer">
                        Full family care
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cosmetic"
                        checked={practiceTypes.cosmetic}
                        onCheckedChange={(checked) =>
                          handlePracticeTypeChange("cosmetic", checked as boolean)
                        }
                      />
                      <Label htmlFor="cosmetic" className="font-normal cursor-pointer">
                        Cosmetic care
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="anxiousPatients"
                        checked={practiceTypes.anxiousPatients}
                        onCheckedChange={(checked) =>
                          handlePracticeTypeChange("anxiousPatients", checked as boolean)
                        }
                      />
                      <Label htmlFor="anxiousPatients" className="font-normal cursor-pointer">
                        Willing to take anxious patients
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="afterHours"
                        checked={practiceTypes.afterHours}
                        onCheckedChange={(checked) =>
                          handlePracticeTypeChange("afterHours", checked as boolean)
                        }
                      />
                      <Label htmlFor="afterHours" className="font-normal cursor-pointer">
                        After hours emergencies
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-normal">Payment Options:</Label>
                    <div className="ml-6 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="inHouse"
                          checked={paymentOptions.inHouse}
                          onCheckedChange={(checked) =>
                            handlePaymentOptionChange("inHouse", checked as boolean)
                          }
                        />
                        <Label htmlFor="inHouse" className="font-normal cursor-pointer">
                          In-house financing
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="careCredit"
                          checked={paymentOptions.careCredit}
                          onCheckedChange={(checked) =>
                            handlePaymentOptionChange("careCredit", checked as boolean)
                          }
                        />
                        <Label htmlFor="careCredit" className="font-normal cursor-pointer">
                          CareCredit
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="membershipPlans"
                          checked={paymentOptions.membershipPlans}
                          onCheckedChange={(checked) =>
                            handlePaymentOptionChange("membershipPlans", checked as boolean)
                          }
                        />
                        <Label htmlFor="membershipPlans" className="font-normal cursor-pointer">
                          Membership plans
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pediatric"
                      checked={practiceTypes.pediatric}
                      onCheckedChange={(checked) =>
                        handlePracticeTypeChange("pediatric", checked as boolean)
                      }
                    />
                    <Label htmlFor="pediatric" className="font-normal cursor-pointer">
                      Pediatric Dentist
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="orthodontist"
                      checked={practiceTypes.orthodontist}
                      onCheckedChange={(checked) =>
                        handlePracticeTypeChange("orthodontist", checked as boolean)
                      }
                    />
                    <Label htmlFor="orthodontist" className="font-normal cursor-pointer">
                      Orthodontist
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="periodontist"
                      checked={practiceTypes.periodontist}
                      onCheckedChange={(checked) =>
                        handlePracticeTypeChange("periodontist", checked as boolean)
                      }
                    />
                    <Label htmlFor="periodontist" className="font-normal cursor-pointer">
                      Periodontist
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="oralSurgeon"
                      checked={practiceTypes.oralSurgeon}
                      onCheckedChange={(checked) =>
                        handlePracticeTypeChange("oralSurgeon", checked as boolean)
                      }
                    />
                    <Label htmlFor="oralSurgeon" className="font-normal cursor-pointer">
                      Oral Surgeon
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="other"
                      checked={practiceTypes.other}
                      onCheckedChange={(checked) =>
                        handlePracticeTypeChange("other", checked as boolean)
                      }
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor="other" className="font-normal cursor-pointer">
                        Other:
                      </Label>
                      <Input
                        value={otherPracticeType}
                        onChange={(e) => setOtherPracticeType(e.target.value)}
                        placeholder="Please specify"
                        className="mt-2"
                        disabled={!practiceTypes.other}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>
                  Accepting New Patients? <span className="text-destructive">*</span>
                </Label>
                <RadioGroup value={acceptingNewPatients} onValueChange={(value: "yes" | "no") => {
                  setAcceptingNewPatients(value);
                  setErrors((prev) => ({ ...prev, acceptingNewPatients: "" }));
                }}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="accepting-yes" />
                    <Label htmlFor="accepting-yes" className="font-normal cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="accepting-no" />
                    <Label htmlFor="accepting-no" className="font-normal cursor-pointer">
                      No
                    </Label>
                  </div>
                </RadioGroup>
                {errors.acceptingNewPatients && (
                  <p className="text-sm text-destructive">{errors.acceptingNewPatients}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label>Insurance Accepted</Label>
                <RadioGroup value={insuranceType} onValueChange={(value: "none" | "contracted") => setInsuranceType(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="insurance-none" />
                    <Label htmlFor="insurance-none" className="font-normal cursor-pointer">
                      We do not accept insurance, but we will help patients bill for it
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="contracted" id="insurance-contracted" />
                    <Label htmlFor="insurance-contracted" className="font-normal cursor-pointer">
                      List contracted insurance plans
                    </Label>
                  </div>
                </RadioGroup>
                
                {insuranceType === "contracted" && (
                  <Textarea
                    placeholder="List all insurance plans accepted (one per line)"
                    value={insurancePlans}
                    onChange={(e) => setInsurancePlans(e.target.value)}
                    rows={4}
                    className="mt-2"
                  />
                )}
              </div>
            </div>
          </Card>

          {/* Optional Enhancements Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Optional Enhancements</h2>
            <p className="text-sm text-muted-foreground mb-6">
              These fields help surface the practice to more relevant patients.
            </p>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="languages">Languages Spoken</Label>
                <Input
                  id="languages"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  placeholder="e.g., English, Spanish, French"
                />
              </div>

              <div className="space-y-3">
                <Label>Photos of Office or Team</Label>
                <p className="text-sm text-muted-foreground">Upload up to 3 photos</p>
                
                <div className="space-y-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm truncate flex-1">{photo.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePhoto(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  
                  {photos.length < 3 && (
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                        multiple
                      />
                      <Label
                        htmlFor="photo-upload"
                        className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <Upload className="w-5 h-5" />
                        <span>Click to upload photos</span>
                      </Label>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Contact for Follow-Up</Label>
                
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="doNotContact"
                    checked={doNotContact}
                    onCheckedChange={(checked) => {
                      setDoNotContact(checked as boolean);
                      if (checked) {
                        setContactName("");
                        setContactRole("");
                        setContactTime("");
                      }
                    }}
                  />
                  <Label htmlFor="doNotContact" className="font-normal cursor-pointer">
                    Do not contact me
                  </Label>
                </div>

                {!doNotContact && (
                  <div className="space-y-4">
                    <Input
                      placeholder="Name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                    <Input
                      placeholder="Role"
                      value={contactRole}
                      onChange={(e) => setContactRole(e.target.value)}
                    />
                    <Input
                      placeholder="Best time to reach"
                      value={contactTime}
                      onChange={(e) => setContactTime(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="px-8"
            >
              Cancel
            </Button>
            <Button type="submit" className="px-8">
              Submit Enrollment
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
