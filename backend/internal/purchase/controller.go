package purchase

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/your-app/backend/models"
)

type Controller struct {
	service Service
}

func NewController(service Service) *Controller {
	return &Controller{service: service}
}

// CreatePurchase creates a new purchase
func (c *Controller) CreatePurchase(ctx *gin.Context) {
	userID := ctx.GetInt("user_id")
	tenantID := ctx.GetInt("tenant_id")

	var req models.CreatePurchaseRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": true, "message": err.Error()})
		return
	}

	purchase, err := c.service.CreatePurchase(userID, tenantID, req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": true, "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"error": false, "data": purchase})
}

// GetUserPurchases gets all purchases for the current user
func (c *Controller) GetUserPurchases(ctx *gin.Context) {
	userID := ctx.GetInt("user_id")
	tenantID := ctx.GetInt("tenant_id")

	purchases, err := c.service.GetUserPurchases(userID, tenantID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": true, "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"error": false, "data": purchases})
}

// GetPurchaseByID gets a specific purchase by ID
func (c *Controller) GetPurchaseByID(ctx *gin.Context) {
	userID := ctx.GetInt("user_id")
	tenantID := ctx.GetInt("tenant_id")
	
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": true, "message": "Invalid purchase ID"})
		return
	}

	purchase, err := c.service.GetPurchaseByID(id, userID, tenantID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": true, "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"error": false, "data": purchase})
}

// GetActivePurchases gets all active purchases for the current user
func (c *Controller) GetActivePurchases(ctx *gin.Context) {
	userID := ctx.GetInt("user_id")
	tenantID := ctx.GetInt("tenant_id")

	purchases, err := c.service.GetActivePurchases(userID, tenantID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": true, "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"error": false, "data": purchases})
}