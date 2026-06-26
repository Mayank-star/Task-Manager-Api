![Node.js](https://img.shields.io/badge/Node.js-22-green)
![Express](https://img.shields.io/badge/Express-5-black)
![Redis](https://img.shields.io/badge/Redis-7-red)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)

# 🚀 Task Manager API

A production-ready Task Manager REST API built with Node.js, Express.js, MySQL, Redis, BullMQ and Docker.

---

## 🚀 Features

- User Authentication (JWT)
- Refresh Token Authentication
- Role Based Access Control (RBAC)
- CRUD Operations
- Pagination
- Search
- Status Filter
- Input Validation (express-validator)
- Service Layer Architecture
- Redis Caching
- BullMQ Background Jobs
- Docker & Docker Compose Support

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MySQL
- Redis
- BullMQ
- JWT
- bcrypt
- Docker
- Docker Compose

---

## 📂 Project Structure

```
src
│
├── config
├── controllers
├── middleware
├── routes
├── services
├── workers
├── jobs
├── queues
└── validations
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <repository-url>

cd task-manager-api
```

### Install Dependencies

```bash
npm install
```

### Create Environment File

Copy

```
.env.example
```

to

```
.env
```

Update values.

### Run Development Server

```bash
npm run dev
```

---

## 🐳 Docker

Build Image

```bash
docker build -t task-manager-api .
```

Run

```bash
docker compose up --build
```

---

## API Endpoints

### Authentication

| Method | Endpoint |
| -------- | -------- |
| POST | /api/auth/register |
| POST | /api/auth/login |
| POST | /api/auth/refresh-token |

---

### Tasks

| Method | Endpoint |
| -------- | -------- |
| POST | /api/tasks |
| GET | /api/tasks |
| GET | /api/tasks/:id |
| PUT | /api/tasks/:id |
| DELETE | /api/tasks/:id |

---

## Query Parameters

Pagination

```
?page=1&limit=5
```

Search

```
?search=node
```

Status Filter

```
?status=completed
```

Combined

```
?page=1&limit=5&search=node&status=completed
```

---

## Authentication

```
Authorization: Bearer <access_token>
```

---

## Redis Cache

Task listing is cached using Redis for improved response time.

---

## BullMQ

A background worker processes welcome email jobs asynchronously.

---

## Docker Services

- Backend API
- Redis
- BullMQ Worker

---

## Future Improvements

- AWS EC2 Deployment
- Nginx
- PM2
- GitHub Actions CI/CD
- AWS S3 File Upload
- Email Notifications
- Unit Testing

---

## Author

Mayank Kumar