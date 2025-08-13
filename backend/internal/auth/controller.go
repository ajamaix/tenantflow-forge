package auth

import (
	"backend/internal/domain"
	"backend/models"

	"github.com/gofiber/fiber/v2"
)

type Controller struct {
	authService domain.AuthService
}

func NewAuthController(authService domain.AuthService) *Controller {
	return &Controller{authService: authService}
}

func (h *Controller) Login(c *fiber.Ctx) error {
	var req models.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid request body",
		})
	}

	// Get tenant ID from context
	tenantID := c.Locals("tenantID")
	var tenantIDPtr *int
	if tenantID != nil {
		id := tenantID.(int)
		tenantIDPtr = &id
	}

	response, err := h.authService.Login(req.Email, req.Password, tenantIDPtr, false)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"error": false,
		"data":  response,
	})
}

func (h *Controller) Register(c *fiber.Ctx) error {
	var req models.RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid request body",
		})
	}

	// Get tenant ID from context
	tenantID := c.Locals("tenantID")
	var tenantIDPtr *int
	if tenantID != nil {
		id := tenantID.(int)
		tenantIDPtr = &id
	}

	response, err := h.authService.Register(req, tenantIDPtr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"error": false,
		"data":  response,
	})
}

func (h *Controller) SuperAdminLogin(c *fiber.Ctx) error {
	var req models.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid request body",
		})
	}

	response, err := h.authService.Login(req.Email, req.Password, nil, true)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"error": false,
		"data":  response,
	})
}
