package init

import (
	"backend/core"
	"backend/core/email"
	"backend/internal/auth"
	"backend/internal/plan"
	"backend/internal/product"
	handlers2 "backend/internal/tenant"
	"gorm.io/gorm"
)

type App struct {
	AuthHandler    *auth.Controller
	TenantHandler  *handlers2.Controller
	ProductHandler *product.Controller
	PlanHandler    *plan.Controller
	Config         *core.Config
}

func InitializeApp(db *gorm.DB, cfg *core.Config) (*App, func(), error) {
	// Initialize repositories
	userRepo := auth.NewUserRepository(db)
	tenantRepo := handlers2.NewTenantRepository(db)
	productRepo := product.NewProductRepository(db)
	planRepo := plan.NewPlanRepository(db)

	// Initialize services
	emailService := email.NewEmailService(cfg)
	authService := auth.NewAuthService(userRepo, cfg, emailService)
	tenantService := handlers2.NewTenantService(tenantRepo, userRepo)
	productService := product.NewProductService(productRepo)
	planService := plan.NewPlanService(planRepo, productRepo)

	// Initialize handlers
	authHandler := auth.NewAuthController(authService)
	tenantHandler := handlers2.NewTenantController(tenantService)
	productHandler := product.NewProductController(productService)
	planHandler := plan.NewPlanController(planService)

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
