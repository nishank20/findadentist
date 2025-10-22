import { Button } from "@/components/ui/button";
import { Search, User, HelpCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              dental.com
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/find" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Find a Dentist
            </Link>
            <Link 
              to="/account" 
              className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              My Account
            </Link>
            <Link 
              to="/support" 
              className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              Support
            </Link>
            <Button variant="ghost" size="sm" className="gap-2">
              <Phone className="w-4 h-4" />
              Talk to a Dentist Now
            </Button>
            <Button size="sm">Sign In</Button>
          </nav>

          <Button size="sm" className="md:hidden">Menu</Button>
        </div>
      </div>
    </header>
  );
};
