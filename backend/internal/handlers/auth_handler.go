package handlers

import (
	"github.com/gofiber/fiber/v2"
	"saas-backend/internal/models"
	"saas-backend/internal/services"
)

type AuthHandler struct {
	authService services.AuthService
}

func NewAuthHandler(authService services.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

// Login handles user login
func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req models.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid request body",
		})
	}

	// Get tenant ID from context (for tenant-specific login)
	tenantID := c.Locals("tenantID")
	var tenantIDPtr *int
	if tenantID != nil {
		if tid, ok := tenantID.(int); ok {
			tenantIDPtr = &tid
		}
	}

	response, err := h.authService.Login(req.Email, req.Password, tenantIDPtr, false)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    response,
	})
}

// Register handles user registration
func (h *AuthHandler) Register(c *fiber.Ctx) error {
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
		if tid, ok := tenantID.(int); ok {
			tenantIDPtr = &tid
		}
	}

	response, err := h.authService.Register(req, tenantIDPtr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"data":    response,
	})
}

// SuperAdminLogin handles super admin login
func (h *AuthHandler) SuperAdminLogin(c *fiber.Ctx) error {
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
		"success": true,
		"data":    response,
	})
}