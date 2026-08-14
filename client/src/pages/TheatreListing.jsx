import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaInfoCircle } from 'react-icons/fa';

const TheatreListing = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [movie, setMovie] = useState(null);
  
  // Dates setup (next 4 days)
  const today = new Date();
  const dates = Array.from({ length: 4 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState(dates[0].toDateString());

  useEffect(() => {
    fetchShows();
  }, [movieId]);

  const fetchShows = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/shows');
      const data = await res.json();
      if (data.success) {
        // Filter by movieId and only published shows
        // If movieId is a mock ID (e.g. "1"), show all published shows for testing
        const movieShows = data.shows.filter(s => {
          if (!s.isPublished) return false;
          if (movieId && movieId.length === 24) {
             return s.movie?._id === movieId;
          }
          return true; // Mock mode
        });
        setShows(movieShows);
        
        // Extract movie details from the first show if available
        if (movieShows.length > 0 && !movie) {
          setMovie(movieShows[0].movie);
        } else if (!movie) {
          // Fallback mock if no shows exist but we want to show a title
          setMovie({ title: "Selected Movie", languages: "English", format: "2D" });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Filter shows by selected date
  const filteredShows = shows.filter(s => new Date(s.date).toDateString() === selectedDate);

  // Group shows by theatre
  const theatreGroups = filteredShows.reduce((acc, show) => {
    const tId = show.theatre._id;
    if (!acc[tId]) {
      acc[tId] = {
        theatre: show.theatre,
        shows: []
      };
    }
    // Sort shows by start time could be added here
    acc[tId].shows.push(show);
    return acc;
  }, {});

  return (
    <div className="bg-grayLight min-h-screen">
      {/* Movie Header */}
      <div className="bg-dark text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">{movie?.title || 'Loading...'}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-300">
            <span className="border border-gray-500 px-2 py-0.5 rounded-full uppercase font-medium">{movie?.certification || 'UA'}</span>
            <div className="flex gap-2">
              <span className="bg-white text-dark px-2 py-0.5 rounded-full text-xs font-bold">{movie?.format || '2D'}</span>
              <span className="bg-white text-dark px-2 py-0.5 rounded-full text-xs font-bold">{movie?.languages || 'English'}</span>
            </div>
            <span className="hidden md:inline">• {movie?.genre || 'Action, Thriller'}</span>
          </div>
        </div>
      </div>

      {/* Date & Filter Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex gap-4 overflow-x-auto">
          {dates.map((d, i) => {
            const isSelected = selectedDate === d.toDateString();
            return (
              <div 
                key={i} 
                onClick={() => setSelectedDate(d.toDateString())}
                className={`flex flex-col items-center justify-center min-w-[60px] cursor-pointer rounded-lg px-2 py-1 transition-colors ${isSelected ? 'bg-primary text-white shadow-md' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <span className="text-xs font-bold uppercase">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span className="text-lg font-bold">{d.getDate()}</span>
                <span className="text-xs font-medium">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4 hidden md:block">
           <div className="bg-white p-5 rounded-lg shadow-sm mb-4 border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Filters</h3>
              <div className="space-y-4">
                 <div>
                   <h4 className="text-sm font-semibold text-gray-600 mb-2">Price Range</h4>
                   <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1 border rounded bg-gray-50 text-xs text-gray-700 hover:border-primary transition-colors">₹0 - ₹200</button>
                      <button className="px-3 py-1 border rounded bg-gray-50 text-xs text-gray-700 hover:border-primary transition-colors">₹201 - ₹400</button>
                   </div>
                 </div>
                 <div>
                   <h4 className="text-sm font-semibold text-gray-600 mb-2">Show Times</h4>
                   <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1 border rounded bg-gray-50 text-xs text-gray-700 hover:border-primary transition-colors">Morning</button>
                      <button className="px-3 py-1 border rounded bg-gray-50 text-xs text-gray-700 hover:border-primary transition-colors">Afternoon</button>
                      <button className="px-3 py-1 border rounded bg-gray-50 text-xs text-gray-700 hover:border-primary transition-colors">Evening</button>
                   </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Theatres List */}
        <div className="w-full md:w-3/4 flex flex-col gap-4">
          
          <div className="flex justify-end gap-6 text-xs text-gray-600 bg-white p-3 rounded-lg shadow-sm mb-2 border border-gray-100 font-medium">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div> Available</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div> Fast Filling</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-300 rounded-full shadow-sm"></div> Sold Out</div>
          </div>

          {Object.values(theatreGroups).length === 0 ? (
            <div className="bg-white p-10 text-center rounded-lg shadow-sm border border-gray-100 text-gray-500 font-medium text-lg">
              <div className="mb-4 text-3xl">😔</div>
              No shows available for the selected date.
            </div>
          ) : (
            Object.values(theatreGroups).map(group => (
              <div key={group.theatre._id} className="bg-white p-5 rounded-lg shadow-sm flex flex-col lg:flex-row gap-6 border border-gray-100 hover:shadow-md transition-shadow">
                {/* Theatre Info */}
                <div className="lg:w-1/3 flex flex-col gap-2 border-b lg:border-b-0 lg:border-r border-gray-100 pb-4 lg:pb-0 lg:pr-4">
                   <div className="flex items-start gap-3">
                     <FaRegHeart className="text-gray-400 hover:text-primary cursor-pointer mt-1 text-lg flex-shrink-0 transition-colors" />
                     <div>
                       <h3 className="font-bold text-dark text-lg leading-tight">{group.theatre.name}</h3>
                       <p className="text-sm text-gray-500 mt-1 line-clamp-2">{group.theatre.address}</p>
                       <div className="flex items-center gap-2 mt-2">
                         <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">3.2 km away</span>
                         <span className="flex items-center text-xs text-primary font-medium hover:underline cursor-pointer"><FaInfoCircle className="mr-1"/> Info</span>
                       </div>
                     </div>
                   </div>
                   <div className="flex items-center gap-2 text-xs text-green-700 font-medium mt-3">
                     <span className="bg-green-50 border border-green-200 px-2 py-1 rounded shadow-sm">🎫 M-Ticket</span>
                     <span className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-2 py-1 rounded shadow-sm">🍔 Food & Beverage</span>
                   </div>
                </div>

                {/* Showtimes */}
                <div className="lg:w-2/3 flex flex-col gap-4 justify-center">
                   <div className="flex items-center gap-3 text-sm text-gray-600">
                     <span className="font-medium text-dark">{group.shows[0]?.auditorium?.name || 'Screen 1'}</span>
                     <span className="text-xs px-2 py-0.5 border border-gray-300 rounded-full text-gray-600 bg-gray-50">2D</span>
                   </div>
                   
                   <div className="flex flex-wrap gap-3">
                     {group.shows.map(show => (
                       <div key={show._id} className="relative group">
                         <button 
                           onClick={() => navigate(`/seat-layout/${show._id}`)}
                           className="border border-green-400 text-green-600 hover:bg-green-50 px-5 py-2 rounded text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-sm"
                         >
                           {show.startTime}
                         </button>
                         {/* Price Legend Tooltip */}
                         <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-dark/95 backdrop-blur-sm text-white text-xs p-3 rounded-lg shadow-xl z-10 transition-opacity">
                           <div className="font-bold border-b border-gray-600 pb-1 mb-2 text-gray-200 text-center">{show.startTime} - {show.endTime}</div>
                           <div className="flex justify-between py-0.5"><span>Normal</span> <span className="font-bold">₹{show.pricing.Normal}</span></div>
                           <div className="flex justify-between py-0.5"><span>Premium</span> <span className="font-bold">₹{show.pricing.Premium}</span></div>
                           <div className="flex justify-between py-0.5"><span>VIP</span> <span className="font-bold">₹{show.pricing.VIP}</span></div>
                           <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-dark/95"></div>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TheatreListing;
