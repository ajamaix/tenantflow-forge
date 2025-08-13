package analytics

import (
	"backend/models"
	"time"

	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetProductCount(tenantID int) (int, error) {
	var count int64
	err := r.db.Model(&models.Product{}).Where("tenant_id = ? AND active = ?", tenantID, true).Count(&count).Error
	return int(count), err
}

func (r *Repository) GetActivePlanCount(tenantID int) (int, error) {
	var count int64
	err := r.db.Model(&models.Plan{}).
		Joins("JOIN products ON plans.product_id = products.id").
		Where("plans.tenant_id = ? AND products.active = ?", tenantID, true).
		Count(&count).Error
	return int(count), err
}

func (r *Repository) GetTeamMemberCount(tenantID int) (int, error) {
	var count int64
	err := r.db.Model(&models.User{}).Where("tenant_id = ?", tenantID).Count(&count).Error
	return int(count), err
}

func (r *Repository) GetRevenueForPeriod(tenantID int, start, end time.Time) (float64, error) {
	var totalRevenue float64
	err := r.db.Model(&models.Purchase{}).
		Where("tenant_id = ? AND status = ? AND purchased_at BETWEEN ? AND ?", tenantID, "active", start, end).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&totalRevenue).Error
	return totalRevenue, err
}

func (r *Repository) GetActivePurchaseCount(tenantID int) (int, error) {
	var count int64
	err := r.db.Model(&models.Purchase{}).
		Where("tenant_id = ? AND status = ?", tenantID, "active").
		Count(&count).Error
	return int(count), err
}

func (r *Repository) GetRecentActivity(tenantID int, limit int) ([]models.Activity, error) {
	var activities []models.Activity
	err := r.db.Where("tenant_id = ?", tenantID).
		Preload("User").
		Order("created_at DESC").
		Limit(limit).
		Find(&activities).Error
	return activities, err
}
