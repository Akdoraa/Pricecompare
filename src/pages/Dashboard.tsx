import { useState, useMemo } from "react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardHeader } from "../components/DashboardHeader";
import { PriceComparisonCard } from "../components/PriceComparisonCard";
import { MOCK_PRODUCTS } from "../lib/data";

export function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return MOCK_PRODUCTS;
    }

    return MOCK_PRODUCTS.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <DashboardHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      
      <main className="ml-64 pt-20">
        <div className="max-w-[1280px] mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-2">Top Global Products</h1>
            <p className="text-muted-foreground">
              Compare prices from multiple retailers and find the best deals
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <PriceComparisonCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No products found matching "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
