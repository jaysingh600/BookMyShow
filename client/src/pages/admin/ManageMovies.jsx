import React, { useState, useEffect } from 'react';

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('');
  const [genre, setGenre] = useState('');
  const [duration, setDuration] = useState('');
  const [posterUrl, setPosterUrl] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/movies');
      const data = await res.json();
      if (data.success) {
        setMovies(data.movies);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title, description, language, genre, duration: Number(duration), posterUrl 
        })
      });
      const data = await res.json();
      if (data.success) {
        setTitle('');
        setDescription('');
        setLanguage('');
        setGenre('');
        setDuration('');
        setPosterUrl('');
        fetchMovies();
      }
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manage Movies</h2>
      
      <form onSubmit={handleAddMovie} className="bg-white p-6 rounded shadow-md mb-8 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Title</label>
            <input 
              type="text" value={title} onChange={(e) => setTitle(e.target.value)} 
              className="w-full px-3 py-2 border rounded" required 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Duration (mins)</label>
            <input 
              type="number" value={duration} onChange={(e) => setDuration(e.target.value)} 
              className="w-full px-3 py-2 border rounded" required 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Language</label>
            <input 
              type="text" value={language} onChange={(e) => setLanguage(e.target.value)} 
              className="w-full px-3 py-2 border rounded" required placeholder="e.g. English, Hindi"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Genre</label>
            <input 
              type="text" value={genre} onChange={(e) => setGenre(e.target.value)} 
              className="w-full px-3 py-2 border rounded" required placeholder="e.g. Action, Sci-Fi"
            />
          </div>
          <div className="mb-4 md:col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Poster URL</label>
            <input 
              type="text" value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} 
              className="w-full px-3 py-2 border rounded" 
            />
          </div>
          <div className="mb-4 md:col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Description</label>
            <textarea 
              value={description} onChange={(e) => setDescription(e.target.value)} 
              className="w-full px-3 py-2 border rounded" rows="3"
            ></textarea>
          </div>
        </div>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-red-600">
          Add Movie
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map(movie => (
          <div key={movie._id} className="bg-white p-4 rounded shadow">
            {movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} className="w-full h-48 object-cover rounded mb-2" />}
            <h3 className="font-bold text-lg leading-tight">{movie.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{movie.language} | {movie.genre}</p>
            <p className="text-xs text-gray-500 mt-1">{movie.duration} mins</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageMovies;
