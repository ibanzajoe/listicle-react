// src/components/products/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types'; // Define your Product type

interface ProductCardProps {
  product: Product; // Use a specific Product type/interface
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const displayPrice = product.onSale ? product.salePrice : product.price;
  const originalPrice = product.onSale ? product.price : null;

  // Helper to format price (implement this in utils)
  const formatCurrency = (amount: number | null | undefined) => {
      if (amount === null || amount === undefined) return '';
      // Basic formatting, consider using Intl.NumberFormat for better localization
      return `$${(amount / 100).toFixed(2)}`; // Assuming price is in cents
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 bg-white">
      <Link to={`/products/${product.slug}`} className="block">
        {/* Use a placeholder if no image */}
        <img
          src={product.primary_image_url || '/placeholder-image.svg'} // Access image URL from product data
          alt={product.name}
          className="w-full h-48 object-cover" // Adjust image size/styling
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 truncate">{product.name}</h3>
          <div className="flex items-baseline gap-2">
             <p className={`text-xl font-bold ${product.onSale ? 'text-red-600' : 'text-gray-800'}`}>
                 {formatCurrency(displayPrice)}
             </p>
             {originalPrice && (
                 <p className="text-sm text-gray-500 line-through">
                     {formatCurrency(originalPrice)}
                 </p>
             )}
           </div>
          {/* Add more details like rating or quick add button if needed */}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;