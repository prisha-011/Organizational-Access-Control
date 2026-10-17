import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // 1. Get ID and Token from storage
  const loggedInUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // 2. Fetch the User Details (Just like Dashboard used to do)
  useEffect(() => {
    if (loggedInUserId && token) {
      fetch(`http://localhost:8080/api/byid/${loggedInUserId}`, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      })
      .then(res => {
          if (!res.ok) throw new Error("Failed to fetch user");
          return res.json();
      })
      .then(data => setCurrentUser(data))
      .catch(err => {
          console.error("Failed to load current user", err);
          // Optional: If token is invalid, force logout
          // localStorage.clear();
          // navigate('/login');
      });
    }
  }, [loggedInUserId, token]);

  // 3. Handle Logout function to pass to Sidebar
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* 4. Pass the fetched 'currentUser' to Sidebar */}
      <Sidebar 
        open={open} 
        setOpen={setOpen} 
        active={active} 
        setActive={setActive}
        currentUser={currentUser}
        handleLogout={handleLogout}
      />

      <div className="flex-1 overflow-y-auto p-5 relative">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;