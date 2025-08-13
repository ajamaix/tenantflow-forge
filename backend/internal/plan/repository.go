package plan

import (
	"backend/models"

	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewPlanRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Create(plan *models.Plan) error {
	return r.db.Create(plan).Error
}

func (r *Repository) GetByProduct(productID int, tenantID int) ([]models.Plan, error) {
	var plans []models.Plan
	err := r.db.Preload("Product").Where("product_id = ? AND tenant_id = ?", productID, tenantID).Find(&plans).Error
	return plans, err
}

func (r *Repository) GetByTenant(tenantID int) ([]models.Plan, error) {
	var plans []models.Plan
	err := r.db.Preload("Product").Where("tenant_id = ?", tenantID).Find(&plans).Error
	return plans, err
}

func (r *Repository) GetByID(id int, tenantID int) (*models.Plan, error) {
	var plan models.Plan
	err := r.db.Preload("Product").Where("id = ? AND tenant_id = ?", id, tenantID).First(&plan).Error
	if err != nil {
		return nil, err
	}
	return &plan, nil
}

func (r *Repository) Update(plan *models.Plan) error {
	return r.db.Save(plan).Error
}

func (r *Repository) Delete(id int, tenantID int) error {
	return r.db.Where("id = ? AND tenant_id = ?", id, tenantID).Delete(&models.Plan{}).Error
}
