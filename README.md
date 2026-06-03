# Restaurant Management System (RMS)

Monorepo for a full-featured restaurant management platform.

| Layer    | Stack                          |
|----------|--------------------------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, Zustand, react-i18next |
| Backend  | Java 21, Spring Boot 3.3, Spring Security, JWT, Flyway, PostgreSQL |
| Database | PostgreSQL 16                  |

## Project structure

```
RMS/
├── frontend/          # React SPA
├── backend/           # Spring Boot API
├── docker-compose.yml # Postgres (+ optional backend container)
└── .github/workflows/ # CI
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Java](https://adoptium.net/) 21
- [Maven](https://maven.apache.org/) 3.9+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for PostgreSQL)

## Quick start

### 0. Environment files

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` and `frontend/.env` if your database host, ports, or API URL differ from the defaults.

### 1. Start PostgreSQL

```bash
docker compose up -d postgres
```

### 2. Run the backend

```bash
cd backend
mvn spring-boot:run
```

API: http://localhost:8080  
Swagger: http://localhost:8080/swagger-ui.html

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

### Default login (dev profile)

| Side     | Email               | Password     |
|----------|---------------------|--------------|
| Cashier  | cashier@rms.local   | Cashier@123  |
| Kitchen  | kitchen@rms.local   | Kitchen@123  |

- **Cashier** → full app (dashboard, menu, orders, billing, etc.)
- **Kitchen** → all orders display on login (`/kitchen`)

## Features (Phase 0 scaffold)

- JWT authentication (access + refresh tokens)
- Role-ready user model (`ADMIN`, `MANAGER`, `WAITER`, `CHEF`, `CASHIER`)
- Dark / light theme toggle
- i18n: English, Sinhala, Tamil, French, Arabic (RTL)
- App shell: sidebar navigation, dashboard placeholders
- WebSocket/STOMP endpoint stub (`/ws`)
- OpenAPI / Swagger documentation

## Module roadmap

| Module        | Status        |
|---------------|---------------|
| Auth          | Implemented   |
| Dashboard     | Shell         |
| Menu          | Placeholder   |
| Orders        | Placeholder   |
| Tables        | Placeholder   |
| Kitchen (KDS) | Placeholder   |
| Inventory     | Placeholder   |
| Staff         | Placeholder   |
| Reservations  | Placeholder   |
| Billing       | Placeholder   |
| Reports       | Placeholder   |

## Environment variables

Copy `backend/.env.example` → `backend/.env` and `frontend/.env.example` → `frontend/.env`. Do not commit `.env` files.

**Backend** (`backend/.env` — loaded automatically when running from `backend/`):

| Variable | Purpose |
|----------|---------|
| `SPRING_DATASOURCE_URL` | JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | DB user |
| `SPRING_DATASOURCE_PASSWORD` | DB password |
| `POSTGRES_DB` / `POSTGRES_USER` / `POSTGRES_PASSWORD` | Used by `docker compose` for Postgres |
| `SERVER_PORT` | API port (default `8080`) |
| `JWT_SECRET` | Signing key (min 32 chars in production) |
| `RMS_CORS_ALLOWED_ORIGINS` | Comma-separated frontend URLs for CORS |

**Frontend** (`frontend/.env`):

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Axios base URL (`http://localhost:8080` or empty to use dev proxy) |
| `VITE_API_PROXY_TARGET` | Vite proxy target for `/api` and `/ws` |
| `VITE_DEV_PORT` | Vite dev server port (default `5173`) |

## Docker (full stack)

Ensure `backend/.env` exists (see step 0). Compose loads it into containers; JDBC host is overridden to the `postgres` service name inside Docker.

```bash
docker compose --env-file backend/.env up --build
```

Runs Postgres and the backend API. Run the frontend locally with `npm run dev` (proxies `/api` using `VITE_API_PROXY_TARGET` from `frontend/.env`).

## License

Private / your choice.
