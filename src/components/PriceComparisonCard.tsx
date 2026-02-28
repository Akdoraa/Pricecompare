"use client";

import Link from "next/link";
import { ArrowDown, ArrowUp, Bookmark } from "lucide-react";
import type { Product } from "@/lib/data";
import { useSavedDeals } from "./SavedDealsProvider";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PriceComparisonCardProps {
  product: Product;
}

export function PriceComparisonCard({ product }: PriceComparisonCardProps) {
  const { savedIds, toggleSaved } = useSavedDeals();
  const isSaved = savedIds.has(product.id);
  const trendColor =
    product.priceTrend > 0
      ? "text-red-600"
      : product.priceTrend < 0
        ? "text-green-600"
        : "text-muted-foreground";
  const TrendIcon = product.priceTrend > 0 ? ArrowUp : ArrowDown;

  return (
    <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-200 group">
      <div className="relative">
        <Link href={`/product/${product.id}`}>
          <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-muted flex items-center justify-center cursor-pointer">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        </Link>

        <button
          type="button"
          aria-label={isSaved ? "Remove from saved deals" : "Save deal"}
          onClick={() => void toggleSaved(product.id)}
          className={`absolute top-3 right-3 rounded-full p-2 shadow-lg transition-colors ${
            isSaved
              ? "bg-primary text-primary-foreground"
              : "bg-card text-card-foreground hover:bg-accent"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category}</p>

        <Link href={`/product/${product.id}`}>
          <h3 className="text-base font-semibold text-card-foreground line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-card-foreground">From ${product.basePrice}</span>
          {product.priceTrend !== 0 && (
            <span className={`text-xs flex items-center gap-0.5 ${trendColor}`}>
              <TrendIcon className="w-3 h-3" />
              {Math.abs(product.priceTrend)}%
            </span>
          )}
        </div>

        <Link href={`/product/${product.id}`}>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Compare Prices
          </Button>
        </Link>
      </div>
    </div>
  );
}
