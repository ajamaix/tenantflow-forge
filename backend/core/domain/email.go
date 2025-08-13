package domain

type EmailService interface {
	SendWelcomeEmail(email, name string) error
	SendPasswordResetEmail(email, resetToken string) error
}
