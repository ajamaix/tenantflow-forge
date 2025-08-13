//go:build wireinject
// +build wireinject

package analytics

import (
	"github.com/google/wire"
	"gorm.io/gorm"
)

func NewControllerWire(db *gorm.DB) *Controller {
	wire.Build(
		ProviderSet,
	)
	return &Controller{}
}
