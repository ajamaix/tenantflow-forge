package product

import (
	"backend/internal/domain"
	"backend/models"
	"errors"
)

type Service struct {
	productRepo domain.ProductRepository
}

func NewProductService(productRepo domain.ProductRepository) *Service {
	return &Service{
		productRepo: productRepo,
	}
}

func (s *Service) CreateProduct(req models.CreateProductRequest, tenantID int) (*models.Product, error) {
	product := &models.Product{
		Name:        req.Name,
		Description: req.Description,
		TenantID:    tenantID,
	}

	if err := s.productRepo.Create(product); err != nil {
		return nil, errors.New("failed to create product")
	}

	return product, nil
}

func (s *Service) GetProductsByTenant(tenantID int) ([]models.Product, error) {
	return s.productRepo.GetByTenant(tenantID)
}

func (s *Service) GetProductByID(id int, tenantID int) (*models.Product, error) {
	product, err := s.productRepo.GetByID(id, tenantID)
	if err != nil {
		return nil, errors.New("product not found")
	}
	return product, nil
}

func (s *Service) UpdateProduct(id int, req models.CreateProductRequest, tenantID int) (*models.Product, error) {
	product, err := s.productRepo.GetByID(id, tenantID)
	if err != nil {
		return nil, errors.New("product not found")
	}

	product.Name = req.Name
	product.Description = req.Description

	if err := s.productRepo.Update(product); err != nil {
		return nil, errors.New("failed to update product")
	}

	return product, nil
}

func (s *Service) DeleteProduct(id int, tenantID int) error {
	// Check if product exists
	_, err := s.productRepo.GetByID(id, tenantID)
	if err != nil {
		return errors.New("product not found")
	}

	return s.productRepo.Delete(id, tenantID)
}
