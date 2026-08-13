import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('City', citySchema);
