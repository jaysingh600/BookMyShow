import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';

// Routes
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));

// Route Middlewares
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

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
