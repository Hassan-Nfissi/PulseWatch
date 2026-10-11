# PulseWatch ⚡

> High-Performance Uptime Monitoring & Public Status Page SaaS platform built with **Spring Boot 3**, **React**, **TypeScript**, **Tailwind CSS**, and **PostgreSQL**.

---

## 🚀 Features

- **Google OAuth2 Authentication (FR1)**: Seamless Google Sign-In with automatic PostgreSQL user provisioning and signed application JWT tokens.
- **Monitor Management (FR2)**: Full CRUD for HTTP/HTTPS monitors with customizable check intervals (1m, 5m, 15m), HTTP methods (`GET`, `HEAD`), expected status codes, and pause/resume states.
- **Core Monitoring Engine (FR3 & NFR1)**: Non-blocking asynchronous worker built with Spring `WebClient` and `ThreadPoolTaskExecutor`. Measures response latency and tracks `UP` / `DOWN` states.
- **Anti-SSRF Protection (NFR2.1)**: DNS pre-flight verification blocking internal loopback, private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), and AWS/cloud metadata IP `169.254.169.254`.
- **Automated Incident Management & Alerting (FR4)**: Automatic creation and resolution of incidents with calculated downtime duration and styled HTML email notifications sent via `JavaMailSender`.
- **Analytics & Visualizations (FR5)**: 30-day rolling uptime percentage and 24-hour time-series latency charts rendered with **Recharts**.
- **Branded Public Status Pages (FR6)**: Unauthenticated public status dashboards accessible at `/status/:slug` displaying live service status without exposing sensitive endpoints or configurations.
- **Data Retention Cleanup (NFR3.2)**: Automated scheduled worker pruning heartbeat records older than 30 days to prevent database bloat.
- **Production Containerization (NFR4)**: Multi-stage Dockerfiles for backend and frontend orchestrated via `docker-compose.yml`.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Java 21, Spring Boot 3.2, Spring Security 6, Spring Data JPA, Spring WebFlux (`WebClient`), JavaMailSender |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide React, Google OAuth |
| **Database & Cache** | PostgreSQL 16 (indexed time-series heartbeats), Redis 7 |
| **DevOps** | Docker, Docker Compose, Multi-stage builds, Nginx reverse proxy |

---

## ⚡ Quick Start (Docker Compose)

The easiest way to run the entire PulseWatch stack (Postgres + Redis + Backend + Frontend) is with Docker Compose:

```bash
# 1. Clone or navigate to the repository
cd PulseWatch

# 2. Review or customize environment variables
cp .env.example .env

# 3. Spin up all containers
docker-compose up --build -d
```

Once running:
- **Web App & Dashboard**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:8080`
- **Public Status Pages**: `http://localhost:3000/status/<slug>`
- **Database**: `localhost:5432` (`pulsewatch_db`)

---

## 💻 Local Development Setup

### 1. Prerequisites
- **Node.js** 18+ and **npm**
- **Java** 21 and **Maven** 3.9+ (or use Docker for the backend)
- **PostgreSQL** running locally on port 5432

### 2. Backend Setup
```bash
cd backend

# Compile and package
mvn clean package -DskipTests

# Run the Spring Boot application
mvn spring-boot:run
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run the Vite development server
npm run dev
```

The frontend will start at `http://localhost:3000` and automatically proxy API calls to `http://localhost:8080`.

---

## 🔒 Security & SSRF Protection

PulseWatch enforces strict SSRF protections in `SsrfValidator`:
- Resolves hostnames to IP addresses prior to initiating any socket connections.
- Rejects IP ranges:
  - Loopback (`127.0.0.0/8`, `::1`)
  - Private networks (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`)
  - Cloud Instance Metadata (`169.254.169.254`, `169.254.0.0/16`)
  - Zero subnet (`0.0.0.0/8`)
  - IPv6 Unique Local (`fc00::/7`) and Link-Local (`fe80::/10`)

Any attempt to target an internal IP returns a `400 Bad Request` with an explicit SSRF security notice.

---

## 📡 Key API Endpoints

### Authentication
- `POST /api/v1/auth/google` - Exchange Google ID token for application JWT
- `GET /api/v1/auth/me` - Get current authenticated user profile

### Monitors
- `GET /api/v1/monitors` - List all monitors for user
- `POST /api/v1/monitors` - Create a new monitor
- `GET /api/v1/monitors/{id}` - Retrieve monitor details
- `PUT /api/v1/monitors/{id}` - Update monitor configuration
- `DELETE /api/v1/monitors/{id}` - Delete monitor
- `POST /api/v1/monitors/{id}/pause` - Pause monitoring
- `POST /api/v1/monitors/{id}/resume` - Resume monitoring

### Analytics & Incidents
- `GET /api/v1/dashboard/stats` - Overall dashboard KPI metrics
- `GET /api/v1/monitors/{id}/analytics?range=24h` - 24h/7d/30d response time series
- `GET /api/v1/incidents` - List all user incidents

### Status Pages
- `GET /api/v1/status-pages` - List user's status pages
- `POST /api/v1/status-pages` - Create a new status page
- `GET /api/v1/public/status/{slug}` - Public unauthenticated status endpoint

---

## 🧪 Testing

Run backend unit tests:
```bash
cd backend
mvn test
```

Test frontend build:
```bash
cd frontend
npm run build
```
