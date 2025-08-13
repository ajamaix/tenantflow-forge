//go:build wireinject
// +build wireinject

package analytics

import (
	"github.com/google/wire"
	"gorm.io/gorm"
)

var AnalyticsSet = wire.NewSet(
	ProvideAnalyticsRepository,
	ProvideAnalyticsService,
	ProvideAnalyticsController,
)

func InitializeAnalytics(db *gorm.DB) (*Controller, error) {
	panic(wire.Build(AnalyticsSet))
}