import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

const BuyTickets = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [lockedSeats, setLockedSeats] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Create a mock grid of seats (e.g., 5 rows, 10 columns)
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const columns = Array.from({ length: 10 }, (_, i) => i + 1);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Join the show room
    newSocket.emit('joinShow', id);

    // Listen for initial locked seats
    newSocket.on('initialLockedSeats', (seats) => {
      setLockedSeats(seats || {});
    });

    // Listen for a seat being locked by someone else
    newSocket.on('seatLocked', ({ seatId, socketId }) => {
      setLockedSeats((prev) => ({ ...prev, [seatId]: socketId }));
    });

    // Listen for a seat being unlocked
    newSocket.on('seatUnlocked', ({ seatId }) => {
      setLockedSeats((prev) => {
        const updated = { ...prev };
        delete updated[seatId];
        return updated;
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [id]);

  const toggleSeatSelection = (seatId) => {
    if (!socket) return;
    
    // If the seat is locked by someone else, we can't select it
    if (lockedSeats[seatId] && lockedSeats[seatId] !== socket.id) {
      return;
    }

    if (selectedSeats.includes(seatId)) {
      // Unlock the seat
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
      socket.emit('unlockSeat', { showId: id, seatId });
      
      // Also remove it from local lockedSeats state optimistically
      setLockedSeats(prev => {
        const updated = { ...prev };
        delete updated[seatId];
        return updated;
      });
    } else {
      // Lock the seat
      setSelectedSeats(prev => [...prev, seatId]);
      socket.emit('lockSeat', { showId: id, seatId });
      
      // Optimistically lock it for ourselves
      setLockedSeats(prev => ({ ...prev, [seatId]: socket.id }));
    }
  };

  return (
    <div className="min-h-screen bg-grayLight flex flex-col py-10 px-4">
      <div className="container mx-auto max-w-4xl bg-white p-8 rounded-xl shadow-lg">
        <button onClick={() => navigate(-1)} className="text-blue-600 mb-6 font-semibold hover:underline">
          &larr; Back to Movie
        </button>
        <h1 className="text-3xl font-bold mb-8 text-center text-dark">Select Your Seats</h1>

        <div className="mb-10 text-center">
          <div className="w-full max-w-lg mx-auto h-2 bg-gray-300 rounded mb-2"></div>
          <p className="text-gray-500 text-sm tracking-[0.5em] uppercase">Screen this way</p>
        </div>

        <div className="flex flex-col gap-4 items-center mb-12">
          {rows.map(row => (
            <div key={row} className="flex gap-3 items-center">
              <span className="w-6 text-center font-bold text-gray-600">{row}</span>
              <div className="flex gap-2">
                {columns.map(col => {
                  const seatId = `${row}${col}`;
                  const isLockedByMe = lockedSeats[seatId] === socket?.id;
                  const isLockedByOther = lockedSeats[seatId] && !isLockedByMe;
                  const isSelected = selectedSeats.includes(seatId);

                  let seatClass = "w-8 h-8 rounded-t-lg border-2 flex items-center justify-center text-xs font-semibold cursor-pointer transition-colors";
                  
                  if (isLockedByOther) {
                    seatClass += " bg-gray-300 border-gray-400 text-gray-400 cursor-not-allowed";
                  } else if (isSelected || isLockedByMe) {
                    seatClass += " bg-primary border-primary text-white";
                  } else {
                    seatClass += " bg-white border-green-500 text-green-600 hover:bg-green-100";
                  }

                  return (
                    <div 
                      key={seatId} 
                      className={seatClass}
                      onClick={() => toggleSeatSelection(seatId)}
                      title={isLockedByOther ? "Seat locked by another user" : `Seat ${seatId}`}
                    >
                      {col}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-8 mb-8 border-t pt-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-t bg-white border-2 border-green-500"></div>
            <span className="text-sm font-medium">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-t bg-primary border-2 border-primary"></div>
            <span className="text-sm font-medium">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-t bg-gray-300 border-2 border-gray-400"></div>
            <span className="text-sm font-medium">Sold/Locked</span>
          </div>
        </div>

        {selectedSeats.length > 0 && (
          <div className="bg-gray-100 p-6 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">Selected Seats: {selectedSeats.join(', ')}</p>
              <p className="text-gray-600 text-sm">{selectedSeats.length} ticket(s)</p>
            </div>
            <button className="bg-primary hover:bg-red-600 text-white px-8 py-3 rounded-lg font-bold shadow-md transition">
              Proceed to Pay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyTickets;
