import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';

const MovieCarousel = ({ title, movies }) => {
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-dark mb-4">{title}</h2>
      <Swiper
        modules={[Navigation]}
        spaceBetween={24}
        slidesPerView={2}
        navigation
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <Link to={`/movie/${movie.id}`} className="block group cursor-pointer">
              <div className="rounded-lg overflow-hidden mb-3 relative">
                <img src={movie.poster} alt={movie.title} className="w-full h-[340px] object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute bottom-0 left-0 w-full bg-black/70 text-white p-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-xs font-semibold flex items-center"><span className="text-red-500 mr-1">★</span> {movie.rating}</span>
                   <span className="text-xs">{movie.votes} Votes</span>
                </div>
              </div>
              <h3 className="font-semibold text-dark text-lg leading-tight truncate">{movie.title}</h3>
              <p className="text-sm text-gray-500 truncate mt-1">{movie.genre}</p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MovieCarousel;
