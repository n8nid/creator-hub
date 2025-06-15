#!/bin/bash

# Creator Hub Docker Setup Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Function to check if .env file exists
check_env_file() {
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from .env.example..."
        if [ -f .env.example ]; then
            cp .env.example .env
            print_warning "Please edit .env file with your actual configuration values"
            print_warning "Especially set your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
        else
            print_error ".env.example file not found. Cannot create .env file."
            exit 1
        fi
    else
        print_success ".env file found"
    fi
}

# Function to create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p nginx/ssl
    mkdir -p scripts
    print_success "Directories created"
}

# Function to build and run for development
run_development() {
    print_status "Starting development environment..."
    
    # Stop any running containers
    docker-compose -f docker-compose.dev.yml down
    
    # Build and start services
    docker-compose -f docker-compose.dev.yml up --build -d
    
    print_success "Development environment started!"
    print_status "Application will be available at: http://localhost:3000"
    print_status "Database will be available at: localhost:5432"
    print_status "Redis will be available at: localhost:6379"
    print_status "Mailpit Web UI will be available at: http://localhost:8025"
    print_status "Mailpit SMTP server running on: localhost:1025"
    
    # Show logs
    print_status "Showing logs (Ctrl+C to exit logs, containers will keep running)..."
    docker-compose -f docker-compose.dev.yml logs -f app-dev
}

# Function to build and run for production
run_production() {
    print_status "Starting production environment..."
    
    # Stop any running containers
    docker-compose down
    
    # Build and start services
    docker-compose up --build -d
    
    print_success "Production environment started!"
    print_status "Application will be available at: http://localhost:3000"
    print_status "Database will be available at: localhost:5432"
    print_status "Redis will be available at: localhost:6379"
    print_status "Supabase Auth API will be available at: http://localhost:9999"
    print_status "Mailpit Web UI will be available at: http://localhost:8025"
    print_status "Mailpit SMTP server running on: localhost:1025"
    
    # Show logs
    print_status "Showing logs (Ctrl+C to exit logs, containers will keep running)..."
    docker-compose logs -f app
}

# Function to run simple production (without local Supabase auth)
run_simple_production() {
    print_status "Starting simple production environment (use Supabase Cloud for auth)..."
    
    # Stop any running containers
    docker-compose -f docker-compose.simple.yml down
    
    # Build and start services
    docker-compose -f docker-compose.simple.yml up --build -d
    
    print_success "Simple production environment started!"
    print_status "Application will be available at: http://localhost:3000"
    print_status "Database will be available at: localhost:5432"
    print_status "Redis will be available at: localhost:6379"
    print_status "Mailpit Web UI will be available at: http://localhost:8025"
    print_warning "Make sure to configure your Supabase Cloud credentials in .env file"
    
    # Show logs
    print_status "Showing logs (Ctrl+C to exit logs, containers will keep running)..."
    docker-compose -f docker-compose.simple.yml logs -f app
}

# Function to run with Nginx (production with reverse proxy)
run_with_nginx() {
    print_status "Starting production environment with Nginx..."
    
    # Stop any running containers
    docker-compose down
    
    # Build and start services including Nginx
    docker-compose --profile production up --build -d
    
    print_success "Production environment with Nginx started!"
    print_status "Application will be available at: http://localhost"
    print_status "HTTPS will be available at: https://localhost (if SSL configured)"
    
    # Show logs
    print_status "Showing logs (Ctrl+C to exit logs, containers will keep running)..."
    docker-compose logs -f app nginx
}

# Function to stop all services
stop_services() {
    print_status "Stopping all services..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    print_success "All services stopped"
}

# Function to clean up (remove containers, volumes, images)
cleanup() {
    print_warning "This will remove all containers, volumes, and images related to this project."
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleaning up..."
        docker-compose down -v --rmi all
        docker-compose -f docker-compose.dev.yml down -v --rmi all
        print_success "Cleanup completed"
    else
        print_status "Cleanup cancelled"
    fi
}

# Function to show logs
show_logs() {
    if [ "$1" = "dev" ]; then
        docker-compose -f docker-compose.dev.yml logs -f
    else
        docker-compose logs -f
    fi
}

# Function to show status
show_status() {
    print_status "Development services:"
    docker-compose -f docker-compose.dev.yml ps
    
    print_status "Production services:"
    docker-compose ps
}

# Main script
main() {
    echo "================================"
    echo "Creator Hub Docker Setup Script"
    echo "================================"
    echo
    
    # Check prerequisites
    check_docker
    check_env_file
    create_directories
    
    # Show menu
    echo
    echo "Choose an option:"
    echo "1) Development environment"
    echo "2) Production environment (with local Supabase auth)"
    echo "3) Simple production (use Supabase Cloud for auth)"
    echo "4) Production with Nginx"
    echo "5) Stop all services"
    echo "6) Show logs (dev)"
    echo "7) Show logs (prod)"
    echo "8) Show status"
    echo "9) Cleanup (remove all)"
    echo "10) Exit"
    echo
    
    read -p "Enter your choice (1-10): " choice
    
    case $choice in
        1)
            run_development
            ;;
        2)
            run_production
            ;;
        3)
            run_simple_production
            ;;
        4)
            run_with_nginx
            ;;
        5)
            show_logs "dev"
            ;;
        6)
            show_logs "prod"
            ;;
        7)
            show_status
            ;;
        8)
            cleanup
            ;;
        9)
            print_status "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid option. Please choose 1-9."
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
