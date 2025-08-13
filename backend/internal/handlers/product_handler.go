package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"saas-backend/internal/models"
	"saas-backend/internal/services"
)

type ProductHandler struct {
	productService services.ProductService
}

func NewProductHandler(productService services.ProductService) *ProductHandler {
	return &ProductHandler{productService: productService}
}

func (h *ProductHandler) CreateProduct(c *fiber.Ctx) error {
	var req models.CreateProductRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid request body",
		})
	}

	tenantID := c.Locals("tenantID").(int)
	product, err := h.productService.CreateProduct(req, tenantID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"data":    product,
	})
}

func (h *ProductHandler) GetProducts(c *fiber.Ctx) error {
	tenantID := c.Locals("tenantID").(int)
	products, err := h.productService.GetProductsByTenant(tenantID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   true,
			"message": "Failed to retrieve products",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    products,
	})
}

func (h *ProductHandler) GetProduct(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid product ID",
		})
	}

	tenantID := c.Locals("tenantID").(int)
	product, err := h.productService.GetProductByID(id, tenantID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    product,
	})
}