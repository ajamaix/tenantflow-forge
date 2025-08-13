package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"

	"backend/core"
	appInit "backend/init"
	"backend/migrations"
	"backend/server"
)

func main() {
	// Load configuration
	cfg := core.LoadConfig()

	// Initialize database
	db, err := core.InitializeDatabase(cfg.GetDatabaseURL())
	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	// Run migrations
	if err := migrations.RunMigrations(db); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}

	// Seed initial data (roles, permissions, etc.)
	if err := migrations.SeedInitialData(db); err != nil {
		log.Printf("Warning: Failed to seed initial data: %v", err)
	}

	// Initialize Fiber app
	fiberApp := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"error":   true,
				"message": err.Error(),
			})
		},
	})

	// Middleware
	fiberApp.Use(recover.New())
	fiberApp.Use(logger.New())
	fiberApp.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
		AllowHeaders:     "*",
		AllowCredentials: true,
	}))

	// Initialize application
	application, cleanup, err := appInit.InitializeApp(db, cfg)
	if err != nil {
		log.Fatal("Failed to initialize application:", err)
	}
	defer cleanup()

	// Setup routes
	server.SetupRoutes(fiberApp, application, db)

	// Health check
	fiberApp.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "healthy",
			"service": "saas-backend",
		})
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(fiberApp.Listen(":" + port))
}
