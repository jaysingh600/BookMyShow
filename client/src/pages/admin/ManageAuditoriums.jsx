import React, { useState, useEffect } from 'react';

const ManageAuditoriums = () => {
  const [auditoriums, setAuditoriums] = useState([]);
  const [theatres, setTheatres] = useState([]);
  
  // Form state
  const [name, setName] = useState('');
  const [theatreId, setTheatreId] = useState('');
  const [rows, setRows] = useState(10);
  const [columns, setColumns] = useState(15);
  
  const [blockedSeats, setBlockedSeats] = useState([]);
  const [disabledSeats, setDisabledSeats] = useState([]);

  useEffect(() => {
    fetchAuditoriums();
    fetchTheatres();
  }, []);

  const fetchAuditoriums = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/auditoriums');
      const data = await res.json();
      if (data.success) {
        setAuditoriums(data.auditoriums);
      }
    } catch (error) {
      console.error('Error fetching auditoriums:', error);
    }
  };

  const fetchTheatres = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/theatres');
      const data = await res.json();
      if (data.success) {
        setTheatres(data.theatres);
      }
    } catch (error) {
      console.error('Error fetching theatres:', error);
    }
  };

  const handleAddAuditorium = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // For simplicity in this step, we're not fully mapping rowCategories from UI
      // but we will send blocked and disabled seats.
      const res = await fetch('http://localhost:5000/api/admin/auditoriums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name, 
          theatre: theatreId, 
          rows, 
          columns,
          blockedSeats,
          disabledSeats
        })
      });
      const data = await res.json();
      if (data.success) {
        setName('');
        setTheatreId('');
        setBlockedSeats([]);
        setDisabledSeats([]);
        fetchAuditoriums();
      }
    } catch (error) {
      console.error('Error adding auditorium:', error);
    }
  };

  // Seat map handlers
  const toggleSeatStatus = (r, c) => {
    const seatId = `${String.fromCharCode(65 + r)}-${c + 1}`;
    
    if (disabledSeats.includes(seatId)) {
      setDisabledSeats(disabledSeats.filter(s => s !== seatId));
      setBlockedSeats([...blockedSeats, seatId]);
    } else if (blockedSeats.includes(seatId)) {
      setBlockedSeats(blockedSeats.filter(s => s !== seatId));
    } else {
      setDisabledSeats([...disabledSeats, seatId]);
    }
  };

  const getSeatClass = (r, c) => {
    const seatId = `${String.fromCharCode(65 + r)}-${c + 1}`;
    if (disabledSeats.includes(seatId)) return 'bg-gray-200 border-dashed border-2';
    if (blockedSeats.includes(seatId)) return 'bg-red-500 text-white';
    return 'bg-green-100 border border-green-500 hover:bg-green-200 cursor-pointer';
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manage Auditoriums</h2>
      
      <form onSubmit={handleAddAuditorium} className="bg-white p-6 rounded shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Auditorium Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full px-3 py-2 border rounded" 
              required 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Theatre</label>
            <select 
              value={theatreId} 
              onChange={(e) => setTheatreId(e.target.value)} 
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Select Theatre</option>
              {theatres.map(t => (
                <option key={t._id} value={t._id}>{t.name} ({t.city?.name})</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Rows</label>
            <input 
              type="number" 
              value={rows} 
              onChange={(e) => setRows(Number(e.target.value))} 
              className="w-full px-3 py-2 border rounded" 
              min="1" max="26" required 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Columns</label>
            <input 
              type="number" 
              value={columns} 
              onChange={(e) => setColumns(Number(e.target.value))} 
              className="w-full px-3 py-2 border rounded" 
              min="1" max="50" required 
            />
          </div>
        </div>

        <div className="my-6">
          <h3 className="font-bold mb-2">Layout Configuration</h3>
          <p className="text-sm text-gray-600 mb-4">
            Click seats to toggle: <span className="inline-block w-4 h-4 bg-green-100 border border-green-500 mx-1"></span> Active &rarr; 
            <span className="inline-block w-4 h-4 bg-gray-200 border-dashed border-2 mx-1"></span> Disabled (No Seat) &rarr;
            <span className="inline-block w-4 h-4 bg-red-500 mx-1"></span> Blocked (Reserved)
          </p>
          
          <div className="overflow-x-auto p-4 bg-gray-50 rounded border">
            {Array.from({ length: rows }).map((_, r) => (
              <div key={r} className="flex items-center justify-center mb-2 min-w-max">
                <span className="w-6 font-bold text-gray-500 mr-2">{String.fromCharCode(65 + r)}</span>
                <div className="flex space-x-1">
                  {Array.from({ length: columns }).map((_, c) => (
                    <div 
                      key={c}
                      onClick={() => toggleSeatStatus(r, c)}
                      className={`w-6 h-6 rounded flex items-center justify-center text-[10px] ${getSeatClass(r, c)}`}
                      title={`${String.fromCharCode(65 + r)}-${c + 1}`}
                    >
                      {c + 1}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-8 mx-auto w-3/4 h-8 border-t-4 border-gray-400 rounded-t-full flex items-center justify-center text-gray-400 font-bold tracking-widest">
              SCREEN THIS WAY
            </div>
          </div>
        </div>

        <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-red-600">
          Save Auditorium
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Existing Auditoriums</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {auditoriums.map(audi => (
            <div key={audi._id} className="bg-white p-4 rounded shadow border-l-4 border-primary">
              <h4 className="text-xl font-bold">{audi.name}</h4>
              <p className="text-gray-600">{audi.theatre?.name}, {audi.theatre?.city?.name}</p>
              <div className="mt-2 text-sm">
                <span className="bg-gray-100 px-2 py-1 rounded mr-2">Rows: {audi.rows}</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Cols: {audi.columns}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageAuditoriums;
