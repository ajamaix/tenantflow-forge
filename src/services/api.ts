// API configuration
const API_BASE_URL = 'http://localhost:8080';

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

// Product API functions
export const productApi = {
  getAll: async () => {
    return await apiRequest('/api/v1/products');
  },
  
  getById: async (id: number) => {
    return await apiRequest(`/api/v1/products/${id}`);
  },
  
  create: async (data: { name: string; description: string }) => {
    return await apiRequest('/api/v1/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: async (id: number, data: { name: string; description: string }) => {
    return await apiRequest(`/api/v1/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id: number) => {
    return await apiRequest(`/api/v1/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Plan API functions
export const planApi = {
  getByProduct: async (productId: number) => {
    return await apiRequest(`/api/v1/products/${productId}/plans`);
  },
  
  getAll: async () => {
    return await apiRequest('/api/v1/plans');
  },
  
  getById: async (id: number) => {
    return await apiRequest(`/api/v1/plans/${id}`);
  },
  
  create: async (productId: number, data: {
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: string;
    features: Record<string, any>;
  }) => {
    return await apiRequest(`/api/v1/products/${productId}/plans`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: async (id: number, data: {
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: string;
    features: Record<string, any>;
  }) => {
    return await apiRequest(`/api/v1/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id: number) => {
    return await apiRequest(`/api/v1/plans/${id}`, {
      method: 'DELETE',
    });
  },
};

// Tenant API functions (Super Admin)
export const tenantApi = {
  getAll: async () => {
    return await apiRequest('/api/super/tenants');
  },
  
  getById: async (id: number) => {
    return await apiRequest(`/api/super/tenants/${id}`);
  },
  
  create: async (data: {
    tenant_name: string;
    tenant_domain: string;
    tenant_code: string;
  }) => {
    return await apiRequest('/api/super/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: async (id: number, data: {
    tenant_name: string;
    tenant_domain: string;
    tenant_code: string;
  }) => {
    return await apiRequest(`/api/super/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id: number) => {
    return await apiRequest(`/api/super/tenants/${id}`, {
      method: 'DELETE',
    });
  },
};

export { apiRequest };