package domain

import "backend/models"

type PlanService interface {
	CreatePlan(req models.CreatePlanRequest, productID int, tenantID int) (*models.Plan, error)
	GetPlansByProduct(productID int, tenantID int) ([]models.Plan, error)
	GetPlansByTenant(tenantID int) ([]models.Plan, error)
	GetPlanByID(id int, tenantID int) (*models.Plan, error)
	UpdatePlan(id int, req models.CreatePlanRequest, tenantID int) (*models.Plan, error)
	DeletePlan(id int, tenantID int) error
}

type ProductService interface {
	CreateProduct(req models.CreateProductRequest, tenantID int) (*models.Product, error)
	GetProductsByTenant(tenantID int) ([]models.Product, error)
	GetProductByID(id int, tenantID int) (*models.Product, error)
	UpdateProduct(id int, req models.CreateProductRequest, tenantID int) (*models.Product, error)
	DeleteProduct(id int, tenantID int) error
}

type TenantService interface {
	CreateTenant(req models.CreateTenantRequest) (*models.Tenant, error)
	GetAllTenants() ([]models.Tenant, error)
	GetTenantByID(id int) (*models.Tenant, error)
	UpdateTenant(id int, req models.CreateTenantRequest) (*models.Tenant, error)
	DeleteTenant(id int) error
}

type AuthService interface {
	Login(email, password string, tenantID *int, isSuperAdmin bool) (*models.AuthResponse, error)
	Register(req models.RegisterRequest, tenantID *int) (*models.AuthResponse, error)
	HashPassword(password string) (string, error)
	ComparePassword(hashedPassword, password string) error
}

type AnalyticsService interface {
	GetDashboardMetrics(tenantID int) (*models.DashboardMetrics, error)
	GetRecentActivity(tenantID int) ([]models.Activity, error)
}

type PurchaseService interface {
	CreatePurchase(userID, tenantID int, req models.CreatePurchaseRequest) (*models.Purchase, error)
	GetUserPurchases(userID, tenantID int) ([]models.Purchase, error)
	GetPurchaseByID(id, userID, tenantID int) (*models.Purchase, error)
	GetActivePurchases(userID, tenantID int) ([]models.Purchase, error)
}
