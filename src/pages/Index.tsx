import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeatureCard } from "@/components/FeatureCard";
import { LocationSearch } from "@/components/LocationSearch";
import { CostCalculatorDialog } from "@/components/CostCalculatorDialog";
import { InsuranceCheckDialog } from "@/components/InsuranceCheckDialog";
import { AskQuestionDialog } from "@/components/AskQuestionDialog";
import { MessageSquare, Shield, Calculator, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Shield,
    title: "Check Your Insurance",
    description: "We'll run an insurance check to verify your eligibility and analyze your benefits",
  },
  {
    icon: Calculator,
    title: "Cost Calculator",
    description: "Enter a treatment you might need and we'll show you average costs in your area",
  },
  {
    icon: MessageSquare,
    title: "Ask a Dentist",
    description: "Submit a dental question and a dentist will respond",
  },
  {
    icon: UserCheck,
    title: "Are you a Dentist? Get Listed Now!",
    description: "Reach More Patients. Join Dentist Match—Free.",
  },
];

export default function Index() {
  const [costCalculatorOpen, setCostCalculatorOpen] = useState(false);
  const [insuranceCheckOpen, setInsuranceCheckOpen] = useState(false);
  const [askQuestionOpen, setAskQuestionOpen] = useState(false);
  const [todayCount, setTodayCount] = useState(() => Math.floor(Math.random() * (8500 - 4200) + 4200));
  const [totalCount, setTotalCount] = useState(() => Math.floor(Math.random() * (850000 - 420000) + 420000));
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTodayCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
      setTotalCount((prev) => prev + Math.floor(Math.random() * 5) + 2);
    }, Math.random() * 4000 + 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CostCalculatorDialog 
        open={costCalculatorOpen} 
        onOpenChange={setCostCalculatorOpen}
      />
      <InsuranceCheckDialog 
        open={insuranceCheckOpen} 
        onOpenChange={setInsuranceCheckOpen}
      />
      <AskQuestionDialog 
        open={askQuestionOpen} 
        onOpenChange={setAskQuestionOpen}
      />
      
      {/* Hero Section */}
      <section className="relative bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr,400px] gap-12 items-start max-w-7xl mx-auto">
            {/* Left Column - Main Content */}
            <div className="space-y-8">
              <div className="text-center lg:text-left space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                  Find Your Perfect Dentist
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                  Connect with trusted dental professionals in your area. Book appointments easily and get the care you deserve.
                </p>
              </div>
              <LocationSearch />
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-muted-foreground text-center lg:text-left">
                <p>
                  🔍 <span className="font-semibold text-foreground">{todayCount.toLocaleString()}</span> searches today
                </p>
                <p>
                  📊 <span className="font-semibold text-foreground">{totalCount.toLocaleString()}</span> searches till now
                </p>
              </div>
            </div>

            {/* Right Column - Feature Cards */}
            <div className="space-y-4">
              {features.filter(f => f.title !== "Are you a Dentist? Get Listed Now!").map((feature) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  onClick={
                    feature.title === "Cost Calculator" 
                      ? () => setCostCalculatorOpen(true) 
                      : feature.title === "Check Your Insurance"
                      ? () => setInsuranceCheckOpen(true)
                      : feature.title === "Ask a Dentist"
                      ? () => setAskQuestionOpen(true)
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
