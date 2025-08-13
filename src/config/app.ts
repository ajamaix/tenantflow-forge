// Application configuration
export const appConfig = {
  // Backend API configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://669ed5b71fe5.ngrok-free.app',
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