package repositories

import (
	"saas-backend/internal/models"

	"gorm.io/gorm"
)

type TenantRepository interface {
	Create(tenant *models.Tenant) error
	GetAll() ([]models.Tenant, error)
	GetByID(id int) (*models.Tenant, error)
	GetByDomain(domain string) (*models.Tenant, error)
	Update(tenant *models.Tenant) error
	Delete(id int) error
}

type tenantRepository struct {
	db *gorm.DB
}

func NewTenantRepository(db *gorm.DB) TenantRepository {
	return &tenantRepository{db: db}
}

func (r *tenantRepository) Create(tenant *models.Tenant) error {
	return r.db.Create(tenant).Error
}

func (r *tenantRepository) GetAll() ([]models.Tenant, error) {
	var tenants []models.Tenant
	err := r.db.Preload("Users").Find(&tenants).Error
	return tenants, err
}

func (r *tenantRepository) GetByID(id int) (*models.Tenant, error) {
	var tenant models.Tenant
	err := r.db.Preload("Users").Where("id = ?", id).First(&tenant).Error
	if err != nil {
		return nil, err
	}
	return &tenant, nil
}

func (r *tenantRepository) GetByDomain(domain string) (*models.Tenant, error) {
	var tenant models.Tenant
	err := r.db.Where("tenant_domain = ?", domain).First(&tenant).Error
	if err != nil {
		return nil, err
	}
	return &tenant, nil
}

func (r *tenantRepository) Update(tenant *models.Tenant) error {
	return r.db.Save(tenant).Error
}

func (r *tenantRepository) Delete(id int) error {
	return r.db.Delete(&models.Tenant{}, id).Error
}