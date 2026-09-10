// example-usage.tsx

import BraceletCustomizer, {
  Product,
  CartPayload,
} from './Braceletcustomizer';

const realProduct: Product = {
  id: 'nvg-brc-0142',
  name: 'Your real product name here',
  price: 2450,
  imageUrl: '/products/nvg-brc-0142/main.jpg',
  imageAlt: 'Describe the actual bracelet photo here',
  href: '/products/nvg-brc-0142',
  availability: 'In stock',
};

export default function ProductPage() {
  function handleAddToCart(payload: CartPayload) {
    console.log('Add to cart', payload);
  }

  function handleViewDetails(product: Product) {
    console.log('Navigate to', product.href);
  }

  return (
    <BraceletCustomizer
      product={realProduct}
      customizationFee={150}
      maxEngravingLength={12}
      onAddToCart={handleAddToCart}
      onViewDetails={handleViewDetails}
    />
  );
}