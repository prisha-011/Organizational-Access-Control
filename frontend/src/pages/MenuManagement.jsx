import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import * as LucideIcons from "lucide-react";
import DeleteModal from '../components/DeleteModal'; // Import your existing modal

export default function MenuManagement() {
  const { menuItems, addMenuItem, updateMenuItem, toggleMenuStatus } = useMenu();
  
  // Tab State
  const [activeTab, setActiveTab] = useState("active");

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null); 
  
  // Confirmation Modal States (for Delete/Restore)
  const [itemToDisable, setItemToDisable] = useState(null);
  const [itemToRestore, setItemToRestore] = useState(null);

  const [formData, setFormData] = useState({ name: "", url: "", image: "", order: "" });

  // Filter & Sort Logic
  // We attach 'originalIndex' so we know which item to update in the main array
  const filteredMenus = menuItems
    .map((item, index) => ({ ...item, originalIndex: index }))
    .filter(item => activeTab === "active" ? item.enabled : !item.enabled)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // --- ACTIONS ---

  const handleOpenAdd = () => {
    setEditIndex(null);
    setFormData({ name: "", url: "", image: "", order: "" });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (originalIndex, item) => {
    setEditIndex(originalIndex);
    setFormData({ 
        name: item.name, 
        url: item.url, 
        image: item.image || "", 
        order: item.order || "" 
    });
    setIsFormModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      updateMenuItem(editIndex, formData);
    } else {
      addMenuItem(formData.name, formData.url, formData.image, formData.order);
    }
    setIsFormModalOpen(false);
  };

  // --- CONFIRMATION HANDLERS ---

  const confirmDisable = () => {
    if (itemToDisable) {
      toggleMenuStatus(itemToDisable.originalIndex, false); // Disable it
      setItemToDisable(null);
    }
  };

  const confirmRestore = () => {
    if (itemToRestore) {
      toggleMenuStatus(itemToRestore.originalIndex, true); // Enable it
      setItemToRestore(null);
    }
  };

  // --- HELPER: Render Icon ---
  const renderIcon = (iconName) => {
    if (!iconName) return "🔗";
    // Convert kebab-case to PascalCase just in case (e.g. user-plus -> UserPlus)
    const formattedName = iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    const IconComponent = LucideIcons[iconName] || LucideIcons[formattedName];
    
    if (IconComponent) return <IconComponent size={20} />;
    if (iconName.startsWith("http") || iconName.startsWith("/")) return <img src={iconName} alt="icon" className="w-full h-full object-cover" />;
    return iconName;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Menu Management</h2>
            <p className="text-gray-500 text-sm mt-1">Configure sidebar navigation items.</p>
        </div>
        <div>
             <button 
               onClick={handleOpenAdd}
               className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm flex items-center gap-2 transition-all"
             >
               <span>➕</span> Add New Menu
             </button>
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
            <button 
                onClick={() => setActiveTab("active")}
                className={`pb-3 text-sm font-medium transition-all relative ${activeTab === "active" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
                Active Menus ({menuItems.filter(m => m.enabled).length})
                {activeTab === "active" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-md"></span>}
            </button>
            <button 
                onClick={() => setActiveTab("inactive")}
                className={`pb-3 text-sm font-medium transition-all relative ${activeTab === "inactive" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
                Trash / Disabled ({menuItems.filter(m => !m.enabled).length})
                {activeTab === "inactive" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-md"></span>}
            </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Icon</th>
                <th className="px-6 py-4">Menu Name</th>
                <th className="px-6 py-4">URL Path</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredMenus.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                            <span className="text-4xl mb-2">{activeTab === "active" ? "📂" : "🗑️"}</span>
                            <p>No {activeTab} menus found.</p>
                        </div>
                    </td>
                 </tr>
              ) : (
                  filteredMenus.map((item) => (
                        <tr key={item.originalIndex} className={`transition-colors ${activeTab === "active" ? "hover:bg-gray-50/80" : "bg-gray-50 opacity-70"}`}>
                            <td className="px-6 py-4 text-gray-600 font-medium">#{item.order}</td>
                            <td className="px-6 py-4">
                                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-gray-600">
                                    {renderIcon(item.image)}
                                </div>
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-800">{item.name}</td>
                            <td className="px-6 py-4 text-sm text-blue-500 font-mono">{item.url}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    
                                    {/* Action Buttons based on Tab */}
                                    {activeTab === "active" ? (
                                        <>
                                            <button 
                                                onClick={() => handleOpenEdit(item.originalIndex, item)}
                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Menu"
                                            >
                                                <LucideIcons.Pencil size={18} />
                                            </button>
                                            <button 
                                                onClick={() => setItemToDisable(item)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Disable / Move to Trash"
                                            >
                                                <LucideIcons.Trash2 size={18} />
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={() => setItemToRestore(item)}
                                            className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-1"
                                            title="Restore Menu"
                                        >
                                            <LucideIcons.RefreshCw size={18} />
                                        </button>
                                    )}

                                </div>
                            </td>
                        </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD/EDIT FORM MODAL --- */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 m-4 relative">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
                {editIndex !== null ? "Update Menu Item" : "Add New Menu Item"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                        <input type="number" required className="w-full p-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500" placeholder="1" value={formData.order} onChange={(e) => setFormData({...formData, order: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name</label>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500" placeholder="UserPlus" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Menu Name</label>
                    <input type="text" required className="w-full p-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500" placeholder="Menu Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Path</label>
                    <input type="text" required className="w-full p-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500" placeholder="/path" value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} />
                </div>
                <div className="modal-action flex justify-end gap-3 mt-6">
                    <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium shadow-md">Save</button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CONFIRMATION MODALS (Using your existing component) --- */}
      
      {itemToDisable && (
        <DeleteModal 
            user={itemToDisable} // Just passing the object so the modal renders the 'firstName' logic if it exists, otherwise it falls back to message
            title="Disable Menu Item"
            message={`Are you sure you want to disable "${itemToDisable.name}"? It will be moved to the Trash tab.`}
            confirmText="Disable"
            confirmColor="bg-red-600 hover:bg-red-700"
            onClose={() => setItemToDisable(null)} 
            onConfirm={confirmDisable} 
        />
      )}

      {itemToRestore && (
        <DeleteModal 
            user={itemToRestore} 
            title="Restore Menu Item"
            message={`Do you want to restore "${itemToRestore.name}" back to the active menu?`}
            confirmText="Restore"
            confirmColor="bg-green-600 hover:bg-green-700"
            onClose={() => setItemToRestore(null)} 
            onConfirm={confirmRestore} 
        />
      )}

    </div>
  );
}