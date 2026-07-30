import { ImageResponse } from "next/og";

// Favicon: the wordmark "P" over the portal.voyage spectrum.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const SPECTRUM = [
  "#06b6d4", "#d946ef", "#eab308", "#16a34a", "#dc2626", "#4f46e5", "#ea580c",
];

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#17171a",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fafafa",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          P
        </div>
        <div style={{ display: "flex", height: 5 }}>
          {SPECTRUM.map((c) => (
            <div key={c} style={{ flex: 1, background: c }} />
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
