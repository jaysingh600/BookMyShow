import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { FaSearchPlus, FaSearchMinus } from 'react-icons/fa';

const SOCKET_URL = 'http://localhost:5000';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [lockedSeats, setLockedSeats] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showData, setShowData] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const [bookedSeats] = useState(['A3', 'A4', 'C5', 'C6']);

  const fetchShowData = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/shows');
      const data = await res.json();
      if (data.success) {
        const currentShow = data.shows.find(s => s._id === showId);
        if (currentShow) {
          setShowData(currentShow);
        } else {
          setShowData({
            _id: showId,
            movie: { title: "Movie Name" },
            theatre: { name: "Theatre Name" },
            auditorium: {
              name: "Screen 1",
              rows: 10,
              columns: 16,
              blockedSeats: ['A1', 'A2', 'J15', 'J16'],
              rowCategories: [
                { rowLabel: 'J', category: 'VIP' },
                { rowLabel: 'I', category: 'VIP' },
                { rowLabel: 'H', category: 'Premium' },
                { rowLabel: 'G', category: 'Premium' }
              ]
            },
            date: new Date(),
            startTime: "10:00 AM",
            pricing: {
              VIP: 500,
              Premium: 300,
              Normal: 150
            }
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [showId]);

  useEffect(() => {
    fetchShowData();

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.emit('joinShow', showId);

    newSocket.on('initialLockedSeats', (seats) => {
      setLockedSeats(seats || {});
    });

    newSocket.on('seatLocked', ({ seatId, socketId }) => {
      setLockedSeats((prev) => ({ ...prev, [seatId]: socketId }));
    });

    newSocket.on('seatUnlocked', ({ seatId }) => {
      setLockedSeats((prev) => {
        const updated = { ...prev };
        delete updated[seatId];
        return updated;
      });
    });

    newSocket.on('networkDownConflict', (data) => {
      if (!selectedSeats || selectedSeats.length === 0) return;
      const mySeats = selectedSeats;
      const conflictSeats = data.seats || [];
      const hasConflict = mySeats.some(seat => conflictSeats.includes(seat));
      
      if (hasConflict) {
        alert("your network is down");
        navigate('/');
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [showId, fetchShowData]);

  const getSeatCategory = (rowLabel) => {
    if (!showData || !showData.auditorium.rowCategories) return 'Normal';
    const cat = showData.auditorium.rowCategories.find(c => c.rowLabel === rowLabel);
    return cat ? cat.category : 'Normal';
  };

  const getSeatPrice = (rowLabel) => {
    if (!showData) return 0;
    const cat = getSeatCategory(rowLabel);
    return showData.pricing[cat] || 0;
  };

  const toggleSeatSelection = (seatId) => {
    if (!socket || !showData) return;
    
    // Check if blocked or booked
    if (showData.auditorium.blockedSeats?.includes(seatId) || bookedSeats.includes(seatId)) {
       return;
    }

    // If the seat is locked by someone else
    if (lockedSeats[seatId] && lockedSeats[seatId] !== socket.id) {
      return;
    }

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
      socket.emit('unlockSeat', { showId, seatId });
      setLockedSeats(prev => {
        const updated = { ...prev };
        delete updated[seatId];
        return updated;
      });
    } else {
      setSelectedSeats(prev => [...prev, seatId]);
      socket.emit('lockSeat', { showId, seatId });
      setLockedSeats(prev => ({ ...prev, [seatId]: socket.id }));
    }
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      const rowLabel = seatId.replace(/[0-9]/g, '');
      return total + getSeatPrice(rowLabel);
    }, 0);
  };

  const handlePayment = async () => {
    try {
      const amount = calculateTotal();
      if(amount === 0) return;

      // 1. Hold the seats
      const idempotencyKey = `idemp_${Date.now()}_${Math.random()}`;
      const holdRes = await fetch('http://localhost:5000/api/bookings/hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showId,
          seats: selectedSeats,
          totalAmount: amount,
          idempotencyKey
        })
      });
      const holdData = await holdRes.json();

      if (!holdData.success) {
        if (holdData.message === 'NETWORK_DOWN') {
          alert('your network is down');
          navigate('/');
          return;
        }
        alert(holdData.message || 'Failed to hold seats. They might have just been booked.');
        // Refresh show data to get latest booked seats
        fetchShowData();
        setSelectedSeats([]);
        return;
      }

      const bookingId = holdData.booking._id;

      // 2. Navigate to Checkout Summary
      navigate(`/checkout/${bookingId}`);

    } catch (error) {
      console.error(error);
      alert('Error initiating booking flow');
    }
  };

  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 2));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.5));

  if (!showData) {
    return <div className="min-h-screen flex items-center justify-center bg-grayLight"><p className="text-xl font-bold text-gray-500">Loading seat layout...</p></div>;
  }

  // Generate grid based on rows and columns
  const rowLabels = Array.from({ length: showData.auditorium.rows }, (_, i) => String.fromCharCode(65 + i)).reverse(); // A is usually closest to screen, so reverse to show A at bottom, or keep it. Actually BookMyShow has A at the front (closest to screen) and Z at the back. Wait, let's keep it A at the top, or Z at the top. Let's just use A-Z normal order from front to back. Or reverse it so VIP is at the back.
  // Actually, usually A is front row. I will reverse it so A is at the bottom (closest to screen) like BookMyShow.
  // Bookmyshow usually has Screen at the bottom, or top? Screen is usually at the bottom.
  // Wait, my screen indicator is at the bottom. So A should be at the bottom.
  // Let's reverse the array so the last row is at the top.
  
  const cols = Array.from({ length: showData.auditorium.columns }, (_, i) => i + 1);

  // Group rows by category
  const groupedRows = rowLabels.reduce((acc, rowLabel) => {
    const cat = getSeatCategory(rowLabel);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(rowLabel);
    return acc;
  }, {});

  // Order categories: VIP, Premium, Normal
  const categoryOrder = ['VIP', 'Premium', 'Normal'];
  const sortedCategories = Object.keys(groupedRows).sort((a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div>
             <h1 className="text-xl font-bold text-dark leading-tight">{showData.movie?.title}</h1>
             <p className="text-xs text-gray-500">{showData.theatre?.name} | {new Date(showData.date).toLocaleDateString()} | {showData.startTime}</p>
          </div>
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-dark border border-gray-300 hover:bg-gray-50 rounded px-4 py-1.5 text-sm font-medium transition-colors">Cancel</button>
        </div>
      </div>

      {/* Seat Layout Area */}
      <div className="flex-grow flex flex-col relative overflow-hidden bg-grayLight">
        
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white/90 backdrop-blur p-2 rounded-lg shadow-md border border-gray-200">
           <button onClick={zoomIn} className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded transition-colors" title="Zoom In"><FaSearchPlus /></button>
           <button onClick={zoomOut} className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded transition-colors" title="Zoom Out"><FaSearchMinus /></button>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 py-4 bg-white shadow-sm z-10 text-xs font-medium text-gray-600 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-green-500 rounded-sm"></div> Available
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-sm"></div> Selected
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-sm"></div> Booked
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div> Held
          </div>
        </div>

        {/* Grid Wrapper */}
        <div className="flex-grow overflow-auto p-8 custom-scrollbar relative flex justify-center items-start pt-12">
          <div 
            className="transition-transform duration-200 origin-top flex flex-col gap-8"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {sortedCategories.map(category => (
              <div key={category} className="mb-2">
                 <div className="border-b border-gray-300 pb-1 mb-4 flex justify-between items-end text-gray-500 text-xs font-bold px-8">
                    <span>{category.toUpperCase()} - ₹{showData.pricing[category] || 0}</span>
                 </div>
                 
                 <div className="flex flex-col gap-3">
                   {groupedRows[category].map(row => (
                     <div key={row} className="flex gap-2 items-center">
                       <span className="w-8 text-right font-bold text-gray-400 text-xs mr-4">{row}</span>
                       <div className="flex gap-2">
                         {cols.map(col => {
                           const seatId = `${row}${col}`;
                           const isBlocked = showData.auditorium.blockedSeats?.includes(seatId);
                           const isBooked = bookedSeats.includes(seatId);
                           const isLockedByMe = lockedSeats[seatId] === socket?.id;
                           const isLockedByOther = lockedSeats[seatId] && !isLockedByMe;
                           const isSelected = selectedSeats.includes(seatId);

                           // Default gap for walkway in the middle (optional)
                           const isWalkway = col === Math.floor(cols.length / 2);

                           if (isBlocked) {
                             return (
                               <div key={seatId} className={`w-7 h-7 ${isWalkway ? 'mr-10' : ''}`}></div> // invisible space for blocked
                             );
                           }

                           let seatClass = "w-7 h-7 rounded-t-lg border flex items-center justify-center text-[10px] font-semibold cursor-pointer transition-colors shadow-sm";
                           
                           if (isBooked) {
                             seatClass += " bg-red-500 border-red-500 text-white cursor-not-allowed";
                           } else if (isLockedByOther) {
                             seatClass += " bg-yellow-400 border-yellow-400 text-white cursor-not-allowed";
                           } else if (isSelected || isLockedByMe) {
                             seatClass += " bg-green-500 border-green-500 text-white";
                           } else {
                             seatClass += " bg-white border-green-500 text-green-600 hover:bg-green-100";
                           }

                           return (
                             <div 
                               key={seatId} 
                               className={`${seatClass} ${isWalkway ? 'mr-10' : ''}`}
                               onClick={() => toggleSeatSelection(seatId)}
                               title={`Seat ${seatId}`}
                             >
                               {col}
                             </div>
                           );
                         })}
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            ))}

            {/* Screen indicator */}
            <div className="mt-16 mb-4 text-center">
               <div className="w-[80%] mx-auto h-8 border-t-4 border-primary rounded-t-[100%] opacity-80 shadow-[0_-15px_20px_rgba(220,38,38,0.1)]"></div>
               <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mt-4 font-semibold">All eyes this way please</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Panel */}
      {selectedSeats.length > 0 && (
        <div className="bg-white border-t p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-20 sticky bottom-0">
          <div className="container mx-auto flex justify-between items-center px-4 max-w-4xl">
            <div>
              <p className="text-sm text-gray-500 mb-1 font-medium">Total {selectedSeats.length} Tickets</p>
              <p className="text-2xl font-bold text-dark">₹{calculateTotal()}</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="hidden md:flex gap-2 flex-wrap max-w-xs justify-end">
                 {selectedSeats.map(s => <span key={s} className="bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 px-2 py-1 rounded shadow-sm">{s}</span>)}
              </div>
              <button 
                onClick={handlePayment} 
                className="bg-primary hover:bg-red-600 text-white px-10 py-3.5 rounded-lg font-bold shadow-lg transition-transform hover:-translate-y-0.5 text-lg whitespace-nowrap"
              >
                Pay ₹{calculateTotal()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;
