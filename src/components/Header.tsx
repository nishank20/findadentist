import { Button } from "@/components/ui/button";
import { Menu, Globe } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");

  const currentLang = languages.find((l) => l.code === selectedLang) || languages[0];

  const LanguageSelector = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="w-4 h-4" />
          <span>{currentLang.flag} {currentLang.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover z-50">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setSelectedLang(lang.code)}
            className={selectedLang === lang.code ? "bg-accent" : ""}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center pl-0">
            <img src={dentalLogo} alt="dental.com" className="h-8 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Button variant="secondary" size="sm" asChild>
              <Link to="/dentist-enrollment">
                Are you a Dentist? Get Listed!
              </Link>
            </Button>
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
            <Button variant="hero" size="sm" className="gap-2" asChild>
              <a href="https://member.dental.com/sign-up">
                Talk to a Dentist Now — 24/7
              </a>
            </Button>
            <LanguageSelector />
          </nav>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSelector />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button size="sm" variant="outline">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-6">
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
                    variant="destructive" 
                    className="w-full"
                    asChild
                  >
                    <a href="https://member.dental.com/sign-up">
                      Immediate Online Emergency Visit
                    </a>
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
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
