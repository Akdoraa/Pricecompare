"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Clock, Star } from "lucide-react";
import { ComparisonTable } from "@/components/ComparisonTable";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FilterPanel } from "@/components/FilterPanel";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { PRODUCT_DETAILS } from "@/lib/data";

interface ProductDetailPageProps {
  productId: string;
}

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
  const [selectedStores, setSelectedStores] = useState<string[]>([
    "Amazon",
    "Walmart",
    "eBay",
    "Best Buy",
    "Google Shopping",
    "Etsy",
  ]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [sortBy, setSortBy] = useState("lowest-price");

  const product = PRODUCT_DETAILS[productId];

  const filteredAndSortedPrices = useMemo(() => {
    if (!product) return [];

    const filtered = product.storePrices.filter((storePrice) => {
      if (storePrice.price < priceRange[0] || storePrice.price > priceRange[1]) return false;
      if (!selectedStores.includes(storePrice.store)) return false;
      if (inStockOnly && storePrice.stock !== "In Stock") return false;
      if (freeShippingOnly && storePrice.shipping !== "Free") return false;
      return true;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "lowest-price":
          return a.price - b.price;
        case "highest-price":
          return b.price - a.price;
        case "fastest-delivery":
          return parseInt(a.deliveryTime, 10) - parseInt(b.deliveryTime, 10);
        case "store-name":
          return a.store.localeCompare(b.store);
        default:
          return 0;
      }
    });
  }, [product, priceRange, selectedStores, inStockOnly, freeShippingOnly, sortBy]);

  const lowestPrice = useMemo(() => {
    if (filteredAndSortedPrices.length === 0) return null;
    return Math.min(...filteredAndSortedPrices.map((storePrice) => storePrice.price));
  }, [filteredAndSortedPrices]);

  const handleStoreToggle = (store: string) => {
    setSelectedStores((previous) =>
      previous.includes(store)
        ? previous.filter((item) => item !== store)
        : [...previous, store],
    );
  };

  if (!product) {
    return (
      <DashboardLayout searchTerm={searchTerm} onSearchChange={setSearchTerm}>
        <p className="text-muted-foreground">Product not found</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout searchTerm={searchTerm} onSearchChange={setSearchTerm}>
      <Link href="/">
        <Button variant="ghost" className="mb-6 -ml-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 lg:items-stretch">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border p-8 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{product.category}</p>
                  <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${
                          index < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Lowest Price</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-semibold text-green-600">${lowestPrice ?? product.basePrice}</span>
                    {lowestPrice && lowestPrice !== product.basePrice && (
                      <span className="text-lg text-muted-foreground line-through">${product.basePrice}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Price last updated {product.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 flex">
          <FilterPanel
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            selectedStores={selectedStores}
            onStoreToggle={handleStoreToggle}
            inStockOnly={inStockOnly}
            onInStockOnlyChange={setInStockOnly}
            freeShippingOnly={freeShippingOnly}
            onFreeShippingOnlyChange={setFreeShippingOnly}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Price Comparison</h2>
        {filteredAndSortedPrices.length > 0 ? (
          <ComparisonTable storePrices={filteredAndSortedPrices} />
        ) : (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <p className="text-muted-foreground">No stores match your current filters</p>
          </div>
        )}
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
        <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
          View Best Deal - ${lowestPrice ?? product.basePrice}
        </Button>
      </div>
    </DashboardLayout>
  );
}
