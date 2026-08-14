import mongoose from 'mongoose';

const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
  auditorium: { type: mongoose.Schema.Types.ObjectId, ref: 'Auditorium', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // e.g. "10:00 AM"
  endTime: { type: String, required: true }, // e.g. "12:30 PM"
  pricing: {
    VIP: { type: Number, default: 0 },
    Premium: { type: Number, default: 0 },
    Normal: { type: Number, default: 0 }
  },
  isPublished: { type: Boolean, default: false },
  bookedSeats: [{ type: String }]
}, { timestamps: true, optimisticConcurrency: true });

export default mongoose.model('Show', showSchema);
