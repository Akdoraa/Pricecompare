We already have a SaaS-style dashboard template layout.
Modify it into a price comparison dashboard.

Goal:
Instead of analytics or admin data, the dashboard displays popular global products (like Amazon best sellers).
When clicking a product, it opens a detailed comparison view showing competitor prices from multiple stores.
Business model: referral redirects when user clicks a store link.

STYLE:
Modern SaaS dashboard.
Clean, structured, data-focused.
Think: Notion + Stripe dashboard + Google Shopping.
Neutral gray background (#F5F7FA).
Primary accent: #2563EB.
Best price badge: #16A34A.
Font: Inter.
Rounded corners: 12–16px.
Soft shadow: 0 4px 10px rgba(0,0,0,0.05).

------------------------------------
MAIN DASHBOARD (Product Grid View)
------------------------------------

Left Sidebar:
- Logo at top
- Navigation:
  - Dashboard
  - Top Products
  - Trending
  - Categories
  - Saved Deals
- Minimal icons next to each

Top Bar:
- Global search input (large, centered)
  Placeholder: "Search products (iPhone 15, PS5, AirPods...)"
- Profile avatar (top right)

Main Content:

Section title:
"Top Global Products"

Grid layout (3–4 columns desktop, responsive)

Product Card component:
- Product image (centered, clean background)
- Product name (bold)
- Small subtitle (category)
- Starting from price (e.g., "From $899")
- Price trend indicator (↑2% / ↓4%)
- Small “Compare Prices” button

Products to mock:
- iPhone 15 Pro
- PlayStation 5
- AirPods Pro
- Samsung Galaxy S24
- MacBook Air M3
- Dyson V15
- Sony WH-1000XM5
- Apple Watch Series 9
- Nintendo Switch OLED
- iPad Pro

Each card should feel premium and clean.

------------------------------------
PRODUCT DETAIL PAGE (Comparison View)
------------------------------------

Layout:
Back arrow at top.
Large product image on left.
Product info on right:
- Product title
- Short description
- Rating (stars + review count)
- Lowest price highlighted large
- "Price last updated X mins ago"

Below that:

PRICE COMPARISON TABLE CARD

Columns:
Store (logo + name)
Price (bold and largest text in row)
Shipping
Stock
Delivery time
Button

Rows:
- Amazon
- Walmart
- Best Buy
- Target
- eBay
- Newegg

Cheapest row:
- Slight green background tint
- "Best Price" badge
- CTA button stronger emphasis

CTA Button:
Primary blue: "Go to Deal"
Hover: darker blue
Small external link icon

On click:
Design a minimal redirect state:
Small loading state screen:
"Redirecting to Amazon..."
Small spinner animation
Subtext:
"We may earn a small commission at no extra cost to you."

------------------------------------
SIDEBAR FILTERS (on product page)
------------------------------------

Collapsible filter panel:
- Price range slider
- Store checkboxes
- In-stock only toggle
- Free shipping toggle
- Sort dropdown (default: Lowest Price)

------------------------------------
MOBILE VERSION
------------------------------------

- Sidebar collapses to bottom sheet filter.
- Comparison table becomes stacked cards.
- Sticky bottom button:
  "View Best Deal – $945"

------------------------------------
COMPONENTS TO CREATE
------------------------------------

- ProductCard
- ComparisonTable
- StoreRow
- PriceBadge
- FilterPanel
- PrimaryButton
- RedirectModal
- SearchBar

Use Auto Layout everywhere.
Use consistent 8px spacing system.
Max container width: 1280px.

Make everything feel trustworthy, neutral, and performance-driven.
No loud marketing banners.
This is a utility product.
