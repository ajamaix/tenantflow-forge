package auth

import (
	"backend/core"
	coreDomain "backend/core/domain"
	"backend/internal/domain"
	"backend/internal/middleware"
	"backend/models"
	"errors"

	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	userRepo domain.UserRepository
	cfg      *core.Config
	email    coreDomain.EmailService
}

func NewAuthService(userRepo domain.UserRepository, cfg *core.Config, email coreDomain.EmailService) *Service {
	return &Service{
		userRepo: userRepo,
		cfg:      cfg,
		email:    email,
	}
}

func (s *Service) Login(email, password string, tenantID *int, isSuperAdmin bool) (*models.AuthResponse, error) {
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

func (s *Service) Register(req models.RegisterRequest, tenantID *int) (*models.AuthResponse, error) {
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
	go s.email.SendWelcomeEmail(user.Email, req.FirstName)

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

func (s *Service) HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func (s *Service) ComparePassword(hashedPassword, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}
