# Organizational-Access-Control
A fully secured Session and Credential based full-stack login and user management application built with a Spring Boot backend and a React + Vite frontend.

##  Project Overview

This repository includes:

- `backend/` — Spring Boot 3.4 application with Java 17, PostgreSQL, Spring Security, JWT, JPA, Thymeleaf, and REST endpoints.
- `frontend/` — React 19 application built with Vite, Tailwind CSS, React Router, and Toast notifications.

The app supports:

- user login with JWT-based API authentication
- forgot password and reset password flows
- user creation, update, and delete
- enable/disable users
- menu assignment and management
- dashboard and profile pages
- login history tracking

##  Repository Structure

- `backend/`
  - `src/main/java` — Java source code
  - `src/main/resources/application.properties` — backend configuration
  - `build.gradle` — Gradle build config
  - `gradlew`, `gradlew.bat` — Gradle wrapper

- `frontend/`
  - `src/` — React app source files
  - `package.json` — frontend dependencies and scripts
  - `vite.config.js` — Vite config

##  Tech Stack

- Backend: Spring Boot, Spring Data JPA, Spring Security, JWT, PostgreSQL, Thymeleaf
- Frontend: React, Vite, Tailwind CSS, React Router DOM, React Toastify

##  Prerequisites

- Java 17 or later
- PostgreSQL
- Node.js and npm
- Git

##  Backend Setup

1. Install PostgreSQL.
2. Create a database named `login_demo`.
3. Update `backend/src/main/resources/application.properties` if your PostgreSQL credentials or host differ.

Default configuration:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/login_demo
spring.datasource.username=postgres
spring.datasource.password=postgres
```

4. From the `backend/` folder, run:

```bash
./gradlew bootRun
```

This starts the backend on:

- `http://localhost:8080`

The backend uses the context path `/api`, so API endpoints are available under `http://localhost:8080/api`.

## 📡 Frontend Setup

From the `frontend/` folder, install dependencies and start the app:

```bash
npm install
npm run dev
```

Open the app at:

- `http://localhost:5173`

## 🔌 API Endpoints

The backend exposes the following main endpoints:

- `POST /api/login-new` — login via API, returns JWT
- `POST /api/create` — create a new user
- `GET /api/all` — fetch all users
- `GET /api/byid/{id}` — fetch a user by id
- `PUT /api/update` — update a user
- `DELETE /api/delete/{id}` — delete a user
- `PUT /api/{id}/disable` — disable a user
- `PUT /api/enable?id={id}` — enable a user
- `POST /api/forgot-password` — request password reset
- `POST /api/reset-password` — reset password with token
- `GET /api/menus` — get all menu items
- `GET /api/users/{userId}/menus` — get menus assigned to a user
- `POST /api/users/{userId}/menus` — assign menus to a user
- `POST /api/menu/create` — create a menu item
- `GET /api/menu/all` — fetch all menu items

##  Running Tests

From `backend/`, run:

```bash
./gradlew test
```

##  Common Frontend Pages

- `/login` — login page
- `/forgot-password` — request password reset
- `/reset-password` — reset password page
- `/dashboard` — main dashboard
- `/view-users` — list users
- `/add-user` — add new user
- `/menus` — menu management
- `/profile` — user profile

##  Notes

- The backend currently uses PostgreSQL and will auto-update the schema with `spring.jpa.hibernate.ddl-auto=update`.
- The password reset flow prints a mock reset link to the backend console.
- The frontend stores login details in `localStorage` for session management.

##  How to Upload to GitHub

1. Initialize the repository if needed:

```bash
git init
```

2. Add files and commit:

```bash
git add .
git commit -m "Add user login management app"
```

3. Push to GitHub:

```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

##  Ready to Deploy

This repository is ready to be published on GitHub as a full-stack project with backend and frontend instructions included.
EOF
