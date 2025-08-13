package analytics

import (
	"time"

	"github.com/your-app/backend/models"
)

type Service interface {
	GetDashboardMetrics(tenantID int) (*models.DashboardMetrics, error)
	GetRecentActivity(tenantID int) ([]models.Activity, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetDashboardMetrics(tenantID int) (*models.DashboardMetrics, error) {
	// Get current month metrics
	now := time.Now()
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	startOfLastMonth := startOfMonth.AddDate(0, -1, 0)

	// Total products
	totalProducts, err := s.repo.GetProductCount(tenantID)
	if err != nil {
		return nil, err
	}

	// Active plans
	activePlans, err := s.repo.GetActivePlanCount(tenantID)
	if err != nil {
		return nil, err
	}

	// Team members
	teamMembers, err := s.repo.GetTeamMemberCount(tenantID)
	if err != nil {
		return nil, err
	}

	// Revenue metrics
	currentRevenue, err := s.repo.GetRevenueForPeriod(tenantID, startOfMonth, now)
	if err != nil {
		return nil, err
	}

	lastMonthRevenue, err := s.repo.GetRevenueForPeriod(tenantID, startOfLastMonth, startOfMonth)
	if err != nil {
		return nil, err
	}

	// Calculate revenue growth
	var revenueGrowth float64
	if lastMonthRevenue > 0 {
		revenueGrowth = ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
	} else if currentRevenue > 0 {
		revenueGrowth = 100 // 100% growth from 0
	}

	// Active purchases
	activePurchases, err := s.repo.GetActivePurchaseCount(tenantID)
	if err != nil {
		return nil, err
	}

	return &models.DashboardMetrics{
		TotalProducts:   totalProducts,
		ActivePlans:     activePlans,
		TeamMembers:     teamMembers,
		RevenueGrowth:   revenueGrowth,
		TotalRevenue:    currentRevenue,
		ActivePurchases: activePurchases,
	}, nil
}

func (s *service) GetRecentActivity(tenantID int) ([]models.Activity, error) {
	return s.repo.GetRecentActivity(tenantID, 10) // Get last 10 activities
}