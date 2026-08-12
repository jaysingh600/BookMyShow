import Razorpay from 'razorpay';
import crypto from 'crypto';

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
      // In a real app, you would save the booking to the database here
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
