import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CheckoutSummary = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fee structure
  const CONVENIENCE_FEE_PER_TICKET = 30; // ₹30 per ticket
  const GST_PERCENTAGE = 0.18; // 18% on convenience fee

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`);
        const data = await res.json();
        if (data.success) {
          setBooking(data.booking);
        } else {
          alert('Booking not found or expired.');
          navigate('/');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId, navigate]);

  const handlePayment = async () => {
    try {
      const totalAmount = calculateGrandTotal();

      // Initiate Payment
      const res = await fetch('http://localhost:5000/api/payment/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount })
      });
      const data = await res.json();
      
      if (!data.success) {
        alert('Failed to create payment order');
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key_id',
        amount: data.order.amount,
        currency: "INR",
        name: "CineReserve",
        description: `Booking ID: ${booking._id}`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            // Verify payment and complete booking
            const verifyRes = await fetch('http://localhost:5000/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...response, bookingId })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              // Navigate to Ticket Confirmation Page
              navigate(`/ticket/${bookingId}`);
            } else {
              alert('Payment verification failed.');
              navigate('/');
            }
          } catch (err) {
            console.error(err);
            alert('Error during verification');
          }
        },
        theme: {
          color: "#dc2626"
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert('Error initiating payment');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-xl font-bold text-gray-500">Loading Checkout...</p></div>;
  }

  if (!booking) return null;

  const { show, seats, totalAmount: ticketAmount } = booking;
  const numTickets = seats.length;
  const baseConvenienceFee = numTickets * CONVENIENCE_FEE_PER_TICKET;
  const gst = baseConvenienceFee * GST_PERCENTAGE;
  const totalConvenienceFee = baseConvenienceFee + gst;
  
  const calculateGrandTotal = () => {
    return ticketAmount + totalConvenienceFee;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans text-dark">
      <div className="container mx-auto max-w-5xl flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Booking Details */}
        <div className="w-full md:w-2/3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold text-red-600 uppercase tracking-wider mb-1">Booking Summary</h2>
              <p className="text-gray-500 text-sm">Please verify your details before proceeding</p>
           </div>
           
           <div className="flex gap-6 mb-8">
             {/* Movie Poster */}
             <div className="w-32 h-48 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                <img src={show.movie.posterUrl || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} alt={show.movie.title} className="w-full h-full object-cover" />
             </div>
             
             {/* Show Info */}
             <div className="flex flex-col justify-center">
                <h3 className="text-3xl font-bold mb-2">{show.movie.title}</h3>
                <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-600 mb-3 uppercase">
                   <span className="bg-gray-100 px-2 py-1 rounded">{show.movie.certification || 'UA'}</span>
                   <span className="bg-gray-100 px-2 py-1 rounded">{show.movie.format || '2D'}</span>
                   <span className="bg-gray-100 px-2 py-1 rounded">{show.movie.languages || 'English'}</span>
                </div>
                <p className="text-gray-600 mb-1 font-medium">{show.theatre.name}, {show.theatre.city?.name || 'City'}</p>
                <p className="text-gray-500 text-sm">{show.auditorium.name}</p>
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
              <div>
                 <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Date & Time</p>
                 <p className="font-bold text-lg">{new Date(show.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}, {show.startTime}</p>
              </div>
              <div>
                 <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Selected Seats ({numTickets})</p>
                 <p className="font-bold text-lg">{seats.join(', ')}</p>
              </div>
           </div>

           {/* Contact Info Mock */}
           <div className="mb-4">
              <h4 className="font-bold mb-3">Contact Details</h4>
              <input type="email" placeholder="Email Address for E-Ticket" className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:border-primary" />
              <input type="tel" placeholder="Phone Number" className="w-full p-3 border rounded-lg focus:outline-none focus:border-primary" />
           </div>
        </div>

        {/* Right Side: Payment Summary */}
        <div className="w-full md:w-1/3">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              
              <div className="flex justify-between items-center mb-3 text-gray-700">
                 <span>Tickets ({numTickets})</span>
                 <span className="font-bold">₹{ticketAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center mb-1 text-gray-700">
                 <span className="text-sm">Convenience Fee</span>
                 <span className="font-bold text-sm">₹{baseConvenienceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4 text-gray-500 text-xs">
                 <span>GST (18%)</span>
                 <span>₹{gst.toFixed(2)}</span>
              </div>

              <hr className="border-gray-200 mb-4" />

              <div className="bg-[#fff9e6] border border-[#ffecb3] p-3 rounded flex justify-between items-center mb-6 text-[#b07d00] text-sm font-bold">
                 <span>Amount Payable</span>
                 <span className="text-lg">₹{calculateGrandTotal().toFixed(2)}</span>
              </div>

              <div className="text-xs text-gray-500 mb-6 text-center">
                 By proceeding, I express my consent to complete this transaction.
              </div>

              <button 
                onClick={handlePayment} 
                className="w-full bg-primary hover:bg-red-600 text-white py-4 rounded-lg font-bold text-lg shadow-md transition-colors"
              >
                Proceed to Pay
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
