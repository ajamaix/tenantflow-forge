package repositories

import (
	"saas-backend/internal/models"

	"gorm.io/gorm"
)

type PlanRepository interface {
	Create(plan *models.Plan) error
	GetByProduct(productID int, tenantID int) ([]models.Plan, error)
	GetByTenant(tenantID int) ([]models.Plan, error)
	GetByID(id int, tenantID int) (*models.Plan, error)
	Update(plan *models.Plan) error
	Delete(id int, tenantID int) error
}

type planRepository struct {
	db *gorm.DB
}

func NewPlanRepository(db *gorm.DB) PlanRepository {
	return &planRepository{db: db}
}

func (r *planRepository) Create(plan *models.Plan) error {
	return r.db.Create(plan).Error
}

func (r *planRepository) GetByProduct(productID int, tenantID int) ([]models.Plan, error) {
	var plans []models.Plan
	err := r.db.Preload("Product").Where("product_id = ? AND tenant_id = ?", productID, tenantID).Find(&plans).Error
	return plans, err
}

func (r *planRepository) GetByTenant(tenantID int) ([]models.Plan, error) {
	var plans []models.Plan
	err := r.db.Preload("Product").Where("tenant_id = ?", tenantID).Find(&plans).Error
	return plans, err
}

func (r *planRepository) GetByID(id int, tenantID int) (*models.Plan, error) {
	var plan models.Plan
	err := r.db.Preload("Product").Where("id = ? AND tenant_id = ?", id, tenantID).First(&plan).Error
	if err != nil {
		return nil, err
	}
	return &plan, nil
}

func (r *planRepository) Update(plan *models.Plan) error {
	return r.db.Save(plan).Error
}

func (r *planRepository) Delete(id int, tenantID int) error {
	return r.db.Where("id = ? AND tenant_id = ?", id, tenantID).Delete(&models.Plan{}).Error
}