import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Bookmark, X, TrendingDown, TrendingUp } from "lucide-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardHeader } from "../components/DashboardHeader";
import { Button } from "../components/ui/button";
import { PRODUCTS } from "../lib/data";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function SavedDeals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [savedProductIds, setSavedProductIds] = useState<string[]>(["1", "3", "5"]);
  const [priceAlerts, setPriceAlerts] = useState<Record<string, { enabled: boolean; targetPrice: number }>>({});

  const savedProducts = useMemo(() => {
    return PRODUCTS.filter(p => savedProductIds.includes(p.id)).map(product => ({
      ...product,
      savedDate: "2 days ago",
      priceAtSave: product.basePrice + (Math.random() > 0.5 ? 50 : -30),
    }));
  }, [savedProductIds]);

  const handleRemoveBookmark = (productId: string) => {
    setSavedProductIds(prev => prev.filter(id => id !== productId));
  };

  const handleTogglePriceAlert = (productId: string) => {
    setPriceAlerts(prev => ({
      ...prev,
      [productId]: {
        enabled: !prev[productId]?.enabled,
        targetPrice: prev[productId]?.targetPrice || 0
      }
    }));
  };

  const handlePriceAlertChange = (productId: string, targetPrice: number) => {
    setPriceAlerts(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        targetPrice
      }
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <main className="ml-64 pt-20">
        <div className="max-w-[1280px] mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-2">Saved Deals</h1>
            <p className="text-muted-foreground">
              {savedProducts.length} {savedProducts.length === 1 ? 'product' : 'products'} saved
            </p>
          </div>

          {savedProducts.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No saved deals yet.</h3>
              <p className="text-muted-foreground mb-6">
                Bookmark a product to track it.
              </p>
              <Link to="/">
                <Button className="bg-primary hover:bg-primary/90">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProducts.map((product) => {
                const priceChange = product.basePrice - product.priceAtSave;
                const priceChangePercent = ((priceChange / product.priceAtSave) * 100).toFixed(1);
                const isPriceDown = priceChange < 0;
                const alert = priceAlerts[product.id];

                return (
                  <div key={product.id} className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="relative">
                      <Link to={`/product/${product.id}`}>
                        <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>
                      <button
                        onClick={() => handleRemoveBookmark(product.id)}
                        className="absolute top-3 right-3 bg-card rounded-full p-2 shadow-lg hover:bg-accent transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute top-3 left-3 bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                        <Bookmark className="w-4 h-4 fill-current" />
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                        {product.category}
                      </p>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold mb-2 hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="mb-4 pb-4 border-b border-border">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-xl font-semibold">${product.basePrice}</span>
                          {priceChange !== 0 && (
                            <span className={`text-sm ${isPriceDown ? 'text-green-600' : 'text-red-600'}`}>
                              {isPriceDown ? '↓' : '↑'} ${Math.abs(priceChange)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Since saved:</span>
                          {priceChange !== 0 ? (
                            <span className={`flex items-center gap-1 font-medium ${isPriceDown ? 'text-green-600' : 'text-red-600'}`}>
                              {isPriceDown ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                              {priceChangePercent}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">No change</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Saved {product.savedDate}</p>
                      </div>

                      <div className="mb-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={alert?.enabled || false}
                            onChange={() => handleTogglePriceAlert(product.id)}
                            className="w-4 h-4 rounded border-border accent-primary"
                          />
                          <span className="text-sm">Notify me when price drops below</span>
                        </label>
                        {alert?.enabled && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">$</span>
                              <input
                                type="number"
                                value={alert.targetPrice}
                                onChange={(e) => handlePriceAlertChange(product.id, parseFloat(e.target.value))}
                                className="flex-1 px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Enter price"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <Link to={`/product/${product.id}`}>
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          Compare Prices
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}