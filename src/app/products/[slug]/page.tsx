import ProductDetails from "../../../components/Products/ProductDetails";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  return <ProductDetails slug={slug} />;
}
