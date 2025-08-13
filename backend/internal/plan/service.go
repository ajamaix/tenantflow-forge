package plan

import (
	"backend/internal/domain"
	"backend/models"
	"errors"
)

type Service struct {
	planRepo    domain.PlanRepository
	productRepo domain.ProductRepository
}

func NewPlanService(planRepo domain.PlanRepository, productRepo domain.ProductRepository) *Service {
	return &Service{
		planRepo:    planRepo,
		productRepo: productRepo,
	}
}

func (s *Service) CreatePlan(req models.CreatePlanRequest, productID int, tenantID int) (*models.Plan, error) {
	// Verify product exists and belongs to tenant
	_, err := s.productRepo.GetByID(productID, tenantID)
	if err != nil {
		return nil, errors.New("product not found")
	}

	plan := &models.Plan{
		ProductID:   productID,
		Name:        req.Name,
		Description: req.Description,
		Price:       req.Price,
		Currency:    req.Currency,
		Interval:    req.Interval,
		Features:    models.JSONB(req.Features),
		TenantID:    tenantID,
	}

	if err := s.planRepo.Create(plan); err != nil {
		return nil, errors.New("failed to create plan")
	}

	return plan, nil
}

func (s *Service) GetPlansByProduct(productID int, tenantID int) ([]models.Plan, error) {
	// Verify product exists and belongs to tenant
	_, err := s.productRepo.GetByID(productID, tenantID)
	if err != nil {
		return nil, errors.New("product not found")
	}

	return s.planRepo.GetByProduct(productID, tenantID)
}

func (s *Service) GetPlansByTenant(tenantID int) ([]models.Plan, error) {
	return s.planRepo.GetByTenant(tenantID)
}

func (s *Service) GetPlanByID(id int, tenantID int) (*models.Plan, error) {
	plan, err := s.planRepo.GetByID(id, tenantID)
	if err != nil {
		return nil, errors.New("plan not found")
	}
	return plan, nil
}

func (s *Service) UpdatePlan(id int, req models.CreatePlanRequest, tenantID int) (*models.Plan, error) {
	plan, err := s.planRepo.GetByID(id, tenantID)
	if err != nil {
		return nil, errors.New("plan not found")
	}

	plan.Name = req.Name
	plan.Description = req.Description
	plan.Price = req.Price
	plan.Currency = req.Currency
	plan.Interval = req.Interval
	plan.Features = models.JSONB(req.Features)

	if err := s.planRepo.Update(plan); err != nil {
		return nil, errors.New("failed to update plan")
	}

	return plan, nil
}

func (s *Service) DeletePlan(id int, tenantID int) error {
	// Check if plan exists
	_, err := s.planRepo.GetByID(id, tenantID)
	if err != nil {
		return errors.New("plan not found")
	}

	return s.planRepo.Delete(id, tenantID)
}
