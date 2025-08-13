package analytics

import (
	"github.com/your-app/backend/internal/analytics"
	"gorm.io/gorm"
)

func ProvideAnalyticsRepository(db *gorm.DB) analytics.Repository {
	return analytics.NewRepository(db)
}

func ProvideAnalyticsService(repo analytics.Repository) analytics.Service {
	return analytics.NewService(repo)
}

func ProvideAnalyticsController(service analytics.Service) *analytics.Controller {
	return analytics.NewController(service)
}