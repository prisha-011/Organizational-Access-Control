import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import * as LucideIcons from "lucide-react";

export default function Sidebar({ open, setOpen, active, setActive, currentUser, handleLogout }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [visibleMenuItems, setVisibleMenuItems] = useState([]);

  // 1. MASTER LIST OF MENUS
  const MASTER_MENU_LIST = [
    { name: "Dashboard", url: "/dashboard", icon: "LayoutDashboard" },
    { name: "View Users", url: "/view-users", icon: "Users" }, 
    // "Add User" removed from here as requested
    { name: "Menu Management", url: "/menus", icon: "Settings" },
  ];

  useEffect(() => {
    if (!currentUser) return;

    if (currentUser.role === 'SUPER_ADMIN') {
        setVisibleMenuItems(MASTER_MENU_LIST);
    } else {
        // Safe check for property names
        const allowedMenuNames = currentUser.menus ? currentUser.menus.map(m => {
            const val = m.menuName || m.name || m.title || m.menu_name || m.label;
            return val ? val.trim().toLowerCase() : ""; 
        }) : [];

        const filtered = MASTER_MENU_LIST.filter(item => {
            const masterName = item.name.toLowerCase();
            return allowedMenuNames.includes(masterName);
        });

        setVisibleMenuItems(filtered);
    }
  }, [currentUser]);

  // Helper function to render icon
  const renderIcon = (iconName, fallbackLabel) => {
    const IconComponent = LucideIcons[iconName];
    if (IconComponent) return <IconComponent size={20} />;
    
    if (iconName && (iconName.startsWith("http") || iconName.startsWith("/"))) {
        return <img src={iconName} alt="icon" className="w-full h-full object-cover rounded" />;
    }
    return iconName || fallbackLabel.charAt(0);
  };

  const navItem = (key, label, iconChar, isUrl = false) => (
    <button
      onClick={() => {
        setActive(key);
        if (isUrl) navigate(key);
      }}
      className={`
        w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
        ${active === key ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200" : "hover:bg-gray-50 text-gray-600"}
      `}
      title={!open ? label : ""}
    >
      <div className={`
        min-w-[24px] w-6 h-6 flex items-center justify-center font-bold rounded text-xs transition-colors
        ${active === key ? "bg-blue-200 text-blue-700" : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"}
      `}>
          {renderIcon(iconChar, label)}
      </div>
      
      <span className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${open ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
        {label}
      </span>
    </button>
  );

  return (
    <aside className={`h-screen sticky top-0 bg-white border-r border-gray-200 shadow-xl z-20 flex flex-col transition-all duration-300 ${open ? "w-72" : "w-20"}`}>
        {/* Header */}
        <div className="p-4 flex justify-end border-b border-gray-50 h-16 items-center">
             <button onClick={() => setOpen(!open)} className="p-2 rounded-md hover:bg-gray-100 text-gray-500 transition-colors">
                {open ? "⇤" : "⇥"}
            </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-2 mt-4 overflow-x-hidden">
            
            {visibleMenuItems.length > 0 ? (
                visibleMenuItems.map((item, index) => (
                    <div key={index}>
                        {navItem(item.url, item.name, item.icon, true)} 
                    </div>
                ))
            ) : (
                 <div className="p-4 text-xs text-gray-400 text-center border border-dashed border-gray-300 rounded m-2">
                     No menus assigned.
                 </div>
            )}

        </nav>

        {/* Footer (User Profile) */}
        <div className="relative border-t border-gray-100 p-2">
            {showMenu && (
                <div className="absolute bottom-full left-2 right-2 mb-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in z-50">
                    <button 
                        onClick={() => { setActive("profile"); setShowMenu(false); navigate('/profile'); }} 
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                        <LucideIcons.User size={16} /> Edit User Profile
                    </button>
                    <div className="border-t border-gray-100"></div>
                    <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                        <LucideIcons.LogOut size={16} /> Logout
                    </button>
                </div>
            )}

            <button 
                onClick={() => setShowMenu(!showMenu)} 
                className={`w-full p-2 rounded-lg text-left transition-colors group focus:outline-none ${showMenu ? "bg-gray-100" : "hover:bg-gray-50"}`}
            >
                <div className={`flex items-center gap-3 transition-all duration-300 ${!open ? "justify-center" : ""}`}>
                    <div className="min-w-[2.5rem] w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md group-hover:ring-2 ring-purple-200">
                        {currentUser ? (currentUser.firstName.charAt(0) + currentUser.lastName.charAt(0)).toUpperCase() : "PD"}
                    </div>
                    
                    <div className={`flex flex-col overflow-hidden transition-all duration-300 ${open ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
                        <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                            {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Loading..."}
                        </span>
                        <span className={`text-xs font-medium whitespace-nowrap ${currentUser?.role === 'SUPER_ADMIN' ? 'text-purple-600' : 'text-blue-600'}`}>
                            {currentUser?.role || "User"}
                        </span>
                    </div>

                    <div className={`ml-auto text-gray-400 group-hover:text-blue-600 transition-colors ${open ? "opacity-100" : "opacity-0 hidden"}`}>
                        {showMenu ? <LucideIcons.ChevronDown size={16} /> : <LucideIcons.ChevronUp size={16} />}
                    </div>
                </div>
            </button>
        </div>
    </aside>
  );
}