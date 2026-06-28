// City livability + opportunity data for /atlas, the personal "where should I
// live" tool. Earth is the open world; each city is a DLC you can move into.
// All values are 0-100 unless noted, approximate, curated from cost-of-living
// indices (Numbeo), growth data (IMF/World Bank), and nomad/network density.
//
// affordability: higher = better value on a remote income (cheaper)
// climate / safety / tax / community: higher = better
// tax: higher = more favorable to an individual remote earner
// visaOpenness 1-4: how open the place is to long-stays for most passports
// sectors: relative strength of the local job/opportunity market, 0-100

export type Sector = "tech" | "crypto" | "finance" | "creative" | "bio" | "trades";

export const SECTOR_LABELS: Record<Sector, string> = {
  tech: "Tech / Software",
  crypto: "Crypto / Web3",
  finance: "Finance",
  creative: "Creative / Media",
  bio: "Bio / Health",
  trades: "Trades / Ops",
};

export type City = {
  slug: string;
  city: string;
  country: string;
  flag: string;
  region: "Europe" | "Asia" | "Americas" | "Africa" | "Oceania" | "Middle East";
  affordability: number;
  popGrowth: number; // %/yr
  gdpGrowth: number; // %/yr
  climate: number;
  safety: number;
  tax: number;
  community: number;
  visaOpenness: 1 | 2 | 3 | 4;
  sectors: Record<Sector, number>;
  residencyNote: string;
  paletteIndex: number;
};

const s = (
  tech: number, crypto: number, finance: number, creative: number, bio: number, trades: number
): Record<Sector, number> => ({ tech, crypto, finance, creative, bio, trades });

