package tenant

import (
	"backend/models"

	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewTenantRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Create(tenant *models.Tenant) error {
	return r.db.Create(tenant).Error
}

func (r *Repository) GetAll() ([]models.Tenant, error) {
	var tenants []models.Tenant
	err := r.db.Preload("Users").Find(&tenants).Error
	return tenants, err
}

func (r *Repository) GetByID(id int) (*models.Tenant, error) {
	var tenant models.Tenant
	err := r.db.Preload("Users").Where("id = ?", id).First(&tenant).Error
	if err != nil {
		return nil, err
	}
	return &tenant, nil
}

func (r *Repository) GetByDomain(domain string) (*models.Tenant, error) {
	var tenant models.Tenant
	err := r.db.Where("tenant_domain = ?", domain).First(&tenant).Error
	if err != nil {
		return nil, err
	}
	return &tenant, nil
}

func (r *Repository) Update(tenant *models.Tenant) error {
	return r.db.Save(tenant).Error
}

func (r *Repository) Delete(id int) error {
	return r.db.Delete(&models.Tenant{}, id).Error
}
