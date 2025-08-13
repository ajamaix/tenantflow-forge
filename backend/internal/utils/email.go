package utils

import (
	"fmt"
	"log"
	"strconv"

	"gopkg.in/gomail.v2"
	"saas-backend/internal/config"
)

type EmailService interface {
	SendWelcomeEmail(email, name string) error
	SendPasswordResetEmail(email, resetToken string) error
}

type emailService struct {
	cfg *config.Config
}

func NewEmailService(cfg *config.Config) EmailService {
	return &emailService{cfg: cfg}
}

func (s *emailService) SendWelcomeEmail(email, name string) error {
	subject := "Welcome to SaaS Platform!"
	body := fmt.Sprintf(`
		<h1>Welcome %s!</h1>
		<p>Thank you for joining our SaaS platform. We're excited to have you on board!</p>
		<p>You can now access your dashboard and start exploring our features.</p>
		<p>If you have any questions, feel free to reach out to our support team.</p>
		<p>Best regards,<br>The SaaS Platform Team</p>
	`, name)

	return s.sendEmail(email, subject, body)
}

func (s *emailService) SendPasswordResetEmail(email, resetToken string) error {
	subject := "Password Reset Request"
	body := fmt.Sprintf(`
		<h1>Password Reset Request</h1>
		<p>You have requested to reset your password. Please use the following token:</p>
		<p><strong>%s</strong></p>
		<p>This token will expire in 1 hour.</p>
		<p>If you didn't request this password reset, please ignore this email.</p>
		<p>Best regards,<br>The SaaS Platform Team</p>
	`, resetToken)

	return s.sendEmail(email, subject, body)
}

func (s *emailService) sendEmail(to, subject, body string) error {
	if !s.cfg.SendRealEmail {
		// Log email instead of sending
		log.Printf("EMAIL LOG - To: %s, Subject: %s, Body: %s", to, subject, body)
		return nil
	}

	// Send real email using SMTP
	m := gomail.NewMessage()
	m.SetHeader("From", s.cfg.SMTPUser)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	d := gomail.NewDialer(s.cfg.SMTPHost, s.cfg.SMTPPort, s.cfg.SMTPUser, s.cfg.SMTPPass)

	if err := d.DialAndSend(m); err != nil {
		log.Printf("Failed to send email to %s: %v", to, err)
		return err
	}

	log.Printf("Email sent successfully to %s", to)
	return nil
}