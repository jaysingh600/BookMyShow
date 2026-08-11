import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPinterestP, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-gray-400 mt-12 pt-12 pb-6 border-t border-gray-700">
      <div className="container mx-auto px-4">
        {/* Top Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-700">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-xl font-bold text-white"><span className="text-primary">Cine</span>Reserve</span>
            <span className="text-sm">| Contact Today</span>
          </div>
          <button className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded font-medium transition">
            Contact Us
          </button>
        </div>

        {/* Middle Footer */}
        <div className="grid grid-cols-1 text-center mb-10">
           <h3 className="text-white text-lg font-medium mb-6">Social</h3>
           <div className="flex justify-center space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><FaFacebookF /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><FaTwitter /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><FaInstagram /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><FaYoutube /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><FaPinterestP /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary hover:text-white transition-all"><FaLinkedinIn /></a>
           </div>
        </div>

        {/* Bottom Footer */}
        <div className="text-center text-xs">
          <p className="mb-4">
            Copyright 2026 © CineReserve Entertainment Pvt. Ltd. All Rights Reserved.
          </p>
          <p className="text-gray-500">
            The content and images used on this site are copyright protected and copyrights vests with the respective owners. The usage of the content and images on this website is intended to promote the works and no endorsement of the artist shall be implied. Unauthorized use is prohibited and punishable by law.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
