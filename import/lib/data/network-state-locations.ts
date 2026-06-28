// Known network states, popup villages, and startup societies with lat/lng.
// Used to populate the Archipelago view of the Interneta globe.
// Each entry is the geographic anchor of a member-state-eligible community.
//
// Inclusion here does NOT imply membership in Interneta. Network states
// remain sovereign. Some will join the federation; some will not.

export type NetworkStateLocation = {
  name: string;
  location: string;
  lat: number;
  lng: number;
  category: "network-school" | "popup" | "city" | "online" | "society";
  url?: string;
};

export const NETWORK_STATE_LOCATIONS: NetworkStateLocation[] = [
  // Balaji and friends
  { name: "Network School", location: "Forest City, Malaysia", lat: 1.42, lng: 103.63, category: "network-school", url: "https://ns.com" },
  { name: "Próspera", location: "Roatán, Honduras", lat: 16.32, lng: -86.55, category: "city", url: "https://prospera.co" },
  { name: "Vitalia", location: "Roatán, Honduras", lat: 16.31, lng: -86.55, category: "popup", url: "https://vitalia.city" },
  // Vitalik popup cities
  { name: "Zuzalu", location: "Tivat, Montenegro", lat: 42.43, lng: 18.7, category: "popup" },
  { name: "ZuConnect", location: "Istanbul, Turkey", lat: 41.01, lng: 28.98, category: "popup" },
  { name: "Edge Esmeralda", location: "Healdsburg, California", lat: 38.61, lng: -122.87, category: "popup" },
  { name: "Edge City", location: "Lagos, Portugal", lat: 37.1, lng: -8.67, category: "popup" },
  // Cabin / nature-coded
  { name: "Cabin DAO", location: "Texas Hill Country, USA", lat: 30.27, lng: -97.74, category: "society", url: "https://cabin.city" },
  { name: "Telosa", location: "Nevada, USA", lat: 39.5, lng: -116.0, category: "city" },
  // Crypto cities
  { name: "Praxis", location: "TBD (Mediterranean)", lat: 36.0, lng: 14.0, category: "city" },
  { name: "Solarpunk DAO", location: "Distributed", lat: 0, lng: 0, category: "online" },
  { name: "Plumia", location: "Distributed", lat: 12.0, lng: 0, category: "online" },
  // Africa
  { name: "Afropolitan", location: "Accra, Ghana", lat: 5.56, lng: -0.2, category: "society", url: "https://afropolitan.io" },
  { name: "Itana", location: "Lagos, Nigeria", lat: 6.46, lng: 3.38, category: "city" },
  // Latin America
  { name: "Aleph", location: "Buenos Aires, Argentina", lat: -34.6, lng: -58.38, category: "popup" },
  { name: "Cocos", location: "Costa Rica", lat: 9.93, lng: -84.08, category: "popup" },
  { name: "Crecimiento", location: "Buenos Aires, Argentina", lat: -34.61, lng: -58.39, category: "popup" },
  // Asia
  { name: "Forest City", location: "Iskandar Puteri, Malaysia", lat: 1.42, lng: 103.63, category: "city" },
  { name: "Liberland", location: "Danube River, Croatia/Serbia", lat: 45.77, lng: 18.87, category: "city" },
  // North America
  { name: "Starbase", location: "Boca Chica, Texas", lat: 25.99, lng: -97.16, category: "city" },
  { name: "Esmeralda", location: "Healdsburg, California", lat: 38.61, lng: -122.87, category: "popup" },
  { name: "Próspera Tegucigalpa", location: "Tegucigalpa, Honduras", lat: 14.07, lng: -87.19, category: "city" },
  // Europe
  { name: "Erebor", location: "Sofia, Bulgaria", lat: 42.7, lng: 23.32, category: "popup" },
  // The originals
  { name: "Bitcoin Beach", location: "El Zonte, El Salvador", lat: 13.49, lng: -89.43, category: "city" },
  { name: "CityDAO", location: "Wyoming, USA", lat: 43.0, lng: -107.55, category: "city" },
];
