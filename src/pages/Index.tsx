import { Header } from "@/components/Header";
import { FeatureCard } from "@/components/FeatureCard";
import { LocationSearch } from "@/components/LocationSearch";
import { MessageSquare, Shield, Calculator } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Ask a Question",
    description: "Submit a dental question and a dentist will respond",
  },
  {
    icon: Shield,
    title: "Check Your Insurance",
    description: "We'll run an insurance check to see what coverage you may have",
  },
  {
    icon: Calculator,
    title: "Cost Calculator",
    description: "Enter a treatment you might need and we'll show you average costs in your area",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
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
            </div>

            {/* Right Column - Feature Cards */}
            <div className="space-y-4">
              {features.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 dental.com. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
