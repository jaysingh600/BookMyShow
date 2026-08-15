import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaHistory, FaCalendarCheck, FaSignOutAlt, FaTicketAlt, FaBan } from 'react-icons/fa';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const [profileRes, bookingsRes] = await Promise.all([
        fetch('http://localhost:5000/api/users/profile', { headers }),
        fetch('http://localhost:5000/api/users/bookings', { headers })
      ]);

      const profileData = await profileRes.json();
      const bookingsData = await bookingsRes.json();

      if (profileData.success) setUser(profileData.user);
      if (bookingsData.success) setBookings(bookingsData.bookings);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);



  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/users/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        alert(data.message);
        // Refresh bookings
        fetchUserData();
      } else {
        alert(data.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Cancel booking error:', error);
      alert('Failed to cancel booking');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center bg-gray-50"><p className="text-xl font-bold text-gray-500">Loading Dashboard...</p></div>;
  }

  const upcomingBookings = bookings.filter(b => b.status === 'CONFIRMED' && new Date(b.show.date) >= new Date());
  const pastBookings = bookings.filter(b => b.status !== 'CONFIRMED' || new Date(b.show.date) < new Date());

  return (
    <div className="min-h-screen bg-gray-50 font-sans py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-fit">
          <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white text-center">
            <div className="w-20 h-20 bg-primary rounded-full mx-auto flex items-center justify-center text-3xl font-black mb-4 shadow-lg shadow-red-500/30">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
          <div className="flex flex-col py-4">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-6 py-3 font-semibold transition-colors ${activeTab === 'profile' ? 'text-primary bg-red-50 border-r-4 border-primary' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <FaUser /> Profile Details
            </button>
            <button 
              onClick={() => setActiveTab('upcoming')}
              className={`flex items-center gap-3 px-6 py-3 font-semibold transition-colors ${activeTab === 'upcoming' ? 'text-primary bg-red-50 border-r-4 border-primary' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <FaCalendarCheck /> Upcoming Bookings
            </button>
            <button 
              onClick={() => setActiveTab('past')}
              className={`flex items-center gap-3 px-6 py-3 font-semibold transition-colors ${activeTab === 'past' ? 'text-primary bg-red-50 border-r-4 border-primary' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <FaHistory /> Past & Cancelled
            </button>
            <hr className="my-2 border-gray-100" />
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-6 py-3 font-semibold text-red-500 hover:bg-red-50 transition-colors"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full md:w-3/4">
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 animate-fade-in">
              <h3 className="text-2xl font-bold text-dark mb-6">Profile Settings</h3>
              <form className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input type="text" defaultValue={user?.name} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-red-100 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input type="email" defaultValue={user?.email} disabled className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" defaultValue={user?.phone || ''} placeholder="Add your phone number" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-red-100 outline-none transition-all" />
                </div>
                <button type="button" className="bg-primary text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-red-600 transition-colors">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Upcoming Bookings Tab */}
          {activeTab === 'upcoming' && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-bold text-dark mb-6">Upcoming Shows</h3>
              {upcomingBookings.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                   <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-4xl">
                     <FaTicketAlt />
                   </div>
                   <h4 className="text-xl font-bold text-dark mb-2">No upcoming bookings</h4>
                   <p className="text-gray-500 mb-6">Looks like you haven't booked any movies yet.</p>
                   <Link to="/" className="bg-primary text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-red-600 transition-colors inline-block">Book a Ticket</Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {upcomingBookings.map(booking => (
                    <BookingCard key={booking._id} booking={booking} onCancel={() => handleCancelBooking(booking._id)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Past Bookings Tab */}
          {activeTab === 'past' && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-bold text-dark mb-6">Booking History</h3>
              {pastBookings.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center text-gray-500 font-medium">
                   No past bookings found.
                </div>
              ) : (
                <div className="space-y-6">
                  {pastBookings.map(booking => (
                    <BookingCard key={booking._id} booking={booking} isPast />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const BookingCard = ({ booking, isPast, onCancel }) => {
  const { show, seats, totalAmount, status, refundStatus, _id } = booking;
  const isCancelled = status === 'CANCELLED';

  return (
    <div className={`bg-white rounded-2xl shadow-lg border ${isCancelled ? 'border-red-200' : 'border-gray-100'} overflow-hidden flex flex-col sm:flex-row relative`}>
      {/* Date Tag */}
      <div className={`w-full sm:w-32 ${isCancelled ? 'bg-red-50' : 'bg-gray-50'} flex sm:flex-col justify-between sm:justify-center items-center p-4 border-b sm:border-b-0 sm:border-r border-gray-100 border-dashed`}>
         <div className="text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{new Date(show.date).toLocaleDateString('en-US', { month: 'short' })}</p>
            <p className="text-3xl font-black text-dark">{new Date(show.date).getDate()}</p>
         </div>
         <div className="text-center mt-0 sm:mt-2">
            <p className="text-sm font-bold text-primary">{show.startTime}</p>
         </div>
      </div>

      <div className="p-6 flex-grow flex flex-col justify-between">
         <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-xl font-bold text-dark">{show.movie.title}</h4>
              <p className="text-sm text-gray-500 font-medium">{show.movie.languages} • {show.movie.format}</p>
              <p className="text-sm text-gray-500 mt-2">{show.theatre.name} ({show.theatre.city?.name}) - {show.auditorium.name}</p>
            </div>
            <div className="text-right">
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {status}
              </span>
              {isCancelled && refundStatus && (
                 <p className="text-xs text-red-500 mt-1 font-semibold">Refund: {refundStatus}</p>
              )}
            </div>
         </div>
         
         <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100">
            <div>
               <p className="text-xs text-gray-400 font-bold uppercase mb-1">Seats ({seats.length})</p>
               <p className="font-semibold text-gray-800">{seats.join(', ')}</p>
            </div>
            <div className="text-right">
               <p className="text-xs text-gray-400 font-bold uppercase mb-1">Total</p>
               <p className="font-bold text-dark">₹{totalAmount}</p>
            </div>
         </div>
      </div>

      {!isPast && status === 'CONFIRMED' && (
        <div className="bg-gray-50 p-4 flex sm:flex-col justify-center gap-3 border-t sm:border-t-0 sm:border-l border-gray-100">
           <Link to={`/ticket/${_id}`} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-dark text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors">
              <FaTicketAlt /> View Ticket
           </Link>
           <button onClick={onCancel} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-red-200 text-red-500 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-50 transition-colors">
              <FaBan /> Cancel
           </button>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
