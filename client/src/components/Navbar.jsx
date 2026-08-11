import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../store/authSlice';
import { Link } from 'react-router-dom';
import { FaSearch, FaChevronDown } from 'react-icons/fa';

const Navbar = ({ onOpenAuthModal }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
  };

  return (
    <header className="bg-dark text-white shadow-md">
      {/* Top Navbar */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-8 w-2/3">
          <Link to="/" className="text-2xl font-bold tracking-tight text-white flex items-center space-x-1">
            <span className="text-primary">Cine</span><span>Reserve</span>
          </Link>
          <div className="relative flex-grow max-w-xl hidden md:block">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="Search for Movies, Events, Plays, Sports and Activities" 
              className="w-full pl-10 pr-4 py-2 rounded bg-white text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-1 cursor-pointer hover:text-gray-300">
            <span className="text-sm font-medium">Mumbai</span>
            <FaChevronDown size={10} />
          </div>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium hidden sm:block text-gray-300">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="bg-transparent border border-gray-600 hover:border-white px-4 py-1.5 rounded text-white text-sm font-medium transition-colors">Logout</button>
            </div>
          ) : (
            <button onClick={onOpenAuthModal} className="bg-primary hover:bg-red-600 px-4 py-1.5 rounded text-white text-sm font-medium transition-colors">Sign in</button>
          )}
        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="bg-[#1f2533] border-t border-gray-700 hidden md:block">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center text-sm text-gray-300">
          <nav className="flex space-x-6">
            <Link to="/movies" className="hover:text-white transition">Movies</Link>
            <Link to="/stream" className="hover:text-white transition">Stream</Link>
            <Link to="/events" className="hover:text-white transition">Events</Link>
            <Link to="/plays" className="hover:text-white transition">Plays</Link>
            <Link to="/sports" className="hover:text-white transition">Sports</Link>
            <Link to="/activities" className="hover:text-white transition">Activities</Link>
          </nav>
          <nav className="flex space-x-6 text-xs">
            <Link to="/list-your-show" className="hover:text-white transition">ListYourShow</Link>
            <Link to="/corporates" className="hover:text-white transition">Corporates</Link>
            <Link to="/offers" className="hover:text-white transition">Offers</Link>
            <Link to="/gift-cards" className="hover:text-white transition">Gift Cards</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
