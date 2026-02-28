import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface FilterPanelProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  inStockOnly: boolean;
  onInStockOnlyChange: (value: boolean) => void;
  freeShippingOnly: boolean;
  onFreeShippingOnlyChange: (value: boolean) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function FilterPanel({
  priceRange,
  onPriceRangeChange,
  inStockOnly,
  onInStockOnlyChange,
  freeShippingOnly,
  onFreeShippingOnlyChange,
  sortBy,
  onSortChange
}: FilterPanelProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-6 w-full sticky top-24">
      <div>
        <h3 className="font-semibold mb-4">Filters</h3>
      </div>

      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="bg-input-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lowest-price">Lowest Price</SelectItem>
            <SelectItem value="highest-price">Highest Price</SelectItem>
            <SelectItem value="fastest-delivery">Fastest Delivery</SelectItem>
            <SelectItem value="store-name">Store Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Price Range</Label>
        <div className="px-2">
          <Slider
            min={0}
            max={2000}
            step={50}
            value={priceRange}
            onValueChange={(value) => onPriceRangeChange(value as [number, number])}
            className="mb-3"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="in-stock">In Stock Only</Label>
          <Switch
            id="in-stock"
            checked={inStockOnly}
            onCheckedChange={onInStockOnlyChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="free-shipping">Free Shipping</Label>
          <Switch
            id="free-shipping"
            checked={freeShippingOnly}
            onCheckedChange={onFreeShippingOnlyChange}
          />
        </div>
      </div>
    </div>
  );
}