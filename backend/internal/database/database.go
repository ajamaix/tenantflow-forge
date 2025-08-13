package database

import (
	"log"
	"saas-backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Initialize(databaseURL string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, err
	}

	return db, nil
}

func RunMigrations(db *gorm.DB) error {
	// Auto-migrate all models
	err := db.AutoMigrate(
		&models.Tenant{},
		&models.User{},
		&models.Product{},
		&models.Plan{},
		&models.Role{},
		&models.Permission{},
		&models.RolePermission{},
	)
	if err != nil {
		return err
	}

	log.Println("Database migrations completed successfully")
	return nil
}

func SeedDummyData(db *gorm.DB) error {
	// Check if data already exists
	var tenantCount int64
	db.Model(&models.Tenant{}).Count(&tenantCount)
	if tenantCount > 0 {
		log.Println("Dummy data already exists, skipping seed")
		return nil
	}

	// Create permissions
	permissions := []models.Permission{
		{Name: "add_product"},
		{Name: "edit_product"},
		{Name: "delete_product"},
		{Name: "view_product"},
		{Name: "add_plan"},
		{Name: "edit_plan"},
		{Name: "delete_plan"},
		{Name: "view_plan"},
		{Name: "manage_users"},
		{Name: "view_analytics"},
	}

	for _, permission := range permissions {
		db.Create(&permission)
	}

	// Create roles
	adminRole := models.Role{Name: "admin"}
	userRole := models.Role{Name: "user"}
	db.Create(&adminRole)
	db.Create(&userRole)

	// Assign all permissions to admin role
	for _, permission := range permissions {
		db.Create(&models.RolePermission{
			RoleID:       adminRole.ID,
			PermissionID: permission.ID,
		})
	}

	// Assign basic permissions to user role
	basicPermissions := []string{"view_product", "view_plan"}
	for _, permName := range basicPermissions {
		var perm models.Permission
		db.Where("name = ?", permName).First(&perm)
		db.Create(&models.RolePermission{
			RoleID:       userRole.ID,
			PermissionID: perm.ID,
		})
	}

	// Create dummy tenants
	tenants := []models.Tenant{
		{
			TenantName:   "Demo Company",
			TenantDomain: "demo",
			TenantCode:   "DEMO001",
		},
		{
			TenantName:   "Tech Startup",
			TenantDomain: "techstart",
			TenantCode:   "TECH002",
		},
	}

	for _, tenant := range tenants {
		db.Create(&tenant)

		// Create dummy users for each tenant
		users := []models.User{
			{
				Email:    "admin@" + tenant.TenantDomain + ".com",
				Role:     "admin",
				TenantID: &tenant.ID,
			},
			{
				Email:    "user@" + tenant.TenantDomain + ".com",
				Role:     "user",
				TenantID: &tenant.ID,
			},
		}

		for _, user := range users {
			// Hash password: "password123"
			user.PasswordHash = "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"
			db.Create(&user)
		}

		// Create dummy products for each tenant
		products := []models.Product{
			{
				Name:        "Basic SaaS Plan",
				Description: "Essential features for small teams",
				TenantID:    tenant.ID,
			},
			{
				Name:        "Pro SaaS Plan",
				Description: "Advanced features for growing businesses",
				TenantID:    tenant.ID,
			},
		}

		for _, product := range products {
			db.Create(&product)

			// Create dummy plans for each product
			plans := []models.Plan{
				{
					ProductID:   product.ID,
					Name:        "Monthly Plan",
					Description: "Monthly billing",
					Price:       29.99,
					Currency:    "USD",
					Interval:    "monthly",
					Features: models.JSONB{
						"users":        10,
						"storage":      "100GB",
						"api_calls":    1000,
						"support":      "email",
						"custom_domain": false,
					},
					TenantID: tenant.ID,
				},
				{
					ProductID:   product.ID,
					Name:        "Yearly Plan",
					Description: "Yearly billing with discount",
					Price:       299.99,
					Currency:    "USD",
					Interval:    "yearly",
					Features: models.JSONB{
						"users":        10,
						"storage":      "100GB",
						"api_calls":    1000,
						"support":      "email",
						"custom_domain": true,
						"discount":     "2 months free",
					},
					TenantID: tenant.ID,
				},
			}

			for _, plan := range plans {
				db.Create(&plan)
			}
		}
	}

	// Create super admin user
	superAdmin := models.User{
		Email:        "admin@saas.com",
		PasswordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password123
		Role:         "super_admin",
		TenantID:     nil, // No tenant for super admin
	}
	db.Create(&superAdmin)

	log.Println("Dummy data seeded successfully")
	return nil
}