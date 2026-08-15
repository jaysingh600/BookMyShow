import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

// Routes
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Attach socket.io to app so it can be used in controllers
app.set('io', io);

// Middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Rate Limiting
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Route Middlewares
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// Basic Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'CineReserve API is running' });
});

// Socket.io for Real-time
const lockedSeats = {}; // Format: { showId: { seatId: socketId } }

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Send current locked seats when a client joins a show
  socket.on('joinShow', (showId) => {
    socket.join(showId);
    if (!lockedSeats[showId]) {
      lockedSeats[showId] = {};
    }
    socket.emit('initialLockedSeats', lockedSeats[showId]);
  });

  socket.on('lockSeat', ({ showId, seatId }) => {
    if (!lockedSeats[showId]) {
      lockedSeats[showId] = {};
    }
    
    // If seat is not locked, lock it for this user
    if (!lockedSeats[showId][seatId]) {
      lockedSeats[showId][seatId] = socket.id;
      // Broadcast to everyone else in this show that the seat is locked
      socket.to(showId).emit('seatLocked', { seatId, socketId: socket.id });
    }
  });

  socket.on('unlockSeat', ({ showId, seatId }) => {
    if (lockedSeats[showId] && lockedSeats[showId][seatId] === socket.id) {
      delete lockedSeats[showId][seatId];
      socket.to(showId).emit('seatUnlocked', { seatId });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Find all seats locked by this socket and unlock them
    for (const showId in lockedSeats) {
      for (const seatId in lockedSeats[showId]) {
        if (lockedSeats[showId][seatId] === socket.id) {
          delete lockedSeats[showId][seatId];
          io.to(showId).emit('seatUnlocked', { seatId });
        }
      }
    }
  });
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cinereserve';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
