package middleware

import (
	"backend/models"
	"strings"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func TenantMiddleware(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get tenant domain from x-tenant-id header
		tenantDomain := c.Get("x-tenant-id")
		if tenantDomain == "" {
			tenantDomain = "amaix"
			//return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			//	"error":   true,
			//	"message": "x-tenant-id header is required",
			//})
		}

		// Skip tenant resolution for super admin routes
		if strings.HasPrefix(c.Path(), "/api/super") {
			return c.Next()
		}

		// Find tenant by domain
		var tenant models.Tenant
		if err := db.Where("tenant_domain = ?", tenantDomain).First(&tenant).Error; err != nil {
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
