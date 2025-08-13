package tenant

import (
	"backend/internal/auth"
	"backend/internal/domain"
	"github.com/google/wire"
)

// ProviderSet defines the set of providers for dependency injection
var ProviderSet = wire.NewSet(
	NewTenantController,
	NewTenantService,
	NewTenantRepository,
	auth.NewUserRepository,

	wire.Bind(new(domain.TenantControllerInterface), new(*Controller)),
	wire.Bind(new(domain.TenantService), new(*Service)),
	wire.Bind(new(domain.TenantRepository), new(*Repository)),
	wire.Bind(new(domain.UserRepository), new(*auth.UserRepository)),
)
