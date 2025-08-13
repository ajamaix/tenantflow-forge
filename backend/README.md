# SaaS Backend - Go Fiber Multi-Tenant Platform

A complete Go backend implementation for a multi-tenant SaaS platform with clean architecture, JWT authentication, and comprehensive API endpoints.

## 🚀 Features

- **Multi-Tenant Architecture** with subdomain-based routing
- **JWT Authentication** with role-based access control (RBAC)
- **Clean Architecture** (Controller-Service-Repository pattern)
- **PostgreSQL** database with GORM ORM
- **Email Service** with SMTP support
- **Super Admin Portal** for system management
- **RESTful APIs** for products, plans, and tenant management

## 📋 Prerequisites

- Go 1.21+
- PostgreSQL 12+
- SMTP server (for email functionality)

## 🛠 Installation

1. **Clone and setup**:
```bash
cd backend
go mod tidy
```

2. **Database setup**:
```bash
createdb saas_db
```

3. **Environment variables** (create `.env` file):
```env
DATABASE_URL=postgres://user:password@localhost:5432/saas_db?sslmode=disable
JWT_SECRET=your-jwt-secret-key
SUPER_JWT_SECRET=your-super-jwt-secret-key
PORT=8080
USE_DUMMY_DATA=true
SEND_REAL_EMAIL=false
SMTP_HOST=localhost
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

4. **Run the application**:
```bash
go run main.go
```

## 🏗 Architecture

```
internal/
├── app/              # Application initialization and routing
├── config/           # Configuration management
├── database/         # Database connection and migrations
├── handlers/         # HTTP request handlers (Controllers)
├── middleware/       # HTTP middleware (Auth, Tenant, CORS)
├── models/           # Data models and DTOs
├── repositories/     # Data access layer
├── services/         # Business logic layer
└── utils/           # Utility functions (email, validation)
```

## 🔐 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Tenant user login
- `POST /api/v1/auth/register` - User registration
- `POST /api/super-auth/login` - Super admin login

### Products (Tenant-scoped)
- `GET /api/v1/products` - List products
- `POST /api/v1/products` - Create product
- `GET /api/v1/products/:id` - Get product details

### Plans (Tenant-scoped)
- `GET /api/v1/plans` - List pricing plans
- `POST /api/v1/products/:product_id/plans` - Create plan

### Super Admin
- `GET /api/super/tenants` - List all tenants
- `POST /api/super/tenants` - Create tenant
- `PUT /api/super/tenants/:id` - Update tenant
- `DELETE /api/super/tenants/:id` - Delete tenant

## 🔄 Multi-Tenancy

The system uses subdomain-based tenant isolation:

- **Tenant Portal**: `tenant123.localhost:8080`
- **Super Admin**: Direct API access without subdomain
- **Data Isolation**: All tenant data filtered by `tenant_id`

## 📊 Database Schema

Key tables:
- `tenants` - Tenant organizations
- `users` - User accounts with tenant association
- `products` - Tenant-specific products
- `plans` - Pricing plans for products
- `roles` & `permissions` - RBAC system

## 🧪 Testing

Run tests:
```bash
go test ./...
```

## 🚀 Deployment

Build for production:
```bash
go build -o saas-backend main.go
./saas-backend
```

## 📝 Demo Data

With `USE_DUMMY_DATA=true`, the system creates:
- Super admin: `admin@saas.com` / `password123`
- Demo tenants with sample products and plans
- RBAC roles and permissions

## 🔧 Configuration

All configuration is environment-based. Key settings:
- Database connection
- JWT secrets (separate for tenant and super admin)
- Email settings (real SMTP or logging)
- Dummy data seeding

This backend integrates seamlessly with the React frontend and provides a complete multi-tenant SaaS foundation.