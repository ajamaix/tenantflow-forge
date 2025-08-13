package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"

	"gorm.io/gorm"
)

// Custom JSONB type for PostgreSQL
type JSONB map[string]interface{}

func (j JSONB) Value() (driver.Value, error) {
	if j == nil {
		return nil, nil
	}
	return json.Marshal(j)
}

func (j *JSONB) Scan(value interface{}) error {
	if value == nil {
		*j = nil
		return nil
	}
	
	switch v := value.(type) {
	case []byte:
		return json.Unmarshal(v, j)
	case string:
		return json.Unmarshal([]byte(v), j)
	default:
		return errors.New("cannot scan non-string value into JSONB")
	}
}

// Core entities
type Tenant struct {
	ID           int       `json:"id" gorm:"primaryKey;autoIncrement"`
	TenantName   string    `json:"tenant_name" gorm:"not null"`
	TenantDomain string    `json:"tenant_domain" gorm:"unique;not null"`
	TenantCode   string    `json:"tenant_code" gorm:"unique;not null"`
	CreatedAt    time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt    time.Time `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt    gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
	
	// Relationships
	Users    []User    `json:"users,omitempty" gorm:"foreignKey:TenantID"`
	Products []Product `json:"products,omitempty" gorm:"foreignKey:TenantID"`
}

type User struct {
	ID           int        `json:"id" gorm:"primaryKey;autoIncrement"`
	Email        string     `json:"email" gorm:"unique;not null"`
	PasswordHash string     `json:"-" gorm:"not null"`
	FirstName    string     `json:"first_name"`
	LastName     string     `json:"last_name"`
	Role         string     `json:"role" gorm:"default:'user'"`
	TenantID     *int       `json:"tenant_id" gorm:"index"`
	CreatedAt    time.Time  `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt    time.Time  `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt    gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
	
	// Relationships
	Tenant *Tenant `json:"tenant,omitempty" gorm:"foreignKey:TenantID"`
	Purchases []Purchase `json:"purchases,omitempty" gorm:"foreignKey:UserID"`
}

type Product struct {
	ID          int       `json:"id" gorm:"primaryKey;autoIncrement"`
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description"`
	URL         string    `json:"url"`
	Image       string    `json:"image" gorm:"type:text"` // Base64 encoded image
	Active      *bool     `json:"active" gorm:"default:true"`
	TenantID    int       `json:"tenant_id" gorm:"not null;index"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt   gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
	
	// Relationships
	Tenant *Tenant `json:"tenant,omitempty" gorm:"foreignKey:TenantID"`
	Plans  []Plan  `json:"plans,omitempty" gorm:"foreignKey:ProductID"`
}

type Plan struct {
	ID          int       `json:"id" gorm:"primaryKey;autoIncrement"`
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description"`
	Price       float64   `json:"price" gorm:"not null"`
	Currency    string    `json:"currency" gorm:"default:'USD'"`
	Interval    string    `json:"interval" gorm:"default:'monthly'"` // monthly, yearly
	Features    JSONB     `json:"features" gorm:"type:jsonb"`
	ProductID   int       `json:"product_id" gorm:"not null;index"`
	TenantID    int       `json:"tenant_id" gorm:"not null;index"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt   gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
	
	// Relationships
	Product *Product `json:"product,omitempty" gorm:"foreignKey:ProductID"`
	Tenant  *Tenant  `json:"tenant,omitempty" gorm:"foreignKey:TenantID"`
	Purchases []Purchase `json:"purchases,omitempty" gorm:"foreignKey:PlanID"`
}

// Purchase tracking models
type Purchase struct {
	ID            int       `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID        int       `json:"user_id" gorm:"not null;index"`
	PlanID        int       `json:"plan_id" gorm:"not null;index"`
	TransactionID string    `json:"transaction_id" gorm:"unique;not null"`
	Amount        float64   `json:"amount" gorm:"not null"`
	Currency      string    `json:"currency" gorm:"not null"`
	Status        string    `json:"status" gorm:"default:'active'"` // active, expired, cancelled
	PurchasedAt   time.Time `json:"purchased_at" gorm:"autoCreateTime"`
	ExpiresAt     *time.Time `json:"expires_at"`
	TenantID      int       `json:"tenant_id" gorm:"not null;index"`
	CreatedAt     time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt     time.Time `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt     gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
	
	// Relationships
	User   *User   `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Plan   *Plan   `json:"plan,omitempty" gorm:"foreignKey:PlanID"`
	Tenant *Tenant `json:"tenant,omitempty" gorm:"foreignKey:TenantID"`
}

// Activity tracking
type Activity struct {
	ID          int       `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID      int       `json:"user_id" gorm:"not null;index"`
	TenantID    int       `json:"tenant_id" gorm:"not null;index"`
	Type        string    `json:"type" gorm:"not null"` // product_created, plan_created, purchase_made, etc.
	Description string    `json:"description" gorm:"not null"`
	EntityType  string    `json:"entity_type"` // product, plan, purchase, user
	EntityID    *int      `json:"entity_id"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	
	// Relationships
	User   *User   `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Tenant *Tenant `json:"tenant,omitempty" gorm:"foreignKey:TenantID"`
}

type Role struct {
	ID          int       `json:"id" gorm:"primaryKey;autoIncrement"`
	Name        string    `json:"name" gorm:"unique;not null"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
	
	// Relationships
	Permissions []Permission `json:"permissions,omitempty" gorm:"many2many:role_permissions;"`
}

type Permission struct {
	ID          int       `json:"id" gorm:"primaryKey;autoIncrement"`
	Name        string    `json:"name" gorm:"unique;not null"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
	
	// Relationships
	Roles []Role `json:"roles,omitempty" gorm:"many2many:role_permissions;"`
}

type RolePermission struct {
	RoleID       int `json:"role_id" gorm:"primaryKey"`
	PermissionID int `json:"permission_id" gorm:"primaryKey"`
}

// Request/Response DTOs
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

type RegisterRequest struct {
	Email     string `json:"email" validate:"required,email"`
	Password  string `json:"password" validate:"required,min=6"`
	FirstName string `json:"first_name" validate:"required"`
	LastName  string `json:"last_name" validate:"required"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type CreateTenantRequest struct {
	TenantName   string `json:"tenant_name" validate:"required"`
	TenantDomain string `json:"tenant_domain" validate:"required"`
	TenantCode   string `json:"tenant_code" validate:"required"`
}

type CreateProductRequest struct {
	Name        string `json:"name" validate:"required"`
	Description string `json:"description"`
	URL         string `json:"url"`
	Image       string `json:"image"` // Base64 encoded image
	Active      *bool  `json:"active"`
}

type CreatePlanRequest struct {
	Name        string  `json:"name" validate:"required"`
	Description string  `json:"description"`
	Price       float64 `json:"price" validate:"required,min=0"`
	Currency    string  `json:"currency"`
	Interval    string  `json:"interval"`
	Features    JSONB   `json:"features"`
}

type CreatePurchaseRequest struct {
	PlanID        int    `json:"plan_id" validate:"required"`
	TransactionID string `json:"transaction_id" validate:"required"`
	PaymentMethod string `json:"payment_method" validate:"required"`
}

// Dashboard metrics DTOs
type DashboardMetrics struct {
	TotalProducts  int     `json:"total_products"`
	ActivePlans    int     `json:"active_plans"`
	TeamMembers    int     `json:"team_members"`
	RevenueGrowth  float64 `json:"revenue_growth"`
	TotalRevenue   float64 `json:"total_revenue"`
	ActivePurchases int    `json:"active_purchases"`
}