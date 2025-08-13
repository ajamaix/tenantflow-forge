//go:build wireinject
// +build wireinject

package auth

import (
	"backend/core"
	"github.com/google/wire"
	"gorm.io/gorm"
)

func NewControllerWire(db *gorm.DB, cfg *core.Config) *Controller {
	wire.Build(
		ProviderSet,
	)
	return &Controller{}
}
