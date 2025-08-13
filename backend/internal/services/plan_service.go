package services

import (
	"errors"

	"saas-backend/internal/models"
	"saas-backend/internal/repositories"
)

type PlanService interface {
	CreatePlan(req models.CreatePlanRequest, productID int, tenantID int) (*models.Plan, error)
	GetPlansByProduct(productID int, tenantID int) ([]models.Plan, error)
	GetPlansByTenant(tenantID int) ([]models.Plan, error)
	GetPlanByID(id int, tenantID int) (*models.Plan, error)
	UpdatePlan(id int, req models.CreatePlanRequest, tenantID int) (*models.Plan, error)
	DeletePlan(id int, tenantID int) error
}

type planService struct {
	planRepo    repositories.PlanRepository
	productRepo repositories.ProductRepository
}

func NewPlanService(planRepo repositories.PlanRepository, productRepo repositories.ProductRepository) PlanService {
	return &planService{
		planRepo:    planRepo,
		productRepo: productRepo,
	}
}

func (s *planService) CreatePlan(req models.CreatePlanRequest, productID int, tenantID int) (*models.Plan, error) {
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

func (s *planService) GetPlansByProduct(productID int, tenantID int) ([]models.Plan, error) {
	// Verify product exists and belongs to tenant
	_, err := s.productRepo.GetByID(productID, tenantID)
	if err != nil {
		return nil, errors.New("product not found")
	}

	return s.planRepo.GetByProduct(productID, tenantID)
}

func (s *planService) GetPlansByTenant(tenantID int) ([]models.Plan, error) {
	return s.planRepo.GetByTenant(tenantID)
}

func (s *planService) GetPlanByID(id int, tenantID int) (*models.Plan, error) {
	plan, err := s.planRepo.GetByID(id, tenantID)
	if err != nil {
		return nil, errors.New("plan not found")
	}
	return plan, nil
}

func (s *planService) UpdatePlan(id int, req models.CreatePlanRequest, tenantID int) (*models.Plan, error) {
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

func (s *planService) DeletePlan(id int, tenantID int) error {
	// Check if plan exists
	_, err := s.planRepo.GetByID(id, tenantID)
	if err != nil {
		return errors.New("plan not found")
	}

	return s.planRepo.Delete(id, tenantID)
}