import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface DentistLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

interface DentistMapLeafletProps {
  userLocation: { lat: number; lng: number };
  dentists: DentistLocation[];
  selectedDentist?: string;
}

// Custom marker icons
const createIcon = (color: string, isUser = false) => {
  const size = isUser ? 24 : 28;
  const svg = isUser
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>`;

  return L.divIcon({
    html: svg,
    className: "custom-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, isUser ? size / 2 : size],
    popupAnchor: [0, isUser ? -size / 2 : -size],
  });
};

export function DentistMapLeaflet({
  userLocation,
  dentists,
  selectedDentist,
}: DentistMapLeafletProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on user location
    const map = L.map(mapRef.current).setView(
      [userLocation.lat, userLocation.lng],
      13
    );

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add user location marker
    const userIcon = createIcon("#6366f1", true);
    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup(
        '<div class="text-center"><strong>Your Location</strong></div>'
      );

    // Add dentist markers
    const dentistIcon = createIcon("#8b5cf6");
    const selectedIcon = createIcon("#22c55e");

    dentists.forEach((dentist) => {
      const icon =
        selectedDentist === dentist.id ? selectedIcon : dentistIcon;
      L.marker([dentist.lat, dentist.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div class="p-1">
            <strong class="text-sm">${dentist.name}</strong>
            <p class="text-xs text-gray-600 mt-1">${dentist.address}</p>
          </div>`
        );
    });

    // Fit bounds to show all markers
    const allPoints: L.LatLngExpression[] = [
      [userLocation.lat, userLocation.lng],
      ...dentists.map((d) => [d.lat, d.lng] as L.LatLngExpression),
    ];
    if (allPoints.length > 1) {
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [userLocation, dentists, selectedDentist]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-lg"
      style={{ minHeight: "250px" }}
    />
  );
}
