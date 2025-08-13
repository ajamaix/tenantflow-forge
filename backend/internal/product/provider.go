package product

import (
	"backend/internal/domain"
	"github.com/google/wire"
)

// ProviderSet defines the set of providers for dependency injection
var ProviderSet = wire.NewSet(
	NewProductController,
	NewProductService,
	NewProductRepository,

	wire.Bind(new(domain.ProductControllerInterface), new(*Controller)),
	wire.Bind(new(domain.ProductService), new(*Service)),
	wire.Bind(new(domain.ProductRepository), new(*Repository)),
)
