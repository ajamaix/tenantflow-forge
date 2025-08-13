package core

import (
	"os"
	"strconv"
)

type Config struct {
	Environment     string
	DBHost          string
	DBPort          string
	DBUser          string
	DBPassword      string
	DBName          string
	DBSSLMode       string
	JWTSecret       string
	SuperJWTSecret  string
	JWTExpireHours  int
	Port            string
	AllowOrigins    string
	SMTPHost        string
	SMTPPort        int
	SMTPUser        string
	SMTPPass        string
	SendRealEmail   bool
}

func LoadConfig() *Config {
	return &Config{
		Environment:     getEnv("ENVIRONMENT", "development"),
		DBHost:          getEnv("DB_HOST", "localhost"),
		DBPort:          getEnv("DB_PORT", "5432"),
		DBUser:          getEnv("DB_USER", "postgres"),
		DBPassword:      getEnv("DB_PASSWORD", ""),
		DBName:          getEnv("DB_NAME", "saas_db"),
		DBSSLMode:       getEnv("DB_SSL_MODE", "disable"),
		JWTSecret:       getEnv("JWT_SECRET", "your-jwt-secret-key"),
		SuperJWTSecret:  getEnv("SUPER_JWT_SECRET", "your-super-jwt-secret-key"),
		JWTExpireHours:  getIntEnv("JWT_EXPIRE_HOURS", 24),
		Port:            getEnv("PORT", "8080"),
		AllowOrigins:    getEnv("ALLOW_ORIGINS", "*"),
		SMTPHost:        getEnv("SMTP_HOST", "localhost"),
		SMTPPort:        getIntEnv("SMTP_PORT", 587),
		SMTPUser:        getEnv("SMTP_USER", ""),
		SMTPPass:        getEnv("SMTP_PASS", ""),
		SendRealEmail:   getBoolEnv("SEND_REAL_EMAIL", false),
	}
}

func (c *Config) GetDatabaseURL() string {
	return "postgres://" + c.DBUser + ":" + c.DBPassword + "@" + c.DBHost + ":" + c.DBPort + "/" + c.DBName + "?sslmode=" + c.DBSSLMode
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