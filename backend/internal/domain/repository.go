package domain

import "backend/models"

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
