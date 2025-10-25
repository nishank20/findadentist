import { Button } from "@/components/ui/button";
import { User, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import dentalLogo from "@/assets/dental-logo.png";

export const Header = () => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={dentalLogo} alt="dental.com" className="h-8 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/find" 
              className="text-secondary hover:text-secondary/80 transition-colors font-medium"
            >
              Find a Dentist
            </Link>
            <a 
              href="https://member.dental.com/login" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              My Account
            </a>
            <Link 
              to="/support" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              Support
            </Link>
            <Button variant="hero" size="sm" className="gap-2" asChild>
              <a href="https://member.dental.com/login">
                Talk to a Dentist Now — 24/7
              </a>
            </Button>
            <Button variant="outline" size="sm" className="gap-2 border-secondary text-secondary hover:bg-secondary/10" asChild>
              <a href="https://member.dental.com/login">
                <User className="w-4 h-4" />
                Sign In
              </a>
            </Button>
          </nav>

          <Button size="sm" className="md:hidden">Menu</Button>
        </div>
      </div>
    </header>
  );
};
