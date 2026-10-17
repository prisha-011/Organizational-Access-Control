import React, { useState, useEffect } from "react";
import DashboardHome from "../components/DashboardHome"; 

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // We keep the user fetching logic here because the DashboardHome
  // needs the user count/stats to display the overview cards.
  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/all", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  return (
    <div className="w-full">
      {/* Header for the specific page */}
      <div className="mb-6">
         <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
         <p className="text-gray-500 text-sm mt-1">Here is what's happening today.</p>
      </div>

      {/* We only render DashboardHome here. 
        Sidebar, ViewUsers, and AddUser are now handled by the Router and Layout.
      */}
      {loading ? (
        <div className="p-4 text-gray-500">Loading dashboard stats...</div>
      ) : (
        <DashboardHome users={users} />
      )}
    </div>
  );
}