import iphone17Image from "figma:asset/6fd61e1c821365606c6696500d4c409c8d0863ca.png";
import airpodsPro3Image from "figma:asset/f8ad1316a8680bd6f5e6c412010881b64a89d83d.png";
import samsungGalaxyS26Image from "figma:asset/5434de30ad5017ee4e904d7020470d44ca426630.png";
import macbookProImage from "figma:asset/180cd4e71457bc18b7b1249abdbb34e596c671e0.png";
import dysonV16Image from "figma:asset/afc6860dc0881f3f5d09e6e6a6d8d88377c50f4a.png";
import sonyWH1000XM6Image from "figma:asset/5eff84ef88397ec804bb8d6eaf6ef0331242f8f2.png";
import appleWatchSeries11Image from "figma:asset/45d4b6b036346e18d06bccedaba707e095ba2ff5.png";
import ipadProImage from "figma:asset/338e058556ec3ea6f749c3d86463df926daaee2a.png";
import xiaomi15UltraImage from "figma:asset/3c5ee67ecaabccd88015f84b3c1434ecea92dfb8.png";

// Store logos
import amazonLogo from "figma:asset/05663b62acb2a477e9dcc2fee8a672b7954cb852.png";
import walmartLogo from "figma:asset/4598fecf5fbe9f93f97be09ee6cf798d26181cbb.png";
import ebayLogo from "figma:asset/a2e68ebf7b88687c3ba09e5e1de8fd52f3ce73c4.png";
import bestBuyLogo from "figma:asset/cac64b6d87939894c0608be1e31e50cb929b86a6.png";
import googleShoppingLogo from "figma:asset/147c5703b2d4fa146456a865901b0175f6f568e9.png";

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  basePrice: number;
  priceTrend: number; // percentage change
  description: string;
  rating: number;
  reviewCount: number;
  comparisonCount: number;
  clickCount: number;
  trendingScore: number;
  searchIncrease: number; // percentage increase in searches
}

export interface StorePrice {
  store: string;
  storeLogo: string;
  price: number;
  shipping: string;
  stock: string;
  deliveryTime: string;
}

export interface ProductDetail extends Product {
  storePrices: StorePrice[];
  lastUpdated: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "iPhone 17 Pro Max",
    category: "Smartphones",
    image: iphone17Image,
    basePrice: 999,
    priceTrend: -2,
    description: "Pro camera system. Titanium design. A17 Pro chip.",
    rating: 4.8,
    reviewCount: 12453,
    comparisonCount: 15420,
    clickCount: 8932,
    trendingScore: 85,
    searchIncrease: 12
  },
  {
    id: "3",
    name: "AirPods Pro 3",
    category: "Headphones",
    image: airpodsPro3Image,
    basePrice: 249,
    priceTrend: -4,
    description: "Active Noise Cancellation. Adaptive Audio. Personalized Spatial Audio.",
    rating: 4.7,
    reviewCount: 15632,
    comparisonCount: 18590,
    clickCount: 10234,
    trendingScore: 80,
    searchIncrease: 15
  },
  {
    id: "4",
    name: "Samsung Galaxy S26 Ultra",
    category: "Smartphones",
    image: samsungGalaxyS26Image,
    basePrice: 899,
    priceTrend: -1,
    description: "AI-powered smartphone with stunning display and camera.",
    rating: 4.6,
    reviewCount: 9876,
    comparisonCount: 9832,
    clickCount: 5621,
    trendingScore: 75,
    searchIncrease: 10
  },
  {
    id: "5",
    name: "MacBook Pro",
    category: "Laptops",
    image: macbookProImage,
    basePrice: 1199,
    priceTrend: 0,
    description: "Supercharged by M3 chip. Up to 18 hours battery life.",
    rating: 4.9,
    reviewCount: 7234,
    comparisonCount: 21450,
    clickCount: 12876,
    trendingScore: 95,
    searchIncrease: 18
  },
  {
    id: "6",
    name: "Dyson V16 Piston Animal",
    category: "Home Appliances",
    image: dysonV16Image,
    basePrice: 649,
    priceTrend: 2,
    description: "Powerful cordless vacuum with laser detection technology.",
    rating: 4.5,
    reviewCount: 5421,
    comparisonCount: 6780,
    clickCount: 3421,
    trendingScore: 70,
    searchIncrease: 5
  },
  {
    id: "7",
    name: "Sony WH-1000XM6",
    category: "Headphones",
    image: sonyWH1000XM6Image,
    basePrice: 399,
    priceTrend: -3,
    description: "Industry-leading noise cancellation with exceptional sound quality.",
    rating: 4.8,
    reviewCount: 11234,
    comparisonCount: 14230,
    clickCount: 8543,
    trendingScore: 88,
    searchIncrease: 14
  },
  {
    id: "8",
    name: "Apple Watch Series 11",
    category: "Wearables",
    image: appleWatchSeries11Image,
    basePrice: 429,
    priceTrend: -1,
    description: "Advanced health features. Bright always-on display. Carbon neutral.",
    rating: 4.7,
    reviewCount: 9854,
    comparisonCount: 11290,
    clickCount: 6732,
    trendingScore: 82,
    searchIncrease: 9
  },
  {
    id: "10",
    name: "iPad Pro",
    category: "Tablets",
    image: ipadProImage,
    basePrice: 799,
    priceTrend: 0,
    description: "M2 chip. Stunning Liquid Retina display. Apple Pencil support.",
    rating: 4.9,
    reviewCount: 6789,
    comparisonCount: 13450,
    clickCount: 7890,
    trendingScore: 92,
    searchIncrease: 16
  },
  {
    id: "11",
    name: "Xiaomi 15 Ultra",
    category: "Smartphones",
    image: xiaomi15UltraImage,
    basePrice: 799,
    priceTrend: 0,
    description: "Flagship smartphone with advanced camera and performance.",
    rating: 4.8,
    reviewCount: 5678,
    comparisonCount: 10234,
    clickCount: 4567,
    trendingScore: 85,
    searchIncrease: 10
  }
];

