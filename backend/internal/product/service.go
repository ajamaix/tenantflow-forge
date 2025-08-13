package product

import (
	"backend/internal/domain"
	"backend/models"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"
)

type Service struct {
	productRepo domain.ProductRepository
}

func NewProductService(productRepo domain.ProductRepository) *Service {
	return &Service{
		productRepo: productRepo,
	}
}

// validateAndEncodeImage validates and processes base64 image data
func (s *Service) validateAndEncodeImage(imageData string) (string, error) {
	if imageData == "" {
		return "", nil
	}

	// Check if it's already properly formatted base64 with data URL prefix
	if strings.HasPrefix(imageData, "data:image/") {
		// Extract the base64 part after the comma
		parts := strings.Split(imageData, ",")
		if len(parts) != 2 {
			return "", errors.New("invalid image data format")
		}
		
		// Validate base64 encoding
		_, err := base64.StdEncoding.DecodeString(parts[1])
		if err != nil {
			return "", errors.New("invalid base64 encoding")
		}
		
		return imageData, nil
	}

	// If it's just base64 without data URL prefix, validate and add prefix
	if _, err := base64.StdEncoding.DecodeString(imageData); err != nil {
		return "", errors.New("invalid base64 encoding")
	}

	// Add default data URL prefix for JPEG
	return fmt.Sprintf("data:image/jpeg;base64,%s", imageData), nil
}

func (s *Service) CreateProduct(req models.CreateProductRequest, tenantID int) (*models.Product, error) {
	// Validate and encode image if provided
	encodedImage, err := s.validateAndEncodeImage(req.Image)
	if err != nil {
		return nil, fmt.Errorf("image validation failed: %v", err)
	}

	product := &models.Product{
		Name:        req.Name,
		Description: req.Description,
		URL:         req.URL,
		Image:       encodedImage,
		Active:      req.Active,
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

	// Validate and encode image if provided
	if req.Image != "" {
		encodedImage, err := s.validateAndEncodeImage(req.Image)
		if err != nil {
			return nil, fmt.Errorf("image validation failed: %v", err)
		}
		product.Image = encodedImage
	}

	product.Name = req.Name
	product.Description = req.Description
	product.URL = req.URL
	if req.Active != nil {
		product.Active = req.Active
	}

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
