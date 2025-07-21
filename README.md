# n8n Indonesia Creator Hub

Home of Best Indonesian n8n Creator

## Description

Creator Hub is a dedicated platform for Indonesian n8n creators to share, collaborate, and grow their automation expertise. This community-driven space helps creators showcase their workflows, share best practices, and connect with other automation enthusiasts in Indonesia.

## Features

- Community-driven n8n workflow sharing
- Best practices and tutorials for Indonesian creators
- Collaboration opportunities with fellow n8n enthusiasts
- Resource sharing and knowledge exchange
- Showcase of Indonesian n8n success stories.

## Getting Started

You can run this project either with traditional Node.js setup or using Docker containers. Docker is recommended for easier setup and consistent environments.

### Option 1: Docker Setup (Recommended)

#### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20.0 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0 or higher)
- [Git](https://git-scm.com/)

#### Quick Start with Docker

1. Clone the repository:

```bash
git clone https://github.com/your-username/creator-hub.git
cd creator-hub
```

2. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` file and update the configuration values, especially:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `JWT_SECRET`
- Database credentials

3. Make the setup script executable:

```bash
chmod +x docker-setup.sh
```

4. Run the interactive setup script:

```bash
./docker-setup.sh
```

Or manually run with Docker Compose:

**For Development:**

```bash
docker-compose -f docker-compose.dev.yml up --build
```

**For Production:**

```bash
docker-compose up --build -d
```

**For Production with Nginx:**

```bash
docker-compose --profile production up --build -d
```

#### Docker Services

The Docker setup includes:

- **App** (`localhost:3000`): Next.js application
- **PostgreSQL** (`localhost:5432`): Database for application data
- **Supabase API** (`localhost:9999`): Authentication and API server
- **Redis** (`localhost:6379`): Caching (optional)
- **Mailpit** (`localhost:8025`): Email testing UI, SMTP on port 1025
- **Nginx** (`localhost:80/443`): Reverse proxy (production profile only)

#### Docker Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Start production environment
docker-compose up -d

# Start production with Nginx
docker-compose --profile production up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down

# Clean up (remove volumes and images)
docker-compose down -v --rmi all

# Rebuild specific service
docker-compose up --build app
```

#### Accessing Services

- **Application**: http://localhost:3000
- **Mailpit Web UI**: http://localhost:8025 (for email testing)
- **Supabase API**: http://localhost:9999
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Option 2: Traditional Node.js Setup

#### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A code editor (VS Code recommended)
- PostgreSQL database (local or remote)

#### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/creator-hub.git
cd creator-hub
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment:

   - Copy `.env.example` to `.env`
   - Update the environment variables with your configuration

4. Start the development server:

```bash
npm run dev
```

5. Access the application at `http://localhost:3000`

## Usage

Join our community to:

- Share your n8n workflows
- Learn from other Indonesian creators
- Get feedback on your automation solutions
- Collaborate on projects
- Stay updated with n8n best practices

## Environment Variables

The following environment variables are required:

### Application Configuration

```bash
NODE_ENV=production              # Environment mode
PORT=3000                       # Application port
```

### Supabase Configuration

```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:9999     # Supabase API URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key        # Supabase anonymous key
```

### Database Configuration (Docker)

```bash
POSTGRES_DB=creator_hub         # Database name
POSTGRES_USER=postgres          # Database user
POSTGRES_PASSWORD=postgres      # Database password
```

### Authentication

```bash
JWT_SECRET=your-secret-key      # JWT signing secret (change in production)
```

### Email Configuration (Optional)

```bash
SMTP_HOST=localhost             # SMTP host (use mailpit for development)
SMTP_PORT=1025                  # SMTP port (mailpit default)
SMTP_USER=                      # SMTP username (optional for mailpit)
SMTP_PASS=                      # SMTP password (optional for mailpit)
SMTP_ADMIN_EMAIL=admin@localhost # Admin email
```

## Development

### Email Testing with Mailpit

Mailpit is included in the Docker setup for email testing:

1. Access Mailpit web interface: http://localhost:8025
2. All emails sent by the application will appear in Mailpit
3. SMTP server runs on port 1025
4. No authentication required for development

### Database Access

#### Using Docker:

```bash
# Connect to PostgreSQL
docker exec -it creator-hub-supabase-db-1 psql -U postgres -d creator_hub

# View database logs
docker logs creator-hub-supabase-db-1
```

#### Using external tools:

- Host: localhost
- Port: 5432
- Database: creator_hub
- Username: postgres
- Password: postgres

### Debugging

#### View application logs:

```bash
# Development
docker-compose -f docker-compose.dev.yml logs -f app-dev

# Production
docker-compose logs -f app
```

#### Access container shell:

```bash
# Development
docker exec -it creator-hub-app-dev-1 sh

# Production
docker exec -it creator-hub-app-1 sh
```

## Deployment

### Production Deployment with Docker

1. Set production environment variables in `.env`:

```bash
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
JWT_SECRET=your-secure-production-secret
```

2. Deploy with Docker Compose:

```bash
docker-compose up -d --build
```

3. For HTTPS with Nginx:

```bash
# Configure SSL certificates in nginx/ssl/
docker-compose --profile production up -d --build
```

### Environment-specific Configurations

#### Development

- Hot reload enabled
- Source maps included
- Verbose logging
- Mailpit for email testing

#### Production

- Optimized build
- Static file serving
- Error tracking
- Production email configuration

## Troubleshooting

### Common Issues

#### Port conflicts:

```bash
# Check what's using the ports
lsof -i :3000
lsof -i :5432
lsof -i :9999

# Stop conflicting services
docker-compose down
```

#### Database connection issues:

```bash
# Reset database
docker-compose down -v
docker volume rm creator-hub_postgres_data
docker-compose up -d supabase-db
```

#### Build failures:

```bash
# Clean Docker cache
docker system prune -a
docker-compose build --no-cache
```

#### Permission issues:

```bash
# Fix file permissions
chmod +x docker-setup.sh
sudo chown -R $USER:$USER .
```

### Getting Help

If you encounter issues:

1. Check the logs: `docker-compose logs app`
2. Verify environment variables in `.env`
3. Ensure all required ports are available
4. Try rebuilding: `docker-compose up --build`

## Contributing

We welcome contributions from the Indonesian n8n community! Whether you're sharing workflows, writing tutorials, or improving documentation, your input helps make this community stronger.

### Development Setup for Contributors

1. Fork the repository
2. Clone your fork:

```bash
git clone https://github.com/your-username/creator-hub.git
cd creator-hub
```

3. Set up development environment with Docker:

```bash
cp .env.example .env
# Edit .env with your configuration
./docker-setup.sh
# Choose option 1 for development environment
```

4. Make your changes and test:

```bash
# View logs to ensure everything works
docker-compose -f docker-compose.dev.yml logs -f app-dev
```

5. Submit a pull request

### Contribution Guidelines

- Follow the existing code style
- Test your changes thoroughly
- Update documentation as needed
- Ensure Docker setup works correctly
- Add appropriate comments for complex code

## Contact

- Join our [Discord Community](https://discord.com/invite/Vk9H5RkU)
- Visit our [Website](https://n8nid.com)
- Report issues on [GitHub Issues](https://github.com/your-username/creator-hub/issues)

## Acknowledgments

- The n8n team for creating such an amazing automation platform
- All Indonesian n8n creators who contribute to this community
- The open-source community for their continuous support
- Docker and container technology for simplified deployment

## License

This project is licensed under the MIT License - see the LICENSE file for details.
