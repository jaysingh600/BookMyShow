import mongoose from 'mongoose';

const auditoriumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
  rows: { type: Number, required: true },
  columns: { type: Number, required: true },
  
  rowCategories: [{
    rowLabel: { type: String, required: true },
    category: { type: String, enum: ['VIP', 'Premium', 'Normal'], default: 'Normal' },
  }],

  blockedSeats: [{ type: String }],
  disabledSeats: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Auditorium', auditoriumSchema);
