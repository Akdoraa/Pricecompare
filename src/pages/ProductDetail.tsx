import { useState, useMemo } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Star, Clock } from "lucide-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardHeader } from "../components/DashboardHeader";
import { ComparisonTable } from "../components/ComparisonTable";
import { FilterPanel } from "../components/FilterPanel";
import { PRODUCT_DETAILS } from "../lib/data";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function ProductDetail() {
  const { productId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [sortBy, setSortBy] = useState("lowest-price");

  const product = productId ? PRODUCT_DETAILS[productId] : null;

  const filteredAndSortedPrices = useMemo(() => {
    if (!product) return [];

    let filtered = product.storePrices.filter((sp) => {
      if (sp.price < priceRange[0] || sp.price > priceRange[1]) return false;
      if (inStockOnly && sp.stock !== "In Stock") return false;
      if (freeShippingOnly && sp.shipping !== "Free") return false;
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "lowest-price":
          return a.price - b.price;
        case "highest-price":
          return b.price - a.price;
        case "fastest-delivery":
          return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
        case "store-name":
          return a.store.localeCompare(b.store);
        default:
          return 0;
      }
    });

    return filtered;
  }, [product, priceRange, inStockOnly, freeShippingOnly, sortBy]);

  const lowestPrice = useMemo(() => {
    if (filteredAndSortedPrices.length === 0) return null;
    return Math.min(...filteredAndSortedPrices.map(sp => sp.price));
  }, [filteredAndSortedPrices]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardSidebar />
        <DashboardHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <main className="ml-64 pt-20">
          <div className="max-w-[1280px] mx-auto px-8 py-8">
            <p className="text-muted-foreground">Product not found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      
      <main className="ml-64 pt-20">
        <div className="max-w-[1280px] mx-auto px-8 py-8">
          <Link to="/">
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
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                        {product.category}
                      </p>
                      <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
                      <p className="text-muted-foreground">{product.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
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
                        <span className="text-3xl font-semibold text-green-600">
                          ${lowestPrice || product.basePrice}
                        </span>
                        {lowestPrice && lowestPrice !== product.basePrice && (
                          <span className="text-lg text-muted-foreground line-through">
                            ${product.basePrice}
                          </span>
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
                <p className="text-muted-foreground">
                  No stores match your current filters
                </p>
              </div>
            )}
          </div>

          {/* Mobile sticky button */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
            <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
              View Best Deal – ${lowestPrice || product.basePrice}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}