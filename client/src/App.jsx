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
import AdminDashboard from './pages/admin/AdminDashboard';
import CheckoutSummary from './pages/CheckoutSummary';
import TicketConfirmation from './pages/TicketConfirmation';
import UserDashboard from './pages/UserDashboard';
import MoviesPage from './pages/MoviesPage';
import GenericCategoryPage from './pages/GenericCategoryPage';
import ListYourShowPage from './pages/ListYourShowPage';

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
            <Route path="/checkout/:bookingId" element={<CheckoutSummary />} />
            <Route path="/ticket/:bookingId" element={<TicketConfirmation />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/stream" element={<GenericCategoryPage title="Stream" description="Watch your favorite content online" />} />
            <Route path="/events" element={<GenericCategoryPage title="Events" description="Discover upcoming events in your city" />} />
            <Route path="/plays" element={<GenericCategoryPage title="Plays" description="Experience live theatre performances" />} />
            <Route path="/sports" element={<GenericCategoryPage title="Sports" description="Catch the live sporting action" />} />
            <Route path="/activities" element={<GenericCategoryPage title="Activities" description="Fun things to do around you" />} />
            <Route path="/list-your-show" element={<ListYourShowPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
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
