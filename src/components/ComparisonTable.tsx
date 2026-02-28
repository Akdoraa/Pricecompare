import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { StorePrice } from "../lib/data";
import { Button } from "./ui/button";
import { RedirectModal } from "./RedirectModal";

interface ComparisonTableProps {
  storePrices: StorePrice[];
}

export function ComparisonTable({ storePrices }: ComparisonTableProps) {
  const [redirectState, setRedirectState] = useState<{ store: string; url: string } | null>(null);
  
  // Find the lowest price
  const lowestPrice = Math.min(...storePrices.map(sp => sp.price));

  const handleDealClick = (store: string, url: string) => {
    setRedirectState({ store, url });
  };

  return (
    <>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Store</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Price</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Shipping</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Stock</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Delivery</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {storePrices.map((storePrice, index) => {
                const isBestPrice = storePrice.price === lowestPrice;
                
                return (
                  <tr
                    key={index}
                    className={`border-b border-border last:border-0 ${
                      isBestPrice ? "bg-green-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={storePrice.storeLogo} alt={storePrice.store} className="h-8 w-auto object-contain" />
                        {isBestPrice && (
                          <span
                            className="inline-block px-2 py-0.5 text-white text-xs rounded"
                            style={{ backgroundColor: "#16A34A" }}
                          >
                            Best Price
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-semibold text-card-foreground">
                        ${storePrice.price}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-card-foreground">
                      {storePrice.shipping}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`${
                        storePrice.stock === "In Stock"
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}>
                        {storePrice.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-card-foreground">
                      {storePrice.deliveryTime}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        onClick={() => handleDealClick(storePrice.store, storePrice.productUrl)}
                        className={`${
                          isBestPrice
                            ? "bg-primary hover:bg-primary/90"
                            : "bg-primary/80 hover:bg-primary"
                        }`}
                      >
                        Go to Deal
                        <ExternalLink className="ml-2 w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <RedirectModal
        store={redirectState?.store ?? null}
        url={redirectState?.url ?? null}
        onClose={() => setRedirectState(null)}
      />
    </>
  );
}
