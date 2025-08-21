// src/contexts/AuthContext.tsx
import { getUserById, searchUsers } from '@/api';
import { useQuery } from '@tanstack/react-query';
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

export type Pagination = {
  page: number,
  itemsPerPage: number,
  search: string | null,
  sortBy: string,
  sortDesc: boolean,
  status: string
}

export interface User {
    id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    created_at?: Date;
    address?: string;
    address2?: string;
    city?: string;
    state?: string;
    country?: string;
    company?: string;
    zip?: string;
    phone?: string;
    username?: string;
    seller_permit?: string;
    seller_permit_files?: Array<string>;
    status?: string;
    role?: string;
    shipping_address?: string;
    shipping_address2?: string;
    shipping_city?: string;
    shipping_country?: string;
    shipping_first_name?: string;
    shipping_last_name?: string;
    shipping_phone?: string;
    shipping_state?: string;
    shipping_zip?: string;
}

export interface Order {
  id: string;
}

interface AdminUsersContextType {
    users: User[] | null;
    user: User | null;
    count: number;
    pagination: Pagination;
    usersStatus: string;
    userStatus: string;
    isFetching: boolean;
    isFetchingUser: boolean;
    userOrders: Order[];
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
    refetch: () => void;
    refetchUser: () => void;
}

const AdminUsersContext = createContext<AdminUsersContextType | undefined>(undefined);

interface AdminUsersProviderProps {}

export const AdminUsersProvider: React.FC<AdminUsersProviderProps> = () => {
    const { userId } = useParams();

    const [user, setUser] = useState<User | null>(null);

    const [pagination, setPagination] = useState<Pagination>({
      page: 1,
      itemsPerPage: 20,
      search: null,
      sortBy: 'created_at',
      sortDesc: true,
      status: 'All'
    })

    const navigate = useNavigate();

    const { data, refetch, isLoading, isFetching, status } = useQuery({
      queryKey: ['users', pagination],
      queryFn: () => pagination && searchUsers(pagination!),
    })

    const { data: userData, refetch: refetchUser, isLoading: isLoadingUser, isFetching: isFetchingUser, status: userStatus } = useQuery({
      queryKey: ['user', userId],
      queryFn: () => userId && getUserById(userId!),
      enabled: !!userId
    })


    // Use useMemo to prevent unnecessary re-renders
    const value = useMemo(() => ({
        user: userData ? userData.user : null,
        userOrders: userData ? userData.userOrders : null,
        users: data ? data.users : [],
        count: data ? data.count : 0,
        pagination,
        isFetching: isLoading,
        isFetchingUser,
        usersStatus: status,
        userStatus,
        setPagination,
        setUser,
        refetch,
        refetchUser
    }), [user, userData, status, data]);

    useEffect(() => {
      refetch();
    }, [pagination])

    useEffect(() => {
      if (userId) {
        refetchUser();
      }
    }, [userId]);

    return (
        <AdminUsersContext.Provider value={value}>
            <Outlet />
        </AdminUsersContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAdminUsers = (): AdminUsersContextType => {
    const context = useContext(AdminUsersContext);
    if (context === undefined) {
        throw new Error('useAdminUsers must be used within an AdminUserProvider');
    }
    return context;
};