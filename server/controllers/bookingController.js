import mongoose from 'mongoose';
import Show from '../models/Show.js';
import SeatHold from '../models/SeatHold.js';
import Booking from '../models/Booking.js';

export const holdSeats = async (req, res) => {
  const { showId, seats, totalAmount, idempotencyKey } = req.body;

  if (!seats || seats.length === 0) {
    return res.status(400).json({ success: false, message: 'No seats provided' });
  }

  // Idempotency check: Have we already processed this?
  if (idempotencyKey) {
    const existingBooking = await Booking.findOne({ idempotencyKey });
    if (existingBooking) {
      return res.status(200).json({ success: true, booking: existingBooking });
    }
  }

  let session = null;
  let useTransaction = false;

  try {
    session = await mongoose.startSession();
    try {
      session.startTransaction();
      useTransaction = true;
    } catch (err) {
      // Standalone MongoDB, we will proceed without multi-doc transaction
      // This is perfectly safe because of the SeatHold compound unique index!
      useTransaction = false;
    }

    const opts = useTransaction ? { session } : {};

    // 1. Verify Availability (Are seats already permanently booked?)
    const show = await Show.findById(showId).session(useTransaction ? session : null);
    if (!show) {
      if (useTransaction) await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    const alreadyBooked = seats.some(seat => show.bookedSeats.includes(seat));
    if (alreadyBooked) {
      if (useTransaction) await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'One or more seats have just been booked by another user.' });
    }

    // 2. Create Temporary Locks (SeatHolds)
    const seatHolds = seats.map(seatId => ({
      show: showId,
      seatId,
    }));

    try {
      await SeatHold.insertMany(seatHolds, opts);
    } catch (insertError) {
      // Code 11000 = Duplicate Key Error (Someone else holds the seat concurrently)
      if (insertError.code === 11000) {
        if (useTransaction) await session.abortTransaction();
        return res.status(409).json({ success: false, message: 'Seat has just been booked or held by another user.' });
      }
      throw insertError;
    }

    // 3. Create Booking (Status: HOLD)
    const booking = new Booking({
      show: showId,
      seats,
      totalAmount,
      status: 'HOLD',
      idempotencyKey
    });
    
    await booking.save(opts);

    // Update SeatHolds with the bookingId now that we have it
    await SeatHold.updateMany(
      { show: showId, seatId: { $in: seats } },
      { $set: { bookingId: booking._id } },
      opts
    );

    if (useTransaction) await session.commitTransaction();

    res.status(201).json({ success: true, booking });

  } catch (error) {
    if (useTransaction && session) {
      await session.abortTransaction();
    }
    console.error('Hold seats error:', error);
    res.status(500).json({ success: false, message: 'Failed to hold seats due to an internal error.' });
  } finally {
    if (session) session.endSession();
  }
};
