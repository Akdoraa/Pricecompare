import { useState, useMemo } from "react";
import { Link } from "react-router";
import { TrendingUp } from "lucide-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardHeader } from "../components/DashboardHeader";
import { Button } from "../components/ui/button";
import { PRODUCTS } from "../lib/data";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Trending() {
  const [searchTerm, setSearchTerm] = useState("");

  const trendingProducts = useMemo(() => {
    return PRODUCTS.filter(p => p.searchIncrease > 0).sort((a, b) => b.searchIncrease - a.searchIncrease);
  }, []);

  const topTrending = trendingProducts.slice(0, 3);
  const allTrending = trendingProducts;

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <main className="ml-64 pt-20">
        <div className="max-w-[1280px] mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-2">Trending</h1>
            <p className="text-muted-foreground">Products gaining attention</p>
          </div>

          {/* Top Trending Carousel Section */}
          <div className="mb-12">
            <h2 className="text-lg font-semibold mb-4">Top Trending Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topTrending.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`}>
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
                        <span className="text-green-600 font-semibold">
                          +{product.searchIncrease}% searches
                        </span>
                      </div>
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        Compare Prices
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Vertical List View */}
          <div>
            <h2 className="text-lg font-semibold mb-4">All Trending Products</h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="divide-y divide-border">
                {allTrending.map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`}>
                    <div className="flex items-center gap-6 p-6 hover:bg-accent transition-colors cursor-pointer">
                      <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 truncate">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-24 h-8 bg-muted rounded flex items-end gap-0.5 px-2">
                          {[40, 55, 45, 70, 60, 85, 95].map((height, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-green-600 rounded-t-sm"
                              style={{ height: `${height}%` }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 font-semibold w-16 text-right">
                          +{product.searchIncrease}%
                        </span>
                      </div>

                      <div className="flex-shrink-0 w-28 text-right">
                        <div className="text-sm text-muted-foreground mb-1">From</div>
                        <div className="font-semibold">${product.basePrice}</div>
                      </div>

                      <Button className="flex-shrink-0 bg-primary hover:bg-primary/90">
                        Compare
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {allTrending.length === 0 && (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <p className="text-muted-foreground">No trending products at the moment</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}