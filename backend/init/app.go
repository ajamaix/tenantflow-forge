package init

import (
	"backend/core"
	"backend/internal/analytics"
	"backend/internal/auth"
	"backend/internal/plan"
	"backend/internal/product"
	"backend/internal/purchase"
	handlers2 "backend/internal/tenant"
	"gorm.io/gorm"
)

type App struct {
	AuthHandler      *auth.Controller
	TenantHandler    *handlers2.Controller
	ProductHandler   *product.Controller
	PlanHandler      *plan.Controller
	PurchaseHandler  *purchase.Controller
	AnalyticsHandler *analytics.Controller
	Config           *core.Config
}

func InitializeApp(db *gorm.DB, cfg *core.Config) (*App, func(), error) {

	// Initialize handlers
	authHandler := auth.NewControllerWire(db, cfg)
	tenantHandler := handlers2.NewControllerWire(db)
	productHandler := product.NewControllerWire(db)
	planHandler := plan.NewControllerWire(db)

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
