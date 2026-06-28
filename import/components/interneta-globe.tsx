"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export type GlobeMarker = {
  location: [number, number]; // [lat, lng]
  size: number; // 0..1
  color?: [number, number, number];
};

export type GlobeView = "earth" | "archipelago";

type Props = {
  markers: GlobeMarker[];
  view: GlobeView;
  size?: number;
  speed?: number;
};

const VIEWS = {
  earth: {
    // Light, gray landmasses, magenta dots for nation states.
    baseColor: [0.85, 0.85, 0.88] as [number, number, number],
    markerColor: [0.9, 0.27, 0.94] as [number, number, number], // iw-magenta
    glowColor: [0.95, 0.95, 0.97] as [number, number, number],
    mapBrightness: 7,
    dark: 0,
  },
  archipelago: {
    // Cosmic palette, vivid cyan dots floating in the cloud.
    baseColor: [0.06, 0.06, 0.1] as [number, number, number],
    markerColor: [0.02, 0.71, 0.83] as [number, number, number], // iw-cyan
    glowColor: [0.31, 0.27, 0.9] as [number, number, number], // iw-indigo
    mapBrightness: 1.5,
    dark: 1,
  },
};

export function InternetaGlobe({
  markers,
  view,
  size = 600,
  speed = 0.0035,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;
    const v = VIEWS[view];
    let frameId = 0;
    let phi = phiRef.current;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi,
      theta: 0.2,
      dark: v.dark,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: v.mapBrightness,
      baseColor: v.baseColor,
      markerColor: v.markerColor,
      glowColor: v.glowColor,
      markers,
    });

    const tick = () => {
      phi += speed;
      phiRef.current = phi;
      globe.update({ phi });
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      globe.destroy();
    };
  }, [markers, view, size, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        maxWidth: size,
        aspectRatio: "1 / 1",
        margin: "0 auto",
        display: "block",
      }}
    />
  );
}
