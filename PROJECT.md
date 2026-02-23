# Trade Tracker — Project Overview

## Description

**Trade Tracker** is a NestJS backend API that tracks trading-related data. It provides REST APIs for managing customers and (in later phases) trades, portfolios, and reporting. The stack includes NestJS, MongoDB (Mongoose), and class-validator for request validation.

---

## Phase 1: Foundation & Customers (Current)

- [x] **Project setup**
  - NestJS app with TypeScript
  - MongoDB via Mongoose and `@nestjs/mongoose`
  - Environment config with `@nestjs/config` (e.g. `PORT`, `MONGO_URI`)
  - `.env.example` for required variables
- [x] **Customer resource**
  - Mongoose schema: `Customer` (name, email, phone optional, timestamps)
  - DTOs: `CreateCustomerDto`, `UpdateCustomerDto` (with class-validator)
  - CRUD: create, findAll, findOne, update, remove
  - Controller: `POST/GET/PATCH/DELETE /customers` and `GET /customers/:id`
  - Reusable `ParseMongoIdPipe` for valid MongoDB ObjectIds
- [x] **Validation & API behaviour**
  - Global `ValidationPipe` (whitelist, forbidNonWhitelisted, transform)
  - 404 handling for missing customers (NotFoundException)
- [x] **Health & root**
  - Root: `GET /` (e.g. “Hello World”)
  - Health: `GET /health` returns `{ status: 'ok' }`
- [x] **Tests**
  - Unit tests for `CustomersController` and `CustomersService` (mocked model)

### Phase 1 API summary

| Method | Path             | Description        |
|--------|------------------|--------------------|
| GET    | /                | Root message       |
| GET    | /health          | Health check       |
| POST   | /customers       | Create customer    |
| GET    | /customers       | List customers     |
| GET    | /customers/:id   | Get one customer   |
| PATCH  | /customers/:id   | Update customer    |
| DELETE | /customers/:id   | Delete customer    |

### Run & test

```bash
cp .env.example .env   # set MONGO_URI and optionally PORT
npm run start:dev
npm run test
```

---

## Later phases (placeholder)

- **Phase 2:** Trades (or similar) resource, linking to customers if needed.
- **Phase 3:** Extra resources, auth, or reporting as per product needs.

---

*If your Phase 1 plan (Untitled-1) or project description (Untitled-2) had more items, paste them here and we can align this checklist and add any missing tasks.*
