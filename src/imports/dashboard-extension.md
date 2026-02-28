Extend the existing dashboard using the current design system and components.
Do NOT change styling, spacing system, colors, typography, or visual language.
Only define layout, structure, UX behavior, and component usage.

Create the following pages:

--------------------------------------------------
1) TOP PRODUCTS PAGE
--------------------------------------------------

Purpose:
Display the most compared and most clicked products.

Header:
- Page title: "Top Products"
- Subtitle: "Most compared products"

Controls row (reuse existing filter and dropdown components):
- Sort dropdown:
    • Most Compared (default)
    • Most Clicked
    • Biggest Price Drop
    • Trending Score
- Category filter dropdown
- Time range selector:
    • 24h
    • 7d
    • 30d

Main content:
- Responsive product grid (reuse ProductCard component)
- Each product card should display:
    • Product image
    • Product name
    • Category
    • Starting price
    • Comparison count
    • Click count
    • Compare Prices button

No new visual style. Only layout and data positioning.

--------------------------------------------------
2) TRENDING PAGE
--------------------------------------------------

Purpose:
Show products increasing in interest.

Header:
- Title: "Trending"
- Subtitle: "Products gaining attention"

Top section:
- Horizontal trending carousel (reuse ProductCard structure in larger format)
- Each card includes:
    • Product image
    • Product name
    • % increase in searches
    • Compare button

Below:
- Vertical list view
Each row includes:
    • Small product image
    • Product name
    • Category
    • 7-day trend indicator (sparkline placeholder)
    • % change
    • Lowest price
    • Compare button

Reuse existing layout system.
Do not introduce new styles.

--------------------------------------------------
3) CATEGORIES PAGE
--------------------------------------------------

Purpose:
Allow browsing by product category.

Header:
- Title: "Categories"

Main section:
- Grid of category cards (reuse card component structure)
Each card contains:
    • Category name
    • Number of tracked products

Categories to include:
    • Smartphones
    • Laptops
    • Gaming Consoles
    • Headphones
    • TVs
    • Home Appliances
    • Wearables
    • Cameras
    • Tablets
    • Smart Home

When a category is selected:
- Show filtered product grid
- Display breadcrumb navigation:
    Home > Categories > [Selected Category]
- Reuse ProductCard grid
- Filters panel should reuse existing filter components

--------------------------------------------------
4) SAVED DEALS PAGE
--------------------------------------------------

Purpose:
Display bookmarked products.

Header:
- Title: "Saved Deals"

Empty state:
- Reuse existing empty state component
- Text:
  "No saved deals yet."
  "Bookmark a product to track it."

Saved product layout:
- Reuse ProductCard
- Add:
    • Saved date
    • Price change since saved
    • Remove bookmark action
    • Compare Prices button

Optional interaction:
- Toggle: "Notify me when price drops below X"
(Use existing toggle/input components)

--------------------------------------------------
GLOBAL BEHAVIOR RULES
--------------------------------------------------

- All product cards must link to Product Detail page.
- Bookmark icon must update Saved Deals page.
- Sorting and filters should behave consistently with existing system.
- Maintain Auto Layout.
- Maintain responsiveness.
- Do not modify visual style in any way.

Deliver:
Desktop and mobile versions for each page.
Reuse all existing components wherever possible.
Only extend layout and UX structure.