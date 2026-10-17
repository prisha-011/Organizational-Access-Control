import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword"; 
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import MenuManagement from "./pages/MenuManagement";
import ViewUsers from "./pages/ViewUsers";
import UserProfile from "./pages/UserProfile";
// Note: Ensure this imports the correct file (AddUser.jsx or AddUser2.jsx depending on which one you are using)
import AddUser from "./pages/AddUser"; 
import { MenuProvider } from "./context/MenuContext"; 
import Layout from "./components/Layout";

// 1. IMPORT TOASTIFY CSS & CONTAINER
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const loggedInUserId = localStorage.getItem("userId");

  return (
    <MenuProvider>
      {/* 2. ADD THE CONTAINER HERE (Top right is standard) */}
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/menus" element={<MenuManagement />} />
          <Route path="/view-users" element={<ViewUsers />} />
          <Route path="/profile" element={<UserProfile userId={loggedInUserId} />} />
          
          {/* Ensure this route points to the file you just updated (AddUser2) */}
          <Route path="/add-user" element={<AddUser />} /> 
        </Route>
        
      </Routes>
    </MenuProvider>
  );
}

export default App;