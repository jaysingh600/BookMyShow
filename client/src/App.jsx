import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthModal from './components/AuthModal';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import TheatreListing from './pages/TheatreListing';
import AdminLayout from './pages/admin/AdminLayout';
import ManageCities from './pages/admin/ManageCities';
import ManageTheatres from './pages/admin/ManageTheatres';
import ManageAuditoriums from './pages/admin/ManageAuditoriums';
import ManageMovies from './pages/admin/ManageMovies';
import ManageShows from './pages/admin/ManageShows';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-grayLight flex flex-col font-sans">
        <Navbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/buytickets/:movieId" element={<TheatreListing />} />
            <Route path="/seat-layout/:showId" element={<SeatSelection />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="cities" element={<ManageCities />} />
              <Route path="theatres" element={<ManageTheatres />} />
              <Route path="auditoriums" element={<ManageAuditoriums />} />
              <Route path="movies" element={<ManageMovies />} />
              <Route path="shows" element={<ManageShows />} />
            </Route>
          </Routes>
        </main>

        <Footer />
        
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    </Router>
  );
}

export default App;
