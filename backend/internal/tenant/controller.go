package tenant

import (
	"backend/internal/domain"
	"backend/models"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type Controller struct {
	tenantService domain.TenantService
}

func NewTenantController(tenantService domain.TenantService) *Controller {
	return &Controller{tenantService: tenantService}
}

func (h *Controller) GetTenants(c *fiber.Ctx) error {
	tenants, err := h.tenantService.GetAllTenants()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"error": false,
		"data":  tenants,
	})
}

func (h *Controller) CreateTenant(c *fiber.Ctx) error {
	var req models.CreateTenantRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid request body",
		})
	}

	tenant, err := h.tenantService.CreateTenant(req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"error": false,
		"data":  tenant,
	})
}

func (h *Controller) GetTenant(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid tenant ID",
		})
	}

	tenant, err := h.tenantService.GetTenantByID(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"error": false,
		"data":  tenant,
	})
}

func (h *Controller) UpdateTenant(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid tenant ID",
		})
	}

	var req models.CreateTenantRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid request body",
		})
	}

	tenant, err := h.tenantService.UpdateTenant(id, req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"error": false,
		"data":  tenant,
	})
}

func (h *Controller) DeleteTenant(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid tenant ID",
		})
	}

	err = h.tenantService.DeleteTenant(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"error":   false,
		"message": "Tenant deleted successfully",
	})
}
