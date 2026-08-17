import React from 'react';

const ListYourShowPage = () => {
  return (
    <div className="bg-grayLight min-h-screen">
      {/* Hero Section */}
      <div className="bg-dark text-white py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6 leading-tight">Partner with CineReserve & Grow Your Audience</h1>
            <p className="text-lg text-gray-300 mb-8">
              Are you an event organizer, theatre owner, or creator? List your shows, movies, or events on our platform and reach millions of entertainment enthusiasts instantly.
            </p>
            <button className="bg-primary hover:bg-red-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-transform hover:-translate-y-0.5 text-lg">
              Contact Sales
            </button>
          </div>
        </div>
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none hidden md:block" style={{ background: 'linear-gradient(45deg, transparent, #F84464)' }}></div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-dark mb-12">Why choose CineReserve?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-red-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-bold text-dark mb-3">Massive Reach</h3>
            <p className="text-gray-600">
              Get access to our vast user base of entertainment lovers actively looking for their next great experience.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-red-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-bold text-dark mb-3">Seamless Ticketing</h3>
            <p className="text-gray-600">
              Our robust infrastructure handles high volumes of traffic and provides a frictionless booking experience for your customers.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-red-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-bold text-dark mb-3">Real-time Analytics</h3>
            <p className="text-gray-600">
              Track your sales, audience demographics, and revenue in real-time through our comprehensive partner dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-200 py-16 text-center">
        <h2 className="text-2xl font-bold text-dark mb-4">Ready to host your next big event?</h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Leave the ticketing and marketing to us while you focus on creating an unforgettable experience.
        </p>
        <button className="bg-dark hover:bg-black text-white px-8 py-3 rounded-lg font-bold shadow-md transition-colors">
          Start Listing Today
        </button>
      </div>
    </div>
  );
};

export default ListYourShowPage;
