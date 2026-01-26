import { useEffect, useRef, useState } from "react";
import "ol/ol.css";

interface DentistLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

interface DentistMapOpenLayersProps {
  userLocation: { lat: number; lng: number };
  dentists: DentistLocation[];
  selectedDentist?: string;
}

export function DentistMapOpenLayers({
  userLocation,
  dentists,
  selectedDentist,
}: DentistMapOpenLayersProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [popupContent, setPopupContent] = useState<{ name: string; address?: string } | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import OpenLayers modules
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
        geometry: new Point(fromLonLat([userLocation.lng, userLocation.lat])),
        name: "Your Location",
        type: "user",
      });

      userFeature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 10,
            fill: new Fill({ color: "#6366f1" }),
            stroke: new Stroke({ color: "#ffffff", width: 3 }),
          }),
        })
      );

      // Create dentist features
      const dentistFeatures = dentists.map((dentist) => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([dentist.lng, dentist.lat])),
          name: dentist.name,
          address: dentist.address,
          type: "dentist",
          id: dentist.id,
        });

        const isSelected = selectedDentist === dentist.id;
        const color = isSelected ? "#22c55e" : "#8b5cf6";

        feature.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 12,
              fill: new Fill({ color }),
              stroke: new Stroke({ color: "#ffffff", width: 2 }),
            }),
          })
        );

        return feature;
      });

      // Vector layer for markers
      const vectorSource = new VectorSource({
        features: [userFeature, ...dentistFeatures],
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      // Create the map
      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat([userLocation.lng, userLocation.lat]),
          zoom: 13,
        }),
      });

      // Create popup overlay
      if (popupRef.current) {
        const popup = new Overlay({
          element: popupRef.current,
          positioning: "bottom-center" as any,
          stopEvent: false,
          offset: [0, -15],
        });
        map.addOverlay(popup);

        // Handle click on markers
        map.on("click", (evt: any) => {
          const feature = map.forEachFeatureAtPixel(evt.pixel, (f: any) => f);
          if (feature) {
            const coords = (feature.getGeometry() as any).getCoordinates();
            const name = feature.get("name");
            const address = feature.get("address");
            const type = feature.get("type");

            setPopupContent({
              name,
              address: type === "dentist" ? address : undefined,
            });
            popup.setPosition(coords);
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

      // Change cursor on hover
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
  }, [userLocation, dentists, selectedDentist]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg"
        style={{ minHeight: "250px" }}
      />
      <div ref={popupRef} className="absolute">
        {popupContent && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-[200px] -translate-x-1/2">
            <p className="font-semibold text-sm text-gray-900">{popupContent.name}</p>
            {popupContent.address && (
              <p className="text-xs text-gray-600 mt-1">{popupContent.address}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
