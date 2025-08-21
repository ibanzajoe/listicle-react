import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/api';

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

const AuthMiddleware = ({ children }: AuthMiddlewareProps) => {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true); // Start loading initially
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      // If we're on the signin page and have a token, try to validate it
      if (location.pathname === '/signin' && token) {
        try {
          setIsLoading(true);
          const response = await api.get('/auth/me');
          setUser(response.data);
          navigate('/');
          setIsLoading(false); // Redirect to home if token is valid
        } catch (error) {
          // If token is invalid, clear it and stay on signin page
          localStorage.removeItem('authToken');
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      // For all other routes, require authentication
      if (location.pathname !== '/signin') {
        if (!token) {
          navigate('/signin');
          setIsLoading(false);
          return;
        }

        try {
          const response = await api.get('/currentSession');
          setUser(response.data);
          setIsLoading(false);
        } catch (error) {
          localStorage.removeItem('authToken');
          setUser(null);
          navigate('/signin');
          setIsLoading(false);
        }
      }
    };

    checkAuth();
  }, [location.pathname, navigate, setUser]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If we're on the signin page and not authenticated, show the page
  if (location.pathname === '/signin' && !user) {
    return <>{children}</>;
  }

  // For protected routes, only show content if authenticated
  if (user) {
    return <>{children}</>;
  }

  // Default to showing nothing (will redirect in useEffect)
  return null;
};

export default AuthMiddleware; 