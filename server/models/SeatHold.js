import mongoose from 'mongoose';

const seatHoldSchema = new mongoose.Schema({
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  seatId: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bookingId: { type: String }, // To link holds to a booking session
  createdAt: { type: Date, default: Date.now, expires: 300 } // TTL Index: Auto-delete after 5 minutes (300 seconds)
});

// Compound unique index guarantees that the combination of show + seatId is unique.
// This is the core of our concurrency safety: it is mathematically impossible for 
// two users to hold the same seat at the same time at the database level.
seatHoldSchema.index({ show: 1, seatId: 1 }, { unique: true });

export default mongoose.model('SeatHold', seatHoldSchema);
