package services

import (
	"errors"

	"saas-backend/internal/models"
	"saas-backend/internal/repositories"
)

type TenantService interface {
	CreateTenant(req models.CreateTenantRequest) (*models.Tenant, error)
	GetAllTenants() ([]models.Tenant, error)
	GetTenantByID(id int) (*models.Tenant, error)
	UpdateTenant(id int, req models.CreateTenantRequest) (*models.Tenant, error)
	DeleteTenant(id int) error
}

type tenantService struct {
	tenantRepo repositories.TenantRepository
	userRepo   repositories.UserRepository
}

func NewTenantService(tenantRepo repositories.TenantRepository, userRepo repositories.UserRepository) TenantService {
	return &tenantService{
		tenantRepo: tenantRepo,
		userRepo:   userRepo,
	}
}

func (s *tenantService) CreateTenant(req models.CreateTenantRequest) (*models.Tenant, error) {
	// Check if tenant domain already exists
	existingTenant, _ := s.tenantRepo.GetByDomain(req.TenantDomain)
	if existingTenant != nil {
		return nil, errors.New("tenant domain already exists")
	}

	tenant := &models.Tenant{
		TenantName:   req.TenantName,
		TenantDomain: req.TenantDomain,
		TenantCode:   req.TenantCode,
	}

	if err := s.tenantRepo.Create(tenant); err != nil {
		return nil, errors.New("failed to create tenant")
	}

	return tenant, nil
}

func (s *tenantService) GetAllTenants() ([]models.Tenant, error) {
	return s.tenantRepo.GetAll()
}

func (s *tenantService) GetTenantByID(id int) (*models.Tenant, error) {
	tenant, err := s.tenantRepo.GetByID(id)
	if err != nil {
		return nil, errors.New("tenant not found")
	}
	return tenant, nil
}

func (s *tenantService) UpdateTenant(id int, req models.CreateTenantRequest) (*models.Tenant, error) {
	tenant, err := s.tenantRepo.GetByID(id)
	if err != nil {
		return nil, errors.New("tenant not found")
	}

	// Check if new domain conflicts with existing tenant
	if tenant.TenantDomain != req.TenantDomain {
		existingTenant, _ := s.tenantRepo.GetByDomain(req.TenantDomain)
		if existingTenant != nil && existingTenant.ID != id {
			return nil, errors.New("tenant domain already exists")
		}
	}

	tenant.TenantName = req.TenantName
	tenant.TenantDomain = req.TenantDomain
	tenant.TenantCode = req.TenantCode

	if err := s.tenantRepo.Update(tenant); err != nil {
		return nil, errors.New("failed to update tenant")
	}

	return tenant, nil
}

func (s *tenantService) DeleteTenant(id int) error {
	// Check if tenant exists
	_, err := s.tenantRepo.GetByID(id)
	if err != nil {
		return errors.New("tenant not found")
	}

	// Note: In a real application, you might want to soft delete
	// or handle cascading deletes more carefully
	return s.tenantRepo.Delete(id)
}