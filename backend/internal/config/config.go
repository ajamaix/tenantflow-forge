package config

import (
	"os"
	"strconv"
)

type Config struct {
	DatabaseURL     string
	JWTSecret       string
	SuperJWTSecret  string
	Port            string
	Environment     string
	UseDummyData    bool
	SendRealEmail   bool
	SMTPHost        string
	SMTPPort        int
	SMTPUser        string
	SMTPPass        string
}

func Load() *Config {
	return &Config{
		DatabaseURL:     getEnv("DATABASE_URL", "postgres://user:password@localhost:5432/saas_db?sslmode=disable"),
		JWTSecret:       getEnv("JWT_SECRET", "your-jwt-secret-key"),
		SuperJWTSecret:  getEnv("SUPER_JWT_SECRET", "your-super-jwt-secret-key"),
		Port:            getEnv("PORT", "8080"),
		Environment:     getEnv("ENVIRONMENT", "development"),
		UseDummyData:    getBoolEnv("USE_DUMMY_DATA", true),
		SendRealEmail:   getBoolEnv("SEND_REAL_EMAIL", false),
		SMTPHost:        getEnv("SMTP_HOST", "localhost"),
		SMTPPort:        getIntEnv("SMTP_PORT", 587),
		SMTPUser:        getEnv("SMTP_USER", ""),
		SMTPPass:        getEnv("SMTP_PASS", ""),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getBoolEnv(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if parsed, err := strconv.ParseBool(value); err == nil {
			return parsed
		}
	}
	return defaultValue
}

func getIntEnv(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if parsed, err := strconv.Atoi(value); err == nil {
			return parsed
		}
	}
	return defaultValue
}