"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Grid3x3,
  Bookmark,
  Package,
  SearchCode,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/top-products", label: "Top Products", icon: Package },
  { path: "/trending", label: "Trending", icon: TrendingUp },
  { path: "/categories", label: "Categories", icon: Grid3x3 },
  { path: "/saved", label: "Saved Deals", icon: Bookmark },
  { path: "/compare", label: "Compare", icon: SearchCode },
];

interface DashboardSidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function DashboardSidebar({ onNavigate, className }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={`w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col ${className ?? ""}`}
    >
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="text-xl font-semibold text-sidebar-foreground">PriceCompare</h2>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
