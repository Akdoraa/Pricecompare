import { useState, useMemo } from "react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardHeader } from "../components/DashboardHeader";
import { PriceComparisonCard } from "../components/PriceComparisonCard";
import { PRODUCTS } from "../lib/data";

export function TopProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("most-compared");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("7d");

  const categories = ["all", ...new Set(PRODUCTS.map(p => p.category))];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = PRODUCTS.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "most-compared":
          return b.comparisonCount - a.comparisonCount;
        case "most-clicked":
          return b.clickCount - a.clickCount;
        case "biggest-price-drop":
          return a.priceTrend - b.priceTrend;
        case "trending-score":
          return b.trendingScore - a.trendingScore;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, sortBy, categoryFilter]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <main className="ml-64 pt-20">
        <div className="max-w-[1280px] mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-2">Top Products</h1>
            <p className="text-muted-foreground">Most compared products</p>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="most-compared">Most Compared</option>
                <option value="most-clicked">Most Clicked</option>
                <option value="biggest-price-drop">Biggest Price Drop</option>
                <option value="trending-score">Trending Score</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Categories</option>
                {categories.filter(c => c !== "all").map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="24h">24 Hours</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <div key={product.id}>
                <PriceComparisonCard product={product} />
                <div className="mt-3 px-4 py-2 bg-muted rounded-lg text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Comparisons:</span>
                    <span className="font-medium">{product.comparisonCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-muted-foreground">Clicks:</span>
                    <span className="font-medium">{product.clickCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAndSortedProducts.length === 0 && (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
