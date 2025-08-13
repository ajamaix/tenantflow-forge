package auth

import (
	"backend/models"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *UserRepository) GetByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) GetByEmailAndTenant(email string, tenantID *int) (*models.User, error) {
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

func (r *UserRepository) GetByID(id int) (*models.User, error) {
	var user models.User
	err := r.db.Preload("Tenant").Where("id = ?", id).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *UserRepository) Delete(id int) error {
	return r.db.Delete(&models.User{}, id).Error
}

func (r *UserRepository) GetByTenant(tenantID int) ([]models.User, error) {
	var users []models.User
	err := r.db.Where("tenant_id = ?", tenantID).Find(&users).Error
	return users, err
}
