package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"saas-backend/internal/models"
	"saas-backend/internal/services"
)

type PlanHandler struct {
	planService services.PlanService
}

func NewPlanHandler(planService services.PlanService) *PlanHandler {
	return &PlanHandler{planService: planService}
}

func (h *PlanHandler) CreatePlan(c *fiber.Ctx) error {
	productIDStr := c.Params("product_id")
	productID, err := strconv.Atoi(productIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid product ID",
		})
	}

	var req models.CreatePlanRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid request body",
		})
	}

	tenantID := c.Locals("tenantID").(int)
	plan, err := h.planService.CreatePlan(req, productID, tenantID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"data":    plan,
	})
}

func (h *PlanHandler) GetPlans(c *fiber.Ctx) error {
	tenantID := c.Locals("tenantID").(int)
	plans, err := h.planService.GetPlansByTenant(tenantID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   true,
			"message": "Failed to retrieve plans",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    plans,
	})
}