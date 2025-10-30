import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin } from "lucide-react";

interface LocationMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dentistName: string;
  address: string;
  distance: string;
}

export function LocationMapDialog({
  open,
  onOpenChange,
  dentistName,
  address,
  distance,
}: LocationMapDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Location - {dentistName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Location Info */}
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm font-medium text-foreground mb-1">{address}</p>
            <p className="text-sm text-muted-foreground">{distance}</p>
          </div>

          {/* Map Placeholder - This is where the actual map component will go */}
          <div className="w-full h-[400px] bg-muted rounded-lg border border-border flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">
                Map integration placeholder
              </p>
              <p className="text-xs text-muted-foreground">
                Add your map component here (Google Maps, Mapbox, etc.)
              </p>
            </div>
          </div>

          {/* Get Directions Button */}
          <div className="flex justify-end">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <MapPin className="w-4 h-4" />
              Get Directions
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
