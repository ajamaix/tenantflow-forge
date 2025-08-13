package models

import (
	"time"
	"database/sql/driver"
	"encoding/json"
	"errors"
)

// JSONB type for PostgreSQL JSON fields
type JSONB map[string]interface{}

func (j JSONB) Value() (driver.Value, error) {
	return json.Marshal(j)
}

func (j *JSONB) Scan(value interface{}) error {
	if value == nil {
		return nil
	}
	
	switch v := value.(type) {
	case []byte:
		return json.Unmarshal(v, j)
	case string:
		return json.Unmarshal([]byte(v), j)
	default:
		return errors.New("cannot scan JSONB")
	}
}

// Tenant represents a tenant organization
type Tenant struct {
	ID           int       `json:"id" gorm:"primaryKey;autoIncrement"`
	TenantDomain string    `json:"tenant_domain" gorm:"uniqueIndex;not null"`
	TenantName   string    `json:"tenant_name" gorm:"not null"`
	TenantCode   string    `json:"tenant_code" gorm:"uniqueIndex;not null"`
	CreatedAt    time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt    time.Time `json:"updated_at" gorm:"autoUpdateTime"`
	
	// Relationships
	Users    []User    `json:"users,omitempty" gorm:"foreignKey:TenantID"`
	Products []Product `json:"products,omitempty" gorm:"foreignKey:TenantID"`
}

// User represents a user in the system
type User struct {
	ID           int        `json:"id" gorm:"primaryKey;autoIncrement"`
	Email        string     `json:"email" gorm:"uniqueIndex;not null"`
	PasswordHash string     `json:"-" gorm:"not null"`
	Role         string     `json:"role" gorm:"not null;default:'user'"`
	TenantID     *int       `json:"tenant_id" gorm:"index"`
	CreatedAt    time.Time  `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt    time.Time  `json:"updated_at" gorm:"autoUpdateTime"`
	
	// Relationships
	Tenant *Tenant `json:"tenant,omitempty" gorm:"foreignKey:TenantID"`
}

// Product represents a product offering
type Product struct {
	ID          int       `json:"id" gorm:"primaryKey;autoIncrement"`
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description" gorm:"type:text"`
	TenantID    int       `json:"tenant_id" gorm:"not null;index"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
	
	// Relationships
	Tenant *Tenant `json:"tenant,omitempty" gorm:"foreignKey:TenantID"`
	Plans  []Plan  `json:"plans,omitempty" gorm:"foreignKey:ProductID"`
}

// Plan represents a pricing plan for a product
type Plan struct {
	ID          int       `json:"id" gorm:"primaryKey;autoIncrement"`
	ProductID   int       `json:"product_id" gorm:"not null;index"`
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description" gorm:"type:text"`
	Price       float64   `json:"price" gorm:"type:decimal(10,2);not null"`
	Currency    string    `json:"currency" gorm:"not null;default:'USD'"`
	Interval    string    `json:"interval" gorm:"not null"` // monthly, yearly, etc.
	Features    JSONB     `json:"features" gorm:"type:jsonb"`
	TenantID    int       `json:"tenant_id" gorm:"not null;index"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
	
	// Relationships
	Product *Product `json:"product,omitempty" gorm:"foreignKey:ProductID"`
	Tenant  *Tenant  `json:"tenant,omitempty" gorm:"foreignKey:TenantID"`
}

// Role represents a role in the system
type Role struct {
	ID       int    `json:"id" gorm:"primaryKey;autoIncrement"`
	Name     string `json:"name" gorm:"not null"`
	TenantID *int   `json:"tenant_id" gorm:"index"` // nullable for global roles
	
	// Relationships
	Permissions []Permission `json:"permissions,omitempty" gorm:"many2many:role_permissions;"`
}

// Permission represents a permission in the system
type Permission struct {
	ID   int    `json:"id" gorm:"primaryKey;autoIncrement"`
	Name string `json:"name" gorm:"uniqueIndex;not null"`
	
	// Relationships
	Roles []Role `json:"roles,omitempty" gorm:"many2many:role_permissions;"`
}

// RolePermission represents the many-to-many relationship between roles and permissions
type RolePermission struct {
	RoleID       int `json:"role_id" gorm:"primaryKey"`
	PermissionID int `json:"permission_id" gorm:"primaryKey"`
	
	// Relationships
	Role       Role       `json:"role" gorm:"foreignKey:RoleID"`
	Permission Permission `json:"permission" gorm:"foreignKey:PermissionID"`
}

// Request/Response DTOs
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=4"`
}

type RegisterRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=4"`
	Name     string `json:"name" validate:"required"`
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
}

type CreatePlanRequest struct {
	Name        string                 `json:"name" validate:"required"`
	Description string                 `json:"description"`
	Price       float64                `json:"price" validate:"required,min=0"`
	Currency    string                 `json:"currency" validate:"required"`
	Interval    string                 `json:"interval" validate:"required"`
	Features    map[string]interface{} `json:"features"`
}