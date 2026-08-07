// One-time (re-runnable) script: fetch one licensed photo per city from
// Unsplash and cache it into data/cities.json as imageUrl + imageCredit.
// Run: node --env-file=.env.local scripts/fetch-city-photos.mjs
//
// Static-cache by design (matches the rest of /data): we do NOT call the
// Unsplash API at request time. This keeps pages fast and keeps us well
// under Unsplash's free-tier rate limit (50 req/hr for demo apps).
//
// Complies with Unsplash API guidelines: pings `download_location` for
// each photo we use, and stores UTM-tagged photographer + Unsplash links
// for on-page attribution (rendered in components/overlays.tsx).

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!ACCESS_KEY) {
  console.error("Missing UNSPLASH_ACCESS_KEY. Run with --env-file=.env.local");
  process.exit(1);
}

const UTM = "utm_source=portal_voyage&utm_medium=referral";
const CITIES_PATH = fileURLToPath(new URL("../data/cities.json", import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function searchPhoto(query) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&per_page=1&orientation=landscape&content_filter=high`;
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });
  if (res.status === 403) {
    throw new Error("RATE_LIMITED");
  }
  if (!res.ok) {
    console.warn(`  ! search failed (${res.status}) for "${query}"`);
    return null;
  }
  const data = await res.json();
  return data.results?.[0] ?? null;
}

async function pingDownload(downloadLocation) {
  // Required by Unsplash API guidelines when a photo is used, not just
  // browsed. Best-effort — a failure here shouldn't block the photo.
  try {
    await fetch(`${downloadLocation}&client_id=${ACCESS_KEY}`);
  } catch {
    // ignore
  }
}

async function main() {
  const cities = JSON.parse(await readFile(CITIES_PATH, "utf8"));
  let ok = 0;
  let skipped = 0;

  const force = process.argv.includes("--force");

  for (const city of cities) {
    process.stdout.write(`${city.city.padEnd(20)} `);
    if (city.imageUrl && !force) {
      console.log("already set, skipping (--force to refetch)");
      continue;
    }
    let photo;
    try {
      photo =
        (await searchPhoto(`${city.city} skyline`)) ??
        (await searchPhoto(`${city.city} ${city.country} cityscape`));
    } catch (e) {
      if (e.message === "RATE_LIMITED") {
        console.log("\nRate limited by Unsplash — stopping early. Re-run later to fill the rest.");
        break;
      }
      throw e;
    }

    if (!photo) {
      console.log("no result, keeping gradient fallback");
      skipped++;
      await sleep(250);
      continue;
    }

    city.imageUrl = photo.urls.regular;
    city.imageCredit = {
      photographer: photo.user.name,
      photographerUrl: `${photo.user.links.html}?${UTM}`,
      unsplashUrl: `https://unsplash.com/?${UTM}`,
    };
    await pingDownload(photo.links.download_location);
    console.log(`ok — photo by ${photo.user.name}`);
    ok++;
    await sleep(250); // stay well clear of the 50/hr demo rate limit
  }

  await writeFile(CITIES_PATH, JSON.stringify(cities, null, 2) + "\n", "utf8");
  console.log(`\n${ok} photos set, ${skipped} left on gradient fallback.`);
}

main();
