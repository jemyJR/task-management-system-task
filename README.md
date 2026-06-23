# Task Management System API

A production-style Node.js + Express REST API for managing users, projects, and tasks with JWT authentication, role-based access control, validation, security middleware, migrations, seeders, and Swagger documentation.

## Tech Stack

- Node.js (ES Modules)
- Express
- MongoDB + Mongoose
- Joi + express-validator
- JWT authentication
- Winston logging (console, files, optional MongoDB transport)
- Jest (unit/integration tests)
- Docker + Docker Compose
- OpenAPI/Swagger UI

## Project Structure

```text
src/
  api.routes.js
  app.js
  server.js
  constants/
  database/
    migrations/
    seeds/
  modules/
    auth/
    users/
    projects/
    tasks/
  shared/
    config/
    documentation/
    exceptions/
    middleware/
    security/
    utils/
```

## Features

- Authentication flow:
  - Register
  - Login
  - Refresh token
  - Logout (token invalidation)
- Role-based authorization:
  - `ADMIN` and `USER`
  - Permission middleware per endpoint
- User management
- Project management
- Task management
- Request validation and centralized error handling
- Security hardening:
  - Helmet
  - XSS protection
  - NoSQL injection sanitization
  - HPP protection
  - Rate limiting outside development
- API documentation served via Swagger UI
- Database migrations and seed scripts

## API Base URLs

- Base API: `http://localhost:3000/api/v1`
- Swagger UI: `http://localhost:3000/api-docs`

## Prerequisites

- Node.js 22+
- npm 10+
- MongoDB (local or containerized)
- Docker + Docker Compose (optional, for containerized setup)

## Environment Variables

Copy `.env.example` to `.env` and fill in your values.

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### Variable Reference

| Variable               | Required | Default       | Description                                                          |
| ---------------------- | -------- | ------------- | -------------------------------------------------------------------- |
| `PORT`                 | No       | `3000`        | API server port                                                      |
| `NODE_ENV`             | No       | `development` | Allowed: `development`, `staging`, `production`                      |
| `MONGO_URI`            | Yes      | -             | Full Mongo connection string used by the app                         |
| `DB_USER`              | Yes\*    | -             | Mongo username (used only if `MONGO_URI` is not provided)            |
| `DB_PASSWORD`          | Yes\*    | -             | Mongo password (used only if `MONGO_URI` is not provided)            |
| `DB_HOST`              | Yes\*    | -             | Mongo host (used only if `MONGO_URI` is not provided)                |
| `DB_PORT`              | No       | `27017`       | Informational/future use (not currently consumed directly)           |
| `DB_OPTIONS`           | No       | empty         | Query options if building Mongo URI from parts                       |
| `ACCESS_TOKEN_SECRET`  | Yes      | -             | JWT signing secret for access tokens                                 |
| `REFRESH_TOKEN_SECRET` | Yes      | -             | JWT signing secret for refresh tokens                                |
| `ACCESS_TOKEN_EXPIRY`  | No       | `5m`          | Access token lifetime                                                |
| `REFRESH_TOKEN_EXPIRY` | No       | `7d`          | Refresh token lifetime                                               |
| `ALLOWED_ORIGINS`      | Yes      | -             | Allowed CORS origin (single origin string in current implementation) |
| `ENABLE_DB_LOGGING`    | No       | `false`       | Enable Winston MongoDB log transport                                 |
| `LOG_LEVEL`            | No       | `debug`       | One of `debug`, `info`, `warn`, `error`                              |

> `DB_USER`, `DB_PASSWORD`, and `DB_HOST` are required by schema validation, even when `MONGO_URI` is set.

## Running Locally (Without Docker)

1. Install dependencies:

```bash
npm install
```

2. Ensure MongoDB is running and `.env` is configured.

3. Run migrations:

```bash
npm run migrate
```

4. Seed database:

```bash
npm run seed
```

5. Start in development mode:

```bash
npm run dev
```

6. For production-style startup:

```bash
npm start
```

## Running with Docker Compose

1. Build and start services:

```bash
docker-compose up --build
```

2. Run migrations inside the app container:

```bash
docker exec -it task-management-system-task npm run migrate
```

3. Run seeders inside the app container:

```bash
docker exec -it task-management-system-task npm run seed
```

4. Stop services:

```bash
docker-compose down
```

## NPM Scripts

- `npm run dev` - Start with nodemon
- `npm start` - Start with Node.js
- `npm test` - Run tests (Jest)
- `npm run migrate` - Execute all migration files
- `npm run seed` - Seed users, projects, and tasks

## Seeded Users

Default seed users:

- Admin user
  - Email: `admin@example.com`
  - Password: `Admin12345`
  - Role: `ADMIN`
- Regular user
  - Email: `user@example.com`
  - Password: `User12345`
  - Role: `USER`

Change these immediately for any non-local environment.

## Authentication and Authorization

### Auth Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

### Protected Routes

Send access token in header:

```http
Authorization: Bearer <access_token>
```

Permissions are enforced with role-to-permission mapping in constants.

## Main Route Groups

- `/api/v1/users`
- `/api/v1/projects`
- `/api/v1/tasks`

See Swagger UI for full request/response schemas and examples.

## Security Notes

The API applies:

- `helmet`
- `hpp`
- `xss-clean` middleware (conditionally)
- `express-mongo-sanitize`
- Rate limiting (enabled when `NODE_ENV` is not `development`)

## Logging

Winston transports configured:

- Console
- File: `logs/error.log`
- File: `logs/combined.log`
- Optional MongoDB transport when `ENABLE_DB_LOGGING=true`

## Testing

Run:

```bash
npm test
```

Current coverage collection includes:

- `src/modules/auth/**`
- `src/modules/users/**`

## API Documentation

Swagger is generated from YAML files under:

- `src/shared/documentation/openapi.yaml`
- `src/shared/documentation/paths/**`
- `src/shared/documentation/schemas/**`

Open in browser:

- `http://localhost:3000/api-docs`

## Troubleshooting

- Server exits immediately with env validation error:
  - Ensure all required values in `.env` are present and valid.
- Mongo connection issues:
  - Verify `MONGO_URI` and Mongo container/service status.
- CORS blocked requests:
  - Update `ALLOWED_ORIGINS` to the exact frontend origin.
- Auth failures after logout:
  - Expected behavior; token version invalidation revokes old tokens.

## License

ISC
