import express from 'express';
import { holdSeats, getBookingById } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/hold', holdSeats);
router.get('/:id', getBookingById);

export default router;
