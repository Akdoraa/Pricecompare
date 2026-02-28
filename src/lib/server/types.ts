export type SourceName =
  | "amazon"
  | "walmart"
  | "ebay"
  | "etsy"
  | "bestbuy"
  | "google_shopping";

export interface ComparisonOffer {
  id: string;
  title: string;
  category: string;
  store: SourceName;
  productUrl: string;
  image?: string;
  itemPrice: number;
  shippingPrice: number;
  fees: number;
  estimatedTax: number;
  totalLandedCost: number;
  originalCurrency: string;
  displayCurrency: "USD";
  fxRate?: number;
  fxTimestamp?: string;
  availability: "in_stock" | "limited" | "unknown";
  deliveryEta: string;
  seller?: string;
  fetchedAt: string;
}

export interface SourceStatus {
  source: SourceName;
  state: "pending" | "success" | "timeout" | "error";
  latencyMs?: number;
  error?: string;
}

export interface ComparisonJob {
  requestId: string;
  sessionId: string;
  query: string;
  status: "processing" | "complete" | "partial_error" | "expired";
  results: ComparisonOffer[];
  sourceDiagnostics: SourceStatus[];
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
}

export interface SavedDeal {
  productId: string;
  savedAt: number;
  priceAtSave: number;
  alert?: {
    enabled: boolean;
    targetPrice: number;
  };
}

export interface UserContext {
  preferredBrands?: string[];
  budgetUSD?: {
    min?: number;
    max?: number;
  };
  deliveryPreference?: "cheapest" | "fastest";
  blockedSellers?: string[];
  recentQueries?: string[];
  postalCode?: string;
}

export interface CompareStartInput {
  query: string;
  sessionId: string;
  maxResults?: number;
  postalCode?: string;
  filters?: {
    brands?: string[];
    minPrice?: number;
    maxPrice?: number;
  };
}
