// src/components/products/ProductCard.tsx
import { CategoryProduct } from '@/lib/types';
import React from 'react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: CategoryProduct; // Use a specific Product type/interface
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  return (
    <div
      className={`rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 bg-white w-[84px] h-[125px] ${className}`}
    >
      <div className="block">
        {/* Use a placeholder if no image */}
        <img
          src={product.main_image || '/placeholder-image.svg'} // Access image URL from product data
          alt={product.name}
          className="object-cover" // Adjust image size/styling
        />
      </div>
    </div>
  );
};

export default ProductCard;