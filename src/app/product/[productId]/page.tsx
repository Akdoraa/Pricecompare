import { ProductDetailPage } from "@/views/ProductDetail";

interface ProductDetailRouteProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductDetailRoute({ params }: ProductDetailRouteProps) {
  const resolvedParams = await params;
  return <ProductDetailPage productId={resolvedParams.productId} />;
}
