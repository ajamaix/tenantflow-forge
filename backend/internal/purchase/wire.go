//go:build wireinject
// +build wireinject

package purchase

import (
	"github.com/google/wire"
	"gorm.io/gorm"
)

var PurchaseSet = wire.NewSet(
	ProvidePurchaseRepository,
	ProvidePurchaseService,
	ProvidePurchaseController,
)

func InitializePurchase(db *gorm.DB) (*Controller, error) {
	panic(wire.Build(PurchaseSet))
}