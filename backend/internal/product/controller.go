package product

import (
	"backend/internal/domain"
	"backend/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type Controller struct {
	productService domain.ProductService
}

func NewProductController(productService domain.ProductService) *Controller {
	return &Controller{productService: productService}
}

func (h *Controller) GetProducts(c *fiber.Ctx) error {
	tenantID := c.Locals("tenantID").(int)

	products, err := h.productService.GetProductsByTenant(tenantID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"error": false,
		"data":  products,
	})
}

func (h *Controller) CreateProduct(c *fiber.Ctx) error {
	tenantID := c.Locals("tenantID").(int)

	var req models.CreateProductRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid request body",
		})
	}

	product, err := h.productService.CreateProduct(req, tenantID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"error": false,
		"data":  product,
	})
}

func (h *Controller) GetProduct(c *fiber.Ctx) error {
	tenantID := c.Locals("tenantID").(int)

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid product ID",
		})
	}

	product, err := h.productService.GetProductByID(id, tenantID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"error": false,
		"data":  product,
	})
}

func (h *Controller) UpdateProduct(c *fiber.Ctx) error {
	tenantID := c.Locals("tenantID").(int)

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid product ID",
		})
	}

	var req models.CreateProductRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid request body",
		})
	}

	product, err := h.productService.UpdateProduct(id, req, tenantID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"error": false,
		"data":  product,
	})
}

func (h *Controller) DeleteProduct(c *fiber.Ctx) error {
	tenantID := c.Locals("tenantID").(int)

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid product ID",
		})
	}

	err = h.productService.DeleteProduct(id, tenantID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"error":   false,
		"message": "Product deleted successfully",
	})
}
