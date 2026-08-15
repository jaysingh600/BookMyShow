import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { FaUsers, FaTicketAlt, FaRupeeSign, FaFilm, FaChartLine } from 'react-icons/fa';
import { io } from 'socket.io-client';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    
    // Listen for real-time updates
    const socket = io('http://localhost:5000');
    
    socket.on('adminRefresh', () => {
      fetchStats();
    });

    return () => socket.disconnect();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex h-[80vh] items-center justify-center text-gray-500 font-bold">Loading Dashboard...</div>;
  }

  if (!stats) {
    return <div className="flex h-[80vh] items-center justify-center text-red-500 font-bold">Failed to load data.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-black text-dark">Dashboard Overview</h2>
          <p className="text-gray-500 text-sm mt-1">Real-time commercial metrics & analytics</p>
        </div>
        <button onClick={fetchStats} className="bg-white border border-gray-200 text-gray-600 hover:text-primary px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
          Refresh Data
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={<FaUsers />} color="bg-blue-500" />
        <StatCard title="Total Bookings" value={stats.totalBookings} icon={<FaTicketAlt />} color="bg-green-500" />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={<FaRupeeSign />} color="bg-yellow-500" />
        <StatCard title="Active Shows" value={stats.activeShows} icon={<FaFilm />} color="bg-purple-500" />
        <StatCard title="Occupancy Rate" value={stats.occupancyRate} icon={<FaChartLine />} color="bg-red-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-dark mb-6 flex items-center gap-2">
            <FaRupeeSign className="text-primary" /> Revenue Over Time
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-dark mb-6 flex items-center gap-2">
            <FaTicketAlt className="text-primary" /> Weekly Bookings
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.bookingsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <RechartsTooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="bookings" fill="#111827" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} rounded-bl-full opacity-10 transition-transform group-hover:scale-110 z-0`}></div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${color} shadow-lg`}>
        {icon}
      </div>
    </div>
    <div className="relative z-10">
      <h4 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">{title}</h4>
      <p className="text-3xl font-black text-dark">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
