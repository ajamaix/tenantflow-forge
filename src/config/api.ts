import { appConfig } from './app';

// Get API base URL from config
export const getApiBaseUrl = (): string => {
  return appConfig.api.baseUrl;
};

// Helper function to get tenant ID from hostname
export const getTenantId = (): string | null => {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  return parts.length > 1 ? parts[0] : null;
};

// API request helper
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${getApiBaseUrl()}${endpoint}`;
  const token = localStorage.getItem('auth_token');
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  
  // Add tenant ID header for tenant-specific requests
  const tenantId = getTenantId();
  if (tenantId && !endpoint.includes('/super')) {
    defaultHeaders['X-Tenant-ID'] = tenantId;
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