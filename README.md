# uShip Backend

This is the backend service for the uShip marketplace, a platform connecting shippers with carriers.

## Tech Stack
- **Framework**: Express.js
- **Runtime**: Node.js
- **Language**: TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Security**: Helmet, CORS, JWT-based Authentication
- **Logging**: Morgan

## Features and API Routes

The API is organized into modular components. Most routes require a valid JWT token.

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register`: Create a new user account.
- `POST /api/auth/login`: Authenticate and receive a token.

### 👤 User Management (`/api/users`)
- `GET /api/users/profile`: View current user's profile.
- `PATCH /api/users/profile`: Update current user's profile details.

### 📦 Shipments (`/api/shipments`)
- `POST /api/shipments`: Create a new shipment listing.
- `GET /api/shipments`: List all available shipments.
- `GET /api/shipments/:id`: View details of a specific shipment.
- `PATCH /api/shipments/:id`: Update shipment information.
- `DELETE /api/shipments/:id`: Remove a shipment listing.

### 🚚 Carriers & Bidding (`/api/carriers` & `/api/bids`)
- `GET /api/carriers/profile`: View carrier profile details.
- `POST /api/bids`: Place a bid on a shipment (Carriers only).
- `GET /api/bids/shipment/:shipmentId`: List all bids for a specific shipment.
- `GET /api/bids/my`: View current carrier's active bids.

### 📅 Bookings (`/api/bookings`)
- `POST /api/bookings`: Confirm a booking (select a bid).
- `GET /api/bookings/my`: View current user's bookings.

### 💳 Payments & Invoices (`/api/payments` & `/api/invoices`)
- `POST /api/payments/pay`: Process a payment for a booking.
- `POST /api/invoices/generate`: Generate an invoice for a completed booking.

### 🌟 Reviews & Disputes (`/api/reviews` & `/api/disputes`)
- `POST /api/reviews`: Leave a review for a user/carrier.
- `GET /api/reviews/:userId`: View reviews for a specific user.
- `POST /api/disputes`: Open a dispute for a shipment/booking.
- `GET /api/disputes`: List all disputes (Admin only).

### 🛠️ Admin & CMS (`/api/admin` & `/api/cms`)
- `GET /api/admin/stats`: Get platform-wide statistics.
- `GET /api/cms/:key`: Retrieve dynamic site content by key.
- `PATCH /api/cms/:key`: Update site content (Admin only).

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file based on the provided configuration.

3. **Prisma Setup**:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
