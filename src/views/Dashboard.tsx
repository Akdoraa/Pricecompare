"use client";

import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PriceComparisonCard } from "@/components/PriceComparisonCard";
import { MOCK_PRODUCTS } from "@/lib/data";

export function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter((product) => {
      const lower = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(lower) ||
        product.category.toLowerCase().includes(lower) ||
        product.description.toLowerCase().includes(lower)
      );
    });
  }, [searchTerm]);

  return (
    <DashboardLayout searchTerm={searchTerm} onSearchChange={setSearchTerm}>
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
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <p className="text-muted-foreground">No products found matching "{searchTerm}"</p>
        </div>
      )}
    </DashboardLayout>
  );
}
