package repositories

import (
	"saas-backend/internal/models"

	"gorm.io/gorm"
)

type ProductRepository interface {
	Create(product *models.Product) error
	GetByTenant(tenantID int) ([]models.Product, error)
	GetByID(id int, tenantID int) (*models.Product, error)
	Update(product *models.Product) error
	Delete(id int, tenantID int) error
}

type productRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) ProductRepository {
	return &productRepository{db: db}
}

func (r *productRepository) Create(product *models.Product) error {
	return r.db.Create(product).Error
}

func (r *productRepository) GetByTenant(tenantID int) ([]models.Product, error) {
	var products []models.Product
	err := r.db.Preload("Plans").Where("tenant_id = ?", tenantID).Find(&products).Error
	return products, err
}

func (r *productRepository) GetByID(id int, tenantID int) (*models.Product, error) {
	var product models.Product
	err := r.db.Preload("Plans").Where("id = ? AND tenant_id = ?", id, tenantID).First(&product).Error
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *productRepository) Update(product *models.Product) error {
	return r.db.Save(product).Error
}

func (r *productRepository) Delete(id int, tenantID int) error {
	return r.db.Where("id = ? AND tenant_id = ?", id, tenantID).Delete(&models.Product{}).Error
}