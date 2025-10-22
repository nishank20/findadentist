import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Bone, 
  Smile, 
  CircleDot, 
  AlertTriangle,
  HeartPulse,
  Droplet,
  Skull,
  Activity,
  User,
  MessageCircle
} from "lucide-react";

const issueTypes = [
  { id: "broken", icon: Bone, title: "Broken Tooth" },
  { id: "wisdom", icon: Smile, title: "Wisdom Tooth Problem" },
  { id: "cavities", icon: CircleDot, title: "Cavities" },
  { id: "pain", icon: AlertTriangle, title: "Dental Pain" },
  { id: "gingivitis", icon: HeartPulse, title: "Gum Inflammation / Gingivitis" },
  { id: "bleeding", icon: Droplet, title: "Bleeding Gums" },
  { id: "jaw", icon: Skull, title: "Jaw Pain" },
  { id: "grinding", icon: Activity, title: "Teeth Grinding / Clenching" },
  { id: "missing", icon: User, title: "Missing Teeth" },
  { id: "discuss", icon: MessageCircle, title: "I just want to see someone to discuss my needs" },
  { id: "other", icon: MessageCircle, title: "Something else" },
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
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 text-foreground">
            What kind of issue do you need treatment for?
          </h1>
          <p className="text-center text-muted-foreground mb-12">
            {location && `Searching in: ${location}`}
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {issueTypes.map((issue) => {
              const Icon = issue.icon;
              return (
                <Card
                  key={issue.id}
                  onClick={() => handleSelect(issue.id)}
                  className="p-5 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-border/50 bg-card group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {issue.title}
                    </h3>
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
