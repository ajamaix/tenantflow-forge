import { apiRequest } from '@/config/api';

// Product API functions
export const productApi = {
  getAll: async () => {
    return await apiRequest('/api/v1/products');
  },
  
  getById: async (id: number) => {
    return await apiRequest(`/api/v1/products/${id}`);
  },
  
  create: async (data: {
    name: string;
    description: string;
    url?: string;
    image?: string;
    active?: boolean;
  }) => {
    return await apiRequest('/api/v1/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: async (id: number, data: {
    name: string;
    description: string;
    url?: string;
    image?: string;
    active?: boolean;
  }) => {
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

// Purchase API functions
export const purchaseApi = {
  create: async (data: {
    plan_id: number;
    transaction_id: string;
    payment_method: string;
  }) => {
    return await apiRequest('/api/v1/purchases', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  getUserPurchases: async () => {
    return await apiRequest('/api/v1/purchases');
  },
  
  getActivePurchases: async () => {
    return await apiRequest('/api/v1/purchases/active');
  },
  
  getById: async (id: number) => {
    return await apiRequest(`/api/v1/purchases/${id}`);
  },
};

// Analytics API functions
export const analyticsApi = {
  getDashboardMetrics: async () => {
    return await apiRequest('/api/v1/analytics/dashboard');
  },
  
  getRecentActivity: async () => {
    return await apiRequest('/api/v1/analytics/activity');
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