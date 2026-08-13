import mongoose from 'mongoose';

const theatreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  address: { type: String, required: true },
  images: [{ type: String }], // Cloudinary URLs
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Theatre', theatreSchema);
