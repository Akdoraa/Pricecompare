const ELECTRONICS_KEYWORDS = [
  "phone",
  "iphone",
  "samsung",
  "pixel",
  "laptop",
  "macbook",
  "tablet",
  "ipad",
  "headphone",
  "earbuds",
  "camera",
  "console",
  "playstation",
  "xbox",
  "nintendo",
  "watch",
  "tv",
  "monitor",
  "smart home",
  "router",
  "ssd",
  "gpu",
  "cpu",
];

export function isElectronicsQuery(query: string): boolean {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return false;
  return ELECTRONICS_KEYWORDS.some((keyword) => normalized.includes(keyword));
}
