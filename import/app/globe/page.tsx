import type { Metadata } from "next";
import { InternetaGlobeClient } from "./globe-client";
import { WORLD_CAPITALS } from "@/lib/data/world-capitals";
import { NETWORK_STATE_LOCATIONS } from "@/lib/data/network-state-locations";

export const metadata: Metadata = {
  title: "Globe | interneta.world",
  description:
    "The Earth and her internet twin, the Archipelago. Spin between physical nation-states and digital network-states. Drop a pin where you are.",
  alternates: { canonical: "https://interneta.world/globe" },
};

export default function GlobePage() {
  const earthMarkers = WORLD_CAPITALS.map((c) => ({
    location: [c.lat, c.lng] as [number, number],
    size: 0.04,
  }));

  const archipelagoMarkers = NETWORK_STATE_LOCATIONS.filter(
    (n) => n.lat !== 0 || n.lng !== 0
  ).map((n) => ({
    location: [n.lat, n.lng] as [number, number],
    size: 0.06,
  }));

  return (
    <InternetaGlobeClient
      earthMarkers={earthMarkers}
      archipelagoMarkers={archipelagoMarkers}
      capitalCount={WORLD_CAPITALS.length}
      networkStateCount={NETWORK_STATE_LOCATIONS.length}
      networkStates={NETWORK_STATE_LOCATIONS.map((n) => ({
        name: n.name,
        location: n.location,
        url: n.url,
      }))}
      networkStateGeo={NETWORK_STATE_LOCATIONS.map((n) => ({
        name: n.name,
        location: n.location,
        lat: n.lat,
        lng: n.lng,
        url: n.url,
      }))}
    />
  );
}
