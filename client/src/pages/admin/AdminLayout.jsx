import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className="block px-4 py-2 rounded hover:bg-gray-700">
            Dashboard
          </Link>
          <Link to="/admin/cities" className="block px-4 py-2 rounded hover:bg-gray-700">
            Manage Cities
          </Link>
          <Link to="/admin/theatres" className="block px-4 py-2 rounded hover:bg-gray-700">
            Manage Theatres
          </Link>
          <Link to="/admin/auditoriums" className="block px-4 py-2 rounded hover:bg-gray-700">
            Manage Auditoriums
          </Link>
          <Link to="/admin/movies" className="block px-4 py-2 rounded hover:bg-gray-700">
            Manage Movies
          </Link>
          <Link to="/admin/shows" className="block px-4 py-2 rounded hover:bg-gray-700">
            Manage Shows
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
