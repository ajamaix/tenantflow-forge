package plan

import (
	"backend/internal/domain"
	"backend/internal/product"
	"github.com/google/wire"
)

// ProviderSet defines the set of providers for dependency injection
var ProviderSet = wire.NewSet(
	NewPlanController,
	NewPlanService,
	NewPlanRepository,
	product.NewProductRepository,

	wire.Bind(new(domain.PlanControllerInterface), new(*Controller)),
	wire.Bind(new(domain.PlanService), new(*Service)),
	wire.Bind(new(domain.PlanRepository), new(*Repository)),
	wire.Bind(new(domain.ProductRepository), new(*product.Repository)),
)
