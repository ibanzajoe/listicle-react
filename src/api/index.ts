// src/api/index.ts
import { User } from '@/context/AdminUsersContext';
import { AxiosError, Method as AxiosMethod, AxiosProgressEvent, AxiosResponse } from 'axios';
import { ApiError, ApiResponse, CategoryWithProducts } from '@/lib/types';
import axios from 'axios';
import { get, pick } from 'lodash';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false, // Send cookies if backend uses them for session/auth
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to include auth token if using Bearer tokens
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and trigger logout
            localStorage.removeItem('authToken');
            // Dispatch a custom event that can be listened to by the auth context
            window.dispatchEvent(new Event('unauthorized'));
        }
        return Promise.reject(error);
    }
);

type requestParams = {
  method: AxiosMethod;
  path: string;
  body?: Record<string, any>;
  params?: Record<string, any>;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
};

function handleError(err: any): ApiError {
  if(import.meta.env.MODE !== 'production') {
    console.error(err);
  }
  if(err instanceof AxiosError) {
    return {
      status: 'error',
      error: {
        name: 'ApiError',
        statusCode: err.status ?? 500,
        message: err.response?.data?.message || err.message,
        data: pick(get(err, 'response.data'), ['message', 'error', 'details']),
      },
    }
  }

  if (err.error?.statusCode && err.error?.name) {
    return {
      status: 'error',
      error: {
        name: err.error.name,
        statusCode: err.error.statusCode,
        message: err.error.message,
        data: err,
      },
    }
  }

  return {
    status: 'error',
    error: {
      name: 'NetworkError',
      statusCode: 500,
      message: `Could not connect to studyOS server. The server may have crashed or be running on an incorrect host and port configuration.`,
      data: err,
    },
  };
}

export async function apiHandler<T extends ApiResponse['results']>({
    method,
    path,
    body,
    params,
    onUploadProgress
}: requestParams): Promise<T> {
    try {
        const url = `${path}`;

        const result = await api.request({
            method,
            url,
            data: body,
            params,
            onUploadProgress
        });

        return result.data;
    } catch (error) {
        throw handleError(error);
    }
}

// --- Product API Calls ---
export const fetchProducts = async () => {
    const response = await api.get('/products');
    return response.data; // Assuming backend sends array of products
};

export const fetchProductBySlug = async (slug: string) => {
    if (!slug) throw new Error("Slug is required");
    const response = await api.get(`/products/${slug}`);
    return response.data; // Assuming backend sends single product object
};

// --- Auth API Calls ---
export const loginUser = async (credentials: { email: string; password: string }) => {
    const response = await api.post('/login', credentials);
    if (response.data.accessToken) {
        localStorage.setItem('authToken', response.data.accessToken);
    }
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export const logoutUser = async () => {
    try {
        await api.post('/auth/logout');
    } finally {
        localStorage.removeItem('authToken');
    }
};

// --- Order API Calls ---
export const placeOrder = async (orderDetails: any) => {
    const response = await api.post('/orders', orderDetails);
    return response.data;
};

// --- Admin API Calls ---
export const fetchAdminProducts = async () => {
    const response = await api.get('/admin/products'); // Needs admin auth
    return response.data;
};

export const createAdminProduct = async (productData: any) => {
    const response = await api.post('/admin/products', productData); // Needs admin auth
    return response.data;
};

// ... GET USERS ... //

export const searchUsers = async (pagination: {
  search: string | null;
  page: number;
  itemsPerPage: number;
  sortBy: string;
  sortDesc: boolean;
  status: string;
}) => {
  const response = await api.post('/admin/users/bySearch', { pagination });
  return response.data;
};

export const getUserById = async (userId: string) => {
  const response = await api.post(`/admin/users/byId/${userId}`)

  return response.data
}

export const updateUserById = async (user: User) => {
  const response = await api.post(`/admin/users/update/${user.id}`, { user })

  return response.data;
}


// Categories //
export const getCategories = async () => {
  const response = await api.get(`/admin/categories`);

  return response.data;
}

export const getCategoryWithProducts = async (id: string, pagination: {
    page: number;
    itemsPerPage: number;
    sortBy: string;
    sortDesc: boolean;
}): Promise<CategoryWithProducts> => {
  return await apiHandler<CategoryWithProducts>({
    method: 'POST',
    path: `/admin/categoryWithProducts/${id}`,
    body: pagination
  });
}

export const removeItemsFromCategory = async (id: string | number, items: any): Promise<any> => {
    return await apiHandler<any>({
        method: 'POST',
        path: `/admin/removeItemsToCategory/${id}`,
        body: { items }
    })
}


export const addItemsToCategory = async (id: string | number, items: any): Promise<any> => {
    return await apiHandler<any>({
        method: 'POST',
        path: `/admin/addItemsToCategory/${id}`,
        body: { items }
    })
}

// EMPLOYEES

export const getEmployees = async () => {
    return await apiHandler<User[]>({
        method: 'GET',
        path: '/admin/employees/getAll',
    })
}

export const getEmployeeById = async (id: string) => {
    return await apiHandler<User>({
        method: 'GET',
        path: `/admin/employees/byId/${id}`,
    })
}

export const saveEmployee = async ({type, id, name, status}: {
    type: string;
    id: string;
    name: string;
    status: string;
}) => {
    return await apiHandler<User>({
        method: 'POST',
        path: `/admin/employees/save`,
        body: { type, id, name, status }
    })
}



// ... Add more API functions for update, delete, orders, users etc.

export default api; // Export the configured instance if needed elsewhere