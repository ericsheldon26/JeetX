# Authentication Backend

Full-featured authentication backend built with Node.js, PostgreSQL, Redis, and Firebase.

## Features

- 🔐 Firebase Authentication integration
- 📧 Email & Phone OTP verification
- 🔑 JWT token-based authentication
- 💾 PostgreSQL database with proper indexing
- ⚡ Redis caching for OTP and rate limiting
- 🛡️ Password strength validation
- 🚦 Rate limiting
- 📝 Comprehensive logging
- 🔒 Security best practices
- 🐳 Docker support

## Quick Start

### Using Docker (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd auth-backend

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f app
```

### Manual Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run migrations
npm run db:setup

# Start development server
npm run dev
```

## API Documentation

See [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) for detailed endpoint documentation.

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm test -- --coverage
```

## License

MIT
