# CineReserve - Viva Questions & Answers

**Q1: What is the main objective of your project?**
**A:** The main objective is to build a highly concurrent, real-time movie ticket booking system similar to BookMyShow. It focuses on resolving the "double-booking" problem using WebSockets and database-level locks, ensuring a smooth user experience.

**Q2: Which technology stack did you use and why?**
**A:** I used the MERN stack (MongoDB, Express, React, Node.js). Node.js is great for I/O heavy applications like ticketing. React provides a dynamic and responsive UI. MongoDB's flexible schema allows for complex hierarchical data (City -> Theatre -> Auditorium -> Show).

**Q3: How did you handle the concurrency issue where two users try to book the same seat?**
**A:** I used a two-step approach:
1. **Frontend (Visual):** Socket.io broadcasts a `seatLocked` event when a user clicks a seat, turning it yellow for others immediately.
2. **Backend (Database):** When clicking 'Pay', a `SeatHold` document is created. The `SeatHold` schema has a compound unique index on `{ show: 1, seatId: 1 }`. If two users hit the API at the exact same millisecond, MongoDB will throw a Duplicate Key Error (11000) for the second user, guaranteeing absolute consistency.

**Q4: What happens if a user selects a seat but closes the browser without paying?**
**A:** The `SeatHold` schema uses a MongoDB TTL (Time-To-Live) index set to 300 seconds (5 minutes). MongoDB automatically deletes the hold document after 5 minutes, freeing up the seat for other users without requiring manual cron jobs.

**Q5: How did you integrate the payment gateway?**
**A:** I integrated Razorpay. The backend creates an Order using the Razorpay API and sends the Order ID to the frontend. The frontend opens the Razorpay checkout modal. Upon success, Razorpay returns a payment signature. The backend verifies this signature using the Razorpay secret key (crypto HMAC SHA256) to prevent tampering before confirming the booking.

**Q6: What security measures are implemented in your backend?**
**A:** 
- **Helmet:** Sets secure HTTP headers.
- **express-rate-limit:** Prevents DDoS and brute-force attacks by limiting requests per IP.
- **express-mongo-sanitize:** Prevents NoSQL injection attacks by sanitizing inputs.
- **xss-clean:** Prevents Cross-Site Scripting (XSS) by stripping dangerous HTML tags from user inputs.
- **JWT:** Stateless, secure authentication.

**Q7: Explain the Database Schema hierarchy.**
**A:** 
- `City` has many `Theatres`.
- `Theatre` has many `Auditoriums` (Screens).
- `Auditorium` defines the physical seat layout and rows.
- `Movie` contains details about the film.
- `Show` connects a `Movie` and an `Auditorium` at a specific `Date/Time`.
- `Booking` contains the `User`, `Show`, and array of `Seats`.

**Q8: Why did you use Recharts for the Admin Dashboard?**
**A:** Recharts is built specifically for React with declarative components. It makes it very easy to plot revenue over time (AreaChart) and weekly bookings (BarChart) while maintaining responsiveness and smooth animations.

**Q9: How are tickets generated and downloaded?**
**A:** On the `TicketConfirmation` page, I use `react-qr-code` to generate a QR code containing the Booking ID. To download the PDF, I use `html2canvas` to take a high-quality snapshot of the DOM element, and `jspdf` to convert that image into a downloadable PDF file.

**Q10: What challenges did you face during development?**
**A:** The biggest challenge was ensuring data consistency during concurrent bookings. Initially, I tried checking the database and then inserting, but a race condition still existed. I solved it by relying on MongoDB's unique index constraints at the database engine level.
