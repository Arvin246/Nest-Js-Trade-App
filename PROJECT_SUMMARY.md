# Trade Tracker — Project Summary

## What this is

**Trade Tracker** is a small **NestJS** backend that exposes a **REST API** for tracking **customers** and **trades** (e.g. device sales). Data lives in **MongoDB** via **Mongoose**. Requests are validated with **class-validator** and a global **ValidationPipe** (whitelist, forbid unknown fields, transform).

## Tech stack

| Area | Choice |
|------|--------|
| Runtime / language | Node.js, TypeScript |
| Framework | NestJS 11 |
| Database | MongoDB (connection string `MONGO_URI`) |
| Config | `@nestjs/config` (`PORT`, `MONGO_URI`; see `.env.example`) |

## Main features

1. **Customers** — Full CRUD under `/customers`. Each customer has name, unique email, optional phone, and denormalized fields updated when trades are created: `totalPaid`, `timesVisited`, `firstSaleDate`.
2. **Trades** — Create and list trades (`POST /trades`, `GET /trades`, optional `?customerId`). A trade references a customer, includes `deviceName` and `amountPaid`, and bumps the linked customer’s stats.
3. **Reports** — Read-only analytics under `/reports` (MongoDB aggregations): top customers by revenue, customers active in a date range, dashboard-style summary, revenue/volume by day or month, top devices. Query parameters are validated via DTOs (dates, limits, `groupBy`, etc.).
4. **Operations** — `GET /` (root message), `GET /health` (`{ status: 'ok' }`). ObjectId route params use a shared **`ParseMongoIdPipe`**.

## Project layout (high level)

- `src/customers/` — customer module, schema, DTOs, controller, service, unit tests  
- `src/trades/` — trade module, schema, DTOs, controller, service  
- `src/reports/` — reports module, query DTOs, aggregation logic  
- `src/common/pipes/` — shared pipes  
- `test/` — e2e setup (`jest-e2e.json`, `app.e2e-spec.ts`)  
- `postman/`, `docs/` — Postman collections and curl-oriented notes  

## How to run

```bash
cp .env.example .env   # set MONGO_URI (and PORT if needed)
npm install
npm run start:dev
```

Tests: `npm run test` (unit), `npm run test:e2e` (e2e).

## Further detail

For phased delivery notes, endpoint tables, and index choices, see **`PROJECT.md`**.
