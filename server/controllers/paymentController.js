import Razorpay from 'razorpay';
import crypto from 'crypto';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import SeatHold from '../models/SeatHold.js';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Amount is in rupees, convert to paise for Razorpay
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await razorpay.orders.create(options);
    
    if (!order) {
      return res.status(500).json({ success: false, message: "Some error occurred" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Create order error: ", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret')
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const { bookingId } = req.body;
      if (bookingId) {
        // Complete the booking
        const booking = await Booking.findById(bookingId);
        if (booking && booking.status === 'HOLD') {
          booking.status = 'CONFIRMED';
          booking.paymentId = razorpay_payment_id;
          await booking.save();

          // Move seats to permanently booked
          await Show.findByIdAndUpdate(booking.show, {
            $push: { bookedSeats: { $each: booking.seats } }
          });

          // Delete temporary holds
          await SeatHold.deleteMany({ bookingId: booking._id });

          // Emit socket events
          if (req.app.get('io')) {
             req.app.get('io').emit('adminRefresh');
             // If we had a way to map user to socket ID, we would do io.to(socketId).emit('bookingConfirmed')
             // For now, we broadcast to the show room that seats are permanently booked
             req.app.get('io').to(booking.show.toString()).emit('bookingConfirmed', { seats: booking.seats });
          }
        }
      }

      res.status(200).json({ 
        success: true, 
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id 
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Verify payment error: ", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};
