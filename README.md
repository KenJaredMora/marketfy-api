# Marketfy API

Backend API for the Marketfy e-commerce platform built with NestJS, Prisma, and PostgreSQL.

## Features

- **Authentication & Authorization**: JWT-based authentication with bcrypt password hashing
- **User Management**: User profiles with bio, interests, and customizable details
- **Product Catalog**: Advanced product search with pagination, filtering, and sorting
- **Shopping Cart**: (Frontend-managed with localStorage)
- **Orders**: Complete order management with history and tracking
- **Wishlist**: User-specific wishlist functionality
- **Security**:
  - Helmet for security headers
  - Rate limiting (100 requests/minute)
  - CORS configuration
  - Global exception handling
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Comprehensive input validation with class-validator

## Tech Stack

- **Framework**: NestJS 11
- **Database**: PostgreSQL
- **ORM**: Prisma 6
- **Authentication**: JWT with Passport.js
- **Password Hashing**: bcrypt
- **Validation**: class-validator & class-transformer
- **Security**: Helmet, @nestjs/throttler

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- pnpm (recommended) or npm

## Installation

   Clone the repository and navigate to the API folder:

```bash
cd marketfy-api
```

   Install dependencies:

```bash
pnpm install
```

   Set up your environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/marketfy?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT="3000"
FRONTEND_URL="http://localhost:4200"
```

   Run database migrations:

```bash
pnpm prisma migrate dev
```

   Seed the database with demo data:

```bash
pnpm seed
```

## Running the API

### Development mode

```bash
pnpm start:dev
```

### Production mode

```bash
pnpm build
pnpm start:prod
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication

#### Register

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { "access_token": "jwt-token", "userId": 1 }
```

### Products

#### List Products

```http
GET /products?page=1&limit=12&q=search&tag=electronics&sortBy=price&sortOrder=asc
```

Query Parameters:

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page, max 100 (default: 12)
- `q` (optional): Search query (searches name, description, tags)
- `tag` (optional): Filter by specific tag
- `sortBy` (optional): Sort field: name, price, createdAt (default: createdAt)
- `sortOrder` (optional): asc or desc (default: desc)

#### Get Product by ID

```http
GET /products/:id
```

### Orders (Protected)

All order endpoints require JWT authentication via `Authorization: Bearer <token>` header.

#### Create Order

```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "product": { "id": 1, "name": "Product", "price": 99.99 },
      "qty": 2
    }
  ],
  "total": 199.98
}
```

#### List User Orders

```http
GET /orders?page=1&limit=20
Authorization: Bearer <token>
```

#### Get Order by ID

```http
GET /orders/:orderId
Authorization: Bearer <token>
```

### Users (Protected)

#### Get Current User Profile

```http
GET /users/me
Authorization: Bearer <token>
```

#### Update User Profile

```http
PATCH /users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "displayName": "New Name",
  "firstName": "John",
  "lastName": "Doe",
  "bio": "My bio",
  "interests": ["tech", "gaming"]
}
```

### Wishlist (Protected)

#### Get User Wishlist

```http
GET /wishlist
Authorization: Bearer <token>
```

#### Add to Wishlist

```http
POST /wishlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1
}
```

#### Remove from Wishlist by Product

```http
DELETE /wishlist?productId=1
Authorization: Bearer <token>
```

#### Remove from Wishlist by ID

```http
DELETE /wishlist/:id
Authorization: Bearer <token>
```

## Database Schema

### User

- `id`: Auto-increment primary key
- `email`: Unique email address
- `passwordHash`: Bcrypt hashed password
- `displayName`: Display name
- `firstName`: First name (optional)
- `lastName`: Last name (optional)
- `bio`: User biography (optional)
- `interests`: Array of interest tags
- `updatedAt`: Last update timestamp

### Product

- `id`: Auto-increment primary key
- `id`: Auto-increment primary key
- `name`: Product name
- `price`: Decimal price
- `imageUrl`: Product image URL (optional)
- `createdAt`: Creation timestamp

### Order

- `id`: Auto-increment primary key

### order

- `id`: Auto-increment primary key
- `orderId`: UUID unique identifier
- `userId`: Foreign key to User
- `items`: JSON array of order items
- `total`: Order total (Decimal)
- `createdAt`: Creation timestamp

### WishlistItem

- `id`: Auto-increment primary key
- `userId`: Foreign key to User
- `productId`: Foreign key to Product
- `createdAt`: Creation timestamp
- Unique constraint on `(userId, productId)`
After seeding, you can use these credentials to test:

**User 1:**

- Email: `demo@marketfy.test`
- Password: `password123`

**User 2:**

- Email: `john@marketfy.test`
- Password: `password123`

## Scripts

- Password: `password123`

## scripts

- `pnpm build` - Build the application
- `pnpm start` - Start the application
- `pnpm start:dev` - Start in development mode with watch
- `pnpm start:debug` - Start in debug mode
- `pnpm start:prod` - Start in production mode
- `pnpm lint` - Run ESLint
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm seed` - Seed the database

## Security Features

1. **Helmet**: Sets security-related HTTP headers
2. **Rate Limiting**: 100 requests per minute per IP
3. **CORS**: Configured for frontend origin

## Project Structure

   **Password Hashing**: bcrypt with 10 salt rounds
   **Input Validation**: Comprehensive DTO validation
   **Exception Handling**: Global exception filter with consistent error responses

## project Structure

```
src/
├── auth/               # Authentication module (JWT, login, register)
├── common/             # Shared resources (filters, guards, etc.)
│   └── filters/        # Global exception filters
├── orders/             # Orders module (create, list, get)
├── prisma/             # Prisma service module
├── products/           # Products module (search, filter, pagination)
├── users/              # Users module (profile management)
## Enhancements Made

### Security

- ✅ Added JWT authentication to all wishlist endpoints

## Enhancements Made
- ✅ Global exception filter for consistent error handling

### Product Features

- ✅ Added `bio` field to User model
- ✅ Added rate limiting (100 requests/minute)
- ✅ Improved CORS configuration
- ✅ Global exception filter for consistent error handling
- ✅ Excluded passwordHash from user responses

### Code Quality

- ✅ Added DTOs with validation for all modules
- ✅ Added product filtering by tag
- ✅ Added product sorting (name, price, createdAt)
- ✅ Created proper service layer for Orders
- ✅ Excluded passwordHash from user responses

### Code Quality
- ✅ Added DTOs with validation for all modules
- ✅ Implemented proper error handling with exceptions
- ✅ Improved validation with class-validator
- ✅ Better code organization and separation of concerns
- ✅ Enhanced seed data with 30 realistic products

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `pnpm test`
4. Run linting: `pnpm lint`
5. Submit a pull request

## License

UNLICENSED - Private project
