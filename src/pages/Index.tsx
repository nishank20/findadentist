import { Header } from "@/components/Header";
import { FeatureCard } from "@/components/FeatureCard";
import { LocationSearch } from "@/components/LocationSearch";
import { Shield, Calculator, MessageSquare, Phone } from "lucide-react";
import heroImage from "@/assets/hero-dental.jpg";

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
  {
    icon: Phone,
    title: "24/7 Support",
    description: "Talk to a dentist now – available around the clock for your convenience",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Find Your Perfect Dentist
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Connect with trusted dental professionals in your area. Book appointments easily and get the care you deserve.
            </p>
            <LocationSearch />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
              Why Choose dental.com?
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              We make finding and booking dental care simple, transparent, and stress-free
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Find Your Dentist?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied patients who've found their perfect dental care provider
          </p>
          <LocationSearch />
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
