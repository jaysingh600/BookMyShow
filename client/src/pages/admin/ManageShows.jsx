import React, { useState, useEffect } from 'react';

const ManageShows = () => {
  const [shows, setShows] = useState([]);
  
  // Data for dropdowns
  const [movies, setMovies] = useState([]);
  const [cities, setCities] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [auditoriums, setAuditoriums] = useState([]);

  // Filtered dropdowns
  const [filteredTheatres, setFilteredTheatres] = useState([]);
  const [filteredAuditoriums, setFilteredAuditoriums] = useState([]);

  // Form state
  const [movieId, setMovieId] = useState('');
  const [cityId, setCityId] = useState('');
  const [theatreId, setTheatreId] = useState('');
  const [auditoriumId, setAuditoriumId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  
  const [pricing, setPricing] = useState({
    VIP: 500,
    Premium: 300,
    Normal: 150
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Update filtered theatres when city changes
  useEffect(() => {
    if (cityId) {
      setFilteredTheatres(theatres.filter(t => t.city?._id === cityId || t.city === cityId));
      setTheatreId(''); // Reset subsequent selections
    } else {
      setFilteredTheatres([]);
    }
  }, [cityId, theatres]);

  // Update filtered auditoriums when theatre changes
  useEffect(() => {
    if (theatreId) {
      setFilteredAuditoriums(auditoriums.filter(a => a.theatre?._id === theatreId || a.theatre === theatreId));
      setAuditoriumId('');
    } else {
      setFilteredAuditoriums([]);
    }
  }, [theatreId, auditoriums]);


  const fetchInitialData = async () => {
    try {
      const [showsRes, moviesRes, citiesRes, theatresRes, audisRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/shows').then(res => res.json()),
        fetch('http://localhost:5000/api/admin/movies').then(res => res.json()),
        fetch('http://localhost:5000/api/admin/cities').then(res => res.json()),
        fetch('http://localhost:5000/api/admin/theatres').then(res => res.json()),
        fetch('http://localhost:5000/api/admin/auditoriums').then(res => res.json())
      ]);

      if (showsRes.success) setShows(showsRes.shows);
      if (moviesRes.success) setMovies(moviesRes.movies);
      if (citiesRes.success) setCities(citiesRes.cities);
      if (theatresRes.success) setTheatres(theatresRes.theatres);
      if (audisRes.success) setAuditoriums(audisRes.auditoriums);
      
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const handlePricingChange = (e) => {
    setPricing({
      ...pricing,
      [e.target.name]: Number(e.target.value)
    });
  };

  const handleAddShow = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/shows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          movie: movieId,
          theatre: theatreId,
          auditorium: auditoriumId,
          date,
          startTime,
          endTime,
          pricing,
          isPublished
        })
      });
      const data = await res.json();
      if (data.success) {
        // Reset form partially
        setMovieId('');
        setDate('');
        setStartTime('');
        setEndTime('');
        // Refresh shows
        const showsRes = await fetch('http://localhost:5000/api/admin/shows').then(r => r.json());
        if (showsRes.success) setShows(showsRes.shows);
      }
    } catch (error) {
      console.error('Error adding show:', error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manage Shows</h2>
      
      <form onSubmit={handleAddShow} className="bg-white p-6 rounded shadow-md mb-8">
        <h3 className="font-bold text-xl mb-4 border-b pb-2">1. Location & Movie</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">City</label>
            <select value={cityId} onChange={(e) => setCityId(e.target.value)} className="w-full px-3 py-2 border rounded" required>
              <option value="">Select City</option>
              {cities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Theatre</label>
            <select value={theatreId} onChange={(e) => setTheatreId(e.target.value)} className="w-full px-3 py-2 border rounded" required disabled={!cityId}>
              <option value="">Select Theatre</option>
              {filteredTheatres.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Auditorium (Screen)</label>
            <select value={auditoriumId} onChange={(e) => setAuditoriumId(e.target.value)} className="w-full px-3 py-2 border rounded" required disabled={!theatreId}>
              <option value="">Select Auditorium</option>
              {filteredAuditoriums.map(a => <option key={a._id} value={a._id}>{a.name} ({a.rows * a.columns} seats)</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Movie</label>
            <select value={movieId} onChange={(e) => setMovieId(e.target.value)} className="w-full px-3 py-2 border rounded" required>
              <option value="">Select Movie</option>
              {movies.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
            </select>
          </div>
        </div>

        <h3 className="font-bold text-xl mb-4 border-b pb-2">2. Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Start Time</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">End Time</label>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full px-3 py-2 border rounded" required />
          </div>
        </div>

        <h3 className="font-bold text-xl mb-4 border-b pb-2">3. Pricing Configuration (₹)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Normal Seats</label>
            <input type="number" name="Normal" value={pricing.Normal} onChange={handlePricingChange} className="w-full px-3 py-2 border rounded bg-green-50" min="0" required />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Premium Seats</label>
            <input type="number" name="Premium" value={pricing.Premium} onChange={handlePricingChange} className="w-full px-3 py-2 border rounded bg-blue-50" min="0" required />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">VIP Seats</label>
            <input type="number" name="VIP" value={pricing.VIP} onChange={handlePricingChange} className="w-full px-3 py-2 border rounded bg-purple-50" min="0" required />
          </div>
        </div>

        <div className="flex items-center mb-6">
          <input 
            type="checkbox" 
            id="publishCheck"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
          />
          <label htmlFor="publishCheck" className="ml-2 font-bold text-gray-700">Publish immediately to users</label>
        </div>

        <button type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-red-600 shadow-lg">
          Create Show
        </button>
      </form>

      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-4">Upcoming Shows</h3>
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">Movie</th>
                <th className="px-4 py-3 text-left">Theatre & Screen</th>
                <th className="px-4 py-3 text-left">Date & Time</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {shows.map(show => (
                <tr key={show._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold">{show.movie?.title}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm">{show.theatre?.name}</div>
                    <div className="text-xs text-gray-500">{show.auditorium?.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">{new Date(show.date).toLocaleDateString()}</div>
                    <div className="text-xs font-bold">{show.startTime} - {show.endTime}</div>
                  </td>
                  <td className="px-4 py-3">
                    {show.isPublished ? 
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Published</span> : 
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Draft</span>
                    }
                  </td>
                </tr>
              ))}
              {shows.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-gray-500">No shows created yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageShows;
