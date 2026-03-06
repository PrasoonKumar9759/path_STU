# path_STU (PeerPath AI)

PeerPath AI is a full-stack learning platform that combines role-based authentication, deterministic study planning, and creator-led content sharing.

This repository now uses a clear two-app structure:

- `backend/` -> Spring Boot API
- `frontend/` -> React + Vite web app

The legacy `demo/` folder has been removed.

## Core Features

### Authentication

- Email/password registration and login
- Google credential-based login
- JWT-based stateless authentication
- Current user profile endpoint (`/api/auth/me`)

### Role-Based Access

- `STUDENT`
	- Generate study plans
	- View and complete tasks
- `CREATOR`
	- Upload and manage study resources

### Student Planner

- Deterministic topic distribution from today to target date
- Daily and full task views
- Task completion with gamification updates:
	- +50 XP per completed task
	- Current streak and longest streak updates

### Content Hub

- Creator uploads with metadata (`title`, `subject`, `topic`, `resourceUrl`, `description`)
- Browse resources with optional subject and query filters
- Distinct subject listing for UI filter controls

## Tech Stack

### Backend

- Java 21
- Spring Boot 4.0.3 (parent in `backend/pom.xml`)
- Spring Security + Method Security
- Spring Data JPA / Hibernate
- JWT (`io.jsonwebtoken:jjwt-*` 0.12.5)
- Validation (`spring-boot-starter-validation`)
- Databases:
	- H2 (default development)
	- PostgreSQL (production via env vars)

### Frontend

- React 18
- React Router DOM 6
- Axios
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Vite 5

## Repository Structure

```text
path_STU/
├── backend/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   └── src/
│       ├── main/java/com/example/demo/
│       │   ├── config/
│       │   ├── controller/
│       │   ├── dto/
│       │   ├── entity/
│       │   ├── exception/
│       │   ├── repository/
│       │   ├── security/
│       │   └── service/
│       └── main/resources/application.properties
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── context/AuthContext.jsx
│       ├── services/api.js
│       └── pages/
└── README.md
```

## API Overview

Base URL: `http://localhost:8080/api`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/google`
- `GET /auth/me`

### Planner (`STUDENT` role)

- `POST /planner/generate`
- `GET /planner/tasks/today`
- `GET /planner/tasks`
- `POST /planner/tasks/{taskId}/complete`

### Content

- `POST /content` (`CREATOR` role)
- `GET /content` (authenticated users)
- `GET /content/subjects` (authenticated users)

## Local Development

### Prerequisites

- Java 21+
- Node.js 18+
- npm

### 1) Start Backend

```powershell
cd backend
mvnw.cmd spring-boot:run
```

Backend runs at: `http://localhost:8080`

### 2) Start Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

Vite proxies `/api` requests to backend (`http://localhost:8080`).

## Environment Variables

### Backend (`backend/src/main/resources/application.properties`)

- `DB_URL` (optional)
- `DB_USERNAME` (optional)
- `DB_PASSWORD` (optional)
- `DB_DRIVER` (optional)
- `JPA_DIALECT` (optional)

If not provided, backend defaults to H2 in-memory configuration.

### Frontend

- `VITE_GOOGLE_CLIENT_ID` (optional)

If not set, Google login UI is hidden/disabled in auth pages.

## Useful Commands

### Backend

```powershell
cd backend
mvnw.cmd test
mvnw.cmd clean package
```

### Frontend

```powershell
cd frontend
npm run build
npm run preview
```

## Notes

- The app currently contains role-focused dashboards:
	- `STUDENT`: planning + checklist + streak/XP updates
	- `CREATOR`: content publishing + personal upload history
- API errors are surfaced in frontend forms with friendly messages.
- JWT is attached by Axios request interceptor.

## License

No explicit license file is currently defined in this repository.
