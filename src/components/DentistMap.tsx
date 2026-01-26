import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
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
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [popupContent, setPopupContent] = useState<{
    id: number;
    name: string;
    address: string;
    specialty?: string;
    rating?: number;
    reviews?: number;
    distance?: string;
    image?: string;
    networkProvider?: boolean;
  } | null>(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
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
        { default: Overlay },
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
        import("ol/Overlay"),
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
          dentistId: dentist.id,
          name: dentist.name,
          address: dentist.address,
          specialty: dentist.specialty,
          rating: dentist.rating,
          reviews: dentist.reviews,
          distance: dentist.distance,
          image: dentist.image,
          networkProvider: dentist.networkProvider,
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

      // Create popup overlay
      if (popupRef.current) {
        const popup = new Overlay({
          element: popupRef.current,
          positioning: "bottom-center" as any,
          stopEvent: true,
          offset: [0, -15],
        });
        map.addOverlay(popup);

        map.on("click", (evt: any) => {
          const feature = map.forEachFeatureAtPixel(evt.pixel, (f: any) => f);
          if (feature && feature.get("type") === "dentist") {
            const coords = (feature.getGeometry() as any).getCoordinates();
            setPopupContent({
              id: feature.get("dentistId"),
              name: feature.get("name"),
              address: feature.get("address"),
              specialty: feature.get("specialty"),
              rating: feature.get("rating"),
              reviews: feature.get("reviews"),
              distance: feature.get("distance"),
              image: feature.get("image"),
              networkProvider: feature.get("networkProvider"),
            });
            popup.setPosition(coords);

            if (onDentistClick) {
              onDentistClick(feature.get("dentistId"));
            }
          } else {
            popup.setPosition(undefined);
            setPopupContent(null);
          }
        });
      }

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
    if (popupContent && onBookAppointment) {
      onBookAppointment(popupContent.id);
    }
  };

  return (
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

      {/* Popup content */}
      <div ref={popupRef} className="absolute z-50">
        {popupContent && (
          <div className="bg-background border border-border rounded-lg shadow-xl p-4 max-w-[280px] -translate-x-1/2 mb-2">
            <div className="flex gap-3 mb-3">
              {popupContent.image && (
                <img
                  src={popupContent.image}
                  alt={popupContent.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-border"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-foreground truncate">
                  {popupContent.name}
                </h4>
                {popupContent.specialty && (
                  <p className="text-xs text-muted-foreground">{popupContent.specialty}</p>
                )}
                <div className="flex items-center gap-2 text-xs mt-1">
                  {popupContent.rating && (
                    <span className="font-medium">★ {popupContent.rating}</span>
                  )}
                  {popupContent.distance && (
                    <span className="text-muted-foreground">{popupContent.distance}</span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{popupContent.address}</p>
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white"
              onClick={handleBookClick}
            >
              Request Appointment
            </Button>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-background border-r border-b border-border" />
          </div>
        )}
      </div>

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
  );
};
