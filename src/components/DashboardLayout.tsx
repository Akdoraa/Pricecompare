"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  children: ReactNode;
}

export function DashboardLayout({
  searchTerm,
  onSearchChange,
  children,
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="sidebar-desktop fixed left-0 top-0 z-20">
        <DashboardSidebar />
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 mobile-drawer">
          <button
            type="button"
            className="absolute inset-0 overlay-backdrop"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 h-full w-64">
            <DashboardSidebar onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <DashboardHeader
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        onMenuClick={() => setMobileMenuOpen(true)}
      />

      <main className="pt-20 app-shell-main">
        <div className="max-w-[1280px] mx-auto px-4 py-8">{children}</div>
      </main>
    </div>
  );
}
