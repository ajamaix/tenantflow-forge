# Multi-Tenant SaaS Platform

A professional React frontend for a multi-tenant SaaS application built for managing products and pricing plans. This application demonstrates modern SaaS architecture with role-based access control, tenant isolation, and beautiful UI design.

## 🌟 Features

### Multi-Tenancy
- **Subdomain-based tenant routing** (e.g., `tenant123.localhost:3000`)
- **Tenant-specific data isolation**
- **Dynamic tenant detection and context**

### Authentication & Authorization
- **JWT-based authentication**
- **Role-Based Access Control (RBAC)**
- **Super Admin portal** for system management
- **Tenant portal** for business operations

### Core Functionality
- **Product Management**: Create, edit, and manage product offerings
- **Pricing Plans**: Define pricing strategies with features and billing intervals
- **Team Management**: Invite and manage team members
- **Analytics Dashboard**: Monitor business metrics and performance

### Design System
- **Professional SaaS aesthetic** inspired by Stripe, Linear, and Notion
- **Responsive design** with Tailwind CSS
- **Consistent component library** using shadcn/ui
- **Smooth animations** and micro-interactions
- **Dark/light mode support**

## 🚀 Demo Credentials

### Super Admin Portal
- **URL**: `/super-admin/login`
- **Email**: `admin@saas.com`
- **Password**: `admin123`

### Tenant Portal
- **URL**: `/login`
- **Email**: Any valid email format
- **Password**: Any password with length > 3

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/           # Reusable UI components
│   ├── Auth/            # Authentication forms
│   ├── Layout/          # Layout components
│   └── ui/              # shadcn/ui components
├── contexts/            # React Context providers
│   └── AuthContext.tsx  # Authentication state management
├── pages/               # Page components
│   ├── Dashboard.tsx    # Tenant dashboard
│   ├── SuperAdmin.tsx   # Super admin portal
│   └── Products.tsx     # Product management
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
└── App.tsx              # Main application component
```

### Key Technologies
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **Lucide React** for icons
- **React Query** for data fetching

## 🎨 Design System

### Color Palette
- **Primary**: Professional blue (`hsl(221 83% 53%)`)
- **Accent**: Purple for premium features (`hsl(259 94% 51%)`)
- **Success**: Green for positive actions (`hsl(142 76% 36%)`)
- **Warning**: Orange for attention (`hsl(38 92% 50%)`)

### Components
- **Gradient backgrounds** for premium feel
- **Card-based layouts** for content organization
- **Smooth transitions** for interaction feedback
- **Professional typography** with Inter font

## 🔐 Multi-Tenant Architecture

### Tenant Detection
```typescript
// Extract tenant from subdomain
const tenantDomain = window.location.hostname.split('.')[0];

// Map to tenant context
const tenant = {
  id: 1,
  name: 'Demo Company',
  domain: tenantDomain
};
```

### Role-Based Access
```typescript
interface User {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'user';
  tenant_id?: number;
}
```

### Route Protection
- **Public routes**: Login, Register
- **Protected routes**: Dashboard, Products, Plans
- **Super admin routes**: Tenant management, System analytics

## 🔄 Backend Integration

This frontend is designed to work with a Go backend featuring:

### API Endpoints
```
# Authentication
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/super-auth/login

# Products & Plans
GET|POST|PUT|DELETE /api/v1/products
GET|POST|PUT|DELETE /api/v1/products/:id/plans

# Super Admin
GET|POST|PUT|DELETE /api/super/tenants
```

### Multi-Tenant Middleware
- **Subdomain extraction**: Maps `tenant123.localhost` to `tenant_id`
- **Data isolation**: All queries filtered by `tenant_id`
- **JWT validation**: Role-based route protection

## 🎯 Usage

### For Tenants
1. **Access subdomain**: Navigate to `{tenant}.localhost:3000`
2. **Login/Register**: Use tenant-specific credentials
3. **Manage Products**: Create and organize product offerings
4. **Set Pricing**: Define plans with features and billing
5. **Monitor Analytics**: Track business performance

### For Super Admins
1. **Access portal**: Navigate to `/super-admin/login`
2. **Manage Tenants**: Create, edit, and monitor tenant organizations
3. **System Overview**: Monitor platform-wide metrics
4. **User Management**: Handle cross-tenant operations

## 🛠️ Development

### Local Setup
```bash
npm install
npm run dev
```

### Environment Configuration
```bash
# Backend API endpoint
VITE_API_URL=http://localhost:8080

# Enable development features
VITE_ENV=development
```

### Building for Production
```bash
npm run build
npm run preview
```

## 🔮 Future Enhancements

- **Real-time notifications** with WebSocket integration
- **Advanced analytics** with charts and reporting
- **File upload** for product images and assets
- **API documentation** integration
- **Subscription billing** with payment gateway
- **Custom domains** for tenant branding

## 📝 Notes

This is a frontend-only implementation designed to demonstrate the complete SaaS architecture. The backend API calls are currently mocked for demonstration purposes. In a production environment, replace the mock API functions in `AuthContext.tsx` with actual HTTP requests to your Go backend.

The application showcases modern React patterns, professional UI design, and comprehensive SaaS functionality that would integrate seamlessly with the specified Go backend architecture.