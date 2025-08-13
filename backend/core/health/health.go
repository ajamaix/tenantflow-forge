package health

import "github.com/gofiber/fiber/v2"

func RegisterHealth(app *fiber.App) {

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "healthy",
			"service": "saas-backend",
		})
	})

}
