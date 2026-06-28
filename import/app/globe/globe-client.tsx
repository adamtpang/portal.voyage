"use client";

import { useMemo, useState } from "react";
import {
  InternetaGlobe,
  type GlobeMarker,
  type GlobeView,
} from "@/components/interneta-globe";

type NetworkState = { name: string; location: string; url?: string };

type Props = {
  earthMarkers: GlobeMarker[];
  archipelagoMarkers: GlobeMarker[];
  capitalCount: number;
  networkStateCount: number;
  networkStates: NetworkState[];
  networkStateGeo: { name: string; location: string; lat: number; lng: number; url?: string }[];
};

// Haversine distance in km between two lat/lng points.
function distKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}

const RED: [number, number, number] = [0.86, 0.15, 0.15]; // iw-red marker

export function InternetaGlobeClient({
  earthMarkers,
  archipelagoMarkers,
  capitalCount,
  networkStateCount,
  networkStates,
  networkStateGeo,
}: Props) {
  const [view, setView] = useState<GlobeView>("earth");
  const [me, setMe] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<
    "idle" | "asking" | "denied" | "unsupported"
  >("idle");

  const findMe = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoStatus("unsupported");
      return;
    }
    setGeoStatus("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMe({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoStatus("idle");
      },
      () => setGeoStatus("denied"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
    );
  };

  const baseMarkers = view === "earth" ? earthMarkers : archipelagoMarkers;
  const markers: GlobeMarker[] = useMemo(() => {
    if (!me) return baseMarkers;
    return [
      ...baseMarkers,
      { location: [me.lat, me.lng] as [number, number], size: 0.12, color: RED },
    ];
  }, [baseMarkers, me]);

  const nearest = useMemo(() => {
    if (!me) return [];
    return networkStateGeo
      .filter((n) => n.lat !== 0 || n.lng !== 0)
      .map((n) => ({ ...n, km: distKm([me.lat, me.lng], [n.lat, n.lng]) }))
      .sort((a, b) => a.km - b.km)
      .slice(0, 6);
  }, [me, networkStateGeo]);

  return (
    <div className="min-h-screen py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">
          ::: PHYSICAL ↔ DIGITAL :::
        </div>
        <h1 className="font-mono font-bold text-4xl sm:text-6xl leading-tight tracking-tight mb-8">
          The Earth, and<br />her internet twin.
        </h1>
        <p className="font-mono text-base sm:text-lg text-foreground/80 leading-relaxed mb-12 max-w-2xl">
          Spin between two views of the same planet. Earth shows the
          {" "}{capitalCount}{" "} nation-state capitals of the legacy world. The Archipelago shows
          {" "}{networkStateCount}{" "} known network states, popup villages, and startup
          societies. Some will join the federation. Some will not. Sovereignty
          stays with the founders.
        </p>

        {/* View toggle + Find Me */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 max-w-xl">
          <button
            onClick={() => setView("earth")}
            className={`border-2 border-border px-4 py-3 font-mono font-bold text-sm transition-all ${
              view === "earth"
                ? "bg-foreground text-background shadow-brutal-md-active"
                : "bg-background shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            }`}
          >
            [ EARTH ]
          </button>
          <button
            onClick={() => setView("archipelago")}
            className={`border-2 border-border px-4 py-3 font-mono font-bold text-sm transition-all ${
              view === "archipelago"
                ? "bg-foreground text-background shadow-brutal-md-active"
                : "bg-background shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            }`}
          >
            [ ARCHIPELAGO ]
          </button>
          <button
            onClick={findMe}
            disabled={geoStatus === "asking"}
            className="border-2 border-border bg-background shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all px-4 py-3 font-mono font-bold text-sm disabled:opacity-60 disabled:cursor-wait"
            style={{ color: me ? "var(--iw-red)" : undefined }}
          >
            {me
              ? "[ ● YOU ARE HERE ]"
              : geoStatus === "asking"
                ? "[ FINDING... ]"
                : "[ FIND ME ]"}
          </button>
        </div>

        {geoStatus === "denied" && (
          <p className="font-mono text-xs text-muted-foreground mb-6">
            Location permission denied. The globe still works, you just won't
            get the red pin.
          </p>
        )}
        {geoStatus === "unsupported" && (
          <p className="font-mono text-xs text-muted-foreground mb-6">
            This browser doesn't expose geolocation. Open on mobile or a modern
            desktop browser.
          </p>
        )}

        <div
          className={`border-2 border-border shadow-brutal-md p-4 sm:p-8 mb-8 transition-colors ${
            view === "archipelago" ? "bg-[#0a0a14]" : "bg-background"
          }`}
        >
          <InternetaGlobe markers={markers} view={view} size={600} />
          <div
            className={`text-center mt-4 font-mono text-xs tracking-[0.3em] ${view === "archipelago" ? "text-white/60" : "text-muted-foreground"}`}
          >
            {view === "earth"
              ? "::: NATION-STATES OF THE LEGACY WORLD :::"
              : "::: THE ARCHIPELAGO ::: NETWORK STATES IN THE CLOUD :::"}
          </div>
          {me && (
            <div
              className={`text-center mt-2 font-mono text-[10px] tracking-widest ${view === "archipelago" ? "text-white/50" : "text-muted-foreground"}`}
            >
              ● YOU · {me.lat.toFixed(2)}°, {me.lng.toFixed(2)}°
            </div>
          )}
        </div>

        {/* Nearest archipelago when user is located */}
        {me && nearest.length > 0 && (
          <div className="mb-12">
            <div className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-3">
              ::: NEAREST TO YOU :::
            </div>
            <h2 className="font-mono font-bold text-2xl mb-5">
              Six closest network states.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {nearest.map((n) => (
                <a
                  key={n.name}
                  href={n.url ?? "#"}
                  target={n.url ? "_blank" : undefined}
                  rel={n.url ? "noopener noreferrer" : undefined}
                  className="border-2 border-border bg-background shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all p-4 font-mono"
                >
                  <div className="font-bold text-sm mb-1">{n.name}</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {n.location}
                  </div>
                  <div
                    className="text-[10px] tracking-widest font-bold"
                    style={{ color: "var(--iw-red)" }}
                  >
                    {Math.round(n.km).toLocaleString()} KM AWAY
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12 font-mono text-sm">
          <div className="border-2 border-border bg-background shadow-brutal-sm p-4">
            <div className="text-xl font-bold">195</div>
            <div className="text-[10px] tracking-widest text-muted-foreground mt-1">
              UN NATION-STATES
            </div>
          </div>
          <div className="border-2 border-border bg-background shadow-brutal-sm p-4">
            <div className="text-xl font-bold">{capitalCount}</div>
            <div className="text-[10px] tracking-widest text-muted-foreground mt-1">
              CAPITALS PINNED
            </div>
          </div>
          <div className="border-2 border-border bg-background shadow-brutal-sm p-4">
            <div className="text-xl font-bold">{networkStateCount}</div>
            <div className="text-[10px] tracking-widest text-muted-foreground mt-1">
              NETWORK STATES TRACKED
            </div>
          </div>
          <div className="border-2 border-border bg-background shadow-brutal-sm p-4">
            <div className="text-xl font-bold">0</div>
            <div className="text-[10px] tracking-widest text-muted-foreground mt-1">
              MEMBER STATES
            </div>
          </div>
        </div>

        {view === "archipelago" && (
          <div>
            <div className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-4">
              ::: ARCHIPELAGO REGISTRY :::
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {networkStates.map((n) => (
                <a
                  key={n.name}
                  href={n.url ?? "#"}
                  target={n.url ? "_blank" : undefined}
                  rel={n.url ? "noopener noreferrer" : undefined}
                  className="border-2 border-border bg-background shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all p-4 font-mono"
                >
                  <div className="font-bold text-sm mb-1">{n.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {n.location}
                  </div>
                </a>
              ))}
            </div>
            <p className="mt-8 font-mono text-xs text-muted-foreground italic max-w-2xl">
              This list is incomplete by design. Submit a network state via the{" "}
              <a href="/contact" className="underline">
                contact page
              </a>
              . Inclusion here does not imply membership in Interneta. Each
              network state remains sovereign over its own One Commandment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
