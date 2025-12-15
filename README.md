# Fullstack Monorepo

A modern full-stack monorepo with a clean separation between frontend and backend services using pnpm workspaces.

## 🏗️ Architecture

```
project/
├── apps/
│   ├── backend/     # NestJS API service
│   └── frontend/    # React + Vite web application
├── packages/
│   └── shared/      # Shared types and utilities
├── package.json     # Root package with workspace scripts
└── tsconfig.json    # Root TypeScript configuration
```

## 🚀 Tech Stack

### Backend

- **Framework**: NestJS with TypeScript
- **Platform**: Express.js
- **Validation**: Built-in validation pipes
- **Configuration**: Environment variables with @nestjs/config
- **CORS**: Enabled for frontend integration

### Frontend

- **Framework**: React + Vite
- **Language**: TypeScript
- **Routing**: React Router DOM
- **Styling**: CSS Variables (calming blue/green palette) + Roboto font
- **Environment**: Environment variables (`VITE_` prefix)

### Development Tools

- **Package Manager**: pnpm with workspaces
- **Code Quality**: ESLint + Prettier
- **Type Safety**: TypeScript with shared configurations
- **Testing**: Jest (backend)

## 📋 Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## 🛠️ Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd fullstack-monorepo
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your specific configuration values.

## 🏃‍♂️ Development

### Start All Services

```bash
pnpm dev
```

This will start both the backend (port 3001) and frontend (port 3000) concurrently.

### Individual Services

Start backend only:

```bash
pnpm dev:backend
```

Start frontend only:

```bash
pnpm dev:frontend
```

### Build All Packages

```bash
pnpm build
```

### Testing

```bash
# Run all tests
pnpm test

# Run backend tests
pnpm test:backend

# Run frontend tests
pnpm test:frontend
```

### Code Quality

```bash
# Lint all packages
pnpm lint

# Format code
pnpm format

# Check formatting
pnpm format:check
```

## 📁 Project Structure

### Backend (`apps/backend/`)

- `src/main.ts` - Application entry point
- `src/app.module.ts` - Root module
- `src/app.controller.ts` - Root controller
- `src/app.service.ts` - Root service
- `src/health/` - Health check module
- `package.json` - Backend dependencies
- `tsconfig.json` - TypeScript configuration

### Frontend (`apps/frontend/`)

- `src/main.tsx` - Application entry point
- `src/App.tsx` - Root component and router
- `src/pages/` - Page components (Landing, Dashboard, Planner)
- `src/components/` - Shared components (Layouts, UI)
- `src/index.css` - Global styles
- `package.json` - Frontend dependencies
- `vite.config.ts` - Vite configuration

### Shared (`packages/shared/`)

- `src/index.ts` - Shared types and utilities
- `package.json` - Shared package configuration
- `tsconfig.base.json` - Base TypeScript configuration

## 🔧 Available Scripts

| Script                | Description                                         |
| --------------------- | --------------------------------------------------- |
| `pnpm dev`            | Start both frontend and backend in development mode |
| `pnpm dev:backend`    | Start backend only                                  |
| `pnpm dev:frontend`   | Start frontend only                                 |
| `pnpm build`          | Build all packages                                  |
| `pnpm build:backend`  | Build backend only                                  |
| `pnpm build:frontend` | Build frontend only                                 |
| `pnpm build:shared`   | Build shared package only                           |
| `pnpm test`           | Run all tests                                       |
| `pnpm lint`           | Lint all packages                                   |
| `pnpm format`         | Format all code with Prettier                       |
| `pnpm clean`          | Clean all build artifacts and node_modules          |

## 🌐 API Endpoints

### Health Check

- **URL**: `GET http://localhost:3001/health`
- **Response**: Health status with uptime and version information

Example response:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 42,
  "version": "0.1.0"
}
```

## 🎯 Features

- ✅ **Monorepo Setup**: pnpm workspaces for efficient dependency management
- ✅ **Type Safety**: Shared TypeScript configuration and types
- ✅ **Health Check**: Backend health endpoint monitored by frontend
- ✅ **Environment Management**: Separate configurations for development/production
- ✅ **Code Quality**: ESLint and Prettier configuration
- ✅ **Hot Reload**: Development servers with hot module replacement
- ✅ **CORS**: Backend configured for frontend integration
- ✅ **Modern Stack**: Vite, React, NestJS, and TypeScript

## 🔍 Development Workflow

1. **Make Changes**: Edit code in any workspace
2. **Type Check**: TypeScript will catch type errors
3. **Lint**: ESLint will enforce code standards
4. **Format**: Prettier will maintain consistent formatting
5. **Test**: Run tests to verify functionality
6. **Build**: Create production-ready artifacts

## 📚 Environment Variables

### Backend

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3001)
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - JWT signing secret

### Frontend

- `VITE_API_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

## 🚀 Deployment

### Backend Deployment

1. Build the backend: `pnpm build:backend`
2. Deploy the `dist/` folder to your hosting platform
3. Set environment variables

### Frontend Deployment (Vercel)

1. Connect your repository to Vercel.
2. Set the "Root Directory" to `apps/frontend`.
3. The build command should be `pnpm build` (or `vite build`).
4. The output directory should be `dist`.
5. Set environment variables in the Vercel dashboard.

Alternatively, running `pnpm build:frontend` locally will generate the `apps/frontend/dist` directory which can be deployed to any static host.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
