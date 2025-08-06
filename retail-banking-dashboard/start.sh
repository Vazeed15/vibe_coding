#!/bin/bash

# Smart Retail Banking Dashboard - Startup Script
# This script provides easy startup options for the banking dashboard

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    printf "${1}${2}${NC}\n"
}

print_header() {
    echo
    print_color $BLUE "🏦 Smart Retail Banking Dashboard"
    print_color $BLUE "=================================="
    echo
}

print_success() {
    print_color $GREEN "✅ $1"
}

print_warning() {
    print_color $YELLOW "⚠️  $1"
}

print_error() {
    print_color $RED "❌ $1"
}

print_info() {
    print_color $BLUE "ℹ️  $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Docker and Docker Compose
check_docker() {
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        print_info "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi

    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        print_info "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi

    # Check if Docker daemon is running
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi

    print_success "Docker and Docker Compose are available"
}

# Function to check Node.js and Python for local development
check_local_deps() {
    local missing_deps=()

    if ! command_exists node; then
        missing_deps+=("Node.js (v18+)")
    fi

    if ! command_exists python3; then
        missing_deps+=("Python (v3.11+)")
    fi

    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_warning "Missing dependencies for local development:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        print_info "Consider using Docker deployment instead (option 1)"
        return 1
    fi

    print_success "Local development dependencies are available"
    return 0
}

# Function to start with Docker
start_docker() {
    print_info "Starting with Docker Compose..."
    
    # Build and start services
    docker-compose up --build -d
    
    print_success "Services are starting up..."
    print_info "Waiting for services to be healthy..."
    
    # Wait for backend to be healthy
    max_attempts=30
    attempt=0
    while [ $attempt -lt $max_attempts ]; do
        if docker-compose ps | grep -q "healthy"; then
            break
        fi
        sleep 2
        ((attempt++))
        printf "."
    done
    echo

    if [ $attempt -eq $max_attempts ]; then
        print_error "Services failed to start properly. Check logs with: docker-compose logs"
        exit 1
    fi

    print_success "All services are running!"
    echo
    print_info "🌐 Frontend: http://localhost:3000"
    print_info "🔧 Backend API: http://localhost:8000"
    print_info "📚 API Docs: http://localhost:8000/docs"
    echo
    print_info "Demo Credentials:"
    print_info "Email: john.doe@email.com"
    print_info "Password: demo123"
    echo
    print_info "To stop services: docker-compose down"
    print_info "To view logs: docker-compose logs -f"
}

# Function to start local development
start_local() {
    print_info "Starting local development environment..."
    
    # Check if virtual environment exists for backend
    if [ ! -d "backend/venv" ]; then
        print_info "Creating Python virtual environment..."
        cd backend
        python3 -m venv venv
        cd ..
    fi

    # Setup backend
    print_info "Setting up backend..."
    cd backend
    source venv/bin/activate
    pip install -r requirements.txt
    
    # Initialize database if it doesn't exist
    if [ ! -f "banking.db" ]; then
        print_info "Initializing database..."
        cd db
        python seed_data.py
        cd ..
    fi
    
    # Start backend in background
    print_info "Starting backend server..."
    uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
    backend_pid=$!
    cd ..

    # Setup frontend
    print_info "Setting up frontend..."
    cd frontend
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_info "Installing frontend dependencies..."
        npm install
    fi
    
    # Start frontend
    print_info "Starting frontend server..."
    npm start &
    frontend_pid=$!
    cd ..

    # Wait a moment for servers to start
    sleep 5

    print_success "Development servers are starting!"
    echo
    print_info "🌐 Frontend: http://localhost:3000"
    print_info "🔧 Backend API: http://localhost:8000"
    print_info "📚 API Docs: http://localhost:8000/docs"
    echo
    print_info "Demo Credentials:"
    print_info "Email: john.doe@email.com"
    print_info "Password: demo123"
    echo
    print_warning "Press Ctrl+C to stop both servers"
    
    # Wait for user interrupt
    trap 'kill $backend_pid $frontend_pid 2>/dev/null; exit' INT
    wait
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [option]"
    echo
    echo "Options:"
    echo "  1, docker     Start with Docker Compose (recommended)"
    echo "  2, local      Start local development environment"
    echo "  status        Show service status"
    echo "  stop          Stop running services"
    echo "  logs          Show service logs"
    echo "  clean         Clean up Docker resources"
    echo "  help          Show this help message"
    echo
}

# Function to show status
show_status() {
    print_info "Checking service status..."
    
    if command_exists docker-compose; then
        echo
        print_info "Docker Compose Services:"
        docker-compose ps 2>/dev/null || print_warning "No Docker services running"
    fi
    
    echo
    print_info "Local Development Servers:"
    if lsof -ti:8000 >/dev/null 2>&1; then
        print_success "Backend running on port 8000"
    else
        print_warning "Backend not running on port 8000"
    fi
    
    if lsof -ti:3000 >/dev/null 2>&1; then
        print_success "Frontend running on port 3000"
    else
        print_warning "Frontend not running on port 3000"
    fi
}

# Function to stop services
stop_services() {
    print_info "Stopping services..."
    
    # Stop Docker services
    if command_exists docker-compose; then
        docker-compose down 2>/dev/null || true
        print_success "Docker services stopped"
    fi
    
    # Stop local development servers
    pkill -f "uvicorn main:app" 2>/dev/null || true
    pkill -f "react-scripts start" 2>/dev/null || true
    print_success "Local development servers stopped"
}

# Function to show logs
show_logs() {
    if command_exists docker-compose; then
        print_info "Showing Docker Compose logs..."
        docker-compose logs -f
    else
        print_error "Docker Compose not available"
        exit 1
    fi
}

# Function to clean up
clean_up() {
    print_info "Cleaning up Docker resources..."
    docker-compose down -v 2>/dev/null || true
    docker system prune -f
    print_success "Cleanup completed"
}

# Main script logic
main() {
    print_header
    
    case "${1:-}" in
        "1"|"docker")
            check_docker
            start_docker
            ;;
        "2"|"local")
            if check_local_deps; then
                start_local
            else
                print_error "Local dependencies not available. Use Docker instead."
                exit 1
            fi
            ;;
        "status")
            show_status
            ;;
        "stop")
            stop_services
            ;;
        "logs")
            show_logs
            ;;
        "clean")
            clean_up
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        "")
            print_info "Choose deployment option:"
            echo "1) Docker Compose (recommended)"
            echo "2) Local development"
            echo
            read -p "Enter your choice (1-2): " choice
            case $choice in
                1) main "docker" ;;
                2) main "local" ;;
                *) print_error "Invalid choice" ;;
            esac
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"