export const CITIES: City[] = [
  // ── Europe ──
  { slug: "lisbon", city: "Lisbon", country: "Portugal", flag: "🇵🇹", region: "Europe", affordability: 62, popGrowth: 1.0, gdpGrowth: 2.0, climate: 88, safety: 85, tax: 70, community: 92, visaOpenness: 4, sectors: s(75,70,55,80,50,55), residencyNote: "D8 digital-nomad visa + D7 passive-income visa. EU residency in 5 years.", paletteIndex: 0 },
  { slug: "porto", city: "Porto", country: "Portugal", flag: "🇵🇹", region: "Europe", affordability: 68, popGrowth: 0.5, gdpGrowth: 2.0, climate: 84, safety: 86, tax: 70, community: 75, visaOpenness: 4, sectors: s(65,55,45,72,45,55), residencyNote: "Same Portuguese nomad/passive visas as Lisbon, lower cost.", paletteIndex: 5 },
  { slug: "madeira", city: "Madeira", country: "Portugal", flag: "🇵🇹", region: "Europe", affordability: 70, popGrowth: 0.2, gdpGrowth: 1.8, climate: 90, safety: 88, tax: 72, community: 80, visaOpenness: 4, sectors: s(60,65,40,60,40,45), residencyNote: "Home of the Digital Nomad Village. Portuguese visa stack.", paletteIndex: 2 },
  { slug: "barcelona", city: "Barcelona", country: "Spain", flag: "🇪🇸", region: "Europe", affordability: 55, popGrowth: 0.8, gdpGrowth: 2.2, climate: 86, safety: 78, tax: 50, community: 82, visaOpenness: 3, sectors: s(78,60,58,85,60,55), residencyNote: "Spain digital-nomad visa (2023) + Beckham Law flat tax.", paletteIndex: 4 },
  { slug: "madrid", city: "Madrid", country: "Spain", flag: "🇪🇸", region: "Europe", affordability: 54, popGrowth: 0.8, gdpGrowth: 2.2, climate: 80, safety: 82, tax: 52, community: 75, visaOpenness: 3, sectors: s(75,58,65,80,60,55), residencyNote: "Spain nomad visa + Beckham Law; bigger finance market.", paletteIndex: 3 },
  { slug: "berlin", city: "Berlin", country: "Germany", flag: "🇩🇪", region: "Europe", affordability: 52, popGrowth: 0.6, gdpGrowth: 1.2, climate: 62, safety: 80, tax: 45, community: 80, visaOpenness: 3, sectors: s(85,72,60,88,65,60), residencyNote: "Freelance (Freiberufler) visa; EU residency path.", paletteIndex: 5 },
  { slug: "amsterdam", city: "Amsterdam", country: "Netherlands", flag: "🇳🇱", region: "Europe", affordability: 40, popGrowth: 0.7, gdpGrowth: 1.8, climate: 60, safety: 88, tax: 55, community: 72, visaOpenness: 2, sectors: s(82,65,78,80,68,55), residencyNote: "DAFT visa for US citizens; highly-skilled-migrant route.", paletteIndex: 6 },
  { slug: "tallinn", city: "Tallinn", country: "Estonia", flag: "🇪🇪", region: "Europe", affordability: 64, popGrowth: 0.4, gdpGrowth: 2.5, climate: 50, safety: 88, tax: 78, community: 70, visaOpenness: 4, sectors: s(88,80,55,60,45,50), residencyNote: "e-Residency + 1-year digital-nomad visa. The most digital state.", paletteIndex: 5 },
  { slug: "tbilisi", city: "Tbilisi", country: "Georgia", flag: "🇬🇪", region: "Europe", affordability: 82, popGrowth: 0.3, gdpGrowth: 6.0, climate: 60, safety: 80, tax: 88, community: 65, visaOpenness: 4, sectors: s(60,70,45,58,35,50), residencyNote: "365-day visa-free for ~95 nationalities. 1% small-business tax.", paletteIndex: 5 },
  // ── Asia ──
  { slug: "bali", city: "Bali", country: "Indonesia", flag: "🇮🇩", region: "Asia", affordability: 78, popGrowth: 1.0, gdpGrowth: 5.0, climate: 85, safety: 78, tax: 70, community: 95, visaOpenness: 3, sectors: s(62,72,40,80,45,50), residencyNote: "B211B + new 5-year remote-worker KITAS. Nomad capital of Earth.", paletteIndex: 3 },
  { slug: "chiang-mai", city: "Chiang Mai", country: "Thailand", flag: "🇹🇭", region: "Asia", affordability: 88, popGrowth: 0.6, gdpGrowth: 2.8, climate: 78, safety: 82, tax: 72, community: 90, visaOpenness: 3, sectors: s(60,60,38,70,42,48), residencyNote: "Thailand LTR + new DTV long-stay visas. The original nomad hub.", paletteIndex: 0 },
  { slug: "bangkok", city: "Bangkok", country: "Thailand", flag: "🇹🇭", region: "Asia", affordability: 72, popGrowth: 0.7, gdpGrowth: 3.0, climate: 70, safety: 78, tax: 70, community: 82, visaOpenness: 3, sectors: s(68,62,62,72,55,55), residencyNote: "Same Thai LTR/DTV visas; far bigger job market.", paletteIndex: 1 },
  { slug: "ho-chi-minh", city: "Ho Chi Minh City", country: "Vietnam", flag: "🇻🇳", region: "Asia", affordability: 84, popGrowth: 1.3, gdpGrowth: 6.5, climate: 72, safety: 80, tax: 68, community: 70, visaOpenness: 2, sectors: s(70,65,50,62,40,55), residencyNote: "90-day e-visa; longer stays need a sponsor. Fastest-growing here.", paletteIndex: 6 },
  { slug: "singapore", city: "Singapore", country: "Singapore", flag: "🇸🇬", region: "Asia", affordability: 28, popGrowth: 1.0, gdpGrowth: 3.0, climate: 72, safety: 98, tax: 80, community: 80, visaOpenness: 2, sectors: s(90,70,95,65,80,50), residencyNote: "Tech.Pass / Employment Pass for high earners. Costly, frictionless.", paletteIndex: 5 },
  { slug: "kuala-lumpur", city: "Kuala Lumpur", country: "Malaysia", flag: "🇲🇾", region: "Asia", affordability: 80, popGrowth: 1.2, gdpGrowth: 4.5, climate: 74, safety: 82, tax: 72, community: 78, visaOpenness: 3, sectors: s(72,62,65,60,55,52), residencyNote: "MM2H long-stay + DE Rantau nomad pass. Forest City next door.", paletteIndex: 0 },
  { slug: "tokyo", city: "Tokyo", country: "Japan", flag: "🇯🇵", region: "Asia", affordability: 48, popGrowth: -0.3, gdpGrowth: 1.0, climate: 68, safety: 96, tax: 50, community: 70, visaOpenness: 2, sectors: s(85,60,80,82,78,58), residencyNote: "Highly-skilled-professional visa + new 6-month nomad visa.", paletteIndex: 1 },
  { slug: "seoul", city: "Seoul", country: "South Korea", flag: "🇰🇷", region: "Asia", affordability: 50, popGrowth: -0.2, gdpGrowth: 2.2, climate: 64, safety: 92, tax: 55, community: 68, visaOpenness: 2, sectors: s(88,75,72,85,72,55), residencyNote: "Workation / digital-nomad (F-1-D) visa launched 2024.", paletteIndex: 5 },
  { slug: "taipei", city: "Taipei", country: "Taiwan", flag: "🇹🇼", region: "Asia", affordability: 66, popGrowth: 0.1, gdpGrowth: 3.5, climate: 74, safety: 92, tax: 65, community: 72, visaOpenness: 2, sectors: s(90,65,60,70,70,52), residencyNote: "Employment Gold Card for qualifying professionals.", paletteIndex: 0 },
  { slug: "hong-kong", city: "Hong Kong", country: "Hong Kong", flag: "🇭🇰", region: "Asia", affordability: 30, popGrowth: 0.3, gdpGrowth: 2.5, climate: 72, safety: 90, tax: 88, community: 65, visaOpenness: 2, sectors: s(78,70,95,65,60,50), residencyNote: "Top Talent Pass; low flat tax; visa-light for many nationalities.", paletteIndex: 4 },
  { slug: "bangalore", city: "Bangalore", country: "India", flag: "🇮🇳", region: "Asia", affordability: 80, popGrowth: 1.6, gdpGrowth: 7.0, climate: 76, safety: 72, tax: 60, community: 65, visaOpenness: 1, sectors: s(88,60,62,60,70,50), residencyNote: "Employment visa via sponsor; hard to stay long as a tourist.", paletteIndex: 6 },
  // ── Middle East ──
  { slug: "dubai", city: "Dubai", country: "UAE", flag: "🇦🇪", region: "Middle East", affordability: 38, popGrowth: 2.5, gdpGrowth: 4.0, climate: 50, safety: 95, tax: 95, community: 85, visaOpenness: 4, sectors: s(78,85,85,70,55,55), residencyNote: "Remote-work visa + Golden Visa. 0% personal income tax.", paletteIndex: 2 },
  { slug: "istanbul", city: "Istanbul", country: "Turkey", flag: "🇹🇷", region: "Middle East", affordability: 76, popGrowth: 1.0, gdpGrowth: 3.5, climate: 72, safety: 74, tax: 70, community: 70, visaOpenness: 3, sectors: s(70,72,60,75,50,55), residencyNote: "Short-term residence permit; citizenship-by-investment route.", paletteIndex: 4 },
  // ── Americas ──
  { slug: "mexico-city", city: "Mexico City", country: "Mexico", flag: "🇲🇽", region: "Americas", affordability: 72, popGrowth: 0.8, gdpGrowth: 2.5, climate: 80, safety: 68, tax: 65, community: 88, visaOpenness: 4, sectors: s(72,65,60,82,50,55), residencyNote: "Temporary-resident visa via income proof. Easy and popular.", paletteIndex: 1 },
  { slug: "medellin", city: "Medellín", country: "Colombia", flag: "🇨🇴", region: "Americas", affordability: 82, popGrowth: 1.0, gdpGrowth: 3.5, climate: 92, safety: 66, tax: 65, community: 85, visaOpenness: 4, sectors: s(65,62,48,72,42,50), residencyNote: "Digital-nomad visa (2023). City of eternal spring.", paletteIndex: 3 },
  { slug: "buenos-aires", city: "Buenos Aires", country: "Argentina", flag: "🇦🇷", region: "Americas", affordability: 80, popGrowth: 0.5, gdpGrowth: 1.5, climate: 78, safety: 70, tax: 60, community: 82, visaOpenness: 4, sectors: s(70,80,52,85,50,52), residencyNote: "Rentista / nomad visa. Crypto capital of Latin America.", paletteIndex: 4 },
  { slug: "sao-paulo", city: "São Paulo", country: "Brazil", flag: "🇧🇷", region: "Americas", affordability: 66, popGrowth: 0.6, gdpGrowth: 2.5, climate: 76, safety: 60, tax: 55, community: 70, visaOpenness: 4, sectors: s(75,68,70,78,58,55), residencyNote: "Digital-nomad visa (2022); largest economy in the region.", paletteIndex: 3 },
  { slug: "austin", city: "Austin", country: "United States", flag: "🇺🇸", region: "Americas", affordability: 50, popGrowth: 2.2, gdpGrowth: 4.0, climate: 74, safety: 78, tax: 80, community: 85, visaOpenness: 1, sectors: s(88,78,65,80,65,58), residencyNote: "No state income tax. Non-citizens need a US work visa.", paletteIndex: 6 },
  { slug: "miami", city: "Miami", country: "United States", flag: "🇺🇸", region: "Americas", affordability: 42, popGrowth: 1.5, gdpGrowth: 3.5, climate: 80, safety: 72, tax: 80, community: 88, visaOpenness: 1, sectors: s(75,88,78,78,58,55), residencyNote: "No state income tax; crypto + Latin America gateway. US visa needed.", paletteIndex: 0 },
  { slug: "new-york", city: "New York", country: "United States", flag: "🇺🇸", region: "Americas", affordability: 30, popGrowth: 0.2, gdpGrowth: 2.5, climate: 60, safety: 75, tax: 40, community: 80, visaOpenness: 1, sectors: s(85,75,98,92,72,55), residencyNote: "The financial + cultural center. Expensive, dense, visa-gated.", paletteIndex: 5 },
  { slug: "san-francisco", city: "San Francisco", country: "United States", flag: "🇺🇸", region: "Americas", affordability: 26, popGrowth: -0.2, gdpGrowth: 3.0, climate: 78, safety: 65, tax: 38, community: 82, visaOpenness: 1, sectors: s(98,82,80,75,88,50), residencyNote: "AI + deep-tech capital. Costliest US metro. Visa-gated.", paletteIndex: 0 },
  { slug: "denver", city: "Denver", country: "United States", flag: "🇺🇸", region: "Americas", affordability: 48, popGrowth: 1.0, gdpGrowth: 2.8, climate: 70, safety: 78, tax: 60, community: 68, visaOpenness: 1, sectors: s(78,65,58,65,62,58), residencyNote: "Outdoorsy tech hub. US visa-gated for non-citizens.", paletteIndex: 3 },
  { slug: "toronto", city: "Toronto", country: "Canada", flag: "🇨🇦", region: "Americas", affordability: 44, popGrowth: 2.2, gdpGrowth: 2.0, climate: 54, safety: 88, tax: 45, community: 72, visaOpenness: 2, sectors: s(82,68,80,75,70,55), residencyNote: "Express Entry skilled-immigration; founder-friendly start-up visa.", paletteIndex: 4 },
  // ── Africa ──
  { slug: "cape-town", city: "Cape Town", country: "South Africa", flag: "🇿🇦", region: "Africa", affordability: 70, popGrowth: 1.2, gdpGrowth: 1.5, climate: 86, safety: 58, tax: 55, community: 75, visaOpenness: 3, sectors: s(75,65,62,80,55,52), residencyNote: "Digital-nomad visa (2024). Stunning; safety is uneven.", paletteIndex: 0 },
  { slug: "nairobi", city: "Nairobi", country: "Kenya", flag: "🇰🇪", region: "Africa", affordability: 74, popGrowth: 2.3, gdpGrowth: 5.0, climate: 82, safety: 60, tax: 58, community: 62, visaOpenness: 3, sectors: s(78,68,58,65,48,50), residencyNote: "Silicon Savannah; class-G permit and nomad pass emerging.", paletteIndex: 3 },
  { slug: "lagos", city: "Lagos", country: "Nigeria", flag: "🇳🇬", region: "Africa", affordability: 76, popGrowth: 2.5, gdpGrowth: 3.0, climate: 76, safety: 50, tax: 55, community: 60, visaOpenness: 2, sectors: s(80,78,60,80,40,50), residencyNote: "Itana digital free zone; visa-on-arrival expanding for some.", paletteIndex: 1 },
];

export function getCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}
