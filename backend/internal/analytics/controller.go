package analytics

import (
	"backend/internal/domain"
	"github.com/gofiber/fiber/v2"
)

type Controller struct {
	service domain.AnalyticsService
}

func NewController(service domain.AnalyticsService) *Controller {
	return &Controller{service: service}
}

// GetDashboardMetrics gets dashboard metrics for the current tenant
func (c *Controller) GetDashboardMetrics(ctx *fiber.Ctx) error {
	tenantID := ctx.Locals("tenant_id").(*int)

	metrics, err := c.service.GetDashboardMetrics(*tenantID)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return ctx.JSON(fiber.Map{
		"error": false,
		"data":  metrics,
	})
}

// GetRecentActivity gets recent activity for the current tenant
func (c *Controller) GetRecentActivity(ctx *fiber.Ctx) error {
	tenantID := ctx.Locals("tenant_id").(*int)

	activities, err := c.service.GetRecentActivity(*tenantID)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return ctx.JSON(fiber.Map{
		"error": false,
		"data":  activities,
	})
}
