"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { PRODUCTS } from "@/lib/data";

export function TrendingPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const trendingProducts = useMemo(
    () =>
      PRODUCTS.filter((product) => product.searchIncrease > 0).sort(
        (a, b) => b.searchIncrease - a.searchIncrease,
      ),
    [],
  );

  const topTrending = trendingProducts.slice(0, 8);

  return (
    <DashboardLayout searchTerm={searchTerm} onSearchChange={setSearchTerm}>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Trending</h1>
        <p className="text-muted-foreground">Products gaining attention</p>
      </div>

      <div className="mb-12">
        <h2 className="text-lg font-semibold mb-4">Top Trending Now</h2>
        <div className="trending-scroll">
          {topTrending.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="trending-scroll-card">
              <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    {product.category}
                  </p>
                  <h3 className="font-semibold mb-3 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-semibold">+{product.searchIncrease}% searches</span>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90">Compare Prices</Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">All Trending Products</h2>
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {trendingProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="flex flex-wrap items-center gap-4 p-6 hover:bg-accent transition-colors cursor-pointer">
                  <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold mb-1 truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>

                  <div className="w-24 h-8 bg-muted rounded flex items-end gap-0.5 px-2">
                    {[40, 55, 45, 70, 60, 85, 95].map((height, index) => (
                      <div
                        key={index}
                        className="flex-1 bg-green-600 rounded-t-sm"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-semibold w-16 text-right">
                      +{product.searchIncrease}%
                    </span>
                  </div>

                  <div className="w-28 text-right">
                    <div className="text-sm text-muted-foreground mb-1">From</div>
                    <div className="font-semibold">${product.basePrice}</div>
                  </div>

                  <Button className="bg-primary hover:bg-primary/90">Compare</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
