"use client";

import { Menu, Search, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface DashboardHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onMenuClick?: () => void;
}

export function DashboardHeader({
  searchTerm,
  onSearchChange,
  onMenuClick,
}: DashboardHeaderProps) {
  return (
    <div className="h-20 bg-card border-b border-border fixed top-0 right-0 app-shell-header z-10">
      <div className="h-full px-4 flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onMenuClick}
          className="mobile-only"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="flex-1 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products (iPhone 15, PS5, AirPods...)"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-full pl-12 pr-4 py-6 bg-input-background border-border rounded-xl"
            />
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
          <User className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
