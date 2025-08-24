// Network
type ApiResponse = {
  status: 'ok';
  results: any;
};

type ApiErrorDetail = {
  name: string;
  statusCode: number;
  message: string;
  data: { [key: string]: string };
};
type ApiError = {
  status: 'error';
  error: ApiErrorDetail;
};


interface Category {
    id: number;
    name: string;
    rank: number;
    parent_id: number;
    updated_at: Date | null;
    created_at: Date;
}

interface CategoryProductImage {
    color: string;
    type: string;
    ur: string;
}

interface CategoryProduct {
    id: number;
    name: string;
    sku: string;
    main_image: string;
    images: CategoryProductImage[];
    categories: number[];
}

interface CategoryWithProducts {
    category: Category;
    products: CategoryProduct[];
    count: number;
}

export type { ApiResponse, ApiError, Category, CategoryProduct, CategoryWithProducts }

