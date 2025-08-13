package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"saas-backend/internal/models"
)

func TenantMiddleware(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get subdomain from Host header
		host := c.Get("Host")
		if host == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error":   true,
				"message": "Host header is required",
			})
		}

		// Extract subdomain (e.g., tenant123.localhost:8080 -> tenant123)
		parts := strings.Split(host, ".")
		if len(parts) < 2 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error":   true,
				"message": "Invalid subdomain format",
			})
		}

		// Remove port if present
		subdomain := strings.Split(parts[0], ":")[0]

		// Skip tenant resolution for super admin routes
		if strings.HasPrefix(c.Path(), "/api/super") {
			return c.Next()
		}

		// Find tenant by domain
		var tenant models.Tenant
		if err := db.Where("tenant_domain = ?", subdomain).First(&tenant).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
					"error":   true,
					"message": "Tenant not found",
				})
			}
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error":   true,
				"message": "Failed to resolve tenant",
			})
		}

		// Store tenant info in context
		c.Locals("tenantID", tenant.ID)
		c.Locals("tenantDomain", tenant.TenantDomain)
		c.Locals("tenantName", tenant.TenantName)

		return c.Next()
	}
}

func RequireTenant() fiber.Handler {
	return func(c *fiber.Ctx) error {
		tenantID := c.Locals("tenantID")
		if tenantID == nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error":   true,
				"message": "Tenant context required",
			})
		}
		return c.Next()
	}
}