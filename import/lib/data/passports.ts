// Passport mobility tiers, loosely based on the Henley Passport Index
// (number of destinations accessible visa-free or visa-on-arrival).
// Tier 1 = strongest (180+), Tier 4 = most restricted (<70).
// Approximate; used by /atlas to compute each city's "unlock" difficulty
// for a given user. Pick your passport, see the world as it is for you.

export type PassportTier = 1 | 2 | 3 | 4;

export type Passport = {
  code: string;
  name: string;
  flag: string;
  tier: PassportTier;
  visaFree: number; // approx destinations visa-free / visa-on-arrival
};

export const PASSPORTS: Passport[] = [
  // Tier 1
  { code: "JP", name: "Japan", flag: "🇯🇵", tier: 1, visaFree: 193 },
  { code: "SG", name: "Singapore", flag: "🇸🇬", tier: 1, visaFree: 193 },
  { code: "DE", name: "Germany", flag: "🇩🇪", tier: 1, visaFree: 190 },
  { code: "IT", name: "Italy", flag: "🇮🇹", tier: 1, visaFree: 190 },
  { code: "FR", name: "France", flag: "🇫🇷", tier: 1, visaFree: 189 },
  { code: "ES", name: "Spain", flag: "🇪🇸", tier: 1, visaFree: 189 },
  { code: "KR", name: "South Korea", flag: "🇰🇷", tier: 1, visaFree: 189 },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", tier: 1, visaFree: 188 },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧", tier: 1, visaFree: 187 },
  { code: "US", name: "United States", flag: "🇺🇸", tier: 1, visaFree: 186 },
  { code: "CA", name: "Canada", flag: "🇨🇦", tier: 1, visaFree: 185 },
  { code: "AU", name: "Australia", flag: "🇦🇺", tier: 1, visaFree: 185 },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", tier: 1, visaFree: 184 },
  { code: "IE", name: "Ireland", flag: "🇮🇪", tier: 1, visaFree: 188 },
  { code: "PT", name: "Portugal", flag: "🇵🇹", tier: 1, visaFree: 188 },
  // Tier 2
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", tier: 2, visaFree: 179 },
  { code: "IL", name: "Israel", flag: "🇮🇱", tier: 2, visaFree: 170 },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", tier: 2, visaFree: 182 },
  { code: "CL", name: "Chile", flag: "🇨🇱", tier: 2, visaFree: 174 },
  { code: "AR", name: "Argentina", flag: "🇦🇷", tier: 2, visaFree: 170 },
  { code: "BR", name: "Brazil", flag: "🇧🇷", tier: 2, visaFree: 173 },
  { code: "MX", name: "Mexico", flag: "🇲🇽", tier: 2, visaFree: 159 },
  { code: "EE", name: "Estonia", flag: "🇪🇪", tier: 2, visaFree: 184 },
  // Tier 3
  { code: "TR", name: "Turkey", flag: "🇹🇷", tier: 3, visaFree: 118 },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", tier: 3, visaFree: 106 },
  { code: "GE", name: "Georgia", flag: "🇬🇪", tier: 3, visaFree: 122 },
  { code: "TH", name: "Thailand", flag: "🇹🇭", tier: 3, visaFree: 82 },
  { code: "CO", name: "Colombia", flag: "🇨🇴", tier: 3, visaFree: 134 },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", tier: 3, visaFree: 78 },
  { code: "PH", name: "Philippines", flag: "🇵🇭", tier: 3, visaFree: 69 },
  { code: "CN", name: "China", flag: "🇨🇳", tier: 3, visaFree: 85 },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", tier: 3, visaFree: 55 },
  // Tier 4
  { code: "IN", name: "India", flag: "🇮🇳", tier: 4, visaFree: 62 },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", tier: 4, visaFree: 46 },
  { code: "KE", name: "Kenya", flag: "🇰🇪", tier: 4, visaFree: 73 },
  { code: "EG", name: "Egypt", flag: "🇪🇬", tier: 4, visaFree: 53 },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", tier: 4, visaFree: 33 },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", tier: 4, visaFree: 40 },
];

export function getPassport(code: string): Passport | undefined {
  return PASSPORTS.find((p) => p.code === code);
}
