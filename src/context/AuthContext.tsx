// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, getCurrentUser, logoutUser } from '@/api';

// Define the shape of the User object (match your backend User)
// Make sure it includes the 'role' field!
interface User {
    user: {
      id: string;
      email: string;
      first_name?: string;
      last_name?: string;
      role: 'admin' | 'employee' | 'user'; // Use your actual roles
    },
    cart: any
    // ... other relevant user fields
}

interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    // Listen for unauthorized events
    useEffect(() => {
        const handleUnauthorized = () => {
            setUser(null);
            navigate('/signin');
        };

        window.addEventListener('unauthorized', handleUnauthorized);
        return () => {
            window.removeEventListener('unauthorized', handleUnauthorized);
        };
    }, [navigate]);

    const logout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUser(null);
            navigate('/signin');
        }
    };

    // Use useMemo to prevent unnecessary re-renders
    const value = useMemo(() => ({
        user,
        setUser,
        logout
    }), [user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};