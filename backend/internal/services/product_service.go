package services

import (
	"errors"

	"saas-backend/internal/models"
	"saas-backend/internal/repositories"
)

type ProductService interface {
	CreateProduct(req models.CreateProductRequest, tenantID int) (*models.Product, error)
	GetProductsByTenant(tenantID int) ([]models.Product, error)
	GetProductByID(id int, tenantID int) (*models.Product, error)
	UpdateProduct(id int, req models.CreateProductRequest, tenantID int) (*models.Product, error)
	DeleteProduct(id int, tenantID int) error
}

type productService struct {
	productRepo repositories.ProductRepository
}

func NewProductService(productRepo repositories.ProductRepository) ProductService {
	return &productService{
		productRepo: productRepo,
	}
}

func (s *productService) CreateProduct(req models.CreateProductRequest, tenantID int) (*models.Product, error) {
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

func (s *productService) GetProductsByTenant(tenantID int) ([]models.Product, error) {
	return s.productRepo.GetByTenant(tenantID)
}

func (s *productService) GetProductByID(id int, tenantID int) (*models.Product, error) {
	product, err := s.productRepo.GetByID(id, tenantID)
	if err != nil {
		return nil, errors.New("product not found")
	}
	return product, nil
}

func (s *productService) UpdateProduct(id int, req models.CreateProductRequest, tenantID int) (*models.Product, error) {
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

func (s *productService) DeleteProduct(id int, tenantID int) error {
	// Check if product exists
	_, err := s.productRepo.GetByID(id, tenantID)
	if err != nil {
		return errors.New("product not found")
	}

	return s.productRepo.Delete(id, tenantID)
}