package migrations

import (
	"backend/models"
	"gorm.io/gorm"
)

func AutoMigrate(db *gorm.DB) error {
	// Add new columns to existing Product table
	if err := db.AutoMigrate(&models.Product{}); err != nil {
		return err
	}

	// Auto migrate all models
	return db.AutoMigrate(
		&models.Tenant{},
		&models.User{},
		&models.Product{},
		&models.Plan{},
		&models.Purchase{},
		&models.Activity{},
		&models.Role{},
		&models.Permission{},
		&models.RolePermission{},
	)
}