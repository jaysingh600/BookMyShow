import React, { useState, useEffect } from 'react';

const ManageCities = () => {
  const [cities, setCities] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    fetchCities();
  }, []);

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

  const handleAddCity = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, image })
      });
      const data = await res.json();
      if (data.success) {
        setName('');
        setImage('');
        fetchCities();
      }
    } catch (error) {
      console.error('Error adding city:', error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Manage Cities</h2>
      
      <form onSubmit={handleAddCity} className="bg-white p-6 rounded shadow-md mb-8 max-w-lg">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">City Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full px-3 py-2 border rounded" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Image URL (Optional)</label>
          <input 
            type="text" 
            value={image} 
            onChange={(e) => setImage(e.target.value)} 
            className="w-full px-3 py-2 border rounded" 
          />
        </div>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-red-600">
          Add City
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cities.map(city => (
          <div key={city._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-bold">{city.name}</h3>
            {city.image && <img src={city.image} alt={city.name} className="mt-2 w-full h-32 object-cover rounded" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCities;
