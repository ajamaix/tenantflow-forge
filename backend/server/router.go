package server

import (
	"backend/init"
	"backend/internal/middleware"
	"gorm.io/gorm"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(router *fiber.App, app *init.App, db *gorm.DB) {
	// API version 1
	api := router.Group("/api/v1")

	// Tenant middleware for all v1 routes
	api.Use(middleware.TenantMiddleware(db))

	// Auth routes
	auth := api.Group("/auth")
	auth.Post("/login", app.AuthHandler.Login)
	auth.Post("/register", app.AuthHandler.Register)

	// Protected tenant routes
	protected := api.Group("", middleware.JWTAuth(app.Config), middleware.RequireTenant())

	// Product routes
	products := protected.Group("/products")
	products.Get("/", app.ProductHandler.GetProducts)
	products.Post("/", app.ProductHandler.CreateProduct)
	products.Get("/:id", app.ProductHandler.GetProduct)
	products.Put("/:id", app.ProductHandler.UpdateProduct)
	products.Delete("/:id", app.ProductHandler.DeleteProduct)

	// Plan routes
	plans := protected.Group("/plans")
	plans.Get("/", app.PlanHandler.GetPlans)
	plans.Post("/products/:product_id/plans", app.PlanHandler.CreatePlan)
	plans.Get("/:id", app.PlanHandler.GetPlan)
	plans.Put("/:id", app.PlanHandler.UpdatePlan)
	plans.Delete("/:id", app.PlanHandler.DeletePlan)

	// Super Admin routes
	superAdmin := router.Group("/api/super")
	superAuth := router.Group("/api/super-auth")

	// Super admin auth
	superAuth.Post("/login", app.AuthHandler.SuperAdminLogin)

	// Super admin protected routes
	superProtected := superAdmin.Group("", middleware.SuperAdminAuth(app.Config))
	superProtected.Get("/tenants", app.TenantHandler.GetTenants)
	superProtected.Post("/tenants", app.TenantHandler.CreateTenant)
	superProtected.Get("/tenants/:id", app.TenantHandler.GetTenant)
	superProtected.Put("/tenants/:id", app.TenantHandler.UpdateTenant)
	superProtected.Delete("/tenants/:id", app.TenantHandler.DeleteTenant)
}