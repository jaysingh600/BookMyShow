# BookMyShow Clone

This repository contains a full-stack clone of BookMyShow, featuring a React front-end (Vite) and an Express/Node.js back-end with MongoDB.

## Project Structure
- `/client` - React frontend powered by Vite and TailwindCSS.
- `/server` - Express backend with MongoDB and Mongoose.
- `/docs` - Architecture and project documentation.

## Recent Fixes & Updates

### Server Fixes
- **Booking Cancellation Crash Fix**: Fixed a critical schema validation error in `server/models/Booking.js` where the `status` field did not accept the `"CANCELLED"` value. Added `"CANCELLED"` to the allowed enum (`['HOLD', 'CONFIRMED', 'FAILED', 'CANCELLED']`), preventing the backend from crashing when users cancel a ticket.

### Client Fixes (React/Vite)
Cleaned up the codebase to achieve 0 warnings and 0 errors in the linter (`oxlint`). Addressed several potential memory leaks, infinite rendering loops, and unused variables across the following components:
- **`src/pages/CheckoutSummary.jsx`**: Fixed a missing dependency in `useEffect` by moving `fetchBookingDetails` inside the effect hook, preventing potential stale closures.
- **`src/pages/TicketConfirmation.jsx`**: Fixed a missing dependency in `useEffect` by moving `fetchBookingDetails` inside the effect hook.
- **`src/pages/UserDashboard.jsx`**: Fixed a missing dependency for `fetchUserData` by wrapping it in `useCallback` and passing it to the dependency array. Removed the unused `showDate` variable.
- **`src/pages/SeatSelection.jsx`**: Fixed a missing dependency for `fetchShowData` by wrapping it in `useCallback`, ensuring the real-time seat lock/unlock logic functions with the latest show data.
- **`src/pages/TheatreListing.jsx`**: Fixed a missing dependency for `fetchShows` by moving it inside the `useEffect`. Cleaned up unused React icon imports.
- **`src/components/AuthModal.jsx`**: Removed the unused `FaEnvelope` import.
- **`src/pages/admin/AdminDashboard.jsx`**: Cleaned up multiple unused imports from the `recharts` library.
