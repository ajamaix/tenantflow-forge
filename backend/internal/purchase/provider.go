package purchase

import (
	"backend/internal/domain"
	"github.com/google/wire"
)

// ProviderSet defines the set of providers for dependency injection
var ProviderSet = wire.NewSet(
	NewController,
	NewService,
	NewRepository,

	wire.Bind(new(domain.PurchaseControllerInterface), new(*Controller)),
	wire.Bind(new(domain.PurchaseService), new(*Service)),
	wire.Bind(new(domain.PurchaseRepository), new(*Repository)),
)
