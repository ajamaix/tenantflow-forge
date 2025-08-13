package analytics

import (
	"time"

	"github.com/your-app/backend/models"
	"gorm.io/gorm"
)

type Repository interface {
	GetProductCount(tenantID int) (int, error)
	GetActivePlanCount(tenantID int) (int, error)
	GetTeamMemberCount(tenantID int) (int, error)
	GetRevenueForPeriod(tenantID int, start, end time.Time) (float64, error)
	GetActivePurchaseCount(tenantID int) (int, error)
	GetRecentActivity(tenantID int, limit int) ([]models.Activity, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) GetProductCount(tenantID int) (int, error) {
	var count int64
	err := r.db.Model(&models.Product{}).Where("tenant_id = ? AND active = ?", tenantID, true).Count(&count).Error
	return int(count), err
}

func (r *repository) GetActivePlanCount(tenantID int) (int, error) {
	var count int64
	err := r.db.Model(&models.Plan{}).
		Joins("JOIN products ON plans.product_id = products.id").
		Where("plans.tenant_id = ? AND products.active = ?", tenantID, true).
		Count(&count).Error
	return int(count), err
}

func (r *repository) GetTeamMemberCount(tenantID int) (int, error) {
	var count int64
	err := r.db.Model(&models.User{}).Where("tenant_id = ?", tenantID).Count(&count).Error
	return int(count), err
}

func (r *repository) GetRevenueForPeriod(tenantID int, start, end time.Time) (float64, error) {
	var totalRevenue float64
	err := r.db.Model(&models.Purchase{}).
		Where("tenant_id = ? AND status = ? AND purchased_at BETWEEN ? AND ?", tenantID, "active", start, end).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&totalRevenue).Error
	return totalRevenue, err
}

func (r *repository) GetActivePurchaseCount(tenantID int) (int, error) {
	var count int64
	err := r.db.Model(&models.Purchase{}).
		Where("tenant_id = ? AND status = ?", tenantID, "active").
		Count(&count).Error
	return int(count), err
}

func (r *repository) GetRecentActivity(tenantID int, limit int) ([]models.Activity, error) {
	var activities []models.Activity
	err := r.db.Where("tenant_id = ?", tenantID).
		Preload("User").
		Order("created_at DESC").
		Limit(limit).
		Find(&activities).Error
	return activities, err
}