export const PRODUCTS = MOCK_PRODUCTS;

export const PRODUCT_DETAILS: Record<string, ProductDetail> = {
  "1": {
    ...MOCK_PRODUCTS[0],
    lastUpdated: "5 mins ago",
    storePrices: [
      { store: "Amazon", storeLogo: amazonLogo, price: 999, shipping: "Free", stock: "In Stock", deliveryTime: "1-2 days" },
      { store: "Walmart", storeLogo: walmartLogo, price: 999, shipping: "Free", stock: "In Stock", deliveryTime: "3-5 days" },
      { store: "Ebay", storeLogo: ebayLogo, price: 999, shipping: "$5.99", stock: "In Stock", deliveryTime: "1-2 days" },
      { store: "Best Buy", storeLogo: bestBuyLogo, price: 999, shipping: "Free", stock: "In Stock", deliveryTime: "2-4 days" },
      { store: "Google Shopping", storeLogo: googleShoppingLogo, price: 999, shipping: "Free", stock: "In Stock", deliveryTime: "3-5 days" }
    ]
  },
  "3": {
    ...MOCK_PRODUCTS[1],
    lastUpdated: "8 mins ago",
    storePrices: [
      { store: "Amazon", storeLogo: amazonLogo, price: 249, shipping: "Free", stock: "In Stock", deliveryTime: "1-2 days" },
      { store: "Walmart", storeLogo: walmartLogo, price: 249, shipping: "Free", stock: "In Stock", deliveryTime: "2-4 days" },
      { store: "Ebay", storeLogo: ebayLogo, price: 249, shipping: "Free", stock: "In Stock", deliveryTime: "1-2 days" },
      { store: "Best Buy", storeLogo: bestBuyLogo, price: 249, shipping: "Free", stock: "In Stock", deliveryTime: "2-3 days" },
      { store: "Google Shopping", storeLogo: googleShoppingLogo, price: 269, shipping: "Free", stock: "In Stock", deliveryTime: "3-5 days" }
    ]
  },
  "4": {
    ...MOCK_PRODUCTS[2],
    lastUpdated: "15 mins ago",
    storePrices: [
      { store: "Amazon", storeLogo: amazonLogo, price: 899, shipping: "Free", stock: "In Stock", deliveryTime: "1-2 days" },
      { store: "Walmart", storeLogo: walmartLogo, price: 899, shipping: "Free", stock: "In Stock", deliveryTime: "3-5 days" },
      { store: "Ebay", storeLogo: ebayLogo, price: 899, shipping: "Free", stock: "In Stock", deliveryTime: "1-2 days" },
      { store: "Best Buy", storeLogo: bestBuyLogo, price: 929, shipping: "Free", stock: "Limited", deliveryTime: "4-6 days" },
      { store: "Google Shopping", storeLogo: googleShoppingLogo, price: 949, shipping: "Free", stock: "In Stock", deliveryTime: "3-5 days" }
    ]
  },
  "5": {
    ...MOCK_PRODUCTS[3],
    lastUpdated: "3 mins ago",
    storePrices: [
      { store: "Amazon", storeLogo: amazonLogo, price: 1199, shipping: "Free", stock: "In Stock", deliveryTime: "1-2 days" },
      { store: "Walmart", storeLogo: walmartLogo, price: 1199, shipping: "Free", stock: "In Stock", deliveryTime: "3-5 days" },
      { store: "Ebay", storeLogo: ebayLogo, price: 1199, shipping: "Free", stock: "In Stock", deliveryTime: "1-2 days" },
      { store: "Best Buy", storeLogo: bestBuyLogo, price: 1229, shipping: "Free", stock: "In Stock", deliveryTime: "2-4 days" },
      { store: "Google Shopping", storeLogo: googleShoppingLogo, price: 1299, shipping: "Free", stock: "Limited", deliveryTime: "4-6 days" }
    ]
  },
  "6": {
    ...MOCK_PRODUCTS[4],
    lastUpdated: "20 mins ago",
    storePrices: [
      { store: "Amazon", storeLogo: amazonLogo, price: 649, shipping: "Free", stock: "In Stock", deliveryTime: "1-2 days" },
      { store: "Walmart", storeLogo: walmartLogo, price: 649, shipping: "Free", stock: "In Stock", deliveryTime: "3-5 days" },
      { store: "Ebay", storeLogo: ebayLogo, price: 649, shipping: "Free", stock: "In Stock", deliveryTime: "1-2 days" },
      { store: "Best Buy", storeLogo: bestBuyLogo, price: 679, shipping: "Free", stock: "Limited", deliveryTime: "4-6 days" },
      { store: "Google Shopping", storeLogo: googleShoppingLogo, price: 699, shipping: "Free", stock: "In Stock", deliveryTime: "3-5 days" }
    ]
  },
  "7": {
    ...MOCK_PRODUCTS[5],
    lastUpdated: "7 mins ago",
    storePrices: [
      { store: "Amazon", storeLogo: amazonLogo, price: 399, shipping: "Free", stock: "In Stock", deliveryTime: "1-2 days" },
      { store: "Walmart", storeLogo: walmartLogo, price: 399, shipping: "Free", stock: "In Stock", deliveryTime: "3-5 days" },
      { store: "Ebay", storeLogo: ebayLogo, price: 399, shipping: "Free", stock: "In Stock", deliveryTime: "1-2 days" },
      { store: "Best Buy", storeLogo: bestBuyLogo, price: 409, shipping: "Free", stock: "In Stock", deliveryTime: "2-4 days" },
      { store: "Google Shopping", storeLogo: googleShoppingLogo, price: 429, shipping: "Free", stock: "Limited", deliveryTime: "4-6 days" }
    ]
  },
  "8": {
    ...MOCK_PRODUCTS[6],
    lastUpdated: "10 mins ago",
    storePrices: [
      { store: "Amazon", storeLogo: amazonLogo, price: 429, shipping: "Free", stock: "In Stock", deliveryTime: "1-2 days" },
      { store: "Walmart", storeLogo: walmartLogo, price: 429, shipping: "Free", stock: "In Stock", deliveryTime: "3-5 days" },
      { store: "Ebay", storeLogo: ebayLogo, price: 429, shipping: "Free", stock: "In Stock", deliveryTime: "1-2 days" },
      { store: "Best Buy", storeLogo: bestBuyLogo, price: 439, shipping: "Free", stock: "In Stock", deliveryTime: "2-4 days" },
      { store: "Google Shopping", storeLogo: googleShoppingLogo, price: 459, shipping: "Free", stock: "Limited", deliveryTime: "4-6 days" }
    ]
  },
  "10": {
    ...MOCK_PRODUCTS[7],
    lastUpdated: "4 mins ago",
    storePrices: [
      { store: "Amazon", storeLogo: amazonLogo, price: 799, shipping: "Free", stock: "In Stock", deliveryTime: "1-2 days" },
      { store: "Walmart", storeLogo: walmartLogo, price: 799, shipping: "Free", stock: "In Stock", deliveryTime: "3-5 days" },
      { store: "Ebay", storeLogo: ebayLogo, price: 799, shipping: "Free", stock: "In Stock", deliveryTime: "1-2 days" },
      { store: "Best Buy", storeLogo: bestBuyLogo, price: 819, shipping: "Free", stock: "In Stock", deliveryTime: "2-4 days" },
      { store: "Google Shopping", storeLogo: googleShoppingLogo, price: 849, shipping: "Free", stock: "Limited", deliveryTime: "4-6 days" }
    ]
  },
  "11": {
    ...MOCK_PRODUCTS[8],
    lastUpdated: "6 mins ago",
    storePrices: [
      { store: "Amazon", storeLogo: amazonLogo, price: 799, shipping: "Free", stock: "In Stock", deliveryTime: "1-2 days" },
      { store: "Walmart", storeLogo: walmartLogo, price: 799, shipping: "Free", stock: "In Stock", deliveryTime: "3-5 days" },
      { store: "Ebay", storeLogo: ebayLogo, price: 799, shipping: "Free", stock: "In Stock", deliveryTime: "1-2 days" },
      { store: "Best Buy", storeLogo: bestBuyLogo, price: 819, shipping: "Free", stock: "In Stock", deliveryTime: "2-4 days" },
      { store: "Google Shopping", storeLogo: googleShoppingLogo, price: 849, shipping: "Free", stock: "Limited", deliveryTime: "4-6 days" }
    ]
  }
};