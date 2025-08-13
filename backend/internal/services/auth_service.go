package services

import (
	"errors"

	"golang.org/x/crypto/bcrypt"
	"saas-backend/internal/config"
	"saas-backend/internal/middleware"
	"saas-backend/internal/models"
	"saas-backend/internal/repositories"
	"saas-backend/internal/utils"
)

type AuthService interface {
	Login(email, password string, tenantID *int, isSuperAdmin bool) (*models.AuthResponse, error)
	Register(req models.RegisterRequest, tenantID *int) (*models.AuthResponse, error)
	HashPassword(password string) (string, error)
	ComparePassword(hashedPassword, password string) error
}

type authService struct {
	userRepo repositories.UserRepository
	cfg      *config.Config
	email    utils.EmailService
}

func NewAuthService(userRepo repositories.UserRepository, cfg *config.Config, email utils.EmailService) AuthService {
	return &authService{
		userRepo: userRepo,
		cfg:      cfg,
		email:    email,
	}
}

func (s *authService) Login(email, password string, tenantID *int, isSuperAdmin bool) (*models.AuthResponse, error) {
	var user *models.User
	var err error

	if isSuperAdmin {
		// Super admin login - no tenant context
		user, err = s.userRepo.GetByEmailAndTenant(email, nil)
		if err != nil {
			return nil, errors.New("invalid credentials")
		}
		
		if user.Role != "super_admin" {
			return nil, errors.New("super admin access required")
		}
	} else {
		// Regular tenant user login
		user, err = s.userRepo.GetByEmailAndTenant(email, tenantID)
		if err != nil {
			return nil, errors.New("invalid credentials")
		}
		
		if user.TenantID == nil || *user.TenantID != *tenantID {
			return nil, errors.New("invalid tenant")
		}
	}

	// Compare password
	if err := s.ComparePassword(user.PasswordHash, password); err != nil {
		return nil, errors.New("invalid credentials")
	}

	// Generate JWT
	var secret string
	if isSuperAdmin {
		secret = s.cfg.SuperJWTSecret
	} else {
		secret = s.cfg.JWTSecret
	}

	token, err := middleware.GenerateJWT(user.ID, user.Email, user.Role, user.TenantID, secret)
	if err != nil {
		return nil, errors.New("failed to generate token")
	}

	return &models.AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}

func (s *authService) Register(req models.RegisterRequest, tenantID *int) (*models.AuthResponse, error) {
	// Check if user already exists
	existingUser, _ := s.userRepo.GetByEmailAndTenant(req.Email, tenantID)
	if existingUser != nil {
		return nil, errors.New("user already exists")
	}

	// Hash password
	hashedPassword, err := s.HashPassword(req.Password)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	// Create user
	user := &models.User{
		Email:        req.Email,
		PasswordHash: hashedPassword,
		Role:         "user", // Default role
		TenantID:     tenantID,
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, errors.New("failed to create user")
	}

	// Send welcome email
	go s.email.SendWelcomeEmail(user.Email, req.Name)

	// Generate JWT
	token, err := middleware.GenerateJWT(user.ID, user.Email, user.Role, user.TenantID, s.cfg.JWTSecret)
	if err != nil {
		return nil, errors.New("failed to generate token")
	}

	return &models.AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}

func (s *authService) HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func (s *authService) ComparePassword(hashedPassword, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}