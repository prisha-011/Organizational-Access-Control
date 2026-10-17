import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react"; 

export default function MapMenuModal({ user, onClose, onSave }) {
  const [availableMenus, setAvailableMenus] = useState([]); 
  const [selectedMenuIds, setSelectedMenuIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}` };

      try {
        // 1. Get ALL menus
        const allMenusRes = await fetch("http://localhost:8080/api/menus", { headers });
        if (allMenusRes.ok) {
            const allMenusData = await allMenusRes.json();
            setAvailableMenus(allMenusData);
        }

        // 2. Get USER'S existing menus
        const userMenusRes = await fetch(`http://localhost:8080/api/users/${user.id}/menus`, { headers });
        if (userMenusRes.ok) {
            const userMenusData = await userMenusRes.json();
            const existingIds = userMenusData.map(menu => menu.id);
            setSelectedMenuIds(existingIds);
        }

      } catch (error) {
        console.error("Error fetching menu data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleToggle = (menuId) => {
    setSelectedMenuIds(prev => {
      if (prev.includes(menuId)) return prev.filter(id => id !== menuId);
      return [...prev, menuId];
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <LucideIcons.X size={20} />
        </button>

        <h3 className="text-xl font-bold text-gray-800 mb-1">Map Menus</h3>
        <p className="text-sm text-gray-500 mb-6">
          Assign access for <span className="text-blue-600 font-medium">{user.firstName} {user.lastName}</span>
        </p>

        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading data...</div>
        ) : (
          <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
            
            {availableMenus.length === 0 && (
                <div className="text-center p-4 bg-yellow-50 text-yellow-700 rounded-lg text-sm">
                   ⚠ No menus found in database. <br/> Did you run the SQL INSERT?
                </div>
            )}

            {availableMenus.map(menu => (
              <label 
                key={menu.id} 
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                  ${selectedMenuIds.includes(menu.id) ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
              >
                <input 
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  checked={selectedMenuIds.includes(menu.id)}
                  onChange={() => handleToggle(menu.id)}
                />
                <div>
                  {/* UPDATED: Checks all possible database column names */}
                  <div className="font-medium text-gray-700">
                    {menu.menuName || menu.name || "Untitled"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {menu.menuUrl || menu.url || menu.path || "No path"}
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">
            Cancel
          </button>
          <button onClick={() => onSave(user.id, selectedMenuIds)} className="px-4 py-2 bg-blue-800 text-white font-medium rounded-lg hover:bg-blue-900 shadow-sm">
            Save Mapping
          </button>
        </div>

      </div>
    </div>
  );
}