import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if guest checkout is allowed
  seats: [{ type: String, required: true }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['HOLD', 'CONFIRMED', 'FAILED', 'CANCELLED'], default: 'HOLD' },
  idempotencyKey: { type: String, unique: true, sparse: true }, // To prevent duplicate booking requests
  paymentId: { type: String }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
