import { Button } from "@/components/ui/button";
import { User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import dentalLogo from "@/assets/dental-logo.png";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center pl-0">
            <img src={dentalLogo} alt="dental.com" className="h-8 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Button 
              variant="destructive" 
              size="sm" 
              className="rounded-full"
              asChild
            >
              <a href="https://member.dental.com/sign-up">
                Immediate Online Emergency Visit
              </a>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link to="/dentist-enrollment">
                Are you a Dentist? Get Listed!
              </Link>
            </Button>
            <Button variant="hero" size="sm" className="gap-2" asChild>
              <a href="https://member.dental.com/sign-up">
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

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button size="sm" variant="outline" className="md:hidden">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  asChild
                >
                  <a href="https://member.dental.com/sign-up">
                    Immediate Online Emergency Visit
                  </a>
                </Button>
                <Button 
                  variant="secondary"
                  className="w-full"
                  asChild
                >
                  <Link to="/dentist-enrollment" onClick={() => setMobileMenuOpen(false)}>
                    Are you a Dentist? Get Listed!
                  </Link>
                </Button>
                <Button 
                  variant="hero" 
                  className="w-full"
                  asChild
                >
                  <a href="https://member.dental.com/sign-up">
                    Talk to a Dentist Now — 24/7
                  </a>
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full gap-2"
                  asChild
                >
                  <a href="https://member.dental.com/login">
                    <User className="w-4 h-4" />
                    Sign In
                  </a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
