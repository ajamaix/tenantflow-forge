package app

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"saas-backend/internal/config"
	"saas-backend/internal/handlers"
	"saas-backend/internal/middleware"
	"saas-backend/internal/repositories"
	"saas-backend/internal/services"
	"saas-backend/internal/utils"
)

type App struct {
	AuthHandler    *handlers.AuthHandler
	TenantHandler  *handlers.TenantHandler
	ProductHandler *handlers.ProductHandler
	PlanHandler    *handlers.PlanHandler
	Config         *config.Config
}

func InitializeApp(db *gorm.DB, cfg *config.Config) (*App, func(), error) {
	// Initialize repositories
	userRepo := repositories.NewUserRepository(db)
	tenantRepo := repositories.NewTenantRepository(db)
	productRepo := repositories.NewProductRepository(db)
	planRepo := repositories.NewPlanRepository(db)

	// Initialize services
	emailService := utils.NewEmailService(cfg)
	authService := services.NewAuthService(userRepo, cfg, emailService)
	tenantService := services.NewTenantService(tenantRepo, userRepo)
	productService := services.NewProductService(productRepo)
	planService := services.NewPlanService(planRepo, productRepo)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	tenantHandler := handlers.NewTenantHandler(tenantService)
	productHandler := handlers.NewProductHandler(productService)
	planHandler := handlers.NewPlanHandler(planService)

	app := &App{
		AuthHandler:    authHandler,
		TenantHandler:  tenantHandler,
		ProductHandler: productHandler,
		PlanHandler:    planHandler,
		Config:         cfg,
	}

	cleanup := func() {
		// Cleanup resources if needed
	}

	return app, cleanup, nil
}

func (app *App) SetupRoutes(router *fiber.App) {
	// API version 1
	api := router.Group("/api/v1")

	// Tenant middleware for all v1 routes
	api.Use(middleware.TenantMiddleware(nil)) // You'll need to pass the DB instance

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

	// Plan routes
	plans := protected.Group("/plans")
	plans.Get("/", app.PlanHandler.GetPlans)
	plans.Post("/products/:product_id/plans", app.PlanHandler.CreatePlan)

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