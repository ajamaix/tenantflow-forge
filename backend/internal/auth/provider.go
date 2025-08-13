package auth

import (
	coreDomain "backend/core/domain"
	"backend/core/email"
	"backend/internal/domain"
	"github.com/google/wire"
)

// ProviderSet defines the set of providers for dependency injection
var ProviderSet = wire.NewSet(
	NewAuthController,
	NewAuthService,
	NewUserRepository,
	email.NewEmailService,

	wire.Bind(new(domain.AuthControllerInterface), new(*Controller)),
	wire.Bind(new(domain.AuthService), new(*Service)),
	wire.Bind(new(domain.UserRepository), new(*UserRepository)),
	wire.Bind(new(coreDomain.EmailService), new(*email.Service)),
)
