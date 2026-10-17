import React, { useState, useEffect } from "react";
import DeleteModal from "../components/DeleteModal";
import AddUser2 from "./AddUser2";
import { useNavigate } from "react-router-dom"; 
import MapMenuModal from "../components/MapMenuModal"; 
import * as LucideIcons from "lucide-react"; 
import { toast } from "react-toastify";

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState(""); 

  const [activeTab, setActiveTab] = useState("active");
  const [toDisable, setToDisable] = useState(null); 
  const [toRestore, setToRestore] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mappingUser, setMappingUser] = useState(null);
  const [toHardDelete, setToHardDelete] = useState(null); // Added missing state for hard delete

  const navigate = useNavigate();

  const loggedInUserId = localStorage.getItem("userId") ? parseInt(localStorage.getItem("userId")) : null;
  const token = localStorage.getItem("token");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/all", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      
      const me = data.find(u => u.id === loggedInUserId);
      if (me) setCurrentUserRole(me.role);

      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const saveMenuMapping = async (userId, menuIds) => {
    try {
        const res = await fetch(`http://localhost:8080/api/users/${userId}/menus`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(menuIds)
        });

        if (!res.ok) throw new Error("Failed to map menus");
        
        toast.success("Menus mapped successfully!");
        setMappingUser(null); 
        loadUsers(); 
    } catch (error) {
        console.error("Mapping error:", error);
        toast.error("Failed to save menu mapping.");
    }
  };

  // CHECK SUPER ADMIN PRIVILEGE
  const isSuperAdmin = currentUserRole === "SUPER_ADMIN";

  const filteredUsers = users.filter(u => {
    const matchesTab = activeTab === "active" ? u.enabled : !u.enabled;
    // Super Admin sees everyone; Users see everyone BUT themselves (so they can't delete themselves)
    const matchesSelfView = isSuperAdmin ? true : u.id !== loggedInUserId;
    return matchesTab && matchesSelfView;
  });

  const onEdit = (id) => {
    const userToUpdate = users.find(item => item.id === id);
    setSelectedUser(userToUpdate || null);
  }

  const performDisable = async () => {
    if (!toDisable) return;
    try {
      const res = await fetch(`http://localhost:8080/api/${toDisable.id}/disable`, { 
          method: "PUT",
          headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Disable failed");
      setUsers(currentUsers => currentUsers.map(u => u.id === toDisable.id ? { ...u, enabled: false } : u));
      setToDisable(null);
      toast.success("User disabled successfully");
    } catch (err) { console.error(err); toast.error("Failed to disable user"); }
  };

  const performRestore = async () => {
    if (!toRestore) return;
    try {
        const res = await fetch(`http://localhost:8080/api/enable?id=${toRestore.id}`, { 
            method: "PUT",
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Enable failed");
        setUsers(currentUsers => currentUsers.map(u => u.id === toRestore.id ? { ...u, enabled: true } : u));
        setToRestore(null);
        toast.success("User restored successfully");
    } catch (err) { console.error(err); toast.error("Failed to restore user"); }
  };
  
  const performHardDelete = async () => {
    if (!toHardDelete) return;
    try {
      const res = await fetch(`http://localhost:8080/api/delete/${toHardDelete.id}`, { 
          method: "DELETE",
          headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Delete failed");
      setUsers(currentUsers => currentUsers.filter(u => u.id !== toHardDelete.id));
      setToHardDelete(null);
      toast.success("User permanently deleted");
    } catch (err) { toast.error("Failed to delete user."); }
  };

  const getInitials = (firstName, lastName) => `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  const getAvatarColor = (id) => {
    const colors = ["bg-red-100 text-red-600", "bg-orange-100 text-orange-600", "bg-blue-100 text-blue-600", "bg-purple-100 text-purple-600"];
    return colors[id % colors.length] || colors[0];
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading users...</div>;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                {selectedUser ? "Update User Details" : "Team Members"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
                {selectedUser ? `Editing user ID: ${selectedUser.id}` : "Manage permissions and view user details."}
            </p>
        </div>
        <div>
             {/* RESTRICTION 1: Only Super Admin can Add New Users */}
             {!selectedUser && isSuperAdmin && (
                 <button 
                   onClick={() => navigate('/add-user')} 
                   className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm flex items-center gap-2 transition-all"
                 >
                   <span>➕</span> Add New User
                 </button>
             )}
        </div>
      </div>

      {/* TABS */}
      {!selectedUser && (
          <div className="border-b border-gray-200">
            <div className="flex gap-6">
                <button 
                    onClick={() => setActiveTab("active")}
                    className={`pb-3 text-sm font-medium transition-all relative ${activeTab === "active" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                    Active Users
                    {activeTab === "active" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-md"></span>}
                </button>
                <button 
                    onClick={() => setActiveTab("inactive")}
                    className={`pb-3 text-sm font-medium transition-all relative ${activeTab === "inactive" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                    Inactive / Disabled
                    {activeTab === "inactive" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-md"></span>}
                </button>
            </div>
          </div>
      )}

      {/* Table Card */}
      {!selectedUser && (<div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              
              {filteredUsers.map((u) => (
                <tr key={u.id} className={`transition-colors group ${u.enabled ? "hover:bg-gray-50/80" : "bg-gray-50 opacity-70"}`}>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${u.enabled ? getAvatarColor(u.id) : "bg-gray-200 text-gray-500"}`}>
                        {getInitials(u.firstName, u.lastName)}
                      </div>
                      <div>
                        <div className={`font-semibold ${u.enabled ? "text-gray-900" : "text-gray-500"}`}>
                            {u.firstName} {u.lastName}
                            {u.id === loggedInUserId && <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full border border-blue-200">YOU</span>}
                            {u.role === 'SUPER_ADMIN' && <span className="ml-1 text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full border border-purple-200">ADMIN</span>}
                        </div>
                        <div className="text-xs text-gray-400">@{u.userName}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm text-gray-600">{u.email}</div>
                      <div className="text-sm text-gray-500">{u.mobileNo || "N/A"}</div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${u.enabled ? "bg-green-50 text-green-700 border-green-100" : "bg-gray-200 text-gray-600 border-gray-300"}`}>
                        {u.enabled ? "Active" : "Offline"}
                      </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 transition-opacity duration-200">
                      
                      {u.enabled && (
                        <>
                            {/* Menu Count Badge (Visible to all, purely informational) */}
                            <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 border border-gray-200 mr-2" title="Mapped Menus">
                                <LucideIcons.Eye size={14} className="text-gray-400" />
                                <span>{u.menus ? u.menus.length : 0}</span>
                            </div>

                            {/* RESTRICTION 2: Only Super Admin can Map Menus */}
                            {isSuperAdmin && (
                                <button 
                                    onClick={() => setMappingUser(u)}
                                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                    title="Map Menus"
                                >
                                    <LucideIcons.Network size={20} />
                                </button>
                            )}

                            {/* RESTRICTION 3: Only Super Admin can Edit Users */}
                            {isSuperAdmin && (
                                <button 
                                    onClick={() => onEdit(u.id)} 
                                    className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 opacity-40 group-hover:opacity-100 transition-colors"
                                    title="Edit User"
                                >
                                    <LucideIcons.Edit size={20} />
                                </button>
                            )}
                        </>
                      )}

                      {/* RESTRICTION 4: Disable/Restore Actions */}
                      {isSuperAdmin && (
                          u.enabled ? (
                              <button 
                                onClick={() => setToDisable(u)} 
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-40 group-hover:opacity-100"
                                title="Disable User"
                              >
                                <LucideIcons.Ban size={20} />
                              </button>
                          ) : (
                              <>
                                <button 
                                    onClick={() => setToRestore(u)} 
                                    className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Restore User"
                                >
                                    <LucideIcons.RefreshCw size={20} />
                                </button>
                                <button onClick={() => setToHardDelete(u)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ml-2">
                                   <LucideIcons.Trash2 size={20} />
                                </button>
                              </>
                          )
                      )}

                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                            <span className="text-4xl mb-2">{activeTab === "active" ? "👥" : "🗑️"}</span>
                            <p>No {activeTab} users found.</p>
                        </div>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>)}
      
      {/* --- MODALS --- */}

      {mappingUser && (
        <MapMenuModal 
            user={mappingUser}
            onClose={() => setMappingUser(null)}
            onSave={saveMenuMapping}
        />
      )}
      
      {toDisable && (
        <DeleteModal 
            user={toDisable} 
            title="Disable User Account"
            message={`Are you sure you want to disable ${toDisable.firstName} ${toDisable.lastName}?`}
            confirmText="Disable User"
            confirmColor="bg-red-600 hover:bg-red-700"
            onClose={() => setToDisable(null)} 
            onConfirm={performDisable} 
        />
      )}

      {toRestore && (
        <DeleteModal 
            user={toRestore} 
            title="Restore User Account"
            message={`Do you want to reactivate ${toRestore.firstName} ${toRestore.lastName}?`}
            confirmText="Restore User"
            confirmColor="bg-green-600 hover:bg-green-700"
            onClose={() => setToRestore(null)} 
            onConfirm={performRestore} 
        />
      )}

      {toHardDelete && (
        <DeleteModal 
            user={toHardDelete} 
            title="Permanent Delete" 
            message={`Permanently delete ${toHardDelete.firstName}?`} 
            confirmText="Delete" 
            confirmColor="bg-red-600" 
            onClose={() => setToHardDelete(null)} 
            onConfirm={performHardDelete} 
        />
      )}
      
      {selectedUser && (
        <AddUser2 
            user={selectedUser} 
            onCancel={() => setSelectedUser(null)} 
            onSuccess={() => { loadUsers(); setSelectedUser(null); }} 
        />
      )}
    </div>
  );
}