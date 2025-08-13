// API configuration
const DEFAULT_API_PORT = '8080';
const DEFAULT_API_PROTOCOL = 'http';

// Get tenant-aware API base URL
export const getApiBaseUrl = (): string => {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // Check if we have a subdomain (tenant)
  if (parts.length > 1) {
    const tenant = parts[0];
    const domain = parts.slice(1).join('.');
    
    // For development, use localhost
    if (domain.includes('localhost') || domain.includes('127.0.0.1')) {
      return `${DEFAULT_API_PROTOCOL}://${tenant}.localhost:${DEFAULT_API_PORT}`;
    }
    
    // For production domains like tenant1.amaix.tech -> tenant1.localhost:8085
    return `${DEFAULT_API_PROTOCOL}://${tenant}.localhost:${DEFAULT_API_PORT}`;
  }
  
  // Fallback to localhost without tenant
  return `${DEFAULT_API_PROTOCOL}://localhost:${DEFAULT_API_PORT}`;
};

// Helper function to get tenant domain from hostname
export const getTenantDomain = (): string | null => {
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