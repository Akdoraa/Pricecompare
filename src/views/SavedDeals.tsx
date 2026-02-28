"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Bookmark, TrendingDown, TrendingUp, X } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useSavedDeals } from "@/components/SavedDealsProvider";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/lib/data";

export function SavedDealsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { deals, toggleSaved, updateAlert } = useSavedDeals();

  const savedProducts = useMemo(() => {
    return deals
      .map((deal) => {
        const product = PRODUCTS.find((item) => item.id === deal.productId);
        if (!product) return null;
        return {
          ...product,
          savedAt: deal.savedAt,
          priceAtSave: deal.priceAtSave,
          alert: deal.alert ?? { enabled: false, targetPrice: 0 },
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [deals]);

  return (
    <DashboardLayout searchTerm={searchTerm} onSearchChange={setSearchTerm}>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Saved Deals</h1>
        <p className="text-muted-foreground">
          {savedProducts.length} {savedProducts.length === 1 ? "product" : "products"} saved
        </p>
      </div>

      {savedProducts.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No saved deals yet.</h3>
          <p className="text-muted-foreground mb-6">Bookmark a product to track it.</p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProducts.map((product) => {
            const priceChange = product.basePrice - product.priceAtSave;
            const priceChangePercent =
              product.priceAtSave > 0 ? ((priceChange / product.priceAtSave) * 100).toFixed(1) : "0.0";
            const isPriceDown = priceChange < 0;
            const savedDate = new Date(product.savedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div key={product.id} className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="relative">
                  <Link href={`/product/${product.id}`}>
                    <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => void toggleSaved(product.id)}
                    className="absolute top-3 right-3 bg-card rounded-full p-2 shadow-lg hover:bg-accent transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute top-3 left-3 bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                    <Bookmark className="w-4 h-4 fill-current" />
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{product.category}</p>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-semibold mb-2 hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mb-4 pb-4 border-b border-border">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xl font-semibold">${product.basePrice}</span>
                      {priceChange !== 0 && (
                        <span className={`text-sm ${isPriceDown ? "text-green-600" : "text-red-600"}`}>
                          {isPriceDown ? "↓" : "↑"} ${Math.abs(priceChange)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Since saved:</span>
                      {priceChange !== 0 ? (
                        <span
                          className={`flex items-center gap-1 font-medium ${
                            isPriceDown ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {isPriceDown ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                          {priceChangePercent}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">No change</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Saved {savedDate}</p>
                  </div>

                  <div className="mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={product.alert?.enabled ?? false}
                        onChange={(event) =>
                          void updateAlert(
                            product.id,
                            event.target.checked,
                            product.alert?.targetPrice ?? product.basePrice,
                          )
                        }
                        className="w-4 h-4 rounded border-border accent-primary"
                      />
                      <span className="text-sm">Notify me when price drops below</span>
                    </label>
                    {product.alert?.enabled && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">$</span>
                          <input
                            type="number"
                            value={product.alert.targetPrice}
                            onChange={(event) =>
                              void updateAlert(
                                product.id,
                                true,
                                Number.parseFloat(event.target.value || "0"),
                              )
                            }
                            className="flex-1 px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Enter price"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Link href={`/product/${product.id}`}>
                    <Button className="w-full bg-primary hover:bg-primary/90">Compare Prices</Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
