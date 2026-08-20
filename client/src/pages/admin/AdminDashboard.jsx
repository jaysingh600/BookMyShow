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
    return <div className="flex h-[80vh] items-center justify-center text-slate-400 font-bold">Loading Dashboard...</div>;
  }

  if (!stats) {
    return <div className="flex h-[80vh] items-center justify-center text-red-500 font-bold">Failed to load data.</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Dashboard Overview</h2>
          <p className="text-slate-400 text-sm mt-1 tracking-wide">Real-time commercial metrics & analytics</p>
        </div>
        <button onClick={fetchStats} className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700 hover:border-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all duration-300 flex items-center gap-2 group">
          <FaChartLine className="group-hover:text-primary transition-colors" /> Refresh Data
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={<FaUsers />} colorFrom="from-blue-600" colorTo="to-blue-400" />
        <StatCard title="Total Bookings" value={stats.totalBookings} icon={<FaTicketAlt />} colorFrom="from-emerald-600" colorTo="to-emerald-400" />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={<FaRupeeSign />} colorFrom="from-amber-600" colorTo="to-amber-400" />
        <StatCard title="Active Shows" value={stats.activeShows} icon={<FaFilm />} colorFrom="from-purple-600" colorTo="to-purple-400" />
        <StatCard title="Occupancy Rate" value={stats.occupancyRate} icon={<FaChartLine />} colorFrom="from-red-600" colorTo="to-red-400" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        {/* Revenue Chart */}
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-slate-700/50 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg"><FaRupeeSign className="text-primary" /></div> 
            Revenue Over Time
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(51, 65, 85, 0.5)', backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', color: '#fff' }} itemStyle={{ color: '#ef4444' }} />
                <Area type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Chart */}
        <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-slate-700/50 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg"><FaTicketAlt className="text-blue-500" /></div> 
            Weekly Bookings
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.bookingsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <RechartsTooltip cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} contentStyle={{ borderRadius: '12px', border: '1px solid rgba(51, 65, 85, 0.5)', backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', color: '#fff' }} itemStyle={{ color: '#3b82f6' }} />
                <Bar dataKey="bookings" fill="url(#colorBookings)" radius={[6, 6, 0, 0]} barSize={40}>
                   <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, colorFrom, colorTo }) => (
  <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-slate-700/50 flex flex-col justify-between hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
    <div className={`absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br ${colorFrom} ${colorTo} rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500`}></div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${colorFrom} ${colorTo} shadow-lg shadow-black/20 text-xl`}>
        {icon}
      </div>
    </div>
    <div className="relative z-10">
      <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{title}</h4>
      <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
