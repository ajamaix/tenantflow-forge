package plan

import (
	"backend/internal/domain"
	"backend/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type Controller struct {
	planService domain.PlanService
}

func NewPlanController(planService domain.PlanService) *Controller {
	return &Controller{planService: planService}
}

func (h *Controller) GetPlans(c *fiber.Ctx) error {
	tenantID := c.Locals("tenantID").(int)

	plans, err := h.planService.GetPlansByTenant(tenantID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"error": false,
		"data":  plans,
	})
}

func (h *Controller) CreatePlan(c *fiber.Ctx) error {
	tenantID := c.Locals("tenantID").(int)

	productID, err := strconv.Atoi(c.Params("product_id"))
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

	plan, err := h.planService.CreatePlan(req, productID, tenantID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"error": false,
		"data":  plan,
	})
}

func (h *Controller) GetPlan(c *fiber.Ctx) error {
	tenantID := c.Locals("tenantID").(int)

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid plan ID",
		})
	}

	plan, err := h.planService.GetPlanByID(id, tenantID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"error": false,
		"data":  plan,
	})
}

func (h *Controller) UpdatePlan(c *fiber.Ctx) error {
	tenantID := c.Locals("tenantID").(int)

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid plan ID",
		})
	}

	var req models.CreatePlanRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid request body",
		})
	}

	plan, err := h.planService.UpdatePlan(id, req, tenantID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"error": false,
		"data":  plan,
	})
}

func (h *Controller) DeletePlan(c *fiber.Ctx) error {
	tenantID := c.Locals("tenantID").(int)

	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid plan ID",
		})
	}

	err = h.planService.DeletePlan(id, tenantID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"error":   false,
		"message": "Plan deleted successfully",
	})
}
