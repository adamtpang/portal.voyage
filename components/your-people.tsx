"use client";

import { useState } from "react";
import type { AdmiredPerson, Person, Field } from "@/lib/types";
import { FIELDS } from "@/lib/types";
import { people as seedPeople, cities, cityBySlug } from "@/lib/data";
import { personToAdmired } from "@/lib/defaults";
import { parsePokedexExport } from "@/lib/pokedex-import";
import { UnverifiedBadge, PeopleCaveat } from "@/components/ui-bits";

function AdmirationStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: 1 | 2 | 3 | 4 | 5) => void;
}) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Admiration">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n as 1 | 2 | 3 | 4 | 5)}
          aria-label={`Set admiration ${n}`}
          className={`h-2.5 w-2.5 rounded-full transition-colors ${
            n <= value ? "bg-[var(--pv-magenta)]" : "bg-muted border border-border"
          }`}
        />
      ))}
    </div>
  );
}

export function YourPeople({
  admired,
  onChange,
}: {
  admired: AdmiredPerson[];
  onChange: (a: AdmiredPerson[]) => void;
}) {
  const [q, setQ] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [cName, setCName] = useState("");
  const [cCity, setCCity] = useState(cities[0].slug);
  const [cField, setCField] = useState<Field>("Startups");
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importSummary, setImportSummary] = useState<string | null>(null);
  const [fetchingLive, setFetchingLive] = useState(false);

  const addedIds = new Set(admired.map((a) => a.id));
  const matches = q.trim()
    ? seedPeople
        .filter(
          (p) =>
            !addedIds.has(p.id) &&
            (p.name.toLowerCase().includes(q.toLowerCase()) ||
              p.role.toLowerCase().includes(q.toLowerCase()))
        )
        .slice(0, 6)
    : [];

  const add = (p: Person) => {
    onChange([...admired, personToAdmired(p)]);
    setQ("");
  };
  const addCustom = () => {
    const name = cName.trim();
    if (!name) return;
    const id = `custom-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${cCity}`;
    if (addedIds.has(id)) return;
    onChange([
      ...admired,
      { id, name, admiration: 4, why: "", citySlug: cCity, fields: [cField], verified: false },
    ]);
    setCName("");
    setShowCustom(false);
  };
  const applyImportResult = (result: ReturnType<typeof parsePokedexExport>, prefix: string) => {
    if (result.parseError) {
      setImportSummary(result.parseError);
      return;
    }
    const fresh = result.people.filter((p) => !addedIds.has(p.id));
    const dupes = result.people.length - fresh.length;
    const noCity = fresh.filter((p) => !p.citySlug).length;
    onChange([...admired, ...fresh]);
    setImportSummary(
      `${prefix}${fresh.length} added` +
        (dupes ? `, ${dupes} already in your list` : "") +
        (noCity ? `, ${noCity} without a matched city` : "") +
        "."
    );
  };

  const runImport = () => {
    applyImportResult(parsePokedexExport(importText), "");
    setImportText("");
  };

  const runLiveFetch = async () => {
    setFetchingLive(true);
    setImportSummary(null);
    try {
      const res = await fetch("https://pokedex.life/api/people?limit=100");
      if (!res.ok) {
        setImportSummary(`pokedex.life returned an error (${res.status}). Try again later.`);
        return;
      }
      const text = await res.text();
      let body: { specimens?: unknown[]; note?: string };
      try {
        body = JSON.parse(text);
      } catch {
        setImportSummary("pokedex.life returned something unexpected — try pasting an export instead.");
        return;
      }
      if (!body.specimens || body.specimens.length === 0) {
        setImportSummary(body.note || "No classified people there yet.");
        return;
      }
      applyImportResult(parsePokedexExport(text), "Fetched live: ");
    } catch {
      setImportSummary("Couldn't reach pokedex.life — check your connection and try again.");
    } finally {
      setFetchingLive(false);
    }
  };

  const remove = (id: string) => onChange(admired.filter((a) => a.id !== id));
  const setAdm = (id: string, v: 1 | 2 | 3 | 4 | 5) =>
    onChange(admired.map((a) => (a.id === id ? { ...a, admiration: v } : a)));

  return (
    <div className="space-y-4">
      {/* search */}
      <div className="space-y-1.5">
        <label htmlFor="admired-people-search" className="block text-xs text-muted-foreground">
          Search people you admire
        </label>
        <div className="relative">
          <input
            id="admired-people-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Name or role"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          {matches.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-md overflow-hidden">
              {matches.map((p) => {
                const city = cityBySlug[p.citySlug];
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => add(p)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-muted transition-colors"
                  >
                    <span className="text-base">{city?.flag ?? "📍"}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm truncate">{p.name}</span>
                      <span className="block font-mono text-[10px] text-muted-foreground truncate">
                        {p.role} · {city?.city ?? p.citySlug}
                      </span>
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">+ add</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* custom add */}
      {!showCustom ? (
        <button
          type="button"
          onClick={() => setShowCustom(true)}
          className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          + Can&apos;t find them? Add someone
        </button>
      ) : (
        <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
          <div>
            <label htmlFor="custom-person-name" className="block text-[10px] text-muted-foreground mb-1">
              Person name
            </label>
            <input
              id="custom-person-name"
              value={cName}
              onChange={(e) => setCName(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="custom-person-city" className="block text-[10px] text-muted-foreground mb-1">
                City
              </label>
              <select
                id="custom-person-city"
                value={cCity}
                onChange={(e) => setCCity(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs font-mono cursor-pointer"
              >
                {cities.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.flag} {c.city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="custom-person-field" className="block text-[10px] text-muted-foreground mb-1">
                Field
              </label>
              <select
                id="custom-person-field"
                value={cField}
                onChange={(e) => setCField(e.target.value as Field)}
                className="rounded-md border border-border bg-background px-2 py-1.5 text-xs font-mono cursor-pointer"
              >
                {FIELDS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addCustom}
              className="font-mono text-xs px-3 py-1.5 rounded-md border border-foreground bg-foreground text-background"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowCustom(false)}
              className="font-mono text-xs px-3 py-1.5 rounded-md border border-border hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* pokedex.life import */}
      {!showImport ? (
        <button
          type="button"
          onClick={() => setShowImport(true)}
          className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          + Import from pokedex.life
        </button>
      ) : (
        <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3">
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={runLiveFetch}
              disabled={fetchingLive}
              className="w-full font-mono text-xs px-3 py-2 rounded-md border border-foreground bg-foreground text-background disabled:opacity-50 disabled:cursor-wait"
            >
              {fetchingLive ? "Fetching…" : "⚡ Fetch live from pokedex.life"}
            </button>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Pulls your classified people straight from pokedex.life. Nothing to paste — the
              scan pipeline there decides who&apos;s actually classified yet.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="flex-1 h-px bg-border" />
            or paste an export
            <span className="flex-1 h-px bg-border" />
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            An array of specimens, or <code className="font-mono">{"{ specimens: [...] }"}</code>.
            Level/Tier sets admiration; location resolves to the nearest city we track.
          </p>
          <div>
            <label htmlFor="pokedex-export" className="block text-[10px] text-muted-foreground mb-1">
              pokedex.life export JSON
            </label>
            <textarea
              id="pokedex-export"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='[{"handle": "...", "level": 72, "locationLat": 1.35, "locationLng": 103.82}]'
              rows={4}
              className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-mono"
            />
          </div>
          {importSummary && (
            <p className="text-xs text-foreground/80 leading-relaxed">{importSummary}</p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={runImport}
              disabled={!importText.trim()}
              className="font-mono text-xs px-3 py-1.5 rounded-md border border-foreground bg-foreground text-background disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Import
            </button>
            <button
              type="button"
              onClick={() => {
                setShowImport(false);
                setImportSummary(null);
              }}
              className="font-mono text-xs px-3 py-1.5 rounded-md border border-border hover:bg-muted"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* added list */}
      {admired.length > 0 ? (
        <ul className="space-y-2">
          {admired.map((a) => {
            const city = a.citySlug ? cityBySlug[a.citySlug] : undefined;
            return (
              <li
                key={a.id}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
              >
                <span className="text-base">{city?.flag ?? "📍"}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm truncate">{a.name}</span>
                    {!a.verified && <UnverifiedBadge />}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground truncate">
                    {city?.city ?? "—"}
                  </div>
                </div>
                <AdmirationStepper value={a.admiration} onChange={(v) => setAdm(a.id, v)} />
                <button
                  type="button"
                  onClick={() => remove(a.id)}
                  aria-label={`Remove ${a.name}`}
                  className="text-muted-foreground hover:text-foreground px-1"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground leading-relaxed">
          Add the people whose work, taste, or company you want to be near. The
          map will weight cities by where they cluster — your own Schelling points.
        </p>
      )}

      <PeopleCaveat compact />
    </div>
  );
}
