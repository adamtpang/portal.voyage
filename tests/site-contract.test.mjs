import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { before, test } from "node:test";
import * as cheerio from "cheerio";

const BASE_URL = process.env.SITE_TEST_BASE_URL;
if (!BASE_URL) throw new Error("SITE_TEST_BASE_URL is required");

const TRUST_ROUTES = ["/about", "/contact", "/privacy"];
const EXPECTED_CONTROL_LABELS = {
  "monthly-budget": "Monthly budget (USD)",
  "career-field": "Your field",
  "timezone-target": "Timezone target",
  "admired-people-search": "Search people you admire",
};

let homeHtml;
let homeResponse;

before(async () => {
  homeResponse = await fetch(`${BASE_URL}/`);
  assert.equal(homeResponse.status, 200);
  homeHtml = await homeResponse.text();
});

function hasAccessibleName($, element) {
  const node = $(element);
  const tag = element.tagName?.toLowerCase();
  const type = (node.attr("type") || "").toLowerCase();
  if (tag === "input" && ["hidden", "submit", "button", "reset", "image"].includes(type)) {
    return type === "hidden" || Boolean(node.attr("value") || node.attr("alt"));
  }
  const id = node.attr("id");
  return Boolean(
    node.attr("aria-label") ||
      node.attr("aria-labelledby") ||
      node.attr("title") ||
      node.closest("label").length ||
      (id && $(`label[for="${id.replaceAll('"', '\\"')}"]`).length) ||
      (tag === "button" && node.text().trim()),
  );
}

function visibleText(html) {
  const $ = cheerio.load(html);
  $("script, style, noscript, svg, template").remove();
  return $("body").text().replace(/\s+/g, " ").trim();
}

test("all 87 initial controls retain a programmatic name", () => {
  const $ = cheerio.load(homeHtml);
  const controls = $("input:not([type=hidden]), select, textarea, button").toArray();
  const unnamed = controls.filter((control) => !hasAccessibleName($, control));

  assert.equal(controls.length, 87, "the initial interaction surface changed");
  assert.deepEqual(
    unnamed.map((control) => $.html(control)),
    [],
    "every rendered control must have an accessible name",
  );

  for (const [id, expectedLabel] of Object.entries(EXPECTED_CONTROL_LABELS)) {
    assert.equal($(`#${id}`).length, 1, `${id} should be stable and unique`);
    assert.equal($(`label[for="${id}"]`).text().replace(/\s+/g, " ").trim(), expectedLabel);
  }
});

test("conditionally rendered controls use native, context-specific labels", async () => {
  const controls = await readFile("components/controls.tsx", "utf8");
  const people = await readFile("components/your-people.tsx", "utf8");
  const overlays = await readFile("components/overlays.tsx", "utf8");
  for (const id of ["timezone-tolerance"]) {
    assert.match(controls, new RegExp(`htmlFor=["']${id}["']`));
    assert.match(controls, new RegExp(`id=["']${id}["']`));
  }
  for (const id of ["custom-person-name", "custom-person-city", "custom-person-field", "pokedex-export"]) {
    assert.match(people, new RegExp(`htmlFor=["']${id}["']`));
    assert.match(people, new RegExp(`id=["']${id}["']`));
  }
  assert.match(overlays, /role="dialog"/);
  assert.match(overlays, /aria-modal="true"/);
  assert.match(overlays, /event\.key === "Escape"/);
  assert.match(overlays, /event\.key !== "Tab"/);
});

