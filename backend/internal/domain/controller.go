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
