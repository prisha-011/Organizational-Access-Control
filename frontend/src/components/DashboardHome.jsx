import React from "react";

export default function DashboardHome({ users, onNavigate }) {
  // --- 1. Get Current User ID ---
  const loggedInUserId = localStorage.getItem("userId") ? parseInt(localStorage.getItem("userId")) : null;

  // --- 2. Filter Logic (Same as ViewUsers) ---
  // Exclude the logged-in user from ALL stats
  const relevantUsers = users.filter(u => u.id !== loggedInUserId);

  const totalUsers = relevantUsers.length;
  
  // Use REAL 'enabled' property, not ID math
  const activeUsers = relevantUsers.filter(u => u.enabled).length;
  const inactiveUsers = totalUsers - activeUsers;

  const StatCard = ({ title, count, color, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm text-gray-500 mb-1 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{count}</h3>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${color}`}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm">Welcome back, Admin. Here is what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" count={totalUsers} color="bg-blue-50 text-blue-600" icon="👥" />
        <StatCard title="Active Users" count={activeUsers} color="bg-green-50 text-green-600" icon="🟢" />
        <StatCard title="Inactive/Disabled" count={inactiveUsers} color="bg-red-50 text-red-600" icon="🔴" />
        <StatCard title="Server Status" count="Online" color="bg-emerald-50 text-emerald-600" icon="⚡" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">📝</div>
                <div>
                  <p className="font-medium text-gray-900">User Details Updated</p>
                  <p className="text-gray-400 text-xs">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => onNavigate("add")}
              className="w-full p-3 text-left rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
            >
              <span className="text-lg">➕</span> Add New User
            </button>
            <button 
               onClick={() => onNavigate("view")}
               className="w-full p-3 text-left rounded-lg bg-purple-50 text-purple-700 font-medium hover:bg-purple-100 transition-colors flex items-center gap-2"
            >
              <span className="text-lg">📋</span> Manage All Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}