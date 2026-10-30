// Realistic mock mandi data — prices in ₹ per quintal
export type Market = { name: string; state: string; price: number };
export type Crop = {
  id: string;
  nameEn: string;
  nameHi: string;
  emoji: string;
  unit: string;
  markets: Market[];
  trend: number[]; // last 7 days
  yesterdayAvg: number;
};

export const CROPS: Crop[] = [
  {
    id: "wheat",
    nameEn: "Wheat",
    nameHi: "गेहूँ",
    emoji: "🌾",
    unit: "₹/quintal",
    markets: [
      { name: "Indore", state: "MP", price: 2480 },
      { name: "Karnal", state: "Haryana", price: 2530 },
      { name: "Ludhiana", state: "Punjab", price: 2510 },
      { name: "Kanpur", state: "UP", price: 2455 },
    ],
    trend: [2410, 2425, 2440, 2435, 2460, 2475, 2494],
    yesterdayAvg: 2475,
  },
  {
    id: "rice",
    nameEn: "Rice (Paddy)",
    nameHi: "धान",
    emoji: "🌾",
    unit: "₹/quintal",
    markets: [
      { name: "Raipur", state: "CG", price: 2180 },
      { name: "Karnal", state: "Haryana", price: 2240 },
      { name: "Bhubaneswar", state: "Odisha", price: 2110 },
      { name: "Patna", state: "Bihar", price: 2095 },
    ],
    trend: [2200, 2190, 2175, 2160, 2155, 2160, 2156],
    yesterdayAvg: 2160,
  },
  {
    id: "onion",
    nameEn: "Onion",
    nameHi: "प्याज़",
    emoji: "🧅",
    unit: "₹/quintal",
    markets: [
      { name: "Lasalgaon", state: "MH", price: 1820 },
      { name: "Pimpalgaon", state: "MH", price: 1780 },
      { name: "Bengaluru", state: "KA", price: 2050 },
      { name: "Delhi", state: "Delhi", price: 2200 },
    ],
    trend: [1500, 1620, 1700, 1780, 1850, 1920, 1962],
    yesterdayAvg: 1920,
  },
  {
    id: "tomato",
    nameEn: "Tomato",
    nameHi: "टमाटर",
    emoji: "🍅",
    unit: "₹/quintal",
    markets: [
      { name: "Kolar", state: "KA", price: 1450 },
      { name: "Nashik", state: "MH", price: 1380 },
      { name: "Hyderabad", state: "TS", price: 1620 },
      { name: "Pune", state: "MH", price: 1510 },
    ],
    trend: [1800, 1720, 1650, 1580, 1520, 1490, 1490],
    yesterdayAvg: 1490,
  },
  {
    id: "potato",
    nameEn: "Potato",
    nameHi: "आलू",
    emoji: "🥔",
    unit: "₹/quintal",
    markets: [
      { name: "Agra", state: "UP", price: 1180 },
      { name: "Kolkata", state: "WB", price: 1240 },
      { name: "Indore", state: "MP", price: 1150 },
      { name: "Patna", state: "Bihar", price: 1210 },
    ],
    trend: [1080, 1110, 1130, 1150, 1170, 1180, 1195],
    yesterdayAvg: 1180,
  },
  {
    id: "soybean",
    nameEn: "Soybean",
    nameHi: "सोयाबीन",
    emoji: "🫘",
    unit: "₹/quintal",
    markets: [
      { name: "Indore", state: "MP", price: 4520 },
      { name: "Latur", state: "MH", price: 4480 },
      { name: "Kota", state: "Rajasthan", price: 4555 },
    ],
    trend: [4380, 4410, 4440, 4460, 4490, 4510, 4518],
    yesterdayAvg: 4510,
  },
  {
    id: "cotton",
    nameEn: "Cotton",
    nameHi: "कपास",
    emoji: "🌿",
    unit: "₹/quintal",
    markets: [
      { name: "Rajkot", state: "Gujarat", price: 7250 },
      { name: "Adilabad", state: "TS", price: 7180 },
      { name: "Akola", state: "MH", price: 7320 },
    ],
    trend: [7100, 7120, 7150, 7180, 7200, 7240, 7250],
    yesterdayAvg: 7240,
  },
  {
    id: "maize",
    nameEn: "Maize",
    nameHi: "मक्का",
    emoji: "🌽",
    unit: "₹/quintal",
    markets: [
      { name: "Nizamabad", state: "TS", price: 2120 },
      { name: "Davangere", state: "KA", price: 2090 },
      { name: "Gulabbagh", state: "Bihar", price: 2050 },
    ],
    trend: [2000, 2020, 2040, 2060, 2080, 2095, 2087],
    yesterdayAvg: 2095,
  },
];

export function avg(c: Crop) {
  return Math.round(c.markets.reduce((s, m) => s + m.price, 0) / c.markets.length);
}
export function highest(c: Crop) {
  return c.markets.reduce((a, b) => (a.price > b.price ? a : b));
}
export function lowest(c: Crop) {
  return c.markets.reduce((a, b) => (a.price < b.price ? a : b));
}
export function trendDelta(c: Crop) {
  const first = c.trend[0];
  const last = c.trend[c.trend.length - 1];
  return ((last - first) / first) * 100;
}
