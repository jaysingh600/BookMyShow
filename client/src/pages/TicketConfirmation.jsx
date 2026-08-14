import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FaDownload, FaEnvelope, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const TicketConfirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const ticketRef = useRef(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`);
      const data = await res.json();
      if (data.success) {
        setBooking(data.booking);
      } else {
        alert('Booking not found.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const input = ticketRef.current;
    if (!input) return;

    try {
      // Temporarily hide the action buttons for the PDF snapshot
      const actionsDiv = input.querySelector('.ticket-actions');
      if (actionsDiv) actionsDiv.style.display = 'none';

      const canvas = await html2canvas(input, {
        scale: 2, // Higher quality
        useCORS: true,
        backgroundColor: '#f9fafb'
      });

      if (actionsDiv) actionsDiv.style.display = 'flex';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Ticket_${bookingId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF", error);
      alert('Failed to generate PDF ticket.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-xl font-bold text-gray-500">Loading Ticket...</p></div>;
  }

  if (!booking) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-xl font-bold text-red-500">Failed to load ticket.</p></div>;
  }

  const { show, seats, totalAmount, status, paymentId } = booking;
  const isConfirmed = status === 'CONFIRMED';

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans flex justify-center items-start">
      <div 
        ref={ticketRef}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row relative"
      >
        {/* Decorative Ticket Edge */}
        <div className="hidden md:block absolute left-1/3 top-0 bottom-0 w-8 flex flex-col justify-between items-center -translate-x-1/2 overflow-hidden z-10 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
             <div key={i} className="w-4 h-4 bg-gray-50 rounded-full my-1"></div>
          ))}
        </div>
        
        {/* Left Side: Movie & QR */}
        <div className="w-full md:w-1/3 bg-gray-900 text-white p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-dashed border-gray-700 relative z-0">
           <h2 className="text-2xl font-black tracking-widest text-primary mb-6 uppercase">CineReserve</h2>
           
           <div className="bg-white p-3 rounded-lg mb-6 shadow-lg shadow-black/20">
              <QRCode 
                value={booking._id} 
                size={150} 
                bgColor="#ffffff"
                fgColor="#000000"
                level="Q"
              />
           </div>
           
           <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Booking ID</p>
           <p className="text-sm font-mono text-gray-200">{booking._id.substring(0, 12).toUpperCase()}</p>
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-2/3 p-8 relative z-0">
           <div className="flex justify-between items-start mb-6">
              <div>
                 <h1 className="text-3xl font-bold text-dark leading-tight">{show.movie.title}</h1>
                 <p className="text-sm text-gray-500 font-medium">{show.movie.languages || 'English'} • {show.movie.format || '2D'}</p>
              </div>
              <div className={`flex flex-col items-end ${isConfirmed ? 'text-green-600' : 'text-red-500'}`}>
                 {isConfirmed ? <FaCheckCircle size={32} /> : <FaTimesCircle size={32} />}
                 <span className="text-xs font-bold uppercase mt-1">{status}</span>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
              <div>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Theatre</p>
                 <p className="font-bold text-gray-800">{show.theatre.name}</p>
                 <p className="text-sm text-gray-500">{show.theatre.city?.name}</p>
              </div>
              <div>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Screen</p>
                 <p className="font-bold text-gray-800">{show.auditorium.name}</p>
              </div>
              <div>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Date</p>
                 <p className="font-bold text-gray-800">{new Date(show.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
              </div>
              <div>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Time</p>
                 <p className="font-bold text-gray-800">{show.startTime}</p>
              </div>
           </div>

           <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8 flex justify-between items-center">
              <div>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Seats ({seats.length})</p>
                 <p className="font-black text-xl text-primary">{seats.join(', ')}</p>
              </div>
              <div className="text-right">
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Paid</p>
                 <p className="font-black text-xl text-dark">₹{totalAmount}</p>
              </div>
           </div>

           {isConfirmed && paymentId && (
              <p className="text-xs text-gray-400 mb-6 font-mono">Payment Ref: {paymentId}</p>
           )}

           {/* Actions - Hidden during PDF generation */}
           <div className="ticket-actions flex flex-wrap gap-4 mt-auto">
              <button 
                onClick={downloadPDF}
                disabled={!isConfirmed}
                className={`flex-1 flex justify-center items-center gap-2 py-3 px-4 rounded-lg font-bold text-sm transition-colors ${isConfirmed ? 'bg-primary hover:bg-red-600 text-white shadow-md' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                <FaDownload /> Download Ticket
              </button>
              <button 
                disabled={!isConfirmed}
                className={`flex-1 flex justify-center items-center gap-2 py-3 px-4 rounded-lg font-bold text-sm border transition-colors ${isConfirmed ? 'border-primary text-primary hover:bg-red-50' : 'border-gray-300 text-gray-500 cursor-not-allowed bg-gray-100'}`}
              >
                <FaEnvelope /> Email Ticket
              </button>
           </div>
           
           <div className="mt-4 text-center">
              <Link to="/" className="text-sm font-bold text-gray-500 hover:text-dark transition-colors">Return to Home</Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TicketConfirmation;
