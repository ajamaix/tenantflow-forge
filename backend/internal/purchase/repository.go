package purchase

import (
	"github.com/your-app/backend/models"
	"gorm.io/gorm"
)

type Repository interface {
	CreatePurchase(purchase *models.Purchase) (*models.Purchase, error)
	GetUserPurchases(userID, tenantID int) ([]models.Purchase, error)
	GetPurchaseByID(id, userID, tenantID int) (*models.Purchase, error)
	GetActivePurchases(userID, tenantID int) ([]models.Purchase, error)
	GetPlanByID(planID, tenantID int) (*models.Plan, error)
	CreateActivity(activity *models.Activity) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) CreatePurchase(purchase *models.Purchase) (*models.Purchase, error) {
	if err := r.db.Create(purchase).Error; err != nil {
		return nil, err
	}
	
	// Preload relationships
	if err := r.db.Preload("Plan.Product").Preload("User").First(purchase, purchase.ID).Error; err != nil {
		return nil, err
	}
	
	return purchase, nil
}

func (r *repository) GetUserPurchases(userID, tenantID int) ([]models.Purchase, error) {
	var purchases []models.Purchase
	err := r.db.Where("user_id = ? AND tenant_id = ?", userID, tenantID).
		Preload("Plan.Product").
		Preload("User").
		Order("created_at DESC").
		Find(&purchases).Error
	return purchases, err
}

func (r *repository) GetPurchaseByID(id, userID, tenantID int) (*models.Purchase, error) {
	var purchase models.Purchase
	err := r.db.Where("id = ? AND user_id = ? AND tenant_id = ?", id, userID, tenantID).
		Preload("Plan.Product").
		Preload("User").
		First(&purchase).Error
	return &purchase, err
}

func (r *repository) GetActivePurchases(userID, tenantID int) ([]models.Purchase, error) {
	var purchases []models.Purchase
	err := r.db.Where("user_id = ? AND tenant_id = ? AND status = ?", userID, tenantID, "active").
		Preload("Plan.Product").
		Preload("User").
		Order("created_at DESC").
		Find(&purchases).Error
	return purchases, err
}

func (r *repository) GetPlanByID(planID, tenantID int) (*models.Plan, error) {
	var plan models.Plan
	err := r.db.Where("id = ? AND tenant_id = ?", planID, tenantID).
		Preload("Product").
		First(&plan).Error
	return &plan, err
}

func (r *repository) CreateActivity(activity *models.Activity) error {
	return r.db.Create(activity).Error
}