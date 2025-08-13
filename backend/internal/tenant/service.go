package tenant

import (
	"backend/internal/domain"
	"backend/models"
	"errors"
)

type Service struct {
	tenantRepo domain.TenantRepository
	userRepo   domain.UserRepository
}

func NewTenantService(tenantRepo domain.TenantRepository, userRepo domain.UserRepository) *Service {
	return &Service{
		tenantRepo: tenantRepo,
		userRepo:   userRepo,
	}
}

func (s *Service) CreateTenant(req models.CreateTenantRequest) (*models.Tenant, error) {
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

func (s *Service) GetAllTenants() ([]models.Tenant, error) {
	return s.tenantRepo.GetAll()
}

func (s *Service) GetTenantByID(id int) (*models.Tenant, error) {
	tenant, err := s.tenantRepo.GetByID(id)
	if err != nil {
		return nil, errors.New("tenant not found")
	}
	return tenant, nil
}

func (s *Service) UpdateTenant(id int, req models.CreateTenantRequest) (*models.Tenant, error) {
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

func (s *Service) DeleteTenant(id int) error {
	// Check if tenant exists
	_, err := s.tenantRepo.GetByID(id)
	if err != nil {
		return errors.New("tenant not found")
	}

	// Note: In a real application, you might want to soft delete
	// or handle cascading deletes more carefully
	return s.tenantRepo.Delete(id)
}
