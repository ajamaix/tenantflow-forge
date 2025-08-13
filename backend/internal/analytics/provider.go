package analytics

import (
	"backend/internal/domain"
	"github.com/google/wire"
)

// ProviderSet defines the set of providers for dependency injection
var ProviderSet = wire.NewSet(
	NewController,
	NewService,
	NewRepository,

	wire.Bind(new(domain.AnalyticsControllerInterface), new(*Controller)),
	wire.Bind(new(domain.AnalyticsService), new(*Service)),
	wire.Bind(new(domain.AnalyticsRepository), new(*Repository)),
)
