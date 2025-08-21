// src/api/index.ts
import { User } from '@/context/AdminUsersContext';
import axios from 'axios';

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

export const getCategoryWithProducts = async (id: string) => {
  const response = await api.get(`/admin/categoryWithProducts/${id}`);

  return response.data;
}



// ... Add more API functions for update, delete, orders, users etc.

export default api; // Export the configured instance if needed elsewhere