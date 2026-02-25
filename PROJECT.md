# Trade Tracker — Project Overview

## Description

**Trade Tracker** is a NestJS backend API that tracks trading-related data. It provides REST APIs for managing customers and (in later phases) trades, portfolios, and reporting. The stack includes NestJS, MongoDB (Mongoose), and class-validator for request validation.

---

## Phase 1: Foundation & Customers

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

## Phase 2: Trades

- [x] **Trade resource** linked to Customer (customerId, deviceName, amountPaid)
- [x] APIs: `POST /trades`, `GET /trades` (optional `?customerId`)
- [x] Customer stats updated on trade creation (totalPaid, timesVisited, firstSaleDate)

---

## Phase 3: Reporting & Dashboard

- [x] **Reports module** at `GET /reports/...` with aggregation-based endpoints
- [x] **Indexes:** Customer `{ totalPaid: -1 }`; Trade `{ createdAt: 1 }`, `{ customerId: 1, createdAt: 1 }`
- [x] **Endpoints:**

| Method | Path | Description |
|--------|------|--------------|
| GET | /reports/top-customers | Top customers by total paid (Name, Total Paid, Devices Sold, First Sale Date). Query: `limit` (optional, default 10, max 100) |
| GET | /reports | Customers by date range: who had at least one trade in [startDate, endDate] with in-range totals. Query: `startDate`, `endDate` (required, ISO 8601), `limit` (optional, max 500) |
| GET | /reports/summary | Dashboard summary: total customers, total revenue, total trades. Query: `days` (optional) to limit to last N days |
| GET | /reports/sales-by-period | Revenue and volume by day or month. Query: `startDate`, `endDate` (optional), `groupBy` (day \| month) |
| GET | /reports/top-devices | Most sold device names. Query: `limit` (optional, default 10, max 100) |

- [x] **Validation:** DTOs with class-validator for query params (dates, limit bounds)
- [x] **Performance:** Match-before-group in aggregations; denormalized Customer stats for top-customers

---

*If your Phase 1 plan (Untitled-1) or project description (Untitled-2) had more items, paste them here and we can align this checklist and add any missing tasks.*
