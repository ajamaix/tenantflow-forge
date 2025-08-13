package domain

import (
	"github.com/gofiber/fiber/v2"
)

type ProductControllerInterface interface {
	GetProducts(c *fiber.Ctx) error
	CreateProduct(c *fiber.Ctx) error
	GetProduct(c *fiber.Ctx) error
	UpdateProduct(c *fiber.Ctx) error
	DeleteProduct(c *fiber.Ctx) error
}

type PlanControllerInterface interface {
	GetPlans(c *fiber.Ctx) error
	CreatePlan(c *fiber.Ctx) error
	GetPlan(c *fiber.Ctx) error
	UpdatePlan(c *fiber.Ctx) error
	DeletePlan(c *fiber.Ctx) error
}

type TenantControllerInterface interface {
	GetTenants(c *fiber.Ctx) error
	CreateTenant(c *fiber.Ctx) error
	GetTenant(c *fiber.Ctx) error
	UpdateTenant(c *fiber.Ctx) error
	DeleteTenant(c *fiber.Ctx) error
}
type AuthControllerInterface interface {
	Login(c *fiber.Ctx) error
	Register(c *fiber.Ctx) error
	SuperAdminLogin(c *fiber.Ctx) error
}

type AnalyticsControllerInterface interface {
	GetDashboardMetrics(ctx *fiber.Ctx) error
	GetRecentActivity(ctx *fiber.Ctx) error
}

type PurchaseControllerInterface interface {
	// CreatePurchase creates a new purchase
	CreatePurchase(ctx *fiber.Ctx) error
	// GetUserPurchases gets all purchases for the current user
	GetUserPurchases(ctx *fiber.Ctx) error

	// GetPurchaseByID gets a specific purchase by ID
	GetPurchaseByID(ctx *fiber.Ctx) error

	// GetActivePurchases gets all active purchases for the current user
	GetActivePurchases(ctx *fiber.Ctx) error
}
