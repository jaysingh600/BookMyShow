import React from 'react';
import { useDispatch } from 'react-redux';
import { setCity } from '../store/citySlice';
import { FaSearch } from 'react-icons/fa';

const POPULAR_CITIES = [
  'Mumbai', 'Delhi-NCR', 'Bengaluru', 'Hyderabad', 
  'Chandigarh', 'Chennai', 'Pune', 'Kolkata', 'Kochi'
];

const CityModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleCitySelect = (city) => {
    dispatch(setCity(city));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start pt-20">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-2xl animate-fade-in-down">
        
        {/* Search Bar Area */}
        <div className="sticky top-0 bg-white p-6 pb-4 border-b border-gray-200 z-10 flex flex-col items-center">
          <div className="relative w-full max-w-2xl">
            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for your city" 
              className="w-full pl-12 pr-4 py-3 rounded-md bg-white border border-gray-300 focus:outline-none focus:border-primary shadow-sm text-gray-700 placeholder-gray-400"
            />
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-6 text-gray-500 hover:text-gray-700"
          >
            &#x2715;
          </button>
        </div>

        {/* Popular Cities Grid */}
        <div className="p-8 bg-gray-50/50">
          <h3 className="text-center text-sm text-gray-500 uppercase tracking-widest font-semibold mb-6">
            Popular Cities
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 text-center">
            {POPULAR_CITIES.map((city) => (
              <div 
                key={city}
                onClick={() => handleCitySelect(city)}
                className="cursor-pointer flex flex-col items-center group transition"
              >
                {/* Mock Icon - normally you'd use city SVG icons */}
                <div className="w-14 h-14 bg-gray-200 group-hover:bg-gray-300 rounded-full flex items-center justify-center mb-2 transition-colors">
                  <span className="text-gray-500 font-bold text-xl">{city.charAt(0)}</span>
                </div>
                <span className="text-sm text-dark font-medium group-hover:text-primary transition-colors">
                  {city}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* View All Cities Link */}
        <div className="p-6 text-center text-primary font-medium cursor-pointer hover:underline border-t">
          View All Cities
        </div>
        
      </div>
    </div>
  );
};

export default CityModal;
