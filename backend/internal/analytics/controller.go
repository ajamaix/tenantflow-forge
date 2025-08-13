package analytics

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Controller struct {
	service Service
}

func NewController(service Service) *Controller {
	return &Controller{service: service}
}

// GetDashboardMetrics gets dashboard metrics for the current tenant
func (c *Controller) GetDashboardMetrics(ctx *gin.Context) {
	tenantID := ctx.GetInt("tenant_id")

	metrics, err := c.service.GetDashboardMetrics(tenantID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": true, "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"error": false, "data": metrics})
}

// GetRecentActivity gets recent activity for the current tenant
func (c *Controller) GetRecentActivity(ctx *gin.Context) {
	tenantID := ctx.GetInt("tenant_id")

	activities, err := c.service.GetRecentActivity(tenantID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": true, "message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"error": false, "data": activities})
}