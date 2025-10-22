import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Stethoscope, AlertCircle, Sparkles, Smile } from "lucide-react";

const careTypes = [
  {
    id: "routine",
    icon: Stethoscope,
    title: "Routine dental exam",
    description: "An exam is generally followed by a cleaning, but the cleaning may be scheduled as a follow-up visit",
  },
  {
    id: "problem",
    icon: AlertCircle,
    title: "Dental problem",
    description: "Find treatment for a new issue or ongoing care for a diagnosed condition",
  },
  {
    id: "services",
    icon: Sparkles,
    title: "Dental services & procedures",
    description: "Whitening, enhancements, repair and replacements",
  },
  {
    id: "braces",
    icon: Smile,
    title: "Braces, retainers, clear aligners",
    description: "Teeth straightening / aligning",
  },
];

export default function CareType() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = searchParams.get("location") || "";

  const handleSelect = (typeId: string) => {
    if (typeId === "problem") {
      navigate(`/issue-type?location=${location}&type=${typeId}`);
    } else {
      navigate(`/results?location=${location}&type=${typeId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 text-foreground">
            What type of care are you looking for?
          </h1>
          <p className="text-center text-muted-foreground mb-12">
            {location && `Searching in: ${location}`}
          </p>

          <div className="grid gap-4">
            {careTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Card
                  key={type.id}
                  onClick={() => handleSelect(type.id)}
                  className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.01] border-border/50 bg-card group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                        {type.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
