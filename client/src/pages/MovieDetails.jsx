import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FaShareAlt } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';

const mockMovie = {
  id: 1,
  title: 'Inception',
  banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  rating: '9.2',
  votes: '124K',
  format: '2D, 3D, IMAX 3D',
  languages: 'English, Hindi, Tamil, Telugu',
  duration: '2h 28m',
  genre: 'Action, Sci-Fi, Thriller',
  certification: 'UA',
  releaseDate: '16 Jul, 2010',
  about: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
  cast: [
    { name: 'Leonardo DiCaprio', role: 'Cobb', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { name: 'Joseph Gordon-Levitt', role: 'Arthur', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { name: 'Elliot Page', role: 'Ariadne', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { name: 'Tom Hardy', role: 'Eames', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { name: 'Ken Watanabe', role: 'Saito', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  ],
  crew: [
    { name: 'Christopher Nolan', role: 'Director', image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { name: 'Emma Thomas', role: 'Producer', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { name: 'Hans Zimmer', role: 'Music', image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  ]
};

const MovieDetails = () => {
  const { id } = useParams();

  return (
    <div className="bg-grayLight min-h-screen">
      {/* Banner Section */}
      <div className="relative w-full h-[480px] bg-dark text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 md:opacity-100"
          style={{ backgroundImage: `url(${mockMovie.banner})` }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/90 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent md:hidden"></div>
        </div>

        <div className="container mx-auto px-4 h-full relative flex items-center pt-24 md:pt-0">
          <div className="flex flex-col md:flex-row gap-8 items-start w-full">
            
            {/* Poster */}
            <div className="w-full md:w-64 flex-shrink-0 relative hidden md:block">
               <img src={mockMovie.poster} alt={mockMovie.title} className="w-full rounded-xl shadow-2xl" />
            </div>

            {/* Movie Info */}
            <div className="flex flex-col flex-grow z-10">
               <h1 className="text-3xl md:text-5xl font-bold mb-4">{mockMovie.title}</h1>
               
               <div className="flex items-center space-x-2 bg-gray-800/80 p-4 rounded-xl w-full max-w-sm mb-4">
                  <span className="text-red-500 text-xl font-bold">★ {mockMovie.rating}</span>
                  <div className="flex flex-col">
                     <span className="font-semibold text-sm">{mockMovie.votes} Votes</span>
                  </div>
                  <button className="ml-auto bg-white text-dark px-3 py-1 rounded text-sm font-semibold hover:bg-gray-200 transition">Rate now</button>
               </div>

               <div className="flex flex-wrap gap-2 mb-4">
                 <span className="bg-white text-dark px-2 py-0.5 rounded text-sm font-semibold">{mockMovie.format}</span>
                 <span className="bg-white text-dark px-2 py-0.5 rounded text-sm font-semibold">{mockMovie.languages}</span>
               </div>

               <div className="text-sm font-medium mb-8 text-gray-200">
                 {mockMovie.duration} • {mockMovie.genre} • {mockMovie.certification} • {mockMovie.releaseDate}
               </div>

               <Link to={`/buytickets/${id}`} className="w-full md:w-64 bg-primary hover:bg-red-600 text-white text-center text-lg font-semibold py-3 rounded-lg shadow-lg transition-colors">
                  Book Tickets
               </Link>
            </div>
            
            {/* Share Button (Desktop) */}
            <div className="hidden md:flex absolute top-10 right-4 bg-gray-800/60 px-4 py-2 rounded flex items-center hover:bg-gray-700 cursor-pointer transition">
               <FaShareAlt size={16} />
               <span className="ml-2 font-medium">Share</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="w-full md:w-2/3">
           {/* About */}
           <h2 className="text-2xl font-bold text-dark mb-4">About the movie</h2>
           <p className="text-gray-700 mb-8 leading-relaxed">{mockMovie.about}</p>

           <hr className="border-gray-300 mb-8" />

           {/* Cast */}
           <h2 className="text-2xl font-bold text-dark mb-6">Cast</h2>
           <Swiper
             modules={[Navigation]}
             spaceBetween={15}
             slidesPerView={3}
             breakpoints={{
               640: { slidesPerView: 4 },
               768: { slidesPerView: 5 },
               1024: { slidesPerView: 6 },
             }}
             className="mb-8"
           >
             {mockMovie.cast.map((person, index) => (
               <SwiperSlide key={index}>
                 <div className="flex flex-col items-center text-center group cursor-pointer">
                    <img src={person.image} alt={person.name} className="w-24 h-24 rounded-full object-cover mb-2 shadow-sm group-hover:shadow-md transition-shadow" />
                    <h3 className="font-medium text-dark text-sm leading-tight">{person.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{person.role}</p>
                 </div>
               </SwiperSlide>
             ))}
           </Swiper>

           <hr className="border-gray-300 mb-8" />

           {/* Crew */}
           <h2 className="text-2xl font-bold text-dark mb-6">Crew</h2>
           <Swiper
             modules={[Navigation]}
             spaceBetween={15}
             slidesPerView={3}
             breakpoints={{
               640: { slidesPerView: 4 },
               768: { slidesPerView: 5 },
               1024: { slidesPerView: 6 },
             }}
           >
             {mockMovie.crew.map((person, index) => (
               <SwiperSlide key={index}>
                 <div className="flex flex-col items-center text-center group cursor-pointer">
                    <img src={person.image} alt={person.name} className="w-24 h-24 rounded-full object-cover mb-2 shadow-sm group-hover:shadow-md transition-shadow" />
                    <h3 className="font-medium text-dark text-sm leading-tight">{person.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{person.role}</p>
                 </div>
               </SwiperSlide>
             ))}
           </Swiper>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
