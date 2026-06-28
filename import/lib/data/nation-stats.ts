// Major nation-states with the census triad: population, GDP, area.
// Figures are approximate (2024 nominal GDP in USD billions, population in
// millions, area in km^2), sourced from IMF / World Bank / UN. Used by the
// /explore directory to put nation-states and network-states in one grid,
// measured the same way (the three KPIs from Balaji's census definition).
//
// `mirrorSlug` links to the matching /world/[slug] internet-mirror profile.

export type NationStat = {
  name: string;
  flag: string;
  region: "Africa" | "Americas" | "Asia" | "Europe" | "Oceania";
  population: number; // millions
  gdp: number; // USD billions, nominal
  area: number; // km^2
  gdpRank: number; // world rank by nominal GDP
  mirrorSlug?: string; // matches lib/data/world-mirrors.ts
  paletteIndex: number;
};

export const NATION_STATS: NationStat[] = [
  { name: "United States", flag: "🇺🇸", region: "Americas", population: 335, gdp: 29200, area: 9834000, gdpRank: 1, mirrorSlug: "usa", paletteIndex: 0 },
  { name: "China", flag: "🇨🇳", region: "Asia", population: 1410, gdp: 18700, area: 9597000, gdpRank: 2, paletteIndex: 4 },
  { name: "Germany", flag: "🇩🇪", region: "Europe", population: 84, gdp: 4700, area: 357022, gdpRank: 4, paletteIndex: 5 },
  { name: "Japan", flag: "🇯🇵", region: "Asia", population: 124, gdp: 4100, area: 377975, gdpRank: 5, mirrorSlug: "japan", paletteIndex: 1 },
  { name: "India", flag: "🇮🇳", region: "Asia", population: 1430, gdp: 4000, area: 3287263, gdpRank: 6, mirrorSlug: "india", paletteIndex: 6 },
  { name: "United Kingdom", flag: "🇬🇧", region: "Europe", population: 68, gdp: 3600, area: 243610, gdpRank: 7, mirrorSlug: "uk", paletteIndex: 5 },
  { name: "France", flag: "🇫🇷", region: "Europe", population: 68, gdp: 3100, area: 551695, gdpRank: 8, paletteIndex: 5 },
  { name: "Italy", flag: "🇮🇹", region: "Europe", population: 59, gdp: 2400, area: 301340, gdpRank: 9, paletteIndex: 3 },
  { name: "Canada", flag: "🇨🇦", region: "Americas", population: 41, gdp: 2200, area: 9985000, gdpRank: 10, mirrorSlug: "canada", paletteIndex: 4 },
  { name: "Brazil", flag: "🇧🇷", region: "Americas", population: 216, gdp: 2200, area: 8516000, gdpRank: 11, paletteIndex: 3 },
  { name: "Russia", flag: "🇷🇺", region: "Europe", population: 144, gdp: 2200, area: 17098242, gdpRank: 12, paletteIndex: 5 },
  { name: "Mexico", flag: "🇲🇽", region: "Americas", population: 129, gdp: 1850, area: 1964375, gdpRank: 13, paletteIndex: 1 },
  { name: "Australia", flag: "🇦🇺", region: "Oceania", population: 27, gdp: 1750, area: 7692024, gdpRank: 14, mirrorSlug: "australia", paletteIndex: 0 },
  { name: "South Korea", flag: "🇰🇷", region: "Asia", population: 52, gdp: 1900, area: 100210, gdpRank: 15, mirrorSlug: "south-korea", paletteIndex: 5 },
  { name: "Spain", flag: "🇪🇸", region: "Europe", population: 48, gdp: 1700, area: 505992, gdpRank: 16, paletteIndex: 4 },
  { name: "Indonesia", flag: "🇮🇩", region: "Asia", population: 277, gdp: 1450, area: 1904569, gdpRank: 17, mirrorSlug: "indonesia", paletteIndex: 3 },
  { name: "Turkey", flag: "🇹🇷", region: "Asia", population: 85, gdp: 1100, area: 783562, gdpRank: 18, mirrorSlug: "turkey", paletteIndex: 4 },
  { name: "Netherlands", flag: "🇳🇱", region: "Europe", population: 18, gdp: 1150, area: 41850, gdpRank: 19, paletteIndex: 6 },
  { name: "Saudi Arabia", flag: "🇸🇦", region: "Asia", population: 37, gdp: 1100, area: 2149690, gdpRank: 20, paletteIndex: 3 },
  { name: "Switzerland", flag: "🇨🇭", region: "Europe", population: 9, gdp: 940, area: 41285, gdpRank: 21, mirrorSlug: "switzerland", paletteIndex: 5 },
  { name: "Argentina", flag: "🇦🇷", region: "Americas", population: 46, gdp: 640, area: 2780400, gdpRank: 22, mirrorSlug: "argentina", paletteIndex: 4 },
  { name: "UAE", flag: "🇦🇪", region: "Asia", population: 10, gdp: 540, area: 83600, gdpRank: 24, mirrorSlug: "uae", paletteIndex: 2 },
  { name: "Israel", flag: "🇮🇱", region: "Asia", population: 9.8, gdp: 530, area: 22072, gdpRank: 25, mirrorSlug: "israel", paletteIndex: 5 },
  { name: "Singapore", flag: "🇸🇬", region: "Asia", population: 6, gdp: 530, area: 728, gdpRank: 26, mirrorSlug: "singapore", paletteIndex: 5 },
  { name: "Thailand", flag: "🇹🇭", region: "Asia", population: 72, gdp: 530, area: 513120, gdpRank: 27, mirrorSlug: "thailand", paletteIndex: 0 },
  { name: "Vietnam", flag: "🇻🇳", region: "Asia", population: 99, gdp: 470, area: 331212, gdpRank: 33, mirrorSlug: "vietnam", paletteIndex: 6 },
  { name: "Malaysia", flag: "🇲🇾", region: "Asia", population: 34, gdp: 440, area: 330803, gdpRank: 35, mirrorSlug: "malaysia", paletteIndex: 0 },
  { name: "South Africa", flag: "🇿🇦", region: "Africa", population: 60, gdp: 380, area: 1221037, gdpRank: 38, mirrorSlug: "south-africa", paletteIndex: 0 },
  { name: "Nigeria", flag: "🇳🇬", region: "Africa", population: 224, gdp: 360, area: 923768, gdpRank: 40, mirrorSlug: "nigeria", paletteIndex: 1 },
  { name: "Portugal", flag: "🇵🇹", region: "Europe", population: 10.3, gdp: 290, area: 92090, gdpRank: 48, mirrorSlug: "portugal", paletteIndex: 6 },
  { name: "New Zealand", flag: "🇳🇿", region: "Oceania", population: 5.2, gdp: 250, area: 268021, gdpRank: 50, mirrorSlug: "new-zealand", paletteIndex: 5 },
  { name: "Kenya", flag: "🇰🇪", region: "Africa", population: 55, gdp: 110, area: 580367, gdpRank: 60, mirrorSlug: "kenya", paletteIndex: 3 },
  { name: "Panama", flag: "🇵🇦", region: "Americas", population: 4.5, gdp: 87, area: 75417, gdpRank: 75, mirrorSlug: "panama", paletteIndex: 3 },
  { name: "Ghana", flag: "🇬🇭", region: "Africa", population: 34, gdp: 80, area: 238533, gdpRank: 76, mirrorSlug: "ghana", paletteIndex: 1 },
  { name: "Estonia", flag: "🇪🇪", region: "Europe", population: 1.37, gdp: 41, area: 45227, gdpRank: 99, mirrorSlug: "estonia", paletteIndex: 5 },
  { name: "Honduras", flag: "🇭🇳", region: "Americas", population: 10.6, gdp: 38, area: 112492, gdpRank: 102, mirrorSlug: "honduras", paletteIndex: 3 },
  { name: "El Salvador", flag: "🇸🇻", region: "Americas", population: 6.3, gdp: 35, area: 21041, gdpRank: 104, mirrorSlug: "el-salvador", paletteIndex: 2 },
  { name: "Georgia", flag: "🇬🇪", region: "Asia", population: 3.7, gdp: 33, area: 69700, gdpRank: 110, mirrorSlug: "georgia", paletteIndex: 5 },
  { name: "Malta", flag: "🇲🇹", region: "Europe", population: 0.54, gdp: 22, area: 316, gdpRank: 124, mirrorSlug: "malta", paletteIndex: 4 },
  { name: "Montenegro", flag: "🇲🇪", region: "Europe", population: 0.62, gdp: 8, area: 13812, gdpRank: 150, mirrorSlug: "montenegro", paletteIndex: 5 },
  { name: "Liechtenstein", flag: "🇱🇮", region: "Europe", population: 0.04, gdp: 7, area: 160, gdpRank: 155, mirrorSlug: "liechtenstein", paletteIndex: 6 },
];

export function fmtPop(m: number): string {
  if (m >= 1000) return `${(m / 1000).toFixed(2)}B`;
  if (m >= 1) return `${Math.round(m)}M`;
  return `${Math.round(m * 1000)}K`;
}

export function fmtGdp(b: number): string {
  if (b >= 1000) return `$${(b / 1000).toFixed(1)}T`;
  return `$${b}B`;
}

export function fmtArea(km2: number): string {
  if (km2 >= 1000000) return `${(km2 / 1000000).toFixed(1)}M km²`;
  if (km2 >= 1000) return `${Math.round(km2 / 1000)}K km²`;
  return `${km2} km²`;
}
