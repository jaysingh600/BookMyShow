# CineReserve (BookMyShow Clone) API Documentation

## Base URL
`http://localhost:5000/api`

---

## 1. Authentication

### `POST /api/auth/register`
Register a new user.
- **Body:** `{ "name": "John Doe", "email": "john@example.com", "password": "password123", "phone": "1234567890" }`
- **Response:** `201 Created` with JWT token.

### `POST /api/auth/login`
Authenticate a user.
- **Body:** `{ "email": "john@example.com", "password": "password123" }`
- **Response:** `200 OK` with user details and JWT token.

---

## 2. User Management

### `GET /api/users/profile`
Get current logged-in user profile.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK` with user data.

### `PUT /api/users/profile`
Update user profile.
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "name": "Jane Doe", "phone": "0987654321" }`
- **Response:** `200 OK` with updated user data.

### `GET /api/users/bookings`
Get booking history for the logged-in user.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK` with array of bookings.

### `PUT /api/users/bookings/:id/cancel`
Cancel a specific booking.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK` with refund processing status.

---

## 3. Admin & Core Entities

### `GET /api/admin/stats`
Get aggregated statistics for the admin dashboard.
- **Headers:** `Authorization: Bearer <token>` (Admin Only)
- **Response:** `200 OK` with totals, revenue, and chart data.

### `GET /api/admin/movies`
Get all movies.
- **Response:** `200 OK` with array of movies.

### `POST /api/admin/movies`
Add a new movie.
- **Headers:** `Authorization: Bearer <token>` (Admin Only)
- **Body:** `{ "title": "Inception", "genre": "Sci-Fi", "duration": 148, "language": "English", "posterUrl": "..." }`
- **Response:** `201 Created`

### `GET /api/admin/shows`
Get all shows with populated references.
- **Response:** `200 OK` with array of shows.

---

## 4. Booking & Payment

### `POST /api/bookings/hold`
Hold seats temporarily before payment.
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "showId": "...", "seats": ["A1", "A2"], "totalAmount": 500, "idempotencyKey": "..." }`
- **Response:** `201 Created` with booking ID.

### `POST /api/payment/create-order`
Create Razorpay order for payment.
- **Body:** `{ "amount": 500 }`
- **Response:** `200 OK` with order details.

### `POST /api/payment/verify`
Verify Razorpay signature and confirm booking.
- **Body:** `{ "razorpay_order_id": "...", "razorpay_payment_id": "...", "razorpay_signature": "...", "bookingId": "..." }`
- **Response:** `200 OK` (Seats move from Hold to Booked).
