import React, { useState, useEffect } from 'react';

const ManageTheatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [cities, setCities] = useState([]);
  const [name, setName] = useState('');
  const [cityId, setCityId] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(''); // Cloudinary URL placeholder for now

  useEffect(() => {
    fetchTheatres();
    fetchCities();
  }, []);

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

  const fetchCities = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/cities');
      const data = await res.json();
      if (data.success) {
        setCities(data.cities);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleAddTheatre = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/theatres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, city: cityId, address, images: [image] })
      });
      const data = await res.json();
      if (data.success) {
        setName('');
        setCityId('');
        setAddress('');
        setImage('');
        fetchTheatres();
      }
    } catch (error) {
      console.error('Error adding theatre:', error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manage Theatres</h2>
      
      <form onSubmit={handleAddTheatre} className="bg-white p-6 rounded shadow-md mb-8 max-w-lg">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Theatre Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full px-3 py-2 border rounded" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">City</label>
          <select 
            value={cityId} 
            onChange={(e) => setCityId(e.target.value)} 
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Select City</option>
            {cities.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Address</label>
          <input 
            type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            className="w-full px-3 py-2 border rounded" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Image URL (Cloudinary)</label>
          <input 
            type="text" 
            value={image} 
            onChange={(e) => setImage(e.target.value)} 
            className="w-full px-3 py-2 border rounded" 
          />
        </div>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-red-600">
          Add Theatre
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {theatres.map(theatre => (
          <div key={theatre._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-bold">{theatre.name}</h3>
            <p className="text-gray-600">{theatre.address}</p>
            <p className="text-sm font-semibold text-primary">{theatre.city?.name}</p>
            {theatre.images && theatre.images.length > 0 && theatre.images[0] && (
              <img src={theatre.images[0]} alt={theatre.name} className="mt-2 w-full h-40 object-cover rounded" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageTheatres;
