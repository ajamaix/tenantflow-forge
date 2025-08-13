package product

import (
	"backend/models"

	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Create(product *models.Product) error {
	return r.db.Create(product).Error
}

func (r *Repository) GetByTenant(tenantID int) ([]models.Product, error) {
	var products []models.Product
	err := r.db.Preload("Plans").Where("tenant_id = ?", tenantID).Find(&products).Error
	return products, err
}

func (r *Repository) GetByID(id int, tenantID int) (*models.Product, error) {
	var product models.Product
	err := r.db.Preload("Plans").Where("id = ? AND tenant_id = ?", id, tenantID).First(&product).Error
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *Repository) Update(product *models.Product) error {
	return r.db.Save(product).Error
}

func (r *Repository) Delete(id int, tenantID int) error {
	return r.db.Where("id = ? AND tenant_id = ?", id, tenantID).Delete(&models.Product{}).Error
}
