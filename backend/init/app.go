package init

import (
	"backend/core"
	"backend/internal/repositories"
	"backend/internal/services"
	"backend/internal/utils"
	"backend/server/handlers"
	"gorm.io/gorm"
)

type App struct {
	AuthHandler    *handlers.AuthHandler
	TenantHandler  *handlers.TenantHandler
	ProductHandler *handlers.ProductHandler
	PlanHandler    *handlers.PlanHandler
	Config         *core.Config
}

func InitializeApp(db *gorm.DB, cfg *core.Config) (*App, func(), error) {
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