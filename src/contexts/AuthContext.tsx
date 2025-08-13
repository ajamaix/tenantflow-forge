import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

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

// API configuration
const API_BASE_URL = 'https://669ed5b71fe5.ngrok-free.app/health';

// Helper function to get tenant domain from hostname
const getTenantDomain = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  return parts.length > 1 ? parts[0] : null;
};

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('auth_token');
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  
  // Add tenant domain header for tenant-specific requests
  const tenantDomain = getTenantDomain();
  if (tenantDomain && !endpoint.includes('/super')) {
    defaultHeaders['X-Tenant-Domain'] = tenantDomain;
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  
  return data;
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