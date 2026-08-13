import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  language: { type: String },
  genre: { type: String },
  duration: { type: Number }, // in minutes
  posterUrl: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Movie', movieSchema);
