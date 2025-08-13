import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/config/api';

interface User {
  id: string;
  email: string;
  role: string;
  tenant_id?: number;
  tenant_name?: string;
}

interface AuthContextType {
  user: User | null;
  tenant: { id: number; name: string; domain: string } | null;
  isLoading: boolean;
  login: (email: string, password: string, isSuperAdmin?: boolean) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Real API functions
const api = {
  login: async (email: string, password: string, isSuperAdmin = false): Promise<{ user: User; token: string; tenant?: any }> => {
    const endpoint = isSuperAdmin ? '/api/super-auth/login' : '/api/v1/auth/login';
    const response = await apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    return {
      user: response.user,
      token: response.token,
      tenant: response.tenant,
    };
  },

  register: async (email: string, password: string, name: string): Promise<{ user: User; token: string; tenant: any }> => {
    const response = await apiRequest('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    
    return {
      user: response.user,
      token: response.token,
      tenant: response.tenant,
    };
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<{ id: number; name: string; domain: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored auth data on app start
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    const storedTenant = localStorage.getItem('auth_tenant');

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      if (storedTenant) {
        setTenant(JSON.parse(storedTenant));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, isSuperAdmin = false): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await api.login(email, password, isSuperAdmin);
      
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      
      setUser(response.user);
      
      if (response.tenant) {
        localStorage.setItem('auth_tenant', JSON.stringify(response.tenant));
        setTenant(response.tenant);
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      return true;
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await api.register(email, password, name);
      
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      localStorage.setItem('auth_tenant', JSON.stringify(response.tenant));
      
      setUser(response.user);
      setTenant(response.tenant);

      toast({
        title: "Registration successful",
        description: "Welcome to the platform!",
      });

      return true;
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Registration failed",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_tenant');
    setUser(null);
    setTenant(null);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const value: AuthContextType = {
    user,
    tenant,
    isLoading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};