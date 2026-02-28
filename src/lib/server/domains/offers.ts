import type { ComparisonOffer } from "../types";

export function computeTotalLandedCost(offer: Omit<ComparisonOffer, "totalLandedCost">): number {
  return Number(
    (offer.itemPrice + offer.shippingPrice + offer.fees + offer.estimatedTax).toFixed(2),
  );
}

export function dedupeOffers(offers: ComparisonOffer[]): ComparisonOffer[] {
  const seen = new Map<string, ComparisonOffer>();
  for (const offer of offers) {
    const key = `${offer.store}:${offer.title.toLowerCase()}`;
    const existing = seen.get(key);
    if (!existing || offer.totalLandedCost < existing.totalLandedCost) {
      seen.set(key, offer);
    }
  }
  return [...seen.values()];
}

export function sortOffers(offers: ComparisonOffer[]): ComparisonOffer[] {
  return [...offers].sort((a, b) => {
    if (a.totalLandedCost !== b.totalLandedCost) {
      return a.totalLandedCost - b.totalLandedCost;
    }

    if (a.availability !== b.availability) {
      return a.availability === "in_stock" ? -1 : 1;
    }

    const aDays = parseDeliveryDays(a.deliveryEta);
    const bDays = parseDeliveryDays(b.deliveryEta);
    return aDays - bDays;
  });
}

function parseDeliveryDays(deliveryEta: string): number {
  const matches = deliveryEta.match(/\d+/g);
  if (!matches || matches.length === 0) return 99;
  return Number(matches[0]);
}
