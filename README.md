# Foodzy Ecommerce

A full stack ecommerce application with a Next.js frontend and a NestJS backend. It supports email based OTP verification, product browsing, cart and checkout, order creation, and order confirmation email.

## Overview

Frontend uses Next.js and TypeScript with Tailwind CSS and Zustand.

Backend uses NestJS and TypeScript with PostgreSQL. Authentication uses email OTP. Orders are saved and an order confirmation email is sent after creation. Email in development does not require any credentials and uses an Ethereal preview link printed in the server console.

## Quick start backend

### Prerequisites

- Docker and Docker Compose installed on your system

### Setup

1. **Start PostgreSQL with Docker**

   ```bash
   docker-compose up -d postgres
   ```

   This will start PostgreSQL on port 5432. The database will persist data in a Docker volume.

2. **Setup backend**

   ```bash
   cd backend
   npm install
   ```

3. **Create environment file**

   ```bash
   cp .env.example .env
   ```

   The default values work with the Docker PostgreSQL setup. You can customize email settings if needed.

4. **Run database migrations**

   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   ```

5. **Start the backend server**
   ```bash
   npm run start:dev
   ```

### Docker Commands

- Start PostgreSQL: `docker-compose up -d postgres`
- Stop PostgreSQL: `docker-compose down`
- View PostgreSQL logs: `docker-compose logs postgres`
- Connect to PostgreSQL: `docker-compose exec postgres psql -U postgres -d ecommerce_db`

Notes

1. Order confirmation email is sent after order creation. In development a preview URL is logged in the console
2. OTP emails also go to an Ethereal preview in development

## Quick start frontend

1. Open a terminal in the frontend folder
2. Run

```
npm install
```

3. Create .env.local with the backend url

````
NEXT_PUBLIC_API_URL=http://localhost:3001
```cp .env.example .env

4. Start the app
````

npm run dev

```
5. Open http://localhost:3000

## Prisma

Products are backed by Prisma in the backend. If you change the schema run
```

npm run prisma:generate

```
If you want Prisma to manage the database schema locally set DATABASE_URL in backend .env and run
```

npm run prisma:migrate

```

## API summary

Authentication
```

POST /auth/send-otp
POST /auth/verify-otp

```
Products
```

GET /products
GET /products/:id
GET /products?category=fruit
GET /products/featured

```
Orders
```

POST /orders
GET /orders/:id

```


```
