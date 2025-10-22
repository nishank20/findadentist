import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";

const careTypes = [
  {
    id: "routine",
    title: "Routine dental exam",
    description: "An exam is generally followed by a cleaning, but the cleaning may be scheduled as a follow-up visit",
  },
  {
    id: "problem",
    title: "Dental problem",
    description: "Find treatment for a new issue or ongoing care for a diagnosed condition",
  },
  {
    id: "services",
    title: "Dental services & procedures",
    description: "Whitening, enhancements, repair and replacements",
  },
  {
    id: "braces",
    title: "Braces, retainers, clear aligners (e.g. Invisalign)",
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
      
      {/* Progress bar */}
      <div className="w-full bg-muted/30 h-2">
        <div className="bg-primary h-full transition-all duration-300" style={{ width: '33%' }} />
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-medium text-center mb-12 text-foreground">
            What type of care are you looking for?
          </h1>

          <div className="grid gap-4">
            {careTypes.map((type) => (
              <Card
                key={type.id}
                onClick={() => handleSelect(type.id)}
                className="p-6 cursor-pointer hover:shadow-md transition-all duration-200 border-border bg-card"
              >
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-foreground">
                    {type.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {type.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
