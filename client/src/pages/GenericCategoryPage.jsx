import React from 'react';

const GenericCategoryPage = ({ title, description }) => {
  return (
    <div className="bg-grayLight min-h-screen py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-dark mb-4">{title}</h1>
        <p className="text-lg text-gray-600 mb-8">{description || `Explore the best ${title.toLowerCase()} happening around you.`}</p>
        
        {/* Placeholder Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 animate-pulse flex items-center justify-center text-gray-400">
                Image Placeholder
              </div>
              <div className="p-4 text-left">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenericCategoryPage;
