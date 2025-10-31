import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Star, BadgeCheck, User, ExternalLink } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip';

interface DentistCardProps {
  dentist: {
    id: number;
    name: string;
    specialty?: string;
    rating?: number;
    reviews?: number;
    distance?: string;
    address: string;
    insurance?: string[];
    image?: string;
    networkProvider?: boolean;
  };
  isHighlighted?: boolean;
  onHighlight?: () => void;
  onBookAppointment: (e?: any) => void;
  showReviews?: boolean;
  onToggleReviews?: () => void;
  reviewsExpanded?: boolean;
  cardRef?: (el: HTMLDivElement | null) => void;
  compact?: boolean;
}

export const DentistCard = ({
  dentist,
  isHighlighted = false,
  onHighlight,
  onBookAppointment,
  showReviews = false,
  onToggleReviews,
  reviewsExpanded = false,
  cardRef,
  compact = false,
}: DentistCardProps) => {
  return (
    <Card 
      ref={cardRef}
      className={`p-6 border-border/50 hover:shadow-md transition-all ${
        isHighlighted 
          ? 'ring-2 ring-primary shadow-lg bg-primary/5' 
          : ''
      }`}
    >
      <div className="flex gap-6">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <img
            src={dentist.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop"}
            alt={dentist.name}
            className="w-24 h-24 rounded-lg object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-foreground">
                  {dentist.name}
                </h3>
                {dentist.networkProvider && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <BadgeCheck className="w-5 h-5 text-primary fill-primary/20 flex-shrink-0 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">This provider participates in the Dental.com Network for enhanced scheduling, communication, and care coordination.</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              {dentist.specialty && (
                <p className="text-base text-muted-foreground mb-3">{dentist.specialty}</p>
              )}

              <div className="flex items-center gap-4 text-sm mb-3">
                {dentist.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-blue-500 text-blue-500" />
                    <Star className="w-4 h-4 fill-blue-500 text-blue-500" />
                    <Star className="w-4 h-4 fill-blue-500 text-blue-500" />
                    <Star className="w-4 h-4 fill-blue-500 text-blue-500" />
                    <Star className="w-4 h-4 fill-gray-300 text-gray-300" />
                    <span className="font-semibold text-foreground ml-1">{dentist.rating}</span>
                    {dentist.reviews && (
                      <span className="text-muted-foreground">({dentist.reviews} Reviews)</span>
                    )}
                  </div>
                )}
                {dentist.distance && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{dentist.distance}</span>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2 mb-4">
                <button 
                  onClick={onHighlight}
                  className="flex items-start gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer group flex-1 text-left"
                >
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 group-hover:text-primary" />
                  <span className="group-hover:underline">{dentist.address}</span>
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 hover:bg-primary/10"
                  onClick={() => {
                    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dentist.address)}`;
                    window.open(mapsUrl, '_blank');
                  }}
                  title="Open in Google Maps"
                >
                  <ExternalLink className="w-4 h-4 text-primary" />
                </Button>
              </div>

              {dentist.insurance && dentist.insurance.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Accepted Insurance:</p>
                  <div className="flex flex-wrap gap-2">
                    {dentist.insurance.map((ins, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary"
                        className="text-xs px-3 py-1"
                      >
                        {ins}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 whitespace-nowrap"
                onClick={onBookAppointment}
              >
                <User className="w-4 h-4 mr-2" />
                Request Appointment
              </Button>
              <Button 
                size="sm"
                variant="outline"
                className="whitespace-nowrap"
                onClick={() => {
                  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dentist.address)}`;
                  window.open(mapsUrl, '_blank');
                }}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
            </div>
          </div>

          {showReviews && onToggleReviews && dentist.reviews && (
            <div className="pt-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleReviews}
                className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 -ml-2"
              >
                Show Reviews ({dentist.reviews})
                {reviewsExpanded ? (
                  <span className="ml-1">▲</span>
                ) : (
                  <span className="ml-1">▼</span>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};