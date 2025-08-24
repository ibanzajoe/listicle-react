// src/contexts/AuthContext.tsx
import { getProductById, getProductCategories, getProductsBySearch } from '@/api';
import { useQuery } from '@tanstack/react-query';
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

export type Pagination = {
  page: number,
  itemsPerPage: number,
  search: string | null,
  sortBy: string,
  sortDesc: boolean,
  status: string,
  category_id?: string,
}

export interface Category {
  id: number;
  name: string;
  parent_id: number;
  rank: number;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface Product {
    id: string;
    name: string;
    sku: string;
    main_image: string;
    created_at: Date;
    displayed_at: Date;
    stock_status: string;
}

interface AdminProductsContextType {
    products?: Product[];
    product?: Product;
    count: number;
    categories?: Category[];
    pagination: Pagination;
    isLoading: boolean;
    isFetching: boolean;
    setProduct: React.Dispatch<React.SetStateAction<Product | null>>;
    setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
    refetch: () => void;
    refetchProduct: () => void;
}

const AdminProductsContext = createContext<AdminProductsContextType | undefined>(undefined);

interface AdminProductProviderProps {}

export const AdminProductsProvider: React.FC<AdminProductProviderProps> = () => {
    const { productId } = useParams();

    const [product, setProduct] = useState<Product | null>(null);

    const [pagination, setPagination] = useState<Pagination>({
      page: 1,
      itemsPerPage: 20,
      search: null,
      sortBy: 'displayed_at',
      sortDesc: true,
      status: 'All',
      category_id: '',
    })

    const navigate = useNavigate();

    const { data: categoriesData, refetch: refetchCategories, isFetching: isFetchingCategories, status: categoriesStatus } = useQuery<Category[]>({
      queryKey: ['categories'],
      queryFn: () => getProductCategories()
    });

    const { data, refetch, isLoading, isFetching, status } = useQuery({
      queryKey: ['products', pagination],
      queryFn: () => pagination && getProductsBySearch(pagination!),
    })

    const { data: productData, refetch: refetchProduct, isLoading: isLoadingProduct, isFetching: isFetchingProduct, status: userStatus } = useQuery({
      queryKey: ['product', productId],
      queryFn: () => productId && getProductById(productId!),
      enabled: !!productId
    })


    // Use useMemo to prevent unnecessary re-renders
    const value = useMemo(() => ({
        products: data && data.products,
        count: data && data.count || 0,
        product: productData,
        categories: categoriesData,
        pagination,
        isLoading,
        isFetching,
        setProduct,
        setPagination,
        refetch,
        refetchProduct
    }), [product, productData, status, data]);

    useEffect(() => {
      refetch();
    }, [pagination])

    useEffect(() => {
      if (productId) {
        refetchProduct();
      }
    }, [productId]);

    return (
        <AdminProductsContext.Provider value={value}>
            <Outlet />
        </AdminProductsContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAdminProduct = (): AdminProductsContextType => {
    const context = useContext(AdminProductsContext);
    if (context === undefined) {
        throw new Error('useAdminProducts must be used within an AdminProductProvider');
    }
    return context;
};