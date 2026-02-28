"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getOrCreateSessionId } from "@/lib/client/session";

interface SavedDealState {
  productId: string;
  savedAt: number;
  priceAtSave: number;
  alert?: {
    enabled: boolean;
    targetPrice: number;
  };
}

interface SavedDealsContextValue {
  sessionId: string;
  deals: SavedDealState[];
  savedIds: Set<string>;
  isLoaded: boolean;
  toggleSaved: (productId: string) => Promise<void>;
  updateAlert: (productId: string, enabled: boolean, targetPrice: number) => Promise<void>;
}

const SavedDealsContext = createContext<SavedDealsContextValue | null>(null);

async function fetchSavedDeals(sessionId: string): Promise<SavedDealState[]> {
  const response = await fetch(`/api/saved?sessionId=${encodeURIComponent(sessionId)}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) return [];
  const payload = (await response.json()) as { deals: SavedDealState[] };
  return payload.deals ?? [];
}

export function SavedDealsProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState("");
  const [deals, setDeals] = useState<SavedDealState[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const currentSessionId = getOrCreateSessionId();
    setSessionId(currentSessionId);
    fetchSavedDeals(currentSessionId)
      .then((items) => setDeals(items))
      .finally(() => setIsLoaded(true));
  }, []);

  const savedIds = useMemo(() => new Set(deals.map((deal) => deal.productId)), [deals]);

  const toggleSaved = async (productId: string) => {
    if (!sessionId) return;
    const response = await fetch("/api/saved/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, productId }),
    });

    if (!response.ok) return;
    const payload = (await response.json()) as { deals: SavedDealState[] };
    setDeals(payload.deals ?? []);
  };

  const updateAlert = async (
    productId: string,
    enabled: boolean,
    targetPrice: number,
  ) => {
    if (!sessionId) return;
    const response = await fetch("/api/saved/alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, productId, enabled, targetPrice }),
    });
    if (!response.ok) return;
    const payload = (await response.json()) as { deals: SavedDealState[] };
    setDeals(payload.deals ?? []);
  };

  const value: SavedDealsContextValue = {
    sessionId,
    deals,
    savedIds,
    isLoaded,
    toggleSaved,
    updateAlert,
  };

  return <SavedDealsContext.Provider value={value}>{children}</SavedDealsContext.Provider>;
}

export function useSavedDeals() {
  const context = useContext(SavedDealsContext);
  if (!context) {
    throw new Error("useSavedDeals must be used inside SavedDealsProvider");
  }
  return context;
}
