package purchase

import (
	"backend/internal/domain"
	"backend/models"
	"fmt"
	"time"
)

type Service struct {
	repo domain.PurchaseRepository
}

func NewService(repo domain.PurchaseRepository) *Service {
	return &Service{repo: repo}
}

func (s *Service) CreatePurchase(userID, tenantID int, req models.CreatePurchaseRequest) (*models.Purchase, error) {
	// Get plan details
	plan, err := s.repo.GetPlanByID(req.PlanID, tenantID)
	if err != nil {
		return nil, fmt.Errorf("plan not found: %w", err)
	}

	// Calculate expiry date based on plan interval
	var expiresAt *time.Time
	now := time.Now()
	switch plan.Interval {
	case "monthly":
		expires := now.AddDate(0, 1, 0)
		expiresAt = &expires
	case "yearly":
		expires := now.AddDate(1, 0, 0)
		expiresAt = &expires
	}

	purchase := &models.Purchase{
		UserID:        userID,
		PlanID:        req.PlanID,
		TransactionID: req.TransactionID,
		Amount:        plan.Price,
		Currency:      plan.Currency,
		Status:        "active",
		PurchasedAt:   now,
		ExpiresAt:     expiresAt,
		TenantID:      tenantID,
	}

	createdPurchase, err := s.repo.CreatePurchase(purchase)
	if err != nil {
		return nil, fmt.Errorf("failed to create purchase: %w", err)
	}

	// Create activity log
	activity := &models.Activity{
		UserID:      userID,
		TenantID:    tenantID,
		Type:        "purchase_made",
		Description: fmt.Sprintf("Purchased plan '%s' for $%.2f", plan.Name, plan.Price),
		EntityType:  "purchase",
		EntityID:    &createdPurchase.ID,
	}
	s.repo.CreateActivity(activity)

	return createdPurchase, nil
}

func (s *Service) GetUserPurchases(userID, tenantID int) ([]models.Purchase, error) {
	return s.repo.GetUserPurchases(userID, tenantID)
}

func (s *Service) GetPurchaseByID(id, userID, tenantID int) (*models.Purchase, error) {
	return s.repo.GetPurchaseByID(id, userID, tenantID)
}

func (s *Service) GetActivePurchases(userID, tenantID int) ([]models.Purchase, error) {
	return s.repo.GetActivePurchases(userID, tenantID)
}
