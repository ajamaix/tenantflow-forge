package domain

import (
	"backend/models"
	"time"
)

type PlanRepository interface {
	Create(plan *models.Plan) error
	GetByProduct(productID int, tenantID int) ([]models.Plan, error)
	GetByTenant(tenantID int) ([]models.Plan, error)
	GetByID(id int, tenantID int) (*models.Plan, error)
	Update(plan *models.Plan) error
	Delete(id int, tenantID int) error
}

type ProductRepository interface {
	Create(product *models.Product) error
	GetByTenant(tenantID int) ([]models.Product, error)
	GetByID(id int, tenantID int) (*models.Product, error)
	Update(product *models.Product) error
	Delete(id int, tenantID int) error
}

type TenantRepository interface {
	Create(tenant *models.Tenant) error
	GetAll() ([]models.Tenant, error)
	GetByID(id int) (*models.Tenant, error)
	GetByDomain(domain string) (*models.Tenant, error)
	Update(tenant *models.Tenant) error
	Delete(id int) error
}

type UserRepository interface {
	Create(user *models.User) error
	GetByEmail(email string) (*models.User, error)
	GetByEmailAndTenant(email string, tenantID *int) (*models.User, error)
	GetByID(id int) (*models.User, error)
	Update(user *models.User) error
	Delete(id int) error
	GetByTenant(tenantID int) ([]models.User, error)
}

type AnalyticsRepository interface {
	GetProductCount(tenantID int) (int, error)
	GetActivePlanCount(tenantID int) (int, error)
	GetTeamMemberCount(tenantID int) (int, error)
	GetRevenueForPeriod(tenantID int, start, end time.Time) (float64, error)
	GetActivePurchaseCount(tenantID int) (int, error)
	GetRecentActivity(tenantID int, limit int) ([]models.Activity, error)
}

type PurchaseRepository interface {
	CreatePurchase(purchase *models.Purchase) (*models.Purchase, error)
	GetUserPurchases(userID, tenantID int) ([]models.Purchase, error)
	GetPurchaseByID(id, userID, tenantID int) (*models.Purchase, error)
	GetActivePurchases(userID, tenantID int) ([]models.Purchase, error)
	GetPlanByID(planID, tenantID int) (*models.Plan, error)
	CreateActivity(activity *models.Activity) error
}
