export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  basePrice: number;
  priceTrend: number;
  description: string;
  rating: number;
  reviewCount: number;
  comparisonCount: number;
  clickCount: number;
  trendingScore: number;
  searchIncrease: number;
}

export interface StorePrice {
  store: string;
  storeLogo: string;
  price: number;
  shipping: string;
  stock: string;
  deliveryTime: string;
  productUrl: string;
}

export interface ProductDetail extends Product {
  storePrices: StorePrice[];
  lastUpdated: string;
}

const STORE_LOGOS = {
  Amazon: "/assets/05663b62acb2a477e9dcc2fee8a672b7954cb852.png",
  Walmart: "/assets/4598fecf5fbe9f93f97be09ee6cf798d26181cbb.png",
  eBay: "/assets/a2e68ebf7b88687c3ba09e5e1de8fd52f3ce73c4.png",
  "Best Buy": "/assets/cac64b6d87939894c0608be1e31e50cb929b86a6.png",
  "Google Shopping": "/assets/147c5703b2d4fa146456a865901b0175f6f568e9.png",
  Etsy: "/assets/05663b62acb2a477e9dcc2fee8a672b7954cb852.png",
} as const;

const PRODUCTS_DATA: Product[] = [
  {
    id: "1",
    name: "iPhone 17 Pro Max",
    category: "Smartphones",
    image: "/assets/6fd61e1c821365606c6696500d4c409c8d0863ca.png",
    basePrice: 999,
    priceTrend: -2,
    description: "Pro camera system, titanium body, and A-series performance.",
    rating: 4.8,
    reviewCount: 12453,
    comparisonCount: 15420,
    clickCount: 8932,
    trendingScore: 85,
    searchIncrease: 12,
  },
  {
    id: "2",
    name: "PlayStation 6",
    category: "Gaming Consoles",
    image: "/assets/180cd4e71457bc18b7b1249abdbb34e596c671e0.png",
    basePrice: 599,
    priceTrend: -3,
    description: "Next-gen gaming console with ray tracing and fast storage.",
    rating: 4.7,
    reviewCount: 8120,
    comparisonCount: 10234,
    clickCount: 7311,
    trendingScore: 82,
    searchIncrease: 14,
  },
  {
    id: "3",
    name: "AirPods Pro 3",
    category: "Headphones",
    image: "/assets/f8ad1316a8680bd6f5e6c412010881b64a89d83d.png",
    basePrice: 249,
    priceTrend: -4,
    description: "Adaptive noise cancellation with all-day comfort.",
    rating: 4.7,
    reviewCount: 15632,
    comparisonCount: 18590,
    clickCount: 10234,
    trendingScore: 80,
    searchIncrease: 15,
  },
  {
    id: "4",
    name: "Samsung Galaxy S26 Ultra",
    category: "Smartphones",
    image: "/assets/5434de30ad5017ee4e904d7020470d44ca426630.png",
    basePrice: 899,
    priceTrend: -1,
    description: "Flagship Android phone with AI features and advanced optics.",
    rating: 4.6,
    reviewCount: 9876,
    comparisonCount: 9832,
    clickCount: 5621,
    trendingScore: 75,
    searchIncrease: 10,
  },
  {
    id: "5",
    name: "MacBook Pro",
    category: "Laptops",
    image: "/assets/180cd4e71457bc18b7b1249abdbb34e596c671e0.png",
    basePrice: 1199,
    priceTrend: 0,
    description: "Pro laptop for development and content workflows.",
    rating: 4.9,
    reviewCount: 7234,
    comparisonCount: 21450,
    clickCount: 12876,
    trendingScore: 95,
    searchIncrease: 18,
  },
  {
    id: "6",
    name: "Sony Bravia OLED 65\"",
    category: "TVs",
    image: "/assets/afc6860dc0881f3f5d09e6e6a6d8d88377c50f4a.png",
    basePrice: 1499,
    priceTrend: -2,
    description: "4K OLED TV with deep contrast and premium HDR rendering.",
    rating: 4.6,
    reviewCount: 5410,
    comparisonCount: 6780,
    clickCount: 3421,
    trendingScore: 70,
    searchIncrease: 8,
  },
  {
    id: "7",
    name: "Sony WH-1000XM6",
    category: "Headphones",
    image: "/assets/5eff84ef88397ec804bb8d6eaf6ef0331242f8f2.png",
    basePrice: 399,
    priceTrend: -3,
    description: "Industry-leading ANC headphones with travel-friendly battery.",
    rating: 4.8,
    reviewCount: 11234,
    comparisonCount: 14230,
    clickCount: 8543,
    trendingScore: 88,
    searchIncrease: 14,
  },
  {
    id: "8",
    name: "Apple Watch Series 11",
    category: "Wearables",
    image: "/assets/45d4b6b036346e18d06bccedaba707e095ba2ff5.png",
    basePrice: 429,
    priceTrend: -1,
    description: "Health tracking, bright display, and deep iOS integration.",
    rating: 4.7,
    reviewCount: 9854,
    comparisonCount: 11290,
    clickCount: 6732,
    trendingScore: 82,
    searchIncrease: 9,
  },
  {
    id: "9",
    name: "Canon EOS R10",
    category: "Cameras",
    image: "/assets/338e058556ec3ea6f749c3d86463df926daaee2a.png",
    basePrice: 979,
    priceTrend: -1,
    description: "Mirrorless camera with fast autofocus and 4K capture.",
    rating: 4.5,
    reviewCount: 3890,
    comparisonCount: 5820,
    clickCount: 3220,
    trendingScore: 69,
    searchIncrease: 6,
  },
  {
    id: "10",
    name: "iPad Pro",
    category: "Tablets",
    image: "/assets/338e058556ec3ea6f749c3d86463df926daaee2a.png",
    basePrice: 799,
    priceTrend: 0,
    description: "High-performance tablet for media and creative tasks.",
    rating: 4.9,
    reviewCount: 6789,
    comparisonCount: 13450,
    clickCount: 7890,
    trendingScore: 92,
    searchIncrease: 16,
  },
  {
    id: "11",
    name: "Google Nest Hub Max",
    category: "Smart Home",
    image: "/assets/a2e68ebf7b88687c3ba09e5e1de8fd52f3ce73c4.png",
    basePrice: 229,
    priceTrend: -2,
    description: "Smart display for home automation and video calls.",
    rating: 4.4,
    reviewCount: 4221,
    comparisonCount: 7410,
    clickCount: 4302,
    trendingScore: 73,
    searchIncrease: 11,
  },
  {
    id: "12",
    name: "Dyson V16 Piston Animal",
    category: "Home Appliances",
    image: "/assets/afc6860dc0881f3f5d09e6e6a6d8d88377c50f4a.png",
    basePrice: 649,
    priceTrend: 2,
    description: "Cordless vacuum with laser dust illumination.",
    rating: 4.5,
    reviewCount: 5421,
    comparisonCount: 6780,
    clickCount: 3421,
    trendingScore: 70,
    searchIncrease: 5,
  },
];

