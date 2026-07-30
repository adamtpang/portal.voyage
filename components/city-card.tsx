import type { ScoredCity } from "@/lib/types";

// Deterministic two-stop gradient per city, used until a photo exists.
const SPECTRUM = [
  "#06b6d4", "#d946ef", "#eab308", "#16a34a", "#dc2626", "#4f46e5", "#ea580c",
];

function tileBackground(slug: string, imageUrl?: string): string {
  if (imageUrl) return `url(${imageUrl}) center/cover no-repeat`;
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % 997;
  const a = SPECTRUM[h % SPECTRUM.length];
  const b = SPECTRUM[(h + 3) % SPECTRUM.length];
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}

function fitColor(fit: number): string {
  if (fit >= 75) return "var(--pv-green)";
  if (fit >= 60) return "var(--pv-cyan)";
  if (fit >= 45) return "var(--pv-gold)";
  return "#a1a1aa";
}

function Stat({ label, value, dot }: { label: string; value: number; dot: string }) {
  return (
    <div className="flex-1 min-w-0 bg-black/40 backdrop-blur-sm px-1.5 py-1 rounded">
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: dot }} />
        <span className="font-mono text-[8px] uppercase tracking-wider text-white/60 truncate">
          {label}
        </span>
      </div>
      <div className="font-mono text-[13px] font-medium text-white tabular-nums leading-tight">
        {value}
      </div>
    </div>
  );
}

export function CityCard({
  scored,
  rank,
  onOpen,
  onToggleCompare,
  inCompare,
}: {
  scored: ScoredCity;
  rank: number;
  onOpen: () => void;
  onToggleCompare: () => void;
  inCompare: boolean;
}) {
  const { city, fit, axes, anchors } = scored;

  return (
    <div
      className={`group relative rounded-xl overflow-hidden border border-border transition-all ${
        scored.excluded ? "opacity-55" : "hover:-translate-y-0.5 hover:shadow-lg"
      } ${inCompare ? "ring-2 ring-[var(--pv-gold)]" : ""}`}
    >
      {/* backdrop: photo when available, spectrum gradient otherwise */}
      <div
        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
        style={{ background: tileBackground(city.slug, city.imageUrl) }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      {/* the whole tile opens the detail view */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View details for ${city.city}`}
        className="relative block w-full text-left"
        style={{ minHeight: 208 }}
      >
        <div className="flex items-start justify-between p-2.5">
          <span className="font-mono text-[10px] font-medium text-white/70 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded">
            #{rank}
          </span>
          <span
            className="font-mono text-base font-semibold tabular-nums px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm"
            style={{ color: fitColor(fit) }}
          >
            {fit}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-lg leading-none">{city.flag}</span>
            <span className="font-medium text-[15px] text-white leading-tight truncate">
              {city.city}
            </span>
          </div>
          <div className="font-mono text-[10px] text-white/60 mb-2 truncate">
            {city.country} · ${city.costIndex.toLocaleString()}/mo
          </div>

          <div className="flex gap-1.5 mb-1.5">
            <Stat label="Cost" value={axes.cost} dot="var(--pv-green)" />
            <Stat label="Career" value={axes.career} dot="var(--pv-cyan)" />
            <Stat label="People" value={axes.people} dot="var(--pv-magenta)" />
          </div>

          {anchors.length > 0 ? (
            <div
              className="font-mono text-[9px] px-1.5 py-1 rounded truncate"
              style={{ background: "rgba(217,70,239,0.22)", color: "#f9d5ff" }}
              title="A signal about the scene — proximity isn't access."
            >
              ★ {anchors.map((a) => a.person.name).join(", ")}
            </div>
          ) : scored.excluded ? (
            <div className="font-mono text-[9px] text-[var(--pv-orange)] truncate">
              ⚠ {scored.constraintFails[0]}
            </div>
          ) : (
            <div className="font-mono text-[9px] text-white/45 truncate">{scored.why}</div>
          )}
        </div>
      </button>

      {/* compare toggle, revealed on hover/focus */}
      <button
        type="button"
        onClick={onToggleCompare}
        aria-pressed={inCompare}
        aria-label={inCompare ? `Remove ${city.city} from compare` : `Add ${city.city} to compare`}
        className={`absolute top-2.5 left-1/2 -translate-x-1/2 font-mono text-[9px] px-2 py-1 rounded backdrop-blur-sm transition-opacity ${
          inCompare
            ? "bg-[var(--pv-gold)] text-black opacity-100"
            : "bg-black/50 text-white/80 opacity-0 group-hover:opacity-100 focus:opacity-100"
        }`}
      >
        {inCompare ? "✓ comparing" : "+ compare"}
      </button>
    </div>
  );
}
