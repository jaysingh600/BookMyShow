import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import MovieCarousel from '../components/MovieCarousel';

const mockMovies = [
  { id: 1, title: 'Inception', genre: 'Action, Sci-Fi', poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', rating: '9.2', votes: '124K' },
  { id: 2, title: 'The Dark Knight', genre: 'Action, Crime', poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', rating: '9.5', votes: '300K' },
  { id: 3, title: 'Interstellar', genre: 'Adventure, Drama, Sci-Fi', poster: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', rating: '9.1', votes: '190K' },
  { id: 4, title: 'Avengers', genre: 'Action, Adventure', poster: 'https://images.unsplash.com/photo-1608889476561-6242cb816d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', rating: '8.8', votes: '210K' },
  { id: 5, title: 'Joker', genre: 'Crime, Drama', poster: 'https://images.unsplash.com/photo-1585189370002-95bd6b3ff255?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', rating: '8.9', votes: '180K' },
  { id: 6, title: 'Oppenheimer', genre: 'Biography, Drama', poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', rating: '9.3', votes: '150K' },
];

const HomePage = () => {
  return (
    <div className="bg-grayLight min-h-screen">
      <HeroCarousel />
      <div className="container mx-auto px-4 mt-2">
        <MovieCarousel title="Recommended Movies" movies={mockMovies} />
        
        {/* Stream Ad Banner */}
        <div className="my-10 rounded-lg overflow-hidden hidden md:block cursor-pointer">
           <img src="https://images.unsplash.com/photo-1595769816263-9b910be24d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Stream Premiere" className="w-full h-28 object-cover" />
        </div>

        <MovieCarousel title="The Best of Live Events" movies={[...mockMovies].reverse()} />
      </div>
    </div>
  );
};

export default HomePage;
