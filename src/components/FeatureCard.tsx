import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
}

export const FeatureCard = ({ icon: Icon, title, description, onClick }: FeatureCardProps) => {
  const iconColor = title === "Ask an Expert" 
    ? "text-secondary" 
    : title === "Are you a Dentist? Get Listed Now!"
    ? "text-accent-foreground"
    : "text-primary";
    
  const bgColor = title === "Ask an Expert" 
    ? "bg-secondary" 
    : title === "Are you a Dentist? Get Listed Now!"
    ? "bg-accent"
    : "bg-primary";
  
  return (
    <Card onClick={onClick} tabIndex={0} role="button" onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && onClick) { e.preventDefault(); onClick(); } }} className="p-6 hover:shadow-md transition-all duration-300 border-border/30 bg-card cursor-pointer group flex items-start gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <div className={`flex-shrink-0 w-12 h-12 ${bgColor} rounded-full flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold text-lg mb-1 ${iconColor}`}>{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </Card>
  );
};
