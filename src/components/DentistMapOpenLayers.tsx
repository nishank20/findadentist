import { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Style, Icon, Fill, Stroke, Circle as CircleStyle } from "ol/style";
import Overlay from "ol/Overlay";
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
  const mapInstanceRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

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
    const popup = new Overlay({
      element: popupRef.current!,
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -15],
    });
    map.addOverlay(popup);

    // Fit view to show all markers
    const extent = vectorSource.getExtent();
    map.getView().fit(extent, {
      padding: [50, 50, 50, 50],
      maxZoom: 15,
    });

    // Handle click on markers
    map.on("click", (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        const coords = (feature.getGeometry() as Point).getCoordinates();
        const name = feature.get("name");
        const address = feature.get("address");
        const type = feature.get("type");

        if (popupRef.current) {
          popupRef.current.innerHTML = `
            <div class="bg-background border border-border rounded-lg shadow-lg p-3 max-w-[200px]">
              <p class="font-semibold text-sm text-foreground">${name}</p>
              ${type === "dentist" ? `<p class="text-xs text-muted-foreground mt-1">${address}</p>` : ""}
            </div>
          `;
          popup.setPosition(coords);
        }
      } else {
        popup.setPosition(undefined);
      }
    });

    // Change cursor on hover
    map.on("pointermove", (evt) => {
      const hit = map.hasFeatureAtPixel(evt.pixel);
      map.getTargetElement().style.cursor = hit ? "pointer" : "";
    });

    mapInstanceRef.current = map;

    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
    };
  }, [userLocation, dentists, selectedDentist]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg"
        style={{ minHeight: "250px" }}
      />
      <div ref={popupRef} className="absolute" />
    </div>
  );
}
