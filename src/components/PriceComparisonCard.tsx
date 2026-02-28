import { Link } from "react-router";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Product } from "../lib/data";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PriceComparisonCardProps {
  product: Product;
}

export function PriceComparisonCard({ product }: PriceComparisonCardProps) {
  const trendColor = product.priceTrend > 0 ? "text-red-600" : product.priceTrend < 0 ? "text-green-600" : "text-muted-foreground";
  const TrendIcon = product.priceTrend > 0 ? ArrowUp : ArrowDown;

  return (
    <Link to={`/product/${product.id}`}>
      <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-200 cursor-pointer group">
        <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {product.category}
          </p>
          
          <h3 className="text-base font-semibold text-card-foreground line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-card-foreground">
              From ${product.basePrice}
            </span>
            {product.priceTrend !== 0 && (
              <span className={`text-xs flex items-center gap-0.5 ${trendColor}`}>
                <TrendIcon className="w-3 h-3" />
                {Math.abs(product.priceTrend)}%
              </span>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Compare Prices
          </Button>
        </div>
      </div>
    </Link>
  );
}