test("security headers are enforced on the product and trust routes", async () => {
  for (const route of ["/", ...TRUST_ROUTES]) {
    const response = route === "/" ? homeResponse : await fetch(`${BASE_URL}${route}`);
    assert.equal(response.status, 200, `${route} should be reachable`);
    const csp = response.headers.get("content-security-policy") || "";
    assert.match(csp, /default-src 'self'/);
    assert.match(csp, /script-src 'self'/);
    assert.match(csp, /object-src 'none'/);
    assert.match(csp, /base-uri 'self'/);
    assert.match(csp, /frame-ancestors 'none'/);
    assert.match(csp, /connect-src 'self' https:\/\/pokedex\.life https:\/\/vitals\.vercel-insights\.com/);
    assert.doesNotMatch(csp, /\*/);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("x-frame-options"), "DENY");
    assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
    const permissions = response.headers.get("permissions-policy") || "";
    assert.match(permissions, /geolocation=\(self\)/);
    assert.match(permissions, /camera=\(\)/);
    assert.match(permissions, /microphone=\(\)/);
  }
});

test("substantial About, Contact, and Privacy pages are linked and canonical", async () => {
  const home = cheerio.load(homeHtml);
  for (const route of TRUST_ROUTES) {
    assert.equal(home(`a[href="${route}"]`).length, 1, `${route} should be linked once from the shell`);
    const response = await fetch(`${BASE_URL}${route}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    assert.equal($("h1").length, 1, `${route} should have one H1`);
    assert.equal($("link[rel=canonical]").attr("href"), `https://portal.voyage${route}`);
    assert.match($("title").text(), / · portal\.voyage$/);
    assert.ok(visibleText(html).split(/\s+/).length >= 150, `${route} should be substantive`);
  }

  const privacy = visibleText(await (await fetch(`${BASE_URL}/privacy`)).text());
  for (const disclosure of [
    "Find me",
    "browser memory",
    "Vercel Web Analytics",
    "images.unsplash.com",
    "pokedex.life",
    "Stripe",
    "no account",
  ]) {
    assert.match(privacy, new RegExp(disclosure, "i"));
  }
});

test("the primary CTA performs a real in-product next action", () => {
  const $ = cheerio.load(homeHtml);
  const cta = $('a[href="#decision-tool"]');
  assert.equal(cta.length, 1);
  assert.match(cta.text(), /start exploring 30 cities/i);
  assert.equal($("#decision-tool").length, 1);
});

test("crawler parity, identity schema, and protected paths remain intact", async () => {
  const gptResponse = await fetch(`${BASE_URL}/`, {
    headers: { "user-agent": "Mozilla/5.0 AppleWebKit/537.36 (compatible; GPTBot/1.2)" },
  });
  const gptHtml = await gptResponse.text();
  assert.equal(gptResponse.status, 200);
  assert.equal(visibleText(gptHtml), visibleText(homeHtml));

  const $ = cheerio.load(homeHtml);
  const nodes = $("script[type='application/ld+json']")
    .toArray()
    .flatMap((element) => {
      const parsed = JSON.parse($(element).text());
      return parsed["@graph"] || [parsed];
    });
  assert.ok(nodes.some((node) => node["@type"] === "Organization"));
  assert.ok(nodes.some((node) => node["@type"] === "WebSite"));

  const stripe = $('a[href="https://buy.stripe.com/8x25kD93454xeUM6KtaMU0z"]');
  assert.equal(stripe.length, 1);
  assert.equal(stripe.attr("target"), "_blank");
  assert.match(stripe.attr("rel") || "", /noopener/);
  assert.match(stripe.attr("rel") || "", /noreferrer/);

  const robots = await (await fetch(`${BASE_URL}/robots.txt`)).text();
  for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"]) {
    assert.match(robots, new RegExp(`User-Agent: ${bot}[\\s\\S]*?Allow: /`, "i"));
  }
  assert.doesNotMatch(robots, /Disallow:\s*\//i);

  const sitemap = await (await fetch(`${BASE_URL}/sitemap.xml`)).text();
  for (const route of ["", ...TRUST_ROUTES]) {
    assert.match(sitemap, new RegExp(`<loc>https://portal\\.voyage${route}</loc>`));
  }

  assert.equal((await fetch(`${BASE_URL}/openapi.json`)).status, 404);
});
