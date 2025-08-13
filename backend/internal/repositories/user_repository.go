package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type UserRepository interface {
	Create(user *models.User) error
	GetByEmail(email string) (*models.User, error)
	GetByEmailAndTenant(email string, tenantID *int) (*models.User, error)
	GetByID(id int) (*models.User, error)
	Update(user *models.User) error
	Delete(id int) error
	GetByTenant(tenantID int) ([]models.User, error)
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *userRepository) GetByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) GetByEmailAndTenant(email string, tenantID *int) (*models.User, error) {
	var user models.User
	query := r.db.Where("email = ?", email)
	
	if tenantID != nil {
		query = query.Where("tenant_id = ?", *tenantID)
	} else {
		query = query.Where("tenant_id IS NULL")
	}
	
	err := query.First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) GetByID(id int) (*models.User, error) {
	var user models.User
	err := r.db.Preload("Tenant").Where("id = ?", id).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *userRepository) Delete(id int) error {
	return r.db.Delete(&models.User{}, id).Error
}

func (r *userRepository) GetByTenant(tenantID int) ([]models.User, error) {
	var users []models.User
	err := r.db.Where("tenant_id = ?", tenantID).Find(&users).Error
	return users, err
}