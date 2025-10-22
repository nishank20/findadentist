import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";

const issueTypes = [
  { id: "broken", title: "Broken Tooth" },
  { id: "wisdom", title: "Wisdom Tooth Problem" },
  { id: "cavities", title: "Cavities" },
  { id: "pain", title: "Dental Pain" },
  { id: "gingivitis", title: "Gum Inflammation / Gingivitis" },
  { id: "bleeding", title: "Bleeding Gums" },
  { id: "jaw", title: "Jaw Pain" },
  { id: "grinding", title: "Teeth Grinding / Clenching" },
  { id: "missing", title: "Missing Teeth" },
  { id: "discuss", title: "I just want to see someone to discuss my needs" },
  { id: "other", title: "Something else" },
];

export default function IssueType() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = searchParams.get("location") || "";
  const type = searchParams.get("type") || "";

  const handleSelect = (issueId: string) => {
    navigate(`/results?location=${location}&type=${type}&issue=${issueId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Progress bar */}
      <div className="w-full bg-muted/30 h-2">
        <div className="bg-primary h-full transition-all duration-300" style={{ width: '66%' }} />
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-medium text-center mb-12 text-foreground">
            What kind of issue do you need treatment for?
          </h1>

          <div className="grid gap-4">
            {issueTypes.map((issue) => (
              <Card
                key={issue.id}
                onClick={() => handleSelect(issue.id)}
                className="p-6 cursor-pointer hover:shadow-md transition-all duration-200 border-border bg-card"
              >
                <h3 className="font-semibold text-lg text-foreground">
                  {issue.title}
                </h3>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
