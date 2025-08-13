package purchase

import (
	"backend/models"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) CreatePurchase(purchase *models.Purchase) (*models.Purchase, error) {
	if err := r.db.Create(purchase).Error; err != nil {
		return nil, err
	}

	// Preload relationships
	if err := r.db.Preload("Plan.Product").Preload("User").First(purchase, purchase.ID).Error; err != nil {
		return nil, err
	}

	return purchase, nil
}

func (r *Repository) GetUserPurchases(userID, tenantID int) ([]models.Purchase, error) {
	var purchases []models.Purchase
	err := r.db.Where("user_id = ? AND tenant_id = ?", userID, tenantID).
		Preload("Plan.Product").
		Preload("User").
		Order("created_at DESC").
		Find(&purchases).Error
	return purchases, err
}

func (r *Repository) GetPurchaseByID(id, userID, tenantID int) (*models.Purchase, error) {
	var purchase models.Purchase
	err := r.db.Where("id = ? AND user_id = ? AND tenant_id = ?", id, userID, tenantID).
		Preload("Plan.Product").
		Preload("User").
		First(&purchase).Error
	return &purchase, err
}

func (r *Repository) GetActivePurchases(userID, tenantID int) ([]models.Purchase, error) {
	var purchases []models.Purchase
	err := r.db.Where("user_id = ? AND tenant_id = ? AND status = ?", userID, tenantID, "active").
		Preload("Plan.Product").
		Preload("User").
		Order("created_at DESC").
		Find(&purchases).Error
	return purchases, err
}

func (r *Repository) GetPlanByID(planID, tenantID int) (*models.Plan, error) {
	var plan models.Plan
	err := r.db.Where("id = ? AND tenant_id = ?", planID, tenantID).
		Preload("Product").
		First(&plan).Error
	return &plan, err
}

func (r *Repository) CreateActivity(activity *models.Activity) error {
	return r.db.Create(activity).Error
}
