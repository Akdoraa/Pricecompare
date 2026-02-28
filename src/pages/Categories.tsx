import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { ChevronRight, Home } from "lucide-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardHeader } from "../components/DashboardHeader";
import { PriceComparisonCard } from "../components/PriceComparisonCard";
import { FilterPanel } from "../components/FilterPanel";
import { PRODUCTS } from "../lib/data";

const CATEGORIES = [
  { name: "Smartphones", emoji: "📱" },
  { name: "Laptops", emoji: "💻" },
  { name: "Headphones", emoji: "🎧" },
  { name: "Home Appliances", emoji: "🏠" },
  { name: "Wearables", emoji: "⌚" },
  { name: "Tablets", emoji: "📱" }
];

export function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedStores, setSelectedStores] = useState<string[]>([
    "Amazon", "Walmart", "Best Buy", "Target", "eBay", "Newegg"
  ]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [sortBy, setSortBy] = useState("lowest-price");

  const categoryProductCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach(cat => {
      counts[cat.name] = PRODUCTS.filter(p => p.category === cat.name).length;
    });
    return counts;
  }, []);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return [];
    
    let filtered = PRODUCTS.filter(p => {
      if (p.category !== selectedCategory) return false;
      if (!p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (p.basePrice < priceRange[0] || p.basePrice > priceRange[1]) return false;
      return true;
    });

    filtered.sort((a, b) => {
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

    return filtered;
  }, [selectedCategory, searchTerm, priceRange, sortBy]);

  const handleStoreToggle = (store: string) => {
    setSelectedStores((prev) =>
      prev.includes(store)
        ? prev.filter((s) => s !== store)
        : [...prev, store]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <main className="ml-64 pt-20">
        <div className="max-w-[1280px] mx-auto px-8 py-8">
          {!selectedCategory ? (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-semibold mb-2">Categories</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSearchParams({ category: category.name })}
                    className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all hover:border-primary/50 text-left"
                  >
                    <div className="text-4xl mb-4">{category.emoji}</div>
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
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm mb-6 text-muted-foreground">
                <button
                  onClick={() => setSearchParams({})}
                  className="hover:text-foreground flex items-center gap-1"
                >
                  <Home className="w-4 h-4" />
                  Home
                </button>
                <ChevronRight className="w-4 h-4" />
                <button
                  onClick={() => setSearchParams({})}
                  className="hover:text-foreground"
                >
                  Categories
                </button>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground font-medium">{selectedCategory}</span>
              </div>

              <div className="mb-8">
                <h1 className="text-2xl font-semibold mb-2">{selectedCategory}</h1>
                <p className="text-muted-foreground">
                  {filteredProducts.length} products found
                </p>
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
                      <p className="text-muted-foreground">
                        No products found in this category
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}