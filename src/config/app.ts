// Application configuration
export const appConfig = {
  // Backend API configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085',
    timeout: 30000,
  },
  
  // Environment
  environment: import.meta.env.MODE || 'development',
  
  // Features
  features: {
    multiTenant: true,
    superAdmin: true,
  },
} as const;

export type AppConfig = typeof appConfig;