# Go SaaS Backend Makefile

.PHONY: help dev build run test clean migrate deps

# Default environment
ENV ?= local

# Help target
help:
	@echo "Available commands:"
	@echo "  make dev         - Run in development mode with hot reload"
	@echo "  make build       - Build the application"
	@echo "  make run         - Run the built application"
	@echo "  make test        - Run tests"
	@echo "  make clean       - Clean build artifacts"
	@echo "  make deps        - Download dependencies"
	@echo "  make migrate     - Run database migrations"
	@echo ""
	@echo "Environment options:"
	@echo "  make dev ENV=local   - Use .env.local (default)"
	@echo "  make dev ENV=dev     - Use .env.dev"
	@echo "  make dev ENV=prod    - Use .env.prod"

# Development with hot reload
dev:
	@echo "Starting development server with $(ENV) environment..."
	@cp .env.$(ENV) .env
	@if command -v air >/dev/null 2>&1; then \
		air; \
	else \
		echo "Installing air for hot reload..."; \
		go install github.com/cosmtrek/air@latest; \
		air; \
	fi

# Build the application
build:
	@echo "Building application..."
	@go build -o bin/app main.go

# Run the built application
run: build
	@echo "Running application with $(ENV) environment..."
	@cp .env.$(ENV) .env
	@./bin/app

# Run tests
test:
	@echo "Running tests..."
	@go test ./...

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf bin/
	@rm -f .env

# Download dependencies
deps:
	@echo "Downloading dependencies..."
	@go mod download
	@go mod tidy

# Database migrations
migrate:
	@echo "Running database migrations with $(ENV) environment..."
	@cp .env.$(ENV) .env
	@go run main.go

# Install tools
tools:
	@echo "Installing development tools..."
	@go install github.com/cosmtrek/air@latest

# Docker commands
docker-build:
	@echo "Building Docker image..."
	@docker build -t saas-backend .

docker-run:
	@echo "Running Docker container..."
	@docker run -p 8080:8080 --env-file .env.$(ENV) saas-backend

# Database commands
db-create:
	@echo "Creating database for $(ENV) environment..."
	@createdb saas_$(ENV)

db-drop:
	@echo "Dropping database for $(ENV) environment..."
	@dropdb saas_$(ENV)

db-reset: db-drop db-create migrate
	@echo "Database reset complete for $(ENV) environment"