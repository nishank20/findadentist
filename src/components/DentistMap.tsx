import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Maximize2, Minimize2, Star, BadgeCheck } from "lucide-react";
import { Card } from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import "ol/ol.css";

interface Dentist {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  specialty?: string;
  rating?: number;
  reviews?: number;
  distance?: string;
  image?: string;
  networkProvider?: boolean;
}

interface DentistMapProps {
  dentists: Dentist[];
  onDentistClick?: (dentistId: number) => void;
  onBookAppointment?: (dentistId: number) => void;
  zipCode?: string;
  userLocation?: { latitude: number; longitude: number };
  highlightedDentistId?: number | null;
}

export const DentistMap = ({
  dentists,
  onDentistClick,
  onBookAppointment,
  zipCode,
  userLocation = { latitude: 40.7178, longitude: -74.0431 },
  highlightedDentistId,
}: DentistMapProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const overlayRef = useRef<any>(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    setSelectedDentist(null);
    setPopupPosition(null);
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up previous map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setTarget(undefined);
      mapInstanceRef.current = null;
    }

    const initMap = async () => {
      const [
        { default: Map },
        { default: View },
        { default: TileLayer },
        { default: VectorLayer },
        { default: VectorSource },
        { default: OSM },
        { default: Feature },
        { default: Point },
        { fromLonLat },
        { Style, Fill, Stroke, Circle: CircleStyle },
      ] = await Promise.all([
        import("ol/Map"),
        import("ol/View"),
        import("ol/layer/Tile"),
        import("ol/layer/Vector"),
        import("ol/source/Vector"),
        import("ol/source/OSM"),
        import("ol/Feature"),
        import("ol/geom/Point"),
        import("ol/proj"),
        import("ol/style"),
      ]);

      if (!mapRef.current) return;

      // Create user location feature
      const userFeature = new Feature({
        geometry: new Point(fromLonLat([userLocation.longitude, userLocation.latitude])),
        name: "Your Location",
        type: "user",
      });

      userFeature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 10,
            fill: new Fill({ color: "#3b82f6" }),
            stroke: new Stroke({ color: "#ffffff", width: 3 }),
          }),
        })
      );

      // Create dentist features
      const dentistFeatures = dentists.map((dentist) => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([dentist.longitude, dentist.latitude])),
          dentistData: dentist,
          type: "dentist",
        });

        const isHighlighted = highlightedDentistId === dentist.id;
        const color = isHighlighted ? "#22c55e" : "#8b5cf6";

        feature.setStyle(
          new Style({
            image: new CircleStyle({
              radius: isHighlighted ? 14 : 12,
              fill: new Fill({ color }),
              stroke: new Stroke({ color: "#ffffff", width: 2 }),
            }),
          })
        );

        return feature;
      });

      const vectorSource = new VectorSource({
        features: [userFeature, ...dentistFeatures],
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat([userLocation.longitude, userLocation.latitude]),
          zoom: 13,
        }),
      });

      // Handle click on markers
      map.on("click", (evt: any) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, (f: any) => f);
        if (feature && feature.get("type") === "dentist") {
          const dentistData = feature.get("dentistData") as Dentist;
          const pixel = evt.pixel;
          
          setSelectedDentist(dentistData);
          setPopupPosition({ x: pixel[0], y: pixel[1] });

          if (onDentistClick) {
            onDentistClick(dentistData.id);
          }
        } else {
          setSelectedDentist(null);
          setPopupPosition(null);
        }
      });

      // Fit view to show all markers
      const extent = vectorSource.getExtent();
      if (extent[0] !== Infinity) {
        map.getView().fit(extent, {
          padding: [50, 50, 50, 50],
          maxZoom: 15,
        });
      }

      map.on("pointermove", (evt: any) => {
        const hit = map.hasFeatureAtPixel(evt.pixel);
        map.getTargetElement().style.cursor = hit ? "pointer" : "";
      });

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, [dentists, userLocation, highlightedDentistId, onDentistClick]);

  const handleBookClick = () => {
    if (selectedDentist && onBookAppointment) {
      onBookAppointment(selectedDentist.id);
    }
  };

  const handleClosePopup = () => {
    setSelectedDentist(null);
    setPopupPosition(null);
  };

  return (
    <TooltipProvider>
      <div
        className={`${
          isExpanded
            ? "fixed top-20 left-0 right-0 bottom-0 z-[100] bg-background animate-slide-in-right"
            : "relative h-full"
        } transition-all duration-300`}
      >
        <div
          ref={mapRef}
          className={`absolute inset-0 ${isExpanded ? "rounded-none" : "rounded-lg"}`}
          style={{ minHeight: "400px" }}
        />

        {/* Dentist Card Popup */}
        {selectedDentist && popupPosition && (
          <Card
            className="absolute z-50 w-80 shadow-2xl overflow-hidden pointer-events-auto"
            style={{
              left: `${popupPosition.x}px`,
              top: `${popupPosition.y - 20}px`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="p-4 space-y-3">
              <div className="flex gap-3">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <img
                    src={selectedDentist.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop"}
                    alt={selectedDentist.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-border"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-foreground truncate">
                      {selectedDentist.name}
                    </h3>
                    {selectedDentist.networkProvider && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <BadgeCheck className="w-4 h-4 text-primary fill-primary/20 flex-shrink-0 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm">This provider participates in the Dental.com Network for enhanced scheduling, communication, and care coordination.</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  {selectedDentist.specialty && (
                    <p className="text-sm text-muted-foreground">{selectedDentist.specialty}</p>
                  )}

                  <div className="flex items-center gap-3 text-xs mt-1">
                    {selectedDentist.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-primary text-primary" />
                        <span className="font-semibold">{selectedDentist.rating}</span>
                        {selectedDentist.reviews && (
                          <span className="text-muted-foreground">({selectedDentist.reviews})</span>
                        )}
                      </div>
                    )}
                    {selectedDentist.distance && (
                      <span className="text-muted-foreground">{selectedDentist.distance}</span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">{selectedDentist.address}</p>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white"
                onClick={handleBookClick}
              >
                Request Appointment
              </Button>
            </div>
            {/* Arrow pointer */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-background border-r border-b border-border" />
          </Card>
        )}

        {/* Controls */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button variant="secondary" size="icon" className="shadow-lg" onClick={toggleExpand}>
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>

        {zipCode && (
          <div className="absolute top-4 right-4 z-10 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-border">
            <p className="text-sm font-medium">Near: {zipCode}</p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
