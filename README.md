# FinTrack

**FinTrack** is a full-stack personal finance management application that helps users track accounts, manage transactions, monitor budgets, and achieve savings goals. It also features an **AI-powered financial assistant** capable of answering questions about your finances and performing supported actions using your personal financial data.

---

## Live Demo

Try the deployed application here:

**https://agent-6a51f6161fc6199745--clinquant-chaja-a0b3a0.netlify.app/login**

---

## Features

### Authentication
- Email/password registration and login
- Google OAuth 2.0 authentication
- JWT access & refresh token authentication
- Email verification
- Forgot/reset password functionality

### Dashboard
- Financial overview with summary cards
- Monthly income and expense statistics
- Account balance overview
- Budget progress tracking
- Savings goals overview

### Accounts
- Create and manage multiple account types
- Cash, Bank, Credit Card, E-wallet, Investment accounts
- Archive unused accounts
- Real-time balance tracking

### Transactions
- Record income, expenses, and transfers
- Advanced filtering and search
- Pagination support
- Transaction history management

### Categories
- Custom income and expense categories
- Nested category hierarchy
- Category management

### Budgets
- Monthly budget creation
- Category-wise spending limits
- Live spending progress
- Budget alerts

### Savings Goals
- Create savings goals
- Target amount and deadline tracking
- Contribution management
- Progress visualization

### Reports
- Monthly financial reports
- Income vs expense summaries
- Scheduled report generation
- Exportable reports

### AI Financial Assistant
- Natural language chat interface
- Financial insights and recommendations
- Tool access to:
  - Accounts
  - Transactions
  - Budgets
  - Goals
  - Reports
- Conversation memory
- Powered by OpenRouter

### Notifications
- In-app notification center
- Budget alerts
- Account notifications

---

# Tech Stack

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- JWT Authentication
- Passport.js (Google OAuth)
- Zod Validation
- Node Cron
- Nodemailer

---

## Frontend

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS
- Axios

---

## Infrastructure

- Docker
- Docker Compose
- Nginx
- PostgreSQL
- Redis

---

# Project Structure

```text
FinTrack/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── config/
│   │   ├── middlewares/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── accounts/
│   │   │   ├── transactions/
│   │   │   ├── categories/
│   │   │   ├── budgets/
│   │   │   ├── goals/
│   │   │   ├── reports/
│   │   │   ├── profile/
│   │   │   ├── ai/
│   │   │   └── scheduler/
│   │   ├── routes/
│   │   └── utils/
│   └── uploads/
│
├── frontend/
│   └── src/
│       ├── api/
│       ├── services/
│       ├── hooks/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── routes/
│       ├── schemas/
│       └── types/
│
├── docker/
│   └── docker-compose.yml
│
├── docs/
│
└── README.md
```

---

# Getting Started

## Prerequisites

- Node.js (LTS)
- npm
- Docker & Docker Compose (Recommended)
- PostgreSQL
- Redis

---

## Clone Repository

```bash
git clone https://github.com/nipunalwala18-cmyk/FinTrack.git

cd FinTrack
```

---

## Environment Variables

Copy the example environment file:

```bash
cp backend/.env.example backend/.env
```

Configure the following variables:

```env
PORT=5000

DATABASE_URL=

NODE_ENV=development

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000

COOKIE_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

OPENROUTER_API_KEY=
OPENROUTER_MODEL=
```

---

# Running the Application

## Using Docker (Recommended)

```bash
cd docker

docker compose up --build
```

Services started:

- Frontend
- Backend API
- PostgreSQL
- Redis

---

## Running Locally

### Backend

```bash
cd backend

npm install

npx prisma migrate deploy

npm run dev
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# Available Scripts

## Backend

| Command | Description |
|----------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build TypeScript project |
| `npm start` | Run production server |

---

## Frontend

| Command | Description |
|----------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build production files |
| `npm run preview` | Preview production build |
| `npm run lint` | Run linter |

---

# API Modules

The REST API is organized into the following modules:

```
/health
/auth
/dashboard
/accounts
/transactions
/categories
/budgets
/goals
/reports
/profile
/ai
```

---

# Documentation

Detailed documentation is available in the **docs/** directory.

- Functional Requirements
- UI/UX Design
- Database Schema
- API Specification
- Architecture
- Project Structure
- Security
- Coding Standards
- Development Guidelines
- Testing Strategy
- AI Assistant Design
- Deployment Guide
- Roadmap
- Decision Log
- Contributing Guide

---

# AI Assistant

The built-in AI assistant uses **OpenRouter** to provide intelligent financial assistance.

Capabilities include:

- Spending analysis
- Budget insights
- Savings recommendations
- Financial summaries
- Goal tracking
- Transaction lookup
- Report generation
- Context-aware conversations

---

# Future Improvements

- Mobile application
- Investment portfolio analytics
- OCR receipt scanning
- Bank account integration
- Multi-currency support
- Voice-enabled AI assistant
- Advanced financial analytics

---

# Author

**Nipun Alwala**

GitHub: https://github.com/nipunalwala18-cmyk
