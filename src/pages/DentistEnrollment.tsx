import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, Check, Building2, FileText } from "lucide-react";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [currentStep, setCurrentStep] = useState(1);
  
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
  
  const [paymentOptions, setPaymentOptions] = useState({
    inHouse: false,
    careCredit: false,
    membershipPlans: false,
  });
  
  const [acceptingNewPatients, setAcceptingNewPatients] = useState<"yes" | "no">("yes");
  const [insuranceType, setInsuranceType] = useState<"none" | "contracted">("contracted");
  const [insurancePlans, setInsurancePlans] = useState("");
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

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
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
        toast({
          title: "Please complete all required fields",
          variant: "destructive",
        });
        return;
      }
      
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
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
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="container max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center animate-scale-in">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Thank You!
            </h1>
            <div className="space-y-4 text-gray-600 text-lg">
              <p>We'll review your submission and notify you once your listing is live.</p>
              <p className="text-sm">
                Practices using Dental.com Office may receive priority placement, but use of
                Dental.com Office is not a requirement for listing.
              </p>
              <Button
                onClick={() => navigate("/")}
                className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-10 py-6 text-lg shadow-lg hover:shadow-xl transition-all hover-scale"
              >
                Return to Home
              </Button>
              <div className="mt-6">
                <a href="#" className="text-purple-600 hover:text-purple-700 font-medium underline">
                  Click here to learn more about Dental.com Office
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="container max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                currentStep >= 1 
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > 1 ? <Check className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">Practice Info</span>
            </div>
            
            <div className={`h-1 w-16 sm:w-24 rounded-full transition-all ${
              currentStep >= 2 ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-300'
            }`} />
            
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                currentStep >= 2 
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">Services & Details</span>
            </div>
          </div>
          
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${(currentStep / 2) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {currentStep === 1 ? 'Practice Information' : 'Services & Optional Details'}
            </h1>
            <p className="text-purple-100 text-lg max-w-2xl mx-auto">
              {currentStep === 1 
                ? 'Tell us about your dental practice' 
                : 'Share your services and additional information'}
            </p>
          </div>

          <form onSubmit={handleNext} className="p-8 md:p-12">
            {currentStep === 1 && (
              <div className="space-y-8 animate-fade-in">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-700 font-medium">* All fields are required</p>
                </div>

                {/* Basic Information Section */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Basic Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="practiceName" className="text-gray-700 font-medium flex items-center gap-1">
                        Practice Name<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="practiceName"
                        value={practiceName}
                        onChange={(e) => {
                          setPracticeName(e.target.value);
                          setErrors((prev) => ({ ...prev, practiceName: "" }));
                        }}
                        placeholder="Enter practice name"
                        className={`h-12 ${errors.practiceName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                      {errors.practiceName && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          {errors.practiceName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dentistName" className="text-gray-700 font-medium flex items-center gap-1">
                        Primary Dentist Name<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="dentistName"
                        value={dentistName}
                        onChange={(e) => {
                          setDentistName(e.target.value);
                          setErrors((prev) => ({ ...prev, dentistName: "" }));
                        }}
                        placeholder="Dr. John Smith"
                        className={`h-12 ${errors.dentistName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                      {errors.dentistName && (
                        <p className="text-sm text-red-500">{errors.dentistName}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Practice Address</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="street" className="text-gray-700 font-medium flex items-center gap-1">
                        Street Address<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="street"
                        placeholder="123 Main Street"
                        value={street}
                        onChange={(e) => {
                          setStreet(e.target.value);
                          setErrors((prev) => ({ ...prev, street: "" }));
                        }}
                        className={`h-12 ${errors.street ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                      {errors.street && (
                        <p className="text-sm text-red-500">{errors.street}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-gray-700 font-medium flex items-center gap-1">
                          City<span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="city"
                          placeholder="City"
                          value={city}
                          onChange={(e) => {
                            setCity(e.target.value);
                            setErrors((prev) => ({ ...prev, city: "" }));
                          }}
                          className={`h-12 ${errors.city ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        />
                        {errors.city && (
                          <p className="text-sm text-red-500">{errors.city}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-gray-700 font-medium flex items-center gap-1">
                          State<span className="text-red-500">*</span>
                        </Label>
                        <Select value={state} onValueChange={(value) => {
                          setState(value);
                          setErrors((prev) => ({ ...prev, state: "" }));
                        }}>
                          <SelectTrigger className={`h-12 ${errors.state ? "border-red-500" : ""}`}>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AL">Alabama</SelectItem>
                            <SelectItem value="AK">Alaska</SelectItem>
                            <SelectItem value="AZ">Arizona</SelectItem>
                            <SelectItem value="AR">Arkansas</SelectItem>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="CO">Colorado</SelectItem>
                            <SelectItem value="CT">Connecticut</SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                            <SelectItem value="GA">Georgia</SelectItem>
                            <SelectItem value="NY">New York</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.state && (
                          <p className="text-sm text-red-500">{errors.state}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zip" className="text-gray-700 font-medium flex items-center gap-1">
                          ZIP Code<span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="zip"
                          placeholder="12345"
                          value={zip}
                          onChange={(e) => {
                            setZip(e.target.value);
                            setErrors((prev) => ({ ...prev, zip: "" }));
                          }}
                          className={`h-12 ${errors.zip ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        />
                        {errors.zip && (
                          <p className="text-sm text-red-500">{errors.zip}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Contact Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium flex items-center gap-1">
                        Phone Number<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setErrors((prev) => ({ ...prev, phone: "" }));
                        }}
                        placeholder="(555) 123-4567"
                        className={`h-12 ${errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-1">
                        Email<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        placeholder="practice@example.com"
                        className={`h-12 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-gray-700 font-medium">
                        Website or Booking Link
                      </Label>
                      <Input
                        id="website"
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://yourpractice.com"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="npi" className="text-gray-700 font-medium flex items-center gap-1">
                        NPI Number<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="npi"
                        value={npi}
                        onChange={(e) => {
                          setNpi(e.target.value);
                          setErrors((prev) => ({ ...prev, npi: "" }));
                        }}
                        placeholder="1234567890"
                        className={`h-12 ${errors.npi ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                      {errors.npi && (
                        <p className="text-sm text-red-500">{errors.npi}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8 animate-fade-in">
                {/* Practice Type Section */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    Practice Type<span className="text-red-500">*</span>
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">Check all that apply to your practice</p>
                  
                  <div className="space-y-4 bg-white rounded-xl p-6">
                    <div className="flex items-center space-x-3 p-3 hover:bg-purple-50 rounded-lg transition-colors">
                      <Checkbox
                        id="gp"
                        checked={practiceTypes.gp}
                        onCheckedChange={(checked) =>
                          handlePracticeTypeChange("gp", checked as boolean)
                        }
                        className="h-5 w-5"
                      />
                      <Label htmlFor="gp" className="font-medium cursor-pointer flex-1">
                        General Practice (GP)
                      </Label>
                    </div>

                    {practiceTypes.gp && (
                      <div className="ml-10 space-y-3 animate-fade-in">
                        <div className="flex items-center space-x-3 p-2 hover:bg-purple-50 rounded-lg transition-colors">
                          <Checkbox
                            id="fullFamily"
                            checked={practiceTypes.fullFamily}
                            onCheckedChange={(checked) =>
                              handlePracticeTypeChange("fullFamily", checked as boolean)
                            }
                          />
                          <Label htmlFor="fullFamily" className="cursor-pointer text-gray-700">
                            Full family care
                          </Label>
                        </div>

                        <div className="flex items-center space-x-3 p-2 hover:bg-purple-50 rounded-lg transition-colors">
                          <Checkbox
                            id="cosmetic"
                            checked={practiceTypes.cosmetic}
                            onCheckedChange={(checked) =>
                              handlePracticeTypeChange("cosmetic", checked as boolean)
                            }
                          />
                          <Label htmlFor="cosmetic" className="cursor-pointer text-gray-700">
                            Cosmetic care
                          </Label>
                        </div>

                        <div className="flex items-center space-x-3 p-2 hover:bg-purple-50 rounded-lg transition-colors">
                          <Checkbox
                            id="anxiousPatients"
                            checked={practiceTypes.anxiousPatients}
                            onCheckedChange={(checked) =>
                              handlePracticeTypeChange("anxiousPatients", checked as boolean)
                            }
                          />
                          <Label htmlFor="anxiousPatients" className="cursor-pointer text-gray-700">
                            Willing to take anxious patients
                          </Label>
                        </div>

                        <div className="flex items-center space-x-3 p-2 hover:bg-purple-50 rounded-lg transition-colors">
                          <Checkbox
                            id="afterHours"
                            checked={practiceTypes.afterHours}
                            onCheckedChange={(checked) =>
                              handlePracticeTypeChange("afterHours", checked as boolean)
                            }
                          />
                          <Label htmlFor="afterHours" className="cursor-pointer text-gray-700">
                            After hours emergencies
                          </Label>
                        </div>

                        <div className="border-t pt-3 mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-3">Payment Options:</p>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3 p-2 hover:bg-purple-50 rounded-lg transition-colors">
                              <Checkbox
                                id="inHouse"
                                checked={paymentOptions.inHouse}
                                onCheckedChange={(checked) =>
                                  handlePaymentOptionChange("inHouse", checked as boolean)
                                }
                              />
                              <Label htmlFor="inHouse" className="cursor-pointer text-gray-700">
                                In-house financing
                              </Label>
                            </div>

                            <div className="flex items-center space-x-3 p-2 hover:bg-purple-50 rounded-lg transition-colors">
                              <Checkbox
                                id="careCredit"
                                checked={paymentOptions.careCredit}
                                onCheckedChange={(checked) =>
                                  handlePaymentOptionChange("careCredit", checked as boolean)
                                }
                              />
                              <Label htmlFor="careCredit" className="cursor-pointer text-gray-700">
                                CareCredit
                              </Label>
                            </div>

                            <div className="flex items-center space-x-3 p-2 hover:bg-purple-50 rounded-lg transition-colors">
                              <Checkbox
                                id="membershipPlans"
                                checked={paymentOptions.membershipPlans}
                                onCheckedChange={(checked) =>
                                  handlePaymentOptionChange("membershipPlans", checked as boolean)
                                }
                              />
                              <Label htmlFor="membershipPlans" className="cursor-pointer text-gray-700">
                                Membership plans
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3 p-3 hover:bg-purple-50 rounded-lg transition-colors">
                      <Checkbox
                        id="pediatric"
                        checked={practiceTypes.pediatric}
                        onCheckedChange={(checked) =>
                          handlePracticeTypeChange("pediatric", checked as boolean)
                        }
                        className="h-5 w-5"
                      />
                      <Label htmlFor="pediatric" className="font-medium cursor-pointer">
                        Pediatric Dentist
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-3 hover:bg-purple-50 rounded-lg transition-colors">
                      <Checkbox
                        id="orthodontist"
                        checked={practiceTypes.orthodontist}
                        onCheckedChange={(checked) =>
                          handlePracticeTypeChange("orthodontist", checked as boolean)
                        }
                        className="h-5 w-5"
                      />
                      <Label htmlFor="orthodontist" className="font-medium cursor-pointer">
                        Orthodontist
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-3 hover:bg-purple-50 rounded-lg transition-colors">
                      <Checkbox
                        id="periodontist"
                        checked={practiceTypes.periodontist}
                        onCheckedChange={(checked) =>
                          handlePracticeTypeChange("periodontist", checked as boolean)
                        }
                        className="h-5 w-5"
                      />
                      <Label htmlFor="periodontist" className="font-medium cursor-pointer">
                        Periodontist
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-3 hover:bg-purple-50 rounded-lg transition-colors">
                      <Checkbox
                        id="oralSurgeon"
                        checked={practiceTypes.oralSurgeon}
                        onCheckedChange={(checked) =>
                          handlePracticeTypeChange("oralSurgeon", checked as boolean)
                        }
                        className="h-5 w-5"
                      />
                      <Label htmlFor="oralSurgeon" className="font-medium cursor-pointer">
                        Oral Surgeon
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3 p-3 hover:bg-purple-50 rounded-lg transition-colors">
                      <Checkbox
                        id="other"
                        checked={practiceTypes.other}
                        onCheckedChange={(checked) =>
                          handlePracticeTypeChange("other", checked as boolean)
                        }
                        className="h-5 w-5 mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="other" className="font-medium cursor-pointer">
                          Other
                        </Label>
                        {practiceTypes.other && (
                          <Input
                            value={otherPracticeType}
                            onChange={(e) => setOtherPracticeType(e.target.value)}
                            placeholder="Please specify"
                            className="mt-3"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Acceptance */}
                <div className="space-y-4 bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    Accepting New Patients?<span className="text-red-500">*</span>
                  </h2>
                  <RadioGroup value={acceptingNewPatients} onValueChange={(value: "yes" | "no") => {
                    setAcceptingNewPatients(value);
                    setErrors((prev) => ({ ...prev, acceptingNewPatients: "" }));
                  }} className="flex gap-6">
                    <div className="flex items-center space-x-3 bg-white p-4 rounded-xl flex-1 cursor-pointer hover:shadow-md transition-shadow">
                      <RadioGroupItem value="yes" id="accepting-yes" className="h-5 w-5" />
                      <Label htmlFor="accepting-yes" className="cursor-pointer font-medium flex-1">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 bg-white p-4 rounded-xl flex-1 cursor-pointer hover:shadow-md transition-shadow">
                      <RadioGroupItem value="no" id="accepting-no" className="h-5 w-5" />
                      <Label htmlFor="accepting-no" className="cursor-pointer font-medium flex-1">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Insurance */}
                <div className="space-y-4 bg-green-50 rounded-2xl p-6 border border-green-200">
                  <h2 className="text-lg font-semibold text-gray-800">Insurance Accepted</h2>
                  <RadioGroup value={insuranceType} onValueChange={(value: "none" | "contracted") => setInsuranceType(value)} className="space-y-3">
                    <div className="flex items-center space-x-3 bg-white p-4 rounded-xl cursor-pointer hover:shadow-md transition-shadow">
                      <RadioGroupItem value="none" id="insurance-none" className="h-5 w-5" />
                      <Label htmlFor="insurance-none" className="cursor-pointer flex-1">
                        We do not accept insurance, but we will help patients bill for it
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 bg-white p-4 rounded-xl cursor-pointer hover:shadow-md transition-shadow">
                      <RadioGroupItem value="contracted" id="insurance-contracted" className="h-5 w-5" />
                      <Label htmlFor="insurance-contracted" className="cursor-pointer flex-1">
                        List contracted insurance plans
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {insuranceType === "contracted" && (
                    <div className="animate-fade-in">
                      <Textarea
                        placeholder="List all insurance plans accepted (one per line)"
                        value={insurancePlans}
                        onChange={(e) => setInsurancePlans(e.target.value)}
                        rows={5}
                        className="bg-white"
                      />
                    </div>
                  )}
                </div>

                {/* Optional Enhancements */}
                <div className="space-y-6 bg-amber-50 rounded-2xl p-6 border border-amber-200">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Optional Enhancements</h2>
                    <p className="text-sm text-gray-600">
                      These fields help surface the practice to more relevant patients
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="languages" className="text-gray-700 font-medium">
                      Languages Spoken
                    </Label>
                    <Input
                      id="languages"
                      value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                      placeholder="e.g., English, Spanish, French"
                      className="h-12 bg-white"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-700 font-medium">Photos of Office or Team</Label>
                    <p className="text-sm text-gray-600">Upload up to 3 photos</p>
                    
                    <div className="space-y-3">
                      {photos.map((photo, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                          <span className="text-sm truncate flex-1 text-gray-700">{photo.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePhoto(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                            className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-white hover:border-purple-400 transition-all bg-white/50"
                          >
                            <Upload className="w-6 h-6 text-purple-600" />
                            <span className="text-gray-700 font-medium">Click to upload photos</span>
                          </Label>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-gray-700 font-medium">Contact for Follow-Up</Label>
                    
                    <div className="flex items-center space-x-3 p-4 bg-white rounded-xl">
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
                      <Label htmlFor="doNotContact" className="cursor-pointer text-gray-700">
                        Do not contact me
                      </Label>
                    </div>

                    {!doNotContact && (
                      <div className="grid md:grid-cols-3 gap-4 animate-fade-in">
                        <Input
                          placeholder="Name"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="h-12 bg-white"
                        />
                        <Input
                          placeholder="Role"
                          value={contactRole}
                          onChange={(e) => setContactRole(e.target.value)}
                          className="h-12 bg-white"
                        />
                        <Input
                          placeholder="Best time to reach"
                          value={contactTime}
                          onChange={(e) => setContactTime(e.target.value)}
                          className="h-12 bg-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-12 border-t">
              {currentStep === 2 && (
                <Button 
                  type="button"
                  onClick={() => {
                    setCurrentStep(1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  variant="outline"
                  className="rounded-full px-8 py-6 text-lg font-semibold border-2 hover-scale order-2 sm:order-1"
                >
                  Back
                </Button>
              )}
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-12 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover-scale order-1 sm:order-2"
              >
                {currentStep === 1 ? 'Next' : 'Submit Enrollment'}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600 pt-8 space-y-2">
              <p>Read more about our policies:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <a href="#" className="text-purple-600 hover:text-purple-700 font-medium underline">Terms and Conditions</a>
                <span>•</span>
                <a href="#" className="text-purple-600 hover:text-purple-700 font-medium underline">Privacy Practices</a>
                <span>•</span>
                <a href="#" className="text-purple-600 hover:text-purple-700 font-medium underline">Provider Notice</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
