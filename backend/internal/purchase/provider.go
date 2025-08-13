package purchase

import (
	"github.com/your-app/backend/internal/purchase"
	"gorm.io/gorm"
)

func ProvidePurchaseRepository(db *gorm.DB) purchase.Repository {
	return purchase.NewRepository(db)
}

func ProvidePurchaseService(repo purchase.Repository) purchase.Service {
	return purchase.NewService(repo)
}

func ProvidePurchaseController(service purchase.Service) *purchase.Controller {
	return purchase.NewController(service)
}