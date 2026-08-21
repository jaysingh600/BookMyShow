import React from 'react';
import { Link, Outlet } from 'react-router-dom';

import { 
  FaChartPie, FaCity, FaBuilding, FaVideo, FaFilm, FaCalendarAlt, FaSignOutAlt 
} from 'react-icons/fa';

const AdminLayout = () => {
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <FaChartPie /> },
    { name: 'Manage Cities', path: '/admin/cities', icon: <FaCity /> },
    { name: 'Manage Theatres', path: '/admin/theatres', icon: <FaBuilding /> },
    { name: 'Manage Auditoriums', path: '/admin/auditoriums', icon: <FaVideo /> },
    { name: 'Manage Movies', path: '/admin/movies', icon: <FaFilm /> },
    { name: 'Manage Shows', path: '/admin/shows', icon: <FaCalendarAlt /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-gray-800">
      
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]"></div>
      </div>

      {/* Sidebar - Glassmorphic */}
      <aside className="w-72 relative z-10 flex flex-col bg-white/60 backdrop-blur-xl border-r border-gray-200 shadow-xl">
        <div className="p-8 flex items-center gap-3 border-b border-gray-200">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-red-700 flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-xl font-black text-white">CR</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-wider">CineReserve</h1>
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Admin Portal</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar py-6 px-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-4">Menu</p>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-600 hover:text-primary hover:bg-red-50 transition-all duration-300 group relative"
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary rounded-r-full transition-all duration-300 group-hover:h-8"></div>
                <span className="text-lg group-hover:text-primary transition-colors">{item.icon}</span>
                <span className="font-semibold text-sm">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-gray-200">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 border border-transparent transition-all duration-300 group">
            <FaSignOutAlt className="text-red-500 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-sm">Exit Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
