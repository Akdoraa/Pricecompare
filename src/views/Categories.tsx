"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FilterPanel } from "@/components/FilterPanel";
import { PriceComparisonCard } from "@/components/PriceComparisonCard";
import { PRODUCTS } from "@/lib/data";

const CATEGORIES = [
  { name: "Smartphones", emoji: "SP" },
  { name: "Laptops", emoji: "LP" },
  { name: "Gaming Consoles", emoji: "GC" },
  { name: "Headphones", emoji: "HP" },
  { name: "TVs", emoji: "TV" },
  { name: "Home Appliances", emoji: "HA" },
  { name: "Wearables", emoji: "WR" },
  { name: "Cameras", emoji: "CM" },
  { name: "Tablets", emoji: "TB" },
  { name: "Smart Home", emoji: "SH" },
];

export function CategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const safeSearchParams = searchParams ?? new URLSearchParams();
  const selectedCategory = safeSearchParams.get("category");

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

  const categoryProductCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const category of CATEGORIES) {
      counts[category.name] = PRODUCTS.filter((product) => product.category === category.name).length;
    }
    return counts;
  }, []);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return [];

    const filtered = PRODUCTS.filter((product) => {
      if (product.category !== selectedCategory) return false;
      if (!product.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (product.basePrice < priceRange[0] || product.basePrice > priceRange[1]) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "lowest-price":
          return a.basePrice - b.basePrice;
        case "highest-price":
          return b.basePrice - a.basePrice;
        case "most-compared":
          return b.comparisonCount - a.comparisonCount;
        default:
          return 0;
      }
    });
  }, [selectedCategory, searchTerm, priceRange, sortBy, selectedStores, inStockOnly, freeShippingOnly]);

  const setCategory = (category?: string) => {
    if (!category) {
      router.push("/categories");
      return;
    }
    const next = new URLSearchParams(safeSearchParams.toString());
    next.set("category", category);
    router.push(`/categories?${next.toString()}`);
  };

  const handleStoreToggle = (store: string) => {
    setSelectedStores((previous) =>
      previous.includes(store)
        ? previous.filter((item) => item !== store)
        : [...previous, store],
    );
  };

  return (
    <DashboardLayout searchTerm={searchTerm} onSearchChange={setSearchTerm}>
      {!selectedCategory ? (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-2">Categories</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {CATEGORIES.map((category) => (
              <button
                key={category.name}
                onClick={() => setCategory(category.name)}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all hover:border-primary/50 text-left"
              >
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 text-sm font-semibold">
                  {category.emoji}
                </div>
                <h3 className="font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {categoryProductCounts[category.name] || 0} products tracked
                </p>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm mb-6 text-muted-foreground">
            <Link href="/" className="hover:text-foreground flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <button onClick={() => setCategory()} className="hover:text-foreground">
              Categories
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{selectedCategory}</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-2">{selectedCategory}</h1>
            <p className="text-muted-foreground">{filteredProducts.length} products found</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
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

            <div className="lg:col-span-3">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <PriceComparisonCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                  <p className="text-muted-foreground">No products found in this category</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
