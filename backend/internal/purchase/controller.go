package purchase

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/your-app/backend/models"
)

type Controller struct {
	service Service
}

func NewController(service Service) *Controller {
	return &Controller{service: service}
}

// CreatePurchase creates a new purchase
func (c *Controller) CreatePurchase(ctx *fiber.Ctx) error {
	userID := ctx.Locals("user_id").(int)
	tenantID := ctx.Locals("tenant_id").(int)

	var req models.CreatePurchaseRequest
	if err := ctx.BodyParser(&req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	purchase, err := c.service.CreatePurchase(userID, tenantID, req)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{
		"error": false,
		"data":  purchase,
	})
}

// GetUserPurchases gets all purchases for the current user
func (c *Controller) GetUserPurchases(ctx *fiber.Ctx) error {
	userID := ctx.Locals("user_id").(int)
	tenantID := ctx.Locals("tenant_id").(int)

	purchases, err := c.service.GetUserPurchases(userID, tenantID)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return ctx.JSON(fiber.Map{
		"error": false,
		"data":  purchases,
	})
}

// GetPurchaseByID gets a specific purchase by ID
func (c *Controller) GetPurchaseByID(ctx *fiber.Ctx) error {
	userID := ctx.Locals("user_id").(int)
	tenantID := ctx.Locals("tenant_id").(int)
	
	id, err := strconv.Atoi(ctx.Params("id"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   true,
			"message": "Invalid purchase ID",
		})
	}

	purchase, err := c.service.GetPurchaseByID(id, userID, tenantID)
	if err != nil {
		return ctx.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return ctx.JSON(fiber.Map{
		"error": false,
		"data":  purchase,
	})
}

// GetActivePurchases gets all active purchases for the current user
func (c *Controller) GetActivePurchases(ctx *fiber.Ctx) error {
	userID := ctx.Locals("user_id").(int)
	tenantID := ctx.Locals("tenant_id").(int)

	purchases, err := c.service.GetActivePurchases(userID, tenantID)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   true,
			"message": err.Error(),
		})
	}

	return ctx.JSON(fiber.Map{
		"error": false,
		"data":  purchases,
	})
}