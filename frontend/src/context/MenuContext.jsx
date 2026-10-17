import React, { createContext, useState, useContext } from 'react';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  // 1. Add 'enabled: true' to your initial data
  const [menuItems, setMenuItems] = useState([
    { name: "View Users", url: "/view-users", image: "ClipboardList", order: 1, enabled: true },
    { name: "Add User", url: "/add-user", image: "UserPlus", order: 2, enabled: true }
  ]);

  const addMenuItem = (name, url, image, order) => {
    // New items are enabled by default
    setMenuItems([...menuItems, { name, url, image, order: parseInt(order), enabled: true }]);
  };

  const updateMenuItem = (index, updatedItem) => {
    const newMenus = [...menuItems];
    // Keep the existing 'enabled' status when editing details
    newMenus[index] = { ...updatedItem, order: parseInt(updatedItem.order), enabled: newMenus[index].enabled };
    setMenuItems(newMenus);
  };

  // 2. NEW: Function to Toggle Status (Active <-> Disabled)
  const toggleMenuStatus = (index, status) => {
    const newMenus = [...menuItems];
    newMenus[index].enabled = status; // true = active, false = disabled
    setMenuItems(newMenus);
  };

  // Optional: Permanent delete if needed later
  const removeMenuItem = (index) => {
    const newMenus = menuItems.filter((_, i) => i !== index);
    setMenuItems(newMenus);
  };

  return (
    <MenuContext.Provider value={{ menuItems, addMenuItem, removeMenuItem, updateMenuItem, toggleMenuStatus }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);