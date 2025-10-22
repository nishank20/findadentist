import { Button } from "@/components/ui/button";
import { Search, User, HelpCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-secondary to-secondary/80 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-secondary">
              dental.com
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/find" 
              className="text-secondary hover:text-secondary/80 transition-colors font-medium"
            >
              Find a Dentist
            </Link>
            <Link 
              to="/account" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              My Account
            </Link>
            <Link 
              to="/support" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              Support
            </Link>
            <Button variant="hero" size="sm" className="gap-2">
              Talk to a Dentist Now — 24/7
            </Button>
            <Button variant="outline" size="sm" className="gap-2 border-secondary text-secondary hover:bg-secondary/10">
              <User className="w-4 h-4" />
              Sign In
            </Button>
          </nav>

          <Button size="sm" className="md:hidden">Menu</Button>
        </div>
      </div>
    </header>
  );
};
