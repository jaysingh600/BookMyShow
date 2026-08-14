import express from 'express';
import { holdSeats } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/hold', holdSeats);

export default router;
