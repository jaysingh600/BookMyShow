import express from 'express';
import { 
  getUserProfile, 
  updateUserProfile, 
  getUserBookings, 
  cancelBooking 
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/bookings')
  .get(protect, getUserBookings);

router.route('/bookings/:id/cancel')
  .put(protect, cancelBooking);

export default router;
