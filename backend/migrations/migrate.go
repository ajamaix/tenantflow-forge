package migrations

import (
	"backend/models"
	"log"

	"gorm.io/gorm"
)

func RunMigrations(db *gorm.DB) error {
	log.Println("Running database migrations...")

	err := db.AutoMigrate(
		&models.Tenant{},
		&models.User{},
		&models.Product{},
		&models.Plan{},
		&models.Role{},
		&models.Permission{},
		&models.RolePermission{},
		&models.Purchase{},
	)

	if err != nil {
		return err
	}

	log.Println("Database migrations completed successfully")
	return nil
}

func SeedInitialData(db *gorm.DB) error {
	log.Println("Seeding initial data...")

	// Create basic permissions
	permissions := []models.Permission{
		{Name: "read_products", Description: "Can read products"},
		{Name: "write_products", Description: "Can create/update products"},
		{Name: "delete_products", Description: "Can delete products"},
		{Name: "read_plans", Description: "Can read plans"},
		{Name: "write_plans", Description: "Can create/update plans"},
		{Name: "delete_plans", Description: "Can delete plans"},
		{Name: "manage_tenants", Description: "Can manage tenants"},
		{Name: "super_admin", Description: "Super admin access"},
	}

	for _, permission := range permissions {
		var existingPermission models.Permission
		if err := db.Where("name = ?", permission.Name).First(&existingPermission).Error; err == gorm.ErrRecordNotFound {
			if err := db.Create(&permission).Error; err != nil {
				return err
			}
		}
	}

	// Create basic roles
	roles := []models.Role{
		{Name: "super_admin", Description: "Super administrator"},
		{Name: "admin", Description: "Tenant administrator"},
		{Name: "user", Description: "Regular user"},
	}

	for _, role := range roles {
		var existingRole models.Role
		if err := db.Where("name = ?", role.Name).First(&existingRole).Error; err == gorm.ErrRecordNotFound {
			if err := db.Create(&role).Error; err != nil {
				return err
			}
		}
	}

	// Assign permissions to roles
	var superAdminRole models.Role
	if err := db.Where("name = ?", "super_admin").First(&superAdminRole).Error; err == nil {
		var allPermissions []models.Permission
		db.Find(&allPermissions)
		db.Model(&superAdminRole).Association("Permissions").Replace(allPermissions)
	}

	var adminRole models.Role
	if err := db.Where("name = ?", "admin").First(&adminRole).Error; err == nil {
		var adminPermissions []models.Permission
		db.Where("name IN ?", []string{"read_products", "write_products", "delete_products", "read_plans", "write_plans", "delete_plans"}).Find(&adminPermissions)
		db.Model(&adminRole).Association("Permissions").Replace(adminPermissions)
	}

	var userRole models.Role
	if err := db.Where("name = ?", "user").First(&userRole).Error; err == nil {
		var userPermissions []models.Permission
		db.Where("name IN ?", []string{"read_products", "read_plans"}).Find(&userPermissions)
		db.Model(&userRole).Association("Permissions").Replace(userPermissions)
	}

	log.Println("Initial data seeded successfully")
	return nil
}
