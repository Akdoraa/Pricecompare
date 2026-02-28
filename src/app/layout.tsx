import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { SavedDealsProvider } from "@/components/SavedDealsProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PriceCompare",
  description: "Electronics price comparison dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <SavedDealsProvider>{children}</SavedDealsProvider>
      </body>
    </html>
  );
}