function buildStorePrices(product: Product): StorePrice[] {
  const stores: Array<{ name: keyof typeof STORE_LOGOS; delta: number; delivery: string }> = [
    { name: "Amazon", delta: 0, delivery: "1-2 days" },
    { name: "Walmart", delta: 10, delivery: "2-4 days" },
    { name: "eBay", delta: -8, delivery: "2-5 days" },
    { name: "Best Buy", delta: 18, delivery: "2-3 days" },
    { name: "Google Shopping", delta: 24, delivery: "3-5 days" },
    { name: "Etsy", delta: 30, delivery: "4-6 days" },
  ];

  return stores.map((store, idx) => {
    const price = Math.max(19, product.basePrice + store.delta);
    const shipping = idx % 2 === 0 ? "Free" : "$5.99";
    const stock = idx === 4 ? "Limited" : "In Stock";
    return {
      store: store.name,
      storeLogo: STORE_LOGOS[store.name],
      price,
      shipping,
      stock,
      deliveryTime: store.delivery,
      productUrl: `https://${store.name.toLowerCase().replace(/\s+/g, "")}.com/search?q=${encodeURIComponent(product.name)}`,
    };
  });
}

export const MOCK_PRODUCTS: Product[] = PRODUCTS_DATA;
export const PRODUCTS = MOCK_PRODUCTS;

export const PRODUCT_DETAILS: Record<string, ProductDetail> = PRODUCTS_DATA.reduce(
  (acc, product, index) => {
    acc[product.id] = {
      ...product,
      lastUpdated: `${3 + (index % 20)} mins ago`,
      storePrices: buildStorePrices(product),
    };
    return acc;
  },
  {} as Record<string, ProductDetail>,
);
